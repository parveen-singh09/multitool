// Secure randomness helpers shared across the generator tools.
// Everything is built on crypto.getRandomValues so output is
// cryptographically strong and never touches a server.

/** Uniform random integer in [min, max] inclusive, rejection-sampled to avoid modulo bias. */
export function randInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (max < min) [min, max] = [max, min];
  const range = max - min + 1;
  if (range <= 0) return min;
  // 32-bit rejection sampling.
  const maxValid = Math.floor(0xffffffff / range) * range;
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= maxValid);
  return min + (x % range);
}

/** A random float in [0, 1) using 32 bits of entropy. */
export function randFloat(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000;
}

/** Pick one random element from an array. */
export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

/** Pick n random elements (with replacement). */
export function pickN<T>(arr: readonly T[], n: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(pick(arr));
  return out;
}

/** Fisher-Yates shuffle, returns a new array. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick n distinct elements (without replacement). */
export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

export const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
export const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DIGITS = '0123456789';
export const HEX_LOWER = '0123456789abcdef';
export const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?';
// Crockford-style / no-ambiguous set for human-readable codes.
export const UNAMBIGUOUS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Random string of `len` characters drawn uniformly from `alphabet`. */
export function randString(len: number, alphabet = ALPHA_UPPER + DIGITS): string {
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[randInt(0, alphabet.length - 1)];
  return out;
}

/** Lowercase hex string of `len` characters. */
export function randHex(len: number): string {
  return randString(len, HEX_LOWER);
}

/** Random bytes as a Uint8Array. */
export function randBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

/**
 * Luhn (mod-10) check digit for a numeric string. Used by credit-card, IMEI
 * and other schemes. Pass the payload WITHOUT the check digit; returns the
 * single digit to append.
 */
export function luhnCheckDigit(payload: string): number {
  let sum = 0;
  let dbl = true; // the appended check digit is position 1 (odd from the right),
  // so the rightmost payload digit is doubled.
  for (let i = payload.length - 1; i >= 0; i--) {
    let d = payload.charCodeAt(i) - 48;
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return (10 - (sum % 10)) % 10;
}

/** True if a numeric string passes the Luhn checksum (includes its check digit). */
export function luhnValid(num: string): boolean {
  const digits = num.replace(/\D/g, '');
  if (!digits) return false;
  return luhnCheckDigit(digits.slice(0, -1)) === Number(digits.slice(-1));
}

/** GTIN/EAN/UPC mod-10 check digit (weights 3,1,3,1 from the right of the payload). */
export function gtinCheckDigit(payload: string): number {
  let sum = 0;
  // Rightmost payload digit gets weight 3.
  for (let i = payload.length - 1, w = 3; i >= 0; i--, w = w === 3 ? 1 : 3) {
    sum += (payload.charCodeAt(i) - 48) * w;
  }
  return (10 - (sum % 10)) % 10;
}
