
import { RUNNERS_CODES } from './toolRunners.codes';
import { RUNNERS_CSS } from './toolRunners.css';
import { RUNNERS_DOCS } from './toolRunners.docs';
import { RUNNERS_FILES } from './toolRunners.files';
import { RUNNERS_MISC } from './toolRunners.misc';
import { RUNNERS_IMAGES } from './toolRunners.images';

export type RunFile = { name: string; blob: Blob; kind: 'image' | 'file' };
export type RunResult = { files?: RunFile[]; text?: string; note?: string };

export type RunCtx = {
  query: string;
  files: File[];
  extract: (instruction: string) => Promise<string>;
};

export type Runner = {
  needs: 'text' | 'image' | 'pdf' | 'svg';
  run: (ctx: RunCtx) => Promise<RunResult>;
};

const isPdf = (f: File) => f.type === 'application/pdf' || /\.pdf$/i.test(f.name);

export const canvasBlob = (c: HTMLCanvasElement, type = 'image/png', q?: number): Promise<Blob> =>
  new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), type, q));

export const textFile = (name: string, text: string, mime = 'text/plain'): RunFile =>
  ({ name, blob: new Blob([text], { type: mime }), kind: 'file' });

function parseRange(str: string, pageCount: number): number[] {
  const idx: number[] = [];
  for (const part of str.split(',')) {
    const p = part.trim();
    if (!p) continue;
    const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) { let a = +m[1], b = +m[2]; if (a > b) [a, b] = [b, a]; for (let i = a; i <= b; i++) if (i >= 1 && i <= pageCount) idx.push(i - 1); }
    else if (/^\d+$/.test(p)) { const n = +p; if (n >= 1 && n <= pageCount) idx.push(n - 1); }
  }
  return [...new Set(idx)];
}

