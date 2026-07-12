# macro-calculator
verdict: gaps

## Competitors
1. calculator.net/macro-calculator — key features: Mifflin-St Jeor AND Katch-McArdle (with body-fat input); 7 activity levels; 7 goal options (mild/normal/extreme loss & gain at defined lb/kg-per-week rates); US/metric/other units; food macro reference table.
2. omnicalculator.com/health/macro (IIFYM) — key features: Mifflin-St Jeor; 6 activity multipliers incl. professional athlete; goal with target weight + diet pace; warns if intake < BMR; week-by-week plan; weight-change + weekly-calorie graphs.
3. bodybuilding.com / myprotein macro calculators — key features: diet-type presets (balanced, low-carb/keto, high-protein), goal-based macro splits, gram + % display.

## Our current features
- Mifflin-St Jeor BMR, 5 activity levels, 3 goals (−20% / 0 / +15%).
- Metric/imperial toggle.
- Fixed 30/40/30 protein/carb/fat split; outputs calories, TDEE, BMR, grams.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Selectable macro-split presets (balanced 30/40/30, high-protein, low-carb/keto, custom) — we hardcode one split; competitors let users pick a diet style. Add a select that sets the three ratio constants (and re-labels the output cards). Small, high-value.
- [ ] Katch-McArdle formula via optional body-fat % — calculator.net's key accuracy differentiator for leaner users. Add optional body-fat input; when present, BMR = 370 + 21.6 × lean-mass-kg. One branch in calc().
- [ ] Goal options expressed as concrete rates (e.g. mild/normal loss at 0.25/0.5 kg per week) — our ±% is vaguer than the rate-based goals users expect. Optional refinement; map goals to calorie deltas.
