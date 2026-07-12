# gcd-lcm-calculator
verdict: gaps

## Competitors
1. calculatorsoup.com/calculators/math/gcf.php (+ /lcm.php) — key features: 2+ numbers, no upper limit; step-by-step work with a method selector — Factoring, Prime Factorization, Euclid's Algorithm (GCF); Listing Multiples, Prime Factorization, Cake/Ladder, Division, GCF-formula, Venn Diagram (LCM). Handles zero cases explicitly.
2. omnicalculator.com/math/lcm — key features: up to 15 numbers; toggle for step-by-step solution; methods = list of multiples, prime factorization, GCF formula, table/ladder; also covers LCM of fractions; Share result / Reload / Clear controls.
3. rapidtables / miniwebtool GCF-LCM — key features: both GCF and LCM in one, comma/space input, some show prime factorization inline.

## Our current features
- One input, unlimited integers (comma/space separated)
- Both GCD (HCF) and LCM at once
- Input validation (whole numbers only)
- Fully client-side, instant

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Show the work / steps — every top competitor shows *how* the answer is reached. At minimum: prime factorization of each number and the shared/union primes that yield GCD and LCM. This is the single biggest ranking differentiator for math tools (students want to see the method). Client-side, no privacy concern — factorize each number, render a small table.
- [ ] Explicit zero-case handling note — competitors state GCF(k,0)=k, GCF(0,0) undefined; our LCM already returns 0 but there is no explanation. Minor; fold into the steps output.