export const RUNNERS: Record<string, Runner> = {
  'qr-code-generator': {
    needs: 'text',
    async run({ extract }) {
      const content = await extract('Extract ONLY the exact text or URL the user wants encoded in the QR code. Return just that string — no quotes, no explanation.');
      if (!content) throw new Error('Tell me what to encode (a URL or some text).');
      const { buildPayload, renderToCanvas, DEFAULT_OPTIONS } = await import('./qr');
      const type = /^https?:\/\//i.test(content) || /\.[a-z]{2,}(\/|$)/i.test(content) ? 'url' : 'text';
      const canvas = document.createElement('canvas');
      renderToCanvas(canvas, buildPayload(type, type === 'url' ? { url: content } : { text: content }), DEFAULT_OPTIONS, 1024);
      return { files: [{ name: 'qr.png', blob: await canvasBlob(canvas), kind: 'image' }], note: `QR code for “${content}”` };
    },
  },

  'barcode-generator': {
    needs: 'text',
    async run({ extract }) {
      const content = await extract('Extract ONLY the exact data to encode in the barcode. Return just that string.');
      if (!content) throw new Error('Tell me what data to encode.');
      const { toCanvas } = await import('./barcode');
      const canvas = document.createElement('canvas');
      await toCanvas(canvas, {
        bcid: 'code128', text: content, scale: 3, height: 10, includetext: true,
        rotate: 'N', barcolor: '000000', backgroundcolor: 'ffffff', textcolor: '000000',
        paddingwidth: 4, paddingheight: 4,
      });
      return { files: [{ name: 'barcode.png', blob: await canvasBlob(canvas), kind: 'image' }], note: `Code 128 barcode · “${content}”` };
    },
  },

  'pdf-split': {
    needs: 'pdf',
    async run({ query, files }) {
      const src = files.find(isPdf);
      if (!src) throw new Error('Attach a PDF to split.');
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await src.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const count = doc.getPageCount();
      const rangeText = (query.match(/\d+\s*-\s*\d+|\d+/g) ?? []).join(',');
      const base = src.name.replace(/\.pdf$/i, '') || 'pdf';
      if (rangeText) {
        const idx = parseRange(rangeText, count);
        if (!idx.length) throw new Error(`No pages in range within 1–${count}.`);
        const out = await PDFDocument.create();
        (await out.copyPages(doc, idx)).forEach((p) => out.addPage(p));
        const blob = new Blob([(await out.save()) as BlobPart], { type: 'application/pdf' });
        return { files: [{ name: `${base}-extracted.pdf`, blob, kind: 'file' }], note: `Extracted ${idx.length} of ${count} pages.` };
      }
      const out: RunFile[] = [];
      for (let i = 0; i < count; i++) {
        const one = await PDFDocument.create();
        one.addPage((await one.copyPages(doc, [i]))[0]);
        out.push({ name: `${base}-page-${i + 1}.pdf`, blob: new Blob([(await one.save()) as BlobPart], { type: 'application/pdf' }), kind: 'file' });
      }
      return { files: out, note: `Split into ${count} single-page PDFs.` };
    },
  },

  'pdf-to-text': {
    needs: 'pdf',
    async run({ files }) {
      const src = files.find(isPdf);
      if (!src) throw new Error('Attach a PDF to extract text from.');
      const pdfjs = await import('pdfjs-dist');
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      const pdf = await pdfjs.getDocument({ data: (await src.arrayBuffer()).slice(0) }).promise;
      let text = '';
      for (let n = 1; n <= pdf.numPages; n++) {
        const content = await (await pdf.getPage(n)).getTextContent();
        const rows: { y: number; parts: { x: number; s: string }[] }[] = [];
        for (const it of content.items as any[]) {
          const s = it.str; if (!s) continue;
          const x = it.transform?.[4] ?? 0, y = it.transform?.[5] ?? 0;
          const row = rows.find((r) => Math.abs(r.y - y) <= 3);
          if (row) row.parts.push({ x, s }); else rows.push({ y, parts: [{ x, s }] });
        }
        rows.sort((a, b) => b.y - a.y);
        const page = rows.map((r) => r.parts.sort((a, b) => a.x - b.x).map((p) => p.s).join(' ').replace(/\s+/g, ' ').trim()).join('\n');
        text += `----- Page ${n} -----\n${page}\n\n`;
      }
      const clean = text.trim();
      if (clean.replace(/\s|-+Page\d+-+/g, '').length < 10)
        throw new Error('No embedded text found — this looks scanned. Use the full tool for OCR.');
      return { text: clean, note: `${pdf.numPages} page${pdf.numPages === 1 ? '' : 's'} · ${clean.length.toLocaleString()} chars` };
    },
  },

  'image-to-pdf': {
    needs: 'image',
    async run({ files }) {
      const imgs = files.filter((f) => /^image\/(jpeg|png|webp|gif|bmp)$/.test(f.type));
      if (!imgs.length) throw new Error('Attach one or more images (JPG, PNG, WebP, GIF, BMP).');
      const { PDFDocument } = await import('pdf-lib');
      const pdf = await PDFDocument.create();
      for (const f of imgs) {
        let bytes: ArrayBuffer, isPng: boolean;
        if (f.type === 'image/jpeg' || f.type === 'image/png') {
          bytes = await f.arrayBuffer(); isPng = f.type === 'image/png';
        } else {
          const bmp = await createImageBitmap(f, { imageOrientation: 'from-image' });
          const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height;
          c.getContext('2d')!.drawImage(bmp, 0, 0); bmp.close?.();
          bytes = await (await canvasBlob(c)).arrayBuffer(); isPng = true;
        }
        const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const blob = new Blob([(await pdf.save()) as BlobPart], { type: 'application/pdf' });
      return { files: [{ name: 'images.pdf', blob, kind: 'file' }], note: `${imgs.length} image${imgs.length === 1 ? '' : 's'} → PDF` };
    },
  },

  'svg-downloader': {
    needs: 'svg',
    async run({ files }) {
      const svgs = files.filter((f) => f.type === 'image/svg+xml' || /\.svg$/i.test(f.name));
      if (!svgs.length) throw new Error('Attach one or more SVG files.');
      const out: RunFile[] = [];
      for (const f of svgs) {
        const svgText = await f.text();
        const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('bad SVG')); im.src = url;
        });
        const w = 512, ratio = img.width ? img.height / img.width : 1;
        const c = document.createElement('canvas'); c.width = w; c.height = Math.max(1, Math.round(w * ratio));
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        out.push({ name: f.name.replace(/\.svg$/i, '') + '.png', blob: await canvasBlob(c), kind: 'image' });
      }
      return { files: out, note: `${out.length} SVG${out.length === 1 ? '' : 's'} → PNG (512px)` };
    },
  },

  'favicon-generator': {
    needs: 'text', // works from a message; uses an attached image if one is present
    async run({ files, extract }) {
      const sizes = [16, 32, 48];
      const img = files.find((f) => /^image\//.test(f.type) && f.type !== 'image/svg+xml');

      const canvases = await Promise.all(sizes.concat(256).map(async (s) => {
        const c = document.createElement('canvas'); c.width = s; c.height = s;
        const ctx = c.getContext('2d')!;
        if (img) {
          const bmp = await createImageBitmap(img);
          const scale = Math.max(s / bmp.width, s / bmp.height); 
          const dw = bmp.width * scale, dh = bmp.height * scale;
          ctx.drawImage(bmp, (s - dw) / 2, (s - dh) / 2, dw, dh); bmp.close?.();
        } else {
          const text = (await extract('Return ONLY the 1-4 character letter or emoji for the favicon, e.g. "T". No quotes.')) || 'T';
          ctx.fillStyle = '#5e6ad2'; ctx.beginPath(); ctx.roundRect(0, 0, s, s, s * 0.22); ctx.fill();
          ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.font = `700 ${s * 0.6}px Inter, system-ui, sans-serif`;
          ctx.fillText(text, s / 2, s / 2 + s * 0.04);
        }
        return c;
      }));
      const label = img ? `from ${img.name}` : 'from text';

      const pngs = await Promise.all(sizes.map((s, i) =>
        canvasBlob(canvases[i]).then(async (b) => new Uint8Array(await b.arrayBuffer()))));
      const header = 6 + sizes.length * 16;
      let offset = header;
      const dirs = sizes.map((s, i) => { const d = [s, s, 0, 0, 1, 32, pngs[i].length, offset]; offset += pngs[i].length; return d; });
      const buf = new Uint8Array(offset);
      const dv = new DataView(buf.buffer);
      dv.setUint16(0, 0, true); dv.setUint16(2, 1, true); dv.setUint16(4, sizes.length, true);
      let p = 6;
      for (const [w, h, cc, r, planes, bpp, len, off] of dirs) {
        buf[p] = w; buf[p + 1] = h; buf[p + 2] = cc; buf[p + 3] = r;
        dv.setUint16(p + 4, planes, true); dv.setUint16(p + 6, bpp, true);
        dv.setUint32(p + 8, len, true); dv.setUint32(p + 12, off, true); p += 16;
      }
      sizes.forEach((s, i) => buf.set(pngs[i], dirs[i][7]));

      return {
        files: [
          { name: 'favicon.ico', blob: new Blob([buf], { type: 'image/x-icon' }), kind: 'file' },
          { name: 'favicon-256.png', blob: await canvasBlob(canvases[3]), kind: 'image' },
        ],
        note: `Favicon ${label} · .ico (16/32/48) + 256px PNG`,
      };
    },
  },
};

