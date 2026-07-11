// Keyword-driven company/brand name generator engine.
// Turns user keywords into brandable name ideas across several naming styles
// (the same families Namelix exposes: brandable, compound, evocative, short,
// alternate spelling, real words). All randomness comes from ./random which is
// crypto-backed, so nothing is predictable and nothing touches a server.

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

/** 0 = stay close to the keyword, 1 = balanced, 2 = highly inventive. */
export type Randomness = 0 | 1 | 2;

export interface NameIdea {
  name: string;
  style: NameStyle;
}

const PREFIX = ['Get', 'Go', 'Neo', 'Meta', 'Hyper', 'Sky', 'Nova', 'Zen', 'Pro', 'Peak', 'Up', 'Ever', 'Well'];
const SUFFIX = ['ly', 'ify', 'io', 'ora', 'ora', 'sy', 'zy', 'ia', 'ify', 'able', 'ora', 'io', 'wise', 'r', 'go', 'io'];
const BRAND_SUFFIX = ['ify', 'ly', 'io', 'ora', 'ify', 'sy', 'wave', 'flow', 'zen', 'ade', 'ora', 'ia'];
// Evocative pairing words: short, logo-friendly, brandable.
const PAIR = [
  'Forge', 'Spark', 'Loop', 'Grid', 'Pulse', 'Nest', 'Craft', 'Mint', 'Drift', 'Bloom',
  'Peak', 'Wave', 'Nova', 'Flux', 'Lift', 'Beam', 'Path', 'Hive', 'Sage', 'Bolt',
];
const SYLL = ['va', 'lo', 'ze', 'ny', 'ra', 'mi', 'ko', 'ta', 'lu', 'da', 'qui', 'vo', 'ax', 'ex', 'io'];

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const clean = (s: string) => s.trim().toLowerCase().replace(/[^a-z]/g, '');

/** Drop interior vowels for a modern, terse look (keeps the first letter). */
function dropVowels(w: string): string {
  return w.replace(/[aeiou]/g, (m, i) => (i === 0 ? m : ''));
}

/** Playful alternate spelling: c→k, s→z, x→ex, doubled trailing consonant, etc. */
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
  if (out === w) out = w.endsWith('y') ? w.slice(0, -1) + 'i' : w + w.slice(-1); // guarantee a change
  return out;
}

/** One brandable coinage: keyword fused with a prefix, suffix, or syllable. */
function brandable(kw: string, r: Randomness): string {
  const roll = randInt(0, r === 0 ? 1 : 3);
  if (roll === 0) return cap(kw) + pick(BRAND_SUFFIX);
  if (roll === 1) return cap(pick(PREFIX)) + kw;
  if (roll === 2) {
    const nv = dropVowels(kw);
    return cap(nv.length >= 3 ? nv : kw) + pick(SUFFIX);
  }
  // High-randomness invented coinage: syllable + keyword stem + suffix.
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
  // Two plain dictionary words — no coinage — one of them the keyword.
  return randInt(0, 1) ? `${cap(kw)} & ${cap(pick(NOUNS))}` : `${cap(pick(ADJECTIVES))} ${cap(kw)}`;
}

/** Produce a single idea for the requested style (auto rotates through styles). */
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

/**
 * Generate up to `count` distinct name ideas from the given keywords.
 * Falls back to a generic word bank when no usable keyword is supplied.
 */
export function generateNames(opts: GenerateOptions): NameIdea[] {
  const style = opts.style ?? 'auto';
  const randomness = opts.randomness ?? 1;
  const count = Math.max(1, Math.min(100, opts.count ?? 24));

  const kws = opts.keywords.map(clean).filter((k) => k.length >= 2);
  const pool = kws.length ? kws : shuffle([...NOUNS]).slice(0, 4);

  const seen = new Set<string>();
  const out: NameIdea[] = [];
  let guard = count * 40; // bounded attempts so a tiny keyword set can't loop forever
  while (out.length < count && guard-- > 0) {
    const idea = oneIdea(pick(pool), style, randomness);
    const key = idea.name.toLowerCase();
    if (idea.name.length < 2 || seen.has(key)) continue;
    seen.add(key);
    out.push(idea);
  }
  return out;
}

// ---- self-check -------------------------------------------------------------
// Run with:  npx tsx src/lib/naming.ts   (crypto is global in Node >= 22)
export function runSelfCheck(): void {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('naming self-check: ' + m); };

  const a = generateNames({ keywords: ['cloud'], style: 'auto', randomness: 1, count: 24 });
  assert(a.length === 24, `auto count ${a.length} != 24`);
  assert(a.every((x) => x.name.length >= 2), 'empty/too-short name produced');
  assert(new Set(a.map((x) => x.name.toLowerCase())).size === a.length, 'duplicate names');

  // Low randomness brandable should keep the keyword stem recognizable.
  const b = generateNames({ keywords: ['cloud'], style: 'brandable', randomness: 0, count: 30 });
  assert(b.some((x) => /cloud|cld/i.test(x.name)), 'low-randomness lost the keyword');

  // Empty / junk keywords still yield names from the fallback pool.
  const c = generateNames({ keywords: ['', '!!'], style: 'auto', count: 10 });
  assert(c.length === 10, `fallback count ${c.length} != 10`);

  // Tiny keyword + big count must terminate (guard), not hang.
  const d = generateNames({ keywords: ['ai'], style: 'real', count: 100 });
  assert(d.length > 0 && d.length <= 100, `bounded count ${d.length}`);

  // eslint-disable-next-line no-console
  console.log('naming self-check OK:', { auto: a.length, brandable: b.length, sample: a.slice(0, 4).map((x) => x.name) });
}

// Node ESM entry guard — runs the self-check only when executed directly.
if (typeof process !== 'undefined' && process.argv?.[1] && /naming\.ts$/.test(process.argv[1])) {
  runSelfCheck();
}
