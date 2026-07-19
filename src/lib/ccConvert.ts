const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function asJson(res: Response): Promise<any> {
  const text = await res.text();
  try { return JSON.parse(text); }
  catch {
    const isDev = /^(localhost|127\.|\[::1\])/.test(location.hostname);
    if (isDev) throw new Error('The conversion service runs on the deployed site (or via `wrangler pages dev`), not in plain dev mode.');
    // ponytail: 5xx from the edge means Cloudflare returned its own HTML page, not our JSON — don't scrape it.
    if (res.status >= 502 && res.status <= 504) {
      throw new Error('The conversion service is temporarily unavailable. Please try again in a moment.');
    }
    const snippet = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
    throw new Error(`Conversion failed (HTTP ${res.status})${snippet ? ': ' + snippet : ''}. Try again, or a different file/format.`);
  }
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
    const startRes = await fetch('/api/cc-job', { method: 'POST', body: fd });
    const start = await asJson(startRes);
    if (!startRes.ok || !start.jobId) throw new Error(start.error || 'Conversion failed.');

    let done = false;
    for (let n = 0; n < 150; n++) {
      await sleep(2000);
      const pollRes = await fetch(`/api/cc-job?jobId=${encodeURIComponent(start.jobId)}`);
      const p = await asJson(pollRes);
      if (!pollRes.ok) throw new Error(p.error || 'Conversion failed.');
      if (p.done) { files = p.files || []; done = true; break; }
    }
    if (!done) throw new Error('Conversion timed out — try a smaller file or a different format.');
  }
  if (!files.length) throw new Error('Conversion produced no output.');
  return files;
}
