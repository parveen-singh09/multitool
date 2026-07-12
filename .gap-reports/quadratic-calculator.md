# quadratic-calculator
verdict: gaps

## Competitors
1. Symbolab (symbolab.com/solver/quadratic-equation-calculator) — key features: full step-by-step breakdown with "one step at a time" toggle, "Solve by" dropdown (factoring method, completing the square, quadratic formula), automatic interactive parabola plot, vertex, complex roots explained with i.
2. calculator.net (quadratic-formula-calculator) — key features: a/b/c inputs accepting fractions, quadratic-formula solution, full derivation via completing the square, axis of symmetry, static illustrative parabola graph.
3. MathPapa (mathpapa.com quadratic-formula-calculator) — key features: step-by-step worked solution aimed at students, plain-language explanation of each move.

## Our current features
- a, b, c inputs with live equation echo ("3x² + 2x − 5 = 0")
- Real roots, repeated root, and complex roots (a + bi form)
- Discriminant value shown explicitly
- Nature-of-roots label (two real / repeated / two complex / linear)
- Vertex coordinates
- Degenerate handling: linear (a=0), no-solution (a=b=0, c≠0), infinite (all zero)
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Step-by-step working — every top competitor shows the substitution into the quadratic formula and the arithmetic. We only show final answers. Implement as an optional expandable block that prints the formula with the user's a/b/c substituted, the discriminant computation, and the two root evaluations. Pure string templating from values we already compute; no new math.
- [ ] Parabola graph — Symbolab plots interactively, calculator.net shows a static curve. A small inline SVG plotting y = ax²+bx+c with marked roots and vertex would match. Can be hand-drawn SVG from points we already have (roots, vertex), no charting dependency needed.
- [ ] Factored form output — competitors show a(x − r₁)(x − r₂). One line derived directly from the roots we already compute.
