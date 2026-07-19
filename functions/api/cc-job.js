// Async ConvertAPI proxy. Splitting start (POST) from poll (GET) keeps every
// request short, so a slow multi-page conversion can't exceed Cloudflare's
// request limit and 502 — the old synchronous "wait for the whole conversion"
// design is what caused that. The client (lib/ccConvert.ts) drives one hop at a
// time and polls; this worker never holds a connection open while ConvertAPI works.
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

const BASE = 'https://v2.convertapi.com';

// POST: start one hop. First hop sends the file; later hops send the prior
// result URL. Returns { jobId } immediately (Async=true), no long wait.
export async function onRequestPost({ request, env }) {
  const secret = env.CONVERTAPI_SECRET;
  if (!secret) return json({ error: 'Conversion service is not configured.' }, 500);

  let form;
  try { form = await request.formData(); } catch { return json({ error: 'Bad request.' }, 400); }

  const from = String(form.get('from') || '').toLowerCase();
  const to = String(form.get('to') || '').toLowerCase();
  if (!from || !to) return json({ error: 'Missing conversion formats.' }, 400);

  const file = form.get('file');
  const url = form.get('url');
  if ((!file || typeof file === 'string') && !url) return json({ error: 'No input provided.' }, 400);

  try {
    const upstream = new FormData();
    upstream.append('StoreFile', 'true'); // so the result is fetchable by URL
    if (file && typeof file !== 'string') upstream.append('File', file, file.name || `input.${from}`);
    else upstream.append('Url', String(url)); // chained hop: convert from the prior result URL

    const res = await fetch(`${BASE}/convert/${from}/to/${to}?Async=true`, {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
      body: upstream,
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Conversion failed (${from}→${to}): ${msg.slice(0, 200)}`);
    }
    const data = await res.json();
    const jobId = data?.JobId || data?.jobId;
    if (!jobId) throw new Error('No job id returned by the conversion service.');
    return json({ jobId });
  } catch (e) {
    return json({ error: e.message || 'Conversion failed.' }, 502);
  }
}

// GET ?jobId=…: poll one job. 202 = still processing; 200 with Files = done.
export async function onRequestGet({ request, env }) {
  const secret = env.CONVERTAPI_SECRET;
  if (!secret) return json({ error: 'Conversion service is not configured.' }, 500);

  const jobId = new URL(request.url).searchParams.get('jobId');
  if (!jobId) return json({ error: 'Missing jobId.' }, 400);

  try {
    const res = await fetch(`${BASE}/async/jobs/${encodeURIComponent(jobId)}`, {
      headers: { authorization: `Bearer ${secret}` },
    });
    if (res.status === 202) return json({ done: false }); // still processing
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Conversion failed: ${msg.slice(0, 200)}`);
    }
    const data = await res.json();
    const out = data?.Files?.[0];
    if (out?.Url) return json({ done: true, url: out.Url, filename: out.FileName });
    return json({ done: false }); // 200 but result not ready yet — keep polling
  } catch (e) {
    return json({ error: e.message || 'Conversion failed.' }, 502);
  }
}
