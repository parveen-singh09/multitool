// Financial-format converters: OFX / QIF / IIF -> normalized transactions,
// re-emitted as CSV / Excel / OFX-family (OFX, QFX, QBO all share the OFX body).
// All text parsing; runs offline.
import { makeXlsx } from './xlsx';

export interface Txn {
  date: string;    // YYYYMMDD or as-found
  amount: string;  // signed decimal string
  payee: string;
  memo: string;
  type: string;    // DEBIT / CREDIT / etc.
  checknum?: string;
}

// ---------- Parsers ----------
// OFX (SGML/XML-ish): pull <STMTTRN> blocks.
export function parseOfx(text: string): Txn[] {
  const txns: Txn[] = [];
  for (const m of text.matchAll(/<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi)) {
    const b = m[1];
    const g = (tag: string) => b.match(new RegExp(`<${tag}>\\s*([^<\\r\\n]+)`, 'i'))?.[1]?.trim() || '';
    txns.push({
      date: g('DTPOSTED').slice(0, 8), amount: g('TRNAMT'),
      payee: g('NAME') || g('PAYEE'), memo: g('MEMO'),
      type: g('TRNTYPE') || (parseFloat(g('TRNAMT')) < 0 ? 'DEBIT' : 'CREDIT'),
      checknum: g('CHECKNUM') || undefined,
    });
  }
  // Some OFX use unclosed tags with no </STMTTRN>; fallback split on <STMTTRN>
  if (!txns.length && /<STMTTRN>/i.test(text)) {
    const parts = text.split(/<STMTTRN>/i).slice(1);
    for (const b of parts) {
      const g = (tag: string) => b.match(new RegExp(`<${tag}>\\s*([^<\\r\\n]+)`, 'i'))?.[1]?.trim() || '';
      txns.push({ date: g('DTPOSTED').slice(0, 8), amount: g('TRNAMT'), payee: g('NAME'), memo: g('MEMO'), type: g('TRNTYPE'), checknum: g('CHECKNUM') || undefined });
    }
  }
  if (!txns.length) throw new Error('No transactions found in this OFX/QFX file.');
  return txns;
}

// QIF: line-based, letter-prefixed fields, entries end with '^'.
export function parseQif(text: string): Txn[] {
  const txns: Txn[] = [];
  let cur: Partial<Txn> = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('!')) continue;
    const code = line[0], val = line.slice(1);
    if (code === '^') { if (Object.keys(cur).length) txns.push(normalizeQif(cur)); cur = {}; continue; }
    if (code === 'D') cur.date = qifDate(val);
    else if (code === 'T' || code === 'U') cur.amount = val.replace(/,/g, '');
    else if (code === 'P') cur.payee = val;
    else if (code === 'M') cur.memo = val;
    else if (code === 'N') cur.checknum = val;
  }
  if (Object.keys(cur).length) txns.push(normalizeQif(cur));
  if (!txns.length) throw new Error('No transactions found in this QIF file.');
  return txns;
}
function normalizeQif(c: Partial<Txn>): Txn {
  return { date: c.date || '', amount: c.amount || '0', payee: c.payee || '', memo: c.memo || '', type: parseFloat(c.amount || '0') < 0 ? 'DEBIT' : 'CREDIT', checknum: c.checknum };
}
// QIF dates: M/D'YY, MM/DD/YYYY, D/M/YYYY — best-effort to YYYYMMDD.
function qifDate(s: string): string {
  // Quicken separators are '/', '.', '-', and an apostrophe before 20xx years (D1/15'24).
  const m = s.match(/(\d{1,2})[\/.\-](\d{1,2})[\/.\-']\s?(\d{2,4})/);
  if (!m) return s.trim();
  let [, a, b, y] = m;
  let yr = +y; if (yr < 100) yr += yr < 50 ? 2000 : 1900;
  return `${yr}${a.padStart(2, '0')}${b.padStart(2, '0')}`;
}

// IIF: tab-delimited; TRNS/SPL rows under a !TRNS header.
export function parseIif(text: string): Txn[] {
  const lines = text.split(/\r?\n/);
  let header: string[] = [];
  const txns: Txn[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = line.split('\t');
    if (cols[0] === '!TRNS') { header = cols.map((c) => c.replace(/^!/, '').toUpperCase()); continue; }
    if (cols[0] === 'TRNS') {
      const get = (name: string) => { const i = header.indexOf(name); return i >= 0 ? (cols[i] || '') : ''; };
      txns.push({ date: get('DATE'), amount: get('AMOUNT').replace(/,/g, ''), payee: get('NAME'), memo: get('MEMO'), type: get('TRNSTYPE') || (parseFloat(get('AMOUNT')) < 0 ? 'DEBIT' : 'CREDIT') });
    }
  }
  if (!txns.length) throw new Error('No TRNS rows found in this IIF file.');
  return txns;
}

// ---------- Emitters ----------
export function txnsToCsv(txns: Txn[]): string {
  const head = ['Date', 'Amount', 'Payee', 'Memo', 'Type', 'CheckNum'];
  const esc = (v: string) => `"${(v || '').replace(/"/g, '""')}"`;
  return [head.join(','), ...txns.map((t) => [t.date, t.amount, t.payee, t.memo, t.type, t.checknum || ''].map(esc).join(','))].join('\n');
}
export function txnsToXlsx(txns: Txn[]): Blob {
  const rows: (string | number)[][] = [['Date', 'Amount', 'Payee', 'Memo', 'Type', 'CheckNum']];
  for (const t of txns) rows.push([t.date, t.amount, t.payee, t.memo, t.type, t.checknum || '']);
  return makeXlsx(rows);
}
// Build an OFX 1.0.2 (SGML) document — the shared body for .ofx/.qfx/.qbo.
export function txnsToOfx(txns: Txn[]): string {
  const body = txns.map((t) => `<STMTTRN><TRNTYPE>${t.type || 'OTHER'}<DTPOSTED>${t.date || ''}<TRNAMT>${t.amount || '0'}<FITID>${(t.date || '') + (t.checknum || '') + t.amount}<NAME>${t.payee || ''}${t.memo ? `<MEMO>${t.memo}` : ''}</STMTTRN>`).join('\n');
  return `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<BANKMSGSRSV1><STMTTRNRS><TRNUID>1<STATUS><CODE>0<SEVERITY>INFO</STATUS>
<STMTRS><CURDEF>USD<BANKACCTFROM><BANKID>000000000<ACCTID>000000000<ACCTTYPE>CHECKING</BANKACCTFROM>
<BANKTRANLIST><DTSTART>${txns[0]?.date || ''}<DTEND>${txns[txns.length - 1]?.date || ''}
${body}
</BANKTRANLIST></STMTRS></STMTTRNRS></BANKMSGSRSV1>
</OFX>`;
}

// Dev self-checks.
if (import.meta.env.DEV) {
  const qif = parseQif("!Type:Bank\nD01/15'24\nT-50.00\nPStore\nMgroceries\n^\n");
  console.assert(qif.length === 1 && qif[0].amount === '-50.00' && qif[0].date === '20240115', 'QIF parse', qif);
  const ofx = parseOfx('<STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20240115<TRNAMT>-50.00<NAME>Store</STMTTRN>');
  console.assert(ofx.length === 1 && ofx[0].payee === 'Store', 'OFX parse', ofx);
  console.assert(txnsToCsv(ofx).includes('Store'), 'CSV emit');
}
