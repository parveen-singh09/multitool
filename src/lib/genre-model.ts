

import { fft } from './audio-analysis';

const BASE = '/onnx';
const PATCH_FRAMES = 187;
const N_MELS = 96;
const FRAME_SIZE = 512;
const HOP = 256;
const TARGET_SR = 16000;

export interface GenrePrediction {
  label: string;
  value: number; 
}
export interface GenreResult {
  genres: GenrePrediction[]; 
  moods: GenrePrediction[]; 
  eras: GenrePrediction[]; 
  all: GenrePrediction[]; 
}

const ERA_TAGS = new Set(['60s', '70s', '80s', '90s', '00s', 'oldies']);
const MOOD_TAGS = new Set([
  'beautiful', 'chillout', 'Mellow', 'chill', 'party', 'sexy', 'catchy',
  'sad', 'happy', 'easy listening', 'female vocalists', 'male vocalists',
  'female vocalist', 'instrumental', 'guitar',
]);

interface Meta { classes: string[]; sampleRate: number; }

let ortMod: typeof import('onnxruntime-web') | null = null;
let session: import('onnxruntime-web').InferenceSession | null = null;
let meta: Meta | null = null;
let loadingPromise: Promise<void> | null = null;

export function isGenreModelLoaded(): boolean {
  return !!session && !!meta;
}

export async function loadGenreModel(onProgress?: (note: string) => void): Promise<void> {
  if (session && meta) return;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    onProgress?.('Loading the genre model (~13 MB, first use only)…');
    const ort = await import('onnxruntime-web');

    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmPaths = `${BASE}/`;
    ortMod = ort;
    const [sess, m] = await Promise.all([
      ort.InferenceSession.create(`${BASE}/msd-musicnn.onnx`, { executionProviders: ['wasm'] }),
      fetch(`${BASE}/genre-meta.json`).then((r) => r.json() as Promise<Meta>),
    ]);
    session = sess;
    meta = m;
    onProgress?.('');
  })();
  return loadingPromise;
}

const F_SP = 200 / 3;
const MIN_LOG_HZ = 1000;
const MIN_LOG_MEL = MIN_LOG_HZ / F_SP; 
const LOGSTEP = Math.log(6.4) / 27;

function hzToMel(hz: number): number {
  return hz < MIN_LOG_HZ ? hz / F_SP : MIN_LOG_MEL + Math.log(hz / MIN_LOG_HZ) / LOGSTEP;
}
function melToHz(mel: number): number {
  return mel < MIN_LOG_MEL ? mel * F_SP : MIN_LOG_HZ * Math.exp(LOGSTEP * (mel - MIN_LOG_MEL));
}

function buildMelFilters(): { weights: Float32Array; start: number; end: number }[] {
  const nFftBins = FRAME_SIZE / 2 + 1; 
  const fMin = 0, fMax = 8000;
  const melMin = hzToMel(fMin), melMax = hzToMel(fMax);
  const points = new Float32Array(N_MELS + 2);
  for (let i = 0; i < points.length; i++) points[i] = melToHz(melMin + ((melMax - melMin) * i) / (N_MELS + 1));
  const binHz = TARGET_SR / FRAME_SIZE;
  const filters: { weights: Float32Array; start: number; end: number }[] = [];
  for (let m = 1; m <= N_MELS; m++) {
    const fLeft = points[m - 1], fCenter = points[m], fRight = points[m + 1];
    const weights = new Float32Array(nFftBins);
    const norm = 2 / (fRight - fLeft); 
    let start = nFftBins, end = 0;
    for (let k = 0; k < nFftBins; k++) {
      const f = k * binHz;
      let w = 0;
      if (f >= fLeft && f <= fCenter) w = (f - fLeft) / (fCenter - fLeft);
      else if (f > fCenter && f <= fRight) w = (fRight - f) / (fRight - fCenter);
      if (w > 0) { weights[k] = w * norm; if (k < start) start = k; if (k > end) end = k; }
    }
    filters.push({ weights, start, end });
  }
  return filters;
}

