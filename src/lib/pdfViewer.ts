// Shared read-only PDF page viewer: dark toolbar (filename, page counter, zoom/fit, sidebar toggle),
// a thumbnail rail, and a vertical scroll-stack of all pages. Scroll syncs the rail + counter.
//
// It renders page backdrops only. Per-page tool controls (rotate dropdown, delete checkbox, crop
// rectangle, …) are the tool's job: pass an `onPage(pageNum, slot)` hook and add your own elements
// into each slot. Tool action buttons go in the toolbar's actions container (returned as `actions`).
//
// For the editor-style tools (watermark) that need a live fabric overlay, keep their bespoke viewer;
// this module is deliberately fabric-free.
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface ViewerController {
  root: HTMLElement;            // the whole viewer (toolbar + body). Insert this where you want it.
  actions: HTMLElement;         // toolbar actions slot — append your Download / Apply buttons here.
  slots: HTMLElement[];         // per-page slot elements, 1:1 with pages (index 0 = page 1).
  railThumbs: HTMLElement[];    // rail thumbnail canvases, 1:1 with pages — style these to mirror slot edits.
  pageCount: number;
  currentPage(): number;        // page most in view.
  goToPage(n: number): void;    // smooth-scroll a page into view.
  setPageVisible(n: number, visible: boolean): void; // show/hide a page's slot AND its rail thumbnail.
  destroy(): void;              // disconnect observers; call before re-mounting.
}

export interface ViewerOptions {
  file: File;
  displayWidth?: number;        // backdrop render width in px (default 620).
  onPage?: (pageNum: number, slot: HTMLElement) => void; // inject per-page controls/overlays.
  // Where the viewer will end up. Passing it lets us drop a loading placeholder in *now* — reading
  // and parsing the file happens before this function can return a root, so without it the page
  // sits empty for that whole stretch. We remove the placeholder ourselves before returning.
  mount?: HTMLElement;
  // The viewer this one replaces, for tools that re-mount when settings change. We destroy it at the
  // right moment and swap the new root into `mount`, which is what makes the swap safe on a phone.
  replaces?: ViewerController | null;
}

const ICON_MENU = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

export async function mountViewer(opts: ViewerOptions): Promise<ViewerController> {
  // Show a placeholder for the read+parse+first-render stretch, before there's a root to hand back.
  // This runs before the first await, so it paints immediately. Convention default: the #viewer-mount
  // container every tool page already uses, so tools get this without passing anything.
  const target = opts.mount ?? document.getElementById('viewer-mount');
  const prev = opts.replaces ?? null;
  let killed = false;
  const killPrev = () => { if (prev && !killed) { killed = true; prev.destroy(); } };
  // On a phone, tear the outgoing viewer down BEFORE parsing the replacement. Holding both means two
  // parsed documents and both sets of decoded pages are live at the same moment, and that peak is what
  // makes the renderer kill the tab — which comes back looking like the page reloaded. Desktop keeps
  // the old pixels up during the swap, since it has the headroom and the flash is worse than the cost.
  if (prev && window.innerWidth < 640) { killPrev(); target?.replaceChildren(); }
  const placeholder = target ? showLoading(target) : null;
  try {
    const ctl = await build(opts);
    placeholder?.remove();
    killPrev();
    if (target && prev) target.replaceChildren(ctl.root);
    return ctl;
  } finally {
    placeholder?.remove();
  }
}

