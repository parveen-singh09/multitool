const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

// All conversions run on our self-hosted services (LibreOffice + ffmpeg + dcraw/ImageMagick +
// Ghostscript + p7zip on the main box; calibre on a separate box). ConvertAPI is gone. Routing
// MUST mirror server.py's build_plan — if this says yes but the service rejects the pair, the
// user gets an error; if it says no, the pair is simply unsupported (not offered in the UI).
// ponytail: to add a category, extend both this rule AND build_plan in server.py.
// LibreOffice converts only WITHIN a document family — a slideshow can't become a spreadsheet.
const WORD_IN = new Set(['doc', 'docx', 'odt', 'rtf']), WORD_OUT = new Set(['doc', 'docx', 'odt', 'rtf']);
const PRES_IN = new Set(['ppt', 'pptx', 'odp', 'pps', 'ppsx', 'potx']), PRES_OUT = new Set(['ppt', 'pptx', 'odp']);
const SHEET_IN = new Set(['xls', 'xlsx', 'ods']), SHEET_OUT = new Set(['xls', 'xlsx', 'ods']);
const officeOk = (f, t) => f !== t && (
  (WORD_IN.has(f) && WORD_OUT.has(t)) || (PRES_IN.has(f) && PRES_OUT.has(t)) || (SHEET_IN.has(f) && SHEET_OUT.has(t)));
const VECTOR_IN = new Set(['wmf', 'emf', 'cdr']);
const VECTOR_OUT = new Set(['svg', 'png', 'pdf', 'jpg']);
// swf excluded: ffmpeg can't demux SWF vector animation (verified fail on all real samples).
const VIDEO_IN = new Set(['ts', 'vob', 'mpeg', 'mpg', 'rmvb', 'm2ts', 'mxf', 'wtv', '3gp', 'flv', 'ogv', 'mp4', 'webm', 'mkv', 'mov', 'avi']);
const VIDEO_OUT = new Set(['mp4', 'mkv', 'mov', 'avi']); // webm excluded: VP9 transcode times out on 0.1-CPU tier
const RAW_IN = new Set(['nef', 'cr2', 'cr3', 'arw', 'dng', 'crw', 'raf', 'rw2', 'orf', 'pef', 'srw']);
const RAW_OUT = new Set(['jpg', 'png']);
const SEVENZIP_IN = new Set(['zip', 'rar', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'cab', 'iso']); // -> 7z (extract + re-archive)
// Image bulk via ImageMagick (psd/dcm read via IM coders). Mirror server.py IMAGE_IN/OUT.
const IMAGE_IN = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'ico', 'psd', 'dcm', 'dicom']);
const IMAGE_OUT = new Set(['jpg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'ico', 'pnm', 'pdf']);
// EPS/PS/AI -> raster via ImageMagick+Ghostscript. Mirror server.py PS_IN/OUT.
const PS_IN = new Set(['eps', 'ps', 'ai']);
const PS_OUT = new Set(['jpg', 'png', 'tiff', 'webp', 'pnm']);
// Office (Writer family) -> txt/html + sheet -> csv/xlsx via LibreOffice. Mirror server.py.
const DOC_IN = new Set(['doc', 'docx', 'odt', 'rtf']);
const DOC_TEXT_OUT = new Set(['txt', 'html']);
const SHEET_TEXT_IN = new Set(['csv', 'xls', 'xlsx', 'ods']);
const SHEET_TEXT_OUT = new Set(['csv', 'xlsx']);
// Anything->PDF via LibreOffice. svg/html/htm excluded (LO import lossy) — dropped from offering.
const TO_PDF_IN = new Set(['doc', 'docx', 'odt', 'rtf', 'txt', 'ppt', 'pptx', 'odp',
  'pps', 'ppsx', 'potx', 'xls', 'xlsx', 'ods', 'csv', 'wpd']);
// Extra LibreOffice pairs; mirror server.py EXTRA_LO.
const EXTRA_LO = new Set(['wpd>docx', 'ods>csv', 'svg>eps', 'eps>svg']);
const useLibreOffice = (from, to) =>
  officeOk(from, to) ||
  (VECTOR_IN.has(from) && VECTOR_OUT.has(to)) ||
  (VIDEO_IN.has(from) && VIDEO_OUT.has(to) && from !== to) ||
  (RAW_IN.has(from) && RAW_OUT.has(to)) ||
  (IMAGE_IN.has(from) && IMAGE_OUT.has(to) && from !== to) ||
  (PS_IN.has(from) && PS_OUT.has(to)) ||
  (DOC_IN.has(from) && DOC_TEXT_OUT.has(to) && from !== to) ||
  (SHEET_TEXT_IN.has(from) && SHEET_TEXT_OUT.has(to) && from !== to) ||
  (to === 'pdf' && TO_PDF_IN.has(from) && from !== 'pdf') ||
  (SEVENZIP_IN.has(from) && to === '7z') ||
  (from === 'cbr' && to === 'cbz') || // comic: unar extract RAR -> zip, on main box (not calibre)
  EXTRA_LO.has(`${from}>${to}`);

// Ebook<->ebook runs on a SEPARATE Render service (calibre) so its memory use can't destabilize
// the main box. Mirror server.py's EBOOK_IN/EBOOK_OUT. pdf excluded (calibre PDF needs QtWebEngine).
const EBOOK_IN = new Set(['epub', 'mobi', 'azw', 'azw3', 'fb2', 'lit', 'pdb', 'prc', 'htmlz']);
const EBOOK_OUT = new Set(['epub', 'mobi', 'azw3', 'fb2', 'txt']);
const useCalibre = (from, to) => EBOOK_IN.has(from) && EBOOK_OUT.has(to) && from !== to;

// A conversion job carries its result URL in the jobId itself (base64url of {url,filename}), so
// polling is stateless — the service converts synchronously on POST and stores under /out/<id>.
const b64urlEncode = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlDecode = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

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
    // ponytail: service returns raw JSON/stack text — don't leak it. 4xx = bad input, 5xx = service trouble.
    const clientErr = res.status >= 400 && res.status < 500;
    const err = new Error(clientErr
      ? `Couldn't convert this file (${pair}) — it may be empty, corrupt, password-protected, or in an unexpected format. Try another file.`
      : `The conversion service is temporarily unavailable (${pair}). Please try again in a moment.`);
    err.status = clientErr ? 400 : 502;
    throw err;
  }
  const out = JSON.parse(body);
  const dlUrl = `${base}/out/${out.id}/${encodeURIComponent(out.filename)}`;
  return { jobId: 'lo_' + b64urlEncode(JSON.stringify({ url: dlUrl, filename: out.filename })) };
}

export async function onRequestPost({ request, env }) {
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

  return json({ error: `This conversion (${pair}) isn't supported.` }, 400);
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
    if (!svcHosts.includes(target.hostname)) return json({ error: 'Forbidden host.' }, 403);
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

  // Jobs convert synchronously on POST — the result URL is encoded in the id, return it now.
  if (jobId.startsWith('lo_')) {
    try {
      const { url, filename } = JSON.parse(b64urlDecode(jobId.slice(3)));
      return json({ done: true, files: [{ url, filename }] });
    } catch {
      return json({ error: 'Invalid job.' }, 400);
    }
  }

  return json({ error: 'Invalid job.' }, 400);
}
