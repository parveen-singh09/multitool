const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

const BASE = 'https://v2.convertapi.com';

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
    upstream.append('StoreFile', 'true');
    const field = to === 'gif' ? 'Files' : 'File';
    if (file && typeof file !== 'string') upstream.append(field, file, file.name || `input.${from}`);
    else upstream.append(field, String(url));

    // ponytail: sync convert — one blocking POST returns the file. No async job + poll GET, so no poll-time 502s.
    const res = await fetch(`${BASE}/convert/${from}/to/${to}`, {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
      body: upstream,
    });
    if (!res.ok) {
      throw new Error(friendlyError(await res.text(), `${from.toUpperCase()} → ${to.toUpperCase()}`));
    }
    const data = await res.json();
    const files = (data?.Files || []).filter((f) => f?.Url).map((f) => ({ url: f.Url, filename: f.FileName }));
    if (!files.length) throw new Error('Conversion produced no output.');
    return json({ files });
  } catch (e) {
    return json({ error: e.message || 'Conversion failed.' }, 502);
  }
}

export async function onRequestGet({ request, env }) {
  const secret = env.CONVERTAPI_SECRET;
  if (!secret) return json({ error: 'Conversion service is not configured.' }, 500);

  const params = new URL(request.url).searchParams;

  const dl = params.get('download');
  if (dl) {
    let target;
    try { target = new URL(dl); } catch { return json({ error: 'Bad download url.' }, 400); }
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

  return json({ error: 'Missing download url.' }, 400);
}
