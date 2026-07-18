// Self-host libarchive.js so 7z/rar/bz2/xz/cab/iso/deb extraction makes no
// third-party request at runtime (honors the site's privacy promise). Copies
// the worker bundle + wasm out of node_modules into public/libarchive/. The
// worker fetches libarchive.wasm relative to itself, so both must sit together.
// Run once: node scripts/setup-libarchive.mjs
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
