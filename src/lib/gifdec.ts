// Animated-GIF decoder — splits a GIF into per-frame canvases so an uploaded
// .gif imports as editable frames instead of a single still. Pairs with the
// dependency-free encoder in ./gifenc. Prefers the WebCodecs ImageDecoder
// (handles disposal + transparency compositing for us); falls back to drawing
// the GIF once via an <img> when ImageDecoder is unavailable.

export interface DecodedFrame {
  canvas: HTMLCanvasElement;
  delayMs: number;
}

// Draw a source (VideoFrame or image) onto a fresh canvas of the given size.
function toCanvas(
  src: CanvasImageSource,
  w: number,
  h: number,
): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  c.getContext('2d')!.drawImage(src, 0, 0);
  return c;
}

async function decodeViaImageDecoder(blob: Blob): Promise<DecodedFrame[]> {
  const data = await blob.arrayBuffer();
  // ImageDecoder is a WebCodecs global; reference it untyped so this compiles
  // regardless of whether the project's TS lib set includes its typings.
  const Ctor = (globalThis as any).ImageDecoder;
  const dec = new Ctor({ data, type: 'image/gif' });
  await dec.tracks.ready;
  const track = dec.tracks.selectedTrack;
  const count = track?.frameCount ?? 1;
  const frames: DecodedFrame[] = [];
  for (let i = 0; i < count; i++) {
    const { image } = await dec.decode({ frameIndex: i });
    const w = image.displayWidth || image.codedWidth;
    const h = image.displayHeight || image.codedHeight;
    // duration is in microseconds; default to ~100ms when the GIF omits it.
    const delayMs = image.duration ? Math.round(image.duration / 1000) : 100;
    frames.push({ canvas: toCanvas(image, w, h), delayMs: Math.max(20, delayMs) });
    image.close();
  }
  try { dec.close(); } catch { /* ignore */ }
  return frames;
}

function decodeViaImg(blob: Blob): Promise<DecodedFrame[]> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const im = new Image();
    im.onload = () => {
      const c = toCanvas(im, im.naturalWidth, im.naturalHeight);
      URL.revokeObjectURL(url);
      resolve([{ canvas: c, delayMs: 100 }]);
    };
    im.onerror = () => { URL.revokeObjectURL(url); reject(new Error('GIF load failed')); };
    im.src = url;
  });
}

/** Decode an animated GIF into editable frames. Never returns an empty array. */
export async function decodeGif(blob: Blob): Promise<DecodedFrame[]> {
  if (typeof (globalThis as any).ImageDecoder !== 'undefined') {
    try {
      const frames = await decodeViaImageDecoder(blob);
      if (frames.length) return frames;
    } catch { /* fall through to the <img> path */ }
  }
  return decodeViaImg(blob);
}
