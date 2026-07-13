

export type Variant = 'european' | 'american' | 'french';

export const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export const WHEEL_EUROPEAN = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

export const DOUBLE_ZERO = 37;
export const WHEEL_AMERICAN = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, DOUBLE_ZERO,
  27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2,
];

export function wheelOrder(v: Variant): number[] {
  return v === 'american' ? WHEEL_AMERICAN : WHEEL_EUROPEAN;
}

export function colorOf(n: number): 'red' | 'black' | 'green' {
  if (n === 0 || n === DOUBLE_ZERO) return 'green';
  return RED.has(n) ? 'red' : 'black';
}

export function label(n: number): string {
  return n === DOUBLE_ZERO ? '00' : String(n);
}

export function payoutFor(count: number): number {
  return Math.round(36 / count - 1);
}

export function betWins(numbers: readonly number[], spun: number): boolean {
  return numbers.includes(spun);
}

declare const process: any;
if (typeof process !== 'undefined' && process.env?.ROULETTE_CHECK) {
  const assert = (c: boolean, m: string) => { if (!c) throw new Error('FAIL: ' + m); };

  assert(payoutFor(1) === 35, 'straight 35:1');
  assert(payoutFor(2) === 17, 'split 17:1');
  assert(payoutFor(3) === 11, 'street 11:1');
  assert(payoutFor(4) === 8, 'corner 8:1');
  assert(payoutFor(6) === 5, 'six-line 5:1');
  assert(payoutFor(12) === 2, 'dozen/column 2:1');
  assert(payoutFor(18) === 1, 'even-money 1:1');

  let reds = 0, blacks = 0;
  for (let n = 1; n <= 36; n++) colorOf(n) === 'red' ? reds++ : blacks++;
  assert(reds === 18 && blacks === 18, 'even red/black split');
  assert(colorOf(0) === 'green' && colorOf(DOUBLE_ZERO) === 'green', 'zeros green');

  assert(new Set(WHEEL_EUROPEAN).size === 37, 'euro wheel = 37 unique');
  assert(new Set(WHEEL_AMERICAN).size === 38, 'american wheel = 38 unique');

  console.log('roulette.ts self-check passed');
}
