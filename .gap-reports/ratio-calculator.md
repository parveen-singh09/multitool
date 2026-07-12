# ratio-calculator
verdict: gaps

## Competitors
1. CalculatorSoup (calculators/math/ratios.php) — key features: four modes (solve A:B=C:D, solve 3-part A:B:C=D:E:F, scale A:B, scale A:B:C); enter any 3 of 4 to find the missing value; scale up/down by Multiply or Divide factor; simplify via GCD; evaluate equivalent ratios showing which is larger with </> signs; accepts decimals and scientific notation; shows the work.
2. Omni Calculator (math/ratio) — key features: "I would like to…" dropdown with find-equivalent, make-larger, make-smaller, simplify, simplify to 1:n, simplify to n:1; four-field A:B=C:D proportion solver.
3. CalculatorSoup Ratio-to-Fraction / Aspect-Ratio (linked companions) — key features: convert a ratio to fraction and to percent, aspect-ratio solving.

## Our current features
- Simplify a 2-term ratio to lowest whole-number terms (GCD)
- Solve equivalent ratios A:B = C:X for the missing value
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] 3-part ratios (A:B:C) — both leading competitors simplify and scale three-term ratios (recipes, mixes). We only handle two terms. Extend GCD simplify to three values and add a third solve field.
- [ ] Scale up / down by a factor — multiply or divide a ratio by N. Common for recipe/model scaling. Trivial: multiply each term by the factor.
- [ ] Simplify to 1:n and n:1 forms — Omni offers both; useful for odds and gearing. One division each from the simplified pair.
- [ ] Solve for any of the four positions — CalculatorSoup lets the unknown be A, B, C, or D. We hardcode X as the 4th. Let the user leave any field blank.
- [ ] Ratio to fraction / percent — one-line conversions from terms we already have.
