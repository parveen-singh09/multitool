# investment-calculator
verdict: gaps

## Competitors
1. calculator.net/investment-calculator — key features: solve for any variable (end amount, return rate, starting amount, contribution, length); compound-frequency dropdown; contribute at beginning/end of month or year; donut breakdown chart; per-year accumulation bar chart; monthly + annual schedule tables; print/save.
2. thecalculatorsite.com compound interest calculator — key features: currency selector; flexible contribution + withdrawal frequencies; annual contribution increase (%/$); effective vs nominal rate; time-to-double; monthly + yearly breakdown tables; growth chart.
3. smartasset.com/investing/investment-calculator — key features: contribution frequency dropdown (weekly→annually); "Investment Growth Over Time" chart; breakdown into starting/contributions/interest.

## Our current features
- Starting amount + monthly contribution + annual return + years.
- Monthly compounding.
- Outputs: future value, total invested, total return.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Year-by-year breakdown table (year → contributions, interest, balance) — all three show growth over time; we show only the endpoint. We already loop month-by-month in calc(); capture end-of-year rows and render a table like one-rep-max does.
- [ ] Growth chart (balance over time, ideally split invested vs interest) — the visual is the main differentiator on every competitor. A lightweight inline SVG/area chart from the yearly array, no chart library needed.
- [ ] Contribution frequency option (monthly vs annual, begin/end of period) — competitors let users pick; we hardcode end-of-month. Add a small select and adjust the loop.
