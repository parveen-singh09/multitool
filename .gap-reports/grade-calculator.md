# grade-calculator
verdict: gaps

## Competitors
1. calculator.net/grade-calculator.html — key features: weighted grade (numeric or letter grades) with add-more-rows; "grade needed on remaining assignments" for a target course grade (Final Grade Goal + Weight of Remaining Tasks); dedicated Final Grade Calculator (grade needed on the final); grade format points/percentage/mix/letters; weight format % or points; letter-grade reference scale.
2. rapidtables grade + final-grade calculators — key features: weighted average grade, final grade needed = ((target − current×(1−w)) / w), letter grade table.
3. Easy-grader tools (easygrader.io etc.) — key features: EZ grader chart showing the % for every number wrong, half-point support, adjustable scale.

## Our current features
- EZ grader: total questions, count by wrong/correct, → percentage + letter grade
- Weighted grade: add/remove assignment rows (name, grade %, weight %), overall grade + letter
- Fully client-side, instant

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] "Final grade needed" calculator — the top differentiator on calculator.net & rapidtables. Given current grade, target grade, and weight of the remaining task/final, compute the score needed. Small third panel, one formula. High search demand ("what do I need on my final").
- [ ] Weight-format flexibility (points vs %) — weighted section assumes % weights; competitors also accept points-earned/points-possible. Optional, lower priority.
- [ ] EZ grader full chart — easy-grader tools show the score for every possible number wrong at a glance (teachers grading a stack). Optional expandable table; nice-to-have, not core.
