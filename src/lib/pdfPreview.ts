import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface PreviewHandle { refresh: () => void }

// Live preview: render page 1 of whatever build() returns into `mount`, debounced,
// re-rendering whenever an input/select inside `watch` changes. build() returns null
// when there's nothing to show yet (no file loaded / invalid input).
// ponytail: rebuilds the whole output doc per refresh — fine for typical files since it's
// debounced and only page 1 is drawn; if huge docs lag, have build() accept a page-1 hint.
export function mountPreview(
  mount: HTMLElement,
  build: () => Promise<Uint8Array | null>,
  opts: { watch?: HTMLElement; scale?: number; debounce?: number } = {},
): PreviewHandle {
  const scale = opts.scale ?? 1;
  const wait = opts.debounce ?? 350;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let seq = 0;               // drop out-of-order async renders
  let lastUrl: string | null = null;

  async function doRender() {
    const my = ++seq;
    let bytes: Uint8Array | null = null;
    try { bytes = await build(); } catch { return; }
    if (my !== seq || !bytes) return;
    try {
      const pdf = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise; // slice: pdf.js detaches its input
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width; canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
      if (my !== seq) return;
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
      if (!blob || my !== seq) return;
      const url = URL.createObjectURL(blob);
      mount.innerHTML = `<img src="${url}" class="w-full rounded border border-hairline" alt="Preview of page 1" />`;
      if (lastUrl) URL.revokeObjectURL(lastUrl);
      lastUrl = url;
    } catch { /* keep the previous preview on a transient failure */ }
  }

  const refresh = () => { if (timer) clearTimeout(timer); timer = setTimeout(doRender, wait); };
  const root = opts.watch ?? mount.ownerDocument.body;
  root.addEventListener('input', refresh);
  root.addEventListener('change', refresh);
  return { refresh };
}
