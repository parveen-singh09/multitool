// Self-host the Tesseract OCR assets so the OCR tool makes no third-party
// requests at runtime (honors the site's privacy promise). Copies the worker
// and WASM core out of node_modules into public/tesseract/, and downloads the
// English language model into public/tessdata/.
// Run once: node scripts/setup-tesseract.mjs
import { mkdirSync, copyFileSync, existsSync, createWriteStream, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Readable } from 'node:stream';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pub = resolve(root, 'public');
const nm = resolve(root, 'node_modules');

const tessDir = resolve(pub, 'tesseract');
const dataDir = resolve(pub, 'tessdata');
mkdirSync(tessDir, { recursive: true });
mkdirSync(dataDir, { recursive: true });

// 1. worker
copyFileSync(resolve(nm, 'tesseract.js/dist/worker.min.js'), resolve(tessDir, 'worker.min.js'));
console.log('copied worker.min.js');

// 2. core (copy every file so tesseract can pick the right SIMD variant)
const coreSrc = resolve(nm, 'tesseract.js-core');
let coreCount = 0;
for (const f of readdirSync(coreSrc)) {
  const src = resolve(coreSrc, f);
  if (statSync(src).isFile() && /\.(js|wasm)$/.test(f)) {
    copyFileSync(src, resolve(tessDir, f));
    coreCount++;
  }
}
console.log(`copied ${coreCount} core files`);

// 3. English model (only if not already present)
const modelPath = resolve(dataDir, 'eng.traineddata.gz');
if (existsSync(modelPath)) {
  console.log('eng.traineddata.gz already present — skipping download');
} else {
  const url = 'https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz';
  console.log('downloading', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('download failed: ' + res.status);
  await new Promise((resolveP, rejectP) => {
    const out = createWriteStream(modelPath);
    Readable.fromWeb(res.body).pipe(out);
    out.on('finish', resolveP);
    out.on('error', rejectP);
  });
  console.log('saved', modelPath, `(${(statSync(modelPath).size / 1024 / 1024).toFixed(1)} MB)`);
}

console.log('Tesseract assets ready under public/tesseract and public/tessdata.');
