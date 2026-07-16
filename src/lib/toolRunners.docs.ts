// Inline runners for the PDF-document generators (invoice, receipt, purchase
// order, certificate, plain text→PDF). Same contract as toolRunners.ts: each
// pulls the document content out of the chat message with `extract` (as JSON),
// then reuses the tool's REAL builder to produce the PDF.
//
// The line-item docs (invoice / PO / receipt) all route through pdfdoc.ts's
// buildDocPdf / buildReceiptPdf — the same functions the tool pages call — so
// layout, totals math and currency handling stay identical.

import type { Runner, RunCtx, RunResult } from './toolRunners';
import { canvasBlob } from './toolRunners';
import {
  buildDocPdf, buildReceiptPdf,
  type DocData, type ReceiptData, type LineItem,
} from './pdfdoc';
import { pdfPrefixOf } from './currencies';

const today = () => new Date().toISOString().slice(0, 10);

const pdfFile = (name: string, bytes: Uint8Array): RunResult['files'] =>
  [{ name, blob: new Blob([bytes.slice() as BlobPart], { type: 'application/pdf' }), kind: 'file' }];

// Ask `extract` for JSON, tolerate ```-fences / stray prose, shallow-merge over
// the defaults so any missing field falls back rather than throwing.
async function askJson<T extends object>(extract: RunCtx['extract'], instruction: string, fallback: T): Promise<T> {
  try {
    const raw = await extract(instruction + ' Return ONLY a JSON object, no prose, no code fences.');
    const json = raw.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    return { ...fallback, ...JSON.parse(json) };
  } catch {
    return fallback;
  }
}

// Coerce the model's loose item list into clean LineItems; drop blank rows.
function normItems(raw: any): LineItem[] {
  const arr = Array.isArray(raw) ? raw : [];
  const items = arr.map((it: any): LineItem => ({
    description: String(it?.description ?? it?.desc ?? '').slice(0, 80),
    qty: Number(it?.qty ?? it?.quantity ?? 1) || 0,
    price: Number(it?.price ?? it?.unitPrice ?? it?.amount ?? 0) || 0,
  })).filter((it) => it.description || it.qty || it.price);
  return items.length ? items : [{ description: 'Item', qty: 1, price: 0 }];
}

const toLines = (v: any): string[] =>
  (Array.isArray(v) ? v : typeof v === 'string' && v ? v.split(/\n|,\s*/) : [])
    .map((s) => String(s).trim()).filter(Boolean);

// Shared extract → DocData for invoice + purchase order (both buildDocPdf docs).
type DocShape = {
  number: string; date: string; dueDate: string; terms: string;
  currencyCode: string; from: any; to: any; items: any;
  taxPercent: number; discountPercent: number; shipping: number; notes: string;
};
async function extractDoc(ctx: RunCtx, defaults: Partial<DocShape>, fromLabel: string, toLabel: string) {
  const d = await askJson<DocShape>(ctx.extract,
    `Extract the document details from the user's request. JSON shape: {number, date (YYYY-MM-DD), dueDate, terms, currencyCode (ISO like USD/EUR/GBP), from:[lines for ${fromLabel}], to:[lines for ${toLabel}], items:[{description,qty,price}], taxPercent, discountPercent, shipping, notes}. Use empty strings / 0 / [] for anything the user didn't give.`,
    { number: '', date: '', dueDate: '', terms: '', currencyCode: 'USD', from: [], to: [], items: [], taxPercent: 0, discountPercent: 0, shipping: 0, notes: '', ...defaults } as DocShape,
  );
  const base: DocData = {
    docType: '', number: d.number || (defaults.number ?? ''), date: d.date || today(),
    dueDate: d.dueDate || undefined, terms: d.terms || undefined,
    fromLabel, from: toLines(d.from), toLabel, to: toLines(d.to),
    items: normItems(d.items),
    currency: pdfPrefixOf(String(d.currencyCode || 'USD').toUpperCase()),
    taxMode: 'percent', taxRate: Number(d.taxPercent) || 0,
    shipping: Number(d.shipping) || 0,
    notes: d.notes || undefined,
  };
  const disc = Number(d.discountPercent) || 0;
  if (disc) base.discount = { mode: 'percent', value: disc };
  return base;
}

