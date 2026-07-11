// QR rendering + payload building beyond what the `qrcode` lib draws.
// The lib only emits flat black squares; we pull its raw module matrix and
// render custom dot/eye shapes, gradients and a center logo ourselves, and
// share the geometry between a canvas sink (PNG) and an SVG-string sink.
import QRCode from 'qrcode';

export type EC = 'L' | 'M' | 'Q' | 'H';
export type DotStyle = 'square' | 'rounded' | 'extra-rounded' | 'dots' | 'diamond';
export type EyeFrame = 'square' | 'rounded' | 'circle';
export type EyeBall = 'square' | 'rounded' | 'circle';
export type GradientType = 'none' | 'linear' | 'radial';

export interface QRPaint {
  fg: string;
  gradient: GradientType;
  gradTo: string;
  gradRotation: number; // degrees, linear only
}

export interface QROptions {
  ec: EC;
  margin: number; // quiet-zone in modules
  dot: DotStyle;
  eyeFrame: EyeFrame;
  eyeBall: EyeBall;
  paint: QRPaint;
  eyeColor: string | null; // null = use body color
  bg: string | null; // null = transparent
  logo: HTMLImageElement | null;
  logoRatio: number; // 0..0.4 fraction of QR width
}

export const DEFAULT_OPTIONS: QROptions = {
  ec: 'M',
  margin: 2,
  dot: 'square',
  eyeFrame: 'square',
  eyeBall: 'square',
  paint: { fg: '#010102', gradient: 'none', gradTo: '#5e6ad2', gradRotation: 45 },
  eyeColor: null,
  bg: '#ffffff',
  logo: null,
  logoRatio: 0.22,
};

// ---- payload builders ------------------------------------------------------

const esc = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');

export interface Fields {
  [k: string]: string | boolean | undefined;
}

