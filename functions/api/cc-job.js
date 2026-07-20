const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

const BASE = 'https://v2.convertapi.com';

// Route to our self-hosted conversion service (LibreOffice + ffmpeg + dcraw/ImageMagick) for
// pairs ConvertAPI can't do. MUST mirror server.py's build_plan — if this says yes but the
// service rejects the pair, the user gets an error instead of a silent ConvertAPI fallback.
// ponytail: to add a category, extend both this rule AND build_plan in server.py.
// LibreOffice converts only WITHIN a document family — a slideshow can't become a spreadsheet.
const WORD_IN = new Set(['doc', 'docx', 'odt', 'rtf']), WORD_OUT = new Set(['doc', 'docx', 'odt', 'rtf']);
const PRES_IN = new Set(['ppt', 'pptx', 'odp', 'pps', 'ppsx', 'potx']), PRES_OUT = new Set(['ppt', 'pptx', 'odp']);
const SHEET_IN = new Set(['xls', 'xlsx', 'ods']), SHEET_OUT = new Set(['xls', 'xlsx', 'ods']);
const officeOk = (f, t) => f !== t && (
  (WORD_IN.has(f) && WORD_OUT.has(t)) || (PRES_IN.has(f) && PRES_OUT.has(t)) || (SHEET_IN.has(f) && SHEET_OUT.has(t)));
const SVG_IN = new Set(['wmf', 'emf', 'cdr']);
// swf excluded: ffmpeg can't demux SWF vector animation (verified fail on all real samples).
const VIDEO_IN = new Set(['ts', 'vob', 'mpeg', 'mpg', 'rmvb', 'm2ts', 'mxf', 'wtv', '3gp', 'flv', 'ogv', 'mp4', 'webm', 'mkv', 'mov', 'avi']);
const VIDEO_OUT = new Set(['mp4', 'mkv', 'mov', 'avi']); // webm excluded: VP9 transcode times out on 0.1-CPU tier
const RAW_IN = new Set(['nef', 'cr2', 'cr3', 'arw', 'dng', 'crw', 'raf', 'rw2', 'orf', 'pef', 'srw']);
const RAW_OUT = new Set(['jpg', 'png']);
const SEVENZIP_IN = new Set(['zip', 'rar', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'cab', 'iso']); // -> 7z (extract + re-archive)
const useLibreOffice = (from, to) =>
  officeOk(from, to) ||
  (SVG_IN.has(from) && to === 'svg') ||
  (VIDEO_IN.has(from) && VIDEO_OUT.has(to) && from !== to) ||
  (RAW_IN.has(from) && RAW_OUT.has(to)) ||
  (SEVENZIP_IN.has(from) && to === '7z');

// Ebook<->ebook runs on a SEPARATE Render service (calibre) so its memory use can't destabilize
// the main box. Mirror server.py's EBOOK_IN/EBOOK_OUT. pdf excluded (ConvertAPI does ebook->pdf).
const EBOOK_IN = new Set(['epub', 'mobi', 'azw', 'azw3', 'fb2', 'lit', 'pdb', 'cbr', 'cbz', 'prc', 'htmlz']);
const EBOOK_OUT = new Set(['epub', 'mobi', 'azw3', 'fb2', 'txt', 'cbz']);
const useCalibre = (from, to) => EBOOK_IN.has(from) && EBOOK_OUT.has(to) && from !== to;

// A LibreOffice job carries its result URL in the jobId itself (base64url of {url,filename}), so
// polling is stateless — the service converts synchronously on POST and stores under /out/<id>.
const b64urlEncode = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlDecode = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

function friendlyError(body, pair) {
  let data;
  try { data = JSON.parse(body); } catch { data = null; }
  const p = pair ? ` (${pair})` : '';
  if (data) {
    const inv = data.InvalidParameters && Object.values(data.InvalidParameters)[0];
    const detail = (Array.isArray(inv) ? inv[0] : inv) || data.Message || '';
    if (data.Code === 5001) return `Couldn't convert this file${p} — it may be empty, corrupt, or password/DRM protected. Try another file.`;
    if (data.Code === 5004) return `Nothing to extract${p} — no matching content in the file.`;
    if (data.Code === 4000) return `Unsupported or invalid file${p}.`;
    if (data.Code === 5009) return `File expired${p} — attach it again.`;
    if (detail) return `Failed${p}: ${detail}`;
  }
  const plain = body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
  return `Failed${p}${plain ? ': ' + plain : '.'}`;
}

function makeJobId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let s = '';
  for (const b of bytes) s += chars[b % 36];
  return s;
}

