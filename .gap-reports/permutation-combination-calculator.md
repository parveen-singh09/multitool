# permutation-combination-calculator
verdict: gaps

## Competitors
1. calculator.net/permutation-and-combination-calculator — key features: inputs n and r; outputs nPr and nCr; shows the formula with values plugged in (n!/(n-r)! and n!/(r!(n-r)!)) and the intermediate factorials; explicitly WITHOUT replacement only, but the with-replacement formulas are given in the text for reference.
2. omnicalculator.com combinations / permutations — key features: separate combination and permutation calcs; toggle for with/without repetition (replacement); outputs count; explains formulas; also a "combination with repetition" mode (n+r-1 choose r).
3. gigacalculator / calculatorsoup nPr nCr — key features: nPr, nCr, and with-repetition variants; some list the actual generated combinations/permutations for small n,r; show step-by-step factorial expansion.

## Our current features
- Inputs n, r (non-negative integers, r≤n validation)
- Outputs nPr and nCr with overflow-safe multiply-down; factorials n!, r!, (n-r)!; exponential fallback + approximation notice
- Fully client-side, handles big numbers gracefully

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] With-repetition / with-replacement modes — permutations with repetition n^r, and combinations with repetition C(n+r-1, r). Omni and gigacalculator both offer these; a toggle covering all four cases. Two extra formulas reusing existing nCr.
- [ ] Show the formula with the user's values substituted (like calculator.net) — we show the raw factorials but not "10!/(10-3)! = 720" assembled. Minor: format a string. Improves the "show steps" intent.
- Note: our big-integer/overflow handling already beats calculator.net (which just shows a plain number). Listing actual permutations is a niche extra and skippable — combinatorial explosion makes it impractical past tiny inputs. ponytail: skip the enumeration feature.
