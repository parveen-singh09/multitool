

class Bytes {
  private a: number[] = [];
  byte(v: number) { this.a.push(v & 0xff); }
  bytes(vs: number[] | Uint8Array) { for (const v of vs) this.a.push(v & 0xff); }
  word(v: number) { this.a.push(v & 0xff, (v >> 8) & 0xff); } 
  str(s: string) { for (let i = 0; i < s.length; i++) this.a.push(s.charCodeAt(i) & 0xff); }
  get length() { return this.a.length; }
  toUint8() { return Uint8Array.from(this.a); }
}

interface Box { keys: number[]; }

const binKey = (r: number, g: number, b: number) => ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
const binR = (k: number) => (((k >> 10) & 31) << 3) | 4;
const binG = (k: number) => (((k >> 5) & 31) << 3) | 4;
const binB = (k: number) => ((k & 31) << 3) | 4;

export interface Quantized {
  palette: number[]; 
  indices: Uint8Array; 
}

export function quantize(rgba: Uint8ClampedArray, maxColors: number): Quantized {
  maxColors = Math.max(2, Math.min(256, maxColors));
  const counts = new Map<number, number>();
  for (let i = 0; i < rgba.length; i += 4) {
    const k = binKey(rgba[i], rgba[i + 1], rgba[i + 2]);
    counts.set(k, (counts.get(k) || 0) + 1);
  }

  let boxes: Box[] = [{ keys: [...counts.keys()] }];

  const countOf = (box: Box) => box.keys.reduce((s, k) => s + counts.get(k)!, 0);

  const splitBox = (box: Box): [Box, Box] | null => {
    if (box.keys.length < 2) return null;

    let rmin = 255, rmax = 0, gmin = 255, gmax = 0, bmin = 255, bmax = 0;
    for (const k of box.keys) {
      const r = binR(k), g = binG(k), b = binB(k);
      if (r < rmin) rmin = r; if (r > rmax) rmax = r;
      if (g < gmin) gmin = g; if (g > gmax) gmax = g;
      if (b < bmin) bmin = b; if (b > bmax) bmax = b;
    }
    const rr = rmax - rmin, gr = gmax - gmin, br = bmax - bmin;
    const ch = rr >= gr && rr >= br ? 'r' : gr >= br ? 'g' : 'b';
    const val = ch === 'r' ? binR : ch === 'g' ? binG : binB;
    const sorted = box.keys.slice().sort((x, y) => val(x) - val(y));

    const total = countOf(box);
    let acc = 0, cut = 0;
    for (let i = 0; i < sorted.length; i++) {
      acc += counts.get(sorted[i])!;
      if (acc >= total / 2) { cut = i; break; }
    }
    cut = Math.max(0, Math.min(cut, sorted.length - 2));
    return [{ keys: sorted.slice(0, cut + 1) }, { keys: sorted.slice(cut + 1) }];
  };

  while (boxes.length < maxColors) {

    let best = -1, bestCount = -1;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].keys.length < 2) continue;
      const c = countOf(boxes[i]);
      if (c > bestCount) { bestCount = c; best = i; }
    }
    if (best < 0) break;
    const res = splitBox(boxes[best]);
    if (!res) break;
    boxes.splice(best, 1, res[0], res[1]);
  }

  const palette: number[] = [];
  const binToIndex = new Map<number, number>();
  boxes.forEach((box, idx) => {
    let sr = 0, sg = 0, sb = 0, n = 0;
    for (const k of box.keys) {
      const c = counts.get(k)!;
      sr += binR(k) * c; sg += binG(k) * c; sb += binB(k) * c; n += c;
      binToIndex.set(k, idx);
    }
    n = n || 1;
    palette.push(Math.round(sr / n), Math.round(sg / n), Math.round(sb / n));
  });

  const paletteCount = palette.length / 3;
  const nearestCache = new Map<number, number>(binToIndex);
  const nearest = (r: number, g: number, b: number, k: number): number => {
    const cached = nearestCache.get(k);
    if (cached !== undefined) return cached;
    let best = 0, bestD = Infinity;
    for (let p = 0; p < paletteCount; p++) {
      const dr = r - palette[p * 3], dg = g - palette[p * 3 + 1], db = b - palette[p * 3 + 2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bestD) { bestD = d; best = p; }
    }
    nearestCache.set(k, best);
    return best;
  };

  const indices = new Uint8Array(rgba.length / 4);
  for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
    const r = rgba[i], g = rgba[i + 1], b = rgba[i + 2];
    indices[p] = nearest(r, g, b, binKey(r, g, b));
  }

  return { palette, indices };
}

