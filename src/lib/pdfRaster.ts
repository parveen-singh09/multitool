import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument } from 'pdf-lib';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Render every page to a canvas, let the caller touch the pixels, then rebuild a
// new PDF where each page IS that image. Lossy by nature (text becomes a raster),
// which is exactly what grayscale / heavy-compress need. Vector tools must not use this.
// Safari refuses to allocate a canvas past a fixed pixel area (~16.7M on desktop, and it starts
// failing well below that on iOS once other buffers are live). A refused allocation gives back a
// blank or zero-sized canvas with no error, so the page silently rasterizes to nothing. Cap the
// area and derive the scale from it rather than trusting the requested scale.
const MAX_AREA = () => (window.innerWidth < 640 ? 4_000_000 : 12_000_000);

export async function rasterizeRebuild(
  file: File,
  opts: {
    scale?: number;              // render resolution; lower = smaller file
    quality?: number;            // JPEG quality 0..1
    onCanvas?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void; // pixel pass, e.g. grayscale
    onProgress?: (done: number, total: number) => void;
  } = {},
): Promise<Uint8Array> {
  const wanted = opts.scale ?? 2;
  const quality = opts.quality ?? 0.85;
  const buf = (await file.arrayBuffer()).slice(0); // pdf.js detaches its input buffer
  const task = pdfjsLib.getDocument({ data: buf });
  const pdf = await task.promise;
  const out = await PDFDocument.create();
  // One canvas for the whole run, resized per page. A fresh canvas per page left every previous
  // backing store alive until GC caught up — at 2x an A4 page is ~8MB, so a 100-page document asked
  // Safari for hundreds of MB it hadn't reclaimed yet, and iOS kills the tab instead of waiting.
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  try {
    for (let n = 1; n <= pdf.numPages; n++) {
      opts.onProgress?.(n, pdf.numPages);
      const page = await pdf.getPage(n);
      const base = page.getViewport({ scale: 1 });
      // Shrink the scale, never the page, if this page at the requested scale won't fit.
      const fit = Math.sqrt(MAX_AREA() / (base.width * base.height));
      const scale = Math.min(wanted, fit);
      const viewport = page.getViewport({ scale });
      canvas.width = Math.max(1, Math.round(viewport.width));
      canvas.height = Math.max(1, Math.round(viewport.height));
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
      opts.onCanvas?.(ctx, canvas.width, canvas.height);
      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error('page encoding failed'))), 'image/jpeg', quality));
      const img = await out.embedJpg(await blob.arrayBuffer());
      // 72 dpi points = pixels / scale, so the page keeps its original physical size.
      const pw = canvas.width / scale, ph = canvas.height / scale;
      const p = out.addPage([pw, ph]);
      p.drawImage(img, { x: 0, y: 0, width: pw, height: ph });
      page.cleanup(); // release pdf.js's operator list and decoded images for this page
      // Hand the main thread back between pages. Without this the loop runs as one long task: no
      // paint (so the progress text never updates) and no window for GC to reclaim the last page.
      await new Promise((r) => setTimeout(r, 0));
    }
  } finally {
    // Zero the backing store explicitly — dropping the reference alone leaves Safari holding the
    // pixels until its next collection, which is exactly the moment we're trying to survive.
    canvas.width = canvas.height = 0;
    task.destroy().catch(() => {});
  }
  return out.save();
}
