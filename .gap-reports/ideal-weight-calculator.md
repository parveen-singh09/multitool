# ideal-weight-calculator
verdict: gaps

## Competitors
1. calculator.net/ideal-weight-calculator — key features: four formulas (Robinson, Miller, Devine, Hamwi) plus healthy BMI range; US / metric / "other" unit systems; age + gender + height inputs; side-by-side comparison table; body-frame-size guidance; save calculation.
2. omnicalculator.com/health/ideal-weight — key features: seven formulas (Devine, Robinson, Miller, Hamwi, Broca, Lorentz, Peterson); metric/imperial; adjustable custom target BMI (default 22); height-weight band chart (underweight/normal/overweight); inputs autosave.
3. healthline / medicalnewstoday IBW pages — key features: explainer-driven, single Devine/BMI result, imperial + metric, framing around limitations of IBW.

## Our current features
- Three formulas: Devine, Robinson, Hamwi.
- Healthy weight range from BMI 18.5–25.
- Sex + height (cm) inputs.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Miller formula — the other calculators all show a 4th (Miller: male 56.2kg + 1.41kg/in over 5ft, female 53.1kg + 1.36kg/in). Add one more line to the existing formula block; trivial, rounds out the standard set.
- [ ] Imperial unit support (ft/in input, lb output) — we are cm/kg only. Top two both offer US units and this is a US-heavy search term. Add a metric/imperial toggle mirroring the pattern already used in macro-calculator.astro (convert to cm internally, format output in chosen unit).
