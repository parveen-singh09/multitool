# triangle-calculator
verdict: gaps

## Competitors
1. calculator.net/triangle-calculator.html — key features: solves **any triangle** from 3 values incl. ≥1 side (SSS, SAS, ASA, AAS, SSA with ambiguous-case warning), degree/radian toggle, outputs all 3 sides, all 3 angles, area (Heron/½ab·sinC), medians, inradius, circumradius, semiperimeter, **scaled diagram**.
2. omnicalculator.com/math/triangle (and right-triangle variant) — key features: multiple solving cases, area, perimeter, heights, angles; general triangle not just right triangles; unit selection.
3. mathsisfun.com/geometry/triangle-calculator.html — key features: general triangle solver with interactive **visual diagram**, enter any 3 of sides/angles, shows all remaining sides/angles + area.

## Our current features
- Right-triangle only: solve the missing side from two given via Pythagoras.
- Area, perimeter, both acute angles.
- Validates hypotenuse-longest and non-right-triangle inconsistency.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] General (non-right) triangle solving — the biggest gap. Competitors solve ANY triangle (SSS/SAS/ASA/AAS/SSA) via law of sines/cosines; we only do right triangles. This is the dominant search intent for "triangle calculator". Add angle inputs and case detection. Substantial but self-contained client-side math. Note: our narrow scope is defensible as a "right triangle calculator" — but the slug is generic, so we lose the broad query.
- [ ] Visual diagram — all three competitors render the triangle to scale/proportion. An inline SVG drawn from the solved sides/angles is a strong, dependency-free addition and big UX/trust win. Medium effort.
- [ ] Degree/radian toggle for angle output — minor; calculator.net offers it. Low priority given we only output angles today.
- [ ] Extra metrics (heights, inradius, circumradius, medians) — calculator.net shows these; cheap once general solving exists. Lower priority.
