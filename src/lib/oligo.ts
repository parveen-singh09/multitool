
export type SeqType = 'dna' | 'rna';

export interface Conditions {
  oligoNM: number;
  naMM: number;
  mgMM: number;
  dntpMM: number;
}

export const DEFAULT_CONDITIONS: Conditions = { oligoNM: 250, naMM: 50, mgMM: 0, dntpMM: 0 };

const NN_DH: Record<string, number> = {
  AA: -7.6, TT: -7.6, AT: -7.2, TA: -7.2, CA: -8.5, TG: -8.5,
  GT: -8.4, AC: -8.4, CT: -7.8, AG: -7.8, GA: -8.2, TC: -8.2,
  CG: -10.6, GC: -9.8, GG: -8.0, CC: -8.0,
};
const NN_DS: Record<string, number> = {
  AA: -21.3, TT: -21.3, AT: -20.4, TA: -21.3, CA: -22.7, TG: -22.7,
  GT: -22.4, AC: -22.4, CT: -21.0, AG: -21.0, GA: -22.2, TC: -22.2,
  CG: -27.2, GC: -24.4, GG: -19.9, CC: -19.9,
};
const INIT_GC = { dh: 0.1, ds: -2.8 };
const INIT_AT = { dh: 2.3, ds: 4.1 };

const R = 1.987;

const DNA_MW: Record<string, number> = { A: 313.21, T: 304.2, C: 289.18, G: 329.21 };
const RNA_MW: Record<string, number> = { A: 329.21, U: 306.17, C: 305.18, G: 345.21 };

const EXT_MONO: Record<string, number> = { A: 15400, C: 7400, G: 11500, T: 8700, U: 9900 };
const EXT_NN: Record<string, number> = {
  AA: 27400, AC: 21200, AG: 25000, AT: 22800,
  CA: 21200, CC: 14600, CG: 18000, CT: 15200,
  GA: 25200, GC: 17600, GG: 21600, GT: 20000,
  TA: 23400, TC: 16200, TG: 19000, TT: 16800,
  AU: 24000, UA: 24600, CU: 13600, UC: 14200, GU: 21200, UG: 19200, UU: 19600,
};

const COMP_DNA: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C' };
const COMP_RNA: Record<string, string> = { A: 'U', U: 'A', C: 'G', G: 'C' };

export function clean(seq: string): string {
  return seq.toUpperCase().replace(/[^A-Z]/g, '');
}

export function validate(seq: string, type: SeqType): { ok: boolean; bad: string[] } {
  const valid = type === 'rna' ? 'ACGU' : 'ACGT';
  const bad = [...new Set([...seq].filter((c) => !valid.includes(c)))];
  return { ok: bad.length === 0, bad };
}

export function counts(seq: string): Record<string, number> {
  const c: Record<string, number> = { A: 0, C: 0, G: 0, T: 0, U: 0 };
  for (const ch of seq) c[ch]++;
  return c;
}

export function gcFraction(seq: string): number {
  if (!seq.length) return 0;
  let gc = 0;
  for (const c of seq) if (c === 'G' || c === 'C') gc++;
  return gc / seq.length;
}

export function complement(seq: string, type: SeqType): string {
  const m = type === 'rna' ? COMP_RNA : COMP_DNA;
  return [...seq].map((c) => m[c] ?? 'N').join('');
}

export function reverseComplement(seq: string, type: SeqType): string {
  return [...complement(seq, type)].reverse().join('');
}

function toDNA(seq: string): string {
  return seq.replace(/U/g, 'T');
}

export function molecularWeight(seq: string, type: SeqType): number {
  const table = type === 'rna' ? RNA_MW : DNA_MW;
  let mw = 0;
  for (const c of seq) mw += table[c] ?? 0;
  mw -= 61.96;
  return mw;
}

export function extinctionCoefficient(seq: string, type: SeqType): number {
  if (seq.length === 0) return 0;
  if (seq.length === 1) return EXT_MONO[seq] ?? 0;
  let ext = 0;
  for (let i = 0; i < seq.length - 1; i++) {
    const d = seq[i] + seq[i + 1];
    ext += EXT_NN[d] ?? (EXT_MONO[seq[i]] + EXT_MONO[seq[i + 1]]);
  }
  for (let i = 1; i < seq.length - 1; i++) ext -= EXT_MONO[seq[i]] ?? 0;
  return ext;
}

function nnThermo(dnaSeq: string): { dh: number; ds: number } {
  let dh = 0;
  let ds = 0;
  for (let i = 0; i < dnaSeq.length - 1; i++) {
    const nn = dnaSeq[i] + dnaSeq[i + 1];
    dh += NN_DH[nn] ?? 0;
    ds += NN_DS[nn] ?? 0;
  }
  for (const end of [dnaSeq[0], dnaSeq[dnaSeq.length - 1]]) {
    const init = end === 'G' || end === 'C' ? INIT_GC : INIT_AT;
    dh += init.dh;
    ds += init.ds;
  }
  return { dh, ds };
}

