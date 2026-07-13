

import * as fabric from 'fabric';

export type ShapeId =
  | 'rect'
  | 'rounded'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'line'
  | 'arrow'
  | 'star'
  | 'heart'
  | 'diamond';

export const SHAPES: { id: ShapeId; label: string }[] = [
  { id: 'rect', label: 'Rectangle' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'circle', label: 'Circle' },
  { id: 'ellipse', label: 'Ellipse' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'line', label: 'Line' },
  { id: 'arrow', label: 'Arrow' },
  { id: 'star', label: 'Star' },
  { id: 'heart', label: 'Heart' },
];

function polygon(points: { x: number; y: number }[], fill: string) {
  return new fabric.Polygon(points, {
    fill,
    left: 0,
    top: 0,
    objectCaching: false,
  });
}

function starPoints(spikes: number, outer: number, inner: number) {
  const pts: { x: number; y: number }[] = [];
  const cx = outer;
  const cy = outer;
  let rot = -Math.PI / 2;
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes; i++) {
    pts.push({ x: cx + Math.cos(rot) * outer, y: cy + Math.sin(rot) * outer });
    rot += step;
    pts.push({ x: cx + Math.cos(rot) * inner, y: cy + Math.sin(rot) * inner });
    rot += step;
  }
  return pts;
}

export function makeShape(id: ShapeId, fill: string): fabric.FabricObject {
  const common = { left: 0, top: 0, fill };
  switch (id) {
    case 'rounded':
      return new fabric.Rect({ ...common, width: 160, height: 120, rx: 20, ry: 20 });
    case 'circle':
      return new fabric.Circle({ ...common, radius: 70 });
    case 'ellipse':
      return new fabric.Ellipse({ ...common, rx: 90, ry: 60 });
    case 'triangle':
      return new fabric.Triangle({ ...common, width: 140, height: 130 });
    case 'line':
      return new fabric.Line([0, 0, 180, 0], {
        left: 0,
        top: 0,
        stroke: fill,
        strokeWidth: 8,
      });
    case 'diamond':
      return polygon(
        [
          { x: 70, y: 0 },
          { x: 140, y: 70 },
          { x: 70, y: 140 },
          { x: 0, y: 70 },
        ],
        fill
      );
    case 'arrow':
      return polygon(
        [
          { x: 0, y: 30 },
          { x: 90, y: 30 },
          { x: 90, y: 10 },
          { x: 140, y: 45 },
          { x: 90, y: 80 },
          { x: 90, y: 60 },
          { x: 0, y: 60 },
        ],
        fill
      );
    case 'star':
      return polygon(starPoints(5, 70, 30), fill);
    case 'heart': {
      const path =
        'M 70 128 C 10 84 16 24 52 24 c 12 0 18 10 18 10 s 6 -10 18 -10 c 36 0 42 60 -18 104 z';
      return new fabric.Path(path, { ...common });
    }
    case 'rect':
    default:
      return new fabric.Rect({ ...common, width: 160, height: 120 });
  }
}
