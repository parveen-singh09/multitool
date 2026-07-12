# credit-card-payoff-calculator
verdict: gaps

## Competitors
1. Calculator.net Credit Card — two modes: pay a fixed monthly amount (with %-of-balance presets: interest+1%, 2%-5%) OR pay off within a target timeframe (solve for required payment); balance + APR inputs.
2. Bankrate Credit Card Payoff — balance, APR, monthly payment; month-by-month payoff schedule and a comparison of paying more vs the minimum; charts.
3. NerdWallet Credit Card Payoff — balance, APR, monthly payment or target months; payoff time, total interest, and impact of adding extra to the payment.

## Our current features
- Balance, APR, monthly payment
- Month-by-month simulation; outputs months (+ human-readable years/months), total interest, total paid
- "Never paid off" warning when payment <= monthly interest
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] "Pay off by target date" mode — solve for the required monthly payment given a desired number of months. Competitors all offer this second mode. Standard amortization payment formula, one branch; add a mode toggle mirroring our BMI unit tabs.
- [ ] Payoff schedule table (per-month or per-year balance/interest/principal) — we already run the month loop; capture rows and render a table. Bankrate leads with this.
- [ ] Extra-payment comparison — show months and interest saved vs the minimum/current payment (e.g. "+$50/mo saves 8 months and $420"). High-impact motivator; a second run of the existing loop with an adjusted payment.
