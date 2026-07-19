// Adds "Google Drive / Dropbox" import buttons next to every <input type="file">
// on the page, so any tool's upload gains cloud sources with zero per-tool code.
// A picked cloud file is injected into the native input (via DataTransfer) and a
// `change` event is fired — so each tool's existing change handler runs unchanged.
import { driveReady, pickFromDrive } from './drivePickers';

const SOURCES = [
  { src: 'gdrive', label: 'Google Drive', icon: '<path d="M8 3h8l5 9-4 7H7l-4-7z"/>' },
  { src: 'dropbox', label: 'Dropbox', icon: '<path d="m7 3 5 3-5 3-5-3zM17 3l5 3-5 3-5-3zM2 12l5 3 5-3-5-3zM17 9l5 3-5 3-5-3zM7 18l5-3 5 3-5 3z"/>' },
] as const;

// Push a File into a native input and notify listeners, so the tool reacts as if
// the user had chosen it from disk.
function deliver(input: HTMLInputElement, file: File) {
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function wire(input: HTMLInputElement) {
  if (input.dataset.cloudWired) return;
  // ArchiveConvert and the AI chat have their own Drive/Dropbox menus — skip them.
  if (input.closest('#ac-root') || input.id === 'ai-file') { input.dataset.cloudWired = '1'; return; }
  const ready = SOURCES.filter((s) => driveReady(s.src));
  if (!ready.length) { input.dataset.cloudWired = '1'; return; } // no keys configured
  input.dataset.cloudWired = '1';

  // Split button "Select File ▾" (mirrors ArchiveConvert): main button + device
  // menu item pick from disk; the chevron opens Google Drive / Dropbox sources.
  const wrap = document.createElement('div');
  wrap.className = 'relative mt-4 inline-flex';

  const main = document.createElement('button');
  main.type = 'button';
  main.className = 'btn btn-primary inline-flex items-center gap-2';
  main.style.cssText = 'border-top-right-radius:0;border-bottom-right-radius:0';
  main.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 12v6M9 15h6"/></svg>Select File';
  main.addEventListener('click', (e) => { e.preventDefault(); input.click(); });

  const caret = document.createElement('button');
  caret.type = 'button';
  caret.setAttribute('aria-label', 'Choose upload source');
  caret.className = 'btn btn-primary px-2';
  caret.style.cssText = 'border-top-left-radius:0;border-bottom-left-radius:0;border-left:1px solid rgba(255,255,255,0.22)';
  caret.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

  const menu = document.createElement('div');
  menu.className = 'hidden absolute left-1/2 top-[calc(100%+6px)] z-30 w-[min(13rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-lg border border-hairline bg-surface-2 text-left shadow-xl';

  const item = (icon: string, label: string, onClick: () => void) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-ink hover:bg-surface-3';
    b.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-ink-subtle">${icon}</svg>${label}`;
    b.addEventListener('click', () => { menu.classList.add('hidden'); onClick(); });
    menu.appendChild(b);
    return b;
  };

  item('<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>', 'From this device', () => input.click());
  for (const s of ready) {
    const b = item(s.icon, s.label, async () => {
      b.disabled = true;
      try { await pickFromDrive(s.src, (file) => deliver(input, file)); }
      catch (err) { console.error('Cloud import failed', err); }
      finally { b.disabled = false; }
    });
  }

  caret.addEventListener('click', (e) => { e.stopPropagation(); menu.classList.toggle('hidden'); });
  document.addEventListener('click', () => menu.classList.add('hidden'));
  menu.addEventListener('click', (e) => e.stopPropagation());

  wrap.append(main, caret, menu);

  const label = input.closest('label');
  // Only rebuild genuine drop zones (border-dashed cards). Inline labels are left
  // alone — we just drop the button after them.
  const isDropZone = !!label && label.className.includes('border-dashed');
  if (label && isDropZone) {
    // Rebuild the drop zone to the converter-card look (heading + subtext + button).
    // Preserve the input and any [id] element (page JS updates these, e.g. the
    // filename label) by parking them in a hidden holder so those refs still resolve.
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
    // A button-style label (e.g. "📁 Upload Sticker Image") is itself just a
    // trigger for the hidden input — redundant with the "Select File" button.
    // Replace it so only the split button shows, not two upload controls.
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
  } else {
    (label ?? input.parentElement ?? input).after(wrap);
  }
}

export function initCloudUpload() {
  for (const el of document.querySelectorAll<HTMLInputElement>('input[type="file"]')) wire(el);
}
