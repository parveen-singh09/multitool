import { driveReady, pickFromDrive, warmGoogle } from './drivePickers';

// Full brand-coloured SVG markup per source (rendered as-is in the menu).
const ICON_DRIVE = '<svg width="18" height="18" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg"><path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/><path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z" fill="#00ac47"/><path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/><path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/><path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/><path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/></svg>';
const ICON_DROPBOX = '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#0061ff" d="M6 2 0 6l6 4 6-4zM18 2l-6 4 6 4 6-4zM0 14l6 4 6-4-6-4zM18 10l-6 4 6 4 6-4zM6 19l6 4 6-4-6-4z"/></svg>';
const ICON_ONEDRIVE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#0364b8"><path d="M13.5 6.5a6 6 0 0 0-5.8 4.2A5 5 0 0 0 5 20.5h13.2a4 4 0 0 0 .8-7.9 6 6 0 0 0-5.5-6.1z"/></svg>';
const ICON_URL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e5484d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>';
const ICON_DEVICE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5e6ad2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2" fill="#5e6ad2" fill-opacity="0.18"/><path d="M2 20h20M8 16v4M16 16v4"/></svg>';

const SOURCES = [
  { src: 'gdrive', label: 'Google Drive', icon: ICON_DRIVE },
  { src: 'dropbox', label: 'Dropbox', icon: ICON_DROPBOX },
  { src: 'onedrive', label: 'OneDrive', icon: ICON_ONEDRIVE },
] as const;

let lockedY = 0;
let scrollLocked = false;
function lockScroll() {
  if (scrollLocked) return;
  lockedY = window.scrollY;
  const b = document.body.style;
  b.position = 'fixed';
  b.top = `-${lockedY}px`;
  b.left = '0';
  b.right = '0';
  b.width = '100%';
  scrollLocked = true;
}
function unlockScroll() {
  if (!scrollLocked) return;
  const b = document.body.style;
  b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = '';
  scrollLocked = false;
  window.scrollTo(0, lockedY);
}

