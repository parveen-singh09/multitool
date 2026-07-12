# tip-calculator
verdict: gaps

## Competitors
1. gigacalculator.com/calculators/tip-calculator.php — key features: bill, tip %, number of people, **round-up controls for BOTH total and per-person** (none / whole dollar / next $5 / $10 / $50), any-currency, single + shared modes.
2. calculator.net/tip-calculator.html — key features: main tool shows tip across **multiple preset percentages at once**, plus a separate shared-bill tool (price, tip %, people) giving tip-per-person and total-per-person; tipping reference tables.
3. omnicalculator.com/finance/tip — key features: bill, tip %, split; option to tip on **pre-tax vs post-tax** amount, per-person breakdown, currency-agnostic.

## Our current features
- Bill, tip %, split between N people.
- Quick-percentage preset buttons (10/15/18/20/25%).
- Outputs tip, total, and per-person.
- Fully client-side, instant.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Round-up option (total and/or per person) — gigacalculator's signature feature and genuinely useful for cash tipping. Add a small `<select>` (none / whole / next $5) and apply before display, showing the effective tip. ~12 lines.
- [ ] Tip-on-pre-tax option / separate tax field — omnicalculator handles this; US convention tips on pre-tax. Add an optional tax amount or % and a "tip on subtotal" toggle so tip isn't inflated by tax. ~8 lines.
- [ ] Per-person tip AND per-person bill split shown separately — we show only per-person total; competitors also break out tip-per-person. One extra tile from values we already have. ~2 lines.
