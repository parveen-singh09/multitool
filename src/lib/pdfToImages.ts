// Render PDF pages to image blobs (pdfjs → canvas → toBlob). Same technique as
// the pdf-to-jpg tool page; used by the AI chat to convert PDFs inline.
// 100% client-side — nothing uploaded.
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface PdfImage { page: number; blob: Blob; url: string }
export interface PdfResult { images: PdfImage[]; total: number; truncated: boolean }

export async function pdfToImages(
  file: File,
  opts: {
    to?: string;      // 'image/jpeg' | 'image/png' | 'image/webp'
    quality?: number; // 0..1 for lossy formats
    scale?: number;   // render scale (2 ≈ 144 dpi)
    maxPages?: number; // inline cap; full tool handles bigger docs + ZIP
    onProgress?: (done: number, total: number) => void;
  } = {},
): Promise<PdfResult> {
  const to = opts.to ?? 'image/jpeg';
  const quality = to === 'image/png' ? undefined : opts.quality ?? 0.92;
  const scale = opts.scale ?? 2;
  // ponytail: cap inline renders at maxPages; the pdf-to-jpg tool does huge docs + ZIP.
  const maxPages = opts.maxPages ?? 20;

  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const total = pdf.numPages;
  const count = Math.min(total, maxPages);
  const images: PdfImage[] = [];

  for (let n = 1; n <= count; n++) {
    opts.onProgress?.(n, count);
    const page = await pdf.getPage(n);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    if (to !== 'image/png') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
    const blob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error('Page encoding failed'))), to, quality));
    images.push({ page: n, blob, url: URL.createObjectURL(blob) });
  }

  return { images, total, truncated: total > count };
}
