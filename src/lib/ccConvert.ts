const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function asJson(res: Response): Promise<any> {
  const text = await res.text();
  try { return JSON.parse(text); }
  catch {
    const isDev = /^(localhost|127\.|\[::1\])/.test(location.hostname);
    if (isDev) throw new Error('The conversion service runs on the deployed site (or via `wrangler pages dev`), not in plain dev mode.');
    const snippet = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
    throw new Error(`Conversion failed (HTTP ${res.status})${snippet ? ': ' + snippet : ''}. Try again, or a different file/format.`);
  }
}

// ponytail: some extensions monkeypatch window.fetch and mangle our requests (proven: window.fetch was a
// wrapper forking /api/cc-job to another host, 502ing it). They don't touch XHR, so use XHR as clean transport.
function xhrFetch(url: string, init?: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(init?.method || 'GET', url);
    xhr.responseType = 'text';
    xhr.onload = () => resolve(new Response(xhr.responseText, { status: xhr.status }));
    xhr.onerror = () => reject(new Error('Network error contacting the conversion service.'));
    xhr.send((init?.body as XMLHttpRequestBodyInit) ?? null);
  });
}

// A self-hosted converter on a free tier can sleep and take ~50s to cold-start (returns fast 502s
// while booting), and Cloudflare's edge can also transiently 502/503/504. Retry across a ~70s
// window so a waking service succeeds instead of showing an error after a few seconds.
const RETRY_SLEEPS = [1000, 2000, 4000, 5000, 5000, 5000, 5000, 5000, 5000, 8000, 8000, 8000, 8000]; // ~69s total
async function fetchJson(input: string, init?: RequestInit): Promise<{ res: Response; data: any }> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= RETRY_SLEEPS.length; attempt++) {
    const res = await xhrFetch(input, init);
    if (res.status >= 502 && res.status <= 504) {
      lastErr = new Error('The conversion service is temporarily unavailable. Please try again in a moment.');
      if (attempt < RETRY_SLEEPS.length) { await sleep(RETRY_SLEEPS[attempt]); continue; }
      break;
    }
    return { res, data: await asJson(res) };
  }
  throw lastErr;
}

export type CcFile = { url: string; filename: string };

export async function convertViaApi(
  file: File,
  path: string[],
  onStep?: (hop: number, total: number) => void,
): Promise<CcFile[]> {
  let files: CcFile[] = [];
  const hops = path.length - 1;

  for (let i = 0; i < hops; i++) {
    onStep?.(i + 1, hops);
    const from = path[i], to = path[i + 1];

    const fd = new FormData();
    fd.append('from', from);
    fd.append('to', to);
    if (i === 0) fd.append('file', file);
    else fd.append('url', files[0].url);
    const { res: startRes, data: start } = await fetchJson('/api/cc-job', { method: 'POST', body: fd });
    if (!startRes.ok || !start.jobId) throw new Error(start.error || 'Conversion failed.');

    let done = false;
    for (let n = 0; n < 150; n++) {
      await sleep(2000);
      const { res: pollRes, data: p } = await fetchJson(`/api/cc-job?jobId=${encodeURIComponent(start.jobId)}`);
      if (!pollRes.ok) throw new Error(p.error || 'Conversion failed.');
      if (p.done) { files = p.files || []; done = true; break; }
    }
    if (!done) throw new Error('Conversion timed out — try a smaller file or a different format.');
  }
  if (!files.length) throw new Error('Conversion produced no output.');
  return files;
}
