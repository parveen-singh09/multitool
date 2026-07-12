# discount-calculator
verdict: gaps

## Competitors
1. calculator.net/discount-calculator.html — discount type selector: **percent off OR fixed amount off**; solve for any 2 of {price before, discount, price after}; shows price after + amount saved.
2. omnicalculator.com/finance/discount — many deal types: percentage off, fixed amount off, **2-for-1 / 3-for-2 / 4-for-3**, "% off 2nd/3rd product", multiple units, double/triple (stacked) discount; **sales-tax toggle**; reversible (derive original from final, or rate from prices).
3. calculatorsoup / percent-off calculators — percent off, final price, savings, and often add **sales tax** to show the true out-the-door price.

## Our current features
- Original price + two stacked percentage discounts (second applies to already-reduced price).
- Outputs: final price, amount saved, saved %.
- Instant, client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Fixed-amount-off option — competitors let a discount be "$X off" not just "% off". Add a per-discount type toggle (% vs $) and subtract accordingly. Common for coupons.
- [ ] Sales tax field — add an optional tax % applied after discount to show the real amount paid ("out-the-door" price). One input + one line of output; frequent user need.
- [ ] Reverse solve — given final price + discount, compute the original price (or given original + final, compute the discount %). calculator.net/omni both do this. Modest logic addition.
- [ ] Quantity / multi-buy deals (optional, lower priority) — "buy N get M" or price per unit. Omni has it; only add if it fits scope, otherwise skip.
