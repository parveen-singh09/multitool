# ebay-fee-calculator
verdict: gaps

## Competitors
1. salecalc.com/ebay — auction vs fixed price; item/shipping/misc costs; **goal-seek (target net profit / return% / margin% → required sale price)**; many categories with editable fee rate + max fee cap; free-insertion toggle; **Store subscription levels (None/Starter/Basic/Premium/Anchor)**; **Promoted-listing ad rate %**; sales tax + tax-on-shipping; editable payment-processing % + $0.30; top-rated 10% discount; below-standard 5% penalty; listing upgrades; **multi-item worksheet with save/export**; shareable URL.
2. ebayfeescalculator.com (Flyp) — region-specific (US/UK/AU/CA/DE/FR/IT); sale price, shipping, cost; category final-value-fee rates; profit + margin output.
3. crazylister / sellerbird eBay calculators — category FVF, per-order fee, promoted-listing ad rate, store-tier fee reductions, net profit and margin.

## Our current features
- Item price + shipping charged; ~12 categories with FVF %; item cost + label cost.
- Below-standard (+5%) and international (+1.65%) toggles.
- Fixed per-order fee ($0.40 / $0.30 under $10).
- Outputs: buyer pays, FVF, fixed fee, total fees, payout, net profit (colored), margin, fees-as-%-of-sale.
- Client-side; clear disclaimer about Store/promoted/payment specifics.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Promoted-listings ad rate — a huge real-world cost most sellers pay; competitors all include it. Add an optional "Promoted listing ad rate %" input applied to the sale total. High impact, one input + one fee line.
- [ ] Store subscription tier — Store subscribers get reduced FVF and free insertions. Add a Store-level selector that adjusts the category rate (or note the reduced rates). Moderate; affects accuracy for the many seller users on a Store plan.
- [ ] Goal-seek / required sale price — salecalc's standout: enter a target profit/margin and get the sale price needed. Invertible from existing formula; strong differentiator.
- [ ] Payment-processing separation — our model rolls payment processing into the FVF %. eBay's payment processing is baked into FVF for managed payments, so this is arguably fine, but competitors expose it; consider an editable line for transparency (optional).
- [ ] Verify/refresh 2026 fee rates — confirm category FVF %, the $0.40/$0.30 per-order fee, and international 1.65% are current for 2026 (rates change; our disclaimer helps but accuracy matters most here).
