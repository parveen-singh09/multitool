# one-rep-max-calculator
verdict: gaps

## Competitors
1. calculator.net/one-rep-max-calculator — key features: Epley, Brzycki, Lombardi formulas (user-selectable); kg/lb toggle + desired output unit; percentage-of-1RM training table; save to track over time.
2. strengthlevel.com/one-rep-max-calculator — key features: reps→% table (1 rep 100% → 30 reps 50%); kg/lb; multilingual; links to strength-standards (how your lift ranks by bodyweight); training log.
3. omnicalculator.com/sports/one-rep-max — key features: exercise-specific NSCA coefficients (squat/deadlift/bench differ); Epley; unit/display selector; training-goal percentage chart.

## Our current features
- Epley + Brzycki, averaged for headline 1RM.
- kg/lb unit.
- Percentage table 60–95% with rep guidance.
- Reps capped 1–12.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Lombardi formula (and optionally show all formulas rather than only the two-way average) — calculator.net lets users pick; Lombardi = weight × reps^0.10 is a one-liner. Adds a third cross-check card.
- [ ] Exercise selection with NSCA coefficients (squat/deadlift/bench) — Omni's real differentiator; a generic formula overestimates deadlift 1RM. Optional select that swaps to a per-lift coefficient table for reps 1–10. Medium effort, meaningful accuracy gain.
