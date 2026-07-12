# biological-age-calculator
verdict: gaps

## Competitors
1. Blue Zones Vitality Compass (bluezones.com) — lifestyle questionnaire (diet, exercise, stress, purpose, social); outputs estimated life expectancy and "healthy life expectancy," plus prioritized tips to add years.
2. Omni Calculator — Biological Age (omnicalculator.com/health/biological-age) — lifestyle + health-metric inputs; outputs biological age vs chronological and explanatory guidance on which factors moved the number.
3. Sharecare RealAge (sharecare.com) — large questionnaire across diet, exercise, stress, medical history, family history and health metrics (BP, cholesterol); outputs a "RealAge" and personalized action plan of what to change.

## Our current features
- 10 lifestyle factors (exercise, sleep, diet, smoking, alcohol, stress, BMI, social, resting HR, family longevity)
- Weighted delta model bounded to a plausible swing (-15 to +18)
- Output: estimated biological age + "X years younger/older" delta with color cue
- Fully client-side, no account required

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Per-factor impact breakdown — after computing, show which answers pushed the age up vs down (e.g. "Smoking +6, Exercise -1.5") so the result is actionable rather than a black-box number. Trivial to add: we already have the per-factor values in the loop; render them into a small list sorted by magnitude.
- [ ] Improvement tips tied to worst factors — surface 2-3 concrete suggestions from the highest-scoring (worst) inputs. This is what every competitor leads with and is the main reason users share/return. Static tip strings keyed to each `<select>` id, shown for options above a threshold.
