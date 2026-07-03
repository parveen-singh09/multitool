// One-off asset generator: renders PNG icons + OG image from inline SVG
// using sharp. Run with `node scripts/gen-assets.mjs`.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');

// Brand city-blocks mark on the near-black canvas.
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#010102"/>
  <rect x="26" y="58" width="22" height="46" rx="5" fill="#5e6ad2"/>
  <rect x="53" y="30" width="22" height="74" rx="5" fill="#828fff"/>
  <rect x="80" y="72" width="22" height="32" rx="5" fill="#5e6ad2"/>
</svg>`;

// 1200x630 Open Graph card.
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#010102"/>
  <rect x="0" y="0" width="1200" height="4" fill="#5e6ad2"/>
  <g transform="translate(90 220)">
    <rect x="0" y="70" width="46" height="96" rx="10" fill="#5e6ad2"/>
    <rect x="58" y="10" width="46" height="156" rx="10" fill="#828fff"/>
    <rect x="116" y="104" width="46" height="62" rx="10" fill="#5e6ad2"/>
  </g>
  <text x="300" y="300" font-family="Inter, SF Pro Display, system-ui, sans-serif" font-size="92" font-weight="700" letter-spacing="-3" fill="#f7f8f8">Tool<tspan fill="#8a8f98">Cities</tspan></text>
  <text x="302" y="372" font-family="Inter, system-ui, sans-serif" font-size="34" font-weight="400" letter-spacing="-0.5" fill="#d0d6e0">Free online tools that run in your browser</text>
  <text x="302" y="430" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="500" letter-spacing="0.4" fill="#5e6ad2">NO SIGN-UP  ·  NO UPLOADS  ·  100% PRIVATE</text>
</svg>`;

async function main() {
  const icon = Buffer.from(iconSvg);

  await sharp(icon).resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'));
  await sharp(icon).resize(192, 192).png().toFile(join(pub, 'icon-192.png'));
  await sharp(icon).resize(512, 512).png().toFile(join(pub, 'icon-512.png'));
  await sharp(icon).resize(32, 32).png().toFile(join(pub, 'favicon.ico'));
  await sharp(Buffer.from(ogSvg)).png().toFile(join(pub, 'og-image.png'));

  console.log('Generated: apple-touch-icon, icon-192, icon-512, favicon.ico, og-image');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
