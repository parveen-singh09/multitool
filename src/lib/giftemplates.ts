// Built-in animated GIF templates — original, copyright-safe animated backdrops
// generated on the fly (no network, no bundled assets). Each returns per-frame
// canvases in the same shape the decoder produces, so the page can push them
// straight into its frame model and caption them like any other source.

export interface TemplateFrame {
  canvas: HTMLCanvasElement;
  delayMs: number;
}
export interface GifTemplate {
  id: string;
  name: string;
  make(): TemplateFrame[];
}

const W = 480;
const H = 270;

function frame(): { c: HTMLCanvasElement; x: CanvasRenderingContext2D } {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  return { c, x: c.getContext('2d')! };
}

// Deterministic pseudo-random so a template looks the same every time.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hsl = (h: number, s: number, l: number) => `hsl(${h}, ${s}%, ${l}%)`;

/* ------------------------------- templates ------------------------------- */

function confetti(): TemplateFrame[] {
  const N = 20;
  const rnd = mulberry32(7);
  const bits = Array.from({ length: 90 }, () => ({
    x: rnd() * W, y: rnd() * H, vx: (rnd() - 0.5) * 6, vy: 2 + rnd() * 4,
    s: 4 + rnd() * 7, hue: Math.floor(rnd() * 360), rot: rnd() * Math.PI,
  }));
  const out: TemplateFrame[] = [];
  for (let f = 0; f < N; f++) {
    const { c, x } = frame();
    x.fillStyle = '#101018'; x.fillRect(0, 0, W, H);
    for (const b of bits) {
      const y = (b.y + b.vy * f * 3) % (H + 20);
      const px = (b.x + b.vx * f * 3 + W) % W;
      x.save();
      x.translate(px, y); x.rotate(b.rot + f * 0.3);
      x.fillStyle = hsl(b.hue, 85, 60);
      x.fillRect(-b.s / 2, -b.s / 2, b.s, b.s * 0.6);
      x.restore();
    }
    out.push({ canvas: c, delayMs: 70 });
  }
  return out;
}

function colorPulse(): TemplateFrame[] {
  const N = 18;
  const out: TemplateFrame[] = [];
  for (let f = 0; f < N; f++) {
    const { c, x } = frame();
    const hue = (f / N) * 360;
    const g = x.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, hsl(hue, 70, 45));
    g.addColorStop(1, hsl((hue + 90) % 360, 70, 35));
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    out.push({ canvas: c, delayMs: 80 });
  }
  return out;
}

function countdown(): TemplateFrame[] {
  const out: TemplateFrame[] = [];
  for (const n of [3, 2, 1]) {
    for (let s = 0; s < 4; s++) {
      const { c, x } = frame();
      x.fillStyle = '#0b0b12'; x.fillRect(0, 0, W, H);
      const pulse = 1 + Math.sin((s / 4) * Math.PI) * 0.12;
      x.save();
      x.translate(W / 2, H / 2); x.scale(pulse, pulse);
      x.strokeStyle = hsl((n * 40) % 360, 80, 55); x.lineWidth = 8;
      x.beginPath(); x.arc(0, 0, 90, -Math.PI / 2, -Math.PI / 2 + (s / 4) * Math.PI * 2); x.stroke();
      x.fillStyle = '#fff'; x.font = "bold 120px Impact, sans-serif";
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(String(n), 0, 8);
      x.restore();
      out.push({ canvas: c, delayMs: 250 });
    }
  }
  return out;
}

function spinner(): TemplateFrame[] {
  const N = 16;
  const out: TemplateFrame[] = [];
  for (let f = 0; f < N; f++) {
    const { c, x } = frame();
    x.fillStyle = '#0d1117'; x.fillRect(0, 0, W, H);
    x.save(); x.translate(W / 2, H / 2); x.rotate((f / N) * Math.PI * 2);
    for (let i = 0; i < 12; i++) {
      x.rotate((Math.PI * 2) / 12);
      x.globalAlpha = i / 12;
      x.fillStyle = '#5e6ad2';
      x.fillRect(40, -5, 34, 10);
    }
    x.restore();
    out.push({ canvas: c, delayMs: 60 });
  }
  return out;
}