async function build(opts: ViewerOptions): Promise<ViewerController> {
  // Clamp base width to the viewport so pages fit at 100% on phones; zoom still scales up from here.
  const displayW = Math.min(opts.displayWidth ?? 620, window.innerWidth - 48);
  // Copy the buffer: pdf.js detaches whatever ArrayBuffer it reads (see pdfThumbs.ts).
  const task = pdfjsLib.getDocument({ data: (await opts.file.arrayBuffer()).slice(0) });
  const pdf = await task.promise;
  const pageCount: number = pdf.numPages;
  // Page 1's ratio seeds every slot so the scroll container has real height before anything renders —
  // without it all slots are 0px tall, every one counts as "in view", and lazy rendering degrades to eager.
  const seed = (await pdf.getPage(1)).getViewport({ scale: 1 });
  const seedRatio = seed.width / seed.height;

  // --- Chrome ---------------------------------------------------------------
  const root = el('div', 'overflow-hidden rounded-lg border border-hairline');
  // Toolbar. Two fixed rows on mobile, one row on sm+ — NOT flex-wrap. With wrapping, the zoom
  // controls slid left and right mid-render: the "Rendering…" chip appears and disappears in the
  // same row, and the page counter changes width as you scroll, so items kept re-flowing between
  // rows. `sm:contents` lets each row dissolve into the single desktop row without duplicate markup.
  const bar = el('div', 'flex flex-col gap-y-2 border-b border-hairline bg-surface-3 px-3 py-2 text-[13px] text-ink sm:flex-row sm:items-center sm:gap-x-2');
  const topRow = el('div', 'flex min-w-0 items-center gap-2 sm:contents');
  const ctlRow = el('div', 'flex items-center justify-between gap-2 sm:contents');
  const railToggle = btn('shrink-0 rounded p-1.5 hover:bg-white/10', ICON_MENU, 'Toggle thumbnails');
  const nameEl = el('span', 'min-w-0 flex-1 truncate font-medium sm:max-w-[40%] sm:flex-none'); nameEl.textContent = opts.file.name;
  // Reserves its width even when idle, so showing it can't shift anything. Desktop keeps the label;
  // mobile shows the spinner alone, where horizontal room is scarce.
  const busy = el('span', 'invisible flex shrink-0 items-center gap-1.5 whitespace-nowrap text-ink-subtle');
  busy.innerHTML = '<span class="pdf-spin"></span><span class="hidden sm:inline">Rendering…</span>';
  busy.setAttribute('role', 'status');
  const counter = el('span', 'shrink-0 whitespace-nowrap tabular-nums text-ink-tertiary');
  const curEl = el('span', 'inline-block text-right'); curEl.textContent = '1';
  // Widest page number decides the width up front, so "9 / 500" -> "10 / 500" doesn't nudge the row.
  curEl.style.minWidth = `${String(pageCount).length}ch`;
  const totEl = el('span', ''); totEl.textContent = String(pageCount);
  counter.appendChild(curEl);
  counter.appendChild(document.createTextNode(' / '));
  counter.appendChild(totEl);
  const spacer = el('span', 'hidden flex-1 sm:block');
  const zoomWrap = el('div', 'flex shrink-0 items-center gap-1');
  const zOut = btn('rounded px-2 py-1 text-base leading-none hover:bg-white/10', '−', 'Zoom out');
  const zPct = el('span', 'w-12 text-center tabular-nums text-ink-tertiary'); zPct.textContent = '100%';
  const zIn = btn('rounded px-2 py-1 text-base leading-none hover:bg-white/10', '+', 'Zoom in');
  const zFit = btn('ml-1 rounded px-2 py-1 text-xs hover:bg-white/10', 'Fit', 'Fit to width');
  zoomWrap.append(zOut, zPct, zIn, zFit);
  const actions = el('div', 'flex shrink-0 items-center gap-2 sm:ml-2'); // tool buttons land here
  // appendChild, not append(...kids): the repo's DOM lib resolves multi-arg append to a non-Node overload.
  const add = (p: HTMLElement, kids: HTMLElement[]) => { for (const k of kids) p.appendChild(k); };
  add(topRow, [railToggle, nameEl, counter, busy]);
  add(ctlRow, [zoomWrap, actions]);
  add(bar, [topRow, spacer, ctlRow]);

  const body = el('div', 'relative flex sm:items-stretch');
  // Rail: off-canvas left drawer on mobile (slides in over the viewer), static sidebar on sm+.
  const rail = el('div', 'absolute inset-y-0 left-0 z-30 flex w-[75%] max-w-[250px] shrink-0 -translate-x-full flex-col items-center gap-4 overflow-y-auto bg-surface-2 p-4 shadow-xl transition-transform duration-200 sm:static sm:z-auto sm:w-[210px] sm:max-h-[72vh] sm:translate-x-0 sm:shadow-none sm:border-r sm:border-hairline');
  const backdrop = el('div', 'absolute inset-0 z-20 hidden bg-black/50 sm:hidden');
  const viewer = el('div', 'flex min-w-0 flex-1 flex-col items-center gap-4 bg-surface-1 p-4 max-h-[70vh] overflow-auto sm:max-h-[72vh]');
  body.append(backdrop, rail, viewer);
  root.append(bar, body);

  // --- Slots + rail thumbs --------------------------------------------------
  const slots: HTMLElement[] = [];
  const railCards: HTMLElement[] = [];
  const railThumbs: HTMLElement[] = [];
  const backdrops: HTMLImageElement[] = [];
  const skels: HTMLElement[] = [];  // shimmer placeholders, hidden (not removed) as pages render
  const started: boolean[] = [];   // page has begun rendering (never render twice)
  const pageUrl: (string | null)[] = [];  // live blob URL per page, null once evicted
  const resident: number[] = [];   // page numbers currently holding a decoded image
  const visible = new Set<number>();  // pages intersecting the viewport — never evicted
  const gen: number[] = [];        // bumped on evict, so a render in flight knows it was superseded
  let destroyed = false;
  let current = 1;

  // A rendered page keeps a decoded bitmap alive for as long as its <img> holds the blob URL —
  // roughly width*height*4 bytes, so ~0.5MB per page at phone width. Holding all of them was
  // ~275MB for a 500-page document, which a mobile renderer kills rather than swaps: the tab
  // reappears "reloaded". So cap how many stay resident and evict the ones furthest from view.
  // Phones get a tighter cap and less render concurrency (each in-flight render needs its own
  // full-page canvas, and one core doing 4 rasterizations at once is what makes scrolling lag).
  const phone = window.innerWidth < 640;
  const MAX_RESIDENT = phone ? 8 : 24;
  const MAX_CONCURRENT = phone ? 1 : 3;

  for (let i = 1; i <= pageCount; i++) {
    // Rail thumbnail. Sized from page 1's ratio up front so the rail doesn't reflow as pages fill in.
    const thumb = document.createElement('canvas');
    thumb.className = 'pdf-skel block h-auto w-[130px] bg-white shadow ring-1 ring-black/10';
    thumb.style.transition = 'transform 0.2s ease';
    // Backing store stays 1x1 until this thumb actually renders. Sizing it up front allocated
    // 130x168x4 bytes per page — ~45MB of canvas for a 500-page doc, before rendering anything.
    // CSS aspect-ratio holds the layout box, so the rail doesn't reflow when the real size lands.
    thumb.width = 1; thumb.height = 1;
    thumb.style.aspectRatio = `${seed.width} / ${seed.height}`;
    const card = btn('flex shrink-0 flex-col items-center gap-1.5 rounded border-2 border-transparent p-2 text-[12px] text-ink-subtle transition-colors', '');
    card.append(thumb, document.createTextNode(String(i)));
    card.addEventListener('click', () => goToPage(i));
    card.dataset.page = String(i);
    rail.appendChild(card);
    railCards.push(card);
    railThumbs.push(thumb);

    // Main slot: white page, backdrop img fills it, exact ratio replaces the seed once rendered.
    const slot = el('div', 'relative shrink-0 bg-white shadow-lg');
    slot.dataset.page = String(i);
    slot.style.width = `${displayW}px`;
    slot.style.aspectRatio = `${seed.width} / ${seed.height}`;
    // Shimmer placeholder, shown until this page renders. Sits under any tool overlay (z-0) and
    // is removed on render so nothing keeps animating off-screen.
    const skel = el('div', 'pdf-skel absolute inset-0 z-0 flex items-center justify-center');
    const skelNum = el('span', 'text-[12px] font-medium');
    skelNum.style.color = '#9aa0a6';
    skelNum.textContent = String(i);
    skel.appendChild(skelNum);
    const bd = document.createElement('img');
    bd.className = 'relative z-[1] block h-full w-full select-none';
    bd.alt = `Page ${i}`;
    slot.appendChild(skel); slot.appendChild(bd);
    viewer.appendChild(slot);
    slots.push(slot);
    backdrops.push(bd);
    skels.push(skel);

    // Per-page controls are injected up front, not after render: a tool's onPage often builds state
    // (page order, per-page settings) that must cover every page and be in page order.
    opts.onPage?.(i, slot);
  }

  // Toolbar spinner reflects "some page is still rendering", counted rather than boolean so
  // overlapping renders don't clear it early.
  let pending = 0;
  function setBusy(delta: number) {
    pending += delta;
    const on = pending > 0 && !destroyed;
    // visibility, not display: the chip keeps its space either way, so the zoom controls never move.
    busy.classList.toggle('invisible', !on);
  }

  // Drop a rendered page's pixels. It re-renders from the queue if scrolled back to, so this is a
  // cache, not a teardown: the slot keeps its size and its tool overlays, and shows the placeholder.
  function evict(n: number) {
    const i = n - 1;
    const url = pageUrl[i];
    if (!url) return;
    backdrops[i]?.removeAttribute('src'); // release the decoded bitmap before revoking
    URL.revokeObjectURL(url);
    pageUrl[i] = null;
    started[i] = false;
    gen[i] = (gen[i] ?? 0) + 1; // invalidate any render still in flight for this page
    const skel = skels[i];
    if (skel) skel.style.display = '';
    const t = railThumbs[i] as HTMLCanvasElement | undefined;
    if (t) { t.width = 1; t.height = 1; t.classList.add('pdf-skel'); }
    const at = resident.indexOf(n);
    if (at >= 0) resident.splice(at, 1);
  }

  // Keep only MAX_RESIDENT pages in memory, dropping whichever is furthest from where you're looking.
  // On-screen pages are never evicted: IntersectionObserver only fires on *changes*, so a page
  // evicted while still visible would sit as a placeholder until you scrolled it away and back.
  function trim() {
    while (resident.length > MAX_RESIDENT) {
      let worst = -1;
      for (const n of resident) {
        if (n === current || visible.has(n)) continue;
        if (worst < 0 || Math.abs(n - current) > Math.abs(worst - current)) worst = n;
      }
      if (worst < 0) break; // everything resident is in view; over cap is better than a blank page
      evict(worst);
    }
  }

  // Render queue. Each in-flight render allocates a full-page canvas and competes for the single
  // pdf.js worker, so running several at once on a phone is what makes scrolling stutter — one at a
  // time there. Nearest-to-viewport goes first so the page you're actually on doesn't wait.
  const queue: number[] = [];
  let active = 0;

  function ensure(n: number) {
    if (destroyed || started[n - 1] || queue.includes(n)) return;
    queue.push(n);
    pump();
  }

  function pump() {
    while (!destroyed && active < MAX_CONCURRENT && queue.length) {
      let best = 0;
      for (let k = 1; k < queue.length; k++) {
        if (Math.abs(queue[k] - current) < Math.abs(queue[best] - current)) best = k;
      }
      const n = queue.splice(best, 1)[0];
      // Scrolled far past while queued: drop it. Re-requested by the observer if it comes back.
      if (Math.abs(n - current) > MAX_RESIDENT * 2) continue;
      if (started[n - 1]) continue;
      started[n - 1] = true;
      active++;
      setBusy(1);
      void draw(n).finally(() => { active--; setBusy(-1); pump(); });
    }
  }

  async function draw(n: number) {
    const myGen = gen[n - 1] ?? 0;
    try {
      const { url, w, h } = await renderPage(n, railThumbs[n - 1] as HTMLCanvasElement);
      // Evicted (and possibly re-queued) while this render was in flight: throw the pixels away
      // rather than write a second URL into the slot and leak the first.
      if (destroyed || myGen !== (gen[n - 1] ?? 0)) { URL.revokeObjectURL(url); return; }
      pageUrl[n - 1] = url;
      resident.push(n);
      slots[n - 1].style.aspectRatio = `${w} / ${h}`;
      // Hide the placeholder only once the decode lands, so there's no white flash between them.
      const bd = backdrops[n - 1];
      const hide = () => { const s = skels[n - 1]; if (s) s.style.display = 'none'; };
      bd.addEventListener('load', hide, { once: true });
      bd.addEventListener('error', hide, { once: true });
      bd.src = url;
      railThumbs[n - 1]?.classList.remove('pdf-skel');
      trim();
    } catch (e) {
      if (destroyed) return; // a render aborted by destroy() isn't a failure worth showing
      console.error(`[pdfViewer] page ${n} render failed:`, e);
      const s = skels[n - 1]; if (s) s.style.display = 'none';
      railThumbs[n - 1]?.classList.remove('pdf-skel');
      const note = el('div', 'absolute inset-0 z-[2] flex items-center justify-center p-4 text-center text-[12px]');
      note.style.color = '#e5484d';
      note.textContent = `Page ${n} failed to render: ${(e as Error).message}`;
      slots[n - 1]?.appendChild(note);
    }
  }

  async function renderPage(n: number, thumb: HTMLCanvasElement): Promise<{ url: string; w: number; h: number }> {
    const pg = await pdf.getPage(n);
    const vp = pg.getViewport({ scale: displayW / pg.getViewport({ scale: 1 }).width });
    const c = document.createElement('canvas');
    c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    const cx = c.getContext('2d')!;
    cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height);
    await pg.render({ canvasContext: cx, viewport: vp, canvas: c } as any).promise;
    // Thumb comes off the same canvas — no second render, no Image round-trip.
    thumb.width = 130; thumb.height = Math.round((c.height / c.width) * 130);
    thumb.getContext('2d')!.drawImage(c, 0, 0, thumb.width, thumb.height);
    const blob = await new Promise<Blob | null>((res) => c.toBlob(res, 'image/jpeg', 0.85));
    if (!blob) throw new Error('canvas encode failed');
    pg.cleanup();
    return { url: URL.createObjectURL(blob), w: c.width, h: c.height };
  }

  // Two lazy observers because the rail and the page stack scroll independently.
  // The shimmer only animates while a placeholder is near the viewport: it repaints on the main
  // thread every frame, so leaving hundreds running off-screen is pure CPU burn on a phone.
  const lazyMain = new IntersectionObserver((es) => {
    for (const e of es) {
      const n = Number((e.target as HTMLElement).dataset.page);
      if (e.isIntersecting) { visible.add(n); ensure(n); } else visible.delete(n);
      skels[n - 1]?.classList.toggle('is-live', e.isIntersecting);
    }
    trim(); // the visible band moved; drop what left it
  }, { root: viewer, rootMargin: phone ? '150px 0px' : '400px 0px' });
  const lazyRail = new IntersectionObserver((es) => {
    for (const e of es) {
      const n = Number((e.target as HTMLElement).dataset.page);
      railThumbs[n - 1]?.classList.toggle('is-live', e.isIntersecting && !pageUrl[n - 1]);
      if (e.isIntersecting) ensure(n);
    }
  }, { root: rail, rootMargin: phone ? '150px 0px' : '300px 0px' });
  slots.forEach((s) => lazyMain.observe(s));
  railCards.forEach((c) => lazyRail.observe(c));
  // Warm the first pages unconditionally: the observers can't fire while root is still detached
  // (callers append it after we return) or mounted inside a hidden panel.
  for (let n = 1; n <= Math.min(3, pageCount); n++) ensure(n);

  // --- Scroll -> current page sync -----------------------------------------
  const observer = new IntersectionObserver((entries) => {
    let best: IntersectionObserverEntry | null = null;
    for (const e of entries) if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
    if (best && best.isIntersecting) setCurrent(Number((best.target as HTMLElement).dataset.page));
  }, { root: viewer, threshold: [0.25, 0.5, 0.75] });
  slots.forEach((s) => observer.observe(s));

  function setCurrent(n: number) {
    if (!n || n === current) return;
    current = n;
    curEl.textContent = String(n);
    railCards.forEach((card, i) => {
      const active = i + 1 === n;
      card.classList.toggle('border-primary', active);
      card.classList.toggle('border-transparent', !active);
      card.classList.toggle('text-primary', active);
      card.classList.toggle('text-ink-subtle', !active);
      if (active) card.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    trim(); // "furthest from view" moved, so re-check what's worth keeping
  }
  setCurrent(1);

  function goToPage(n: number) {
    // Smooth-scroll only for nearby jumps: animating past 200 pages would trip the lazy observer
    // on every page in between and render the whole document. Measured before setCurrent moves `current`.
    const far = Math.abs(n - current) > 10;
    setCurrent(n); // highlight now; don't wait for the scroll observer to catch up
    ensure(n);
    slots[n - 1]?.scrollIntoView({ block: 'start', behavior: far ? 'auto' : 'smooth' });
    if (window.innerWidth < 640) setRail(false); // close the mobile drawer after picking a page
  }

  // --- Zoom -----------------------------------------------------------------
  let zoom = 1;
  function setZoom(z: number) {
    zoom = Math.min(3, Math.max(0.25, z));
    for (const s of slots) s.style.width = `${displayW * zoom}px`;
    zPct.textContent = `${Math.round(zoom * 100)}%`;
  }
  let fitted = false;
  const clearFit = () => { fitted = false; zFit.classList.remove('bg-white/15'); };
  zIn.addEventListener('click', () => { clearFit(); setZoom(zoom + 0.15); });
  zOut.addEventListener('click', () => { clearFit(); setZoom(zoom - 0.15); });
  // Fit toggles: first click fits page width to the viewport, second click restores 100%.
  zFit.addEventListener('click', () => {
    if (fitted) { clearFit(); setZoom(1); return; }
    const avail = viewer.clientWidth - 32;
    if (avail <= 0) return;
    setZoom(avail / displayW);
    fitted = true; zFit.classList.add('bg-white/15'); // highlight so it reads as active
  });
  // Hamburger toggles the rail. Two mechanisms because the rail is styled differently per breakpoint:
  //  - mobile: off-canvas drawer — slide via -translate-x-full + dim with the backdrop.
  //  - desktop: static sidebar (sm:translate-x-0 overrides transforms) — collapse via display:none.
  const setRail = (open: boolean) => {
    if (window.innerWidth >= 640) {
      rail.style.display = open ? '' : 'none';   // desktop: show/hide the column
    } else {
      rail.style.display = '';                    // ensure mobile uses the transform, not a stale display
      rail.classList.toggle('-translate-x-full', !open);
      backdrop.classList.toggle('hidden', !open);
    }
  };
  const railVisible = () => window.innerWidth >= 640
    ? rail.style.display !== 'none'
    : !rail.classList.contains('-translate-x-full');
  railToggle.addEventListener('click', () => setRail(!railVisible()));
  backdrop.addEventListener('click', () => setRail(false));

  return {
    root, actions, slots, railThumbs, pageCount,
    currentPage: () => current,
    goToPage,
    setPageVisible: (n, visible) => {
      const slot = slots[n - 1], card = railCards[n - 1];
      if (!slot || !card) return;
      slot.style.display = visible ? '' : 'none';
      card.style.display = visible ? '' : 'none';
      visible ? observer.observe(slot) : observer.unobserve(slot); // hidden pages don't drive the counter
    },
    destroy: () => {
      destroyed = true;
      observer.disconnect(); lazyMain.disconnect(); lazyRail.disconnect();
      queue.length = 0;
      // Drop every <img> src before revoking, else the decoded bitmaps outlive the URLs.
      backdrops.forEach((bd) => bd.removeAttribute('src'));
      pageUrl.forEach((u) => u && URL.revokeObjectURL(u));
      pageUrl.length = 0; resident.length = 0;
      // Frees the worker's copy of the file. Tools that remount per keystroke leaked one whole
      // parsed document per render before this. destroy() lives on the loading task, not the proxy.
      task.destroy().catch(() => {});
    },
  };
}

// Placeholder shown while the file is read, parsed, and the first page rendered — a dark chrome bar
// matching the real toolbar, over a shimmering page shape, so the layout doesn't jump on swap.
// Skipped when the mount already holds a preview: tools that re-mount on every settings change would
// otherwise stack this under the visible preview and shove the page around. There, the toolbar
// spinner carries the feedback instead.
function showLoading(target: HTMLElement): HTMLElement | null {
  if (target.firstElementChild) return null;
  const box = el('div', 'overflow-hidden rounded-lg border border-hairline');
  const bar = el('div', 'flex items-center gap-2 border-b border-hairline bg-surface-3 px-3 py-2 text-[13px] text-ink-subtle');
  bar.innerHTML = '<span class="pdf-spin"></span>';
  const label = el('span', '');
  label.textContent = 'Loading preview…';
  bar.appendChild(label);
  const body = el('div', 'flex justify-center bg-surface-1 p-4');
  const page = el('div', 'pdf-skel is-live w-full max-w-[620px] rounded-sm'); // one element, always animating
  page.style.aspectRatio = '8.5 / 11'; // letter — the real ratio replaces it once page 1 is measured
  body.appendChild(page);
  box.appendChild(bar); box.appendChild(body);
  box.setAttribute('role', 'status');
  box.setAttribute('aria-label', 'Loading PDF preview');
  target.appendChild(box);
  return box;
}

function el(tag: string, cls: string): HTMLElement { const e = document.createElement(tag); e.className = cls; return e; }
function btn(cls: string, html: string, title?: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button'; b.className = cls; b.innerHTML = html;
  if (title) { b.title = title; b.setAttribute('aria-label', title); }
  return b;
}
