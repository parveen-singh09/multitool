// Shared UI helpers for client-side PDF tools. Keeps each tool page to just its own logic.

export function download(data: Uint8Array | Blob, name: string, type = 'application/pdf') {
  const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// Wire a drop zone + hidden file input to a callback. PDF-only by default. Call once on load.
export function setupDrop(
  drop: HTMLElement,
  input: HTMLInputElement,
  onFiles: (files: File[]) => void,
  accept: (f: File) => boolean = (f) => f.type === 'application/pdf',
) {
  const keep = (fl: FileList | File[]) => Array.from(fl).filter(accept);
  input.addEventListener('change', () => input.files && onFiles(keep(input.files)));
  ['dragover', 'dragenter'].forEach((e) => drop.addEventListener(e, (ev) => { ev.preventDefault(); drop.classList.add('bg-surface-2'); }));
  ['dragleave', 'drop'].forEach((e) => drop.addEventListener(e, () => drop.classList.remove('bg-surface-2')));
  drop.addEventListener('drop', (ev) => { ev.preventDefault(); const f = (ev as DragEvent).dataTransfer?.files; if (f) onFiles(keep(f)); });
}

// Debounce a rebuild-the-whole-PDF preview, and never let two run at once.
//
// The tools that change page geometry (crop, flip, resize, n-up) can't preview with a DOM overlay —
// they have to re-run pdf-lib and re-parse the result. Plain debouncing isn't enough: on a phone one
// rebuild of a large document outlasts the debounce window, so the next one starts while the first is
// still going and two full documents (plus their saved copies) are live at once. That's what pushes a
// mobile renderer over its memory limit, and the tab comes back looking like it reloaded.
//
// So: coalesce. While a rebuild is running, extra requests set a flag and re-run once, after.
// Phones also get a longer window, since a rebuild there costs seconds rather than milliseconds.
export function makeScheduler(run: () => Promise<void>, delay?: number, mobileDelay?: number) {
  const wait = window.innerWidth < 640 ? (mobileDelay ?? 900) : (delay ?? 400);
  let timer: ReturnType<typeof setTimeout> | null = null;
  let running = false, queued = false;
  const fire = async () => {
    if (running) { queued = true; return; }
    running = true;
    try { await run(); } catch (e) { console.error('[preview] rebuild failed:', e); }
    finally {
      running = false;
      if (queued) { queued = false; void fire(); }
    }
  };
  return () => { if (timer) clearTimeout(timer); timer = setTimeout(fire, wait); };
}

// Parse "1-3, 5, 8-10" into zero-based unique page indices within [1, count]. Empty string => all pages.
export function parsePageRange(str: string, count: number): number[] {
  if (!str.trim()) return Array.from({ length: count }, (_, i) => i);
  const idx: number[] = [];
  for (const part of str.split(',')) {
    const p = part.trim();
    if (!p) continue;
    const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) { let a = +m[1], b = +m[2]; if (a > b) [a, b] = [b, a]; for (let i = a; i <= b; i++) if (i >= 1 && i <= count) idx.push(i - 1); }
    else if (/^\d+$/.test(p)) { const n = +p; if (n >= 1 && n <= count) idx.push(n - 1); }
  }
  return [...new Set(idx)];
}
