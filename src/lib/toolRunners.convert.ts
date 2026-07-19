import type { Runner, RunResult, RunFile, RunCtx } from './toolRunners';
import { getFFmpeg, fetchFile } from './ffmpeg';
import { buildArgs, defaultQuality, type ConvertOptions, type OutFamily, type MediaConversion } from './media';
import { videoArgs, VIDEO_MIME, LOCAL_VIDEO } from './videoConvert';

const rnd = () => Math.random().toString(36).slice(2);
const baseName = (name: string) => name.replace(/\.[^.]+$/, '') || 'output';
const extOf = (name: string) => (name.split('.').pop() || '').toLowerCase();

// Pull a target format from the prompt for the universal (*-converter) tools.
function targetFromQuery(query: string, allowed: string[], fallback: string): string {
  const q = query.toLowerCase();
  // longest match first so "tar.gz" wins over "gz"
  for (const f of [...allowed].sort((a, b) => b.length - a.length)) {
    if (new RegExp(`\\b${f.replace('.', '\\.')}\\b`).test(q)) return f;
  }
  return fallback;
}

// ---------- audio (local, ffmpeg.wasm) ----------
const AUDIO_MIME: Record<string, string> = {
  mp3: 'audio/mpeg', wav: 'audio/wav', flac: 'audio/flac', m4a: 'audio/mp4',
  ogg: 'audio/ogg', opus: 'audio/opus', aiff: 'audio/aiff', ac3: 'audio/ac3',
};
// file extension -> ffmpeg output family + emitted extension
const AUDIO_FAMILY: Record<string, { family: OutFamily; ext: string }> = {
  mp3: { family: 'mp3', ext: 'mp3' }, wav: { family: 'wav', ext: 'wav' },
  flac: { family: 'flac', ext: 'flac' }, aac: { family: 'aac', ext: 'm4a' },
  m4a: { family: 'aac', ext: 'm4a' }, ogg: { family: 'ogg', ext: 'ogg' },
  opus: { family: 'opus', ext: 'opus' }, aiff: { family: 'aiff', ext: 'aiff' },
  ac3: { family: 'ac3', ext: 'ac3' },
};

async function runAudio(to: string, ctx: RunCtx): Promise<RunResult> {
  const file = ctx.files[0];
  if (!file) throw new Error('Attach an audio file (paperclip on the left) and send again.');
  const spec = AUDIO_FAMILY[to] || AUDIO_FAMILY.mp3;
  const conv = { out: spec.family, kind: 'audio', ext: spec.ext } as MediaConversion;
  const opts: ConvertOptions = { quality: defaultQuality(spec.family) };
  const ff = await getFFmpeg();
  const inName = 'in_' + rnd() + '.' + (extOf(file.name) || 'dat');
  const outName = 'out.' + spec.ext;
  await ff.writeFile(inName, await fetchFile(file));
  await ff.exec(buildArgs(conv, opts, inName, outName));
  const data = (await ff.readFile(outName)) as Uint8Array;
  try { await ff.deleteFile(inName); await ff.deleteFile(outName); } catch {}
  const blob = new Blob([data as BlobPart], { type: AUDIO_MIME[to] || 'application/octet-stream' });
  return { files: [{ name: `${baseName(file.name)}.${spec.ext}`, blob, kind: 'file' }], note: `Converted to ${to.toUpperCase()}` };
}

// ---------- video (local, ffmpeg.wasm) ----------
async function runVideo(to: string, ctx: RunCtx): Promise<RunResult> {
  const file = ctx.files[0];
  if (!file) throw new Error('Attach a video file (paperclip on the left) and send again.');
  const ff = await getFFmpeg();
  const inName = 'in_' + rnd() + '.' + (extOf(file.name) || 'dat');
  const outName = 'out.' + to;
  await ff.writeFile(inName, await fetchFile(file));
  await ff.exec(videoArgs(to, 'balanced', inName, outName));
  const data = (await ff.readFile(outName)) as Uint8Array;
  try { await ff.deleteFile(inName); await ff.deleteFile(outName); } catch {}
  const blob = new Blob([data as BlobPart], { type: VIDEO_MIME[to] || 'application/octet-stream' });
  return { files: [{ name: `${baseName(file.name)}.${to}`, blob, kind: 'file' }], note: `Converted to ${to.toUpperCase()}` };
}

