

import type { GanttProject, GanttTheme, ZoomLevel } from './types';
import type { Scheduled } from './schedule';
import { fromIndex, tsOf } from './calendar';
import { ZOOM_PX_PER_DAY, type SizePreset } from './presets';

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
function ellipsize(text: string, maxW: number, px: number, weight = '400'): string {
  if (measure(text, px, weight) <= maxW) return text;
  let s = text;
  while (s.length > 1 && measure(s + '…', px, weight) > maxW) s = s.slice(0, -1);
  return s + '…';
}
function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;'));
}

// --- geometry returned for hit-testing --------------------------------------
export interface BarGeom {
  id: string;
  x: number; y: number; w: number; h: number;
  type: 'task' | 'milestone' | 'summary';
}
export interface RenderResult {
  svg: string;
  bars: BarGeom[];
  rowH: number;
  chartX: number;
  minIndex: number;
  pxPerDay: number;
  width: number;
  height: number;
}

export interface RenderInput {
  project: GanttProject;
  sched: Scheduled;
  theme: GanttTheme;
  size: SizePreset;
}

const GUTTER_W = 230;
const ROW_H = 34;
const BAR_H = 18;
const HEADER_H = 52;
const PAD = 24;

export function renderSVG(input: RenderInput): RenderResult {
  const { project: p, sched, theme, size } = input;
  const w = size.w;
  const cal = p.calendar;
  const epoch = p.start;

  const titlePx = 24;
  const titleH = p.title ? titlePx + 20 : 8;
  const top = titleH + HEADER_H;

  const pxPerDay = ZOOM_PX_PER_DAY[p.zoom];
  const chartX = GUTTER_W;
  const chartW = w - chartX - PAD;

  // Visible index range: pad a little on each side.
  const minIndex = Math.min(0, sched.projectStartIdx) - 1;
  const maxIndex = Math.max(sched.projectFinishIdx + 2, minIndex + Math.ceil(chartW / pxPerDay));
  const xOf = (idx: number) => chartX + (idx - minIndex) * pxPerDay;

  const rows = sched.ordered;
  const height = Math.max(top + rows.length * ROW_H + PAD, size.h ? 0 : 0, top + ROW_H + PAD);

  const parts: string[] = [];
  const bars: BarGeom[] = [];

  // background
  parts.push(`<rect width="${w}" height="${height}" fill="${theme.bg}"/>`);

  // title
  if (p.title) {
    parts.push(`<text x="${PAD}" y="${titlePx + 8}" fill="${theme.ink}" font-family="${FONT}" font-size="${titlePx}" font-weight="600">${esc(p.title)}</text>`);
  }

  // --- time axis: gridlines + two-tier labels -------------------------------
  parts.push(...axis(p.zoom, minIndex, maxIndex, xOf, epoch, cal, theme, titleH, top, height));

  // gutter divider + header underline
  parts.push(`<line x1="${chartX}" y1="${titleH}" x2="${chartX}" y2="${height}" stroke="${theme.grid}" stroke-width="1"/>`);
  parts.push(`<line x1="0" y1="${top}" x2="${w}" y2="${top}" stroke="${theme.grid}" stroke-width="1"/>`);

  // --- rows: labels + bars --------------------------------------------------
  rows.forEach((st, i) => {
    const task = p.tasks[i];
    const y = top + i * ROW_H;
    const barY = y + (ROW_H - BAR_H) / 2;
    const accent = task.color || (st.critical ? theme.barCritical : theme.bar);

    // row separator
    if (i > 0) parts.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${theme.grid}" stroke-width="0.5" opacity="0.5"/>`);

    // label (indented by outline; summary in bold)
    const indent = PAD + task.outline * 16;
    const labelW = chartX - indent - 8;
    const weight = st.isSummary ? '600' : '400';
    const label = ellipsize(task.name || '(untitled)', labelW, 13, weight);
    parts.push(`<text x="${indent}" y="${y + ROW_H / 2 + 4}" fill="${theme.ink}" font-family="${FONT}" font-size="13" font-weight="${weight}">${esc(label)}</text>`);

    const x1 = xOf(st.startIdx);
    const x2 = xOf(st.endIdx + 1); // end is inclusive -> extend one day for width
    const bw = Math.max(x2 - x1, 3);

    if (st.isMilestone) {
      const cx = x1, cy = y + ROW_H / 2, r = 8;
      parts.push(`<path d="M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z" fill="${theme.milestone}"/>`);
      bars.push({ id: st.id, x: cx - r, y: cy - r, w: r * 2, h: r * 2, type: 'milestone' });
    } else if (st.isSummary) {
      const sy = y + ROW_H / 2 - 4;
      // summary bracket: a thin bar with down-turned end caps
      parts.push(`<path d="M ${x1} ${sy} L ${x2} ${sy} L ${x2} ${sy + 5} L ${x2 - 4} ${sy} L ${x1 + 4} ${sy} L ${x1} ${sy + 5} Z" fill="${theme.summary}"/>`);
      bars.push({ id: st.id, x: x1, y: sy - 3, w: bw, h: 10, type: 'summary' });
    } else {
      // base bar
      parts.push(`<rect x="${x1}" y="${barY}" width="${bw}" height="${BAR_H}" rx="4" fill="${accent}" opacity="0.9"/>`);
      // progress overlay (left-aligned fill, no clip needed)
      if (st.progress > 0) {
        const pw = Math.max(0, Math.min(bw, (bw * st.progress) / 100));
        parts.push(`<rect x="${x1}" y="${barY}" width="${pw}" height="${BAR_H}" rx="4" fill="${theme.progress}"/>`);
      }
      // assignee label to the right of the bar, if it fits
      if (task.assignee) {
        parts.push(`<text x="${x2 + 6}" y="${barY + BAR_H - 4}" fill="${theme.inkSubtle}" font-family="${FONT}" font-size="11">${esc(task.assignee)}</text>`);
      }
      bars.push({ id: st.id, x: x1, y: barY, w: bw, h: BAR_H, type: 'task' });
    }
  });

  // --- dependency arrows (drawn on top) -------------------------------------
  const geomById = new Map(bars.map((b) => [b.id, b]));
  for (const task of p.tasks) {
    for (const d of task.deps) {
      const a = geomById.get(d.pred);
      const b = geomById.get(task.id);
      if (!a || !b) continue;
      parts.push(arrow(a, b, theme.inkSubtle));
    }
  }

  // --- today marker ---------------------------------------------------------
  const todayIdx = todayIndex(epoch, cal, minIndex, maxIndex);
  if (todayIdx !== null) {
    const tx = xOf(todayIdx);
    parts.push(`<line x1="${tx}" y1="${top}" x2="${tx}" y2="${height}" stroke="${theme.today}" stroke-width="1.5" stroke-dasharray="4 3"/>`);
    parts.push(`<text x="${tx + 4}" y="${top + 12}" fill="${theme.today}" font-family="${FONT}" font-size="10" font-weight="600">Today</text>`);
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${height}" width="${w}" height="${height}">` +
    parts.join('') +
    `</svg>`;

  return { svg, bars, rowH: ROW_H, chartX, minIndex, pxPerDay, width: w, height };
}

// Orthogonal FS-style elbow arrow from predecessor right edge to successor left
// edge (right, down/up, right) with a small arrowhead. Simple routing — no
// collision avoidance. ponytail: elbow only; polished routing when dense charts
// demand it.
function arrow(a: BarGeom, b: BarGeom, color: string): string {
  const ax = a.x + a.w, ay = a.y + a.h / 2;
  const bx = b.x, by = b.y + b.h / 2;
  const midX = Math.max(ax + 8, bx - 8);
  const head = `M ${bx} ${by} l -6 -4 l 0 8 z`;
  return (
    `<path d="M ${ax} ${ay} H ${midX} V ${by} H ${bx}" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.7"/>` +
    `<path d="${head}" fill="${color}" opacity="0.7"/>`
  );
}

// Working-day index of "today" if it falls in the visible calendar range, else
// null. Uses the machine clock via Date (browser only); guarded caller ranges.
function todayIndex(epoch: string, cal: import('./types').Calendar, minIndex: number, maxIndex: number): number | null {
  if (typeof Date === 'undefined') return null;
  const now = new Date();
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  // Map today's calendar date to a working-day index by scanning the visible
  // range for the nearest index whose date is >= today.
  for (let idx = minIndex; idx <= maxIndex; idx++) {
    if (fromIndex(idx, epoch, cal) >= iso) {
      return idx >= minIndex && idx <= maxIndex ? idx : null;
    }
  }
  return null;
}

// --- axis: gridlines + labels, driven by zoom -------------------------------
function axis(
  zoom: ZoomLevel, minIndex: number, maxIndex: number,
  xOf: (i: number) => number, epoch: string, cal: import('./types').Calendar,
  theme: GanttTheme, titleH: number, top: number, height: number,
): string[] {
  const out: string[] = [];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let lastMonthKey = '';

  for (let idx = minIndex; idx <= maxIndex; idx++) {
    const dateIso = fromIndex(idx, epoch, cal);
    const t = tsOf(dateIso);
    const d = new Date(t);
    const x = xOf(idx);

    // top tier: month band label whenever the month changes
    const monthKey = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
    if (monthKey !== lastMonthKey) {
      lastMonthKey = monthKey;
      out.push(`<line x1="${x}" y1="${titleH}" x2="${x}" y2="${height}" stroke="${theme.grid}" stroke-width="1"/>`);
      out.push(`<text x="${x + 4}" y="${titleH + 16}" fill="${theme.inkSubtle}" font-family="${FONT}" font-size="12" font-weight="600">${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}</text>`);
    }

    // bottom tier: depends on zoom
    if (zoom === 'day') {
      out.push(`<line x1="${x}" y1="${top - 18}" x2="${x}" y2="${height}" stroke="${theme.grid}" stroke-width="0.5" opacity="0.5"/>`);
      out.push(`<text x="${x + 3}" y="${top - 6}" fill="${theme.inkSubtle}" font-family="${FONT}" font-size="10">${d.getUTCDate()}</text>`);
    } else if (zoom === 'week') {
      // label roughly weekly (every 5 working days)
      if ((idx - Math.max(minIndex, 0)) % 5 === 0) {
        out.push(`<line x1="${x}" y1="${top - 18}" x2="${x}" y2="${height}" stroke="${theme.grid}" stroke-width="0.5" opacity="0.5"/>`);
        out.push(`<text x="${x + 3}" y="${top - 6}" fill="${theme.inkSubtle}" font-family="${FONT}" font-size="10">${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}</text>`);
      }
    }
    // month zoom: only the month boundary lines above are drawn.
  }
  return out;
}
