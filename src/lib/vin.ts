// VIN (Vehicle Identification Number) helpers — decode, validate, generate.
// North American 17-char standard (ISO 3779). All client-side; sample VINs are
// for testing only and do not identify real vehicles.

import { randInt, pick } from './random';

// VIN alphabet excludes I, O, Q (look like 1/0).
export const VIN_CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
const TRANS: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
};

/** Position-9 (index 8) check digit for a 17-char VIN. Returns '0'-'9' or 'X'. */
export function checkDigit(chars: string): string {
  let sum = 0;
  for (let i = 0; i < 17; i++) sum += (TRANS[chars[i]] ?? 0) * WEIGHTS[i];
  const r = sum % 11;
  return r === 10 ? 'X' : String(r);
}

// Model-year code at position 10 (index 9). 30-year cycle; A-Y skip I,O,Q,U,Z,
// then 1-9. We map to the most recent plausible year (<= current + 1).
const YEAR_CODES = 'ABCDEFGHJKLMNPRSTVWXY123456789'; // 30 entries -> years 1980..2009
export function yearFromCode(code: string, now = 2026): number | null {
  const i = YEAR_CODES.indexOf(code);
  if (i < 0) return null;
  let y = 1980 + i;
  while (y + 30 <= now + 1) y += 30; // roll forward to the most recent cycle
  return y;
}
export function codeFromYear(year: number): string {
  return YEAR_CODES[((year - 1980) % 30 + 30) % 30];
}

/** Continent/region from the first WMI character. */
export function regionFromChar(c: string): string {
  if (c >= '1' && c <= '5') return 'North America';
  if (c === '6' || c === '7') return 'Oceania';
  if (c === '8' || c === '9' || c === '0') return 'South America';
  if (c >= 'A' && c <= 'H') return 'Africa';
  if (c >= 'J' && c <= 'R') return 'Asia';
  if (c >= 'S' && c <= 'Z') return 'Europe';
  return 'Unknown';
}

// Country by the first 1-2 WMI chars — common ranges only. ponytail: partial map,
// extend the table if a specific country is needed.
const COUNTRY: [RegExp, string][] = [
  [/^1|^4|^5/, 'United States'], [/^2/, 'Canada'], [/^3[A-W]/, 'Mexico'],
  [/^9[A-E]|^8[0-9]/, 'Brazil / South America'],
  [/^6/, 'Australia'], [/^7/, 'New Zealand'],
  [/^J/, 'Japan'], [/^K[L-R]/, 'South Korea'], [/^L/, 'China'],
  [/^M[A-E]/, 'India'], [/^R[F-R]/, 'Taiwan'],
  [/^S[A-M]/, 'United Kingdom'], [/^T[A-H]/, 'Switzerland'],
  [/^V[F-R]/, 'France'], [/^V[S-W]/, 'Spain'], [/^W/, 'Germany'],
  [/^X[0-9]/, 'Russia'], [/^Y[S-W]/, 'Sweden'],
  [/^Z[A-R]/, 'Italy'],
];
export function countryFromWmi(wmi: string): string {
  for (const [re, name] of COUNTRY) if (re.test(wmi)) return name;
  return regionFromChar(wmi[0]);
}