RUNNERS['pokemon-generator'] = {
  needs: 'text',
  async run() {
    const id = 1 + Math.floor(Math.random() * 1025); 
    const d = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json();
    const name = (d.name as string).replace(/-/g, ' ');
    const types = d.types.map((t: any) => t.type.name).join(', ');
    const stats = (d.stats as any[]).map((s) => `${s.stat.name}: ${s.base_stat}`).join(' · ');
    const total = (d.stats as any[]).reduce((a, s) => a + s.base_stat, 0);
    const text = `#${String(d.id).padStart(4, '0')} ${name[0].toUpperCase() + name.slice(1)}\n` +
      `Type: ${types}\nHeight: ${(d.height / 10).toFixed(1)} m · Weight: ${(d.weight / 10).toFixed(1)} kg\n` +
      `${stats}\nTotal: ${total}`;
    const art = d.sprites?.other?.['official-artwork']?.front_default ?? d.sprites?.front_default;
    const files: RunFile[] = [];
    if (art) {
      try { files.push({ name: `${name}.png`, blob: await (await fetch(art)).blob(), kind: 'image' }); } catch {}
    }
    return { files, text, note: `Random Pokémon · ${name[0].toUpperCase() + name.slice(1)}` };
  },
};

RUNNERS['tarot-card-generator'] = {
  needs: 'text',
  async run() {
    const { TAROT_DECK } = await import('./gendata');
    const { sample, randFloat } = await import('./random');
    const card = sample(TAROT_DECK, 1)[0];
    const reversed = randFloat() < 0.5;
    const meaning = reversed ? card.reversed : card.upright;
    const arcana = card.arcana === 'Major' ? 'Major Arcana' : `${card.suit} · Minor Arcana`;
    const text = `${card.name}${reversed ? ' (reversed)' : ''}\n${arcana} · ${card.element} · ${card.astrology}\n\n${meaning}\n\n${card.keywords.join(' · ')}`;
    const files: RunFile[] = [];
    try { files.push({ name: `${card.name}.jpg`, blob: await (await fetch(card.img)).blob(), kind: 'image' }); } catch {}
    return { files, text, note: `Tarot · ${card.name}${reversed ? ' (reversed)' : ''}` };
  },
};

