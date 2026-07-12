# pft-calculator
verdict: gaps

## Competitors
1. usmc-pft.com / rallypoint PFT calculator — key features: three events (pull-ups OR push-ups, plank, 3-mile run); full age brackets 17–20 up through 46–50 and 51+; per-event points + total /300; class (1st/2nd/3rd); high-altitude run time adjustment; push-ups capped at 70 pts rule.
2. militarytimes / marinecorpstimes PFT calculator — key features: same three events, all official age groups incl. 41–45, 46–50, 51+; pass/fail per minimum; total and class; often a CFT calculator alongside.
3. Marine Corps order / masf-style scorecards — key features: full published tier tables per age+sex, alternate cardio (rowing/cycling for medically waived runners) with its own scoring, and high-altitude adjusted run standards.

## Our current features
- Events: pull-ups OR push-ups (70-pt cap), forearm plank, 3-mile run
- Age groups 17–20 through 36–40 (5 brackets); sex; interpolation between published tiers
- Total /300, per-event pass (≥40), class (1st ≥235, 2nd ≥200, 3rd ≥150), FAIL logic
- Full published tier table rendered on-page for verification (strong — most competitors hide the source table)
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Older age brackets 41–45, 46–50, 51+ — we stop at 40. The USMC PFT officially runs to 51+, and older Marines/reservists are a real audience. Requires extending the standards data table in src/data/pftStandards; this is the biggest genuine gap. Verify official values before adding.
- [ ] High-altitude run adjustment — official standards add time allowances for runs at altitude (≥4,500 ft). Competitors expose an altitude toggle. Needs the published altitude table; medium effort, data-driven.
- Note: our on-page tier table + interpolation already beats most competitors on transparency. Age-bracket coverage is the one that materially limits who can use the tool.
