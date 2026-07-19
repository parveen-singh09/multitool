import * as D from './docConvert';
import * as F from './finConvert';
import { csvToJson, jsonToCsv, jsonToXml, jsonToYaml, parseCsv, detectDelimiter } from './dataformats';

export type ConvInput = { text?: string; file?: File };
export type ConvResult = { blob?: Blob; ext?: string; text?: string; filename?: string; note?: string };
export interface ConvSpec {
  inputKind: 'text' | 'file';
  accept?: string;
  placeholder?: string;
  run: (input: ConvInput, baseName: string) => Promise<ConvResult>;
}

const enc = new TextEncoder();
const blobOf = (data: string | Uint8Array, mime: string) => new Blob([data as BlobPart], { type: mime });
const textBlob = (s: string, mime = 'text/plain') => blobOf(s, mime);
const bufOf = (f: File) => f.arrayBuffer();

async function readText(input: ConvInput): Promise<string> {
  if (input.text != null && input.text.trim()) return input.text;
  if (input.file) return await input.file.text();
  throw new Error('Provide some text to convert.');
}

const TEXT = 'text/plain';

export const CONVERSIONS: Record<string, ConvSpec> = {
  'txt-to-word': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ blob: D.makeDocx((await readText(i)).split(/\n{2,}/)), ext: 'docx' }) },
  'txt-to-docx': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ blob: D.makeDocx((await readText(i)).split(/\n{2,}/)), ext: 'docx' }) },
  'txt-to-pdf': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ blob: blobOf(await D.buildTextPdf((await readText(i)).split(/\n{2,}/)), 'application/pdf'), ext: 'pdf' }) },
  'txt-to-odt': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ blob: D.txtToOdt(await readText(i)), ext: 'odt' }) },
  'txt-to-json': { inputKind: 'text', placeholder: 'Paste text (one item per line)…', run: async (i) => ({ text: D.txtToJson(await readText(i)) }) },
  'txt-to-html': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ text: D.txtToHtml(await readText(i)) }) },
  'txt-to-xml': { inputKind: 'text', placeholder: 'Paste text (one line per element)…', run: async (i) => ({ text: D.txtToXml(await readText(i)) }) },
  'txt-to-markdown': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ text: D.txtToMarkdown(await readText(i)) }) },
  'txt-to-rtf': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ blob: textBlob(D.txtToRtf(await readText(i)), 'application/rtf'), ext: 'rtf' }) },
  'txt-to-xlsx': { inputKind: 'text', placeholder: 'Paste text (one row per line, tabs/commas split columns)…', run: async (i) => { const t = await readText(i); const rows = t.split('\n').map((l) => l.split(/\t|,/)); return { blob: D.makeXlsx(rows), ext: 'xlsx' }; } },
  'txt-to-sql': { inputKind: 'text', placeholder: 'Paste text (one line per row)…', run: async (i) => ({ text: D.txtToSql(await readText(i)) }) },
  'txt-to-base64': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ text: btoa(unescape(encodeURIComponent(await readText(i)))) }) },
  'txt-to-png': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ blob: await D.textToImage(await readText(i), 'image/png'), ext: 'png' }) },
  'txt-to-jpg': { inputKind: 'text', placeholder: 'Paste your text…', run: async (i) => ({ blob: await D.textToImage(await readText(i), 'image/jpeg', 0.92), ext: 'jpg' }) },
  'txt-to-qr-code': { inputKind: 'text', placeholder: 'Paste text or a URL…', run: async (i) => ({ blob: await qrBlob(await readText(i)), ext: 'png' }) },
  'txt-to-epub': { inputKind: 'text', placeholder: 'Paste your text (blank lines separate paragraphs)…', run: async (i, base) => { const t = await readText(i); const html = t.split(/\n{2,}/).map((p) => `<p>${D.xmlEscape(p)}</p>`).join(''); return { blob: D.buildEpub(base || 'Document', [{ title: base || 'Document', html }]), ext: 'epub' }; } },

  'markdown-to-word': { inputKind: 'text', placeholder: 'Paste Markdown…', run: async (i) => ({ blob: D.makeDocx(D.mdToPlainParagraphs(await readText(i))), ext: 'docx' }) },
  'markdown-to-pdf': { inputKind: 'text', placeholder: 'Paste Markdown…', run: async (i) => ({ blob: blobOf(await D.buildTextPdf(D.mdToPlainParagraphs(await readText(i))), 'application/pdf'), ext: 'pdf' }) },

  'csv-to-pdf': { inputKind: 'text', placeholder: 'Paste CSV…', run: async (i) => { const rows = D.csvMatrix(await readText(i)); return { blob: blobOf(await D.buildTextPdf(rows.map((r) => r.join('   '))), 'application/pdf'), ext: 'pdf' }; } },
  'csv-to-xml': { inputKind: 'text', placeholder: 'Paste CSV…', run: async (i) => { const t = await readText(i); return { text: jsonToXml(csvToJson(t, detectDelimiter(t), true)) }; } },
  'csv-to-sql': { inputKind: 'text', placeholder: 'Paste CSV…', run: async (i) => ({ text: D.csvToSql(await readText(i)) }) },
  'csv-to-html': { inputKind: 'text', placeholder: 'Paste CSV…', run: async (i) => ({ text: D.csvToHtmlTable(await readText(i)) }) },
  'csv-to-word': { inputKind: 'text', placeholder: 'Paste CSV…', run: async (i) => { const rows = D.csvMatrix(await readText(i)); return { blob: D.makeDocx(rows.map((r) => r.join('\t'))), ext: 'docx' }; } },
  'csv-to-markdown': { inputKind: 'text', placeholder: 'Paste CSV…', run: async (i) => ({ text: D.csvToMarkdownTable(await readText(i)) }) },
  'csv-to-tsv': { inputKind: 'text', placeholder: 'Paste CSV…', run: async (i) => ({ text: D.csvToTsv(await readText(i)) }) },
  'csv-to-yaml': { inputKind: 'text', placeholder: 'Paste CSV…', run: async (i) => { const t = await readText(i); return { text: jsonToYaml(csvToJson(t, detectDelimiter(t), true)) }; } },
  'csv-to-txt': { inputKind: 'text', placeholder: 'Paste CSV…', run: async (i) => { const rows = D.csvMatrix(await readText(i)); return { text: rows.map((r) => r.join('\t')).join('\n') }; } },
  'csv-to-vcard': { inputKind: 'text', placeholder: 'Paste CSV (with name/email/phone headers)…', run: async (i) => ({ blob: textBlob(D.csvToVcard(await readText(i)), 'text/vcard'), ext: 'vcf' }) },

  'ipynb-to-python': { inputKind: 'file', accept: '.ipynb,application/json', run: async (i) => ({ text: D.ipynbToPython(await i.file!.text()) }) },
  'ipynb-to-html': { inputKind: 'file', accept: '.ipynb,application/json', run: async (i) => ({ text: await D.ipynbToHtml(await i.file!.text()) }) },
  'ipynb-to-json': { inputKind: 'file', accept: '.ipynb,application/json', run: async (i) => ({ text: JSON.stringify(JSON.parse(await i.file!.text()), null, 2) }) },
  'ipynb-to-latex': { inputKind: 'file', accept: '.ipynb,application/json', run: async (i) => ({ text: D.ipynbToLatex(await i.file!.text()) }) },
  'ipynb-to-word': { inputKind: 'file', accept: '.ipynb,application/json', run: async (i) => ({ blob: D.makeDocx(D.ipynbToPlainText(await i.file!.text()).split(/\n{2,}/)), ext: 'docx' }) },
  'ipynb-to-pdf': { inputKind: 'file', accept: '.ipynb,application/json', run: async (i) => ({ blob: blobOf(await D.buildTextPdf(D.ipynbToPlainText(await i.file!.text()).split(/\n{2,}/)), 'application/pdf'), ext: 'pdf' }) },

  'epub-to-txt': { inputKind: 'file', accept: '.epub,application/epub+zip', run: async (i) => { const d = await D.readEpub(await bufOf(i.file!)); return { text: d.chapters.map((c) => c.text).join('\n\n') }; } },
  'epub-to-html': { inputKind: 'file', accept: '.epub,application/epub+zip', run: async (i) => { const d = await D.readEpub(await bufOf(i.file!)); return { text: `<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>${D.xmlEscape(d.title)}</title></head><body>${d.chapters.map((c) => c.html).join('\n<hr/>\n')}</body></html>` }; } },
  'epub-to-pdf': { inputKind: 'file', accept: '.epub,application/epub+zip', run: async (i) => { const d = await D.readEpub(await bufOf(i.file!)); const paras = d.chapters.flatMap((c) => [c.title, ...c.text.split(/(?<=\.)\s{2,}|\n{2,}/)]); return { blob: blobOf(await D.buildTextPdf(paras), 'application/pdf'), ext: 'pdf' }; } },
  'epub-to-xml': { inputKind: 'file', accept: '.epub,application/epub+zip', run: async (i) => { const d = await D.readEpub(await bufOf(i.file!)); const body = d.chapters.map((c) => `  <chapter title="${D.xmlEscape(c.title)}">${D.xmlEscape(c.text)}</chapter>`).join('\n'); return { text: `<?xml version="1.0" encoding="UTF-8"?>\n<book title="${D.xmlEscape(d.title)}">\n${body}\n</book>` }; } },
  'epub-to-csv': { inputKind: 'file', accept: '.epub,application/epub+zip', run: async (i) => { const d = await D.readEpub(await bufOf(i.file!)); const rows = [['chapter', 'title', 'text'], ...d.chapters.map((c, n) => [String(n + 1), c.title, c.text])]; return { text: rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n') }; } },
  'epub-to-fb2': { inputKind: 'file', accept: '.epub,application/epub+zip', run: async (i) => { const d = await D.readEpub(await bufOf(i.file!)); return { blob: textBlob(D.chaptersToFb2(d.title, d.chapters), 'application/x-fictionbook+xml'), ext: 'fb2' }; } },

  'ebook-converter': { inputKind: 'file', accept: '.epub,application/epub+zip', run: async (i) => { const d = await D.readEpub(await bufOf(i.file!)); return { text: d.chapters.map((c) => `# ${c.title}\n\n${c.text}`).join('\n\n') }; } },

  'word-to-pdf': { inputKind: 'file', accept: '.docx', run: async (i) => ({ blob: blobOf(await D.buildTextPdf((await D.docxText(await bufOf(i.file!))).split('\n')), 'application/pdf'), ext: 'pdf', note: 'Text extracted; original layout, images and styling are not reproduced.' }) },
  'excel-to-pdf': { inputKind: 'file', accept: '.xlsx', run: async (i) => { const rows = await D.xlsxRows(await bufOf(i.file!)); return { blob: blobOf(await D.buildTextPdf(rows.map((r) => r.join('   '))), 'application/pdf'), ext: 'pdf', note: 'Cell values extracted; formulas, charts and formatting are not reproduced.' }; } },
  'ppt-to-txt': { inputKind: 'file', accept: '.pptx', run: async (i) => { const s = await D.pptxText(await bufOf(i.file!)); return { text: s.map((x) => `--- Slide ${x.slide} ---\n${x.text}`).join('\n\n') }; } },
  'ppt-to-word': { inputKind: 'file', accept: '.pptx', run: async (i) => { const s = await D.pptxText(await bufOf(i.file!)); return { blob: D.makeDocx(s.flatMap((x) => [`Slide ${x.slide}`, x.text])), ext: 'docx', note: 'Slide text extracted; visual layout is not reproduced.' }; } },
  'ppt-to-doc': { inputKind: 'file', accept: '.pptx', run: async (i) => { const s = await D.pptxText(await bufOf(i.file!)); return { blob: D.makeDocx(s.flatMap((x) => [`Slide ${x.slide}`, x.text])), ext: 'docx', note: 'Slide text extracted; visual layout is not reproduced.' }; } },
  'ppt-to-html': { inputKind: 'file', accept: '.pptx', run: async (i) => { const s = await D.pptxText(await bufOf(i.file!)); return { text: `<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>Slides</title></head><body>${s.map((x) => `<section><h2>Slide ${x.slide}</h2><pre>${x.text.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))}</pre></section>`).join('\n')}</body></html>` }; } },
  'ppt-to-pdf': { inputKind: 'file', accept: '.pptx', run: async (i) => { const s = await D.pptxText(await bufOf(i.file!)); return { blob: blobOf(await D.buildTextPdf(s.flatMap((x) => [`Slide ${x.slide}`, x.text])), 'application/pdf'), ext: 'pdf', note: 'Slide text extracted into a PDF; visual layout is not reproduced.' }; } },
  'ppt-to-epub': { inputKind: 'file', accept: '.pptx', run: async (i, base) => { const s = await D.pptxText(await bufOf(i.file!)); const chapters = s.map((x) => ({ title: `Slide ${x.slide}`, html: `<p>${D.xmlEscape(x.text)}</p>` })); return { blob: D.buildEpub(base || 'Presentation', chapters), ext: 'epub', note: 'Slide text extracted; visual layout is not reproduced.' }; } },

  'pdf-to-csv': { inputKind: 'file', accept: '.pdf,application/pdf', run: async (i) => { const rows = await pdfLinesToCsv(i.file!); return { text: rows }; } },

  'ofx-to-csv': { inputKind: 'file', accept: '.ofx,.qfx', run: async (i) => ({ text: F.txnsToCsv(F.parseOfx(await i.file!.text())) }) },
  'ofx-to-excel': { inputKind: 'file', accept: '.ofx,.qfx', run: async (i) => ({ blob: F.txnsToXlsx(F.parseOfx(await i.file!.text())), ext: 'xlsx' }) },
  'ofx-to-qfx': { inputKind: 'file', accept: '.ofx', run: async (i) => ({ blob: new Blob([F.txnsToOfx(F.parseOfx(await i.file!.text()))], { type: 'application/x-ofx' }), ext: 'qfx' }) },
  'ofx-to-qbo': { inputKind: 'file', accept: '.ofx,.qfx', run: async (i) => ({ blob: new Blob([F.txnsToOfx(F.parseOfx(await i.file!.text()))], { type: 'application/vnd.intu.qbo' }), ext: 'qbo' }) },
  'ofx-to-pdf': { inputKind: 'file', accept: '.ofx,.qfx', run: async (i) => { const t = F.parseOfx(await i.file!.text()); return { blob: new Blob([await D.buildTextPdf(t.map((x) => `${x.date}  ${x.amount}  ${x.payee} ${x.memo}`))], { type: 'application/pdf' }), ext: 'pdf' }; } },
  'qif-to-ofx': { inputKind: 'file', accept: '.qif', run: async (i) => ({ blob: new Blob([F.txnsToOfx(F.parseQif(await i.file!.text()))], { type: 'application/x-ofx' }), ext: 'ofx' }) },
  'qif-to-excel': { inputKind: 'file', accept: '.qif', run: async (i) => ({ blob: F.txnsToXlsx(F.parseQif(await i.file!.text())), ext: 'xlsx' }) },
  'iif-to-csv': { inputKind: 'file', accept: '.iif', run: async (i) => ({ text: F.txnsToCsv(F.parseIif(await i.file!.text())) }) },
  'iif-to-excel': { inputKind: 'file', accept: '.iif', run: async (i) => ({ blob: F.txnsToXlsx(F.parseIif(await i.file!.text())), ext: 'xlsx' }) },

  'jpg-to-pdf': { inputKind: 'file', accept: 'image/jpeg,.jpg,.jpeg', run: async (i) => ({ blob: await imageToPdf(i.file!), ext: 'pdf' }) },
  'png-to-pdf': { inputKind: 'file', accept: 'image/png,.png', run: async (i) => ({ blob: await imageToPdf(i.file!), ext: 'pdf' }) },
};

