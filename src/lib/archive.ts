import { unzip, type UnzipEntry } from './unzip';
import { makeZip } from './zip';

export type ArchiveFormat = 'zip' | 'tar' | 'tgz';
export const ARCHIVE_FORMATS: ArchiveFormat[] = ['zip', 'tar', 'tgz'];

const EXTRACT_ONLY = ['7z', 'rar', 'bz2', 'xz', 'cab', 'iso', 'deb'];
export function isExtractOnly(nameOrExt: string): boolean {
  return EXTRACT_ONLY.includes((nameOrExt.toLowerCase().split('.').pop() || ''));
}

export function archiveFormatOf(nameOrExt: string): ArchiveFormat | null {
  const n = nameOrExt.toLowerCase();
  if (n.endsWith('.tar.gz') || n.endsWith('.tgz') || n === 'tgz' || n === 'tar.gz') return 'tgz';
  if (n.endsWith('.tar') || n === 'tar') return 'tar';
  if (n.endsWith('.zip') || n === 'zip') return 'zip';
  return null;
}

let laInited = false;
async function extractViaLibarchive(file: File): Promise<UnzipEntry[]> {
  const { Archive } = await import('libarchive.js');
  if (!laInited) { Archive.init({ workerUrl: '/libarchive/worker-bundle.js' }); laInited = true; }
  const reader = await Archive.open(file);
  try {
    const arr = await reader.getFilesArray();
    const out: UnzipEntry[] = [];
    for (const { file: cf, path } of arr) {
      const extracted: File = await cf.extract();
      const data = new Uint8Array(await extracted.arrayBuffer());
      out.push({ name: (path || '') + extracted.name, data });
    }
    return out;
  } finally {
    try { await reader.close(); } catch {}
  }
}

const enc = new TextEncoder();
const decUtf8 = new TextDecoder();

function octal(n: number, len: number): Uint8Array {
  const s = n.toString(8).padStart(len - 1, '0') + '\0';
  return enc.encode(s);
}

export function makeTar(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const blocks: Uint8Array[] = [];
  for (const f of files) {
    const header = new Uint8Array(512);
    const nameBytes = enc.encode(f.name).subarray(0, 100);
    header.set(nameBytes, 0);
    header.set(enc.encode('0000644\0'), 100);
    header.set(enc.encode('0000000\0'), 108);
    header.set(enc.encode('0000000\0'), 116);
    header.set(octal(f.data.length, 12), 124);
    header.set(octal(0, 12), 136);
    header[156] = 0x30;
    header.set(enc.encode('ustar\0'), 257);
    header.set(enc.encode('00'), 263);
    for (let i = 148; i < 156; i++) header[i] = 0x20;
    let sum = 0;
    for (let i = 0; i < 512; i++) sum += header[i];
    header.set(enc.encode(sum.toString(8).padStart(6, '0') + '\0 '), 148);
    blocks.push(header, f.data);
    const pad = (512 - (f.data.length % 512)) % 512;
    if (pad) blocks.push(new Uint8Array(pad));
  }
  blocks.push(new Uint8Array(1024));
  const total = blocks.reduce((n, b) => n + b.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const b of blocks) { out.set(b, off); off += b.length; }
  return out;
}

export function readTar(buf: Uint8Array): UnzipEntry[] {
  const entries: UnzipEntry[] = [];
  let ptr = 0;
  while (ptr + 512 <= buf.length) {
    const nameField = buf.subarray(ptr, ptr + 100);
    if (nameField[0] === 0) break;
    const name = decUtf8.decode(nameField).replace(/\0.*$/, '');
    const sizeStr = decUtf8.decode(buf.subarray(ptr + 124, ptr + 136)).replace(/[\0 ]/g, '');
    const size = parseInt(sizeStr || '0', 8);
    const typeflag = buf[ptr + 156];
    const dataStart = ptr + 512;
    if ((typeflag === 0x30 || typeflag === 0) && name) {
      entries.push({ name, data: buf.slice(dataStart, dataStart + size) });
    }
    ptr = dataStart + size + ((512 - (size % 512)) % 512);
  }
  return entries;
}

async function gzip(data: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream === 'undefined') throw new Error('This browser cannot gzip (no CompressionStream).');
  const s = new Blob([data as BlobPart]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(s).arrayBuffer());
}
async function gunzip(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot gunzip (no DecompressionStream).');
  const s = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(s).arrayBuffer());
}

async function readArchive(file: File): Promise<UnzipEntry[]> {
  const native = archiveFormatOf(file.name);
  if (native) {
    const buf = await file.arrayBuffer();
    if (native === 'zip') return unzip(buf);
    if (native === 'tar') return readTar(new Uint8Array(buf));
    return readTar(await gunzip(new Uint8Array(buf)));
  }
  if (isExtractOnly(file.name)) return extractViaLibarchive(file);
  throw new Error(`Unsupported archive: ${file.name}`);
}

export const ARCHIVE_MIME: Record<ArchiveFormat, string> = {
  zip: 'application/zip',
  tar: 'application/x-tar',
  tgz: 'application/gzip',
};

export async function convertArchive(file: File, to: ArchiveFormat): Promise<Uint8Array> {
  const entries = await readArchive(file);
  if (!entries.length) throw new Error('Archive is empty or could not be read.');
  if (to === 'zip') return new Uint8Array(await makeZip(entries).arrayBuffer());
  if (to === 'tar') return makeTar(entries);
  return gzip(makeTar(entries));
}
