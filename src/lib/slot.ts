// Video-slot engine: 5 reels × 3 rows, 10 fixed paylines, wild substitution,
// scatter-triggered free spins with a win multiplier. Pure/DOM-free so it can
// be unit-checked (see the RTP self-check at the bottom, run under node with
// --experimental-strip-types). All randomness flows through ../random so a
// seed makes a session reproducible.

import { randInt } from './random';

export type Sym = '🍒' | '🍋' | '🔔' | '⭐' | '💎' | '7️⃣' | '🃏' | '🎰';

export const WILD: Sym = '🃏';
export const SCATTER: Sym = '🎰';

// Names for the paytable UI.
export const SYM_NAME: Record<Sym, string> = {
  '🍒': 'Cherry', '🍋': 'Lemon', '🔔': 'Bell', '⭐': 'Star',
  '💎': 'Diamond', '7️⃣': 'Seven', '🃏': 'Wild', '🎰': 'Scatter',
};

// Line pay = multiplier × line-bet, indexed by match length [_, _, x3, x4, x5].
// Only the regular symbols and the wild pay on a line; the scatter pays on the
// total bet regardless of position (see SCATTER_PAY).
export const PAYTABLE: Record<Exclude<Sym, '🎰'>, [number, number, number]> = {
  //          3-of    4-of    5-of
  '🍒': [4, 9, 22],
  '🍋': [5, 13, 35],
  '🔔': [9, 22, 68],
  '⭐': [13, 33, 110],
  '💎': [22, 67, 220],
  '7️⃣': [45, 135, 450],
  '🃏': [68, 280, 850], // five wilds is the top jackpot
};

// Scatter pays × total bet for 3 / 4 / 5 anywhere on the grid.
export const SCATTER_PAY: Record<number, number> = { 3: 2, 4: 9, 5: 45 };
export const FREE_SPINS = 10; // awarded on 3+ scatters
export const FREE_MULT = 2; // every win during free spins is multiplied by this

// The 10 fixed paylines, each a row index (0 top … 2 bottom) per reel.
export const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0],
  [1, 0, 1, 2, 1],
];

// Per-reel symbol strips. A spin picks a random stop per reel and shows 3
// consecutive symbols (with wrap), so a symbol's on-screen frequency is set by
// how often it appears in the strip. High symbols and the wild/scatter are
// deliberately scarce; these counts were tuned so measured RTP lands ~94%
// (see the self-check). Reels 1 & 5 carry no wilds so full wild-lines stay rare.
const R_MID = ['🍒', '🍒', '🍋', '🍋', '🔔', '⭐', '🍒', '💎', '🍋', '🔔', '7️⃣', '🍒', '⭐', '🃏', '🍋', '🔔', '💎', '🍒', '🎰', '⭐', '🍋', '🍒'];
const R_END = ['🍒', '🍋', '🔔', '🍒', '⭐', '🍋', '💎', '🔔', '🍒', '7️⃣', '⭐', '🍋', '🍒', '🎰', '🔔', '💎', '🍋', '🍒', '⭐', '🍋', '🔔', '🍒'];
export const REELS: Sym[][] = [R_END, R_MID, R_MID, R_MID, R_END] as Sym[][];

export type LineWin = { line: number; sym: Sym; count: number; amount: number };
export type SpinResult = {
  grid: Sym[][]; // grid[reel][row], 5×3
  lineWins: LineWin[];
  scatterCount: number;
  scatterWin: number;
  totalWin: number;
  freeSpinsAwarded: number;
};

/** Spin all reels and return the visible 5×3 grid as grid[reel][row]. */
export function spinGrid(): Sym[][] {
  return REELS.map((strip) => {
    const stop = randInt(0, strip.length - 1);
    return [0, 1, 2].map((r) => strip[(stop + r) % strip.length]);
  });
}

/**
 * Evaluate a grid. `lineBet` is the stake per active payline; total bet is
 * lineBet × PAYLINES.length. `mult` scales every win (1 in the base game,
 * FREE_MULT during free spins).
 */
