

import type { OrgChart, OrgTheme, Person } from './types';
import { rootsOf } from './types';
import { getLayout } from './presets';
import { layoutChart, type BoxGeom } from './layout';

const FONT = 'Inter, system-ui, sans-serif';

let measureCtx: CanvasRenderingContext2D | null = null;
function ctx(): CanvasRenderingContext2D | null {
  if (measureCtx) return measureCtx;
  if (typeof document === 'undefined') return null;
  measureCtx = document.createElement('canvas').getContext('2d');
  return measureCtx;
}
function measure(text: string, px: number, weight = '400'): number {
  const c = ctx();
  if (!c) return text.length * px * 0.55;
  c.font = `${weight} ${px}px ${FONT}`;
  return c.measureText(text).width;
}
function ellipsize(text: string, maxW: number, px: number, weight = '400'): string {
  if (maxW <= 0 || measure(text, px, weight) <= maxW) return text;
  let s = text;
  while (s.length > 1 && measure(s + '…', px, weight) > maxW) s = s.slice(0, -1);
  return s + '…';
}
function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;'));
}

export interface RenderResult {
  svg: string;
  boxes: BoxGeom[]; 
  byId: Map<string, BoxGeom>;
  width: number;
  height: number;
}

const LOGO_H = 64; 

export function renderSVG(chart: OrgChart, theme: OrgTheme): RenderResult {
  const base = layoutChart(chart);
  const orientation = getLayout(chart.layoutId).orientation;
  const offsetY = chart.logo ? LOGO_H : 0;

  const boxes: BoxGeom[] = base.boxes.map((b) => ({ ...b, y: b.y + offsetY }));
  const byId = new Map(boxes.map((b) => [b.id, b]));
  const width = base.width;
  const height = base.height + offsetY;

  const byPersonId = new Map(chart.people.map((p) => [p.id, p]));
  const parts: string[] = [];
  const defs: string[] = [];

  parts.push(`<rect width="${width}" height="${height}" fill="${theme.bg}"/>`);

  if (chart.logo) {
    parts.push(`<image x="32" y="16" width="160" height="${LOGO_H - 24}" href="${esc(chart.logo)}" preserveAspectRatio="xMinYMid meet"/>`);
  }

  for (const person of chart.people) {
    const parent = byId.get(person.id);
    if (!parent) continue;
    const kids = chart.people.filter((p) => p.managerId === person.id).map((p) => byId.get(p.id)).filter(Boolean) as BoxGeom[];
    if (kids.length) parts.push(connectors(parent, kids, orientation, theme.border));
  }

  const rootIds = new Set(rootsOf(chart.people).map((p) => p.id));
  for (const box of boxes) {
    const person = byPersonId.get(box.id);
    if (!person) continue;
    parts.push(...drawBox(box, person, rootIds.has(person.id), theme, defs));
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">` +
    (defs.length ? `<defs>${defs.join('')}</defs>` : '') +
    parts.join('') +
    `</svg>`;

  return { svg, boxes, byId, width, height };
}

function connectors(parent: BoxGeom, kids: BoxGeom[], o: string, color: string): string {
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${color}" stroke-width="1.5"/>`;
  const parts: string[] = [];
  const vertical = o === 'top-down' || o === 'bottom-up';

  if (vertical) {
    const down = o === 'top-down';
    const pEdge = down ? parent.y + parent.h : parent.y;
    const childEdge = (c: BoxGeom) => (down ? c.y : c.y + c.h);
    const firstEdge = down ? Math.min(...kids.map((k) => k.y)) : Math.max(...kids.map((k) => k.y + k.h));
    const mid = (pEdge + firstEdge) / 2;
    const pcx = parent.x + parent.w / 2;
    parts.push(line(pcx, pEdge, pcx, mid));
    const cxs = kids.map((k) => k.x + k.w / 2);
    parts.push(line(Math.min(...cxs), mid, Math.max(...cxs), mid));
    for (const c of kids) { const ccx = c.x + c.w / 2; parts.push(line(ccx, mid, ccx, childEdge(c))); }
  } else {
    const right = o === 'left-right';
    const pEdge = right ? parent.x + parent.w : parent.x;
    const childEdge = (c: BoxGeom) => (right ? c.x : c.x + c.w);
    const firstEdge = right ? Math.min(...kids.map((k) => k.x)) : Math.max(...kids.map((k) => k.x + k.w));
    const mid = (pEdge + firstEdge) / 2;
    const pcy = parent.y + parent.h / 2;
    parts.push(line(pEdge, pcy, mid, pcy));
    const cys = kids.map((k) => k.y + k.h / 2);
    parts.push(line(mid, Math.min(...cys), mid, Math.max(...cys)));
    for (const c of kids) { const ccy = c.y + c.h / 2; parts.push(line(mid, ccy, childEdge(c), ccy)); }
  }
  return parts.join('');
}

function drawBox(box: BoxGeom, person: Person, isRoot: boolean, theme: OrgTheme, defs: string[]): string[] {
  const out: string[] = [];
  const fill = isRoot ? theme.boxRoot : theme.box;
  const nameColor = isRoot ? theme.inkRoot : theme.ink;
  const subColor = isRoot ? theme.inkRoot : theme.inkSubtle;
  const stroke = isRoot ? theme.boxRoot : theme.border;

  out.push(`<rect x="${r(box.x)}" y="${r(box.y)}" width="${box.w}" height="${box.h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`);

  if (!isRoot && person.color) {
    out.push(`<path d="M ${r(box.x)} ${r(box.y + 8)} a 8 8 0 0 1 8 -8 v ${box.h} a 8 8 0 0 1 -8 -8 z" fill="${person.color}"/>`);
  }

  let textX = box.x + 14;
  const photoSize = box.h - 20;

  if (person.photo) {
    const cx = box.x + 12 + photoSize / 2;
    const cy = box.y + box.h / 2;
    const clipId = `oc-${box.id}`;
    defs.push(`<clipPath id="${clipId}"><circle cx="${r(cx)}" cy="${r(cy)}" r="${photoSize / 2}"/></clipPath>`);
    out.push(`<image x="${r(box.x + 12)}" y="${r(box.y + 10)}" width="${photoSize}" height="${photoSize}" href="${esc(person.photo)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>`);
    out.push(`<circle cx="${r(cx)}" cy="${r(cy)}" r="${photoSize / 2}" fill="none" stroke="${stroke}" stroke-width="1"/>`);
    textX = box.x + 12 + photoSize + 10;
  }

  const textW = box.x + box.w - 12 - textX;
  const sub = [person.title, person.dept].filter(Boolean).join(' · ');
  const cy = box.y + box.h / 2;

  if (sub) {
    const name = ellipsize(person.name || '(unnamed)', textW, 14, '600');
    out.push(`<text x="${r(textX)}" y="${r(cy - 4)}" fill="${nameColor}" font-family="${FONT}" font-size="14" font-weight="600">${esc(name)}</text>`);
    out.push(`<text x="${r(textX)}" y="${r(cy + 13)}" fill="${subColor}" font-family="${FONT}" font-size="11.5">${esc(ellipsize(sub, textW, 11.5))}</text>`);
  } else {
    const name = ellipsize(person.name || '(unnamed)', textW, 14, '600');
    out.push(`<text x="${r(textX)}" y="${r(cy + 5)}" fill="${nameColor}" font-family="${FONT}" font-size="14" font-weight="600">${esc(name)}</text>`);
  }

  return out;
}

function r(n: number): number {
  return Math.round(n * 100) / 100;
}
