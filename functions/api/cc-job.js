const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });

// One ConvertAPI hop: {from}/to/{to}. `input` is a Blob/File; returns { url, filename }.
async function hop(secret, from, to, input, filename) {
  const upstream = new FormData();
  upstream.append('File', input, filename || `input.${from}`);
  upstream.append('StoreFile', 'true');
  const res = await fetch(`https://v2.convertapi.com/convert/${from}/to/${to}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${secret}` },
    body: upstream,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Conversion failed (${from}→${to}): ${msg.slice(0, 200)}`);
  }
  const data = await res.json();
  const out = data?.Files?.[0];
  if (!out?.Url) throw new Error(`No output from ${from}→${to}.`);
  return { url: out.Url, filename: out.FileName };
}

export async function onRequestPost({ request, env }) {
  const secret = env.CONVERTAPI_SECRET;
  if (!secret) return json({ error: 'Conversion service is not configured.' }, 500);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Bad request.' }, 400);
  }

  const inputFormat = String(form.get('inputFormat') || '').toLowerCase();
  const outputFormat = String(form.get('outputFormat') || '').toLowerCase();
  const file = form.get('file');
  if (!file || typeof file === 'string') return json({ error: 'No file uploaded.' }, 400);

  // `path` (comma-separated formats) drives multi-hop chaining; falls back to
  // the plain input→output single hop when absent (doc pages still send that).
  const pathRaw = String(form.get('path') || '');
  const path = pathRaw
    ? pathRaw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [inputFormat, outputFormat];
  if (path.length < 2 || path.some((p) => !p))
    return json({ error: 'Missing or invalid conversion path.' }, 400);

  try {
    // First hop uses the uploaded file; each further hop downloads the previous
    // result server-side (no CORS) and re-uploads it as the next input.
    let current = { blob: file, filename: file.name || `input.${path[0]}` };
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      let input = current.blob;
      if (!input) {
        const r = await fetch(current.url);
        if (!r.ok) throw new Error(`Could not fetch intermediate (${from}).`);
        input = await r.blob();
      }
      const res = await hop(secret, from, to, input, current.filename);
      current = { url: res.url, filename: res.filename, blob: null };
    }
    return json({ downloadUrl: current.url, filename: current.filename });
  } catch (e) {
    return json({ error: e.message || 'Conversion failed.' }, 502);
  }
}
