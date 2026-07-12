# bmr-calculator
verdict: gaps

## Competitors
1. Calculator.net BMR — US/metric/other units; equation selector (Mifflin-St Jeor, Revised Harris-Benedict, Katch-McArdle w/ body fat); Calories/kilojoules toggle; daily calorie-needs table across 6 activity tiers; save.
2. Omni Calculator BMR — five equations (Mifflin, Harris-Benedict, Revised H-B, Katch-McArdle, Schofield); imperial/metric auto-convert; expandable charts/tips.
3. Bodybuilding.com / verywellfit BMR — Mifflin + Harris-Benedict, metric/imperial, and a follow-on activity multiplier to reach TDEE inline.

## Our current features
- Sex, age, height (cm), weight (kg)
- Mifflin-St Jeor equation only
- Output: BMR calories/day
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Imperial unit toggle — we are metric-only while all three competitors offer ft/in + lb. Our own BMI and body-fat tools already ship a metric/imperial toggle, so reuse that pattern. This is the biggest gap (US traffic can't use it comfortably).
- [ ] Equation selector (add Harris-Benedict, optional Katch-McArdle) — competitors let users pick; Katch-McArdle needs a body-fat % input. Add a dropdown; formulas are one line each. Katch-McArdle can be gated behind an optional body-fat field.
