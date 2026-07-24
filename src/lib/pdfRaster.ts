import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument } from 'pdf-lib';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Render every page to a canvas, let the caller touch the pixels, then rebuild a
// new PDF where each page IS that image. Lossy by nature (text becomes a raster),
// which is exactly what grayscale / heavy-compress need. Vector tools must not use this.
export async function rasterizeRebuild(
  file: File,
  opts: {
    scale?: number;              // render resolution; lower = smaller file
    quality?: number;            // JPEG quality 0..1
    onCanvas?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void; // pixel pass, e.g. grayscale
    onProgress?: (done: number, total: number) => void;
  } = {},
): Promise<Uint8Array> {
  const scale = opts.scale ?? 2;
  const quality = opts.quality ?? 0.85;
  const buf = (await file.arrayBuffer()).slice(0); // pdf.js detaches its input buffer
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const out = await PDFDocument.create();
  for (let n = 1; n <= pdf.numPages; n++) {
    opts.onProgress?.(n, pdf.numPages);
    const page = await pdf.getPage(n);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
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
  }
  return out.save();
}
