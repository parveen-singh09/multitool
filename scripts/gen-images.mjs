import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = resolve(__dirname, '..', 'public');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0c15"/>
      <stop offset="1" stop-color="#010102"/>
    </linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="1" fill="url(#edge)"/>

  <!-- city blocks mark -->
  <g transform="translate(96 210)">
    <rect x="0" y="70" width="52" height="110" rx="12" fill="#5e6ad2"/>
    <rect x="64" y="0" width="52" height="180" rx="12" fill="#828fff"/>
    <rect x="128" y="112" width="52" height="68" rx="12" fill="#5e6ad2"/>
  </g>

  <!-- wordmark -->
  <text x="96" y="470" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="88" font-weight="700" letter-spacing="-3" fill="#f7f8f8">Tool<tspan fill="#8a8f98">Cities</tspan></text>

  <!-- tagline -->
  <text x="98" y="536" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="34" font-weight="400" letter-spacing="-0.5" fill="#d0d6e0">Free online tools that run in your browser</text>

  <!-- pill -->
  <g transform="translate(98 566)">
    <rect x="0" y="0" width="360" height="40" rx="20" fill="#141516" stroke="#23252a"/>
    <circle cx="24" cy="20" r="4" fill="#27a644"/>
    <text x="40" y="27" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="18" font-weight="500" fill="#8a8f98">No sign-up · No uploads · 100% private</text>
  </g>
</svg>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="28" fill="#010102"/>
  <rect x="26" y="58" width="22" height="46" rx="5" fill="#5e6ad2"/>
  <rect x="53" y="30" width="22" height="74" rx="5" fill="#828fff"/>
  <rect x="80" y="72" width="22" height="32" rx="5" fill="#5e6ad2"/>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(resolve(pub, 'og-image.png'));
await sharp(Buffer.from(icon)).png().toFile(resolve(pub, 'apple-touch-icon.png'));
console.log('Generated og-image.png (1200x630) and apple-touch-icon.png (180x180)');
