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

const COMPAT_TARGETS: Record<string, string[]> = {
  Document: ['Document', 'Ebook', 'Image', 'Presentation', 'Spreadsheet', 'Vector'],
  Ebook: ['Ebook', 'Document', 'Image'],
  Image: ['Image', 'Document', 'Vector'],
  Presentation: ['Presentation', 'Document', 'Image'],
  Spreadsheet: ['Spreadsheet', 'Document'],
  Vector: ['Vector', 'Image', 'Document'],
  CAD: ['CAD', 'Vector', 'Image', 'Document'],
};

export function targetsFor(ext: string): string[] {
  const e = ext.toLowerCase().split('.').pop() || ext;
  const cat = CAT_OF[e];
  if (cat === 'Video') return LOCAL_VIDEO.filter((t) => t !== e);
  if (cat === 'Audio') return LOCAL_AUDIO.filter((t) => t !== e);
  if (cat === 'Font') return LOCAL_FONT.filter((t) => t !== e);
  if (cat === 'Archive') return LOCAL_ARCHIVE.filter((t) => t !== e);
  const reach = new Set(directApiTargets(e));
  const okCats = cat ? (COMPAT_TARGETS[cat] || []) : [];
  for (const m of [...reach])
    for (const t of directApiTargets(m)) {
      const tc = CAT_OF[t];
      if (!okCats || (tc && okCats.includes(tc))) reach.add(t);
    }
  reach.delete(e);
  return [...reach];
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