// ---------- font (local, fonteditor-core) ----------
const FONT_MIME: Record<string, string> = {
  ttf: 'font/ttf', woff: 'font/woff', woff2: 'font/woff2', eot: 'application/vnd.ms-fontobject',
};
async function runFont(to: string, ctx: RunCtx): Promise<RunResult> {
  const file = ctx.files[0];
  if (!file) throw new Error('Attach a font file (paperclip on the left) and send again.');
  const { createFont, woff2 } = await import('fonteditor-core');
  const inType = extOf(file.name);
  if (to === 'woff2' || inType === 'woff2') await woff2.init('/woff2.wasm');
  const font = createFont(await file.arrayBuffer(), { type: inType as any, hinting: true, kerning: true });
  const out = font.write({ type: to as any, hinting: true, kerning: true });
  const data = out instanceof ArrayBuffer ? new Uint8Array(out) : (out as Uint8Array);
  const blob = new Blob([data as BlobPart], { type: FONT_MIME[to] || 'application/octet-stream' });
  return { files: [{ name: `${baseName(file.name)}.${to}`, blob, kind: 'file' }], note: `Converted to ${to.toUpperCase()}` };
}

// ---------- everything else (ConvertAPI via /api/cc-job, async) ----------
async function runRemote(to: string, ctx: RunCtx): Promise<RunResult> {
  const file = ctx.files[0];
  if (!file) throw new Error('Attach the file you want to convert (paperclip on the left) and send again.');
  const from = extOf(file.name);
  const { chainPath } = await import('../data/formatCatalog');
  const { convertViaApi } = await import('./ccConvert');
  // Async start-and-poll: a slow conversion never holds one request open long
  // enough for Cloudflare to 502 (the old failure on multi-page PDFs).
  const out = await convertViaApi(file, chainPath(from, to) || [from, to]);
  const isImg = /^(jpg|jpeg|png|webp|gif|bmp|tiff|svg|ico)$/.test(to);
  // Multi-page inputs return one file per page; render them all (the chat's
  // result view offers a "Download all (ZIP)" when there are 2+).
  const files: RunFile[] = await Promise.all(out.map(async (f, i) => {
    const name = f.filename || `${baseName(file.name)}-${i + 1}.${to}`;
    // Fetch via the same-origin worker proxy — the browser can't reliably read
    // the cross-origin ConvertAPI result URL (CORS/opaque response).
    const dl = await fetch(`/api/cc-job?download=${encodeURIComponent(f.url)}&name=${encodeURIComponent(name)}`);
    if (!dl.ok) throw new Error('Could not download the converted file.');
    return { name, blob: await dl.blob(), kind: isImg ? 'image' as const : 'file' as const };
  }));
  const note = files.length > 1 ? `Converted to ${to.toUpperCase()} · ${files.length} pages` : `Converted to ${to.toUpperCase()}`;
  return { files, note };
}

// ---------- registry assembly ----------
const AUDIO_TARGETS = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'opus', 'aiff', 'ac3'];
const FONT_TARGETS = ['ttf', 'woff', 'woff2', 'eot'];
const ANY_TARGETS = [
  'pdf', 'docx', 'doc', 'odt', 'rtf', 'txt', 'html',
  'jpg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg', 'ico',
  'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'mp4', 'webm', 'mkv', 'mov', 'avi',
  'xlsx', 'csv', 'pptx', 'epub', 'mobi', 'zip', '7z',
];

// Local ffmpeg can only *decode* mainstream video; exotic inputs go remote.
const VIDEO_DECODABLE = new Set(['mp4', 'webm', 'mkv', 'mov', 'avi', 'flv', 'ogv', '3gp']);

