# probability-calculator
verdict: gaps

## Competitors
1. calculator.net/probability-calculator — key features: (a) Two-event calc from P(A), P(B) assuming independence → union/intersection/etc; (b) Probability Solver from any two of P(A), P(B), P(A'), P(B'), P(A∩B), P(A∪B), P(AΔB), P((A∪B)') → all the rest (does NOT assume independence); (c) Series of independent events — probability, repeat times, combined probability over repeated trials; (d) Normal-distribution area between bounds (µ, σ, Lb, Rb, ±inf) + confidence intervals + Z-table.
2. omnicalculator.com probability — key features: single-event, complementary, and multiple-event probabilities; conditional probability; "at least one" over n trials; expresses results as %, decimal, and 1-in-N odds.
3. gigacalculator / mathsisfun probability tools — key features: dice/coin scenario presets, "at least one success in n trials", conditional probability P(B|A), and odds↔probability conversion.

## Our current features
- Inputs P(A), P(B) as % (independent)
- Outputs: P(A∩B), P(A∪B), P(not A), P(not B), P(neither), P(A not B)
- Validation 0–100%; fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] "At least one" over N repeated trials — 1-(1-p)^n. Extremely common intent (calculator.net + Omni both have it). Add a trials input + one output row.
- [ ] Solve-from-known-values mode (given P(A∩B) or P(A∪B), derive the rest without assuming independence) — calculator.net's "Probability Solver". Bigger but high value; our tool only forward-computes under independence. At minimum add P(A∩B) as an optional input so union/conditional can be computed for dependent events.
- [ ] Conditional probability P(A|B) = P(A∩B)/P(B) — one row; Omni and mathsisfun expose it. Cheap once P(A∩B) is available.
- [ ] Show results as decimal and 1-in-N odds alongside % — Omni does this; helps interpretation. Formatting-only.
