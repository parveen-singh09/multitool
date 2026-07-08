// In-browser background removal with the RMBG-1.4 model via onnxruntime-web.
// Lazy-loaded (ORT wasm + ~44 MB quantized model) so pages stay light until the
// user actually removes a background. Nothing is uploaded — inference is local,
// self-hosted wasm, single-threaded (no SharedArrayBuffer / COOP-COEP needed).
//
// RMBG-1.4 preprocessing (must match the original BriaRMBG utils exactly, else
// the net sees out-of-distribution input): resize to 1024x1024 bilinear, scale
// to [0,1], then normalize (x - 0.5) / 1.0  → values in [-0.5, 0.5], CHW order.
// Output is a single-channel matte; min-max normalize to [0,1] for the alpha.

const BASE = '/onnx';
const SIZE = 1024;

let ortMod: typeof import('onnxruntime-web') | null = null;
let session: import('onnxruntime-web').InferenceSession | null = null;
let loadingPromise: Promise<void> | null = null;

export function isBgModelLoaded(): boolean {
  return !!session;
}

export async function loadBgModel(onProgress?: (note: string) => void): Promise<void> {
  if (session) return;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    onProgress?.('Loading the cutout model (~44 MB, first use only)…');
    const ort = await import('onnxruntime-web');
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmPaths = `${BASE}/`;
    ortMod = ort;
    session = await ort.InferenceSession.create(`${BASE}/rmbg-1.4.onnx`, {
      executionProviders: ['wasm'],
    });
  })();
  try {
    await loadingPromise;
  } catch (e) {
    loadingPromise = null; // allow retry on failure
    throw e;
  }
}

// Remove the background from an image, returning a same-size canvas holding the
// subject with a soft alpha matte (background fully transparent).
export async function removeBackground(
  img: HTMLImageElement | HTMLCanvasElement,
  onProgress?: (note: string) => void,
): Promise<HTMLCanvasElement> {
  await loadBgModel(onProgress);
  const ort = ortMod!;
  const sess = session!;

  const w = (img as HTMLImageElement).naturalWidth || img.width;
  const h = (img as HTMLImageElement).naturalHeight || img.height;

  // 1) Resize to 1024x1024 and read pixels.
  const rs = document.createElement('canvas');
  rs.width = SIZE;
  rs.height = SIZE;
  const rctx = rs.getContext('2d')!;
  rctx.drawImage(img, 0, 0, SIZE, SIZE);
  const { data } = rctx.getImageData(0, 0, SIZE, SIZE);

  // 2) Build CHW float tensor, normalized to [-0.5, 0.5].
  const chw = new Float32Array(3 * SIZE * SIZE);
  const plane = SIZE * SIZE;
  for (let i = 0; i < plane; i++) {
    chw[i] = data[i * 4] / 255 - 0.5; // R
    chw[i + plane] = data[i * 4 + 1] / 255 - 0.5; // G
    chw[i + 2 * plane] = data[i * 4 + 2] / 255 - 0.5; // B
  }

  onProgress?.('Cutting out the subject…');
  const feeds: Record<string, import('onnxruntime-web').Tensor> = {
    [sess.inputNames[0]]: new ort.Tensor('float32', chw, [1, 3, SIZE, SIZE]),
  };
  const out = await sess.run(feeds);
  const matte = out[sess.outputNames[0]].data as Float32Array;

  // 3) Min-max normalize the matte to [0,1].
  let mi = Infinity;
  let ma = -Infinity;
  for (let i = 0; i < matte.length; i++) {
    if (matte[i] < mi) mi = matte[i];
    if (matte[i] > ma) ma = matte[i];
  }
  const span = ma - mi || 1;

  // 4) Paint the 1024 matte as a grayscale alpha image, then scale it back to
  //    the original size and use it as the alpha channel of the source image.
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = SIZE;
  maskCanvas.height = SIZE;
  const mctx = maskCanvas.getContext('2d')!;
  const maskImg = mctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < plane; i++) {
    const a = ((matte[i] - mi) / span) * 255;
    maskImg.data[i * 4] = 255;
    maskImg.data[i * 4 + 1] = 255;
    maskImg.data[i * 4 + 2] = 255;
    maskImg.data[i * 4 + 3] = a;
  }
  mctx.putImageData(maskImg, 0, 0);

  // Compose at original resolution: draw the source, then keep only where the
  // (upscaled) matte is opaque via destination-in.
  const outCanvas = document.createElement('canvas');
  outCanvas.width = w;
  outCanvas.height = h;
  const octx = outCanvas.getContext('2d')!;
  octx.drawImage(img, 0, 0, w, h);
  octx.globalCompositeOperation = 'destination-in';
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(maskCanvas, 0, 0, w, h);
  octx.globalCompositeOperation = 'source-over';

  return outCanvas;
}
