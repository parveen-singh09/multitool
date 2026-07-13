

function cryptoUint32(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0];
}

let rngSource: () => number = cryptoUint32;

function xmur3(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t ^ (t >>> 14)) >>> 0;
  };
}

export function setSeed(seed: string | null | undefined): void {
  rngSource = seed == null || seed === '' ? cryptoUint32 : mulberry32(xmur3(seed));
}

export function randInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (max < min) [min, max] = [max, min];
  const range = max - min + 1;
  if (range <= 0) return min;

  const maxValid = Math.floor(0xffffffff / range) * range;
  let x = 0;
  do {
    x = rngSource();
  } while (x >= maxValid);
  return min + (x % range);
}

export function randFloat(): number {
  return rngSource() / 0x100000000;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function pickN<T>(arr: readonly T[], n: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(pick(arr));
  return out;
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

export const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
export const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DIGITS = '0123456789';
export const HEX_LOWER = '0123456789abcdef';
export const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?';

export const UNAMBIGUOUS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function randString(len: number, alphabet = ALPHA_UPPER + DIGITS): string {
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[randInt(0, alphabet.length - 1)];
  return out;
}

export function randHex(len: number): string {
  return randString(len, HEX_LOWER);
}

export function randBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

export function luhnCheckDigit(payload: string): number {
  let sum = 0;
  let dbl = true; 

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

export function luhnValid(num: string): boolean {
  const digits = num.replace(/\D/g, '');
  if (!digits) return false;
  return luhnCheckDigit(digits.slice(0, -1)) === Number(digits.slice(-1));
}

export function gtinCheckDigit(payload: string): number {
  let sum = 0;

  for (let i = payload.length - 1, w = 3; i >= 0; i--, w = w === 3 ? 1 : 3) {
    sum += (payload.charCodeAt(i) - 48) * w;
  }
  return (10 - (sum % 10)) % 10;
}
