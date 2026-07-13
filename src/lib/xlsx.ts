// Minimal Office Open XML (.xlsx) builder. A .xlsx is a ZIP of XML parts;
// we emit one worksheet with inline string / number cells. This preserves
// tabular data (rows × columns), NOT original PDF layout, merged cells,
// styling or formulas — honest fidelity for PDF→Excel table extraction.
//
// ponytail: single sheet, inline strings. Add a shared string table or
// multiple sheets here if a tool needs them.

import { makeZip } from './zip';

const enc = new TextEncoder();
const bytes = (s: string) => enc.encode(s);

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Column index (0-based) → spreadsheet letter (A, B, …, Z, AA, AB, …).
export function colLetter(i: number): string {
  let s = '';
  i += 1;
  while (i > 0) {
    const rem = (i - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    i = Math.floor((i - 1) / 26);
  }
  return s;
}

// A finite number → numeric cell; everything else → inline string cell.
function cell(ref: string, value: string | number): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${ref}"><v>${value}</v></c>`;
  }
  const s = String(value ?? '');
  if (s === '') return '';
  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(s)}</t></is></c>`;
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

const WORKBOOK = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`;

/**
 * Build a .xlsx Blob from a 2D array of rows. Cell values that are finite
 * numbers become numeric cells; everything else becomes text.
 */
export function makeXlsx(rows: (string | number)[][]): Blob {
  const rowXml = rows
    .map((row, r) => {
      const cells = row.map((v, c) => cell(`${colLetter(c)}${r + 1}`, v)).join('');
      return `<row r="${r + 1}">${cells}</row>`;
    })
    .join('');

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${rowXml}</sheetData>
</worksheet>`;

  return new Blob(
    [
      makeZip([
        { name: '[Content_Types].xml', data: bytes(CONTENT_TYPES) },
        { name: '_rels/.rels', data: bytes(RELS) },
        { name: 'xl/workbook.xml', data: bytes(WORKBOOK) },
        { name: 'xl/_rels/workbook.xml.rels', data: bytes(WORKBOOK_RELS) },
        { name: 'xl/worksheets/sheet1.xml', data: bytes(sheet) },
      ]),
    ],
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  );
}
