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
    formats: ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'html', 'htm', 'wpd'],
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
    formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'ico', 'psd', 'dcm', 'eps'],
  },
  {
    label: 'Presentation',
    formats: ['ppt', 'pptx', 'odp', 'pps', 'ppsx', 'potx'],
  },
  {
    label: 'Spreadsheet',
    formats: ['xls', 'xlsx', 'csv', 'ods'],
  },
  {
    label: 'Vector',
    formats: ['svg', 'ai', 'eps', 'ps', 'wmf', 'emf', 'cdr'],
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
    formats: ['zip', 'tar', 'tgz', 'gz', '7z', 'rar', 'bz2', 'xz', 'cab', 'iso', 'deb'],
  },
];

const CAT_OF: Record<string, string> = {};
for (const c of FORMAT_CATEGORIES)
  for (const f of c.formats) if (!(f in CAT_OF)) CAT_OF[f] = c.label;

export function categoryOf(ext: string): string | undefined {
  return CAT_OF[ext.toLowerCase().split('.').pop() || ext];
}

// Self-hosted conversion service is the ONLY backend (ConvertAPI removed). This MUST mirror
// functions/api/cc-job.js routing + server.py build_plan, so the dropdown only offers targets the
// backend can actually produce. A pair not derivable here is not offered and not accepted.
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
// Image bulk via ImageMagick (psd/dcm read via IM coders); mirror server.py IMAGE_IN/OUT.
const IMAGE_IN = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'ico', 'psd', 'dcm', 'dicom'];
const IMAGE_OUT = ['jpg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'ico', 'pnm', 'pdf'];
// EPS/PS/AI -> raster via ImageMagick+Ghostscript; mirror server.py PS_IN/OUT.
const PS_IN = ['eps', 'ps', 'ai'];
const PS_OUT = ['jpg', 'png', 'tiff', 'webp', 'pnm'];
// Writer family -> txt/html + sheet -> csv/xlsx via LibreOffice; mirror server.py.
const DOC_IN = ['doc', 'docx', 'odt', 'rtf'];
const DOC_TEXT_OUT = ['txt', 'html'];
const SHEET_TEXT_IN = ['csv', 'xls', 'xlsx', 'ods'];
const SHEET_TEXT_OUT = ['csv', 'xlsx'];
// Anything->PDF via LibreOffice. svg/html/htm excluded (LO import lossy) — dropped from offering.
const TO_PDF_IN = ['doc', 'docx', 'odt', 'rtf', 'txt', 'ppt', 'pptx', 'odp',
  'pps', 'ppsx', 'potx', 'xls', 'xlsx', 'ods', 'csv', 'wpd'];
const EBOOK_IN = ['epub', 'mobi', 'azw', 'azw3', 'fb2', 'lit', 'pdb', 'prc', 'htmlz'];
const EBOOK_OUT = ['epub', 'mobi', 'azw3', 'fb2', 'txt'];
// Extra LibreOffice pairs; mirror server.py EXTRA_LO + cc-job.js.
const EXTRA_LO: Record<string, string[]> = { wpd: ['docx'], ods: ['csv'], svg: ['eps'], eps: ['svg'] };

function selfHostedTargets(e: string): string[] {
  const out: string[] = [];
  out.push(...officeTargets(e));
  if (VECTOR_IN.includes(e)) out.push(...VECTOR_OUT);
  if (VIDEO_SVC_IN.includes(e)) out.push(...VIDEO_SVC_OUT);
  if (RAW_IN.includes(e)) out.push(...RAW_OUT);
  if (IMAGE_IN.includes(e)) out.push(...IMAGE_OUT);
  if (PS_IN.includes(e)) out.push(...PS_OUT);
  if (DOC_IN.includes(e)) out.push(...DOC_TEXT_OUT);
  if (SHEET_TEXT_IN.includes(e)) out.push(...SHEET_TEXT_OUT);
  if (TO_PDF_IN.includes(e)) out.push('pdf');
  if (SEVENZIP_IN.includes(e)) out.push('7z');
  if (EBOOK_IN.includes(e)) out.push(...EBOOK_OUT);
  if (e === 'cbr') out.push('cbz'); // comic: unar extract RAR -> zip, main box
  if (EXTRA_LO[e]) out.push(...EXTRA_LO[e]);
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

  // Self-hosted service (the only remote backend now).
  selfHostedTargets(e).forEach((t) => set.add(t));

  set.delete(e);
  return [...set];
}

// ConvertAPI multi-hop chains are gone — every conversion is a single hop on the box. Return the
// direct pair when the box supports it, else null (callers fall back to [from,to] and let the
// service reject unsupported pairs).
export function chainPath(from: string, to: string): string[] | null {
  const f = from.toLowerCase().split('.').pop() || from;
  const t = to.toLowerCase().split('.').pop() || to;
  if (f === t) return null;
  return targetsFor(f).includes(t) ? [f, t] : null;
}

export function backendFor(ext: string): 'ffmpeg' | 'font' | 'archive' | 'api' {
  const cat = categoryOf(ext);
  if (cat === 'Video' || cat === 'Audio') return 'ffmpeg';
  if (cat === 'Font') return 'font';
  if (cat === 'Archive') return 'archive';
  return 'api';
}
