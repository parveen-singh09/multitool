// ISBN parsing, validation and conversion. Pure functions — no DOM, no crypto,
// so they run in the browser page and in a node self-check (see demo() below).
// The EAN-13 bars encode digits only; dashes are cosmetic label grouping.

/** GTIN/EAN mod-10 check digit (weights 3,1 from the right). Inlined so this
 * module stays dependency-free and runs under a bare `node` self-check. */
function gtinCheckDigit(payload: string): number {
  let sum = 0;
  for (let i = payload.length - 1, w = 3; i >= 0; i--, w = w === 3 ? 1 : 3) {
    sum += (payload.charCodeAt(i) - 48) * w;
  }
  return (10 - (sum % 10)) % 10;
}

/** ISBN-10 check character (mod-11, weights 10..2). Returns '0'-'9' or 'X'. */
export function isbn10CheckDigit(payload9: string): string {
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (payload9.charCodeAt(i) - 48) * (10 - i);
  const c = (11 - (sum % 11)) % 11;
  return c === 10 ? 'X' : String(c);
}

/** ISBN-13 check digit (GTIN mod-10). Pass the 12-digit payload. */
export function isbn13CheckDigit(payload12: string): number {
  return gtinCheckDigit(payload12);
}

/** Strip everything but digits and a trailing X (ISBN-10 check char). */
function clean(input: string): string {
  return input.toUpperCase().replace(/[^0-9X]/g, '');
}

/** ISBN-10 → ISBN-13: drop old check, prepend 978, recompute mod-10 check. */
export function isbn10to13(isbn10: string): string {
  const core = clean(isbn10).slice(0, 9);
  const payload = '978' + core;
  return payload + isbn13CheckDigit(payload);
}

/** ISBN-13 → ISBN-10 (only possible for the 978 prefix). Returns null otherwise. */
export function isbn13to10(isbn13: string): string | null {
  const d = clean(isbn13);
  if (d.length !== 13 || !d.startsWith('978')) return null;
  const core = d.slice(3, 12); // 9 significant digits after the 978 prefix
  return core + isbn10CheckDigit(core);
}

export interface ParsedIsbn {
  /** Normalized 13-digit ISBN with a corrected check digit. */
  isbn13: string;
  /** ISBN-10 equivalent when the prefix is 978, else null. */
  isbn10: string | null;
  /** True when the input already carried a valid check digit. */
  inputValid: boolean;
  /** Approximate hyphenated grouping for the human-readable "ISBN" label. */
  grouped: string;
}

/**
 * Parse a user-typed ISBN (10 or 13 digits, any dashes/spaces). Always returns
 * a valid ISBN-13 with the check digit corrected, plus whether the *input* was
 * already valid so the UI can flag typos.
 */
export function parseIsbn(input: string): ParsedIsbn | null {
  const d = clean(input);
  let isbn13: string;
  let inputValid: boolean;

  if (d.length === 13 && /^\d{13}$/.test(d)) {
    const payload = d.slice(0, 12);
    const check = isbn13CheckDigit(payload);
    inputValid = check === Number(d[12]);
    isbn13 = payload + check;
  } else if (d.length === 10 && /^\d{9}[0-9X]$/.test(d)) {
    inputValid = isbn10CheckDigit(d.slice(0, 9)) === d[9];
    isbn13 = isbn10to13(d);
  } else {
    return null;
  }

  return {
    isbn13,
    isbn10: isbn13to10(isbn13),
    inputValid,
    grouped: hyphenate(isbn13),
  };
}

/**
 * Approximate ISBN-13 hyphenation for the label above the barcode.
 * ponytail: heuristic groups (prefix-group-registrant-publication-check).
 * Exact split needs the ISBN International range table (~500 KB); for a
 * mockup/testing tool a plausible grouping is enough. Upgrade path: bundle
 * RangeMessage.xml rules if publishing-grade hyphenation is ever required.
 */
export function hyphenate(isbn13: string): string {
  const d = clean(isbn13);
  if (d.length !== 13) return d;
  const prefix = d.slice(0, 3);
  const rest = d.slice(3);
  // Single-digit registration group for English-language areas (0/1) is the
  // common case; otherwise fall back to a 2-digit group.
  const groupLen = rest[0] === '0' || rest[0] === '1' ? 1 : 2;
  const group = rest.slice(0, groupLen);
  const middle = rest.slice(groupLen, -1);
  const check = rest.slice(-1);
  // Split the middle roughly in half between registrant and publication.
  const cut = Math.ceil(middle.length / 2);
  return `${prefix}-${group}-${middle.slice(0, cut)}-${middle.slice(cut)}-${check}`;
}

// --- self-check: node --experimental-strip-types src/lib/isbn.ts ---
function demo() {
  const assert = (c: unknown, m: string) => { if (!c) throw new Error('FAIL: ' + m); };
  // Known-good ISBN-13 check digit (Angus & Robertson sample).
  assert(isbn13CheckDigit('978030640615') === 7, 'isbn13 check 9780306406157');
  // ISBN-10 check char, including the X case.
  assert(isbn10CheckDigit('030640615') === '2', 'isbn10 check 0306406152');
  assert(isbn10CheckDigit('097522980') === 'X', 'isbn10 X check');
  // Round-trip conversion.
  assert(isbn10to13('0306406152') === '9780306406157', '10→13');
  assert(isbn13to10('9780306406157') === '0306406152', '13→10');
  assert(isbn13to10('9791234567896') === null, '979 has no isbn-10');
  // Parse fixes a wrong check digit and reports the input as invalid.
  const p = parseIsbn('978-0-306-40615-0')!;
  assert(p.isbn13 === '9780306406157' && !p.inputValid, 'parse corrects check');
  const ok = parseIsbn('9780306406157')!;
  assert(ok.inputValid, 'parse accepts valid');
  console.log('isbn.ts self-check passed');
}
// Run only when executed directly, never on import.
if (typeof process !== 'undefined' && process.argv?.[1]?.replace(/\\/g, '/').endsWith('src/lib/isbn.ts')) demo();
