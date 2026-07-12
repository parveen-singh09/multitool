# water-intake-calculator
verdict: gaps

## Competitors
1. gigacalculator.com/calculators/water-intake-calculator.php — key features: age, gender, height, weight, **activity level (5 tiers)**, **pregnancy/lactation status**, imperial/metric toggle; outputs cups, ounces AND liters/ml; separates total water vs fluids-to-drink; TDEE-based method. (Assumes moderate climate, no climate input.)
2. omnicalculator.com/health/water-intake — key features: child/adult, gender, age → Adequate Intake (IOM 2005) table; outputs total water incl. food AND beverage-only in L and cups; metric + US units. (No activity/climate input.)
3. calculator.net/water-intake-calculator.html — key features: weight, activity, climate/temperature and gender-based estimate; outputs daily volume; reference guidance. (Broad input set.)

## Our current features
- Weight (kg/lb toggle), exercise minutes/day, climate (temperate/warm/hot).
- Output in litres and approx cups (250 ml).
- ~35 ml/kg baseline + exercise + climate multiplier.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Gender input — gigacalculator, omni and calculator.net all use sex; male/female baselines differ (Adequate Intake ~3.7L vs 2.7L). Add a `<select>` adjusting the baseline. ~5 lines.
- [ ] Pregnancy / lactation status — gigacalculator adds ~0.3L (pregnant) / ~0.7L (lactating). Optional `<select>` with additive adjustment. ~5 lines.
- [ ] Output in more units (fl oz, and separate cups already present) — competitors show oz + cups + L; add a fl-oz line (litres × 33.814). ~2 lines.
- [ ] Age input/bracket — omni & giga factor age (children need less). Optional; a coarse child/adult adjustment covers most value. Lower priority.
- [ ] Note: we already BEAT omni/calculator.net-lite by combining weight + exercise + climate. The gaps are gender and pregnancy, which are the two adjustments a majority of competitors include and we don't.
