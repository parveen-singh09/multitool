// Client-side music analysis engine. Pure DSP, no DOM — safe to import into
// any tool script or a Web Worker. Everything runs on decoded PCM in the
// browser, so audio is never uploaded.
//
// Provides: BPM (onset envelope + autocorrelation), musical key + mode
// (Krumhansl-Schmuckler on a chroma/HPCP profile), Camelot code, integrated
// loudness (ITU-R BS.1770 K-weighted LUFS) with true peak / RMS, spectral
// descriptors (centroid, rolloff, flatness, zero-crossing rate), and derived
// perceptual attributes (energy, danceability, valence/mood).

export interface AnalysisResult {
  duration: number;
  sampleRate: number;
  channels: number;
  bpm: number;
  bpmConfidence: number;
  beatGrid: number[]; // beat times (seconds), best-effort
  key: string; // e.g. "F# minor"
  keyRoot: string; // e.g. "F#"
  mode: 'major' | 'minor';
  keyConfidence: number;
  camelot: string; // e.g. "11A"
  chroma: number[]; // 12 pitch-class energies, normalized 0..1
  loudnessLufs: number; // integrated LUFS (BS.1770)
  peakDb: number; // sample peak in dBFS
  rmsDb: number; // overall RMS in dBFS
  dynamicRange: number; // crest-ish: peak - rms, dB
  spectralCentroid: number; // Hz
  spectralRolloff: number; // Hz (85%)
  spectralFlatness: number; // 0..1 (tonal → noisy)
  zeroCrossingRate: number; // per second
  energy: number; // 0..1
  danceability: number; // 0..1
  valence: number; // 0..1 (musical positivity)
  mood: string; // human label
  emotions: { label: string; value: number }[];
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// ---- FFT (in-place iterative radix-2, N a power of two) ----
export function fft(re: Float32Array, im: Float32Array): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { const tr = re[i]; re[i] = re[j]; re[j] = tr; const ti = im[i]; im[i] = im[j]; im[j] = ti; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cwr = 1, cwi = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = i + k + len / 2;
        const vr = re[b] * cwr - im[b] * cwi;
        const vi = re[b] * cwi + im[b] * cwr;
        re[b] = re[a] - vr; im[b] = im[a] - vi;
        re[a] = re[a] + vr; im[a] = im[a] + vi;
        const ncwr = cwr * wr - cwi * wi; cwi = cwr * wi + cwi * wr; cwr = ncwr;
      }
    }
  }
}

function hann(N: number): Float32Array {
  const w = new Float32Array(N);
  for (let i = 0; i < N; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1));
  return w;
}

// Downmix all channels to a single mono Float32Array.
function toMono(buf: AudioBuffer): Float32Array {
  const ch = buf.numberOfChannels;
  if (ch === 1) return buf.getChannelData(0).slice();
  const n = buf.length;
  const out = new Float32Array(n);
  for (let c = 0; c < ch; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < n; i++) out[i] += d[i];
  }
  for (let i = 0; i < n; i++) out[i] /= ch;
  return out;
}

// ---- Short-time magnitude spectrogram over the whole signal ----
interface Stft {
  frames: Float32Array[]; // magnitude spectra (N/2 bins)
  hop: number;
  N: number;
  frameRate: number; // frames per second
}

function computeStft(mono: Float32Array, sr: number, N = 2048, hop = 512): Stft {
  const win = hann(N);
  const bins = N / 2;
  const frames: Float32Array[] = [];
  const re = new Float32Array(N), im = new Float32Array(N);
  for (let off = 0; off + N <= mono.length; off += hop) {
    for (let i = 0; i < N; i++) { re[i] = mono[off + i] * win[i]; im[i] = 0; }
    fft(re, im);
    const mag = new Float32Array(bins);
    for (let k = 0; k < bins; k++) mag[k] = Math.hypot(re[k], im[k]);
    frames.push(mag);
  }
  return { frames, hop, N, frameRate: sr / hop };
}

