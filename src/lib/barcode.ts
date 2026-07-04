// Thin wrapper around bwip-js (browser build) for the barcode generators.
// Lazy-loaded from each page's client script so the ~200 KB engine only
// downloads on pages that actually render a barcode. Runs fully client-side.

export interface RenderOpts {
  /** bwip-js barcode type, e.g. 'datamatrix', 'pdf417', 'azteccode', 'upca', 'ean13'. */
  bcid: string;
  /** Data to encode. */
  text: string;
  /** Draw the human-readable text under linear barcodes. */
  includetext?: boolean;
  /** Module scale (pixels per module). */
  scale?: number;
  /** Bar height in millimeters (linear symbologies only). */
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

/** Render into a canvas element. Throws on invalid data (caller shows the message). */
export async function toCanvas(canvas: HTMLCanvasElement, opts: RenderOpts): Promise<void> {
  const bwip = await load();
  bwip.toCanvas(canvas, { scale: 3, ...opts });
}

/** Render to an SVG string for download. */
export async function toSVG(opts: RenderOpts): Promise<string> {
  const bwip = await load();
  return bwip.toSVG({ scale: 3, ...opts });
}
