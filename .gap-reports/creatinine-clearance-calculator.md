# creatinine-clearance-calculator
verdict: gaps

## Competitors
1. MDCalc Creatinine Clearance / Cockcroft-Gault (mdcalc.com) — sex, age, weight, creatinine (µmol/L), optional height; uses height to compute BMI and give a modified estimate/range; dosing guidance, KDIGO staging, evidence tabs.
2. Calculator.net Creatinine Clearance — Cockcroft-Gault with US/SI units; standard output plus reference ranges.
3. QxMD / MedCalc Cockcroft-Gault — sex/age/weight/creatinine, SI + conventional units, and often an ideal/adjusted body weight option for obese patients plus BSA normalization to mL/min/1.73m².

## Our current features
- Metric (mg/dL, kg) and SI (µmol/L) unit toggle with value conversion on switch
- Sex, age, weight, serum creatinine
- Cockcroft-Gault equation, x0.85 for female
- Output: CrCl mL/min + rough CKD stage (color-coded)
- Strong educational disclaimer, fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Body-weight selection (actual / ideal / adjusted) — Cockcroft-Gault is notoriously inaccurate in obese and underweight patients; clinical tools let you pick ideal (Devine) or adjusted body weight. Needs a height input to compute IBW, then a small dropdown. This is the most clinically meaningful gap.
- [ ] BSA-normalized result (mL/min/1.73m²) — many dosing references and CKD staging use the normalized value; competitors surface both. Requires height for BSA (Du Bois); then `crcl * 1.73 / BSA`. Show alongside the raw mL/min.
