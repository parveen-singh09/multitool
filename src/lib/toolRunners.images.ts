// Canvas/image generator runners — placeholder, avatar, banner, square-face.
// Ported from each tool's real page logic. business-card-generator is omitted:
// it's a genuine multi-field editor (front/back, logo + bg upload, vCard QR,
// drag-to-position) with no sensible one-shot chat result — it stays embed-only.
//
// favicon-generator lives in toolRunners.ts (image-capable version).

import type { Runner, RunFile } from './toolRunners';
import { canvasBlob } from './toolRunners';

// Rasterize an SVG string to a PNG blob at size×size (square). Shared by the
// avatar + square-face runners, both of which produce SVG.
function svgToPng(svg: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = size;
      c.getContext('2d')!.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG render failed')); };
    img.src = url;
  });
}

const rgba = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return `rgba(${parseInt(n.slice(0, 2), 16)},${parseInt(n.slice(2, 4), 16)},${parseInt(n.slice(4, 6), 16)},${a})`;
};

export const RUNNERS_IMAGES: Record<string, Runner> = {
  // --- Placeholder image: extract W×H + optional caption → PNG. --------------
  'placeholder-image-generator': {
    needs: 'text',
    async run({ extract }) {
      const raw = await extract('From the request, return JSON {"w":number,"h":number,"text":string} for a placeholder image. Default w=600 h=400 text="". Return ONLY JSON.');
      let w = 600, h = 400, text = '';
      try { const j = JSON.parse(raw); w = Math.max(16, Math.min(4000, +j.w || 600)); h = Math.max(16, Math.min(4000, +j.h || 400)); text = String(j.text || ''); } catch {}
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#141516'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#8a8f98'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `${Math.max(12, Math.min(w, h) / 8)}px Inter, system-ui, sans-serif`;
      ctx.fillText(text || `${w} × ${h}`, w / 2, h / 2);
      return { files: [{ name: `placeholder-${w}x${h}.png`, blob: await canvasBlob(c), kind: 'image' }], note: `Placeholder ${w}×${h}` };
    },
  },

  // --- Avatar: dicebear avataaars from a seed the user names → PNG. ----------
  // ponytail: seed-driven default; the page's 34-hair/eyes/mouth pickers are the
  // full-tool upgrade.
  'avatar-generator': {
    needs: 'text',
    async run({ extract }) {
      const seed = (await extract('Return ONLY a short seed string for the avatar — a name or word the user gave, else "toolsilk".')) || 'toolsilk';
      const { createAvatar } = await import('@dicebear/core');
      const { avataaars } = await import('@dicebear/collection');
      const svg = createAvatar(avataaars, { seed, size: 512 }).toString();
      return { files: [{ name: 'avatar.png', blob: await svgToPng(svg, 512), kind: 'image' }], note: `Avatar · seed “${seed}”` };
    },
  },

  // --- Banner: classic gradient template, heading + subtext → PNG (OG size). -
  // ponytail: 'classic' template at 1200×630; the page has 11 templates, size
  // presets, and photo upload.
  'banner-generator': {
    needs: 'text',
    async run({ extract }) {
      const raw = await extract('Return JSON {"title":string,"sub":string} for a banner from the request. Default title="Your Brand" sub="". Return ONLY JSON.');
      let title = 'Your Brand', sub = '';
      try { const j = JSON.parse(raw); title = String(j.title || 'Your Brand'); sub = String(j.sub || ''); } catch { title = raw || 'Your Brand'; }
      const w = 1200, h = 630, c1 = '#5e6ad2', c2 = '#010102', fg = '#ffffff';
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      // fitFont: shrink until it fits 86% width.
      let ts = h * 0.22;
      do { ctx.font = `700 ${ts}px Inter, system-ui, sans-serif`; if (ctx.measureText(title).width <= w * 0.86 || ts <= 12) break; ts -= Math.max(1, Math.round(ts * 0.04)); } while (ts > 12);
      ctx.font = `700 ${ts}px Inter, system-ui, sans-serif`;
      ctx.fillText(title, w / 2, h / 2 - (sub ? ts * 0.35 : 0));
      if (sub) { ctx.font = `400 ${ts * 0.42}px Inter, system-ui, sans-serif`; ctx.globalAlpha = 0.9; ctx.fillText(sub, w / 2, h / 2 + ts * 0.55); ctx.globalAlpha = 1; }
      return { files: [{ name: 'banner.png', blob: await canvasBlob(c), kind: 'image' }], note: `Banner 1200×630 · “${title}”` };
    },
  },

  // --- Square face: randomize parts → PNG (the page's 🎲, one-shot). ---------
  // Parts are ported from the page verbatim below.
  'square-face-generator': {
    needs: 'text',
    async run() {
      const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
      const rand = (n: number) => Math.floor(Math.random() * n);
      const svg = buildFaceSvg(rand, pick);
      return { files: [{ name: 'square-face.png', blob: await svgToPng(svg, 1024), kind: 'image' }], note: 'Random square face' };
    },
  },
};

