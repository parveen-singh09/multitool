

import type { OrgChart, Person } from './types';
import { childrenOf, rootsOf } from './types';
import { getLayout, getSize, type Orientation } from './presets';

export interface BoxGeom {
  id: string;
  x: number; y: number; w: number; h: number; 
}

export interface LayoutResult {
  boxes: BoxGeom[];
  byId: Map<string, BoxGeom>;
  width: number;
  height: number;
}

interface N {
  person: Person;
  children: N[];
  span: number; 
  along: number; 
  depth: number;
}

const PAD = 32; 

export function layoutChart(chart: OrgChart): LayoutResult {
  const { boxW, boxH, gapX, gapY } = getSize(chart.sizeId);
  const orientation = getLayout(chart.layoutId).orientation;
  const horiz = orientation === 'left-right' || orientation === 'right-left';

  const alongBox = horiz ? boxH : boxW; 
  const crossBox = horiz ? boxW : boxH; 
  const levelStep = crossBox + gapY;

  const seen = new Set<string>();
  function build(person: Person, depth: number): N {
    const revisit = seen.has(person.id);
    seen.add(person.id);
    const kids = revisit ? [] : childrenOf(chart.people, person.id).map((c) => build(c, depth + 1));
    return { person, children: kids, span: 0, along: 0, depth };
  }
  const roots = rootsOf(chart.people).map((r) => build(r, 0));

  function measure(n: N): number {
    if (n.children.length === 0) { n.span = alongBox; return n.span; }
    let total = 0;
    n.children.forEach((c, i) => {
      total += measure(c);
      if (i < n.children.length - 1) total += gapX;
    });
    n.span = Math.max(alongBox, total);
    return n.span;
  }

  function assign(n: N, start: number): void {
    if (n.children.length === 0) { n.along = start + (n.span - alongBox) / 2; return; }
    let cursor = start;
    n.children.forEach((c) => { assign(c, cursor); cursor += c.span + gapX; });
    const first = n.children[0];
    const last = n.children[n.children.length - 1];
    n.along = (first.along + last.along) / 2; 
  }

  let cursor = PAD;
  for (const r of roots) { measure(r); assign(r, cursor); cursor += r.span + gapX; }

  const flat: N[] = [];
  const walk = (n: N) => { flat.push(n); n.children.forEach(walk); };
  roots.forEach(walk);

  let maxAlong = 0, maxDepth = 0;
  for (const n of flat) { maxAlong = Math.max(maxAlong, n.along + alongBox); maxDepth = Math.max(maxDepth, n.depth); }

  const alongExtent = maxAlong + PAD;
  const crossExtent = PAD + (maxDepth + 1) * crossBox + maxDepth * gapY + PAD;

  const boxes: BoxGeom[] = flat.map((n) => {
    const cross = PAD + n.depth * levelStep;
    let x: number, y: number;
    switch (orientation) {
      case 'top-down': x = n.along; y = cross; break;
      case 'bottom-up': x = n.along; y = crossExtent - (cross + crossBox); break;
      case 'left-right': x = cross; y = n.along; break;
      case 'right-left': x = crossExtent - (cross + crossBox); y = n.along; break;
    }
    return { id: n.person.id, x, y, w: boxW, h: boxH };
  });

  const width = horiz ? crossExtent : alongExtent;
  const height = horiz ? alongExtent : crossExtent;
  const byId = new Map(boxes.map((b) => [b.id, b]));
  return { boxes, byId, width, height };
}
