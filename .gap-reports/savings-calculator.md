# savings-calculator
verdict: gaps

## Competitors
1. calculator.net (savings-calculator) — key features: initial deposit, annual & monthly contributions each with optional yearly % increase, interest rate, compound frequency (9 options annually→continuously), years, tax rate; outputs end balance, totals, interest, % breakdown; Accumulation Schedule with a per-year BAR CHART and month/year tables.
2. TheCalculatorSite savings-goal-calculator — key features: three modes (how long to reach goal, how much to save per month, how much you'll have); currency selector; deposit frequency options; compounding frequency daily→yearly.
3. NerdWallet savings calculator — key features: goal-based, monthly contribution solve, growth chart, APY-based interest.

## Our current features
- Goal mode: solves the monthly deposit needed to hit a target by a date (annuity math)
- Starting balance, months to goal, annual interest rate
- Outputs required monthly saving + interest earned
- Monthly compounding
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Compounding-frequency selector — competitors expose annually→daily. We hardcode monthly. Add a frequency select and adjust the rate/period conversion. Note: our "interest earned" currently equals goal − contributed, which is only correct because deposits are monthly; a frequency change needs the FV math generalized.
- [ ] "How much will I have" projection mode — TheCalculatorSite/calculator.net let you go forward from a fixed monthly deposit to an end balance, not just solve for the deposit. Add a mode toggle; reuse the annuity FV we already have.
- [ ] Growth chart / schedule — calculator.net's per-year bar chart and table. Inline SVG or a compact year table from values we iterate. No dependency needed.
- [ ] Goal date reachability warning — if the goal is already met by starting balance + interest (monthly = 0), state it plainly; currently just shows 0 with no explanation.
