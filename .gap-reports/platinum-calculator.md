# platinum-calculator
verdict: gaps

## Competitors
1. dendritics.com metal calc — key features: gold/silver/platinum/palladium; purity presets 800/900/925/999 + karat list + custom "(or Input)" purity field; weight units gram/troy oz/dwt/av oz; ~17 currencies; live spot with timestamp + age-of-reading indicator; Markup/Discount payout % (▲/▼); melt-value details breakdown (alloy weight, pure content, price used, currency); multi-language.
2. calculator.net precious-metal calcs — key features: spot price, purity/fineness, weight unit, currency; per-unit value and pure-content breakdown; educational content.
3. goldpricez / smartsilverstacker platinum tools — key features: broad weight units (gram, troy oz, kg, dwt, tola), Pt fineness presets, manual or live spot, and a "% of spot" payout field for scrap/pawn offers.

## Our current features
- Live platinum spot (gold-api.com XPT) + FX (exchangerate-api) with full ISO 4217 currency list
- Auto per-market quote unit (ozt/gram/10g/tola/kg) + per-country duty & dealer premium
- Weight units: troy oz, oz, gram, pennyweight, milligram, kilogram
- Purity presets .9995/.999/Pt950/Pt900/Pt850; "buyer pays % of melt" (scrap/pawn payout)
- Melt value + pure-content breakdown; manual spot fallback; rate timestamp
- Fully client-side (strong: wider currency + auto-premium coverage than any competitor)

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Custom purity input — competitors (Dendritics) allow a free-form fineness field; we only offer 5 presets. Some platinum items sit at odd finenesses (e.g. Pt585, coin alloys). Add an "Other" option revealing a number input. Small.
- [ ] Age-of-reading / staleness indicator on the live price — we show the FX "rates as of" timestamp but not how stale the metal spot is. Dendritics surfaces a seconds-old counter. Minor UX add.
- Note: our live spot + full-currency + auto per-market premium + "buyer pays %" already match or beat every competitor. Very close to already-wins; the two gaps are minor. Tola we cover as a quote unit but not as a weight-input unit — add it (and Baht) to the weight dropdown to mirror the sibling gold-calculator gap.
