# debt-payoff-calculator
verdict: gaps

## Competitors
1. undebt.it/debt-snowball-calculator.php — 5 payoff strategies (snowball, avalanche, highest payment, highest monthly interest, debt-to-interest ratio); rollover payments; total interest; **debt-free calendar date**; **month-by-month payment schedule**; **timeline graph**; unlimited rows.
2. calculator.net/debt-payoff-calculator.html — up to 20 debts; avalanche ordering; extra payment as monthly, yearly, AND one-time lump sum tied to a specific month; "fixed total payment" vs shrinking-total toggle; recommended payoff sequence.
3. nerdwallet.com / thebalance debt calculators — snowball vs avalanche side-by-side comparison, payoff date, total interest, and often a chart of balance over time.

## Our current features
- Snowball vs avalanche toggle with method note.
- Multiple debts (add/remove rows): balance, APR, min payment.
- Extra monthly payment; freed minimums roll into next target.
- Outputs: months to payoff, human-readable duration, total interest, total paid; guard/warning when payments can't cover interest.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Debt-free calendar date — we show "X mo" but not the actual month/year. Add today + months via `setMonth`. Trivial and expected.
- [ ] Month-by-month payoff schedule — competitors show a per-month table (balance, interest, principal, payment). We already run a month loop in `calc()`; capture per-month snapshots into an array and render a collapsible table. High value, moderate effort, fully client-side.
- [ ] Snowball vs avalanche side-by-side comparison — instead of toggling, show both results (months + total interest) so users see the savings delta. Run the existing loop twice and display both; strong differentiator.
- [ ] One-time / lump-sum extra payment — calculator.net supports a one-time payment in a chosen month. Add an optional lump-sum + target-month input applied once in the loop.
- [ ] Balance-over-time chart — optional line/area chart of total balance per month from the schedule data. Follow DESIGN.md; SVG, no dependency.
