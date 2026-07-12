# gpa-calculator
verdict: gaps

## Competitors
1. calculator.net/gpa-calculator.html — key features: +/- letter grades (A+=4.3…F=0); credit-hour weighting; grade format Letter/Percentage/Point; group courses into semesters; prior/cumulative GPA carryover (prior GPA + credits completed); separate GPA Planning calc (min GPA needed for a target); P/NP/I/W ignored; add rows.
2. gpacalculator.net — key features: College (semester + cumulative), High School (standard/honors/AP/IB weighting), Middle School; weighted & unweighted; Raise-GPA what-if tool; international grade conversion; SGPA↔CGPA, CGPA↔%.
3. rapidtables / collegesimply GPA — key features: letter+credits table, add rows, weighted GPA, planning.

## Our current features
- 4.0 scale with +/- grades (A+ down to F), credit-hour weighted
- Add/remove course rows, optional course names
- Instant GPA + credit-hours/course-count summary
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Prior/cumulative GPA carryover — enter existing GPA + prior credits so the result is a running cumulative GPA, not just this term. Two inputs, fold into the weighted average (points += priorGPA*priorCredits). Standard across all top tools.
- [ ] Target-GPA / "grade needed" planning — given current GPA, credits, and a target, show the GPA needed on remaining credits. Popular student use case; small extra panel, pure arithmetic.
- [ ] Weighted (honors/AP/IB) option — competitors add +0.5/+1.0 per advanced course. Optional per-row "course type" select that bumps the grade points. Skip if keeping strictly unweighted, but it is a common expectation for high-school GPA.
