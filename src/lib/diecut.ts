

export interface DieCutOptions {
  border: number; 
  borderColor: string; 
  alphaThreshold?: number; 
}

export function distanceTransform(inside: Uint8Array, w: number, h: number): Float32Array {
  const INF = 1e9;
  const d = new Float32Array(w * h);
  for (let i = 0; i < d.length; i++) d[i] = inside[i] ? 0 : INF;

  const D1 = 1; 
  const D2 = Math.SQRT2; 

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + D1);
      if (y > 0) v = Math.min(v, d[i - w] + D1);
      if (x > 0 && y > 0) v = Math.min(v, d[i - w - 1] + D2);
      if (x < w - 1 && y > 0) v = Math.min(v, d[i - w + 1] + D2);
      d[i] = v;
    }
  }

  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      let v = d[i];
      if (x < w - 1) v = Math.min(v, d[i + 1] + D1);
      if (y < h - 1) v = Math.min(v, d[i + w] + D1);
      if (x < w - 1 && y < h - 1) v = Math.min(v, d[i + w + 1] + D2);
      if (x > 0 && y < h - 1) v = Math.min(v, d[i + w - 1] + D2);
      d[i] = v;
    }
  }
  return d;
}

export function buildDieCut(
  src: HTMLCanvasElement | HTMLImageElement,
  opts: DieCutOptions,
): HTMLCanvasElement {
  const border = Math.max(0, Math.round(opts.border));
  const thr = opts.alphaThreshold ?? 128;
  const sw = (src as HTMLImageElement).naturalWidth || src.width;
  const sh = (src as HTMLImageElement).naturalHeight || src.height;

  const pad = border + 2;
  const w = sw + pad * 2;
  const h = sh + pad * 2;

  const work = document.createElement('canvas');
  work.width = w;
  work.height = h;
  const wctx = work.getContext('2d')!;
  wctx.drawImage(src, pad, pad, sw, sh);
  const srcData = wctx.getImageData(0, 0, w, h);

  if (border > 0) {

    const inside = new Uint8Array(w * h);
    for (let i = 0; i < inside.length; i++) inside[i] = srcData.data[i * 4 + 3] > thr ? 1 : 0;
    const dist = distanceTransform(inside, w, h);

    const [br, bg, bb] = hexToRgb(opts.borderColor);
    const outline = wctx.createImageData(w, h);
    for (let i = 0; i < dist.length; i++) {
      if (dist[i] <= border) {
        outline.data[i * 4] = br;
        outline.data[i * 4 + 1] = bg;
        outline.data[i * 4 + 2] = bb;

        const edge = border - dist[i];
        outline.data[i * 4 + 3] = edge >= 1 ? 255 : Math.round(edge * 255);
      }
    }
    const outlineCanvas = document.createElement('canvas');
    outlineCanvas.width = w;
    outlineCanvas.height = h;
    outlineCanvas.getContext('2d')!.putImageData(outline, 0, 0);

    const outCtx = document.createElement('canvas').getContext('2d')!;
    const composed = outCtx.canvas;
    composed.width = w;
    composed.height = h;
    outCtx.drawImage(outlineCanvas, 0, 0);
    outCtx.drawImage(work, 0, 0);
    return composed;
  }

  return work;
}

export function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '');
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function demo(): void {
  const w = 5;
  const h = 5;
  const inside = new Uint8Array(w * h);
  inside[2 * w + 2] = 1; 
  const d = distanceTransform(inside, w, h);
  const at = (x: number, y: number) => d[y * w + x];
  console.assert(at(2, 2) === 0, 'center should be 0');
  console.assert(at(3, 2) === 1, 'orthogonal neighbor should be 1');
  console.assert(Math.abs(at(3, 3) - Math.SQRT2) < 1e-6, 'diagonal should be √2');
  console.assert(at(4, 2) === 2, 'two orthogonal steps should be 2');
  console.assert(Math.abs(hexToRgb('#ff8000')[0] - 255) < 1 && hexToRgb('#f80')[1] === 0x88, 'hex parse');
  console.log('diecut self-check passed');
}
