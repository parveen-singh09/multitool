// Self-host the ffmpeg.wasm single-thread core so the audio/video tools make
// no third-party requests at runtime (privacy promise) and need no COOP/COEP
// headers. Copies the ESM core + wasm out of node_modules into public/ffmpeg/.
//
// The ESM build (not UMD) is required: @ffmpeg/ffmpeg spawns its worker as a
// module worker (`type: "module"`), where importScripts() is unavailable, so
// the worker loads the core via `(await import(coreURL)).default`. Only the ESM
// core has that default export; the UMD core assigns a global and yields no
// default, which makes the worker throw "failed to import ffmpeg-core.js".
// Run once: node scripts/setup-ffmpeg.mjs
import { mkdirSync, copyFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dest = resolve(root, 'public/ffmpeg');
const src = resolve(root, 'node_modules/@ffmpeg/core/dist/esm');
mkdirSync(dest, { recursive: true });

for (const f of ['ffmpeg-core.js', 'ffmpeg-core.wasm']) {
  copyFileSync(resolve(src, f), resolve(dest, f));
  console.log('copied', f, `(${(statSync(resolve(dest, f)).size / 1024 / 1024).toFixed(1)} MB)`);
}
console.log('ffmpeg core ready under public/ffmpeg.');
