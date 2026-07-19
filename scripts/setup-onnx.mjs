import { mkdirSync, copyFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dest = resolve(root, 'public/onnx');
mkdirSync(dest, { recursive: true });

const ortDist = resolve(root, 'node_modules/onnxruntime-web/dist');
const ortFiles = ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm'];
for (const f of ortFiles) {
  const src = resolve(ortDist, f);
  if (!existsSync(src)) { console.warn('onnx: missing', f, '- is onnxruntime-web installed?'); continue; }
  copyFileSync(src, resolve(dest, f));
  console.log('copied', f, `(${(statSync(resolve(dest, f)).size / 1024 / 1024).toFixed(1)} MB)`);
}

const MODEL_URL = 'https://essentia.upf.edu/models/feature-extractors/musicnn/msd-musicnn-1.onnx';
const META_URL = 'https://essentia.upf.edu/models/feature-extractors/musicnn/msd-musicnn-1.json';
const modelPath = resolve(dest, 'msd-musicnn.onnx');

async function download(url, out, label) {
  if (existsSync(out) && statSync(out).size > 0) {
    console.log('cached', label, `(${(statSync(out).size / 1024 / 1024).toFixed(1)} MB)`);
    return;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(out, buf);
  console.log('downloaded', label, `(${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
}

try {
  await download(MODEL_URL, modelPath, 'msd-musicnn.onnx');
  const meta = await (await fetch(META_URL)).json();
  writeFileSync(resolve(dest, 'genre-meta.json'), JSON.stringify({
    classes: meta.classes,
    input: meta.schema?.inputs?.[0],
    output: meta.schema?.outputs?.find((o) => o.output_purpose === 'predictions'),
    sampleRate: meta.inference?.sample_rate ?? 16000,
  }, null, 2));
  console.log('onnx genre model ready under public/onnx.');
} catch (e) {
  console.warn('onnx: model download failed (genre detection will be unavailable):', e.message);
}

