const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });

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
  if (!outputFormat) return json({ error: 'Missing target format.' }, 400);
  if (!inputFormat) return json({ error: 'Could not detect the input format.' }, 400);
  if (!file || typeof file === 'string') return json({ error: 'No file uploaded.' }, 400);

  const url = `https://v2.convertapi.com/convert/${inputFormat}/to/${outputFormat}`;

  const upstream = new FormData();
  upstream.append('File', file, file.name || `input.${inputFormat}`);
  upstream.append('StoreFile', 'true');

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
      body: upstream,
    });
  } catch (e) {
    return json({ error: 'Could not reach the conversion service.' }, 502);
  }

  if (!res.ok) {
    const msg = await res.text();
    return json({ error: `Conversion failed: ${msg.slice(0, 200)}` }, 502);
  }

  const data = await res.json();
  const out = data?.Files?.[0];
  if (!out?.Url) return json({ error: 'No output file returned.' }, 502);

  return json({ downloadUrl: out.Url, filename: out.FileName });
}
