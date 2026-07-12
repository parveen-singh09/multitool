# heart-rate-zone-calculator
verdict: gaps

## Competitors
1. calculator.net/target-heart-rate-calculator.html — key features: max HR from age OR entered tested value; THREE max-HR formulas — Haskell & Fox (220−age), Tanaka (208−0.7×age), Nes (211−0.64×age); intensity scale options (Karvonen, Borg 6–20, Borg CR10); optional resting HR drives Karvonen; five zones (50–100%) with training-benefit labels.
2. omnicalculator.com/sports/target-heart-rate — key features: age, resting HR, intensity dropdown + custom %; Karvonen reserve formula; 5 named zones (moderate/fat-burning/aerobic/anaerobic/red-line) with descriptions; average-THR-by-age chart; works in reverse (HR → intensity).
3. Various (Garmin/Polar-style) — key features: zone descriptions, sport-specific guidance, sometimes % of HRR vs %HRmax choice.

## Our current features
- Max HR = 220 − age; optional resting HR → Karvonen (HRR) method, else %max
- Five zones (50–100%) with names and % ranges, bpm per zone
- Medical-caution note; fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Alternate max-HR formulas — we hardcode 220−age (least accurate). Add Tanaka (208−0.7×age) and Nes (211−0.64×age) as a selector; a few lines. Tanaka is widely recommended over 220−age and every strong competitor offers the choice.
- [ ] Option to enter a tested/known max HR — override the age estimate for athletes who've measured it. One optional input that, if filled, bypasses the formula.
- [ ] Per-zone training-benefit descriptions — competitors label what each zone trains (recovery, fat-burn, aerobic base, threshold, VO2max). We only show name + %. Add a short description per row; static text, improves usefulness and dwell time.
