# due-date-calculator
verdict: gaps

## Competitors
1. calculator.net/due-date-calculator.html — **"Estimate based on" method selector: LMP, Ultrasound, Conception Date, IVF Transfer Date**; cycle length 22–44; ultrasound needs date + gestational age (weeks+days); IVF needs transfer date + embryo age (day 3/5/6); single due-date output; term-range reference (early/full/late/preterm/postterm).
2. babycenter.com/pregnancy-due-date-calculator — LMP / conception / IVF / ultrasound methods; due date PLUS which trimester, how far along, conception date, and a week-by-week timeline / milestones.
3. whattoexpect.com/due-date-calculator — LMP + conception + IVF; due date, current week, trimester, and a pregnancy-week timeline/countdown.

## Our current features
- LMP + average cycle length (28 default, 20–45) via Naegele's rule (280 days, cycle-adjusted).
- Outputs: estimated due date, current week (Nw Xd), trimester.
- Client-side; sensible guards for out-of-range dates.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Multiple calculation methods — all three competitors offer LMP + Conception date + IVF transfer + Ultrasound. We only do LMP. Add a method selector: conception date = +266 days; IVF transfer = transfer date + (280 − 14 − embryoAge); ultrasound = ultrasound date extrapolated from entered gestational age. Biggest gap; high user demand.
- [ ] Conception / key milestone dates — show estimated conception date and simple milestones (end of 1st/2nd trimester, viability ~24w, full-term 37w). Derived from existing LMP math; low effort, adds value.
- [ ] Days remaining / countdown — "X weeks Y days until due date". One subtraction from today; commonly expected.
- [ ] Cycle-length range parity — competitors allow up to 44; ours caps at 45 which is fine, but consider min 22 to match clinical norms (minor).
