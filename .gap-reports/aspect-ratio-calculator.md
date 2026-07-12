# aspect-ratio-calculator
verdict: gaps

## Competitors
1. andrew.hedges.name/experiments/aspect_ratio — W1/H1 + W2 or H2, solves the missing value, simplified ratio display, common-ratios preset dropdown (8K→HVGA), **round-to-whole-number checkbox**, worked formula, reset-to-start.
2. calculateaspectratio.com / omnicalculator — enter any two of {W,H,ratio}, solve the rest; accepts a **ratio as input** (e.g. type 16:9 to get missing dimension), decimal ratio shown.
3. digitalrebellion / summet aspect ratio tools — presets, ratio + one dimension solving, decimal ratio output alongside simplified ratio.

## Our current features
- Original W×H with live simplified ratio (GCD), scaled visual preview box.
- Resize: enter new width OR height, computes the other keeping ratio (rounded to 2dp).
- 8 common presets (16:9, 4K, 4:3, 21:9, 1:1, 9:16, 3:2, 16:10). Fully client-side.
- Better than competitors on the live preview box.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] **Solve from a target ratio + one dimension** — competitors let you input a ratio (e.g. 16:9) plus a width to get the height, not just derive-from-existing. Add an optional "target ratio W:H" input that, combined with one new dimension, computes the other. Common workflow for "make this fit 16:9".
- [ ] **Round-to-whole-pixels toggle** — resize output currently allows 2-decimal pixels (e.g. 640.67px), which is meaningless for pixel dimensions. Add a checkbox to round to whole numbers (the hedges tool's most-used feature).
- [ ] **Decimal ratio display** — alongside the simplified `16:9`, show the decimal (`1.778`), useful for irregular sizes that don't reduce cleanly (e.g. 1366×768 → 683:384, hard to read; decimal 1.779 is clearer).
