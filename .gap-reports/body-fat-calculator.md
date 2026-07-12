# body-fat-calculator
verdict: gaps

## Competitors
1. Calculator.net Body Fat — US/metric units; US Navy method; outputs body fat %, category, body fat mass, lean body mass, ideal body fat for age (Jackson & Pollock), fat to lose to reach ideal, and a second BMI-method estimate; visual gauge; ACE + Jackson-Pollock reference tables.
2. Omni Calculator Body Fat — US Navy + BMI method, metric/imperial, category, and lean/fat mass split; explanatory ranges.
3. Active.com / verywellfit Navy body fat — tape-measure inputs, category chart, and lean mass output; imperial-first.

## Our current features
- Sex, height, neck, waist, hip (female) — metric (cm)
- US Navy circumference formula
- Output: body fat % + ACE category (color-coded)
- Input validation (waist must exceed neck)
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Weight input + fat mass / lean body mass output — competitors all show these. Requires adding a weight field; then fat mass = `weight * bf/100`, lean mass = weight - fat mass. Two lines once weight exists.
- [ ] Imperial unit toggle — we are metric-only; tape-measure users in the US expect inches/lb. Reuse the BMI/creatinine toggle pattern.
- [ ] Ideal body fat for age (Jackson & Pollock) + amount to lose — shows a target and the gap to it, a strong "next step" that Calculator.net leads with. Table lookup by age/sex; then fat-to-lose = current fat mass - target fat mass (needs the weight input above).
