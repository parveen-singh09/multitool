# dynasty-trade-calculator
verdict: gaps

## Competitors
1. keeptradecut.com/trade-calculator — **crowdsourced live player + pick values**; **Superflex/1QB toggle**; **TE Premium tiers (Off/TE+/TE++/TE+++)**; League Size, Startup Mode, Future Pick Adjustment, Acceptable Variance; total value per side + Total Absolute Value Exchanged; value dispersion, 6-month trends, 30-day risers/fallers; Copy Trade URL.
2. fantasycalc.com/trade — computer-generated values from real league trades; Superflex vs 1QB, number of teams, PPR (0/0.5/1) and TE-premium settings; player + pick search; fair-trade delta display; dynasty and redraft modes.
3. dynastyprocess.com / DynastyProcess calculator — expected-value based; superflex/PPR settings, pick values, and a value-difference verdict.

## Our current features
- ~35 hardcoded player + pick values (1QB PPR-ish, 0–10000 scale), datalist autocomplete.
- Two sides (A/B), add/remove assets, per-side totals.
- Verdict: fair (within 5%) or Side X wins by value + % edge.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Superflex / 1QB toggle — the single most important dynasty setting; QBs are worth far more in Superflex. Both leading competitors have it. Requires a second value column for QBs (or a QB multiplier) in the ASSETS table and a toggle to switch. High impact.
- [ ] Scoring / TE-premium settings — at minimum a TE-premium bump; ideally PPR vs standard. Affects value meaningfully. Add multiplier toggles applied to TE/receiving values.
- [ ] Larger, current player pool — 35 assets is thin vs competitors' full-league databases. Expand the static list to ~150+ relevant dynasty players and refresh pick values. Note the values are explicitly a static snapshot (privacy-first, no live API) — that's an acceptable design choice, but the list should be broader and dated.
- [ ] Shareable trade URL — encode both sides in the query string so users can share/save a trade. KTC has "Copy Trade URL". Low effort, high utility for the fantasy audience.
- [ ] Note: live crowdsourced values (KTC/FantasyCalc's core edge) require a backend/API and violate the privacy-first client-side design — skip. Instead lean on a broad, clearly-dated static table.
