// Shared UI helpers for client-side PDF tools. Keeps each tool page to just its own logic.

export function download(data: Uint8Array | Blob, name: string, type = 'application/pdf') {
  const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.rel = 'noopener';
  // In the document, not detached: iOS Safari ignores .click() on an unparented anchor, which is one
  // of the ways a tool looked like it "gave no output" on a phone.
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (window.innerWidth < 640) saveBar(url, name);
  // 60s, not 2s: a large PDF is still being written to disk well after click() returns, and revoking
  // mid-write aborts the download silently. The blob is freed either way once the tab goes.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return url;
}

// A tappable save link, shown on phones after every download.
//
// iOS Safari only honours a programmatic .click() while it still counts as user-initiated. Building a
// large PDF takes seconds, so by the time download() runs the gesture has expired and the click is
// dropped with no error — the tool looks like it produced nothing. A real link the user taps carries
// its own gesture, so it always works. Phones only; desktop downloads land fine.
function saveBar(url: string, name: string) {
  document.getElementById('pdf-save-bar')?.remove();
  const bar = document.createElement('div');
  bar.id = 'pdf-save-bar';
  bar.className = 'fixed inset-x-3 bottom-3 z-[80] flex items-center gap-3 rounded-lg border border-hairline bg-surface-2 p-3 shadow-2xl sm:hidden';
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.className = 'btn btn-primary min-w-0 flex-1 justify-center truncate no-underline';
  a.textContent = 'Save file';
  const x = document.createElement('button');
  x.type = 'button';
  x.className = 'shrink-0 rounded p-1.5 text-ink-subtle';
  x.setAttribute('aria-label', 'Dismiss');
  x.textContent = '✕';
  x.addEventListener('click', () => bar.remove());
  bar.appendChild(a);
  bar.appendChild(x);
  document.body.appendChild(bar);
}

// Whether a live rebuild-the-whole-document preview is affordable here.
//
// The tools that change page geometry can't preview with an overlay: they re-run pdf-lib and re-parse
// the result, so at the peak the original bytes, pdf-lib's parsed input, its parsed output, the saved
// copy and pdf.js's own parse are all live at once — several times the file size. A phone renderer
// kills the tab instead of swapping, which is the "it reloaded and gave nothing" report. Desktop has
// the headroom; on a phone, past this size we skip the live preview and still build on download.
export function canPreviewRebuild(byteLength: number, pages: number): boolean {
  if (window.innerWidth >= 640) return true;
  return byteLength <= 8 * 1024 * 1024 && pages <= 60;
}

// Put a button into a working state while a job runs, so a Download that isn't ready yet can't be
// tapped. Restores the original label when done. Tools that build the file before offering it kept
// showing an enabled Download during the build, and tapping it produced nothing.
export function working(btn: HTMLElement, on: boolean, label = 'Working…') {
  const b = btn as HTMLButtonElement;
  if (on) {
    // innerHTML, not textContent: some of these buttons hold an icon <svg> next to their label, and
    // restoring from text alone would silently drop it for the rest of the session.
    if (b.dataset.idleHtml === undefined) b.dataset.idleHtml = b.innerHTML;
    b.textContent = label;
    b.disabled = true;
    b.setAttribute('aria-busy', 'true');
  } else {
    if (b.dataset.idleHtml !== undefined) { b.innerHTML = b.dataset.idleHtml; delete b.dataset.idleHtml; }
    b.disabled = false;
    b.removeAttribute('aria-busy');
  }
}

// Bind a build-then-download button so it shows progress instead of looking idle. Building a large
// PDF takes seconds during which nothing visibly changed, so people tapped Download again and again —
// each tap starting another full build, which is its own way to run a phone out of memory.
export function bindRun(btn: HTMLElement, fn: () => unknown, label = 'Working…') {
  btn.addEventListener('click', async () => {
    if ((btn as HTMLButtonElement).disabled) return;
    working(btn, true, label);
    try { await fn(); } finally { working(btn, false); }
  });
}

// One-line hint above a preview, e.g. explaining that it isn't live on this device. Built here so the
// four rebuild-preview tools don't each need their own markup for it.
export function previewNote(host: HTMLElement, msg: string) {
  let p = host.previousElementSibling as HTMLElement | null;
  if (!p?.dataset.previewNote) {
    p = document.createElement('p');
    p.dataset.previewNote = '1';
    p.className = 'text-[13px] text-ink-subtle';
    host.parentElement?.insertBefore(p, host);
  }
  p.textContent = msg;
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
