# standard-deviation-calculator
verdict: gaps

## Competitors
1. calculator.net/standard-deviation-calculator.html — key features: population/sample toggle, outputs σ, sample s (corrected), variance, mean, sum, **margin of error / standard error of the mean**, confidence interval approximation; static worked-formula reference.
2. omnicalculator.com/statistics/standard-deviation — key features: sample/population toggle, mean/variance/SD, **full step-by-step working** (mean → table of (xᵢ − x̄)² → variance → SD), "steps to show" summary/all setting, share/reload/clear controls.
3. gigacalculator.com/calculators/standard-deviation-calculator.php — key features: variance, mean, **range**, count, **standard error of the mean (SEM)**, supports continuous data and proportions/binomial data.

## Our current features
- Population σ and sample s.
- Variance (population), mean, sum, count.
- Flexible parsing (commas, spaces, newlines) with NaN validation.
- Fully client-side, instant.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Standard error of the mean (SEM = s / √n) — offered by both calculator.net and gigacalculator; a one-line addition given we already compute sample s and n. Add a tile.
- [ ] More descriptive stats: median, min, max, **range** — gigacalculator shows range; these are cheap to derive from a sorted copy of the array and are the most-requested "one place for everything" additions. ~8 lines, add tiles.
- [ ] Sample variance tile — we compute `sampleVar` but only display population variance. Expose both (label current one "population", add "sample"). ~2 lines.
- [ ] Step-by-step working — omnicalculator's headline feature and the top educational draw for this tool. Render the mean, then a collapsible table of each xᵢ, (xᵢ − x̄), (xᵢ − x̄)², then the sum/÷n(÷n−1)/√ steps. All client-side from data we already have.
