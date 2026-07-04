// Encoding helpers shared by the security generators (tokens, TOTP, keys).
// Pure functions, no dependencies — safe to import into any client script.

const B62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/** Bytes → lowercase hex. */
export function toHex(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += b.toString(16).padStart(2, '0');
  return s;
}

/** Bytes → standard base64 (btoa-based, browser only). */
export function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/** Bytes → URL-safe base64 without padding. */
export function toBase64Url(bytes: Uint8Array): string {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Bytes → base62 (bijective over the byte stream via bigint). */
export function toBase62(bytes: Uint8Array): string {
  if (!bytes.length) return '';
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  if (n === 0n) return '0';
  let out = '';
  while (n > 0n) {
    out = B62[Number(n % 62n)] + out;
    n /= 62n;
  }
  return out;
}

/** Bytes → RFC 4648 base32 (used for TOTP secrets). */
export function toBase32(bytes: Uint8Array): string {
  let bits = 0, value = 0, out = '';
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

/** RFC 4648 base32 string → bytes (ignores spaces/padding, case-insensitive). */
export function fromBase32(s: string): Uint8Array {
  const clean = s.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0, value = 0;
  const out: number[] = [];
  for (const c of clean) {
    value = (value << 5) | B32.indexOf(c);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

/** UTF-8 string → bytes. */
export function utf8(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}
