# simple-interest-calculator
verdict: gaps

## Competitors
1. omnicalculator.com/finance/simple-interest — key features: principal, interest rate, term in **years OR months**, outputs total interest + final balance, future value formula F = P(1 + rt) shown, expandable "interest over a chosen period" summary.
2. calculator.net/interest-calculator.html — key features: (positions simple interest inside a broader interest/compound tool) compound frequency selector, tax & inflation adjustment, pie chart breakdown, yearly/monthly accumulation schedule. Overkill for simple interest but sets the bar for "shows the schedule."
3. gigacalculator.com/calculators/simple-interest-calculator.php — key features: principal, rate, time; formula display; typically a currency-agnostic input and a worked step-by-step of I = P·R·T.

## Our current features
- Principal, annual rate (%), time in years.
- Outputs interest and total amount.
- Formula I = P × R × T shown in About.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Time unit toggle (years / months / days) — competitors let you enter sub-year terms directly; today a 6-month loan requires entering 0.5. Add a `<select>` next to the time field and convert to years before the I = P·R·T math (months/12, days/365). ~10 lines.
- [ ] Optional per-period breakdown (interest per year/month) — matches the "interest over a period" affordance on omni/calculator.net. Render a small table splitting total interest evenly across the term periods. Client-side, no deps.
- [ ] Show the plugged-in formula with live values (e.g. `1500 = 10000 × 0.05 × 3`) — cheap trust/education win that gigacalculator/omni both do. One extra line in the results panel.
