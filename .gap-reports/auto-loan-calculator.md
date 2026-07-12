# auto-loan-calculator
verdict: gaps

## Competitors
1. calculator.net/auto-loan-calculator — price, term, APR, cash incentives/rebates, down payment, trade-in value, **amount owed on trade-in**, state dropdown (auto sales-tax rules), sales tax, **title/registration/other fees**, **"include taxes & fees in loan" checkbox**. Total Price AND reverse "Monthly Payment" mode. Outputs: monthly, total loan amount, sales tax, upfront payment, total of N payments, total interest, total cost. **Loan-breakdown pie chart** + amortization graph + **month-by-month and annual amortization tables**. Handles states that don't tax rebates / don't reduce tax by trade-in.
2. bankrate.com auto loan calculator — price, down, trade-in, term, APR, sales tax; monthly payment, total interest, payoff; amortization schedule; rate-shopping links.
3. nerdwallet auto loan calculator — price, down, trade, APR, term, sales tax, fees; monthly payment, total cost, interest; payment-over-time chart.

## Our current features
- Price, down payment, trade-in, sales tax %, term (months), APR.
- Monthly payment (standard amortized formula, handles 0% APR), amount financed, total interest, total cost, sales-tax amount breakdown.
- Trade-in reduces taxable amount. Fully client-side, instant updates.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] **Amortization schedule** — every top competitor shows a month-by-month (or annual) breakdown of principal/interest/balance. Biggest missing feature. Compute the standard schedule from existing emi/r/n and render a collapsible table (annual summary at minimum). Pure client-side.
- [ ] **Title/registration/other fees input** — real out-the-door cost includes fixed fees. Add a "fees" field folded into amount financed / total cost (competitors treat these as standard).
- [ ] **"Include taxes & fees in the loan" toggle** — some buyers pay tax/fees upfront, others finance them. Currently we always finance tax. A checkbox to move tax+fees to upfront (out of the financed amount) matches calculator.net behavior.
- [ ] **Cash rebate / incentive input** — reduces price but is often taxed differently; at minimum add a rebate field that lowers the financed amount.
- [ ] (Nice-to-have, optional) principal-vs-interest breakdown visual — a simple bar/pie of total principal vs interest; low effort, aids comprehension. Skip if it conflicts with the minimal aesthetic.
