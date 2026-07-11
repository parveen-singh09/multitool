// Fake-record builders shared by the fake-data generators (name, address,
// profile, mock JSON, CSV). All values are fictional and use reserved/test
// ranges where a real value could otherwise collide with a person.

import { randInt, pick, luhnCheckDigit } from './random';
import {
  FIRST_NAMES_M, FIRST_NAMES_F, LAST_NAMES, STREETS, STREET_TYPES,
  CITIES, US_STATES, EMAIL_DOMAINS, COMPANY_ADJ, COMPANY_NOUN, COMPANY_SUFFIX,
  ADJECTIVES, NOUNS,
} from './fakedata';

export type Sex = 'male' | 'female' | 'any';

export function firstName(sex: Sex = 'any'): string {
  if (sex === 'male') return pick(FIRST_NAMES_M);
  if (sex === 'female') return pick(FIRST_NAMES_F);
  return pick(randInt(0, 1) ? FIRST_NAMES_M : FIRST_NAMES_F);
}

export function lastName(): string {
  return pick(LAST_NAMES);
}

export function fullName(sex: Sex = 'any'): string {
  return `${firstName(sex)} ${lastName()}`;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  stateAbbr: string;
  zip: string;
  country: string;
}

export function address(stateAbbr?: string): Address {
  const st = US_STATES.find((s) => s.abbr === stateAbbr) ?? pick(US_STATES);
  return {
    street: `${randInt(1, 9999)} ${pick(STREETS)} ${pick(STREET_TYPES)}`,
    city: pick(CITIES),
    state: st.name,
    stateAbbr: st.abbr,
    zip: String(randInt(10000, 99999)),
    country: 'United States',
  };
}

export function email(first: string, last: string): string {
  const sep = pick(['.', '_', '']);
  const tail = randInt(0, 1) ? String(randInt(1, 999)) : '';
  return `${first}${sep}${last}${tail}`.toLowerCase().replace(/[^a-z0-9._]/g, '') + '@' + pick(EMAIL_DOMAINS);
}

// US-style phone using the 555-01xx reserved fictional range.
export function phoneUS(): string {
  const area = randInt(200, 989);
  return `(${area}) 555-01${String(randInt(0, 99)).padStart(2, '0')}`;
}

export function phoneUK(): string {
  return `+44 7700 ${String(randInt(900000, 900999)).slice(0)}`; // Ofcom drama range 07700 900xxx
}

export function phoneIntl(): string {
  return `+${randInt(1, 99)} ${randInt(100, 999)} ${randInt(100, 999)} ${randInt(1000, 9999)}`;
}

export function username(): string {
  const style = randInt(0, 2);
  const a = pick(ADJECTIVES), n = pick(NOUNS);
  if (style === 0) return `${a}_${n}${randInt(1, 99)}`;
  if (style === 1) return `${a}${n[0].toUpperCase()}${n.slice(1)}`;
  return `${n}${randInt(100, 9999)}`;
}

export function companyName(withSuffix = true): string {
  const style = randInt(0, 2);
  let base: string;
  if (style === 0) base = `${pick(COMPANY_ADJ)} ${pick(COMPANY_NOUN)}`;
  else if (style === 1) base = `${lastName()} ${pick(COMPANY_NOUN)}`;
  else base = `${pick(COMPANY_ADJ)}${pick(COMPANY_NOUN)}`;
  return withSuffix ? `${base} ${pick(COMPANY_SUFFIX)}` : base;
}

// ISO date (YYYY-MM-DD) between two years, inclusive.
export function birthDate(minAge = 18, maxAge = 80): string {
  const now = new Date();
  const year = now.getFullYear() - randInt(minAge, maxAge);
  const month = randInt(1, 12);
  const day = randInt(1, 28);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Luhn-valid test card number for a scheme. These are deliberately valid-format
// TEST numbers — they are not real, active accounts.
export interface Card { scheme: string; number: string; cvv: string; expiry: string; }

const CARD_PREFIX: Record<string, { prefix: string; len: number; cvvLen: number }> = {
  Visa: { prefix: '4', len: 16, cvvLen: 3 },
  Mastercard: { prefix: '55', len: 16, cvvLen: 3 },
  Amex: { prefix: '37', len: 15, cvvLen: 4 },
  Discover: { prefix: '6011', len: 16, cvvLen: 3 },
};

export function creditCard(scheme: keyof typeof CARD_PREFIX): Card {
  const spec = CARD_PREFIX[scheme];
  let body = spec.prefix;
  while (body.length < spec.len - 1) body += randInt(0, 9);
  const num = body + luhnCheckDigit(body);
  const grouped = scheme === 'Amex'
    ? `${num.slice(0, 4)} ${num.slice(4, 10)} ${num.slice(10)}`
    : num.replace(/(.{4})/g, '$1 ').trim();
  let cvv = '';
  for (let i = 0; i < spec.cvvLen; i++) cvv += randInt(0, 9);
  const exp = `${String(randInt(1, 12)).padStart(2, '0')}/${String(randInt(26, 32))}`;
  return { scheme, number: grouped, cvv, expiry: exp };
}

// Format-valid IBAN using mod-97. Country + BBAN length per spec.
const IBAN_SPEC: Record<string, number> = { DE: 18, GB: 18, FR: 23, ES: 20, NL: 14, IT: 23 };

export function iban(country: keyof typeof IBAN_SPEC): string {
  const bbanLen = IBAN_SPEC[country];
  let bban = '';
  for (let i = 0; i < bbanLen; i++) bban += randInt(0, 9);
  // Compute check digits: move country+00 to end, convert letters, mod 97.
  const rearranged = bban + country + '00';
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let remainder = 0;
  for (const ch of numeric) remainder = (remainder * 10 + (ch.charCodeAt(0) - 48)) % 97;
  const check = String(98 - remainder).padStart(2, '0');
  return (country + check + bban).replace(/(.{4})/g, '$1 ').trim();
}

// SSN-formatted value in the non-issuable 900-999 area range (never assigned).
export function ssn(): string {
  const area = randInt(900, 999);
  const group = String(randInt(1, 99)).padStart(2, '0');
  const serial = String(randInt(1, 9999)).padStart(4, '0');
  return `${area}-${group}-${serial}`;
}
