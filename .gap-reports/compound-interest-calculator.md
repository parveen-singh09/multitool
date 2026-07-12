# compound-interest-calculator
verdict: gaps

## Competitors
1. Calculator.net Investment — starting amount, contribution (begin/end of period, monthly or yearly), rate, years, compounding; outputs end balance, total contributions, total interest; pie chart of the breakdown; accumulation line graph; annual + monthly schedule tables.
2. Investor.gov Compound Interest (SEC) — initial, monthly contribution, years, rate + a rate-variance band to compare outcomes, compound frequency; results with growth over time.
3. TheCalculatorSite compound interest — currency selector; deposits/withdrawals with timing; annual deposit increase; outputs future value, total interest, effective annual rate (APY), time to double; monthly AND yearly breakdown tables; growth chart.

## Our current features
- Principal, monthly contribution, annual rate, years, compounding frequency (monthly/quarterly/annual/daily)
- Outputs: future value, total contributed, interest earned
- Correct month-by-period simulation loop
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Year-by-year breakdown table — every competitor shows balance/contributions/interest per year. We already run a period loop; capture the balance at each year boundary and render a table. High value, no new inputs.
- [ ] Growth chart — a simple bar/line of balance over the years, layered contributions vs interest. Can be pure CSS/SVG bars from the yearly array (matches the BMI chart approach), keeping it client-side and dependency-free.
- [ ] Contribution timing (beginning vs end of period) — competitors offer this and it changes the result; currently we add the contribution after interest (end-of-period) only. Add a toggle; one branch in the loop.
