

export interface RenderOpts {

  bcid: string;

  text: string;

  includetext?: boolean;

  scale?: number;

  height?: number;
  [key: string]: unknown;
}

type Bwip = {
  toCanvas: (canvas: HTMLCanvasElement, opts: Record<string, unknown>) => HTMLCanvasElement;
  toSVG: (opts: Record<string, unknown>) => string;
};

let engine: Promise<Bwip> | null = null;

async function load(): Promise<Bwip> {
  if (!engine) {
    engine = import('bwip-js/browser').then((m) => (m.default ?? m) as unknown as Bwip);
  }
  return engine;
}

export async function toCanvas(canvas: HTMLCanvasElement, opts: RenderOpts): Promise<void> {
  const bwip = await load();
  bwip.toCanvas(canvas, { scale: 3, ...opts });
}

export async function toSVG(opts: RenderOpts): Promise<string> {
  const bwip = await load();
  return bwip.toSVG({ scale: 3, ...opts });
}
