# aft-calculator
verdict: gaps

## Competitors
1. aftcalculator.com (was acftcalculator.com) — **5-event** test scored out of 500 (MDL, HRP, SDC, PLK, 2MR). Two scoring standards: "Combat MOS" (sex-neutral, age-normed, 350 to pass) and "General Standard" (performance-normed by age + gender, 300 to pass). Per-event points, event breakdown, min-60-per-event fail logic, "Updated for 2025 AFT Standards", event training guides, downloads/standards charts.
2. armyfitnesstest / militarytimes-style calculators — age + gender, 5 events, alternate aerobic events (bike/row/walk) substitution, pass/fail per MOS.
3. acft.army-portal type sites — full standards tables per age/sex, printable/downloadable scoring scales.

## Our current features
- Six events including Standing Power Throw (SPT), scored out of 600 — the **old ACFT (March 2022) standard**.
- Sex + 10 age groups, exact table lookup, per-event points, pass/fail (min 60/event), total.
- Full dynamic scoring-standards table for selected sex/age shown on page.
- Download official PDF of scoring scales.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] **Update to the 2025 AFT standard (5 events, out of 500)** — the Army removed the Standing Power Throw and renamed the test "AFT". Our 6-event/600 model is now factually outdated. This is an accuracy gap, not a feature nicety: verify against the current published AFT standards and update `aftStandards` data + the six-event UI (drop SPT, retotal to 500).
- [ ] **Combat-MOS vs General standard toggle** — 2025 AFT splits scoring into a sex-neutral combat standard (350 to pass) and a performance-normed general standard (300 to pass). We only model one. Add a standard selector that swaps the pass threshold and (for combat) the age/sex-neutral columns.
- [ ] **Alternate aerobic event substitution** — competitors let users score a bike/row/walk in place of the 2-mile run. Add optional alternate-cardio inputs mapped to the pass/no-score standard (alternates are pass/fail, not pointed).