// ---- BPM: spectral-flux onset envelope + autocorrelation ----
function detectTempo(stft: Stft): { bpm: number; confidence: number } {
  const { frames, frameRate } = stft;
  if (frames.length < 4) return { bpm: 0, confidence: 0 };

  // Spectral flux: sum of positive magnitude differences per frame.
  const flux = new Float32Array(frames.length);
  for (let f = 1; f < frames.length; f++) {
    let s = 0;
    const cur = frames[f], prev = frames[f - 1];
    for (let k = 0; k < cur.length; k++) {
      const d = cur[k] - prev[k];
      if (d > 0) s += d;
    }
    flux[f] = s;
  }
  // Normalize + subtract a local mean to sharpen onsets.
  const mean = flux.reduce((a, b) => a + b, 0) / flux.length;
  for (let i = 0; i < flux.length; i++) flux[i] = Math.max(0, flux[i] - mean);

  // Autocorrelation over lags matching 50–210 BPM, with a tempo prior
  // (log-Gaussian centered near 120 BPM) to bias octave choice.
  const minBpm = 50, maxBpm = 210;
  const minLag = Math.floor((60 / maxBpm) * frameRate);
  const maxLag = Math.ceil((60 / minBpm) * frameRate);
  let bestLag = 0, bestScore = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    for (let i = lag; i < flux.length; i++) s += flux[i] * flux[i - lag];
    const bpm = (60 * frameRate) / lag;
    const prior = Math.exp(-0.5 * Math.pow(Math.log2(bpm / 120) / 0.9, 2));
    const score = s * prior;
    if (score > bestScore) { bestScore = score; bestLag = lag; }
  }
  if (!bestLag) return { bpm: 0, confidence: 0 };
  let bpm = (60 * frameRate) / bestLag;

  // Confidence: peak sharpness vs. the mean autocorrelation around it.
  let acAtPeak = 0, acMean = 0, cnt = 0;
  for (let i = bestLag; i < flux.length; i++) acAtPeak += flux[i] * flux[i - bestLag];
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    for (let i = lag; i < flux.length; i++) s += flux[i] * flux[i - lag];
    acMean += s; cnt++;
  }
  acMean /= Math.max(1, cnt);
  const confidence = acMean > 0 ? Math.max(0, Math.min(1, (acAtPeak / acMean - 1) / 3)) : 0;

  // Fold into the musically common 70–180 range.
  while (bpm < 70) bpm *= 2;
  while (bpm > 180) bpm /= 2;
  return { bpm: Math.round(bpm * 10) / 10, confidence };
}

// ---- Chroma / HPCP profile over the whole track ----
function computeChroma(stft: Stft, sr: number): number[] {
  const { frames, N } = stft;
  const chroma = new Array(12).fill(0);
  const binHz = sr / N;
  // Ignore sub-bass rumble and content above ~5 kHz (harmonics get noisy).
  const kMin = Math.max(1, Math.floor(55 / binHz));
  const kMax = Math.min(frames[0]?.length ?? 0, Math.floor(5000 / binHz));
  for (const mag of frames) {
    for (let k = kMin; k < kMax; k++) {
      const f = k * binHz;
      const midi = 69 + 12 * Math.log2(f / 440);
      const pc = ((Math.round(midi) % 12) + 12) % 12;
      chroma[pc] += mag[k];
    }
  }
  const max = Math.max(...chroma, 1e-9);
  return chroma.map((v) => v / max);
}

// Krumhansl-Schmuckler key profiles.
const KS_MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const KS_MINOR = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

function pearson(a: number[], b: number[]): number {
  const n = a.length;
  const ma = a.reduce((x, y) => x + y, 0) / n;
  const mb = b.reduce((x, y) => x + y, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    const xa = a[i] - ma, xb = b[i] - mb;
    num += xa * xb; da += xa * xa; db += xb * xb;
  }
  const den = Math.sqrt(da * db);
  return den ? num / den : 0;
}

function detectKey(chroma: number[]): { root: string; mode: 'major' | 'minor'; confidence: number } {
  let best = { root: 'C', mode: 'major' as 'major' | 'minor', score: -Infinity };
  let second = -Infinity;
  for (let rot = 0; rot < 12; rot++) {
    const rotated = chroma.map((_, i) => chroma[(i + rot) % 12]);
    const maj = pearson(rotated, KS_MAJOR);
    const min = pearson(rotated, KS_MINOR);
    if (maj > best.score) { second = best.score; best = { root: NOTE_NAMES[rot], mode: 'major', score: maj }; }
    else if (maj > second) second = maj;
    if (min > best.score) { second = best.score; best = { root: NOTE_NAMES[rot], mode: 'minor', score: min }; }
    else if (min > second) second = min;
  }
  const confidence = Math.max(0, Math.min(1, best.score - Math.max(0, second)));
  return { root: best.root, mode: best.mode, confidence };
}

// Camelot wheel: circle-of-fifths position → code. Major = "B", minor = "A".
const CAMELOT_MAJOR: Record<string, string> = {
  'C': '8B', 'G': '9B', 'D': '10B', 'A': '11B', 'E': '12B', 'B': '1B',
  'F#': '2B', 'C#': '3B', 'G#': '4B', 'D#': '5B', 'A#': '6B', 'F': '7B',
};
const CAMELOT_MINOR: Record<string, string> = {
  'A': '8A', 'E': '9A', 'B': '10A', 'F#': '11A', 'C#': '12A', 'G#': '1A',
  'D#': '2A', 'A#': '3A', 'F': '4A', 'C': '5A', 'G': '6A', 'D': '7A',
};
function toCamelot(root: string, mode: 'major' | 'minor'): string {
  return (mode === 'major' ? CAMELOT_MAJOR : CAMELOT_MINOR)[root] || '—';
}

