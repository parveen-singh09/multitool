

import { randInt, pick, randFloat, randHex } from './random';
import { getLocale, type Locale } from './locales';
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

// ---- Rich locale-aware user profile (for the profile generator) ----

const TITLES_M = ['Mr', 'Dr', 'Prof'];
const TITLES_F = ['Ms', 'Mrs', 'Miss', 'Dr', 'Prof'];
const PW_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
// IANA-ish offsets with a representative zone label.
const TIMEZONES = [
  { offset: '-08:00', name: 'America/Los_Angeles' }, { offset: '-05:00', name: 'America/New_York' },
  { offset: '+00:00', name: 'Europe/London' }, { offset: '+01:00', name: 'Europe/Paris' },
  { offset: '+02:00', name: 'Europe/Athens' }, { offset: '+03:00', name: 'Europe/Moscow' },
  { offset: '+05:30', name: 'Asia/Kolkata' }, { offset: '+08:00', name: 'Asia/Shanghai' },
  { offset: '+09:00', name: 'Asia/Tokyo' }, { offset: '+10:00', name: 'Australia/Sydney' },
];

export interface ProfileOptions {
  sex?: Sex;
  nat?: string; // locale key, or 'any'
}

/** RFC-4122 v4 UUID drawn from the shared (seedable) RNG. */
export function uuid(): string {
  const h = randHex(32).split('');
  h[12] = '4';
  h[16] = '89ab'[randInt(0, 3)];
  const s = h.join('');
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
}

function password(len = 12): string {
  let out = '';
  for (let i = 0; i < len; i++) out += PW_CHARS[randInt(0, PW_CHARS.length - 1)];
  return out;
}

// YYYY-MM-DD `years` before now (offset by the random day/month), plus the age.
function dateYearsAgo(years: number): { date: string; age: number } {
  const now = new Date();
  const d = new Date(now.getFullYear() - years, randInt(0, 11), randInt(1, 28));
  const age = now.getFullYear() - d.getFullYear() -
    (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  return { date: d.toISOString().slice(0, 10), age };
}

export function profile(opts: ProfileOptions = {}) {
  const loc: Locale = getLocale(opts.nat ?? 'any');
  const sex: Exclude<Sex, 'any'> =
    opts.sex === 'male' || opts.sex === 'female' ? opts.sex : (randInt(0, 1) ? 'male' : 'female');
  const first = pick(sex === 'male' ? loc.firstM : loc.firstF);
  const last = pick(loc.last);
  const title = pick(sex === 'male' ? TITLES_M : TITLES_F);

  const streetType = loc.streetTypes.length ? pick(loc.streetTypes) : '';
  const dob = dateYearsAgo(randInt(18, 80));
  const registered = dateYearsAgo(randInt(0, 12));

  return {
    gender: sex,
    title,
    firstName: first,
    lastName: last,
    fullName: `${first} ${last}`,
    initials: (first[0] + last[0]).toUpperCase(),
    username: username(),
    email: email(first, last),
    password: password(),
    phone: loc.phone(),
    cell: loc.phone(),
    uuid: uuid(),
    age: dob.age,
    dob: dob.date,
    registered: registered.date,
    nat: loc.key.toUpperCase(),
    nationality: loc.label,
    flag: loc.flag,
    location: {
      street: loc.streetLine(randInt(1, 9999), pick(loc.streets), streetType),
      city: pick(loc.cities),
      [loc.regionLabel.toLowerCase()]: pick(loc.regions),
      postcode: loc.postcode(),
      country: loc.label,
      coordinates: {
        latitude: +(randFloat() * 180 - 90).toFixed(4),
        longitude: +(randFloat() * 360 - 180).toFixed(4),
      },
      timezone: pick(TIMEZONES),
    },
  };
}

export type Profile = ReturnType<typeof profile>;
