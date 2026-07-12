# gold-calculator
verdict: gaps

## Competitors
1. goldpricez.com/calculator — key features: weight units incl Ounce Troy, Gram, Kilogram, Tola, Baht (15.244g), Tael (HK/Japanese), Carat (0.2g), Ratti, Masha, Grain, Pennyweight, Pound; karats 24/23/22/21/18/14/10/9K; broad currency list; Live or Manual price; Buy mode (making charges, tax, fees, discount) vs Sell mode; multi-currency comparison; Bid/Ask/Spread + labor cost.
2. dendritics.com metal calc — key features: gold/silver/platinum/palladium; karats 10–24K + millesimal (800/900/925/999) + custom purity; units gram/troy oz/dwt/av oz; ~17 currencies; live spot with timestamp/age; Markup/Discount payout % (e.g. 0.91 of spot); multi-language.
3. omnicalculator gold / calculator.net gold — key features: spot price, karat, weight unit, currency, per-gram value, purity breakdown.

## Our current features
- Live spot (gold-api.com) + FX (exchangerate-api) with full ISO 4217 currency list
- Auto per-market quote unit (ozt / gram / 10g / tola / kg) and per-country duty+dealer premium
- Weight units: troy oz, oz, gram, pennyweight, milligram, kilogram
- Karats 9K–24K, purity factor, "buyer pays % of melt" (covers scrap/pawn payout)
- Melt value + pure-content breakdown; manual price entry fallback
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] A few extra weight units — Tola we cover via quote unit but not as a *weight* input; add Tola, Baht, and Carat (0.2g) to the weight-unit dropdown for Asian jewellery use. Pure constant additions to the existing factor list.
- [ ] 23K and 21K karat options — Gulf/Asian markets quote 21K and 22K heavily; we skip 23K/21K. Add two options to the purity select (23K≈0.958, 21K=0.875).
- Note: our "buyer pays %", live prices, per-market unit + premium, and full-currency coverage already match or beat every competitor. This is close to already-wins; gaps are minor unit/karat additions.
