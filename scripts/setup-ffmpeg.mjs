// Self-host the ffmpeg.wasm single-thread core so the audio/video tools make
// no third-party requests at runtime (privacy promise) and need no COOP/COEP
// headers. Copies the UMD core + wasm out of node_modules into public/ffmpeg/.
// Run once: node scripts/setup-ffmpeg.mjs
import { mkdirSync, copyFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dest = resolve(root, 'public/ffmpeg');
const src = resolve(root, 'node_modules/@ffmpeg/core/dist/umd');
mkdirSync(dest, { recursive: true });

for (const f of ['ffmpeg-core.js', 'ffmpeg-core.wasm']) {
  copyFileSync(resolve(src, f), resolve(dest, f));
  console.log('copied', f, `(${(statSync(resolve(dest, f)).size / 1024 / 1024).toFixed(1)} MB)`);
}
console.log('ffmpeg core ready under public/ffmpeg.');
