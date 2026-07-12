# loan-calculator
verdict: gaps

## Competitors
1. calculator.net/loan-calculator — key features: three modes (amortized, deferred lump-sum, zero-coupon bond); compound + payback frequency dropdowns; amortization table; principal-vs-interest pie chart; save.
2. omnicalculator.com/finance/loan — key features: nominal/APR/both rate modes; payment frequency (weekly→quarterly); origination/prepaid/loaned fees rolled into loan; total finance charge; effective APR; percentage breakdown chart.
3. bankrate.com loan calculator — key features: amortization schedule, payment date, total interest, extra-payment scenarios, printable schedule.

## Our current features
- Amortized loan: amount, annual rate, term (years).
- Outputs: monthly payment, total interest, total repayment.
- Handles 0% rate.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Amortization schedule (per-period principal/interest/balance) — the near-universal competitor feature we lack. We already compute EMI; build the table by iterating months (balance × r = interest, payment − interest = principal). Render collapsible table like one-rep-max's percentage list. Optionally aggregate to yearly rows to keep it short.
- [ ] Principal-vs-interest split visual — a simple two-segment bar or pie from the numbers we already have (P vs total interest). Inline SVG, no dependency.
- [ ] Extra monthly payment input (optional) — bankrate/others let users see interest saved and earlier payoff. Add one optional field; recompute payoff by reducing balance faster in the amortization loop. Only worthwhile once the schedule loop exists.