export const RUNNERS_DOCS: Record<string, Runner> = {
  // --- Invoice: line items + tax/discount/shipping → A4 PDF (buildDocPdf). ----
  'invoice-generator': {
    needs: 'text',
    async run(ctx) {
      const d = await extractDoc(ctx, { number: 'INV-001', terms: 'Net 30' }, 'From', 'Bill To');
      d.docType = 'INVOICE';
      const bytes = await buildDocPdf(d);
      return { files: pdfFile(`${d.number || 'invoice'}.pdf`, bytes), note: `Invoice ${d.number} · ${d.items.length} item${d.items.length === 1 ? '' : 's'}` };
    },
  },

  // --- Purchase order: buyer/vendor + ordered items → A4 PDF (buildDocPdf). ---
  'purchase-order-generator': {
    needs: 'text',
    async run(ctx) {
      const d = await extractDoc(ctx, { number: 'PO-2001' }, 'Buyer', 'Vendor');
      d.docType = 'PURCHASE ORDER';
      const bytes = await buildDocPdf(d);
      return { files: pdfFile(`${d.number || 'purchase-order'}.pdf`, bytes), note: `Purchase order ${d.number} · ${d.items.length} item${d.items.length === 1 ? '' : 's'}` };
    },
  },

  // --- Receipt: itemized sale + payment/change → thermal or A4 (buildReceiptPdf).
  'receipt-generator': {
    needs: 'text',
    async run({ extract }) {
      const d = await askJson(extract,
        'Extract the receipt details from the user\'s request. JSON: {style ("thermal" or "standard"), number, date (YYYY-MM-DD), cashier, currencyCode (ISO), store:[store name + address lines], customer:[optional lines], items:[{description,qty,price}], taxPercent, tipPercent, discountPercent, shipping, paymentMethod, amountPaid (number), notes}. Empty strings / 0 / [] for anything missing.',
        { style: 'thermal', number: '', date: '', cashier: '', currencyCode: 'USD', store: [] as any, customer: [] as any, items: [] as any, taxPercent: 8.5, tipPercent: 0, discountPercent: 0, shipping: 0, paymentMethod: '', amountPaid: 0, notes: 'Thank you for your purchase!' },
      );
      const paid = Number(d.amountPaid) || 0;
      const data: ReceiptData = {
        docType: 'RECEIPT',
        style: d.style === 'standard' ? 'standard' : 'thermal',
        number: d.number || 'R-1001', date: d.date || today(),
        cashier: d.cashier || undefined,
        fromLabel: 'Store', from: toLines(d.store),
        toLabel: 'Customer', to: toLines(d.customer),
        items: normItems(d.items),
        currency: pdfPrefixOf(String(d.currencyCode || 'USD').toUpperCase()),
        taxMode: 'percent', taxRate: Number(d.taxPercent) || 0,
        shipping: Number(d.shipping) || 0,
        paymentMethod: d.paymentMethod || undefined,
        amountPaid: paid > 0 ? paid : undefined,
        notes: d.notes || undefined,
      };
      const disc = Number(d.discountPercent) || 0;
      if (disc) data.discount = { mode: 'percent', value: disc };
      const tip = Number(d.tipPercent) || 0;
      if (tip) data.tip = { mode: 'percent', value: tip };
      const bytes = await buildReceiptPdf(data);
      return { files: pdfFile(`${data.number}.pdf`, bytes), note: `${data.style === 'standard' ? 'Standard' : 'Thermal'} receipt ${data.number}` };
    },
  },

  // --- Text → PDF: wrap + paginate the message's text (ports pdf-generator). --
  'pdf-generator': {
    needs: 'text',
    async run({ query, extract }) {
      // Prefer the model's cleaned document text; fall back to the raw message.
      const body = (await extract('Return the exact text the user wants turned into a PDF, verbatim, with no commentary. If they only described it, write that text.')).trim() || query.trim();
      if (!body) throw new Error('Tell me what text to put in the PDF.');
      const title = (await extract('Return ONLY a short document title if the user named one, else an empty string.')).trim().slice(0, 80);

      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const [pw, ph] = [595, 842]; // A4 portrait
      const fontSize = 12, margin = 56, lineHeight = fontSize * 1.4, maxWidth = pw - margin * 2;
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      let page = pdf.addPage([pw, ph]);
      let y = ph - margin;
      const drawLine = (s: string) => {
        if (y < margin) { page = pdf.addPage([pw, ph]); y = ph - margin; }
        page.drawText(s, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
        y -= lineHeight;
      };
      if (title) { page.drawText(title, { x: margin, y, size: fontSize * 1.6, font, color: rgb(0.1, 0.1, 0.1) }); y -= lineHeight * 2; }
      for (const raw of body.split('\n')) {
        if (raw === '') { y -= lineHeight; continue; }
        let line = '';
        for (const w of raw.split(/\s+/)) {
          const test = line ? line + ' ' + w : w;
          if (font.widthOfTextAtSize(test, fontSize) > maxWidth && line) { drawLine(line); line = w; }
          else line = test;
        }
        if (line) drawLine(line);
      }
      const bytes = await pdf.save();
      return { files: pdfFile(`${title || 'document'}.pdf`, bytes), note: `Text → PDF · ${pdf.getPageCount()} page${pdf.getPageCount() === 1 ? '' : 's'}` };
    },
  },

  // --- Certificate: draw on a canvas, embed as a PDF page. --------------------
  // ponytail: single "classic" template + double border only. The full tool has
  // 10 themed templates, 6 border styles and image upload; the runner ports the
  // core text layout (positions/fonts) faithfully and drops the theme picker.
  'certificate-generator': {
    needs: 'text',
    async run({ extract }) {
      const d = await askJson(extract,
        'Extract certificate details from the user\'s request. JSON: {title, name (recipient), description (one line, e.g. "has successfully completed ..."), date, signature (signer name), accent (hex color like #b8860b)}. Empty strings for anything missing.',
        { title: 'Certificate of Achievement', name: 'Recipient', description: '', date: '', signature: '', accent: '#b8860b' },
      );
      const accent = /^#[0-9a-f]{6}$/i.test(d.accent) ? d.accent : '#b8860b';
      const family = 'Georgia, "Times New Roman", serif';

      const W = 1000, H = 720;
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#fffdf8'; ctx.fillRect(0, 0, W, H);
      // Double border (classic).
      ctx.strokeStyle = accent;
      ctx.lineWidth = 6; ctx.strokeRect(24, 24, W - 48, H - 48);
      ctx.lineWidth = 2; ctx.strokeRect(40, 40, W - 80, H - 80);

      ctx.textAlign = 'center';
      ctx.fillStyle = accent; ctx.font = `700 46px ${family}`;
      ctx.fillText(d.title || 'Certificate of Achievement', W / 2, 175);
      ctx.fillStyle = '#666666'; ctx.font = `italic 20px ${family}`;
      ctx.fillText('This certificate is proudly presented to', W / 2, 250);
      ctx.fillStyle = '#111111'; ctx.font = `700 56px ${family}`;
      ctx.fillText(d.name || 'Recipient', W / 2, 340);
      ctx.strokeStyle = '#cccccc'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W / 2 - 250, 360); ctx.lineTo(W / 2 + 250, 360); ctx.stroke();
      // Description, wrapped to width.
      ctx.fillStyle = '#444444'; ctx.font = `22px ${family}`;
      const words = (d.description || '').split(/\s+/).filter(Boolean);
      const lines: string[] = []; let ln = '';
      for (const w of words) {
        const test = ln ? ln + ' ' + w : w;
        if (ctx.measureText(test).width > W - 320 && ln) { lines.push(ln); ln = w; } else ln = test;
      }
      if (ln) lines.push(ln);
      lines.forEach((l, i) => ctx.fillText(l, W / 2, 420 + i * 30));
      // Date + signature.
      ctx.strokeStyle = '#888888'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(180, 620); ctx.lineTo(400, 620); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(600, 620); ctx.lineTo(820, 620); ctx.stroke();
      ctx.fillStyle = '#111111'; ctx.font = `18px ${family}`;
      ctx.fillText(d.date || today(), 290, 650);
      ctx.fillText(d.signature || '', 710, 650);
      ctx.fillStyle = '#888888'; ctx.font = `13px ${family}`;
      ctx.fillText('DATE', 290, 672); ctx.fillText('SIGNATURE', 710, 672);

      const { PDFDocument } = await import('pdf-lib');
      const pdf = await PDFDocument.create();
      const png = await pdf.embedPng(await (await canvasBlob(canvas)).arrayBuffer());
      pdf.addPage([W, H]).drawImage(png, { x: 0, y: 0, width: W, height: H });
      const bytes = await pdf.save();
      return { files: pdfFile('certificate.pdf', bytes), note: `Certificate for ${d.name || 'recipient'}` };
    },
  },
};
