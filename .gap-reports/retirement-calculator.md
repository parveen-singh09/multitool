# retirement-calculator
verdict: gaps

## Competitors
1. calculator.net (retirement-calculator) — key features: four sub-tools (how much you need, how to save, how much you can withdraw, how long money lasts); inputs include current/retirement age, life expectancy, income, annual income increase, income needed after retirement (% or $), investment return, inflation rate, other income (social security/pension), current & future savings; models the withdrawal/drawdown phase and monthly retirement income.
2. Omni Calculator (finance/retirement) — key features: accumulation with inflation-adjusted (real vs nominal) results, contribution growth, target nest-egg goal.
3. NerdWallet / SmartAsset retirement calculators — key features: projection line/bar chart over time, inflation adjustment, employer match, expected Social Security income, "on track / shortfall" assessment against a goal.

## Our current features
- Current age, retirement age, current savings, monthly contribution, employer match %, expected annual return
- Month-by-month compounding to a projected balance
- Breakdown: starting balance, your contributions, employer match, investment growth
- Employer match modeled (a genuine plus over calculator.net's main tool)
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Inflation adjustment (real vs nominal) — every serious competitor shows the nest egg in today's dollars. Add an inflation-rate input and display the final balance both nominal and inflation-adjusted. One extra discount factor over the term.
- [ ] Annual contribution increase (%) — salaries/contributions rise; calculator.net and Omni model it. Add an optional "increase contributions X%/yr" field; bump contribPerMonth each 12 months in the loop.
- [ ] Projection chart — competitors plot balance growth over the years. An inline SVG area/bar of balance-by-year (we already iterate months) shows the compounding story. No charting dependency required.
- [ ] Withdrawal / drawdown phase — calculator.net answers "how much can you withdraw" and "how long will it last." Optionally show a sustainable monthly withdrawal (e.g. 4% rule or annuity over life expectancy) using a life-expectancy input.
- [ ] Retirement income target check — show whether the projected balance meets a stated income need; competitors frame results as on-track/shortfall.
