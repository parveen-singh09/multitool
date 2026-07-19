// Async ConvertAPI proxy. Splitting start (POST) from poll (GET) keeps every
// request short, so a slow multi-page conversion can't exceed Cloudflare's
// request limit and 502 — the old synchronous "wait for the whole conversion"
// design is what caused that. The client (lib/ccConvert.ts) drives one hop at a
// time and polls; this worker never holds a connection open while ConvertAPI works.
//
// Endpoints (verified against the live API):
//   start: POST /async/convert/{from}/to/{to}?jobid={id}  -> {"JobId": id}
//   poll:  GET  /async/job/{id}   -> 202 processing | 200 {Files:[{Url}]} done
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

const BASE = 'https://v2.convertapi.com';

// Turn ConvertAPI's raw error body into a plain, user-facing sentence. Their
// JSON carries a readable "Message"; we unwrap it, prefer a specific
// invalid-parameter reason when present, and rewrite the most opaque codes.
function friendlyError(body, pair) {
  let data;
  try { data = JSON.parse(body); } catch { data = null; }
  const p = pair ? ` (${pair})` : '';
  if (data) {
    const inv = data.InvalidParameters && Object.values(data.InvalidParameters)[0];
    const detail = (Array.isArray(inv) ? inv[0] : inv) || data.Message || '';
    if (data.Code === 5004) return `Nothing to extract${p} — no matching content in the file.`;
    if (data.Code === 4000) return `Unsupported or invalid file${p}.`;
    if (data.Code === 5009) return `File expired${p} — attach it again.`;
    if (detail) return `Failed${p}: ${detail}`;
  }
  const plain = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
  return `Failed${p}${plain ? ': ' + plain : '.'}`;
}

// Self-generated job id (32 lowercase alnum) that ties the start to the poll.
function makeJobId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let s = '';
  for (const b of bytes) s += chars[b % 36];
  return s;
}

// POST: start one hop. First hop sends the file; later hops send the prior
// result URL. Returns { jobId } immediately — no waiting on the conversion.
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

  const jobId = makeJobId();
  try {
    const upstream = new FormData();
    upstream.append('StoreFile', 'true'); // so the result is fetchable by URL
    // The images→animated-GIF converter (to=gif) takes a "Files" array param;
    // every other target takes a singular "File". Chained hops pass the prior
    // result as File=<url string>, NOT Url= (Url is accepted then fails the job).
    const field = to === 'gif' ? 'Files' : 'File';
    if (file && typeof file !== 'string') upstream.append(field, file, file.name || `input.${from}`);
    else upstream.append(field, String(url));

    // /async path prefix + jobid = start an async job we poll for below.
    const res = await fetch(`${BASE}/async/convert/${from}/to/${to}?jobid=${jobId}`, {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
      body: upstream,
    });
    if (!res.ok) {
      throw new Error(friendlyError(await res.text(), `${from.toUpperCase()} → ${to.toUpperCase()}`));
    }
    return json({ jobId });
  } catch (e) {
    return json({ error: e.message || 'Conversion failed.' }, 502);
  }
}

// GET ?jobId=… polls a job; GET ?download=<url> proxies the finished file back
// same-origin (browsers can't reliably fetch/save the cross-origin result URL).
export async function onRequestGet({ request, env }) {
  const secret = env.CONVERTAPI_SECRET;
  if (!secret) return json({ error: 'Conversion service is not configured.' }, 500);

  const params = new URL(request.url).searchParams;

  // --- Download proxy: stream a ConvertAPI result file back as an attachment. ---
  const dl = params.get('download');
  if (dl) {
    let target;
    try { target = new URL(dl); } catch { return json({ error: 'Bad download url.' }, 400); }
    // SSRF guard: only proxy ConvertAPI result hosts.
    if (!/(^|\.)convertapi\.com$/.test(target.hostname)) return json({ error: 'Forbidden host.' }, 403);
    const name = params.get('name') || 'download';
    const up = await fetch(target.toString());
    if (!up.ok) return json({ error: 'Could not fetch the converted file.' }, 502);
    return new Response(up.body, {
      headers: {
        'content-type': up.headers.get('content-type') || 'application/octet-stream',
        'content-disposition': `attachment; filename="${name.replace(/["\\]/g, '')}"`,
        'cache-control': 'no-store',
      },
    });
  }

  const jobId = params.get('jobId');
  if (!jobId) return json({ error: 'Missing jobId.' }, 400);

  try {
    const res = await fetch(`${BASE}/async/job/${encodeURIComponent(jobId)}`, {
      headers: { authorization: `Bearer ${secret}` },
    });
    if (res.status === 202) return json({ done: false }); // still processing
    if (!res.ok) {
      throw new Error(friendlyError(await res.text()));
    }
    const data = await res.json();
    // Multi-page inputs return one file per page — hand back the whole list.
    const files = (data?.Files || []).filter((f) => f?.Url).map((f) => ({ url: f.Url, filename: f.FileName }));
    if (files.length) return json({ done: true, files });
    return json({ done: false }); // 200 but result not attached yet — keep polling
  } catch (e) {
    return json({ error: e.message || 'Conversion failed.' }, 502);
  }
}
