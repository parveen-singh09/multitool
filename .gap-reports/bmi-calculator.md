# bmi-calculator
verdict: gaps

## Competitors
1. Calculator.net BMI — age + gender inputs; outputs BMI, category, healthy BMI range, healthy weight range for the height, BMI Prime, Ponderal Index; visual gauge; age-aware CDC percentile mode for ages 2-20; WHO adult category table; print/save.
2. NHS BMI calculator (nhs.uk) — metric/imperial, age, sex, ethnicity adjustment note; healthy weight range for height and a personalized action plan / next steps.
3. Omni Calculator BMI — metric/imperial, gauge, healthy-weight-range for height, and related indices; explanatory ranges.

## Our current features
- Metric/imperial unit toggle
- BMI value + WHO category (underweight/normal/overweight/obese)
- Segmented range chart with a moving marker positioned on the scale
- Color-coded category legend
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Healthy weight range for the entered height — show the kg/lb range that corresponds to BMI 18.5-25. Highly useful and one line: `18.5*m*m` to `25*m*m` (convert to lb in imperial). This is the single most requested BMI follow-on.
- [ ] BMI Prime — ratio of BMI to 25 (`bmi/25`), a compact "how far over/under normal" figure. One line.
- [ ] Ponderal Index — `kg/m^3`, more reliable for very tall/short people. One line, sits next to BMI Prime.
