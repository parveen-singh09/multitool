import { csvToJson, jsonToCsv, jsonToYaml, jsonToXml, parseCsv, parseYaml, detectDelimiter, type Json } from './dataformats';
import { makeDocx } from './docx';
import { makeXlsx } from './xlsx';
import { makeZip } from './zip';
import { unzip } from './unzip';

const enc = new TextEncoder();
export const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const htmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export interface ConvOut { blob: Blob; ext: string }

export async function mdToHtml(md: string, full = true): Promise<string> {
  const { Marked } = await import('marked');
  const inst = new Marked({ gfm: true, breaks: false });
  const body = await inst.parse(md);
  if (!full) return body;
  return `<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Document</title></head>\n<body>\n${body}\n</body></html>`;
}

export function mdToPlainParagraphs(md: string): string[] {
  return md.split(/\n{2,}/).map((block) =>
    block.replace(/^#{1,6}\s+/gm, '').replace(/[*_`>#-]/g, (m) => (m === '-' ? '•' : '')).trim()
  ).filter(Boolean);
}

export function txtToRtf(text: string): string {
  const esc = text.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/\n/g, '\\par\n');
  return `{\\rtf1\\ansi\\deff0\n${esc}\n}`;
}
export function txtToSql(text: string, table = 'lines'): string {
  const lines = text.split('\n');
  const rows = lines.map((l) => `INSERT INTO ${table} (line) VALUES ('${l.replace(/'/g, "''")}');`);
  return `CREATE TABLE ${table} (line TEXT);\n` + rows.join('\n');
}
export function txtToXml(text: string): string {
  const lines = text.split('\n').map((l) => `  <line>${xmlEscape(l)}</line>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<document>\n${lines}\n</document>`;
}
export function txtToJson(text: string): string {
  return JSON.stringify(text.split('\n'), null, 2);
}
export function txtToHtml(text: string, full = true): string {
  const body = `<pre>${htmlEscape(text)}</pre>`;
  if (!full) return body;
  return `<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><title>Document</title></head>\n<body>\n${body}\n</body></html>`;
}
export function txtToMarkdown(text: string): string {
  return text;
}
export function txtToOdt(text: string): Blob {
  const paras = text.split('\n').map((l) => `<text:p>${xmlEscape(l)}</text:p>`).join('');
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" office:version="1.2">
<office:body><office:text>${paras}</office:text></office:body></office:document-content>`;
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">
<manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>
<manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;
  return new Blob([makeZip([
    { name: 'mimetype', data: enc.encode('application/vnd.oasis.opendocument.text') },
    { name: 'content.xml', data: enc.encode(content) },
    { name: 'META-INF/manifest.xml', data: enc.encode(manifest) },
  ])], { type: 'application/vnd.oasis.opendocument.text' });
}

export function buildEpub(title: string, chaptersHtml: { title: string; html: string }[]): Blob {
  const uid = 'urn:uuid:tool-' + title.replace(/\W+/g, '-').toLowerCase();
  const manifestItems = chaptersHtml.map((_, i) => `<item id="ch${i + 1}" href="ch${i + 1}.xhtml" media-type="application/xhtml+xml"/>`).join('');
  const spineItems = chaptersHtml.map((_, i) => `<itemref idref="ch${i + 1}"/>`).join('');
  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="BookId">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
<dc:title>${xmlEscape(title)}</dc:title><dc:language>en</dc:language><dc:identifier id="BookId">${uid}</dc:identifier></metadata>
<manifest>${manifestItems}<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/></manifest>
<spine toc="ncx">${spineItems}</spine></package>`;
  const navPoints = chaptersHtml.map((c, i) => `<navPoint id="ch${i + 1}" playOrder="${i + 1}"><navLabel><text>${xmlEscape(c.title)}</text></navLabel><content src="ch${i + 1}.xhtml"/></navPoint>`).join('');
  const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="${uid}"/></head>
<docTitle><text>${xmlEscape(title)}</text></docTitle><navMap>${navPoints}</navMap></ncx>`;
  const container = `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`;
  const files = [
    { name: 'mimetype', data: enc.encode('application/epub+zip') },
    { name: 'META-INF/container.xml', data: enc.encode(container) },
    { name: 'OEBPS/content.opf', data: enc.encode(opf) },
    { name: 'OEBPS/toc.ncx', data: enc.encode(ncx) },
    ...chaptersHtml.map((c, i) => ({
      name: `OEBPS/ch${i + 1}.xhtml`,
      data: enc.encode(`<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${xmlEscape(c.title)}</title></head><body>${c.html}</body></html>`),
    })),
  ];
  return new Blob([makeZip(files)], { type: 'application/epub+zip' });
}

export interface EpubDoc { title: string; chapters: { title: string; html: string; text: string }[] }
export async function readEpub(buf: ArrayBuffer): Promise<EpubDoc> {
  const entries = await unzip(buf);
  const byName = new Map(entries.map((e) => [e.name, e.data]));
  const td = new TextDecoder();
  const container = byName.get('META-INF/container.xml');
  if (!container) throw new Error('Not a valid EPUB (missing container.xml).');
  const opfPath = td.decode(container).match(/full-path="([^"]+)"/)?.[1];
  if (!opfPath) throw new Error('EPUB container has no rootfile path.');
  const opf = td.decode(byName.get(opfPath) || new Uint8Array());
  const base = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/') + 1) : '';
  const title = opf.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/)?.[1]?.trim() || 'ebook';
  const manifest = new Map<string, string>();
  for (const m of opf.matchAll(/<item\s+[^>]*id="([^"]+)"[^>]*href="([^"]+)"[^>]*\/?>/g)) manifest.set(m[1], m[2]);
  for (const m of opf.matchAll(/<item\s+[^>]*href="([^"]+)"[^>]*id="([^"]+)"[^>]*\/?>/g)) manifest.set(m[2], m[1]);
  const spine = [...opf.matchAll(/<itemref\s+[^>]*idref="([^"]+)"/g)].map((m) => m[1]);
  const chapters: EpubDoc['chapters'] = [];
  for (const id of spine) {
    const href = manifest.get(id);
    if (!href) continue;
    const data = byName.get(base + href) || byName.get(href);
    if (!data) continue;
    const html = td.decode(data);
    const bodyHtml = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
    const text = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
    const chTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || `Chapter ${chapters.length + 1}`;
    chapters.push({ title: chTitle, html: bodyHtml, text });
  }
  return { title, chapters };
}

export function chaptersToFb2(title: string, chapters: { title: string; text: string }[]): string {
  const sections = chapters.map((c) => {
    const paras = c.text.split(/\n{2,}|(?<=\.)\s{2,}/).filter(Boolean).map((p) => `<p>${xmlEscape(p.trim())}</p>`).join('');
    return `<section><title><p>${xmlEscape(c.title)}</p></title>${paras}</section>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0">
<description><title-info><book-title>${xmlEscape(title)}</book-title></title-info></description>
<body><title><p>${xmlEscape(title)}</p></title>${sections}</body></FictionBook>`;
}

export interface Notebook { cells: { cell_type: string; source: string[] | string; outputs?: any[] }[]; metadata?: any }
function cellSource(c: any): string { return Array.isArray(c.source) ? c.source.join('') : String(c.source || ''); }
export function parseNotebook(json: string): Notebook {
  const nb = JSON.parse(json);
  if (!nb.cells) throw new Error('Not a valid Jupyter notebook (no cells).');
  return nb;
}
export function ipynbToPython(json: string): string {
  const nb = parseNotebook(json);
  return nb.cells.map((c) => {
    const src = cellSource(c);
    if (c.cell_type === 'code') return src;
    return src.split('\n').map((l) => '# ' + l).join('\n');
  }).join('\n\n');
}
export async function ipynbToHtml(json: string): Promise<string> {
  const nb = parseNotebook(json);
  const parts: string[] = [];
  for (const c of nb.cells) {
    const src = cellSource(c);
    if (c.cell_type === 'markdown') parts.push(await mdToHtml(src, false));
    else if (c.cell_type === 'code') parts.push(`<pre class="code"><code>${htmlEscape(src)}</code></pre>`);
  }
  return `<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><title>Notebook</title>\n<style>body{font-family:system-ui,sans-serif;max-width:56rem;margin:2rem auto;padding:0 1rem;line-height:1.6}pre.code{background:#f5f5f5;padding:1rem;border-radius:6px;overflow:auto}</style></head>\n<body>\n${parts.join('\n')}\n</body></html>`;
}
export function ipynbToLatex(json: string): string {
  const nb = parseNotebook(json);
  const esc = (s: string) => s.replace(/([&%$#_{}])/g, '\\$1').replace(/\\/g, '\\textbackslash{}');
  const body = nb.cells.map((c) => {
    const src = cellSource(c);
    if (c.cell_type === 'code') return `\\begin{verbatim}\n${src}\n\\end{verbatim}`;
    return esc(src);
  }).join('\n\n');
  return `\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\begin{document}\n${body}\n\\end{document}`;
}
export function ipynbToPlainText(json: string): string {
  const nb = parseNotebook(json);
  return nb.cells.map((c) => cellSource(c)).join('\n\n');
}

const stripTags = (xml: string) => xml.replace(/<[^>]+>/g, '');
export async function docxText(buf: ArrayBuffer): Promise<string> {
  const doc = await unzipTextEntry(buf, 'word/document.xml');
  if (!doc) throw new Error('Not a valid .docx file.');
  return doc.split(/<\/w:p>/).map((p) => {
    const runs = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => m[1]).join('');
    return decodeXml(runs);
  }).filter((l) => l.length).join('\n');
}
export async function pptxText(buf: ArrayBuffer): Promise<{ slide: number; text: string }[]> {
  const entries = await unzip(buf);
  const slides = entries.filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.name))
    .sort((a, b) => (+a.name.match(/(\d+)/)![1]) - (+b.name.match(/(\d+)/)![1]));
  const td = new TextDecoder();
  return slides.map((s, i) => {
    const xml = td.decode(s.data);
    const text = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((m) => decodeXml(m[1])).join('\n');
    return { slide: i + 1, text };
  });
}
export async function xlsxRows(buf: ArrayBuffer): Promise<string[][]> {
  const entries = await unzip(buf);
  const td = new TextDecoder();
  const byName = new Map(entries.map((e) => [e.name, td.decode(e.data)]));
  const shared: string[] = [];
  const ss = byName.get('xl/sharedStrings.xml');
  if (ss) for (const m of ss.matchAll(/<si>([\s\S]*?)<\/si>/g)) shared.push(decodeXml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join('')));
  const sheet = byName.get('xl/worksheets/sheet1.xml') || [...byName.entries()].find(([n]) => /xl\/worksheets\/sheet\d+\.xml/.test(n))?.[1];
  if (!sheet) throw new Error('Not a valid .xlsx file.');
  const rows: string[][] = [];
  for (const rowM of sheet.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells: string[] = [];
    for (const cM of rowM[1].matchAll(/<c[^>]*?(?:\s+t="([^"]+)")?[^>]*>(?:<v>([\s\S]*?)<\/v>|<is>([\s\S]*?)<\/is>)?<\/c>/g)) {
      const type = cM[1], v = cM[2], is = cM[3];
      if (is != null) cells.push(decodeXml(stripTags(is)));
      else if (type === 's' && v != null) cells.push(shared[+v] ?? '');
      else cells.push(v != null ? decodeXml(v) : '');
    }
    rows.push(cells);
  }
  return rows;
}
function decodeXml(s: string) { return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&'); }
async function unzipTextEntry(buf: ArrayBuffer, name: string): Promise<string | null> {
  const e = (await unzip(buf)).find((x) => x.name === name);
  return e ? new TextDecoder().decode(e.data) : null;
}

export function csvMatrix(text: string): string[][] {
  return parseCsv(text, detectDelimiter(text));
}
export function csvToTsv(text: string): string {
  return csvMatrix(text).map((r) => r.join('\t')).join('\n');
}
export function csvToHtmlTable(text: string, full = true): string {
  const rows = csvMatrix(text);
  const head = rows.length ? `<thead><tr>${rows[0].map((c) => `<th>${htmlEscape(c)}</th>`).join('')}</tr></thead>` : '';
  const body = `<tbody>${rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${htmlEscape(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  const table = `<table border="1" cellspacing="0" cellpadding="4">${head}${body}</table>`;
  if (!full) return table;
  return `<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><title>Table</title></head>\n<body>\n${table}\n</body></html>`;
}
export function csvToMarkdownTable(text: string): string {
  const rows = csvMatrix(text);
  if (!rows.length) return '';
  const esc = (c: string) => c.replace(/\|/g, '\\|');
  const header = `| ${rows[0].map(esc).join(' | ')} |`;
  const sep = `| ${rows[0].map(() => '---').join(' | ')} |`;
  const body = rows.slice(1).map((r) => `| ${r.map(esc).join(' | ')} |`).join('\n');
  return [header, sep, body].filter(Boolean).join('\n');
}
export function csvToSql(text: string, table = 'data'): string {
  const rows = csvMatrix(text);
  if (!rows.length) return '';
  const cols = rows[0].map((c) => c.replace(/[^\w]/g, '_') || 'col');
  const create = `CREATE TABLE ${table} (${cols.map((c) => `${c} TEXT`).join(', ')});`;
  const inserts = rows.slice(1).map((r) => `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${r.map((v) => `'${v.replace(/'/g, "''")}'`).join(', ')});`);
  return [create, ...inserts].join('\n');
}
export function csvToVcard(text: string): string {
  const rows = csvMatrix(text);
  if (rows.length < 2) return '';
  const header = rows[0].map((h) => h.toLowerCase().trim());
  const idx = (names: string[]) => header.findIndex((h) => names.some((n) => h.includes(n)));
  const nameI = idx(['name', 'full']), emailI = idx(['email', 'mail']), phoneI = idx(['phone', 'tel', 'mobile']), orgI = idx(['org', 'company']);
  return rows.slice(1).map((r) => {
    const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
    if (nameI >= 0 && r[nameI]) { lines.push(`FN:${r[nameI]}`); lines.push(`N:${r[nameI]};;;;`); }
    if (emailI >= 0 && r[emailI]) lines.push(`EMAIL:${r[emailI]}`);
    if (phoneI >= 0 && r[phoneI]) lines.push(`TEL:${r[phoneI]}`);
    if (orgI >= 0 && r[orgI]) lines.push(`ORG:${r[orgI]}`);
    lines.push('END:VCARD');
    return lines.join('\n');
  }).join('\n');
}

export { makeDocx, makeXlsx };
export function paragraphsToPdf(paragraphs: string[]): Promise<Uint8Array> { return buildTextPdf(paragraphs); }

export async function buildTextPdf(paragraphs: string[], opts: { title?: string } = {}): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const size = 11, margin = 56, lineH = 15.5;
  const pageW = 595.28, pageH = 841.89;
  const usableW = pageW - margin * 2;
  let page = pdf.addPage([pageW, pageH]);
  let y = pageH - margin;
  const enc2 = (s: string) => s.replace(/[^\x00-\xff]/g, '?');
  const wrap = (text: string): string[] => {
    const words = text.split(/\s+/);
    const lines: string[] = []; let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (font.widthOfTextAtSize(enc2(test), size) > usableW && line) { lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  };
  for (const para of paragraphs) {
    for (const line of wrap(para)) {
      if (y < margin) { page = pdf.addPage([pageW, pageH]); y = pageH - margin; }
      page.drawText(enc2(line), { x: margin, y, size, font, color: rgb(0.1, 0.1, 0.1) });
      y -= lineH;
    }
    y -= lineH * 0.5;
  }
  return await pdf.save();
}

export async function textToImage(text: string, mime = 'image/png', quality?: number): Promise<Blob> {
  const pad = 40, fontSize = 18, lineH = 26, maxW = 800;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${fontSize}px ui-monospace, monospace`;
  const rawLines = text.split('\n');
  const lines: string[] = [];
  for (const raw of rawLines) {
    if (ctx.measureText(raw).width <= maxW) { lines.push(raw); continue; }
    let line = '';
    for (const word of raw.split(' ')) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
      else line = test;
    }
    lines.push(line);
  }
  canvas.width = maxW + pad * 2;
  canvas.height = Math.max(lineH, lines.length * lineH) + pad * 2;
  ctx.fillStyle = mime === 'image/jpeg' ? '#ffffff' : 'rgba(255,255,255,1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111111';
  ctx.font = `${fontSize}px ui-monospace, monospace`;
  ctx.textBaseline = 'top';
  lines.forEach((l, i) => ctx.fillText(l, pad, pad + i * lineH));
  return new Promise((res, rej) => canvas.toBlob((b) => b ? res(b) : rej(new Error('encode failed')), mime, quality));
}

if (import.meta.env.DEV && typeof document !== 'undefined') {
  console.assert(txtToJson('a\nb') === '[\n  "a",\n  "b"\n]', 'txtToJson');
  console.assert(csvToTsv('a,b\n1,2') === 'a\tb\n1\t2', 'csvToTsv');
  console.assert(csvToMarkdownTable('a,b\n1,2').startsWith('| a | b |'), 'csvToMarkdownTable');
  console.assert(ipynbToPython('{"cells":[{"cell_type":"code","source":["print(1)"]}]}') === 'print(1)', 'ipynbToPython');
}
