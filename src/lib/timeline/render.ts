

import type { Timeline, TimelineEvent, TimelineTheme, TLDate } from './types';
import { formatDate } from './types';

const FONT = 'Inter, system-ui, sans-serif';

let measureCtx: CanvasRenderingContext2D | null = null;
function ctx(): CanvasRenderingContext2D | null {
  if (measureCtx) return measureCtx;
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  measureCtx = c.getContext('2d');
  return measureCtx;
}

function measure(text: string, px: number, weight = '400'): number {
  const c = ctx();
  if (!c) return text.length * px * 0.55; 
  c.font = `${weight} ${px}px ${FONT}`;
  return c.measureText(text).width;
}

function wrapText(text: string, maxW: number, px: number, weight = '400'): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (measure(test, px, weight) > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => (
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;'
  ));
}

// A multi-line text block as <text>+<tspan>, top-anchored (first baseline at y).
function textBlock(
  lines: string[], x: number, y: number, px: number, color: string,
  weight = '400', lineH = 1.35, align: 'start' | 'middle' = 'start',
): string {
  const spans = lines.map((l, i) =>
    `<tspan x="${x}" dy="${i === 0 ? 0 : px * lineH}">${esc(l)}</tspan>`
  ).join('');
  return `<text x="${x}" y="${y + px}" fill="${color}" font-family="${FONT}" ` +
    `font-size="${px}" font-weight="${weight}" text-anchor="${align}">${spans}</text>`;
}

function dateLabel(ev: TimelineEvent): string {
  if (ev.displayDate) return ev.displayDate;
  const start = formatDate(ev.start);
  return ev.end ? `${start} – ${formatDate(ev.end)}` : start;
}

function sortedEvents(tl: Timeline): TimelineEvent[] {
  return [...tl.events].sort((a, b) => a.start.sort - b.start.sort);
}

// ---------------------------------------------------------------------------
export interface RenderInput {
  tl: Timeline;
  theme: TimelineTheme;
  w: number;
  h: number; // minimum height; layouts may grow it
}

export function renderSVG(input: RenderInput): { svg: string; width: number; height: number } {
  const { tl, theme, w } = input;
  const events = sortedEvents(tl);

  const titlePx = Math.round(w / 26);
  const titleH = tl.title ? titlePx + 28 : 24;

  const built =
    tl.layout === 'horizontal' ? layoutHorizontal(events, theme, w, input.h, titleH)
    : tl.layout === 'alternating' ? layoutAlternating(events, theme, w, titleH)
    : layoutVertical(events, theme, w, titleH);

  const height = Math.max(built.height, input.h && tl.layout === 'horizontal' ? input.h : 0, 200);

  const title = tl.title
    ? `<text x="40" y="${titlePx + 24}" fill="${theme.ink}" font-family="${FONT}" ` +
      `font-size="${titlePx}" font-weight="600">${esc(tl.title)}</text>`
    : '';

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" width="${w}" height="${height}">` +
    `<rect width="${w}" height="${height}" fill="${theme.bg}"/>` +
    title + built.body +
    `</svg>`;
  return { svg, width: w, height };
}

// --- Vertical: fixed-x spine, events stacked top -> down --------------------
function layoutVertical(events: TimelineEvent[], t: TimelineTheme, w: number, top: number) {
  const spineX = 84;
  const textX = 120;
  const maxTextW = w - textX - 48;
  const parts: string[] = [];

  let y = top + 24;
  const blocks = events.map((ev) => {
    const descLines = ev.desc ? wrapText(ev.desc, maxTextW, 15) : [];
    const titleLines = wrapText(ev.title, maxTextW, 18, '600');
    const h = 22 + titleLines.length * 24 + descLines.length * 21 + 30;
    return { ev, descLines, titleLines, h };
  });

  const totalH = blocks.reduce((a, b) => a + b.h, 0);
  const spineBottom = y + totalH - 20;

  parts.push(`<line x1="${spineX}" y1="${top}" x2="${spineX}" y2="${spineBottom}" stroke="${t.spine}" stroke-width="2"/>`);

  for (const { ev, descLines, titleLines } of blocks) {
    const accent = ev.color || t.accent;
    const dotY = y + 8;
    if (ev.end) {
      // range: a short rounded bar on the spine
      parts.push(`<rect x="${spineX - 5}" y="${dotY - 6}" width="10" height="34" rx="5" fill="${accent}"/>`);
    } else {
      parts.push(`<circle cx="${spineX}" cy="${dotY}" r="7" fill="${accent}"/>`);
      parts.push(`<circle cx="${spineX}" cy="${dotY}" r="3" fill="${t.bg}"/>`);
    }
    parts.push(textBlock([dateLabel(ev)], textX, y - 4, 13, accent, '600'));
    parts.push(textBlock(titleLines, textX, y + 18, 18, t.ink, '600'));
    if (descLines.length) parts.push(textBlock(descLines, textX, y + 20 + titleLines.length * 24, 15, t.inkSubtle));
    y += 22 + titleLines.length * 24 + descLines.length * 21 + 30;
  }
  return { body: parts.join(''), height: y + 20 };
}

