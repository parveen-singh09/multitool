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
