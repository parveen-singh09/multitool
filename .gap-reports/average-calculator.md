# average-calculator
verdict: gaps

## Competitors
1. calculatorsoup.com mean-median-mode — data via commas/spaces/newlines/mixed delimiters (spreadsheet paste). Outputs: mean, median, mode (multi-modal), range, **min, max**, count, sum, **quartiles Q1/Q2/Q3, IQR, outliers** (fence detection). Shareable results + widget.
2. calculator.net/average-calculator — list input; mean plus (in expanded modes) sum, count, and links to standard-deviation tools; also has geometric/weighted variants.
3. omnicalculator average / miniwebtool — mean, sum, count; miniwebtool adds separate SD, variance, geometric mean tools.

## Our current features
- Textarea input, split on commas/spaces/newlines (multi-delimiter already handled well).
- Outputs: mean, median, mode (multi-modal, "none" when all unique), range, sum, count.
- Rounds to 6dp, NaN validation error. Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] **Min and max tiles** — we show range but not the actual smallest/largest values; competitors show both. Already computed internally (`sorted[0]` / `sorted[len-1]`); just surface two tiles.
- [ ] **Standard deviation & variance** — the most common stat missing versus calculatorsoup/miniwebtool for a "grades/measurements" audience. Add population + sample SD/variance (a few lines of client-side math). Highest-value add.
- [ ] **Quartiles / IQR** (optional) — calculatorsoup surfaces Q1/Q2/Q3 + IQR. Worth adding if expanding the stats panel; lower priority than SD.
