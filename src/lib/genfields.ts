

import { randInt, randFloat, pick, randString, luhnCheckDigit, UNAMBIGUOUS } from './random';
import type { Locale } from './locales';
import { email as mkEmail, username as mkUsername, uuid as mkUuid, companyName } from './fakegen';

export interface FieldCtx {
  row: number;    
  locale: Locale; 
  opts: string;   
}

export interface FieldType {
  key: string;
  label: string;
  group: string;
  needsOpts?: 'range' | 'date' | 'list'; 
  placeholder?: string;
  gen: (c: FieldCtx) => string | number | boolean;
}

const TITLES_M = ['Mr', 'Dr', 'Prof'];
const TITLES_F = ['Ms', 'Mrs', 'Miss', 'Dr'];
const PW_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
const CC_PREFIX = ['4', '51', '52', '53', '54', '55', '37', '6011']; 
const CURRENCIES = ['$', '€', '£', '¥'];

function firstNameOf(l: Locale): string {
  return pick(randInt(0, 1) ? l.firstM : l.firstF);
}

function range(opts: string, dMin: number, dMax: number): [number, number] {
  const [a, b] = opts.split(',').map((s) => Number(s.trim()));
  const min = Number.isFinite(a) ? a : dMin;
  const max = Number.isFinite(b) ? b : dMax;
  return min <= max ? [min, max] : [max, min];
}

function dateBetween(opts: string): string {
  const [a, b] = opts.split(',').map((s) => s.trim());
  const lo = Date.parse(a);
  const hi = Date.parse(b);
  const min = Number.isFinite(lo) ? lo : Date.parse('1970-01-01');
  const max = Number.isFinite(hi) ? hi : Date.now();
  const [from, to] = min <= max ? [min, max] : [max, min];
  const t = from + Math.floor(randFloat() * (to - from));
  return new Date(t).toISOString().slice(0, 10);
}

function ageDob(): { age: number; dob: string } {
  const age = randInt(18, 80);
  const now = new Date();
  const d = new Date(now.getFullYear() - age, randInt(0, 11), randInt(1, 28));
  return { age, dob: d.toISOString().slice(0, 10) };
}

function creditCard(): string {
  const prefix = pick(CC_PREFIX);
  let body = prefix;
  while (body.length < 15) body += String(randInt(0, 9));
  return body + String(luhnCheckDigit(body));
}

const LOREM = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor ' +
  'incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud'
).split(' ');