RUNNERS['image-to-base64'] = {
  needs: 'image',
  async run({ files }) {
    const img = files.find((f) => /^image\//.test(f.type));
    if (!img) throw new Error('Attach an image to encode.');
    const dataUri = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = () => rej(new Error('read failed'));
      r.readAsDataURL(img);
    });
    return { text: dataUri, note: `${img.name} → Base64 data URI (${Math.ceil(dataUri.length / 1024)} KB of text)` };
  },
};

RUNNERS['base64-to-image'] = {
  needs: 'text',
  async run({ extract }) {
    const raw = (await extract('Return ONLY the Base64 string or data URI the user wants decoded — no quotes, no explanation.')).trim();
    if (!raw) throw new Error('Paste a Base64 string (or data URI) to decode.');
    const m = raw.match(/^data:([^;]+);base64,(.*)$/s);
    const mime = m ? m[1] : 'image/png';
    const b64 = (m ? m[2] : raw).replace(/\s/g, '');
    let bytes: Uint8Array;
    try {
      const bin = atob(b64);
      bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    } catch { throw new Error('That doesn’t look like valid Base64.'); }
    const ext = mime.split('/')[1]?.replace('+xml', '') || 'png';
    return { files: [{ name: `decoded.${ext}`, blob: new Blob([bytes], { type: mime }), kind: 'image' }], note: `Base64 → ${ext.toUpperCase()} image` };
  },
};

RUNNERS['base64-file-downloader'] = RUNNERS['base64-to-image'];

RUNNERS['ico-converter'] = RUNNERS['favicon-generator'];

Object.assign(RUNNERS, RUNNERS_CODES, RUNNERS_CSS, RUNNERS_DOCS, RUNNERS_FILES, RUNNERS_MISC, RUNNERS_IMAGES);

export const getRunner = (slug: string): Runner | null => RUNNERS[slug] ?? null;
