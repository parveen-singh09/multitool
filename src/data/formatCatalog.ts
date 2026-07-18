// One source of truth for the home hero's format picker + which backend runs a conversion.
// Non-media formats convert via ConvertAPI (CONVERT_MATRIX); audio/video/font convert
// in-browser via ffmpeg / fonteditor-core, so their target lists mirror those converters.
import { CONVERT_MATRIX } from './convertMatrix';

// Mirrors VIDEO_MIME keys in lib/videoConvert.ts.
export const LOCAL_VIDEO = ['mp4', 'webm', 'mkv', 'mov', 'avi', 'flv', 'ogv'];
// Mirrors TARGETS in components/AudioConvert.astro (aac is written as .m4a).
export const LOCAL_AUDIO = ['mp3', 'm4a', 'wav', 'flac', 'ogg', 'opus', 'aiff', 'ac3'];
// Mirrors TARGETS in components/FontConvert.astro.
export const LOCAL_FONT = ['ttf', 'woff', 'woff2', 'eot'];
// Browser-native repackaging in lib/archive.ts (zip/unzip + tar + gzip streams).
export const LOCAL_ARCHIVE = ['zip', 'tar', 'tgz'];

export interface FormatCategory {
  label: string;
  formats: string[];
}

// The CloudConvert catalog, grouped. Formats are lowercase extensions.
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
    // zip/tar/tgz read+write natively (lib/archive.ts). 7z/rar/bz2/xz/cab/iso/deb
    // are EXTRACT-ONLY via libarchive.js — no browser lib can *write* them, so they
    // only ever appear as sources (targets stay zip/tar/tgz, see LOCAL_ARCHIVE).
    label: 'Archive',
    formats: ['zip', 'tar', 'tgz', '7z', 'rar', 'bz2', 'xz', 'cab', 'iso', 'deb'],
  },
];

// ext -> category label. First match wins (categories are ordered above).
const CAT_OF: Record<string, string> = {};
for (const c of FORMAT_CATEGORIES)
  for (const f of c.formats) if (!(f in CAT_OF)) CAT_OF[f] = c.label;

export function categoryOf(ext: string): string | undefined {
  return CAT_OF[ext.toLowerCase().split('.').pop() || ext];
}

// Direct (1-hop) ConvertAPI targets, minus the zip/json "package output"
// pseudo-targets that fail on real single-file conversions.
function directApiTargets(e: string): string[] {
  return (CONVERT_MATRIX[e] || []).filter((t) => t !== 'zip' && t !== 'json' && t !== e);
}

// The one compatibility function the picker and converter both use.
// API formats expose the full 2-hop closure (like CloudConvert): if csv->xlsx
// and xlsx->png both exist directly, csv->png is offered and chained in the worker.
export function targetsFor(ext: string): string[] {
  const e = ext.toLowerCase().split('.').pop() || ext;
  const cat = CAT_OF[e];
  if (cat === 'Video') return LOCAL_VIDEO.filter((t) => t !== e);
  if (cat === 'Audio') return LOCAL_AUDIO.filter((t) => t !== e);
  if (cat === 'Font') return LOCAL_FONT.filter((t) => t !== e);
  if (cat === 'Archive') return LOCAL_ARCHIVE.filter((t) => t !== e);
  const reach = new Set(directApiTargets(e));
  for (const m of [...reach]) for (const t of directApiTargets(m)) reach.add(t);
  reach.delete(e);
  return [...reach];
}

// Resolve the conversion hops for an API source->target. Prefers a direct hop,
// else finds one intermediate (2-hop). Returns null if unreachable even by chain.
export function chainPath(from: string, to: string): string[] | null {
  const f = from.toLowerCase().split('.').pop() || from;
  const t = to.toLowerCase().split('.').pop() || to;
  if (f === t) return null;
  const direct = directApiTargets(f);
  if (direct.includes(t)) return [f, t];
  for (const m of direct) if (directApiTargets(m).includes(t)) return [f, m, t];
  return null;
}

// Which converter backend handles a source ext: 'ffmpeg' (video/audio),
// 'font' (fonteditor-core), or 'api' (ConvertAPI).
export function backendFor(ext: string): 'ffmpeg' | 'font' | 'archive' | 'api' {
  const cat = categoryOf(ext);
  if (cat === 'Video' || cat === 'Audio') return 'ffmpeg';
  if (cat === 'Font') return 'font';
  if (cat === 'Archive') return 'archive';
  return 'api';
}