export const FIELD_TYPES: FieldType[] = [

  { key: 'increment', label: 'Auto-increment', group: 'Basics', needsOpts: 'range', placeholder: 'start (e.g. 1)',
    gen: (c) => (Number(c.opts.trim()) || 1) + c.row - 1 },
  { key: 'constant', label: 'Constant', group: 'Basics', needsOpts: 'list', placeholder: 'literal value',
    gen: (c) => c.opts },
  { key: 'boolean', label: 'Boolean', group: 'Basics', gen: () => randInt(0, 1) === 1 },
  { key: 'uuid', label: 'UUID', group: 'Basics', gen: () => mkUuid() },
  { key: 'lorem', label: 'Lorem text', group: 'Basics', needsOpts: 'range', placeholder: 'words (e.g. 6)',
    gen: (c) => { const n = Math.max(1, Number(c.opts.trim()) || 6); let s = ''; for (let i = 0; i < n; i++) s += (i ? ' ' : '') + pick(LOREM); return s; } },

  { key: 'firstName', label: 'First name', group: 'Person', gen: (c) => firstNameOf(c.locale) },
  { key: 'lastName', label: 'Last name', group: 'Person', gen: (c) => pick(c.locale.last) },
  { key: 'fullName', label: 'Full name', group: 'Person', gen: (c) => `${firstNameOf(c.locale)} ${pick(c.locale.last)}` },
  { key: 'gender', label: 'Gender', group: 'Person', gen: () => (randInt(0, 1) ? 'Male' : 'Female') },
  { key: 'title', label: 'Title', group: 'Person', gen: () => pick(randInt(0, 1) ? TITLES_M : TITLES_F) },
  { key: 'age', label: 'Age', group: 'Person', gen: () => ageDob().age },
  { key: 'dob', label: 'Date of birth', group: 'Person', gen: () => ageDob().dob },
  { key: 'username', label: 'Username', group: 'Person', gen: () => mkUsername() },
  { key: 'email', label: 'Email', group: 'Person',
    gen: (c) => mkEmail(firstNameOf(c.locale), pick(c.locale.last)) },
  { key: 'password', label: 'Password', group: 'Person',
    gen: () => { let s = ''; for (let i = 0; i < 12; i++) s += PW_CHARS[randInt(0, PW_CHARS.length - 1)]; return s; } },

  // ---- Contact / Location ----
  { key: 'phone', label: 'Phone', group: 'Contact', gen: (c) => c.locale.phone() },
  { key: 'street', label: 'Street address', group: 'Contact',
    gen: (c) => c.locale.streetLine(randInt(1, 9999), pick(c.locale.streets), c.locale.streetTypes.length ? pick(c.locale.streetTypes) : '') },
  { key: 'city', label: 'City', group: 'Contact', gen: (c) => pick(c.locale.cities) },
  { key: 'region', label: 'Region / State', group: 'Contact', gen: (c) => pick(c.locale.regions) },
  { key: 'postcode', label: 'Postcode', group: 'Contact', gen: (c) => c.locale.postcode() },
  { key: 'country', label: 'Country', group: 'Contact', gen: (c) => c.locale.label },

  // ---- Numbers / Dates ----
  { key: 'number', label: 'Number (range)', group: 'Numbers', needsOpts: 'range', placeholder: 'min,max',
    gen: (c) => { const [lo, hi] = range(c.opts, 1, 100); return randInt(lo, hi); } },
  { key: 'decimal', label: 'Decimal', group: 'Numbers', needsOpts: 'range', placeholder: 'min,max',
    gen: (c) => { const [lo, hi] = range(c.opts, 0, 1000); return +(lo + randFloat() * (hi - lo)).toFixed(2); } },
  { key: 'date', label: 'Date', group: 'Numbers', needsOpts: 'date', placeholder: 'YYYY-MM-DD,YYYY-MM-DD',
    gen: (c) => dateBetween(c.opts) },
  { key: 'latitude', label: 'Latitude', group: 'Numbers', gen: () => +(randFloat() * 180 - 90).toFixed(6) },
  { key: 'longitude', label: 'Longitude', group: 'Numbers', gen: () => +(randFloat() * 360 - 180).toFixed(6) },

  // ---- Commerce ----
  { key: 'company', label: 'Company', group: 'Commerce', gen: () => companyName() },
  { key: 'creditCard', label: 'Credit card', group: 'Commerce', gen: () => creditCard() },
  { key: 'currency', label: 'Currency amount', group: 'Commerce',
    gen: () => `${pick(CURRENCIES)}${(randInt(1, 999999) / 100).toFixed(2)}` },
  { key: 'color', label: 'Color hex', group: 'Commerce', gen: () => '#' + randString(6, '0123456789abcdef') },

  // ---- List ----
  { key: 'pickList', label: 'Pick from list', group: 'List', needsOpts: 'list', placeholder: 'red, green, blue',
    gen: (c) => { const items = c.opts.split(',').map((s) => s.trim()).filter(Boolean); return items.length ? pick(items) : ''; } },
];

export const FIELD_BY_KEY = new Map(FIELD_TYPES.map((f) => [f.key, f]));

// Group keys in declaration order, for building <optgroup>s.
export const FIELD_GROUPS: string[] = [...new Set(FIELD_TYPES.map((f) => f.group))];