function isSelfComplementary(dnaSeq: string): boolean {
  const rc = [...dnaSeq].map((c) => COMP_DNA[c] ?? 'N').reverse().join('');
  return rc === dnaSeq;
}

export interface TmResult {
  nn: number;
  wallace: number;
  gcRule: number;
  dh: number;
  ds: number;
  dg37: number;
}

function saltCorrectedTm(tm1M_K: number, fGC: number, N: number, cond: Conditions): number {
  const na = cond.naMM / 1000;
  const freeMg = Math.max(0, cond.mgMM - cond.dntpMM) / 1000;
  const mon = na;

  let invTm = 1 / tm1M_K;

  if (freeMg <= 0) {
    const lnNa = Math.log(mon > 0 ? mon : 1e-6);
    invTm = 1 / tm1M_K + (4.29 * fGC - 3.95) * 1e-5 * lnNa + 9.40e-6 * lnNa * lnNa;
  } else {
    const lnMg = Math.log(freeMg);
    let a = 3.92e-5, d = 1.42e-5, g = 8.31e-5;
    if (mon > 0) {
      const ratio = Math.sqrt(freeMg) / mon;
      const lnNa = Math.log(mon);
      if (ratio < 0.22) {
        invTm = 1 / tm1M_K + (4.29 * fGC - 3.95) * 1e-5 * lnNa + 9.40e-6 * lnNa * lnNa;
        return 1 / invTm - 273.15;
      }
      if (ratio < 6.0) {
        a = 3.92e-5 * (0.843 - 0.352 * Math.sqrt(mon) * lnNa);
        d = 1.42e-5 * (1.279 - 4.03e-3 * lnNa - 8.03e-3 * lnNa * lnNa);
        g = 8.31e-5 * (0.486 - 0.258 * lnNa + 5.25e-3 * lnNa * lnNa * lnNa);
      }
    }
    invTm =
      1 / tm1M_K +
      a +
      -9.11e-6 * lnMg +
      fGC * (6.26e-5 + d * lnMg) +
      (1 / (2 * (N - 1))) * (-4.82e-4 + 5.25e-4 * lnMg + g * lnMg * lnMg);
  }
  return 1 / invTm - 273.15;
}

export function meltingTemp(seq: string, type: SeqType, cond: Conditions): TmResult {
  const dnaSeq = toDNA(seq);
  const N = dnaSeq.length;
  const fGC = gcFraction(dnaSeq);
  const gc = Math.round(fGC * N);
  const at = N - gc;

  const wallace = 2 * at + 4 * gc;
  const gcRule = N > 0 ? 64.9 + 41 * (gc - 16.4) / N : 0;

  if (N < 2) {
    return { nn: NaN, wallace, gcRule, dh: 0, ds: 0, dg37: 0 };
  }

  const { dh, ds } = nnThermo(dnaSeq);
  const selfComp = isSelfComplementary(dnaSeq);
  const ct = cond.oligoNM * 1e-9;
  const x = selfComp ? 1 : 4;
  const tm1M_K = (dh * 1000) / (ds + R * Math.log(ct / x));
  const nn = saltCorrectedTm(tm1M_K, fGC, N, cond);
  const dg37 = dh - (310.15 * ds) / 1000;

  return { nn, wallace, gcRule, dh, ds, dg37 };
}


function stackDG(nn: string): number {
  const dh = NN_DH[nn];
  const ds = NN_DS[nn];
  if (dh === undefined) return 0;
  return dh - (310.15 * ds) / 1000;
}

export interface Alignment {
  offset: number;
  matches: number;
  runLen: number;
  dg: number;
  top: string;
  pair: string;
  bot: string;
}

function pairs(a: string, b: string, type: SeqType): boolean {
  const m = type === 'rna' ? COMP_RNA : COMP_DNA;
  return m[a] === b;
}

function bestAlignment(top: string, bottomRev: string, type: SeqType): Alignment | null {
  let best: Alignment | null = null;
  const n = top.length;
  const m = bottomRev.length;
  for (let o = -(m - 1); o < n; o++) {
    let matches = 0;
    let run = 0;
    let bestRun = 0;
    let dg = 0;
    let prevMatched = false;
    const topCells: string[] = [];
    const botCells: string[] = [];
    const pairCells: string[] = [];
    const lo = Math.min(0, o);
    const hi = Math.max(n, m + o);
    for (let i = lo; i < hi; i++) {
      const tc = i >= 0 && i < n ? top[i] : ' ';
      const bj = i - o;
      const bc = bj >= 0 && bj < m ? bottomRev[bj] : ' ';
      const matched = tc !== ' ' && bc !== ' ' && pairs(tc, bc, type);
      if (matched) {
        matches++;
        run++;
        bestRun = Math.max(bestRun, run);
        if (prevMatched) {
          dg += stackDG(toDNA(top[i - 1] + top[i]));
        }
        prevMatched = true;
      } else {
        run = 0;
        prevMatched = false;
      }
      topCells.push(tc);
      botCells.push(bc);
      pairCells.push(matched ? '|' : ' ');
    }
    if (matches === 0 || bestRun < 2) continue;
    const cand: Alignment = {
      offset: o,
      matches,
      runLen: bestRun,
      dg,
      top: topCells.join(''),
      pair: pairCells.join(''),
      bot: botCells.join(''),
    };
    if (!best || cand.dg < best.dg || (cand.dg === best.dg && cand.matches > best.matches)) {
      best = cand;
    }
  }
  return best;
}