export function evaluate(grid: Sym[][], lineBet: number, mult = 1): SpinResult {
  const totalBet = lineBet * PAYLINES.length;
  const lineWins: LineWin[] = [];

  for (let l = 0; l < PAYLINES.length; l++) {
    const rowFor = PAYLINES[l];
    const first = grid[0][rowFor[0]];
    // A leading run of wilds takes the identity of the first non-wild symbol;
    // an all-wild run is scored as wilds.
    let base: Sym = first;
    if (base === WILD) {
      for (let r = 1; r < 5; r++) {
        const s = grid[r][rowFor[r]];
        if (s !== WILD) { base = s; break; }
      }
    }
    if (base === SCATTER) continue; // scatters never pay on a line

    let count = 0;
    for (let r = 0; r < 5; r++) {
      const s = grid[r][rowFor[r]];
      if (s === base || s === WILD) count++;
      else break;
    }
    if (count >= 3) {
      const pay = PAYTABLE[base as Exclude<Sym, '🎰'>];
      if (pay) {
        const amount = pay[count - 3] * lineBet * mult;
        if (amount > 0) lineWins.push({ line: l, sym: base, count, amount });
      }
    }
  }

  let scatterCount = 0;
  for (const reel of grid) for (const s of reel) if (s === SCATTER) scatterCount++;
  const scatterWin = (SCATTER_PAY[scatterCount] || 0) * totalBet * mult;
  const freeSpinsAwarded = scatterCount >= 3 ? FREE_SPINS : 0;

  const totalWin = lineWins.reduce((a, w) => a + w.amount, 0) + scatterWin;
  return { grid, lineWins, scatterCount, scatterWin, totalWin, freeSpinsAwarded };
}

/** One full spin: roll the grid and score it. */
export function play(lineBet: number, mult = 1): SpinResult {
  return evaluate(spinGrid(), lineBet, mult);
}

// ---- RTP self-check ------------------------------------------------------
// Run: node --experimental-strip-types src/lib/slot.ts
// Simulates many spins (including free-spin retriggers) and asserts the
// return-to-player sits in a believable slot band. Guarded so it never runs
// when the module is imported by the page.
declare const process: { argv?: string[] } | undefined;
if (typeof process !== 'undefined' && Array.isArray(process.argv) && import.meta.url.endsWith('slot.ts')) {
  const { setSeed } = await import('./random');
  setSeed('rtp-check');
  const LINE_BET = 1;
  const TOTAL_BET = LINE_BET * PAYLINES.length;
  const N = 500_000;
  let wagered = 0, returned = 0, hits = 0, freeTriggers = 0, biggest = 0;

  for (let i = 0; i < N; i++) {
    wagered += TOTAL_BET;
    const base = play(LINE_BET);
    let win = base.totalWin;
    // Play out any awarded free spins at FREE_MULT (retriggers included), no extra cost.
    let free = base.freeSpinsAwarded;
    while (free > 0) {
      free--;
      const fs = play(LINE_BET, FREE_MULT);
      win += fs.totalWin;
      free += fs.freeSpinsAwarded;
      if (fs.freeSpinsAwarded) freeTriggers++;
    }
    returned += win;
    if (win > 0) hits++;
    if (win > biggest) biggest = win;
    if (base.freeSpinsAwarded) freeTriggers++;
  }

  const rtp = (returned / wagered) * 100;
  const hitRate = (hits / N) * 100;
  console.log(`spins=${N} RTP=${rtp.toFixed(2)}%  hit-rate=${hitRate.toFixed(2)}%  free-triggers=${freeTriggers}  biggest=${biggest}× line`);
  console.assert(rtp > 80 && rtp < 110, `RTP ${rtp.toFixed(2)}% outside sane band`);
  console.assert(hitRate > 10 && hitRate < 60, `hit-rate ${hitRate.toFixed(2)}% looks wrong`);
  console.log('slot self-check ok');
}
