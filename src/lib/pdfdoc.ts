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
  taxRate: number;          // percent
  notes?: string;
}

export function subtotal(items: LineItem[]): number {
  return items.reduce((s, i) => s + i.qty * i.price, 0);
}

export function money(n: number, currency: string): string {
  return `${currency}${n.toFixed(2)}`;
}

/** Build the PDF bytes for a line-item business document. */
export async function buildDocPdf(d: DocData): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 portrait
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { width } = page.getSize();
  const accent = rgb(0.37, 0.42, 0.82);
  const ink = rgb(0.09, 0.09, 0.1);
  const muted = rgb(0.4, 0.42, 0.46);
  const M = 50;
  let y = 792;

  const text = (s: string, x: number, yy: number, size = 10, f = font, color = ink) =>
    page.drawText(s, { x, y: yy, size, font: f, color });

  // Header.
  text(d.docType, M, y, 26, bold, accent);
  text(`#${d.number}`, width - M - bold.widthOfTextAtSize(`#${d.number}`, 12), y + 6, 12, bold, muted);
  text(`Date: ${d.date}`, width - M - font.widthOfTextAtSize(`Date: ${d.date}`, 10), y - 12, 10, font, muted);
  y -= 50;

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
  const sub = subtotal(d.items);
  const tax = sub * (d.taxRate / 100);
  const total = sub + tax;
  const totalRow = (label: string, val: string, f = font, color = ink) => {
    text(label, width - M - 200, y, 10, f, color);
    text(val, width - M - font.widthOfTextAtSize(val, 10), y, 10, f, color);
    y -= 18;
  };
  totalRow('Subtotal', money(sub, d.currency));
  if (d.taxRate) totalRow(`Tax (${d.taxRate}%)`, money(tax, d.currency));
  totalRow('Total', money(total, d.currency), bold, accent);

  // Notes.
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