async function convertViaService(base, token, from, to, file, url, pair) {
  base = String(base || '').replace(/\/$/, '');
  token = token || '';
  if (!base || !token) throw new Error(`This conversion (${pair}) isn't available right now.`);

  let blob, name;
  if (file && typeof file !== 'string') {
    blob = file; name = file.name || `input.${from}`;
  } else {
    const src = await fetch(String(url));
    if (!src.ok) throw new Error(`Couldn't read the input file (${pair}).`);
    blob = await src.blob(); name = `input.${from}`;
  }

  const upstream = new FormData();
  upstream.append('to', to);
  upstream.append('file', blob, name);
  const res = await fetch(`${base}/convert`, {
    method: 'POST',
    headers: { 'X-Auth-Token': token },
    body: upstream,
  });
  const body = await res.text();
  if (!res.ok) {
    let msg = body;
    try { msg = JSON.parse(body).error || body; } catch {}
    const err = new Error(`Failed (${pair}): ${msg}`);
    err.status = res.status >= 400 && res.status < 500 ? 400 : 502;
    throw err;
  }
  const out = JSON.parse(body);
  const dlUrl = `${base}/out/${out.id}/${encodeURIComponent(out.filename)}`;
  return { jobId: 'lo_' + b64urlEncode(JSON.stringify({ url: dlUrl, filename: out.filename })) };
}

export async function onRequestPost({ request, env }) {
  const secret = env.CONVERTAPI_SECRET;

  let form;
  try { form = await request.formData(); } catch { return json({ error: 'Bad request.' }, 400); }

  const from = String(form.get('from') || '').toLowerCase();
  const to = String(form.get('to') || '').toLowerCase();
  if (!from || !to) return json({ error: 'Missing conversion formats.' }, 400);

  const file = form.get('file');
  const url = form.get('url');
  if ((!file || typeof file === 'string') && !url) return json({ error: 'No input provided.' }, 400);

  const pair = `${from.toUpperCase()} → ${to.toUpperCase()}`;

  if (useLibreOffice(from, to)) {
    try {
      return json(await convertViaService(env.LIBREOFFICE_URL, env.LIBREOFFICE_TOKEN, from, to, file, url, pair));
    } catch (e) {
      return json({ error: e.message || 'Conversion failed.' }, e.status || 502);
    }
  }

  if (useCalibre(from, to)) {
    try {
      // Calibre box reuses LIBREOFFICE_TOKEN unless a distinct CALIBRE_TOKEN is set.
      return json(await convertViaService(env.CALIBRE_URL, env.CALIBRE_TOKEN || env.LIBREOFFICE_TOKEN, from, to, file, url, pair));
    } catch (e) {
      return json({ error: e.message || 'Conversion failed.' }, e.status || 502);
    }
  }

  if (!secret) return json({ error: 'Conversion service is not configured.' }, 500);

  const jobId = makeJobId();
  try {
    const upstream = new FormData();
    upstream.append('StoreFile', 'true');
    const field = to === 'gif' ? 'Files' : 'File';
    if (file && typeof file !== 'string') upstream.append(field, file, file.name || `input.${from}`);
    else upstream.append(field, String(url));

    const res = await fetch(`${BASE}/async/convert/${from}/to/${to}?jobid=${jobId}`, {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
      body: upstream,
    });
    if (!res.ok) {
      // Pass upstream client errors (unsupported pair, bad file) through as 4xx so the real
      // reason reaches the user instead of being masked as a transient 502 and retried.
      const status = res.status >= 400 && res.status < 500 ? 400 : 502;
      return json({ error: friendlyError(await res.text(), pair) }, status);
    }
    return json({ jobId });
  } catch (e) {
    return json({ error: e.message || 'Conversion failed.' }, 502);
  }
}

export async function onRequestGet({ request, env }) {
  const params = new URL(request.url).searchParams;

  const dl = params.get('download');
  if (dl) {
    let target;
    try { target = new URL(dl); } catch { return json({ error: 'Bad download url.' }, 400); }
    const svcHosts = [];
    for (const v of [env.LIBREOFFICE_URL, env.CALIBRE_URL]) {
      try { if (v) svcHosts.push(new URL(v).hostname); } catch {}
    }
    const ok = /(^|\.)convertapi\.com$/.test(target.hostname) || svcHosts.includes(target.hostname);
    if (!ok) return json({ error: 'Forbidden host.' }, 403);
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

  // LibreOffice jobs converted synchronously on POST — result is encoded in the id, return it now.
  if (jobId.startsWith('lo_')) {
    try {
      const { url, filename } = JSON.parse(b64urlDecode(jobId.slice(3)));
      return json({ done: true, files: [{ url, filename }] });
    } catch {
      return json({ error: 'Invalid job.' }, 400);
    }
  }

  const secret = env.CONVERTAPI_SECRET;
  if (!secret) return json({ error: 'Conversion service is not configured.' }, 500);

  try {
    const res = await fetch(`${BASE}/async/job/${encodeURIComponent(jobId)}`, {
      headers: { authorization: `Bearer ${secret}` },
    });
    if (res.status === 202) return json({ done: false });
    if (!res.ok) {
      throw new Error(friendlyError(await res.text()));
    }
    const data = await res.json();
    const files = (data?.Files || []).filter((f) => f?.Url).map((f) => ({ url: f.Url, filename: f.FileName }));
    if (files.length) return json({ done: true, files });
    return json({ done: false });
  } catch (e) {
    return json({ error: e.message || 'Conversion failed.' }, 502);
  }
}
