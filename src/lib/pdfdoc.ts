// Shared PDF builders for the document generators (invoice, receipt, PO).
// pdf-lib is imported dynamically so it only loads on pages that export a PDF.
// Everything runs client-side; no document ever leaves the browser.

export interface LineItem { description: string; qty: number; price: number; }

export interface DocData {
  docType: string;          // "INVOICE", "RECEIPT", "PURCHASE ORDER"
  number: string;
  date: string;
  fromLabel: string;        // "From" / "Store" / "Buyer"
  from: string[];           // multi-line block
  toLabel: string;          // "Bill To" / "Customer" / "Vendor"
  to: string[];
  items: LineItem[];
  currency: string;
  taxRate: number;          // percent, or flat amount when taxMode === 'flat'
  notes?: string;
  // Optional extras — all default to today's behavior so the receipt and PO
  // tools that share this builder are unaffected.
  taxMode?: 'percent' | 'flat';
  discount?: { mode: 'percent' | 'flat'; value: number };
  shipping?: number;                                   // flat amount
  tip?: { mode: 'percent' | 'flat'; value: number };  // gratuity, added after tax
  dueDate?: string;
  terms?: string;                                      // payment terms line
  logo?: { bytes: Uint8Array; type: 'png' | 'jpg' };
  accent?: string;                                     // #rrggbb brand color for the title + total line
}

export interface Totals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  tip: number;
  total: number;
}

// Receipt-specific data. Reuses the DocData math (computeTotals) but carries the
// payment fields a receipt has and an invoice doesn't, plus the paper style.
export interface ReceiptData extends DocData {
  style?: 'thermal' | 'standard';
  paymentMethod?: string;   // "Cash", "Visa •••• 4242", …
  amountPaid?: number;      // amount tendered; change = amountPaid - total
  cashier?: string;
}

export function subtotal(items: LineItem[]): number {
  return items.reduce((s, i) => s + i.qty * i.price, 0);
}

/**
 * Single source of truth for invoice/receipt math — the page's live preview/total
 * and the PDF both call this so the numbers can never diverge. Discount applies to
 * the subtotal; tax applies to the discounted amount; shipping then tip are added
 * last. Tip percent is computed off the discounted, pre-tax subtotal (standard
 * restaurant convention).
 */
export function computeTotals(d: DocData): Totals {
  const sub = subtotal(d.items);
  let discount = 0;
  if (d.discount && d.discount.value) {
    discount = d.discount.mode === 'flat'
      ? d.discount.value
      : sub * (d.discount.value / 100);
  }
  const taxable = Math.max(0, sub - discount);
  const tax = (d.taxMode === 'flat')
    ? (d.taxRate || 0)
    : taxable * ((d.taxRate || 0) / 100);
  const shipping = d.shipping || 0;
  let tip = 0;
  if (d.tip && d.tip.value) {
    tip = d.tip.mode === 'flat' ? d.tip.value : taxable * (d.tip.value / 100);
  }
  return { subtotal: sub, discount, tax, shipping, tip, total: taxable + tax + shipping + tip };
}

export function money(n: number, currency: string): string {
  return `${currency}${n.toFixed(2)}`;
}