// --- Horizontal: mid spine, events spaced proportional to time --------------
function layoutHorizontal(events: TimelineEvent[], t: TimelineTheme, w: number, h: number, top: number) {
  const height = Math.max(h, 460);
  const midY = Math.round((top + height) / 2);
  const padX = 70;
  const spanW = w - padX * 2;
  const parts: string[] = [];

  parts.push(`<line x1="${padX}" y1="${midY}" x2="${w - padX}" y2="${midY}" stroke="${t.spine}" stroke-width="2"/>`);

  if (!events.length) return { body: parts.join(''), height };

  const min = events[0].start.sort;
  const max = events[events.length - 1].start.sort;
  const range = max - min || 1;
  const xOf = (d: TLDate) => padX + ((d.sort - min) / range) * spanW;

  const colW = Math.min(220, spanW / Math.max(events.length, 1) + 40);

  events.forEach((ev, i) => {
    const accent = ev.color || t.accent;
    const x = events.length === 1 ? padX + spanW / 2 : xOf(ev.start);
    const above = i % 2 === 0;

    if (ev.end) {
      const x2 = xOf(ev.end);
      parts.push(`<rect x="${x}" y="${midY - 7}" width="${Math.max(x2 - x, 6)}" height="14" rx="7" fill="${accent}" opacity="0.85"/>`);
    } else {
      parts.push(`<circle cx="${x}" cy="${midY}" r="7" fill="${accent}"/>`);
    }

    const titleLines = wrapText(ev.title, colW, 15, '600');
    const descLines = ev.desc ? wrapText(ev.desc, colW, 13).slice(0, 4) : [];
    const blockH = 20 + titleLines.length * 20 + descLines.length * 18;
    const labelY = above ? midY - 28 - blockH : midY + 28;

    parts.push(`<line x1="${x}" y1="${midY}" x2="${x}" y2="${above ? midY - 24 : midY + 24}" stroke="${accent}" stroke-width="1.5"/>`);
    const tx = Math.max(padX, Math.min(x, w - padX - colW));
    parts.push(textBlock([dateLabel(ev)], tx, labelY, 12, accent, '600'));
    parts.push(textBlock(titleLines, tx, labelY + 18, 15, t.ink, '600'));
    if (descLines.length) parts.push(textBlock(descLines, tx, labelY + 20 + titleLines.length * 20, 13, t.inkSubtle));
  });
  return { body: parts.join(''), height };
}

// --- Alternating: centered spine, odd left / even right cards ---------------
function layoutAlternating(events: TimelineEvent[], t: TimelineTheme, w: number, top: number) {
  const spineX = Math.round(w / 2);
  const cardW = Math.min(w / 2 - 60, 420);
  const gap = 40;
  const parts: string[] = [];

  let y = top + 20;
  const blocks = events.map((ev) => {
    const titleLines = wrapText(ev.title, cardW - 32, 17, '600');
    const descLines = ev.desc ? wrapText(ev.desc, cardW - 32, 14) : [];
    const cardH = 44 + titleLines.length * 22 + descLines.length * 20;
    return { ev, titleLines, descLines, cardH };
  });

  const totalH = blocks.reduce((a, b) => a + b.cardH + gap, 0);
  parts.push(`<line x1="${spineX}" y1="${top}" x2="${spineX}" y2="${y + totalH}" stroke="${t.spine}" stroke-width="2"/>`);

  blocks.forEach(({ ev, titleLines, descLines, cardH }, i) => {
    const accent = ev.color || t.accent;
    const left = i % 2 === 0;
    const cardX = left ? spineX - gap - cardW : spineX + gap;
    const dotY = y + cardH / 2;

    // connector + dot
    parts.push(`<line x1="${spineX}" y1="${dotY}" x2="${left ? spineX - gap : spineX + gap}" y2="${dotY}" stroke="${accent}" stroke-width="1.5"/>`);
    parts.push(`<circle cx="${spineX}" cy="${dotY}" r="7" fill="${accent}"/>`);
    parts.push(`<circle cx="${spineX}" cy="${dotY}" r="3" fill="${t.bg}"/>`);

    // card
    parts.push(`<rect x="${cardX}" y="${y}" width="${cardW}" height="${cardH}" rx="10" fill="${t.bg}" stroke="${t.spine}" stroke-width="1"/>`);
    const px = cardX + 16;
    parts.push(textBlock([dateLabel(ev)], px, y + 12, 12, accent, '600'));
    parts.push(textBlock(titleLines, px, y + 30, 17, t.ink, '600'));
    if (descLines.length) parts.push(textBlock(descLines, px, y + 34 + titleLines.length * 22, 14, t.inkSubtle));

    y += cardH + gap;
  });
  return { body: parts.join(''), height: y + 10 };
}
