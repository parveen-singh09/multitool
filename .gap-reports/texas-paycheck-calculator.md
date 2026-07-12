# texas-paycheck-calculator
verdict: gaps

## Competitors
1. smartasset.com/taxes/texas-paycheck-calculator — key features: marital status, pay frequency (daily→annually), **dependents**, federal allowances + **additional federal withholding**, hourly OR salary toggle with **overtime wage & hours**, itemized pre-tax deductions (medical/dental/vision/401k/FSA/HSA/etc. each as $ or % of gross), post-tax deductions, per-tax exemption toggles, detailed take-home breakdown.
2. paycheckcity.com/calculator/salary/texas — key features: check date drives tax-year rates, gross per-period or annual, pay frequency (handles 27-pay leap years), filing status incl. head of household, full **2020 W-4 fields** (Step 2 multi-job, Step 3 dependents in $, Step 4a other income, Step 4b extra withholding), benefits as fixed/%gross/%net with exempt flags, separate bonus/supplemental calculator, hourly variant.
3. adp.com Texas salary/hourly paycheck calculator — key features: hourly and salary modes, wages + tax withholdings inputs, net take-home output; brand-trust general estimator.

## Our current features
- Gross pay per period, pay frequency (weekly/bi-weekly/semi-monthly/monthly).
- Filing status (single / married joint / head of household).
- Single lump pre-tax deductions field.
- 2025 federal brackets, standard deduction, SS (6.2% to wage base), Medicare (1.45% + 0.9% additional).
- Per-period breakdown with "no state tax in TX" line.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Hourly vs salary toggle with hours/period + overtime (1.5×) — offered by all three; today only a single gross-per-period number is accepted. Add a mode toggle; hourly = wage × hours + OT wage × OT hours. ~20 lines.
- [ ] W-4 dependents / child tax credit — dependents materially cut federal withholding ($2,000/child, $500/other) and every serious competitor models it. Subtract the annual credit from computed federal tax (floored at 0). Add a numeric input. ~5 lines.
- [ ] Additional federal withholding (W-4 Step 4b) — flat extra $ per period subtracted from take-home. Trivial input + one line in the breakdown.
- [ ] Annual-salary entry option — competitors let you enter yearly gross and derive per-period; we force per-period. Add an "amount is: per period / per year" toggle. ~4 lines.
- [ ] Other taxable income (W-4 Step 4a) — optional; add to annual taxable before bracket math for accuracy vs paycheckcity. Lower priority.