// Parse "#5e6ad2" → normalized [r,g,b] in 0..1 for rgb(). Falls back to the
// Linear lavender accent on any malformed input so a builder never throws.
function hexRgb(hex: string | undefined): [number, number, number] {
  const fallback: [number, number, number] = [0.37, 0.42, 0.82];
  if (!hex) return fallback;
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return fallback;
  const int = parseInt(m[1], 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

/** Build the PDF bytes for a line-item business document. */
export async function buildDocPdf(d: DocData): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 portrait
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();
  const accent = rgb(...hexRgb(d.accent));
  const ink = rgb(0.09, 0.09, 0.1);
  const muted = rgb(0.4, 0.42, 0.46);
  const M = 50;
  let y = 792;

  // The standard fonts use WinAnsi encoding, which can't represent glyphs like
  // the rupee sign (₹) or the other non-CP1252 currency symbols. The currency
  // module already hands us a WinAnsi-safe prefix (ISO code when the symbol
  // isn't representable), so drawText won't hit those — but callers can still
  // pass arbitrary text (business names, notes), so guard every draw: replace
  // anything the font can't encode rather than throwing mid-render.
  const enc = (s: string): string => {
    try {
      font.encodeText(s);
      return s;
    } catch {
      let out = '';
      for (const ch of s) {
        try { font.encodeText(ch); out += ch; }
        catch { out += '?'; }
      }
      return out;
    }
  };

  const text = (s: string, x: number, yy: number, size = 10, f = font, color = ink) =>
    page.drawText(enc(s), { x, y: yy, size, font: f, color });

  // Measure the encoded string so width math matches what gets drawn and never
  // throws on an unencodable glyph.
  const widthOf = (s: string, size: number, f = font) => f.widthOfTextAtSize(enc(s), size);

  // Header. Optional logo sits top-left; the doc title drops beneath it.
  let titleY = y;
  if (d.logo) {
    try {
      const img = d.logo.type === 'png'
        ? await pdf.embedPng(d.logo.bytes)
        : await pdf.embedJpg(d.logo.bytes);
      const scale = Math.min(120 / img.width, 48 / img.height, 1);
      const w = img.width * scale, h = img.height * scale;
      page.drawImage(img, { x: M, y: y - h + 14, width: w, height: h });
      titleY = y - h - 4;
    } catch { /* bad image data — skip the logo rather than fail the PDF */ }
  }
  text(d.docType, M, titleY, 26, bold, accent);

  // Right-aligned meta stack: number, date, optional due date + terms.
  let metaY = y + 6;
  const metaRight = (label: string, size = 10, f = font) => {
    text(label, width - M - widthOf(label, size, f), metaY, size, f, muted);
    metaY -= size + 4;
  };
  metaRight(`#${d.number}`, 12, bold);
  metaRight(`Date: ${d.date}`);
  if (d.dueDate) metaRight(`Due: ${d.dueDate}`);
  if (d.terms) metaRight(`Terms: ${d.terms}`);
  y = Math.min(titleY, metaY) - 24;

  // From / To blocks.
  text(d.fromLabel.toUpperCase(), M, y, 9, bold, muted);
  text(d.toLabel.toUpperCase(), width / 2, y, 9, bold, muted);
  y -= 16;
  const rows = Math.max(d.from.length, d.to.length);
  for (let i = 0; i < rows; i++) {
    if (d.from[i]) text(d.from[i], M, y, 10);
    if (d.to[i]) text(d.to[i], width / 2, y, 10);
    y -= 14;
  }
  y -= 20;

  // Table header.
  page.drawRectangle({ x: M, y: y - 4, width: width - M * 2, height: 22, color: rgb(0.95, 0.95, 0.96) });
  text('DESCRIPTION', M + 8, y + 3, 9, bold, muted);
  text('QTY', width - M - 200, y + 3, 9, bold, muted);
  text('PRICE', width - M - 130, y + 3, 9, bold, muted);
  text('AMOUNT', width - M - 60, y + 3, 9, bold, muted);
  y -= 26;

  // Rows.
  for (const it of d.items) {
    const amt = it.qty * it.price;
    text(it.description.slice(0, 50), M + 8, y, 10);
    text(String(it.qty), width - M - 200, y, 10);
    text(money(it.price, d.currency), width - M - 130, y, 10);
    text(money(amt, d.currency), width - M - 60, y, 10);
    y -= 18;
    if (y < 120) break;
  }

  // Totals.
  y -= 8;
  page.drawLine({ start: { x: width - M - 220, y }, end: { x: width - M, y }, thickness: 0.5, color: muted });
  y -= 18;
  const t = computeTotals(d);
  const totalRow = (label: string, val: string, f = font, color = ink) => {
    text(label, width - M - 200, y, 10, f, color);
    text(val, width - M - widthOf(val, 10, f), y, 10, f, color);
    y -= 18;
  };
  totalRow('Subtotal', money(t.subtotal, d.currency));
  if (t.discount) {
    const label = d.discount!.mode === 'percent' ? `Discount (${d.discount!.value}%)` : 'Discount';
    totalRow(label, `-${money(t.discount, d.currency)}`);
  }
  if (t.tax) {
    const label = d.taxMode === 'flat' ? 'Tax' : `Tax (${d.taxRate}%)`;
    totalRow(label, money(t.tax, d.currency));
  }
  if (t.shipping) totalRow('Shipping', money(t.shipping, d.currency));
  totalRow('Total', money(t.total, d.currency), bold, accent);

  // Notes.
  if (d.notes) {
    y -= 20;
    text('NOTES', M, y, 9, bold, muted); y -= 14;
    for (const line of wrap(d.notes, 90)) { text(line, M, y, 10, font, muted); y -= 13; }
  }

  return pdf.save();
}

/**
 * Build a receipt PDF. Two paper styles:
 *  - 'thermal'  → narrow 80mm point-of-sale roll, monospace, dashed rules. The
 *                 look people picture when they hear "receipt". Height grows to
 *                 fit the content so a long order never clips.
 *  - 'standard' → an A4 business receipt: logo, table, totals, and a payment
 *                 block (method / paid / change) that an invoice doesn't carry.
 */
export async function buildReceiptPdf(d: ReceiptData): Promise<Uint8Array> {
  return (d.style === 'standard')
    ? buildStandardReceipt(d)
    : buildThermalReceipt(d);
}

// --- Thermal (80mm POS roll) -------------------------------------------------

async function buildThermalReceipt(d: ReceiptData): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const monoBold = await pdf.embedFont(StandardFonts.CourierBold);

  const W = 226;            // 80mm at 72dpi
  const M = 14;             // side margin
  const CW = W - M * 2;     // content width
  const ink = rgb(0.08, 0.08, 0.09);
  const t = computeTotals(d);

  // The currency prefix reaches us already WinAnsi-safe (ISO code when the
  // symbol isn't in CP1252). Free-text fields still might carry glyphs Courier
  // can't encode, so drop anything unencodable rather than fail the roll.
  const enc = (s: string): string => {
    try { mono.encodeText(s); return s; } catch {
      let out = ''; for (const ch of s) { try { mono.encodeText(ch); out += ch; } catch { out += '?'; } } return out;
    }
  };

  // Courier is monospaced: width per char = size * 0.6. Fit N chars per line.
  const SIZE = 8, LH = 11;
  const charW = SIZE * 0.6;
  const cols = Math.floor(CW / charW);

  // Pass 1: build a flat op list so we can measure exact height, then draw.
  type Op =
    | { t: 'center'; s: string; bold?: boolean; size?: number }
    | { t: 'left'; s: string; bold?: boolean }
    | { t: 'pair'; l: string; r: string; bold?: boolean }
    | { t: 'rule' }
    | { t: 'gap'; h?: number }
    | { t: 'logo' };
  const ops: Op[] = [];

  // A "label ............ value" line padded to the column width.
  const pair = (l: string, r: string, bold = false): Op => ({ t: 'pair', l, r, bold });

  if (d.logo) ops.push({ t: 'logo' });
  for (const line of d.from.filter(Boolean)) {
    ops.push({ t: 'center', s: line, bold: line === d.from.filter(Boolean)[0], size: line === d.from.filter(Boolean)[0] ? 11 : SIZE });
  }
  ops.push({ t: 'gap' });
  ops.push({ t: 'rule' });
  ops.push({ t: 'left', s: `Receipt #${d.number}` });
  ops.push({ t: 'left', s: `Date: ${d.date}` });
  if (d.cashier) ops.push({ t: 'left', s: `Cashier: ${d.cashier}` });
  const cust = d.to.filter(Boolean);
  if (cust.length) { ops.push({ t: 'left', s: `Customer: ${cust[0]}` }); for (const c of cust.slice(1)) ops.push({ t: 'left', s: `          ${c}` }); }
  ops.push({ t: 'rule' });

  // Items: description on its own line, then "  qty x price       amount".
  for (const it of d.items) {
    if (!it.description && !it.qty && !it.price) continue;
    ops.push({ t: 'left', s: it.description || 'Item' });
    ops.push(pair(`  ${it.qty} x ${money(it.price, d.currency)}`, money(it.qty * it.price, d.currency)));
  }
  ops.push({ t: 'rule' });

  ops.push(pair('Subtotal', money(t.subtotal, d.currency)));
  if (t.discount) ops.push(pair(d.discount!.mode === 'percent' ? `Discount ${d.discount!.value}%` : 'Discount', `-${money(t.discount, d.currency)}`));
  if (t.tax) ops.push(pair(d.taxMode === 'flat' ? 'Tax' : `Tax ${d.taxRate}%`, money(t.tax, d.currency)));
  if (t.shipping) ops.push(pair('Shipping', money(t.shipping, d.currency)));
  if (t.tip) ops.push(pair(d.tip!.mode === 'percent' ? `Tip ${d.tip!.value}%` : 'Tip', money(t.tip, d.currency)));
  ops.push({ t: 'rule' });
  ops.push(pair('TOTAL', money(t.total, d.currency), true));

  if (d.paymentMethod || d.amountPaid) {
    ops.push({ t: 'gap' });
    if (d.paymentMethod) ops.push(pair('Paid via', d.paymentMethod));
    if (d.amountPaid) {
      ops.push(pair('Tendered', money(d.amountPaid, d.currency)));
      ops.push(pair('Change', money(Math.max(0, d.amountPaid - t.total), d.currency)));
    }
  }

  const itemCount = d.items.reduce((n, it) => n + (it.qty || 0), 0);
  ops.push({ t: 'gap' });
  ops.push({ t: 'rule' });
  ops.push({ t: 'center', s: `Items sold: ${itemCount}` });
  if (d.notes) { ops.push({ t: 'gap' }); for (const line of wrap(d.notes, cols)) ops.push({ t: 'center', s: line }); }
  ops.push({ t: 'gap', h: 6 });
  ops.push({ t: 'center', s: '* * *', size: SIZE });

  // Measure logo (scaled to fit content width) so height math includes it.
  let logoImg: any = null, logoH = 0, logoW = 0;
  if (d.logo) {
    try {
      logoImg = d.logo.type === 'png' ? await pdf.embedPng(d.logo.bytes) : await pdf.embedJpg(d.logo.bytes);
      const scale = Math.min(CW / logoImg.width, 46 / logoImg.height, 1);
      logoW = logoImg.width * scale; logoH = logoImg.height * scale;
    } catch { logoImg = null; }
  }

  // Compute total height from the op list.
  const opH = (op: Op) => op.t === 'gap' ? (op.h ?? 6) : op.t === 'rule' ? 8 : op.t === 'logo' ? (logoImg ? logoH + 6 : 0) : LH;
  const TOP = 16, BOT = 16;
  const H = Math.round(TOP + BOT + ops.reduce((s, op) => s + opH(op), 0));

  const page = pdf.addPage([W, H]);
  let y = H - TOP;

  const drawCenter = (s: string, size: number, f = mono) => {
    const w = f.widthOfTextAtSize(enc(s), size);
    page.drawText(enc(s), { x: (W - w) / 2, y: y - size, size, font: f, color: ink });
    y -= LH;
  };
  const drawLeft = (s: string, f = mono) => { page.drawText(enc(s).slice(0, cols), { x: M, y: y - SIZE, size: SIZE, font: f, color: ink }); y -= LH; };
  const drawPair = (l: string, r: string, f = mono, fb = mono) => {
    const rw = enc(r);
    const maxL = Math.max(0, cols - rw.length - 1);
    page.drawText(enc(l).slice(0, maxL), { x: M, y: y - SIZE, size: SIZE, font: f, color: ink });
    page.drawText(rw, { x: W - M - fb.widthOfTextAtSize(rw, SIZE), y: y - SIZE, size: SIZE, font: fb, color: ink });
    y -= LH;
  };
  const drawRule = () => {
    const dash = enc('-'.repeat(cols));
    page.drawText(dash, { x: M, y: y - SIZE, size: SIZE, font: mono, color: rgb(0.6, 0.6, 0.62) });
    y -= 8;
  };

  for (const op of ops) {
    if (op.t === 'logo') { if (logoImg) { page.drawImage(logoImg, { x: (W - logoW) / 2, y: y - logoH, width: logoW, height: logoH }); y -= logoH + 6; } }
    else if (op.t === 'center') drawCenter(op.s, op.size ?? SIZE, op.bold ? monoBold : mono);
    else if (op.t === 'left') drawLeft(op.s, op.bold ? monoBold : mono);
    else if (op.t === 'pair') drawPair(op.l, op.r, op.bold ? monoBold : mono, op.bold ? monoBold : mono);
    else if (op.t === 'rule') drawRule();
    else if (op.t === 'gap') y -= op.h ?? 6;
  }

  return pdf.save();
}

