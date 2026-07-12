# silver-calculator
verdict: gaps

## Competitors
1. Dendritics metal calculator (dendritics.com/scales/metal-calc.asp) — key features: preset fineness/karat buttons (800, 900, 925, 999, plus alloys) + custom fineness; weight units gram/troy-oz/dwt/av-oz; live internet spot price with age-of-reading indicator; multi-currency (USD/CAD/GBP/EUR/AUD/BRL/CHF/CNY/INR/JPY/MXN/RUB/ZAR); markup/discount % field ("pays you 91% of spot"); melt-value output.
2. Coinflation / Coinapps silver calculators — key features: named US coin PRESETS (Roosevelt dime, Washington quarter, Kennedy/Franklin half, Morgan/Peace dollar, war nickel, etc.) with correct weight+fineness baked in, quantity per coin, live spot, total roll/bag value.
3. JMBullion coin calculator — key features: pick coin type + enter quantity, auto silver content, live spot, total value; bullion-buyer framing.

## Our current features
- Live spot fetch (gold-api.com) + FX (exchangerate-api.com) with graceful manual fallback
- Full ISO-4217 currency list with names/symbols
- Market-aware quote units (per ozt / gram / 10g / tola / kg) auto-snapped per currency
- Per-country domestic premium (duty + tax + dealer margin) auto-applied
- Weight units: ozt, oz, gram, dwt, mg, kg
- Purity presets .999/.958/.925/.900/.800
- "Buyer pays % of melt" (spread/scrap-offer modeling)
- Melt value + breakdown (total weight, pure content, melt, payout)
- Manual spot entry; unit-aware rescaling
- Fully client-side (only outbound calls are the two price feeds, user-triggered)

Our currency/unit/premium coverage already beats all three competitors.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Named coin presets — the single feature every silver competitor has that we lack. A dropdown of common silver coins (US 90% dime/quarter/half/dollar, 40% Kennedy, 35% war nickel, sterling flatware, 1oz rounds) that auto-fills weight + fineness. This is the top scrap/stacker use case (valuing a jar of coins). Static data table, no dependency, privacy-safe.
- [ ] Quantity / count field — with coin presets, let the user enter how many (e.g. 20 quarters) and total the bag. Multiply melt by count. Pairs with the preset gap.
- Note: our fineness list (.999–.800) covers investment/coin silver; Dendritics adds karat-style buttons but those are for gold — not a real silver gap. Live price + multi-currency we already match or exceed.
