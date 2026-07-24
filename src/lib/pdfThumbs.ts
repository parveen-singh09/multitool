import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface Thumb { page: number; url: string; w: number; h: number }

// Render every page of a PDF to a small preview image. Yields one thumb at a time
// via onThumb so the grid can fill progressively instead of blocking on the whole doc.
// ponytail: hard cap at 500 pages — organizing thousands in-browser would hang; raise if a real need shows up.
export async function renderThumbs(
  file: File,
  opts: { scale?: number; max?: number; onThumb?: (t: Thumb) => void; onProgress?: (done: number, total: number) => void } = {},
): Promise<{ thumbs: Thumb[]; total: number; truncated: boolean }> {
  const scale = opts.scale ?? 0.4;
  const max = opts.max ?? 500;
  // Copy the buffer: pdf.js detaches whatever ArrayBuffer it reads.
  const buf = (await file.arrayBuffer()).slice(0);
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const total = pdf.numPages;
  const count = Math.min(total, max);
  const thumbs: Thumb[] = [];
  for (let n = 1; n <= count; n++) {
    const page = await pdf.getPage(n);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
    const blob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error('thumbnail failed'))), 'image/jpeg', 0.7));
    const t: Thumb = { page: n, url: URL.createObjectURL(blob), w: canvas.width, h: canvas.height };
    thumbs.push(t);
    opts.onThumb?.(t);
    opts.onProgress?.(n, count);
  }
  return { thumbs, total, truncated: total > count };
}