async function qrBlob(text: string): Promise<Blob> {
  const QRCode = (await import('qrcode')).default;
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, text || ' ', { width: 512, margin: 2 });
  return new Promise((res, rej) => canvas.toBlob((b) => b ? res(b) : rej(new Error('encode failed')), 'image/png'));
}

async function imageToPdf(file: File): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await PDFDocument.create();
  const img = /png$/i.test(file.type) || /\.png$/i.test(file.name) ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
  const page = pdf.addPage([img.width, img.height]);
  page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  return blobOf(await pdf.save(), 'application/pdf');
}

async function pdfLinesToCsv(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  // @ts-ignore worker url resolved by Vite
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const out: string[] = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    const rowsMap = new Map<number, { x: number; s: string }[]>();
    for (const it of content.items as any[]) {
      const y = Math.round(it.transform[5]);
      if (!rowsMap.has(y)) rowsMap.set(y, []);
      rowsMap.get(y)!.push({ x: it.transform[4], s: it.str });
    }
    [...rowsMap.entries()].sort((a, b) => b[0] - a[0]).forEach(([, cells]) => {
      const line = cells.sort((a, b) => a.x - b.x).map((c) => c.s.trim()).filter(Boolean);
      if (line.length) out.push(line.map((v) => `"${v.replace(/"/g, '""')}"`).join(','));
    });
  }
  return out.join('\n');
}

export const getConversion = (slug: string): ConvSpec | null => CONVERSIONS[slug] ?? null;