// ---- ITU-R BS.1770 K-weighting biquad coefficients for arbitrary fs ----
// Recomputed from the analog prototype so LUFS is correct off 48 kHz too.
interface Biquad { b0: number; b1: number; b2: number; a1: number; a2: number; }

function kWeightingFilters(fs: number): [Biquad, Biquad] {
  // Stage 1: high-shelf (pre-filter). Analog design per BS.1770 / pyloudnorm.
  const db = 3.999843853973347;
  const f0 = 1681.974450955533;
  const Q = 0.7071752369554196;
  const K = Math.tan((Math.PI * f0) / fs);
  const Vh = Math.pow(10, db / 20);
  const Vb = Math.pow(Vh, 0.4996667741545416);
  const a0_ = 1 + K / Q + K * K;
  const shelf: Biquad = {
    b0: (Vh + (Vb * K) / Q + K * K) / a0_,
    b1: (2 * (K * K - Vh)) / a0_,
    b2: (Vh - (Vb * K) / Q + K * K) / a0_,
    a1: (2 * (K * K - 1)) / a0_,
    a2: (1 - K / Q + K * K) / a0_,
  };
  // Stage 2: high-pass (RLB).
  const f0b = 38.13547087602444;
  const Qb = 0.5003270373238773;
  const Kb = Math.tan((Math.PI * f0b) / fs);
  const a0b = 1 + Kb / Qb + Kb * Kb;
  const hp: Biquad = {
    b0: 1,
    b1: -2,
    b2: 1,
    a1: (2 * (Kb * Kb - 1)) / a0b,
    a2: (1 - Kb / Qb + Kb * Kb) / a0b,
  };
  return [shelf, hp];
}

function applyBiquad(x: Float32Array, bq: Biquad): Float32Array {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const xn = x[i];
    const yn = bq.b0 * xn + bq.b1 * x1 + bq.b2 * x2 - bq.a1 * y1 - bq.a2 * y2;
    x2 = x1; x1 = xn; y2 = y1; y1 = yn;
    y[i] = yn;
  }
  return y;
}

// Integrated loudness with the two-stage gate (absolute -70 LUFS, relative -10 LU).
function integratedLufs(buf: AudioBuffer): number {
  const fs = buf.sampleRate;
  const [shelf, hp] = kWeightingFilters(fs);
  const ch = buf.numberOfChannels;
  // K-weight each channel.
  const weighted: Float32Array[] = [];
  for (let c = 0; c < ch; c++) weighted.push(applyBiquad(applyBiquad(buf.getChannelData(c), shelf), hp));

  const blockSec = 0.4;
  const step = Math.floor(fs * blockSec * 0.25); // 75% overlap
  const blockLen = Math.floor(fs * blockSec);
  const loudness: number[] = [];
  for (let off = 0; off + blockLen <= weighted[0].length; off += step) {
    let z = 0;
    for (let c = 0; c < ch; c++) {
      const d = weighted[c];
      let ms = 0;
      for (let i = 0; i < blockLen; i++) { const s = d[off + i]; ms += s * s; }
      z += ms / blockLen; // channel weight 1.0 for L/R/mono
    }
    loudness.push(-0.691 + 10 * Math.log10(z + 1e-12));
  }
  if (!loudness.length) return -Infinity;

  // Absolute gate at -70 LUFS.
  const gatedAbs = loudness.filter((l) => l > -70);
  if (!gatedAbs.length) return -Infinity;
  const meanEnergy = (arr: number[]) => arr.reduce((a, l) => a + Math.pow(10, (l + 0.691) / 10), 0) / arr.length;
  const absMean = -0.691 + 10 * Math.log10(meanEnergy(gatedAbs));
  // Relative gate at absMean - 10 LU.
  const relThresh = absMean - 10;
  const gatedRel = gatedAbs.filter((l) => l > relThresh);
  if (!gatedRel.length) return absMean;
  return -0.691 + 10 * Math.log10(meanEnergy(gatedRel));
}

// ---- Spectral descriptors, averaged across frames ----
function spectralFeatures(stft: Stft, sr: number) {
  const { frames, N } = stft;
  const binHz = sr / N;
  let centroid = 0, rolloff = 0, flatness = 0, count = 0;
  for (const mag of frames) {
    let sum = 0, wsum = 0;
    for (let k = 0; k < mag.length; k++) { sum += mag[k]; wsum += mag[k] * k * binHz; }
    if (sum < 1e-6) continue;
    centroid += wsum / sum;
    // 85% spectral rolloff.
    const target = 0.85 * sum; let acc = 0, rk = 0;
    for (let k = 0; k < mag.length; k++) { acc += mag[k]; if (acc >= target) { rk = k; break; } }
    rolloff += rk * binHz;
    // Flatness: geometric mean / arithmetic mean.
    let logSum = 0, arith = 0, n2 = 0;
    for (let k = 1; k < mag.length; k++) { const m = mag[k] + 1e-9; logSum += Math.log(m); arith += m; n2++; }
    const geo = Math.exp(logSum / n2);
    flatness += geo / (arith / n2);
    count++;
  }
  const c = count || 1;
  return { centroid: centroid / c, rolloff: rolloff / c, flatness: flatness / c };
}

