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

// ponytail: Cloudflare's edge occasionally 502/503/504s our Function with an HTML page + Retry-After.
// It's transient (a plain curl to the same URL succeeds), so retry the request instead of failing.
async function fetchJson(input: string, init?: RequestInit): Promise<{ res: Response; data: any }> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(input, init);
    if (res.status >= 502 && res.status <= 504) {
      lastErr = new Error('The conversion service is temporarily unavailable. Please try again in a moment.');
      await sleep(1000 * (attempt + 1));
      continue;
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