// --- Standard (A4 business receipt) -----------------------------------------

async function buildStandardReceipt(d: ReceiptData): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();
  const accent = rgb(...hexRgb(d.accent));
  const ink = rgb(0.09, 0.09, 0.1);
  const muted = rgb(0.4, 0.42, 0.46);
  const M = 50;
  let y = 792;

  const enc = (s: string): string => {
    try { font.encodeText(s); return s; } catch {
      let out = ''; for (const ch of s) { try { font.encodeText(ch); out += ch; } catch { out += '?'; } } return out;
    }
  };
  const text = (s: string, x: number, yy: number, size = 10, f = font, color = ink) => page.drawText(enc(s), { x, y: yy, size, font: f, color });
  const widthOf = (s: string, size: number, f = font) => f.widthOfTextAtSize(enc(s), size);

  // Header — logo top-left, RECEIPT title, right-aligned meta.
  let titleY = y;
  if (d.logo) {
    try {
      const img = d.logo.type === 'png' ? await pdf.embedPng(d.logo.bytes) : await pdf.embedJpg(d.logo.bytes);
      const scale = Math.min(120 / img.width, 48 / img.height, 1);
      const w = img.width * scale, h = img.height * scale;
      page.drawImage(img, { x: M, y: y - h + 14, width: w, height: h });
      titleY = y - h - 4;
    } catch { /* skip bad logo */ }
  }
  text('RECEIPT', M, titleY, 26, bold, accent);

  let metaY = y + 6;
  const metaRight = (label: string, size = 10, f = font) => { text(label, width - M - widthOf(label, size, f), metaY, size, f, muted); metaY -= size + 4; };
  metaRight(`#${d.number}`, 12, bold);
  metaRight(`Date: ${d.date}`);
  if (d.cashier) metaRight(`Cashier: ${d.cashier}`);
  y = Math.min(titleY, metaY) - 24;

  // Store / customer blocks.
  text(d.fromLabel.toUpperCase(), M, y, 9, bold, muted);
  if (d.to.filter(Boolean).length) text(d.toLabel.toUpperCase(), width / 2, y, 9, bold, muted);
  y -= 16;
  const rows = Math.max(d.from.length, d.to.length);
  for (let i = 0; i < rows; i++) {
    if (d.from[i]) text(d.from[i], M, y, 10);
    if (d.to[i]) text(d.to[i], width / 2, y, 10);
    y -= 14;
  }
  y -= 20;

  // Table header.
  page.drawRectangle({ x: M, y: y - 4, width: width - M * 2, height: 22, color: rgb(0.95, 0.95, 0.96) });
  text('DESCRIPTION', M + 8, y + 3, 9, bold, muted);
  text('QTY', width - M - 200, y + 3, 9, bold, muted);
  text('PRICE', width - M - 130, y + 3, 9, bold, muted);
  text('AMOUNT', width - M - 60, y + 3, 9, bold, muted);
  y -= 26;

  for (const it of d.items) {
    if (!it.description && !it.qty && !it.price) continue;
    text(it.description.slice(0, 50), M + 8, y, 10);
    text(String(it.qty), width - M - 200, y, 10);
    text(money(it.price, d.currency), width - M - 130, y, 10);
    text(money(it.qty * it.price, d.currency), width - M - 60, y, 10);
    y -= 18;
    if (y < 160) break;
  }

  // Totals.
  y -= 8;
  page.drawLine({ start: { x: width - M - 220, y }, end: { x: width - M, y }, thickness: 0.5, color: muted });
  y -= 18;
  const t = computeTotals(d);
  const totalRow = (label: string, val: string, f = font, color = ink) => {
    text(label, width - M - 200, y, 10, f, color);
    text(val, width - M - widthOf(val, 10, f), y, 10, f, color);
    y -= 18;
  };
  totalRow('Subtotal', money(t.subtotal, d.currency));
  if (t.discount) totalRow(d.discount!.mode === 'percent' ? `Discount (${d.discount!.value}%)` : 'Discount', `-${money(t.discount, d.currency)}`);
  if (t.tax) totalRow(d.taxMode === 'flat' ? 'Tax' : `Tax (${d.taxRate}%)`, money(t.tax, d.currency));
  if (t.shipping) totalRow('Shipping', money(t.shipping, d.currency));
  if (t.tip) totalRow(d.tip!.mode === 'percent' ? `Tip (${d.tip!.value}%)` : 'Tip', money(t.tip, d.currency));
  totalRow('Total', money(t.total, d.currency), bold, accent);

  // Payment block — the receipt-specific part.
  if (d.paymentMethod || d.amountPaid) {
    y -= 6;
    if (d.paymentMethod) totalRow('Paid via', d.paymentMethod, font, muted);
    if (d.amountPaid) {
      totalRow('Amount tendered', money(d.amountPaid, d.currency), font, muted);
      totalRow('Change', money(Math.max(0, d.amountPaid - t.total), d.currency), font, muted);
    }
  }

  if (d.notes) {
    y -= 20;
    text('NOTES', M, y, 9, bold, muted); y -= 14;
    for (const line of wrap(d.notes, 90)) { text(line, M, y, 10, font, muted); y -= 13; }
  }

  return pdf.save();
}

function wrap(s: string, max: number): string[] {
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).length > max) { lines.push(line); line = w; }
    else line = line ? line + ' ' + w : w;
  }
  if (line) lines.push(line);
  return lines;
}

/** Trigger a browser download of PDF bytes. */
export function downloadPdf(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes.slice()], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
