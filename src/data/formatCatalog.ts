import { CONVERT_MATRIX } from './convertMatrix';

export const LOCAL_VIDEO = ['mp4', 'webm', 'mkv', 'mov', 'avi', 'flv', 'ogv'];
export const LOCAL_AUDIO = ['mp3', 'm4a', 'wav', 'flac', 'ogg', 'opus', 'aiff', 'ac3'];
export const LOCAL_FONT = ['ttf', 'woff', 'woff2', 'eot'];
export const LOCAL_ARCHIVE = ['zip', 'tar', 'tgz'];

export interface FormatCategory {
  label: string;
  formats: string[];
}

export const FORMAT_CATEGORIES: FormatCategory[] = [
  {
    label: 'Document',
    formats: ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'html', 'htm', 'md', 'pages',
      'wpd', 'xml', 'log', 'dot', 'dotx', 'mhtml'],
  },
  {
    label: 'Ebook',
    formats: ['epub', 'mobi'],
  },
  {
    label: 'Font',
    formats: ['ttf', 'otf', 'woff', 'woff2', 'eot'],
  },
  {
    label: 'Image',
    formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'ico', 'heic',
      'heif', 'jfif', 'psd', 'dcm', 'eps'],
  },
  {
    label: 'Presentation',
    formats: ['ppt', 'pptx', 'odp', 'key', 'pps', 'ppsx', 'potx'],
  },
  {
    label: 'Spreadsheet',
    formats: ['xls', 'xlsx', 'csv', 'ods', 'numbers', 'xlsb', 'xltx'],
  },
  {
    label: 'Vector',
    formats: ['svg', 'ai', 'eps', 'ps'],
  },
  {
    label: 'CAD',
    formats: ['dxf', 'dwg', 'dwf', 'dwfx', 'dwgx'],
  },
  {
    label: 'Video',
    formats: ['3g2', '3gp', '3gpp', 'avi', 'cavs', 'dv', 'dvr', 'flv', 'm2ts', 'm4v',
      'mkv', 'mod', 'mov', 'mp4', 'mpeg', 'mpg', 'mts', 'mxf', 'ogv', 'rm', 'rmvb',
      'swf', 'ts', 'vob', 'webm', 'wmv', 'wtv', 'divx', 'f4v'],
  },
  {
    label: 'Audio',
    formats: ['mp3', 'm4a', 'wav', 'flac', 'aac', 'ogg', 'opus', 'aiff', 'ac3', 'wma',
      'amr', 'au', 'caf', 'aifc', 'm4b', 'm4r', 'oga', 'weba'],
  },
  {
    label: 'Archive',
    formats: ['zip', 'tar', 'tgz', '7z', 'rar', 'bz2', 'xz', 'cab', 'iso', 'deb'],
  },
];

const CAT_OF: Record<string, string> = {};
for (const c of FORMAT_CATEGORIES)
  for (const f of c.formats) if (!(f in CAT_OF)) CAT_OF[f] = c.label;

export function categoryOf(ext: string): string | undefined {
  return CAT_OF[ext.toLowerCase().split('.').pop() || ext];
}

function directApiTargets(e: string): string[] {
  // ponytail: fdf is ConvertAPI-supported but useless as a generic target (PDF→FDF needs a form PDF, else Code 4000)
  return (CONVERT_MATRIX[e] || []).filter((t) => t !== 'zip' && t !== 'json' && t !== 'fdf' && t !== e);
}

