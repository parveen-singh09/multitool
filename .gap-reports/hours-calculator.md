# hours-calculator
verdict: gaps

## Competitors
1. timecardcalculator.net — key features: up to 7 days (Mon–Sun); flexible input (855 → 8:55); 12/24h formats; multiple breaks per day auto-deducted; pay rate → gross pay; overtime (daily, weekly, 8/40, California) + time-and-half/double; daily+weekly totals in hh:mm AND decimal, split REG/OT/Total; pay periods 1–4 wk/month; save via cookies; print / PDF / email link.
2. calculator.net/hours-calculator.html — key features: hours between two times AND between two dates; AM/PM; "Now" button; swap start/end. (Single shift, no breaks/pay — points to its Time Card Calculator for more.)
3. redcort.com timecard — key features: multi-day time card, lunch/break deduction, decimal hours, rounding rules, printable.

## Our current features
- Single start/end time + break minutes → hours&minutes and decimal hours
- Overnight-shift handling (end < start wraps past midnight)
- Fully client-side, instant

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Multi-day / weekly time card — the dominant use case for this keyword. Repeatable day rows (start/end/break) with a weekly total in hh:mm and decimal. Biggest gap vs timecardcalculator.net & redcort; still fully client-side. Reuse the grade/gpa add-row pattern already in this codebase.
- [ ] Hourly rate → gross pay — one rate input × decimal hours = pay. Cheap, high value for the payroll audience the About text already targets.
- [ ] Overtime (>40/wk or >8/day) split into REG/OT — natural follow-on once multi-day exists; optional.
- [ ] "Now" button to fill current time — trivial UX parity with calculator.net.
