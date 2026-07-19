import { mkdirSync, copyFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const nm = resolve(root, 'node_modules');
const outDir = resolve(root, 'public', 'libarchive');
mkdirSync(outDir, { recursive: true });

const src = resolve(nm, 'libarchive.js/dist');
for (const f of ['worker-bundle.js', 'libarchive.wasm']) {
  copyFileSync(resolve(src, f), resolve(outDir, f));
  console.log(`copied ${f} (${(statSync(resolve(outDir, f)).size / 1024).toFixed(0)} KB)`);
}
console.log('libarchive assets ready under public/libarchive.');
