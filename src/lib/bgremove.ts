

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
    session = await ort.InferenceSession.create(
      'https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model_quantized.onnx',
      { executionProviders: ['wasm'] },
    );
  })();
  try {
    await loadingPromise;
  } catch (e) {
    loadingPromise = null; 
    throw e;
  }
}

export async function removeBackground(
  img: HTMLImageElement | HTMLCanvasElement,
  onProgress?: (note: string) => void,
): Promise<HTMLCanvasElement> {
  await loadBgModel(onProgress);
  const ort = ortMod!;
  const sess = session!;

  const w = (img as HTMLImageElement).naturalWidth || img.width;
  const h = (img as HTMLImageElement).naturalHeight || img.height;

  const rs = document.createElement('canvas');
  rs.width = SIZE;
  rs.height = SIZE;
  const rctx = rs.getContext('2d')!;
  rctx.drawImage(img, 0, 0, SIZE, SIZE);
  const { data } = rctx.getImageData(0, 0, SIZE, SIZE);

  const chw = new Float32Array(3 * SIZE * SIZE);
  const plane = SIZE * SIZE;
  for (let i = 0; i < plane; i++) {
    chw[i] = data[i * 4] / 255 - 0.5; 
    chw[i + plane] = data[i * 4 + 1] / 255 - 0.5; 
    chw[i + 2 * plane] = data[i * 4 + 2] / 255 - 0.5; 
  }

  onProgress?.('Cutting out the subject…');
  const feeds: Record<string, import('onnxruntime-web').Tensor> = {
    [sess.inputNames[0]]: new ort.Tensor('float32', chw, [1, 3, SIZE, SIZE]),
  };
  const out = await sess.run(feeds);
  const matte = out[sess.outputNames[0]].data as Float32Array;

  let mi = Infinity;
  let ma = -Infinity;
  for (let i = 0; i < matte.length; i++) {
    if (matte[i] < mi) mi = matte[i];
    if (matte[i] > ma) ma = matte[i];
  }
  const span = ma - mi || 1;

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
