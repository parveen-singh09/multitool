// ffmpeg core is loaded from jsDelivr at runtime (see src/lib/ffmpeg.ts): its
// 30.7 MB core.wasm exceeds Cloudflare Pages' 25 MB/file cap, so it can't live
// in the asset bundle. Nothing to copy — kept as a no-op so the existing
// pre{dev,build} hooks that call this script don't break.
console.log('ffmpeg core served from CDN — nothing to copy.');
