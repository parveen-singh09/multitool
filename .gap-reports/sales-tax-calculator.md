# sales-tax-calculator
verdict: gaps

## Competitors
1. calculator.net (sales-tax-calculator) — key features: three linked fields (before-tax price, tax rate, after-tax price) — enter any two, it computes the third (covers both add and remove in one UI); static reference table of US state sales-tax rates for context.
2. Omni Calculator (finance/sales-tax) — key features: bidirectional add/remove, tax-inclusive vs exclusive, currency-agnostic; educational breakdown.
3. Avalara / TaxJar sales-tax calculators — key features: ZIP-code / state lookup that auto-fills the combined local rate (state + county + city).

## Our current features
- Add-tax and remove-tax modes (tab toggle, relabels the amount field)
- Amount + tax-rate inputs
- Outputs net (pre-tax), tax, gross (with tax)
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Solve-for-rate / any-field-unknown — calculator.net lets any of the three (price, rate, total) be the unknown. We only solve net↔gross given a rate; we can't derive the rate from before+after prices. Add a third computed relationship. Small addition.
- [ ] US state rate reference/preset — calculator.net ships a state-rate table; Avalara auto-fills. A static bundled state→rate list (no API, privacy-safe) that fills the rate field on selection would match without violating client-side design. State base rates only (local rates vary), clearly labeled as base.
- Note: ZIP-level lookup (Avalara/TaxJar) needs an external geo/tax API and is out of scope for a privacy-first client-side tool. Not a gap to close.