// Self-hosted conversion service (LibreOffice + ffmpeg + dcraw/ImageMagick + p7zip + calibre).
// MUST mirror functions/api/cc-job.js routing + server.py build_plan, so the dropdown only offers
// targets the backend can actually produce.
const VIDEO_DECODABLE = ['mp4', 'webm', 'mkv', 'mov', 'avi', 'flv', 'ogv', '3gp'];
// LibreOffice converts only WITHIN a document family — a slideshow can't become a spreadsheet.
const WORD_IN = ['doc', 'docx', 'odt', 'rtf'], WORD_OUT = ['doc', 'docx', 'odt', 'rtf'];
const PRES_IN = ['ppt', 'pptx', 'odp', 'pps', 'ppsx', 'potx'], PRES_OUT = ['ppt', 'pptx', 'odp'];
const SHEET_IN = ['xls', 'xlsx', 'ods'], SHEET_OUT = ['xls', 'xlsx', 'ods'];
function officeTargets(e: string): string[] {
  if (WORD_IN.includes(e)) return WORD_OUT;
  if (PRES_IN.includes(e)) return PRES_OUT;
  if (SHEET_IN.includes(e)) return SHEET_OUT;
  return [];
}
const VECTOR_IN = ['wmf', 'emf', 'cdr'];
const VECTOR_OUT = ['svg', 'png', 'pdf', 'jpg'];
const VIDEO_SVC_IN = ['ts', 'vob', 'mpeg', 'mpg', 'rmvb', 'm2ts', 'mxf', 'wtv', '3gp', 'flv', 'ogv', 'mp4', 'webm', 'mkv', 'mov', 'avi']; // swf excluded: ffmpeg can't demux SWF
const VIDEO_SVC_OUT = ['mp4', 'mkv', 'mov', 'avi'];
const RAW_IN = ['nef', 'cr2', 'cr3', 'arw', 'dng', 'crw', 'raf', 'rw2', 'orf', 'pef', 'srw'];
const RAW_OUT = ['jpg', 'png'];
const SEVENZIP_IN = ['zip', 'rar', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'cab', 'iso'];
const EBOOK_IN = ['epub', 'mobi', 'azw', 'azw3', 'fb2', 'lit', 'pdb', 'prc', 'htmlz'];
const EBOOK_OUT = ['epub', 'mobi', 'azw3', 'fb2', 'txt'];

function selfHostedTargets(e: string): string[] {
  const out: string[] = [];
  out.push(...officeTargets(e));
  if (VECTOR_IN.includes(e)) out.push(...VECTOR_OUT);
  if (VIDEO_SVC_IN.includes(e)) out.push(...VIDEO_SVC_OUT);
  if (RAW_IN.includes(e)) out.push(...RAW_OUT);
  if (SEVENZIP_IN.includes(e)) out.push('7z');
  if (EBOOK_IN.includes(e)) out.push(...EBOOK_OUT);
  if (e === 'cbr') out.push('cbz'); // comic: unar extract RAR -> zip, main box
  return out;
}

export function targetsFor(ext: string): string[] {
  const e = ext.toLowerCase().split('.').pop() || ext;
  const cat = CAT_OF[e];
  const set = new Set<string>();

  // Browser-local engines.
  if (cat === 'Audio') LOCAL_AUDIO.forEach((t) => set.add(t));
  else if (cat === 'Font') LOCAL_FONT.forEach((t) => set.add(t));
  else if (cat === 'Video') { if (VIDEO_DECODABLE.includes(e)) LOCAL_VIDEO.forEach((t) => set.add(t)); }
  else if (cat === 'Archive') LOCAL_ARCHIVE.forEach((t) => set.add(t));

  // Self-hosted service.
  selfHostedTargets(e).forEach((t) => set.add(t));

  // ConvertAPI (only for categories it serves — not audio/video/font/archive, which are local/service).
  if (cat !== 'Audio' && cat !== 'Video' && cat !== 'Font' && cat !== 'Archive') {
    // ponytail: direct 1-hop only — invented multi-hop chains (svg→pdf→xml, mobi→pdf→rtf) 502 or produce garbage
    directApiTargets(e).forEach((t) => set.add(t));
  }

  set.delete(e);
  return [...set];
}

export function chainPath(from: string, to: string): string[] | null {
  const f = from.toLowerCase().split('.').pop() || from;
  const t = to.toLowerCase().split('.').pop() || to;
  if (f === t) return null;
  const direct = directApiTargets(f);
  if (direct.includes(t)) return [f, t];
  for (const m of direct) if (directApiTargets(m).includes(t)) return [f, m, t];
  return null;
}

export function backendFor(ext: string): 'ffmpeg' | 'font' | 'archive' | 'api' {
  const cat = categoryOf(ext);
  if (cat === 'Video' || cat === 'Audio') return 'ffmpeg';
  if (cat === 'Font') return 'font';
  if (cat === 'Archive') return 'archive';
  return 'api';
}