export function buildPayload(type: string, f: Fields): string {
  const s = (k: string) => String(f[k] ?? '').trim();
  switch (type) {
    case 'url': {
      const u = s('url');
      if (!u) return '';
      return /^[a-z][a-z0-9+.-]*:\/\//i.test(u) ? u : `https://${u}`;
    }
    case 'text':
      return s('text');
    case 'email': {
      const to = s('email');
      const q = new URLSearchParams();
      if (s('subject')) q.set('subject', s('subject'));
      if (s('body')) q.set('body', s('body'));
      const qs = q.toString();
      return `mailto:${to}${qs ? '?' + qs : ''}`;
    }
    case 'phone':
      return `tel:${s('phone')}`;
    case 'sms':
      return `SMSTO:${s('phone')}:${s('message')}`;
    case 'wifi':
      return `WIFI:T:${s('encryption') || 'WPA'};S:${esc(s('ssid'))};P:${esc(s('password'))};${
        f.hidden ? 'H:true;' : ''
      };`;
    case 'geo':
      return `geo:${s('lat')},${s('lng')}`;
    case 'bitcoin': {
      const amt = s('amount');
      return `bitcoin:${s('address')}${amt ? '?amount=' + amt : ''}`;
    }
    case 'vcard': {
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${s('lastName')};${s('firstName')};;;`,
        `FN:${(s('firstName') + ' ' + s('lastName')).trim()}`,
      ];
      if (s('org')) lines.push(`ORG:${s('org')}`);
      if (s('title')) lines.push(`TITLE:${s('title')}`);
      if (s('phone')) lines.push(`TEL;TYPE=WORK,VOICE:${s('phone')}`);
      if (s('email')) lines.push(`EMAIL:${s('email')}`);
      if (s('url')) lines.push(`URL:${s('url')}`);
      if (s('address')) lines.push(`ADR;TYPE=WORK:;;${s('address')};;;;`);
      lines.push('END:VCARD');
      return lines.join('\n');
    }
    case 'event': {
      const dt = (v: string) => v.replace(/[-:]/g, '').replace(/\.\d+/, '');
      const lines = ['BEGIN:VEVENT', `SUMMARY:${s('title')}`];
      if (s('location')) lines.push(`LOCATION:${s('location')}`);
      if (s('start')) lines.push(`DTSTART:${dt(s('start'))}`);
      if (s('end')) lines.push(`DTEND:${dt(s('end'))}`);
      lines.push('END:VEVENT');
      return lines.join('\n');
    }
    default:
      return s('text');
  }
}

// ---- geometry --------------------------------------------------------------

// A drawing sink: canvas or SVG. Coordinates are in device pixels.
interface Sink {
  useFill(paint: string): void; // paint = css color OR gradient ref
  rect(x: number, y: number, w: number, h: number, r?: number): void;
  circle(cx: number, cy: number, radius: number): void;
}

const isFinder = (r: number, c: number, size: number) => {
  const inBox = (br: number, bc: number) =>
    r >= br && r < br + 7 && c >= bc && c < bc + 7;
  return inBox(0, 0) || inBox(0, size - 7) || inBox(size - 7, 0);
};

// Draw the body modules (everything except the three finder patterns).
function drawBody(
  sink: Sink,
  mods: { size: number; get: (r: number, c: number) => number },
  cell: number,
  off: number,
  style: DotStyle
) {
  const size = mods.size;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!mods.get(r, c) || isFinder(r, c, size)) continue;
      const x = off + c * cell;
      const y = off + r * cell;
      switch (style) {
        case 'dots':
          sink.circle(x + cell / 2, y + cell / 2, cell * 0.42);
          break;
        case 'rounded':
          sink.rect(x, y, cell, cell, cell * 0.28);
          break;
        case 'extra-rounded':
          sink.rect(x, y, cell, cell, cell * 0.5);
          break;
        case 'diamond':
          // square rotated 45° ≈ circle sink can't do; approximate with small rect radius
          sink.rect(x + cell * 0.12, y + cell * 0.12, cell * 0.76, cell * 0.76, cell * 0.18);
          break;
        default:
          sink.rect(x, y, cell, cell);
      }
    }
  }
}

// Draw one finder pattern (7x7 frame + 3x3 ball) at module row/col origin.
function drawEye(
  sink: Sink,
  br: number,
  bc: number,
  cell: number,
  off: number,
  frame: EyeFrame,
  ball: EyeBall,
  frameColor: string,
  ballColor: string
) {
  const x = off + bc * cell;
  const y = off + br * cell;
  const s = 7 * cell;

  sink.useFill(frameColor);
  if (frame === 'circle') {
    // ring: outer circle minus inner. Sink has no even-odd; draw thick ring via two circles won't subtract.
    // Emulate ring with a stroked look: outer filled circle then punch bg? Instead draw square-ring of dots.
    // Simpler: rounded frame with large radius reads as circle.
    sink.rect(x, y, s, s, s / 2);
    sink.useFill('__ERASE__');
    sink.rect(x + cell, y + cell, 5 * cell, 5 * cell, (5 * cell) / 2);
    sink.useFill(frameColor);
  } else {
    const fr = frame === 'rounded' ? cell * 1.5 : 0;
    sink.rect(x, y, s, s, fr);
    sink.useFill('__ERASE__');
    sink.rect(x + cell, y + cell, 5 * cell, 5 * cell, Math.max(0, fr - cell));
    sink.useFill(frameColor);
  }

  // ball 3x3 centered
  sink.useFill(ballColor);
  const bx = x + 2 * cell;
  const by = y + 2 * cell;
  const bs = 3 * cell;
  if (ball === 'circle') sink.circle(bx + bs / 2, by + bs / 2, bs / 2);
  else sink.rect(bx, by, bs, bs, ball === 'rounded' ? cell : 0);
}

interface Rendered {
  mods: { size: number; get: (r: number, c: number) => number };
  cell: number;
  off: number;
  px: number;
}

function layout(text: string, opts: QROptions, targetPx: number): Rendered {
  const qr = QRCode.create(text || ' ', { errorCorrectionLevel: opts.ec });
  const mods = qr.modules as any;
  const total = mods.size + opts.margin * 2;
  const cell = Math.floor(targetPx / total) || 1;
  const px = cell * total;
  const off = opts.margin * cell;
  return { mods, cell, off, px };
}

// ---- canvas renderer -------------------------------------------------------

export function renderToCanvas(canvas: HTMLCanvasElement, text: string, opts: QROptions, targetPx = 1024) {
  const { mods, cell, off, px } = layout(text, opts, targetPx);
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, px, px);
  if (opts.bg) {
    ctx.fillStyle = opts.bg;
    ctx.fillRect(0, 0, px, px);
  }

  const bodyPaint = () => {
    if (opts.paint.gradient === 'none') return opts.paint.fg;
    if (opts.paint.gradient === 'radial') {
      const g = ctx.createRadialGradient(px / 2, px / 2, px * 0.05, px / 2, px / 2, px * 0.6);
      g.addColorStop(0, opts.paint.fg);
      g.addColorStop(1, opts.paint.gradTo);
      return g;
    }
    const a = (opts.paint.gradRotation * Math.PI) / 180;
    const g = ctx.createLinearGradient(
      px / 2 - (Math.cos(a) * px) / 2,
      px / 2 - (Math.sin(a) * px) / 2,
      px / 2 + (Math.cos(a) * px) / 2,
      px / 2 + (Math.sin(a) * px) / 2
    );
    g.addColorStop(0, opts.paint.fg);
    g.addColorStop(1, opts.paint.gradTo);
    return g;
  };

  const sink: Sink = {
    useFill(paint) {
      if (paint === '__ERASE__') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = paint === '__BODY__' ? (bodyPaint() as any) : paint;
      }
    },
    rect(x, y, w, h, r = 0) {
      ctx.beginPath();
      if (r > 0) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
      ctx.fill();
    },
    circle(cx, cy, radius) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    },
  };

  sink.useFill('__BODY__');
  drawBody(sink, mods, cell, off, opts.dot);

  const eyeColor = opts.eyeColor || (opts.paint.gradient === 'none' ? opts.paint.fg : opts.paint.fg);
  const size = mods.size;
  for (const [br, bc] of [[0, 0], [0, size - 7], [size - 7, 0]] as const) {
    drawEye(sink, br, bc, cell, off, opts.eyeFrame, opts.eyeBall, eyeColor, eyeColor);
  }
  ctx.globalCompositeOperation = 'source-over';

  if (opts.logo) {
    const lw = px * opts.logoRatio;
    const lx = (px - lw) / 2;
    // knock out a padded square so the logo sits on a clean field
    const pad = lw * 0.12;
    if (opts.bg) {
      ctx.fillStyle = opts.bg;
      ctx.fillRect(lx - pad, lx - pad, lw + pad * 2, lw + pad * 2);
    } else {
      ctx.clearRect(lx - pad, lx - pad, lw + pad * 2, lw + pad * 2);
    }
    ctx.drawImage(opts.logo, lx, lx, lw, lw);
  }
  return px;
}

// ---- SVG renderer ----------------------------------------------------------

export function renderToSvg(text: string, opts: QROptions, targetPx = 1024): string {
  const { mods, cell, off, px } = layout(text, opts, targetPx);
  const body: string[] = [];
  const eyes: string[] = [];
  const defs: string[] = [];

  const round = (n: number) => Math.round(n * 100) / 100;
  let cur: string[] = body;
  let fill = 'black';

  const sink: Sink = {
    useFill(paint) {
      if (paint === '__ERASE__') fill = opts.bg || '#ffffff';
      else if (paint === '__BODY__') fill = 'url(#qrfg)';
      else fill = paint;
    },
    rect(x, y, w, h, r = 0) {
      cur.push(
        `<rect x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${round(h)}"${
          r ? ` rx="${round(r)}" ry="${round(r)}"` : ''
        } fill="${fill}"/>`
      );
    },
    circle(cx, cy, radius) {
      cur.push(`<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(radius)}" fill="${fill}"/>`);
    },
  };

  // gradient def
  if (opts.paint.gradient === 'radial') {
    defs.push(
      `<radialGradient id="qrfg"><stop offset="0" stop-color="${opts.paint.fg}"/><stop offset="1" stop-color="${opts.paint.gradTo}"/></radialGradient>`
    );
  } else if (opts.paint.gradient === 'linear') {
    const a = (opts.paint.gradRotation * Math.PI) / 180;
    const x1 = round(50 - Math.cos(a) * 50),
      y1 = round(50 - Math.sin(a) * 50),
      x2 = round(50 + Math.cos(a) * 50),
      y2 = round(50 + Math.sin(a) * 50);
    defs.push(
      `<linearGradient id="qrfg" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%"><stop offset="0" stop-color="${opts.paint.fg}"/><stop offset="1" stop-color="${opts.paint.gradTo}"/></linearGradient>`
    );
  } else {
    defs.push(`<linearGradient id="qrfg"><stop stop-color="${opts.paint.fg}"/></linearGradient>`);
  }

  sink.useFill('__BODY__');
  drawBody(sink, mods, cell, off, opts.dot);

  cur = eyes;
  const eyeColor = opts.eyeColor || opts.paint.fg;
  const size = mods.size;
  for (const [br, bc] of [[0, 0], [0, size - 7], [size - 7, 0]] as const) {
    drawEye(sink, br, bc, cell, off, opts.eyeFrame, opts.eyeBall, eyeColor, eyeColor);
  }

  const bgRect = opts.bg ? `<rect width="${px}" height="${px}" fill="${opts.bg}"/>` : '';
  const logo =
    opts.logo && opts.logo.src
      ? `<image href="${opts.logo.src}" x="${round((px - px * opts.logoRatio) / 2)}" y="${round(
          (px - px * opts.logoRatio) / 2
        )}" width="${round(px * opts.logoRatio)}" height="${round(px * opts.logoRatio)}"/>`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${px} ${px}" width="${px}" height="${px}"><defs>${defs.join(
    ''
  )}</defs>${bgRect}${body.join('')}${eyes.join('')}${logo}</svg>`;
}

// ---- self-check (run: npx tsx src/lib/qr.ts) -------------------------------
// @ts-ignore import.meta.main is set under tsx/node --import
if (typeof process !== 'undefined' && process.argv?.[1]?.includes('qr')) {
  const assert = (c: boolean, m: string) => {
    if (!c) throw new Error('FAIL: ' + m);
  };
  assert(buildPayload('url', { url: 'example.com' }) === 'https://example.com', 'url adds scheme');
  assert(buildPayload('url', { url: 'ftp://x' }) === 'ftp://x', 'url keeps scheme');
  assert(buildPayload('phone', { phone: '+1 555' }) === 'tel:+1 555', 'tel');
  assert(buildPayload('sms', { phone: '555', message: 'hi' }) === 'SMSTO:555:hi', 'sms');
  assert(
    buildPayload('wifi', { ssid: 'My;Net', password: 'p:w', encryption: 'WPA' }) ===
      'WIFI:T:WPA;S:My\\;Net;P:p\\:w;;',
    'wifi escapes'
  );
  const v = buildPayload('vcard', { firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.co' });
  assert(v.includes('FN:Ada Lovelace') && v.includes('EMAIL:a@b.co'), 'vcard');
  assert(buildPayload('geo', { lat: '1.5', lng: '2.5' }) === 'geo:1.5,2.5', 'geo');
  // finder detection on a 21-module matrix
  assert(isFinder(0, 0, 21) && isFinder(0, 20, 21) && isFinder(20, 0, 21), 'finder corners');
  assert(!isFinder(20, 20, 21) && !isFinder(10, 10, 21), 'non-finder');
  // svg renders and contains our gradient + a rect
  const svg = renderToSvg('hello', { ...DEFAULT_OPTIONS, paint: { ...DEFAULT_OPTIONS.paint, gradient: 'linear' } });
  assert(svg.startsWith('<svg') && svg.includes('linearGradient') && svg.includes('<rect'), 'svg output');
  console.log('qr.ts self-check passed');
}
