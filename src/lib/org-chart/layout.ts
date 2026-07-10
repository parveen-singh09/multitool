// Tidy-tree layout: turn the flat OrgChart into positioned boxes. Two passes,
// generalised from the original org-chart page:
//   1. measure()  — bottom-up, each subtree's span = max(box, sum of children).
//   2. assign()   — top-down, place children along the sibling axis, centre each
//                   parent over the span of its children.
//
// The passes work in orientation-agnostic ALONG/CROSS space:
//   - "along" is the axis siblings spread along (horizontal for a top-down tree,
//     vertical for a left-right tree).
//   - "cross" is the axis depth grows along (vertical for top-down, etc).
// Because a box's footprint on each axis differs by orientation (a box is boxW
// along a top-down tree but boxH along a left-right tree), we pick the axis
// footprints up front, run the generic passes, then map along/cross -> x/y. This
// keeps the centring math in one place and avoids the overlap you'd get from
// laying out top-down and naively rotating.
//
// Multiple roots are laid out side by side. A revisit guard keeps a malformed
// manager cycle from stack-overflowing the recursion.

import type { OrgChart, Person } from './types';
import { childrenOf, rootsOf } from './types';
import { getLayout, getSize, type Orientation } from './presets';

export interface BoxGeom {
  id: string;
  x: number; y: number; w: number; h: number; // top-left + drawn size in canvas px
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
  span: number; // subtree extent along the sibling axis
  along: number; // box near-edge along the sibling axis
  depth: number;
}

const PAD = 32; // outer margin around the whole tree

export function layoutChart(chart: OrgChart): LayoutResult {
  const { boxW, boxH, gapX, gapY } = getSize(chart.sizeId);
  const orientation = getLayout(chart.layoutId).orientation;
  const horiz = orientation === 'left-right' || orientation === 'right-left';

  // Box footprint on each axis depends on orientation.
  const alongBox = horiz ? boxH : boxW; // extent along the sibling axis
  const crossBox = horiz ? boxW : boxH; // extent along the depth axis
  const levelStep = crossBox + gapY;

  // --- build the node tree from the flat people list, cycle-guarded ----------
  const seen = new Set<string>();
  function build(person: Person, depth: number): N {
    const revisit = seen.has(person.id);
    seen.add(person.id);
    const kids = revisit ? [] : childrenOf(chart.people, person.id).map((c) => build(c, depth + 1));
    return { person, children: kids, span: 0, along: 0, depth };
  }
  const roots = rootsOf(chart.people).map((r) => build(r, 0));

  // --- pass 1: subtree spans -------------------------------------------------
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

  // --- pass 2: assign along positions, centre parents ------------------------
  function assign(n: N, start: number): void {
    if (n.children.length === 0) { n.along = start + (n.span - alongBox) / 2; return; }
    let cursor = start;
    n.children.forEach((c) => { assign(c, cursor); cursor += c.span + gapX; });
    const first = n.children[0];
    const last = n.children[n.children.length - 1];
    n.along = (first.along + last.along) / 2; // equal footprints -> midpoint centres the parent
  }

  let cursor = PAD;
  for (const r of roots) { measure(r); assign(r, cursor); cursor += r.span + gapX; }

  // --- flatten ----------------------------------------------------------------
  const flat: N[] = [];
  const walk = (n: N) => { flat.push(n); n.children.forEach(walk); };
  roots.forEach(walk);

  let maxAlong = 0, maxDepth = 0;
  for (const n of flat) { maxAlong = Math.max(maxAlong, n.along + alongBox); maxDepth = Math.max(maxDepth, n.depth); }

  const alongExtent = maxAlong + PAD;
  const crossExtent = PAD + (maxDepth + 1) * crossBox + maxDepth * gapY + PAD;

  // --- map along/cross -> x/y in the requested orientation -------------------
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
