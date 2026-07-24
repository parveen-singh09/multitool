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
}

const ICON_MENU = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

export async function mountViewer(opts: ViewerOptions): Promise<ViewerController> {
  // Clamp base width to the viewport so pages fit at 100% on phones; zoom still scales up from here.
  const displayW = Math.min(opts.displayWidth ?? 620, window.innerWidth - 48);
  // Copy the buffer: pdf.js detaches whatever ArrayBuffer it reads (see pdfThumbs.ts).
  const pdf = await pdfjsLib.getDocument({ data: (await opts.file.arrayBuffer()).slice(0) }).promise;
  const pageCount: number = pdf.numPages;

  // --- Chrome ---------------------------------------------------------------
  const root = el('div', 'overflow-hidden rounded-lg border border-hairline');
  const bar = el('div', 'flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-hairline bg-[#333338] px-3 py-2 text-[13px] text-[#e8e8ea]');
  const railToggle = btn('rounded p-1.5 hover:bg-white/10', ICON_MENU, 'Toggle thumbnails');
  const nameEl = el('span', 'min-w-0 max-w-[40%] truncate font-medium'); nameEl.textContent = opts.file.name;
  const counter = el('span', 'whitespace-nowrap text-[#a9a9ad]');
  const curEl = el('span', ''); curEl.textContent = '1';
  const totEl = el('span', ''); totEl.textContent = String(pageCount);
  counter.append(curEl, document.createTextNode(' / '), totEl);
  const spacer = el('span', 'flex-1');
  const zoomWrap = el('div', 'flex items-center gap-1');
  const zOut = btn('rounded px-2 py-1 text-base leading-none hover:bg-white/10', '−', 'Zoom out');
  const zPct = el('span', 'w-12 text-center tabular-nums text-[#a9a9ad]'); zPct.textContent = '100%';
  const zIn = btn('rounded px-2 py-1 text-base leading-none hover:bg-white/10', '+', 'Zoom in');
  const zFit = btn('ml-1 rounded px-2 py-1 text-xs hover:bg-white/10', 'Fit', 'Fit to width');
  zoomWrap.append(zOut, zPct, zIn, zFit);
  const actions = el('div', 'ml-2 flex shrink-0 items-center gap-2'); // tool buttons land here
  bar.append(railToggle, nameEl, counter, spacer, zoomWrap, actions);

  const body = el('div', 'relative flex sm:items-stretch');
  // Rail: off-canvas left drawer on mobile (slides in over the viewer), static sidebar on sm+.
  const rail = el('div', 'absolute inset-y-0 left-0 z-30 flex w-[75%] max-w-[250px] shrink-0 -translate-x-full flex-col items-center gap-4 overflow-y-auto bg-[#2b2b2f] p-4 shadow-xl transition-transform duration-200 sm:static sm:z-auto sm:w-[210px] sm:max-h-[72vh] sm:translate-x-0 sm:shadow-none sm:border-r sm:border-hairline');
  const backdrop = el('div', 'absolute inset-0 z-20 hidden bg-black/50 sm:hidden');
  const viewer = el('div', 'flex min-w-0 flex-1 flex-col items-center gap-4 bg-[#1a1a1d] p-4 max-h-[70vh] overflow-auto sm:max-h-[72vh]');
  body.append(backdrop, rail, viewer);
  root.append(bar, body);

  // --- Slots + rail thumbs --------------------------------------------------
  const slots: HTMLElement[] = [];
  const railCards: HTMLElement[] = [];
  const railThumbs: HTMLElement[] = [];
  let current = 1;

  for (let i = 1; i <= pageCount; i++) {
    // Rail thumbnail
    const thumb = document.createElement('canvas');
    thumb.className = 'block h-auto w-[130px] bg-white shadow ring-1 ring-black/10';
    thumb.style.transition = 'transform 0.2s ease';
    const card = btn('flex shrink-0 flex-col items-center gap-1.5 rounded border-2 border-transparent p-2 text-[12px] text-[#d0d0d3] transition-colors', '');
    card.append(thumb, document.createTextNode(String(i)));
    card.addEventListener('click', () => goToPage(i));
    rail.appendChild(card);
    railCards.push(card);
    railThumbs.push(thumb);

    // Main slot: white page, backdrop img fills it, ratio set after render.
    const slot = el('div', 'relative shrink-0 bg-white shadow-lg');
    slot.dataset.page = String(i);
    slot.style.width = `${displayW}px`;
    const bd = document.createElement('img');
    bd.className = 'block h-full w-full select-none';
    bd.alt = `Page ${i}`;
    slot.appendChild(bd);
    viewer.appendChild(slot);
    slots.push(slot);

    // Render backdrop + thumb lazily but eagerly enough to be smooth.
    renderPage(i).then(({ url, w, h }) => {
      slot.style.aspectRatio = `${w} / ${h}`;
      bd.src = url;
      const tctx = thumb.getContext('2d')!;
      const tw = 130, th = Math.round((h / w) * tw);
      thumb.width = tw; thumb.height = th;
      const im = new Image();
      im.onload = () => tctx.drawImage(im, 0, 0, tw, th);
      im.src = url;
      opts.onPage?.(i, slot);
    }).catch((e) => {
      console.error(`[pdfViewer] page ${i} render failed:`, e);
      slot.style.aspectRatio = '8.5 / 11';
      slot.innerHTML = `<div class="flex h-full items-center justify-center p-4 text-center text-[12px] text-red-500">Page ${i} failed to render:<br>${(e as Error).message}</div>`;
    });
  }

  async function renderPage(n: number): Promise<{ url: string; w: number; h: number }> {
    const pg = await pdf.getPage(n);
    const vp = pg.getViewport({ scale: displayW / pg.getViewport({ scale: 1 }).width });
    const c = document.createElement('canvas');
    c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    const cx = c.getContext('2d')!;
    cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height);
    await pg.render({ canvasContext: cx, viewport: vp, canvas: c } as any).promise;
    return { url: c.toDataURL('image/jpeg', 0.85), w: c.width, h: c.height };
  }

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
      card.classList.toggle('text-[#d0d0d3]', !active);
      if (active) card.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  }
  setCurrent(1);

  function goToPage(n: number) {
    slots[n - 1]?.scrollIntoView({ block: 'start', behavior: 'smooth' });
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
    destroy: () => observer.disconnect(),
  };
}

function el(tag: string, cls: string): HTMLElement { const e = document.createElement(tag); e.className = cls; return e; }
function btn(cls: string, html: string, title?: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button'; b.className = cls; b.innerHTML = html;
  if (title) { b.title = title; b.setAttribute('aria-label', title); }
  return b;
}
