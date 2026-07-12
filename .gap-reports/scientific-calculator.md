# scientific-calculator
verdict: gaps

## Competitors
1. calculator.net (scientific-calculator) — key features: sin/cos/tan + inverse trig buttons, deg/rad toggle, π and e, x²/x³/xʸ, eˣ/10ˣ, √/∛/ⁿ√, ln/log, memory keys (M+, M−, MR), factorial n!, reciprocal 1/x, %, parentheses, Ans recall, RND, ± sign, EXP scientific notation; click or type.
2. Desmos scientific calculator — key features: full trig + inverse + hyperbolic, ln/log/logₐ, powers/roots, factorial, constants, Ans, clean history of entries, keyboard input.
3. Web2.0calc / GeoGebra scientific — key features: history log of past calculations, memory, hyperbolic functions, nth root, factorial, permutations/combinations (nPr/nCr).

## Our current features
- Safe expression parser (tokenizer → shunting-yard → RPN, no eval) — a real strength
- sin/cos/tan, asin/acos/atan, log, ln, sqrt, abs
- Power (^), modulo (%), parentheses, unary minus
- Constants pi, e
- Deg/Rad toggle
- Button pad + free-text typing
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Factorial (n!) — present on every competitor; missing here. Add a postfix ! token to the parser and a gamma/iterative factorial. Common expectation for a scientific calc.
- [ ] Memory keys (M+, M−, MR, MC) — calculator.net and most others have them. Store a running memory value; add pad buttons.
- [ ] History / Ans — recall of the previous result (Ans) and a short list of past evaluations. Competitors all keep history. Ans is a single stored variable in the tokenizer.
- [ ] nth root / cube root and eˣ, 10ˣ shortcuts — competitors expose these directly. Mostly reachable via ^ today (x^(1/3), e^x), but dedicated tokens/buttons match expectations. Low priority since ^ covers the math.
- [ ] Permutations/combinations (nPr, nCr) — offered by GeoGebra/web2.0calc; niche, lower priority.
- Note: hyperbolic functions (sinh/cosh/tanh) are a minor gap — Desmos has them, calculator.net does not. Add as parser functions if desired; low priority.
