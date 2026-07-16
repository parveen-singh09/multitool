

import { randInt, pick, shuffle } from './random';
import { COMPANY_NOUN, NOUNS, ADJECTIVES } from './fakedata';

export type NameStyle =
  | 'auto'
  | 'brandable'
  | 'compound'
  | 'evocative'
  | 'short'
  | 'alternate'
  | 'real';

export type Randomness = 0 | 1 | 2;

export interface NameIdea {
  name: string;
  style: NameStyle;
}

const PREFIX = ['Get', 'Go', 'Neo', 'Meta', 'Hyper', 'Sky', 'Nova', 'Zen', 'Pro', 'Peak', 'Up', 'Ever', 'Well'];
const SUFFIX = ['ly', 'ify', 'io', 'ora', 'ora', 'sy', 'zy', 'ia', 'ify', 'able', 'ora', 'io', 'wise', 'r', 'go', 'io'];
const BRAND_SUFFIX = ['ify', 'ly', 'io', 'ora', 'ify', 'sy', 'wave', 'flow', 'zen', 'ade', 'ora', 'ia'];

const PAIR = [
  'Forge', 'Spark', 'Loop', 'Grid', 'Pulse', 'Nest', 'Craft', 'Mint', 'Drift', 'Bloom',
  'Peak', 'Wave', 'Nova', 'Flux', 'Lift', 'Beam', 'Path', 'Hive', 'Sage', 'Bolt',
];
const SYLL = ['va', 'lo', 'ze', 'ny', 'ra', 'mi', 'ko', 'ta', 'lu', 'da', 'qui', 'vo', 'ax', 'ex', 'io'];

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const clean = (s: string) => s.trim().toLowerCase().replace(/[^a-z]/g, '');

function dropVowels(w: string): string {
  return w.replace(/[aeiou]/g, (m, i) => (i === 0 ? m : ''));
}

function alternateSpelling(w: string): string {
  const swaps: Array<[RegExp, string]> = [
    [/c/g, 'k'],
    [/s$/g, 'z'],
    [/ks/g, 'x'],
    [/ph/g, 'f'],
    [/tion/g, 'shun'],
    [/er$/g, 'r'],
  ];
  const [re, to] = pick(swaps);
  let out = w.replace(re, to);
  if (out === w) out = w.endsWith('y') ? w.slice(0, -1) + 'i' : w + w.slice(-1); 
  return out;
}

function brandable(kw: string, r: Randomness): string {
  const roll = randInt(0, r === 0 ? 1 : 3);
  if (roll === 0) return cap(kw) + pick(BRAND_SUFFIX);
  if (roll === 1) return cap(pick(PREFIX)) + kw;
  if (roll === 2) {
    const nv = dropVowels(kw);
    return cap(nv.length >= 3 ? nv : kw) + pick(SUFFIX);
  }

  const stem = kw.slice(0, Math.max(3, kw.length - randInt(0, 2)));
  return cap(pick(SYLL)) + stem + (randInt(0, 1) ? pick(SUFFIX) : '');
}

function compound(kw: string): string {
  return randInt(0, 1) ? cap(kw) + pick(PAIR) : pick(PAIR) + cap(kw);
}

function evocative(kw: string): string {
  const word = randInt(0, 1) ? pick(NOUNS) : pick(COMPANY_NOUN).toLowerCase();
  return randInt(0, 1) ? `${cap(kw)} ${cap(word)}` : `${cap(pick(ADJECTIVES))} ${cap(kw)}`;
}

function short(kw: string): string {
  const nv = dropVowels(kw);
  const base = nv.length >= 3 ? nv : kw.slice(0, 5);
  return cap(base) + (randInt(0, 2) === 0 ? pick(['io', 'ly', 'r']) : '');
}

function realWords(kw: string): string {
  return randInt(0, 1) ? `${cap(kw)} & ${cap(pick(NOUNS))}` : `${cap(pick(ADJECTIVES))} ${cap(kw)}`;
}

function oneIdea(kw: string, style: NameStyle, r: Randomness): NameIdea {
  const s: NameStyle =
    style === 'auto'
      ? pick(['brandable', 'brandable', 'compound', 'evocative', 'short', 'alternate', 'real'] as NameStyle[])
      : style;
  let name: string;
  switch (s) {
    case 'compound': name = compound(kw); break;
    case 'evocative': name = evocative(kw); break;
    case 'short': name = short(kw); break;
    case 'alternate': name = cap(alternateSpelling(kw)) + (randInt(0, 1) && r > 0 ? pick(SUFFIX) : ''); break;
    case 'real': name = realWords(kw); break;
    case 'brandable':
    default: name = brandable(kw, r); break;
  }
  return { name, style: s };
}

export interface GenerateOptions {
  keywords: string[];
  style?: NameStyle;
  randomness?: Randomness;
  count?: number;
}

export function generateNames(opts: GenerateOptions): NameIdea[] {
  const style = opts.style ?? 'auto';
  const randomness = opts.randomness ?? 1;
  const count = Math.max(1, Math.min(100, opts.count ?? 24));

  const kws = opts.keywords.map(clean).filter((k) => k.length >= 2);
  const pool = kws.length ? kws : shuffle([...NOUNS]).slice(0, 4);

  const seen = new Set<string>();
  const out: NameIdea[] = [];
  let guard = count * 40; 
  while (out.length < count && guard-- > 0) {
    const idea = oneIdea(pick(pool), style, randomness);
    const key = idea.name.toLowerCase();
    if (idea.name.length < 2 || seen.has(key)) continue;
    seen.add(key);
    out.push(idea);
  }
  return out;
}

export function runSelfCheck(): void {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('naming self-check: ' + m); };

  const a = generateNames({ keywords: ['cloud'], style: 'auto', randomness: 1, count: 24 });
  assert(a.length === 24, `auto count ${a.length} != 24`);
  assert(a.every((x) => x.name.length >= 2), 'empty/too-short name produced');
  assert(new Set(a.map((x) => x.name.toLowerCase())).size === a.length, 'duplicate names');

  const b = generateNames({ keywords: ['cloud'], style: 'brandable', randomness: 0, count: 30 });
  assert(b.some((x) => /cloud|cld/i.test(x.name)), 'low-randomness lost the keyword');

  const c = generateNames({ keywords: ['', '!!'], style: 'auto', count: 10 });
  assert(c.length === 10, `fallback count ${c.length} != 10`);

  const d = generateNames({ keywords: ['ai'], style: 'real', count: 100 });
  assert(d.length > 0 && d.length <= 100, `bounded count ${d.length}`);

  console.log('naming self-check OK:', { auto: a.length, brandable: b.length, sample: a.slice(0, 4).map((x) => x.name) });
}

if (typeof process !== 'undefined' && process.argv?.[1] && /naming\.ts$/.test(process.argv[1])) {
  runSelfCheck();
}