// Per-format SEO slugs: engine chosen by from/to. Built by deriving to from the slug.
const SEO_SLUGS = [
  // audio (local)
  'mp3-to-ogg', 'mp3-to-flac', 'mp3-to-aac', 'mp3-to-opus', 'wav-to-flac',
  'flac-to-wav', 'm4a-to-wav', 'aac-to-mp3', 'opus-to-mp3', 'wav-to-ogg',
  // video local
  'webm-to-mp4', 'mp4-to-webm', 'avi-to-mp4', 'flv-to-mp4', 'mp4-to-mkv',
  'mkv-to-webm', 'mov-to-webm', 'mp4-to-mov', 'mp4-to-avi', '3gp-to-mp4',
  // video remote (exotic)
  'ts-to-mp4', 'vob-to-mp4', 'mpeg-to-mp4', 'rmvb-to-mp4', 'm2ts-to-mp4',
  'mxf-to-mp4', 'swf-to-mp4', 'wtv-to-mp4',
  // font (local)
  'ttf-to-woff', 'ttf-to-woff2', 'otf-to-ttf', 'otf-to-woff', 'otf-to-woff2',
  'woff-to-ttf', 'woff2-to-ttf', 'ttf-to-eot',
  // archive (remote)
  'rar-to-zip', '7z-to-zip', 'tar-to-zip', 'gz-to-zip', 'tar-gz-to-zip',
  'iso-to-zip', 'cab-to-zip', 'deb-to-zip', 'bz2-to-zip', 'zip-to-7z', 'zip-to-tar', 'rar-to-7z',
  // cad (remote)
  'dwg-to-dxf', 'dxf-to-dwg', 'dwg-to-pdf', 'dxf-to-pdf', 'dwg-to-svg', 'dwf-to-dwg',
  // document (remote)
  'doc-to-docx', 'doc-to-pdf', 'docx-to-odt', 'odt-to-docx', 'odt-to-pdf',
  'rtf-to-docx', 'pages-to-docx', 'pages-to-pdf', 'djvu-to-pdf', 'wpd-to-docx',
  // ebook (remote)
  'mobi-to-epub', 'epub-to-mobi', 'azw3-to-epub', 'epub-to-azw3', 'azw-to-epub',
  'mobi-to-pdf', 'fb2-to-epub', 'lit-to-epub', 'pdb-to-epub', 'cbr-to-cbz', 'mobi-to-azw3',
  // presentation (remote)
  'ppt-to-pptx', 'pptx-to-ppt', 'key-to-pptx', 'key-to-pdf', 'odp-to-pptx',
  'pptx-to-odp', 'pps-to-pptx', 'potx-to-pptx', 'odp-to-pdf', 'ppt-to-odp',
  // spreadsheet (remote)
  'xls-to-xlsx', 'xlsx-to-xls', 'ods-to-xlsx', 'xlsx-to-ods', 'numbers-to-xlsx',
  'numbers-to-csv', 'xls-to-ods', 'xlsx-to-csv', 'ods-to-csv', 'xlsx-to-pdf',
  // vector (remote)
  'ai-to-svg', 'ai-to-png', 'ai-to-pdf', 'cdr-to-svg', 'cdr-to-png',
  'svg-to-pdf', 'svg-to-eps', 'wmf-to-svg', 'emf-to-svg', 'vsd-to-pdf',
  // raw image (remote)
  'nef-to-jpg', 'cr2-to-jpg', 'cr3-to-jpg', 'arw-to-jpg', 'dng-to-jpg',
  'crw-to-jpg', 'nef-to-png', 'cr2-to-png', 'eps-to-png', 'eps-to-svg',
];

function runnerForPair(from: string, to: string): Runner {
  const audioLocal = AUDIO_FAMILY[from] && AUDIO_FAMILY[to];
  const videoLocal = LOCAL_VIDEO.includes(to) && VIDEO_DECODABLE.has(from);
  const fontLocal = FONT_TARGETS.includes(to) && ['ttf', 'otf', 'woff', 'woff2', 'eot'].includes(from);
  if (audioLocal) return { needs: 'text', run: (ctx) => runAudio(to, ctx) };
  if (videoLocal) return { needs: 'text', run: (ctx) => runVideo(to, ctx) };
  if (fontLocal) return { needs: 'text', run: (ctx) => runFont(to, ctx) };
  return { needs: 'text', run: (ctx) => runRemote(to, ctx) };
}

export const RUNNERS_CONVERT: Record<string, Runner> = {};

for (const slug of SEO_SLUGS) {
  const [from, to] = slug.split('-to-');
  if (from && to) RUNNERS_CONVERT[slug] = runnerForPair(from, to);
}

// Universal converters: target comes from the prompt.
RUNNERS_CONVERT['audio-converter'] = {
  needs: 'text',
  run: (ctx) => runAudio(targetFromQuery(ctx.query, AUDIO_TARGETS, 'mp3'), ctx),
};
RUNNERS_CONVERT['video-converter'] = {
  needs: 'text',
  run: (ctx) => runVideo(targetFromQuery(ctx.query, LOCAL_VIDEO, 'mp4'), ctx),
};
RUNNERS_CONVERT['font-converter'] = {
  needs: 'text',
  run: (ctx) => runFont(targetFromQuery(ctx.query, FONT_TARGETS, 'ttf'), ctx),
};
for (const slug of ['file-converter', 'archive-converter', 'cad-converter', 'document-converter',
  'ebook-format-converter', 'presentation-converter', 'spreadsheet-converter', 'vector-converter', 'raw-converter']) {
  RUNNERS_CONVERT[slug] = {
    needs: 'text',
    run: (ctx) => runRemote(targetFromQuery(ctx.query, ANY_TARGETS, 'pdf'), ctx),
  };
}
