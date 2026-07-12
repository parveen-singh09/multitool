# sleep-calculator
verdict: gaps

## Competitors
1. sleepfoundation.org/sleep-calculator — key features: 12 age brackets (0-3 months → 65+), age-based recommended sleep totals (naps folded in for infants/toddlers), wake-at / go-to-bed-at direction toggle, 15-min fall-asleep adjustment, ~90-120 min cycles, "aim for 4+ full cycles" guidance, embedded sleep-trouble mini quiz.
2. calculator.net/sleep-calculator (sleep time) — key features: wake/bed direction, 90-min cycles, 14-min fall-asleep, lists multiple bedtimes with cycle counts, plus reference content on cycle stages.
3. sleepcalculator.com — key features: simple "wake up at" input, returns a set of recommended bedtimes by cycle count, minimalist single-input UX.

## Our current features
- Two modes: "wake up at" and "going to bed at".
- 90-minute cycle math, 14-minute fall-asleep assumption.
- Options for 3, 4, 5, 6 cycles with hours-of-sleep labels.
- Defaults the time input to "now".
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Age-based recommendation — the main differentiator on sleepfoundation. Add an optional age/age-bracket `<select>` and surface the recommended nightly total (e.g. adult 7-9h, teen 8-10h) and highlight which cycle option lands in that range. Static lookup table, ~15 lines, no deps.
- [ ] Highlight the "recommended" cycle options — competitors visually flag the 5-6 cycle (7.5-9h) rows as ideal vs the 3-cycle short-sleep option. Add a badge/emphasis class to rows ≥ the age-appropriate minimum. Cosmetic-adjacent but functional guidance.
- [ ] Adjustable fall-asleep time — sleepfoundation uses 15 min; some users know theirs differs. Optional number input defaulting to 14 rather than a hard constant. ~3 lines.
