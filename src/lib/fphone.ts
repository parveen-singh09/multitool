

import { randInt } from './random';
import {
  getCountries, getCountryCallingCode, getExampleNumber,
  parsePhoneNumberFromString, type CountryCode,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';

const d = (n: number) => String(randInt(0, 10 ** n - 1)).padStart(n, '0');

const RESERVED: Record<string, () => string> = {
  US: () => `${randInt(200, 989)}55501${d(2)}`,
  CA: () => `${randInt(200, 989)}55501${d(2)}`,
  GB: () => `7700900${d(3)}`,          // Ofcom drama range 07700 900xxx
  AU: () => `4${d(8)}`,
  DE: () => `15${randInt(0, 9)}${d(7)}`,
  FR: () => `6${d(8)}`,
  IT: () => `3${randInt(20, 99)}${d(7)}`,
  ES: () => `6${d(8)}`,
  NL: () => `6${d(8)}`,
  SE: () => `70${d(7)}`,
  JP: () => `90${d(8)}`,
  CN: () => `1${randInt(30, 89)}${d(8)}`,
  IN: () => `${randInt(70, 99)}${d(8)}`,
  BR: () => `${randInt(11, 99)}9${d(8)}`,
  MX: () => `${randInt(55, 99)}${d(8)}`,
  RU: () => `9${d(9)}`,
};

// 🇺🇸 from "US" — regional indicator symbols, no image assets needed.
const flagEmoji = (code: string) =>
  code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

let regionNames: Intl.DisplayNames | undefined;
try { regionNames = new Intl.DisplayNames(['en'], { type: 'region' }); } catch { regionNames = undefined; }
const nameOf = (code: string) => regionNames?.of(code) ?? code;

export interface PhoneCountry {
  code: string;      // ISO-3166 alpha-2
  name: string;
  flag: string;      // emoji
  dialCode: string;  // "+1", "+44", …
}

export const COUNTRIES: PhoneCountry[] = getCountries()
  .map((code) => ({ code, name: nameOf(code), flag: flagEmoji(code), dialCode: `+${getCountryCallingCode(code as CountryCode)}` }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const COUNTRY_BY_CODE: Record<string, PhoneCountry> =
  Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

export type Style = 'national' | 'international' | 'e164' | 'plain';

export interface Phone {
  country: string;
  code: string;
  national: string;
  international: string;
  e164: string;
  plain: string;   // NSN digits only
}

// Raw national significant number (digits only) for a country.
function nsnFor(code: string): string {
  const reserved = RESERVED[code];
  if (reserved) return reserved();
  const ex = getExampleNumber(code as CountryCode, examples);
  const en = ex?.nationalNumber ?? '';
  if (!en) return d(9); // no example (e.g. AQ) — fall back to 9 random digits
  const keep = Math.min(2, en.length - 1);          // keep a valid prefix
  return en.slice(0, keep) + d(en.length - keep);   // randomise the rest, same length
}

export function generate(countryCode: string): Phone {
  const c = COUNTRY_BY_CODE[countryCode] ?? COUNTRIES[0];
  const nsn = nsnFor(c.code);
  const e164 = `${c.dialCode}${nsn}`;
  const p = parsePhoneNumberFromString(e164);
  return {
    country: c.name,
    code: c.code,
    national: p ? p.formatNational() : nsn,
    international: p ? p.formatInternational() : e164,
    e164: p ? p.number : e164,
    plain: nsn,
  };
}

export const styleOf = (p: Phone, s: Style): string =>
  s === 'international' ? p.international : s === 'e164' ? p.e164 : s === 'plain' ? p.plain : p.national;