let MEL_FILTERS: ReturnType<typeof buildMelFilters> | null = null;

async function resampleTo16kMono(buf: AudioBuffer): Promise<Float32Array> {
  const durationFrames = Math.ceil((buf.duration * TARGET_SR));
  const OAC = (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext);
  const octx = new OAC(1, durationFrames, TARGET_SR);
  const src = octx.createBufferSource();
  src.buffer = buf;
  src.connect(octx.destination);
  src.start();
  const rendered = await octx.startRendering();
  return rendered.getChannelData(0).slice();
}

function melSpectrogram(mono: Float32Array): Float32Array[] {
  if (!MEL_FILTERS) MEL_FILTERS = buildMelFilters();
  const win = new Float32Array(FRAME_SIZE);
  for (let i = 0; i < FRAME_SIZE; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (FRAME_SIZE - 1));
  const re = new Float32Array(FRAME_SIZE), im = new Float32Array(FRAME_SIZE);
  const nFftBins = FRAME_SIZE / 2 + 1;
  const mag = new Float32Array(nFftBins);
  const frames: Float32Array[] = [];
  for (let off = 0; off + FRAME_SIZE <= mono.length; off += HOP) {
    for (let i = 0; i < FRAME_SIZE; i++) { re[i] = mono[off + i] * win[i]; im[i] = 0; }
    fft(re, im);
    for (let k = 0; k < nFftBins; k++) mag[k] = Math.hypot(re[k], im[k]);
    const melRow = new Float32Array(N_MELS);
    for (let m = 0; m < N_MELS; m++) {
      const { weights, start, end } = MEL_FILTERS[m];
      let s = 0;
      for (let k = start; k <= end; k++) s += mag[k] * weights[k];
      melRow[m] = Math.log10(10000 * s + 1);
    }
    frames.push(melRow);
  }
  return frames;
}

export async function classifyGenre(buf: AudioBuffer): Promise<GenreResult> {
  if (!session || !meta || !ortMod) throw new Error('Genre model not loaded');
  const mono = await resampleTo16kMono(buf);
  const frames = melSpectrogram(mono);
  if (frames.length < PATCH_FRAMES) {
    while (frames.length < PATCH_FRAMES) frames.push(frames[frames.length % Math.max(1, frames.length)] || new Float32Array(N_MELS));
  }

  const nPatches = Math.max(1, Math.floor(frames.length / PATCH_FRAMES));
  const sum = new Float32Array(meta.classes.length);
  const inputName = session.inputNames[0];
  const outputName = session.outputNames[0];

  for (let p = 0; p < nPatches; p++) {
    const patch = new Float32Array(PATCH_FRAMES * N_MELS);
    for (let f = 0; f < PATCH_FRAMES; f++) {
      const row = frames[p * PATCH_FRAMES + f];
      patch.set(row, f * N_MELS);
    }
    const tensor = new ortMod.Tensor('float32', patch, [1, PATCH_FRAMES, N_MELS]);
    const out = await session.run({ [inputName]: tensor });
    const probs = out[outputName].data as Float32Array;
    for (let i = 0; i < sum.length; i++) sum[i] += probs[i];
  }
  for (let i = 0; i < sum.length; i++) sum[i] /= nPatches;

  const preds: GenrePrediction[] = meta.classes.map((label, i) => ({ label, value: sum[i] }));
  const sorted = preds.slice().sort((a, b) => b.value - a.value);
  return {
    all: sorted,
    genres: sorted.filter((p) => !ERA_TAGS.has(p.label) && !MOOD_TAGS.has(p.label)),
    moods: sorted.filter((p) => MOOD_TAGS.has(p.label)),
    eras: sorted.filter((p) => ERA_TAGS.has(p.label)),
  };
}
