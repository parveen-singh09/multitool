# fraction-calculator
verdict: gaps

## Competitors
1. calculator.net/fraction-calculator.html — SIX tools: standard fraction (+ − × ÷), **mixed-numbers calculator (whole + fraction)**, **simplify fractions**, **decimal → fraction**, **fraction → decimal**, and **big-number fraction**. Results shown simplified AND as improper + mixed number.
2. omnicalculator.com/math/fraction — add/subtract/multiply/divide, mixed numbers, negative fractions; shows steps; result as simplified fraction, mixed number, and decimal.
3. mathpapa / calculatorsoup fractions — multi-operation entry (more than two fractions), mixed numbers, step-by-step working, and simplified + decimal output.

## Our current features
- Two fractions, one operation (+ − × ÷), integer numerators/denominators.
- Output reduced to lowest terms (GCD), plus decimal value.
- Guards: zero denominator, divide-by-zero fraction; negative-denominator normalization.
- Client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Mixed-number input & output — competitors all handle "1 1/2". Currently improper only. Show results as a mixed number when |num| > den (e.g. 5/3 → 1 2/3) and optionally allow a whole-number field. High value for the homework/cooking audience the About text targets.
- [ ] Show simplification steps — Omni/MathPapa show the work (common denominator, combine, reduce). Add a short step breakdown; helps the "homework helper" use case that's the tool's stated purpose.
- [ ] Decimal ↔ fraction conversion — calculator.net has dedicated decimal→fraction and fraction→decimal. We show the decimal already; add a decimal→fraction input (e.g. 0.75 → 3/4) via continued-fraction or denominator-power reduction. Modest, popular.
- [ ] More than two fractions (optional) — chained operations (a/b + c/d − e/f). Lower priority; only if it fits the minimal UI.
- [ ] Improper/mixed toggle for the answer — let users choose display form. Trivial once mixed-number logic exists.
