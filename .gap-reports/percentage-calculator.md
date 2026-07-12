# percentage-calculator
verdict: gaps

## Competitors
1. calculator.net/percent-calculator — key features: main P×V1=V2 solver (any two of three); "common phrases" block with three forms incl. "X is Y% of what" (find the base); separate Percentage Difference calculator (|a-b| / average); separate Percentage Change calculator with Increase/Decrease toggle solving any two; worked-example formula explanations.
2. omnicalculator.com/math/percentage — key features: "what is X% of Y", percentage-of relationships, percentage change, percentage-point difference; inline explanations; share/reset.
3. calculatorsoup / percentagecalculator.net — key features: multiple discrete calculators incl. percent-off/discount, percentage increase/decrease by a percent, and "X is what percent of Y" with steps shown.

## Our current features
- Three panels: X% of Y; X is what % of Y; % change A→B (with +/- and colour)
- Live-updating, no button; fully client-side
- Clean, focused UI

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] "X is Y% of what" (solve for the base) — the one common form we omit. calculator.net highlights it. One panel: base = X / (Y/100).
- [ ] Percentage difference (symmetric: |a-b| / ((a+b)/2)) — distinct from our signed change; calculator.net ships it as its own tool. One panel.
- [ ] "Increase/decrease N by P%" (apply a percent to a value) — e.g. "250 increased by 15% = 287.5". Common intent (markups, raises) not covered by our three panels. One panel with a +/- toggle.
