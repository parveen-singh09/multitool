# peptide-calculator
verdict: gaps

## Competitors
1. omnicalculator.com reconstitution + peptide-dosage — key features: reconstitution solver (dose / dose volume / concentration — any two solve the third); mass units mcg/mg/g, volume units µL/mL/cc; separate peptide dosage tool translates concentration into exact syringe units; share/reload/clear.
2. peptidecalc.com / musclesciences-style peptide calculators — key features: vial mg + BAC water mL + target dose → units to draw on U-100 insulin syringe; doses-per-vial; often a "reverse" mode (choose target units-per-dose, get how much water to add); some show weekly total and cost per dose.
3. reddit r/Peptides reconstitution guides + generic peptide dosage sheets — key features: concentration table (mg/mL at common water volumes), units-to-draw for a range of doses, and a "how much BAC water for N units = X mcg" reverse lookup.

## Our current features
- Inputs: peptide mg in vial, BAC water mL, desired dose (mcg or mg), syringe type (U-100 1mL/0.5mL/0.3mL, U-40)
- Outputs: units to draw, volume per dose (mL), concentration (mcg/unit), doses per vial
- Over-capacity warning when the draw exceeds the barrel; validation; fully client-side
- Multiple syringe barrel sizes with capacity caps (strong — Omni's tool lacks the barrel-cap check)

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Reverse mode: solve BAC water volume for a target units-per-dose — "I want 250 mcg to sit at 25 units; how much water do I add?" Very common peptide workflow. water = (totalMcg × drawUnits) / (doseMcg × unitsPerMl). One inverted formula + a mode toggle.
- [ ] Weekly total helper — optional "doses per week" input → shows vial duration in days/weeks and weekly mcg. Cheap and matches how people actually schedule. Multiply existing doses-per-vial.
- Note: our concentration + units-to-draw + barrel-cap warning already equals or beats the field. These are additive conveniences, not corrections. Keep the reference-only / no-medical-advice framing — do NOT add peptide-specific dose "recommendations."