export function selfDimer(seq: string, type: SeqType): Alignment | null {
  const rev = [...seq].reverse().join('');
  return bestAlignment(seq, rev, type);
}

export function heteroDimer(a: string, b: string, type: SeqType): Alignment | null {
  const bRev = [...b].reverse().join('');
  return bestAlignment(a, bRev, type);
}

export interface Hairpin {
  loop: number;
  stem: number;
  dg: number;
  start5: number;
  start3: number;
  render: string[];
}

export function hairpin(seq: string, type: SeqType, minStem = 3, minLoop = 3): Hairpin | null {
  const n = seq.length;
  let best: Hairpin | null = null;
  for (let i = 0; i < n; i++) {
    for (let j = n - 1; j > i; j--) {
      let stem = 0;
      let dg = 0;
      while (
        i + stem < j - stem &&
        pairs(seq[i + stem], seq[j - stem], type)
      ) {
        if (stem > 0) dg += stackDG(toDNA(seq[i + stem - 1] + seq[i + stem]));
        stem++;
      }
      const loop = (j - stem + 1) - (i + stem);
      if (stem >= minStem && loop >= minLoop) {
        const loopPenalty = 3.0 + 0.1 * Math.max(0, loop - 3);
        const total = dg + loopPenalty;
        if (!best || total < best.dg) {
          best = {
            loop,
            stem,
            dg: total,
            start5: i,
            start3: j,
            render: renderHairpin(seq, i, j, stem, type),
          };
        }
      }
    }
  }
  return best;
}

function renderHairpin(seq: string, i: number, j: number, stem: number, type: SeqType): string[] {
  const fivePrime = seq.slice(0, i + stem);
  const loopSeq = seq.slice(i + stem, j - stem + 1);
  const threePrime = [...seq.slice(j - stem + 1)].reverse().join('');
  const pairLine =
    ' '.repeat(Math.max(0, fivePrime.length - stem)) + '|'.repeat(stem);
  const loopStr = loopSeq.length ? `  ${loopSeq.split('').join('')}` : '';
  return [
    `5' ${fivePrime}${loopStr ? '  ↴' : ''}`,
    `   ${pairLine}${loopSeq.length ? '   ' + loopSeq : ''}`,
    `3' ${threePrime}${loopStr ? '  ↳' : ''}`,
  ];
}

export function demo(): void {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('oligo demo failed: ' + m); };

  assert(reverseComplement('ATGC', 'dna') === 'GCAT', 'revcomp');
  assert(complement('AUGC', 'rna') === 'UACG', 'rna comp');

  assert(Math.abs(gcFraction('GGCC') - 1) < 1e-9, 'gc all');
  assert(Math.abs(gcFraction('ATAT') - 0) < 1e-9, 'gc none');

  assert(validate('ATGC', 'dna').ok, 'valid dna');
  assert(!validate('ATGU', 'dna').ok, 'U in dna invalid');

  const tm = meltingTemp('GTAAAACGACGGCCAGT', 'dna', { oligoNM: 250, naMM: 50, mgMM: 0, dntpMM: 0 });
  assert(tm.nn > 40 && tm.nn < 75, `Tm plausible got ${tm.nn}`);
  assert(tm.dh < 0 && tm.ds < 0, 'dH/dS negative');

  const tmLow = meltingTemp('GTAAAACGACGGCCAGT', 'dna', { oligoNM: 250, naMM: 10, mgMM: 0, dntpMM: 0 }).nn;
  const tmHigh = meltingTemp('GTAAAACGACGGCCAGT', 'dna', { oligoNM: 250, naMM: 500, mgMM: 0, dntpMM: 0 }).nn;
  assert(tmHigh > tmLow, 'higher Na raises Tm');

  const tmMg = meltingTemp('GTAAAACGACGGCCAGT', 'dna', { oligoNM: 250, naMM: 50, mgMM: 3, dntpMM: 0 }).nn;
  assert(tmMg > tmLow, 'Mg contributes');

  assert(extinctionCoefficient('ATGCATGC', 'dna') > extinctionCoefficient('ATGC', 'dna'), 'ext scales');

  const sd = selfDimer('GAATTCGAATTC', 'dna');
  assert(sd !== null && sd.matches >= 4, 'self-dimer found');

  const hp = hairpin('CCCCAAAAAGGGG', 'dna');
  assert(hp !== null && hp.stem >= 3, 'hairpin found');

  console.log('oligo demo OK', {
    tm: tm.nn.toFixed(1),
    dg37: tm.dg37.toFixed(1),
    selfDimerDg: sd?.dg.toFixed(1),
    hairpinDg: hp?.dg.toFixed(1),
  });
}