// Representative WMI per popular make, for "generate by make". Real WMIs.
export const MAKES: { name: string; wmi: string }[] = [
  { name: 'Toyota', wmi: 'JTD' }, { name: 'Honda', wmi: 'JHM' },
  { name: 'Nissan', wmi: 'JN1' }, { name: 'Mazda', wmi: 'JM1' },
  { name: 'Subaru', wmi: 'JF1' }, { name: 'Ford', wmi: '1FA' },
  { name: 'Chevrolet', wmi: '1G1' }, { name: 'GMC', wmi: '1GT' },
  { name: 'Dodge', wmi: '1B3' }, { name: 'Jeep', wmi: '1J4' },
  { name: 'Tesla', wmi: '5YJ' }, { name: 'BMW', wmi: 'WBA' },
  { name: 'Mercedes-Benz', wmi: 'WDB' }, { name: 'Volkswagen', wmi: 'WVW' },
  { name: 'Audi', wmi: 'WAU' }, { name: 'Porsche', wmi: 'WP0' },
  { name: 'Volvo', wmi: 'YV1' }, { name: 'Hyundai', wmi: 'KMH' },
  { name: 'Kia', wmi: 'KNA' }, { name: 'Land Rover', wmi: 'SAL' },
  { name: 'Jaguar', wmi: 'SAJ' }, { name: 'Fiat', wmi: 'ZFA' },
  { name: 'Ferrari', wmi: 'ZFF' },
];
// Extra real WMIs for decode-only lookup (common alternates not in the dropdown).
const EXTRA_WMI: Record<string, string> = {
  '1HG': 'Honda', JHL: 'Honda', '2HG': 'Honda', '1FT': 'Ford', '1FM': 'Ford',
  '3FA': 'Ford', '1GC': 'Chevrolet', '2G1': 'Chevrolet', '3GN': 'Chevrolet',
  '1C3': 'Chrysler', '2C3': 'Chrysler', '1N4': 'Nissan', '3N1': 'Nissan',
  '4T1': 'Toyota', '5TD': 'Toyota', '2T1': 'Toyota', '4S3': 'Subaru',
  WDD: 'Mercedes-Benz', WA1: 'Audi', '5TF': 'Toyota', '7SA': 'Tesla',
  LRW: 'Tesla', WP1: 'Porsche', '5UX': 'BMW', '4US': 'BMW', '3VW': 'Volkswagen',
  '5NP': 'Hyundai', '5XY': 'Hyundai', KND: 'Kia', '5XX': 'Kia',
};
export function makeFromWmi(wmi: string): string | null {
  return MAKES.find((m) => m.wmi === wmi)?.name ?? EXTRA_WMI[wmi] ?? null;
}

export interface DecodeResult {
  vin: string;
  valid: boolean;
  error?: string;
  wmi: string;
  vds: string;
  vis: string;
  region: string;
  country: string;
  make: string | null;
  yearCode: string;
  year: number | null;
  plant: string;
  serial: string;
  checkDigit: string;
  expectedCheckDigit: string;
  checkValid: boolean;
}

/** Decode a VIN. Structural fields are always filled; `valid` reflects format + checksum. */
export function decodeVin(raw: string): DecodeResult {
  const vin = raw.trim().toUpperCase();
  const base = {
    vin, wmi: vin.slice(0, 3), vds: vin.slice(3, 9), vis: vin.slice(9),
    region: regionFromChar(vin[0] ?? ''), country: countryFromWmi(vin),
    make: makeFromWmi(vin.slice(0, 3)),
    yearCode: vin[9] ?? '', year: yearFromCode(vin[9] ?? ''),
    plant: vin[10] ?? '', serial: vin.slice(11),
    checkDigit: vin[8] ?? '', expectedCheckDigit: '', checkValid: false,
  };
  if (vin.length !== 17) return { ...base, valid: false, error: 'A VIN must be exactly 17 characters.' };
  if (/[IOQ]/.test(vin)) return { ...base, valid: false, error: 'VINs cannot contain the letters I, O, or Q.' };
  if (![...vin].every((c) => VIN_CHARS.includes(c)))
    return { ...base, valid: false, error: 'VIN contains characters outside A-Z (no I/O/Q) and 0-9.' };
  const expected = checkDigit(vin);
  const checkValid = expected === vin[8];
  return {
    ...base, expectedCheckDigit: expected, checkValid,
    valid: checkValid,
    error: checkValid ? undefined : `Check digit mismatch: position 9 is "${vin[8]}" but should be "${expected}".`,
  };
}

/** True if the VIN is well-formed and its check digit is correct. */
export function validateVin(raw: string): boolean {
  return decodeVin(raw).valid;
}

/**
 * Generate a random VIN with a valid check digit.
 * opts.wmi pins the leading 3 chars (a make); opts.year pins model-year position.
 */
export function generateVin(opts: { wmi?: string; year?: number } = {}): string {
  const chars: string[] = [];
  for (let i = 0; i < 17; i++) chars.push(pick([...VIN_CHARS]));
  if (opts.wmi && opts.wmi.length === 3) {
    for (let i = 0; i < 3; i++) chars[i] = opts.wmi[i];
  }
  if (opts.year != null) chars[9] = codeFromYear(opts.year);
  chars[8] = '0'; // placeholder so checkDigit reads a clean string
  chars[8] = checkDigit(chars.join(''));
  return chars.join('');
}