// --- square-face parts (ported from the tool page) ----------------------------
function buildFaceSvg(rand: (n: number) => number, pick: <T>(a: T[]) => T): string {
  const eyes = ['<circle cx="96" cy="120" r="7" fill="{{C}}"/><circle cx="144" cy="120" r="7" fill="{{C}}"/>', '<circle cx="96" cy="120" r="13" fill="#fff" stroke="{{C}}" stroke-width="3"/><circle cx="144" cy="120" r="13" fill="#fff" stroke="{{C}}" stroke-width="3"/><circle cx="98" cy="122" r="6" fill="{{C}}"/><circle cx="146" cy="122" r="6" fill="{{C}}"/>', '<path d="M84 124 q12 -16 24 0" fill="none" stroke="{{C}}" stroke-width="5" stroke-linecap="round"/><path d="M132 124 q12 -16 24 0" fill="none" stroke="{{C}}" stroke-width="5" stroke-linecap="round"/>'];
  const brows = ['', '<line x1="82" y1="100" x2="110" y2="100" stroke="{{C}}" stroke-width="5" stroke-linecap="round"/><line x1="130" y1="100" x2="158" y2="100" stroke="{{C}}" stroke-width="5" stroke-linecap="round"/>', '<rect x="82" y="96" width="28" height="7" rx="3.5" fill="{{C}}"/><rect x="130" y="96" width="28" height="7" rx="3.5" fill="{{C}}"/>'];
  const nose = ['', '<circle cx="120" cy="148" r="4" fill="{{C}}"/>', '<ellipse cx="120" cy="148" rx="8" ry="6" fill="{{C}}"/>'];
  const mouth = ['<path d="M100 168 q20 22 40 0" fill="none" stroke="{{C}}" stroke-width="5" stroke-linecap="round"/>', '<line x1="104" y1="174" x2="136" y2="174" stroke="{{C}}" stroke-width="5" stroke-linecap="round"/>', '<path d="M100 166 q20 26 40 0 z" fill="{{C}}"/>', '<ellipse cx="120" cy="176" rx="16" ry="12" fill="{{C}}"/>'];
  const hair = ['', '<path d="M44 62 l14 -22 12 20 12 -24 12 22 12 -22 12 22 12 -24 12 22 14 -18 v10 H44 z" fill="{{C}}"/>', '<g fill="{{C}}"><circle cx="60" cy="56" r="16"/><circle cx="88" cy="48" r="18"/><circle cx="120" cy="46" r="18"/><circle cx="152" cy="48" r="18"/><circle cx="180" cy="56" r="16"/></g>', '<g fill="{{C}}"><circle cx="60" cy="60" r="22"/><circle cx="90" cy="46" r="24"/><circle cx="120" cy="42" r="26"/><circle cx="150" cy="46" r="24"/><circle cx="180" cy="60" r="22"/><circle cx="72" cy="80" r="18"/><circle cx="168" cy="80" r="18"/></g>'];
  const beard = ['', '<path d="M108 182 q12 18 24 0 q0 18 -12 22 q-12 -4 -12 -22 z" fill="{{C}}"/>', '<path d="M104 160 q16 10 32 0 q-4 8 -16 8 q-12 0 -16 -8 z" fill="{{C}}"/>', '<path d="M76 150 q6 44 44 50 q38 -6 44 -50 q-10 22 -44 22 q-34 0 -44 -22 z" fill="{{C}}"/>'];
  const cheeks = ['', '<ellipse cx="82" cy="150" rx="10" ry="6" fill="{{C}}" opacity="0.5"/><ellipse cx="158" cy="150" rx="10" ry="6" fill="{{C}}" opacity="0.5"/>', '<g fill="{{C}}"><circle cx="80" cy="148" r="2"/><circle cx="88" cy="152" r="2"/><circle cx="160" cy="148" r="2"/><circle cx="152" cy="152" r="2"/></g>'];
  const accessory = ['', '<circle cx="96" cy="120" r="16" fill="none" stroke="{{C}}" stroke-width="4"/><circle cx="144" cy="120" r="16" fill="none" stroke="{{C}}" stroke-width="4"/><line x1="112" y1="118" x2="128" y2="118" stroke="{{C}}" stroke-width="4"/>', '<rect x="80" y="110" width="32" height="20" rx="6" fill="{{C}}"/><rect x="128" y="110" width="32" height="20" rx="6" fill="{{C}}"/><line x1="112" y1="116" x2="128" y2="116" stroke="{{C}}" stroke-width="4"/>'];
  const clothes = ['<path d="M44 210 v-16 q0 -12 24 -14 q14 12 52 12 q38 0 52 -12 q24 2 24 14 v16 z" fill="{{C}}"/>', '<path d="M44 210 v-18 q0 -16 30 -18 q10 14 46 14 q36 0 46 -14 q30 2 30 18 v18 z" fill="{{C}}"/><path d="M74 176 q46 20 92 0 q-6 20 -46 20 q-40 0 -46 -20 z" fill="#00000022"/>'];

  const skins = ['#f2c9a0', '#e8b98c', '#d19a6a', '#a9714b', '#8d5524', '#f7d7c4'];
  const hairCols = ['#3a2b22', '#5b3d2e', '#8a5a2b', '#d6a94b', '#c0392b', '#2c2c34'];
  const cheekCols = ['#e78f8f', '#f0a6a6', '#d98b6b'];
  const clothesCols = ['#5e6ad2', '#c0392b', '#2c7a4b', '#d6a94b', '#2c2c34', '#7d5fff'];
  const DARK = '#1f1f27';

  const skin = pick(skins), hairCol = pick(hairCols);
  // Draw order matches the page: clothes, hair, brows, eyes, nose, cheeks, mouth, beard, accessory.
  const layers: [string[], string][] = [
    [clothes, pick(clothesCols)], [hair, hairCol], [brows, hairCol], [eyes, DARK],
    [nose, skin], [cheeks, pick(cheekCols)], [mouth, DARK], [beard, hairCol], [accessory, DARK],
  ];
  const parts = layers.map(([lib, col]) => lib[rand(lib.length)].replaceAll('{{C}}', col)).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="1024" height="1024">
    <defs><clipPath id="sf-clip"><rect x="6" y="6" width="228" height="228" rx="28"/></clipPath></defs>
    <g clip-path="url(#sf-clip)"><rect x="6" y="6" width="228" height="228" fill="${skin}"/>
    <g transform="translate(-60,-72) scale(1.5)">${parts}</g></g></svg>`;
}