function zeroCrossingRate(mono: Float32Array, sr: number): number {
  let cross = 0;
  for (let i = 1; i < mono.length; i++) if ((mono[i - 1] < 0) !== (mono[i] < 0)) cross++;
  return (cross * sr) / mono.length;
}

function rmsPeakDb(mono: Float32Array): { rmsDb: number; peakDb: number } {
  let sq = 0, peak = 0;
  for (let i = 0; i < mono.length; i++) { const a = Math.abs(mono[i]); if (a > peak) peak = a; sq += mono[i] * mono[i]; }
  const rms = Math.sqrt(sq / mono.length);
  return { rmsDb: 20 * Math.log10(rms + 1e-9), peakDb: 20 * Math.log10(peak + 1e-9) };
}

// ---- Derived perceptual attributes (heuristic, 0..1) ----
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function deriveMood(opts: {
  bpm: number; lufs: number; centroid: number; flatness: number;
  mode: 'major' | 'minor'; sr: number;
}) {
  const { bpm, lufs, centroid, flatness, mode, sr } = opts;
  const nyq = sr / 2;
  // Energy: driven by loudness and brightness.
  const loudN = clamp01((lufs + 40) / 40); // -40 LUFS→0, 0→1
  const brightN = clamp01(centroid / (nyq * 0.35));
  const energy = clamp01(0.6 * loudN + 0.25 * brightN + 0.15 * clamp01((bpm - 60) / 120));
  // Danceability: steady, mid-tempo, punchy tracks score high.
  const tempoFit = Math.exp(-0.5 * Math.pow((bpm - 118) / 40, 2));
  const danceability = clamp01(0.55 * tempoFit + 0.25 * loudN + 0.2 * (1 - flatness));
  // Valence: major mode, brightness, moderate-fast tempo read as "positive".
  const modeN = mode === 'major' ? 0.72 : 0.32;
  const valence = clamp01(0.45 * modeN + 0.3 * brightN + 0.25 * clamp01((bpm - 70) / 90));

  // Emotion profile (roughly Russell's circumplex: valence × arousal).
  const arousal = energy;
  const emotions = [
    { label: 'Happy', value: clamp01(valence * 0.7 + arousal * 0.3) },
    { label: 'Energetic', value: clamp01(arousal) },
    { label: 'Relaxed', value: clamp01((1 - arousal) * 0.6 + valence * 0.4) },
    { label: 'Aggressive', value: clamp01(arousal * 0.7 + (1 - valence) * 0.3) },
    { label: 'Sad', value: clamp01((1 - valence) * 0.6 + (1 - arousal) * 0.4) },
  ];
  const mood = emotions.slice().sort((a, b) => b.value - a.value)[0].label;
  return { energy, danceability, valence, mood, emotions };
}

// ---- Top-level analysis ----
export function analyzeBuffer(buf: AudioBuffer): AnalysisResult {
  const sr = buf.sampleRate;
  const mono = toMono(buf);
  const stft = computeStft(mono, sr, 2048, 512);

  const { bpm, confidence: bpmConfidence } = detectTempo(stft);
  const chroma = computeChroma(stft, sr);
  const { root, mode, confidence: keyConfidence } = detectKey(chroma);
  const lufs = integratedLufs(buf);
  const { rmsDb, peakDb } = rmsPeakDb(mono);
  const { centroid, rolloff, flatness } = spectralFeatures(stft, sr);
  const zcr = zeroCrossingRate(mono, sr);
  const derived = deriveMood({ bpm, lufs, centroid, flatness, mode, sr });

  return {
    duration: buf.duration,
    sampleRate: sr,
    channels: buf.numberOfChannels,
    bpm,
    bpmConfidence,
    beatGrid: [],
    key: `${root} ${mode}`,
    keyRoot: root,
    mode,
    keyConfidence,
    camelot: toCamelot(root, mode),
    chroma,
    loudnessLufs: lufs,
    peakDb,
    rmsDb,
    dynamicRange: peakDb - rmsDb,
    spectralCentroid: centroid,
    spectralRolloff: rolloff,
    spectralFlatness: flatness,
    zeroCrossingRate: zcr,
    ...derived,
  };
}

export { NOTE_NAMES };
