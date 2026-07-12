# mortgage-calculator
verdict: gaps

## Competitors
1. calculator.net/mortgage-calculator — key features: home price, down payment (%/$ toggle), term, rate, start date, property tax, insurance, PMI, HOA, other costs (all %/$); annual-increase inputs; extra monthly/yearly/one-time payments; monthly + annual amortization tables; pie + balance/interest line charts; biweekly comparison; payoff date; print/save.
2. bankrate.com mortgage calculator — key features: PMI, taxes, insurance, HOA, amortization schedule, extra payments, payoff date, total interest, printable.
3. nerdwallet.com mortgage calculator — key features: PITI + PMI + HOA, amortization schedule, payment breakdown chart, affordability context.

## Our current features
- Home price, down payment, rate, term, annual property tax, annual insurance.
- Outputs: total monthly payment, P&I, monthly tax, monthly insurance.
- Handles 0% rate.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] PMI + HOA inputs — standard PITI components on every competitor; we omit both. PMI especially matters when down payment < 20%. Add two optional fields; HOA adds straight to monthly, PMI is (rate% × loan)/12, ideally auto-dropping once LTV ≤ 80%.
- [ ] Amortization schedule + payoff date — universal competitor feature. Iterate months from the P&I we already compute; render yearly-aggregated table to stay compact. Also yields total interest over the loan.
- [ ] Payment breakdown chart (P&I / tax / insurance / PMI / HOA) — simple inline SVG pie/stacked bar from existing monthly figures; the visual competitors lead with.
- [ ] Extra payment input (optional) — show interest saved and earlier payoff; only worthwhile after the amortization loop exists.
- [ ] Down payment %/$ toggle — minor UX parity with calculator.net; low priority.
