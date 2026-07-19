import UTIF from 'utif';
import { encodeGif } from './gifenc';

export type RasterFormat =
  | 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif'
  | 'bmp' | 'tiff' | 'gif' | 'ico' | 'psd' | 'svg';

export interface EncodeOpts {
  quality?: number;
  matte?: string | null;
  gifColors?: number;
  icoSizes?: number[];
}

export interface Encoded { blob: Blob; ext: string; mime: string }

const luma = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

function hexRgb(hex: string) {
  return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error('the browser could not encode this format'))), type, quality));
}

export function encodeBmp(data: ImageData, matteHex: string): Blob {
  const { width, height, data: px } = data;
  const bg = hexRgb(matteHex);
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const dataOffset = 54;
  const fileSize = dataOffset + pixelArraySize;
  const buf = new ArrayBuffer(fileSize);
  const dv = new DataView(buf);
  const u8 = new Uint8Array(buf);
  dv.setUint16(0, 0x4d42, true);
  dv.setUint32(2, fileSize, true);
  dv.setUint32(10, dataOffset, true);
  dv.setUint32(14, 40, true);
  dv.setInt32(18, width, true);
  dv.setInt32(22, height, true);
  dv.setUint16(26, 1, true);
  dv.setUint16(28, 24, true);
  dv.setUint32(34, pixelArraySize, true);
  dv.setInt32(38, 2835, true);
  dv.setInt32(42, 2835, true);
  let off = dataOffset;
  for (let y = height - 1; y >= 0; y--) {
    const rowStart = off;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const a = px[i + 3] / 255;
      u8[off++] = Math.round(px[i + 2] * a + bg.b * (1 - a));
      u8[off++] = Math.round(px[i + 1] * a + bg.g * (1 - a));
      u8[off++] = Math.round(px[i] * a + bg.r * (1 - a));
    }
    off = rowStart + rowSize;
  }
  return new Blob([buf], { type: 'image/bmp' });
}

export function encodeTiff(data: ImageData): Blob {
  const tiff = UTIF.encodeImage(data.data, data.width, data.height);
  return new Blob([tiff], { type: 'image/tiff' });
}

export function encodePsd(data: ImageData): Blob {
  const { width, height, data: px } = data;
  const channels = 4;
  const headerLen = 26;
  const sectionsLen = 4 + 4 + 4;
  const compAndData = 2 + width * height * channels;
  const buf = new ArrayBuffer(headerLen + sectionsLen + compAndData);
  const dv = new DataView(buf);
  const u8 = new Uint8Array(buf);
  u8[0] = 0x38; u8[1] = 0x42; u8[2] = 0x50; u8[3] = 0x53;
  dv.setUint16(4, 1, false);
  dv.setUint16(12, channels, false);
  dv.setUint32(14, height, false);
  dv.setUint32(18, width, false);
  dv.setUint16(22, 8, false);
  dv.setUint16(24, 3, false);
  let off = headerLen;
  dv.setUint32(off, 0, false); off += 4;
  dv.setUint32(off, 0, false); off += 4;
  dv.setUint32(off, 0, false); off += 4;
  dv.setUint16(off, 0, false); off += 2;
  const plane = width * height;
  for (let c = 0; c < channels; c++) {
    for (let i = 0; i < plane; i++) u8[off++] = px[i * 4 + c];
  }
  return new Blob([buf], { type: 'image/vnd.adobe.photoshop' });
}

export async function encodeIco(canvas: HTMLCanvasElement, sizes: number[]): Promise<Blob> {
  const uniq = [...new Set(sizes)].filter((s) => s > 0 && s <= 256).sort((a, b) => a - b);
  const pngs = await Promise.all(uniq.map(async (s) => {
    const c = document.createElement('canvas');
    c.width = s; c.height = s;
    const ctx = c.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, s, s);
    return { s, data: new Uint8Array(await (await toBlob(c, 'image/png')).arrayBuffer()) };
  }));
  const header = 6 + pngs.length * 16;
  let offset = header;
  const dir: number[] = [];
  const push32 = (a: number[], n: number) => a.push(n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff);
  for (const p of pngs) {
    dir.push(p.s >= 256 ? 0 : p.s, p.s >= 256 ? 0 : p.s, 0, 0, 1, 0, 32, 0);
    push32(dir, p.data.length);
    push32(dir, offset);
    offset += p.data.length;
  }
  const out = new Uint8Array(offset);
  out.set([0, 0, 1, 0, pngs.length & 0xff, (pngs.length >> 8) & 0xff], 0);
  out.set(dir, 6);
  let o = header;
  for (const p of pngs) { out.set(p.data, o); o += p.data.length; }
  return new Blob([out], { type: 'image/x-icon' });
}

export function encodeGifStill(data: ImageData, maxColors = 256): Blob {
  const bytes = encodeGif([{ rgba: data.data, delayMs: 0 }], { width: data.width, height: data.height, maxColors });
  return new Blob([bytes], { type: 'image/gif' });
}

export async function encodeSvg(canvas: HTMLCanvasElement): Promise<Blob> {
  const dataUrl = (await toBlobDataUrl(canvas, 'image/png'));
  const { width: w, height: h } = canvas;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><image width="${w}" height="${h}" xlink:href="${dataUrl}"/></svg>`;
  return new Blob([svg], { type: 'image/svg+xml' });
}

async function toBlobDataUrl(canvas: HTMLCanvasElement, type: string): Promise<string> {
  const blob = await toBlob(canvas, type);
  return await new Promise<string>((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.readAsDataURL(blob);
  });
}

export async function encodeCanvas(canvas: HTMLCanvasElement, format: RasterFormat, opts: EncodeOpts = {}): Promise<Encoded> {
  const imageData = () => canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
  switch (format) {
    case 'image/jpeg': return { blob: await toBlob(canvas, 'image/jpeg', opts.quality), ext: 'jpg', mime: 'image/jpeg' };
    case 'image/png':  return { blob: await toBlob(canvas, 'image/png'), ext: 'png', mime: 'image/png' };
    case 'image/webp': return { blob: await toBlob(canvas, 'image/webp', opts.quality), ext: 'webp', mime: 'image/webp' };
    case 'image/avif': return { blob: await toBlob(canvas, 'image/avif', opts.quality), ext: 'avif', mime: 'image/avif' };
    case 'bmp':  return { blob: encodeBmp(imageData(), opts.matte || '#ffffff'), ext: 'bmp', mime: 'image/bmp' };
    case 'tiff': return { blob: encodeTiff(imageData()), ext: 'tif', mime: 'image/tiff' };
    case 'gif':  return { blob: encodeGifStill(imageData(), opts.gifColors), ext: 'gif', mime: 'image/gif' };
    case 'psd':  return { blob: encodePsd(imageData()), ext: 'psd', mime: 'image/vnd.adobe.photoshop' };
    case 'ico':  return { blob: await encodeIco(canvas, opts.icoSizes || [16, 32, 48, 64, 128, 256]), ext: 'ico', mime: 'image/x-icon' };
    case 'svg':  return { blob: await encodeSvg(canvas), ext: 'svg', mime: 'image/svg+xml' };
  }
}

if (import.meta.env.DEV && typeof document !== 'undefined') {
  const c = document.createElement('canvas');
  c.width = c.height = 2;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f00'; ctx.fillRect(0, 0, 2, 2);
    const sync: RasterFormat[] = ['bmp', 'tiff', 'gif', 'psd'];
    for (const f of sync) {
      encodeCanvas(c, f).then((e) => console.assert(e.blob.size > 0, `encode ${f} should be non-empty`));
    }
  }
}
