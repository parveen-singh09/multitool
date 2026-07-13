

let hljs: any = null;
let loading: Promise<any> | null = null;

export function loadHljs(): Promise<any> {
  if (hljs) return Promise.resolve(hljs);
  if (!loading) loading = import('highlight.js').then((h) => (hljs = (h as any).default ?? h));
  return loading;
}

function resolveLang(lang: string): string {
  return hljs?.getLanguage(lang) ? lang : 'plaintext';
}

export async function hl(codeEl: HTMLElement, code: string, lang: string): Promise<void> {
  await loadHljs();
  codeEl.innerHTML = hljs.highlight(code, { language: resolveLang(lang), ignoreIllegal: true }).value;
}

export function wireInput(
  textarea: HTMLTextAreaElement,
  mirrorCodeEl: HTMLElement,
  getLang: () => string,
  onInput?: () => void,
): () => void {
  const pre = mirrorCodeEl.parentElement!;
  const render = async () => {
    await hl(mirrorCodeEl, textarea.value, getLang());

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

  return render;
}
