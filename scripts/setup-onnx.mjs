// Self-host the ONNX Runtime Web (wasm backend) and the MSD-MusiCNN genre model
// so the Music Analyzer makes no third-party requests at runtime (privacy
// promise) and needs no COOP/COEP headers. We ship the SIMD wasm and run it
// single-threaded (ort.env.wasm.numThreads = 1), which avoids SharedArrayBuffer.
//
// - ORT runtime glue + wasm are copied out of node_modules/onnxruntime-web.
// - The model is a single .onnx file (no fragile zip) fetched once from the
//   Essentia model zoo and cached under public/onnx. The class list + input
//   spec live in the sibling metadata JSON, saved alongside as genre-meta.json.
// Run: node scripts/setup-onnx.mjs
import { mkdirSync, copyFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dest = resolve(root, 'public/onnx');
mkdirSync(dest, { recursive: true });

// 1) Copy the ORT wasm runtime (glue .mjs + .wasm) from node_modules.
const ortDist = resolve(root, 'node_modules/onnxruntime-web/dist');
const ortFiles = ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm'];
for (const f of ortFiles) {
  const src = resolve(ortDist, f);
  if (!existsSync(src)) { console.warn('onnx: missing', f, '- is onnxruntime-web installed?'); continue; }
  copyFileSync(src, resolve(dest, f));
  console.log('copied', f, `(${(statSync(resolve(dest, f)).size / 1024 / 1024).toFixed(1)} MB)`);
}

// 2) Fetch the model + metadata once (cached).
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
  // Distill the metadata down to what the browser needs: class list + io spec.
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
