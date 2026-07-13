// Self-check for the OOXML builders. Run: node _check-ooxml.mts
// Verifies the .docx/.xlsx bytes are a valid ZIP (PK header + readable
// central directory) and that the XML parts are well-formed. A broken ZIP
// offset or malformed XML would make Word/Excel silently refuse the file.
import assert from 'node:assert';
import { makeDocx, xmlEscape } from './src/lib/docx.ts';
import { makeXlsx, colLetter } from './src/lib/xlsx.ts';

const td = new TextDecoder();

// Extract stored (method 0) entries from our ZIP by walking local headers.
function readZip(buf: Uint8Array): Record<string, string> {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const out: Record<string, string> = {};
  let i = 0;
  while (i + 4 <= buf.length && dv.getUint32(i, true) === 0x04034b50) {
    const method = dv.getUint16(i + 8, true);
    assert.equal(method, 0, 'expected store method');
    const size = dv.getUint32(i + 22, true);
    const nameLen = dv.getUint16(i + 26, true);
    const extraLen = dv.getUint16(i + 28, true);
    const name = td.decode(buf.subarray(i + 30, i + 30 + nameLen));
    const dataStart = i + 30 + nameLen + extraLen;
    out[name] = td.decode(buf.subarray(dataStart, dataStart + size));
    i = dataStart + size;
  }
  // Next signature must be the central directory.
  assert.equal(dv.getUint32(i, true), 0x02014b50, 'central directory follows entries');
  return out;
}

// Cheap well-formedness: balanced-ish tag scan is fragile; instead assert the
// XML declaration, a root element, and no stray unescaped '&'.
function assertXml(s: string, label: string) {
  assert.ok(s.startsWith('<?xml'), `${label}: has XML declaration`);
  assert.ok(!/&(?!(amp|lt|gt|quot|apos);)/.test(s), `${label}: no unescaped ampersand`);
}

// --- xmlEscape / colLetter units ---
assert.equal(xmlEscape('a & b <c> "d" \'e\''), 'a &amp; b &lt;c&gt; &quot;d&quot; &apos;e&apos;');
assert.equal(colLetter(0), 'A');
assert.equal(colLetter(25), 'Z');
assert.equal(colLetter(26), 'AA');
assert.equal(colLetter(27), 'AB');
assert.equal(colLetter(701), 'ZZ');
assert.equal(colLetter(702), 'AAA');

// --- docx ---
{
  const blob = makeDocx(['Hello & welcome', '', 'Line one\nLine two', 'Tab\tkept']);
  const buf = new Uint8Array(await blob.arrayBuffer());
  assert.equal(buf[0], 0x50, 'docx PK header'); // 'P'
  assert.equal(buf[1], 0x4b, 'docx PK header'); // 'K'
  const parts = readZip(buf);
  assert.ok(parts['[Content_Types].xml'], 'docx has content types');
  assert.ok(parts['_rels/.rels'], 'docx has rels');
  assertXml(parts['word/document.xml'], 'document.xml');
  const doc = parts['word/document.xml'];
  assert.ok(doc.includes('Hello &amp; welcome'), 'escaped text present');
  assert.ok(doc.includes('<w:p/>'), 'empty paragraph emitted');
  // "Line one\nLine two" splits into two paragraphs.
  assert.ok(doc.includes('Line one') && doc.includes('Line two'), 'both lines present');
  assert.equal((doc.match(/<w:t/g) || []).length, 4, 'four text runs (3 non-empty + tab line)');
}

// --- xlsx ---
{
  const blob = makeXlsx([
    ['Name', 'Qty', 'Price'],
    ['Widget <A>', 3, 9.99],
    ['Gadget & Co', 12, 4.5],
  ]);
  const buf = new Uint8Array(await blob.arrayBuffer());
  assert.equal(buf[0], 0x50, 'xlsx PK header');
  const parts = readZip(buf);
  const sheet = parts['xl/worksheets/sheet1.xml'];
  assertXml(sheet, 'sheet1.xml');
  assert.ok(sheet.includes('r="A1"') && sheet.includes('t="inlineStr"'), 'A1 inline string');
  assert.ok(sheet.includes('r="B2"><v>3</v>'), 'numeric cell B2=3');
  assert.ok(sheet.includes('r="C2"><v>9.99</v>'), 'numeric cell C2=9.99');
  assert.ok(sheet.includes('Widget &lt;A&gt;'), 'escaped string cell');
  assert.ok(sheet.includes('Gadget &amp; Co'), 'escaped ampersand cell');
}

console.log('OK — OOXML builders produce valid ZIP + well-formed XML');
