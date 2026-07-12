# calorie-calculator
verdict: gaps

## Competitors
1. Calculator.net Calorie — US/metric units; 3 equation options (Mifflin, Revised H-B, Katch-McArdle); 6 activity tiers; TDEE + weight loss/gain targets; two zigzag/calorie-cycling weekly schedules; Calories/kJ toggle; food-energy converter; reference tables.
2. Omni Calculator TDEE — metric/imperial, equation choice, activity multipliers, maintenance + goal calories, and macro guidance link.
3. Verywellfit / healthline calorie — metric/imperial, activity levels, maintenance and deficit/surplus targets, and macro split suggestions.

## Our current features
- Sex, age, height (cm), weight (kg), 5 activity levels
- Mifflin-St Jeor BMR -> TDEE
- Output: TDEE + four preset targets (mild loss -250, loss -500, mild gain +250, gain +500)
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Imperial unit toggle — metric-only vs all competitors offering ft/in + lb. Reuse existing BMI/creatinine toggle pattern. Biggest gap for US audience.
- [ ] Show the weekly rate next to each target (e.g. "-500 = ~0.45 kg / 1 lb per week") — competitors tie the calorie delta to expected weight change, which makes the presets meaningful. One line using the 3500 kcal/lb (or 7700 kcal/kg) rule under each tile.
- [ ] Macro split for the selected target (protein/carb/fat grams) — common competitor add-on and a natural next step. A default ratio (e.g. 30/40/30) applied to the chosen calorie number; a few lines, no new inputs required.
