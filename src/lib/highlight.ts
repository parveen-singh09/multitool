// Shared syntax-highlighting helpers for Developer tool previews.
// Wraps highlight.js (already a dependency) so no tool re-implements lazy
// loading, HTML-safe highlighting, or the editable-overlay scroll sync.
//
// Two UI shapes, both styled by .hl-block / .hl-edit in global.css:
//   - read-only output: <pre class="hl-block"><code class="hljs"></code></pre>
//   - editable input:   <div class="hl-edit">
//                         <pre class="hl-block"><code class="hljs"></code></pre>
//                         <textarea></textarea>
//                       </div>

let hljs: any = null;
let loading: Promise<any> | null = null;

/** Lazy-load the full highlight.js build once (registers all common langs). */
export function loadHljs(): Promise<any> {
  if (hljs) return Promise.resolve(hljs);
  if (!loading) loading = import('highlight.js').then((h) => (hljs = (h as any).default ?? h));
  return loading;
}

/** Resolve a hljs language id, falling back to plaintext when no grammar exists. */
function resolveLang(lang: string): string {
  return hljs?.getLanguage(lang) ? lang : 'plaintext';
}

/**
 * Highlight `code` as `lang` into a <code> element. Loads hljs on first call.
 * Uses hljs's own escaping, so untrusted paste is safe (no raw innerHTML).
 */
export async function hl(codeEl: HTMLElement, code: string, lang: string): Promise<void> {
  await loadHljs();
  codeEl.innerHTML = hljs.highlight(code, { language: resolveLang(lang), ignoreIllegal: true }).value;
}

/**
 * Wire a transparent textarea over its mirror <pre><code> for a highlighted,
 * editable input. Mirrors text on every keystroke, syncs scroll, and re-runs
 * `onInput` (debounced by the caller if needed). `getLang` is read each render
 * so the language can change at runtime (e.g. a From/To selector).
 */
export function wireInput(
  textarea: HTMLTextAreaElement,
  mirrorCodeEl: HTMLElement,
  getLang: () => string,
  onInput?: () => void,
): () => void {
  const pre = mirrorCodeEl.parentElement!;
  const render = async () => {
    await hl(mirrorCodeEl, textarea.value, getLang());
    // A trailing newline needs a placeholder so <pre> height matches the textarea.
    if (textarea.value.endsWith('\n')) mirrorCodeEl.innerHTML += '\n';
    pre.scrollTop = textarea.scrollTop;
    pre.scrollLeft = textarea.scrollLeft;
  };
  const syncScroll = () => {
    pre.scrollTop = textarea.scrollTop;
    pre.scrollLeft = textarea.scrollLeft;
  };
  textarea.addEventListener('input', () => { render(); onInput?.(); });
  textarea.addEventListener('scroll', syncScroll);
  render();
  // Returned so callers can re-highlight after a programmatic `textarea.value =`
  // assignment (which does not fire an 'input' event) — e.g. in-place formatters.
  return render;
}