function deliver(input: HTMLInputElement, files: File[]) {
  const dt = new DataTransfer();
  for (const f of files) dt.items.add(f);
  input.files = dt.files;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

// Fetch a file straight from a URL in the browser and hand it to the input.
// Client-side only, so cross-origin hosts that don't send CORS headers will fail — reported plainly.
async function importFromUrl(input: HTMLInputElement) {
  const url = window.prompt('Paste a direct file URL:');
  if (!url) return;
  let u: URL;
  try { u = new URL(url.trim()); } catch { alert('That is not a valid URL.'); return; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') { alert('Only http(s) URLs are supported.'); return; }
  try {
    const res = await fetch(u.href);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const name = decodeURIComponent(u.pathname.split('/').pop() || 'download') || 'download';
    deliver(input, [new File([blob], name, { type: blob.type || 'application/octet-stream' })]);
  } catch (err) {
    console.error('URL import failed', err);
    alert("Couldn't fetch that URL. The site may block cross-origin downloads — try saving the file and uploading it from your device.");
  }
}

function wire(input: HTMLInputElement) {
  if (input.dataset.cloudWired) return;
  if (input.closest('#ac-root') || input.id === 'ai-file' || input.dataset.noCloud != null) { input.dataset.cloudWired = '1'; return; }
  const ready = SOURCES.filter((s) => driveReady(s.src));
  if (!ready.length) { input.dataset.cloudWired = '1'; return; }
  input.dataset.cloudWired = '1';

  const wrap = document.createElement('div');
  wrap.className = 'relative mt-4 inline-flex';

  const pickLabel = input.dataset.pickLabel || 'Select File';
  const main = document.createElement('button');
  main.type = 'button';
  main.className = 'btn btn-primary inline-flex items-center gap-2';
  main.style.cssText = 'border-top-right-radius:0;border-bottom-right-radius:0';
  main.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 12v6M9 15h6"/></svg>${pickLabel}`;
  main.addEventListener('click', (e) => { e.preventDefault(); input.click(); });

  const caret = document.createElement('button');
  caret.type = 'button';
  caret.setAttribute('aria-label', 'Choose upload source');
  caret.className = 'btn btn-primary px-2';
  caret.style.cssText = 'border-top-left-radius:0;border-bottom-left-radius:0;border-left:1px solid rgba(255,255,255,0.22)';
  caret.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

  const menu = document.createElement('div');
  menu.className = 'hidden fixed z-50 overflow-hidden rounded-lg border border-hairline bg-surface-2 text-left shadow-xl';

  const item = (icon: string, label: string, onClick: () => void) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-ink hover:bg-surface-3';
    b.innerHTML = `<span class="flex h-[18px] w-[18px] shrink-0 items-center justify-center">${icon}</span>${label}`;
    b.addEventListener('click', () => { menu.classList.add('hidden'); onClick(); });
    menu.appendChild(b);
    return b;
  };

  item(ICON_DEVICE, 'From this device', () => input.click());
  for (const s of ready) {
    const b = item(s.icon, s.label, async () => {
      b.disabled = true;
      lockScroll();
      const picked: File[] = [];
      try {
        await pickFromDrive(s.src, (file) => picked.push(file), input.multiple);
        if (picked.length) deliver(input, picked);
      }
      catch (err) { console.error('Cloud import failed', err); }
      finally { unlockScroll(); b.disabled = false; }
    });
  }

  // Web address (URL): fully client-side, so it's subject to CORS — works for hosts that allow
  // cross-origin fetches, fails clearly otherwise (we have no server to proxy through).
  item(ICON_URL, 'Web Address (URL)', () => importFromUrl(input));

  const place = () => {
    const r = wrap.getBoundingClientRect();
    const width = Math.min(208, window.innerWidth - 16);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    menu.style.width = `${width}px`;
    menu.style.left = `${left}px`;
    menu.style.top = `${r.bottom + 6}px`;
  };
  caret.addEventListener('click', (e) => {
    e.stopPropagation();
    const opening = menu.classList.contains('hidden');
    if (opening) { place(); warmGoogle().catch(() => {}); } // preload SDKs so the mobile popup survives the tap
    menu.classList.toggle('hidden');
  });
  document.addEventListener('click', () => menu.classList.add('hidden'));
  window.addEventListener('resize', () => menu.classList.add('hidden'));
  window.addEventListener('scroll', () => menu.classList.add('hidden'), true);
  menu.addEventListener('click', (e) => e.stopPropagation());

  wrap.append(main, caret);
  document.body.appendChild(menu);

  const label = input.closest('label');
  const isDropZone = !!label && label.className.includes('border-dashed');
  if (label && isDropZone) {
    const holder = document.createElement('span');
    holder.className = 'sr-only';
    holder.appendChild(input);
    for (const el of Array.from(label.querySelectorAll<HTMLElement>('[id]'))) holder.appendChild(el);
    label.replaceChildren(holder);
    label.insertAdjacentHTML('afterbegin',
      '<span class="text-[15px] font-semibold text-ink">Drop your file here</span>' +
      '<span class="text-[13px] text-ink-subtle">choose a source below, or drag a file in</span>');
    label.appendChild(wrap);
  } else if (label && label.className.includes('btn')) {
    const holder = document.createElement('span');
    holder.className = 'sr-only';
    holder.appendChild(input);
    for (const el of Array.from(label.querySelectorAll<HTMLElement>('[id]'))) holder.appendChild(el);
    wrap.appendChild(holder);
    const center = document.createElement('div');
    center.className = 'flex w-full justify-center';
    wrap.className = 'relative mt-4 flex w-full';
    main.style.cssText += ';flex:1 1 auto';
    center.appendChild(wrap);
    label.replaceWith(center);
  } else if (input.dataset.pickInline != null) {
    // Replace a named toolbar button with the split picker, sitting inline in the row.
    wrap.className = 'relative inline-flex items-stretch';
    const anchor = input.dataset.pickInline && document.getElementById(input.dataset.pickInline);
    if (anchor) anchor.replaceWith(wrap); else input.after(wrap);
  } else {
    (label ?? input.parentElement ?? input).after(wrap);
  }
}

export function initCloudUpload() {
  for (const el of document.querySelectorAll<HTMLInputElement>('input[type="file"]')) wire(el);
}