function sparkle(): TemplateFrame[] {
  const N = 16;
  const rnd = mulberry32(21);
  const stars = Array.from({ length: 60 }, () => ({
    x: rnd() * W, y: rnd() * H, ph: rnd() * Math.PI * 2, s: 2 + rnd() * 3,
  }));
  const out: TemplateFrame[] = [];
  for (let f = 0; f < N; f++) {
    const { c, x } = frame();
    const g = x.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W);
    g.addColorStop(0, '#1a1636'); g.addColorStop(1, '#05040c');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (const s of stars) {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(s.ph + (f / N) * Math.PI * 2));
      x.globalAlpha = a; x.fillStyle = '#fff';
      x.beginPath(); x.arc(s.x, s.y, s.s * a, 0, Math.PI * 2); x.fill();
    }
    x.globalAlpha = 1;
    out.push({ canvas: c, delayMs: 90 });
  }
  return out;
}

function rainbowFlash(): TemplateFrame[] {
  const N = 12;
  const out: TemplateFrame[] = [];
  for (let f = 0; f < N; f++) {
    const { c, x } = frame();
    const hue = (f / N) * 360;
    x.fillStyle = hsl(hue, 90, 55); x.fillRect(0, 0, W, H);
    out.push({ canvas: c, delayMs: 90 });
  }
  return out;
}

function zoomPop(): TemplateFrame[] {
  const N = 14;
  const out: TemplateFrame[] = [];
  for (let f = 0; f < N; f++) {
    const { c, x } = frame();
    x.fillStyle = '#101018'; x.fillRect(0, 0, W, H);
    const t = f / (N - 1);
    const r = 20 + t * 220;
    x.save(); x.translate(W / 2, H / 2);
    for (let i = 0; i < 3; i++) {
      x.globalAlpha = Math.max(0, 1 - t) * (1 - i * 0.3);
      x.strokeStyle = hsl((i * 60 + f * 20) % 360, 80, 60);
      x.lineWidth = 10;
      x.beginPath(); x.arc(0, 0, r - i * 30, 0, Math.PI * 2); x.stroke();
    }
    x.restore();
    out.push({ canvas: c, delayMs: 70 });
  }
  return out;
}

function marquee(): TemplateFrame[] {
  const N = 16;
  const out: TemplateFrame[] = [];
  const stripeW = 40;
  for (let f = 0; f < N; f++) {
    const { c, x } = frame();
    const off = (f / N) * stripeW * 2;
    for (let i = -1; i * stripeW < W + stripeW; i++) {
      x.fillStyle = i % 2 === 0 ? '#5e6ad2' : '#151521';
      x.save(); x.translate(off, 0);
      x.beginPath();
      x.moveTo(i * stripeW, 0);
      x.lineTo(i * stripeW + stripeW, 0);
      x.lineTo(i * stripeW + stripeW - H, H);
      x.lineTo(i * stripeW - H, H);
      x.closePath(); x.fill();
      x.restore();
    }
    out.push({ canvas: c, delayMs: 80 });
  }
  return out;
}

export const GIF_TEMPLATES: GifTemplate[] = [
  { id: 'confetti', name: 'Confetti', make: confetti },
  { id: 'color-pulse', name: 'Color pulse', make: colorPulse },
  { id: 'countdown', name: 'Countdown 3·2·1', make: countdown },
  { id: 'spinner', name: 'Loading spinner', make: spinner },
  { id: 'sparkle', name: 'Sparkle', make: sparkle },
  { id: 'rainbow-flash', name: 'Rainbow flash', make: rainbowFlash },
  { id: 'zoom-pop', name: 'Zoom pop', make: zoomPop },
  { id: 'marquee', name: 'Marquee stripes', make: marquee },
];
