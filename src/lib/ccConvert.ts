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
    // ponytail: sync — POST blocks and returns the file. No poll GET, so nothing left to 502 mid-conversion.
    const res = await fetch('/api/cc-job', { method: 'POST', body: fd });
    const data = await asJson(res);
    if (!res.ok) throw new Error(data.error || 'Conversion failed.');
    files = data.files || [];
    if (!files.length) throw new Error('Conversion produced no output.');
  }
  if (!files.length) throw new Error('Conversion produced no output.');
  return files;
}