function lzwEncode(minCodeSize: number, pixels: Uint8Array): number[] {
  const clear = 1 << minCodeSize;
  const eoi = clear + 1;
  let codeSize = minCodeSize + 1;
  let next = clear + 2;
  let dict = new Map<number, number>();

  const out: number[] = [];
  let accum = 0, nbits = 0;
  const put = (code: number) => {
    accum |= code << nbits;
    nbits += codeSize;
    while (nbits >= 8) { out.push(accum & 0xff); accum >>= 8; nbits -= 8; }
  };

  put(clear);
  let prefix = pixels[0];
  for (let i = 1; i < pixels.length; i++) {
    const k = pixels[i];
    const key = (prefix << 8) | k;
    const found = dict.get(key);
    if (found !== undefined) {
      prefix = found;
    } else {
      put(prefix);
      if (next === 4096) {
        put(clear);
        dict = new Map();
        codeSize = minCodeSize + 1;
        next = clear + 2;
      } else {
        dict.set(key, next);

        if (next === (1 << codeSize) && codeSize < 12) codeSize++;
        next++;
      }
      prefix = k;
    }
  }
  put(prefix);
  put(eoi);
  if (nbits > 0) out.push(accum & 0xff);
  return out;
}

export interface GifFrameInput {
  rgba: Uint8ClampedArray;
  delayMs: number; 
}

export interface GifOptions {
  width: number;
  height: number;
  loop?: number; 
  maxColors?: number; 
}

export function encodeGif(frames: GifFrameInput[], opts: GifOptions): Uint8Array {
  const { width, height } = opts;
  const loop = opts.loop ?? 0;
  const maxColors = opts.maxColors ?? 256;
  const b = new Bytes();

  b.str('GIF89a');
  b.word(width);
  b.word(height);
  b.byte(0x70); 
  b.byte(0); 
  b.byte(0); 

  b.byte(0x21); b.byte(0xff); b.byte(0x0b);
  b.str('NETSCAPE2.0');
  b.byte(0x03); b.byte(0x01);
  b.word(loop);
  b.byte(0x00);

  for (const frame of frames) {
    const { palette, indices } = quantize(frame.rgba, maxColors);
    const colors = palette.length / 3;

    let sizeField = 0;
    while (1 << (sizeField + 1) < colors) sizeField++;
    const size = 1 << (sizeField + 1); 

    const minCodeSize = Math.max(2, sizeField + 1);

    b.byte(0x21); b.byte(0xf9); b.byte(0x04);
    b.byte(0x00); 
    b.word(Math.max(2, Math.round(frame.delayMs / 10)));
    b.byte(0x00); 
    b.byte(0x00); 

    b.byte(0x2c);
    b.word(0); b.word(0); 
    b.word(width); b.word(height);
    b.byte(0x80 | sizeField); 

    for (let i = 0; i < size; i++) {
      if (i < colors) b.bytes([palette[i * 3], palette[i * 3 + 1], palette[i * 3 + 2]]);
      else b.bytes([0, 0, 0]);
    }

    b.byte(minCodeSize);
    const data = lzwEncode(minCodeSize, indices);
    for (let i = 0; i < data.length; i += 255) {
      const chunk = data.slice(i, i + 255);
      b.byte(chunk.length);
      b.bytes(chunk);
    }
    b.byte(0x00); 
  }

  b.byte(0x3b); 
  return b.toUint8();
}
