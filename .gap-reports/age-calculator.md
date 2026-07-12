# age-calculator
verdict: gaps

## Competitors
1. calculator.net/age-calculator — DOB + "age at" date. Outputs age in years/months/weeks/days AND **hours, minutes, seconds**. Discusses end-of-month edge-case handling and alternate age systems. Links to date & time calculators.
2. timeanddate.com date/age calculator — full breakdown, plus counts of specific weekdays between dates, and includes/excludes end date option.
3. omnicalculator age calculator — age in all units, **next-birthday countdown**, and often day-of-week born.

## Our current features
- DOB + "age at" date (defaults to today), robust clamped Y/M/D breakdown that handles end-of-month borrow correctly.
- Totals in months, weeks, days.
- Before-birth validation error. Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] **Age in hours, minutes, seconds** — top competitor shows these; trivial to add (totalDays * 24, etc.) as extra tiles or in the subline. Pure client-side math, no design cost.
- [ ] **Next birthday countdown** — "X days until your next birthday" / "you'll turn N". Common expectation; one small computed line using the DOB month/day against today.
- [ ] **Day of the week born** — one line via `new Date(dob).toLocaleDateString(undefined,{weekday:'long'})`. Low effort, frequently requested on age tools.
