

function gtinCheckDigit(payload: string): number {
  let sum = 0;
  for (let i = payload.length - 1, w = 3; i >= 0; i--, w = w === 3 ? 1 : 3) {
    sum += (payload.charCodeAt(i) - 48) * w;
  }
  return (10 - (sum % 10)) % 10;
}

export function isbn10CheckDigit(payload9: string): string {
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (payload9.charCodeAt(i) - 48) * (10 - i);
  const c = (11 - (sum % 11)) % 11;
  return c === 10 ? 'X' : String(c);
}

export function isbn13CheckDigit(payload12: string): number {
  return gtinCheckDigit(payload12);
}

function clean(input: string): string {
  return input.toUpperCase().replace(/[^0-9X]/g, '');
}

export function isbn10to13(isbn10: string): string {
  const core = clean(isbn10).slice(0, 9);
  const payload = '978' + core;
  return payload + isbn13CheckDigit(payload);
}

export function isbn13to10(isbn13: string): string | null {
  const d = clean(isbn13);
  if (d.length !== 13 || !d.startsWith('978')) return null;
  const core = d.slice(3, 12); 
  return core + isbn10CheckDigit(core);
}

export interface ParsedIsbn {

  isbn13: string;

  isbn10: string | null;

  inputValid: boolean;

  grouped: string;
}

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

export function hyphenate(isbn13: string): string {
  const d = clean(isbn13);
  if (d.length !== 13) return d;
  const prefix = d.slice(0, 3);
  const rest = d.slice(3);

  const groupLen = rest[0] === '0' || rest[0] === '1' ? 1 : 2;
  const group = rest.slice(0, groupLen);
  const middle = rest.slice(groupLen, -1);
  const check = rest.slice(-1);

  const cut = Math.ceil(middle.length / 2);
  return `${prefix}-${group}-${middle.slice(0, cut)}-${middle.slice(cut)}-${check}`;
}

function demo() {
  const assert = (c: unknown, m: string) => { if (!c) throw new Error('FAIL: ' + m); };
  assert(isbn13CheckDigit('978030640615') === 7, 'isbn13 check 9780306406157');
  assert(isbn10CheckDigit('030640615') === '2', 'isbn10 check 0306406152');
  assert(isbn10CheckDigit('097522980') === 'X', 'isbn10 X check');
  assert(isbn10to13('0306406152') === '9780306406157', '10→13');
  assert(isbn13to10('9780306406157') === '0306406152', '13→10');
  assert(isbn13to10('9791234567896') === null, '979 has no isbn-10');
  const p = parseIsbn('978-0-306-40615-0')!;
  assert(p.isbn13 === '9780306406157' && !p.inputValid, 'parse corrects check');
  const ok = parseIsbn('9780306406157')!;
  assert(ok.inputValid, 'parse accepts valid');
  console.log('isbn.ts self-check passed');
}
if (typeof process !== 'undefined' && process.argv?.[1]?.replace(/\\/g, '/').endsWith('src/lib/isbn.ts')) demo();
