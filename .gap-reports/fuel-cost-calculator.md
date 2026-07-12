# fuel-cost-calculator
verdict: gaps

## Competitors
1. calculator.net/fuel-cost-calculator.html — key features: 3 inputs (distance, efficiency, price); rich unit options — distance in mi/km, efficiency in MPG, L/100km, km/L, or L/mile, price per gal/L. No round-trip or split.
2. thecalculatorsite.com fuel cost — key features: distance/efficiency/price with unit switching; cost per distance. (Similar scope to ours.)
3. omnicalculator.com/other/gas — key features: preset vehicle dropdown (make/model with built-in economy), trip type (city/highway/mixed/custom), Number of people to split cost → "cost per person" output, L/gal (US & UK) and km/mi units.

## Our current features
- Metric (km, L/100km, price/L) and US (miles, MPG, price/gal) toggle
- Total fuel cost, fuel needed, cost per km/mile
- Fully client-side, instant recompute

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Round-trip toggle — very common trip-cost use case; one checkbox that doubles distance before computing. Trivial to add.
- [ ] Split cost among N passengers → cost-per-person — Omni's headline feature for carpool/rideshare estimates; add one "people" number input and a cost/person output tile.
- [ ] Extra efficiency unit km/L — calculator.net supports it; common outside US/L-per-100km markets. Add as a third efficiency mode (fuel = dist / kmPerL).
