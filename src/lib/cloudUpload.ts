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
  // ArchiveConvert already has its own Drive/Dropbox menu — don't double up.
  if (input.closest('#ac-root')) { input.dataset.cloudWired = '1'; return; }
  const ready = SOURCES.filter((s) => driveReady(s.src));
  if (!ready.length) { input.dataset.cloudWired = '1'; return; } // no keys configured
  input.dataset.cloudWired = '1';

  const row = document.createElement('div');
  row.className = 'mt-2 flex flex-wrap items-center gap-2 text-[13px] text-ink-tertiary';
  row.append('or import from');
  for (const s of ready) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface-2 px-2 py-1 text-ink-subtle transition-colors hover:bg-surface-3 hover:text-ink';
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${s.icon}</svg>${s.label}`;
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      btn.disabled = true;
      try { await pickFromDrive(s.src, (file) => deliver(input, file)); }
      catch (err) { console.error('Cloud import failed', err); }
      finally { btn.disabled = false; }
    });
    row.appendChild(btn);
  }
  // Anchor after the visible drop zone / label wrapping the (usually sr-only) input.
  const anchor = input.closest('label') ?? input.parentElement ?? input;
  anchor.after(row);
}

export function initCloudUpload() {
  for (const el of document.querySelectorAll<HTMLInputElement>('input[type="file"]')) wire(el);
}
