# final-grade-calculator
verdict: gaps

## Competitors
1. rapidtables.com/calc/grade/final-grade-calculator.html — three tools: (1) required final = from current %, target %, final weight %; (2) **build current grade from multiple weighted assignments** (percentage OR letter grades, per-item weight) then required final, with a **grade-options table** (current / final-exam / class grade rows); (3) total class grade from current + final grade. Letter-grade support (A+…F). Calculate/Reset buttons.
2. calculator.net/grade-calculator.html — weighted Grade Calculator (labeled rows, numeric or letter, weights as % or points, 8+ rows) plus a "final grade planning" section (goal + weight of remaining tasks); separate Final Grade Calculator (current, wanted, final worth). Grade↔GPA↔% reference table.
3. rogerhub final grade calculator — the classic: required final from current + target + weight, plus reverse ("what's my grade if I score X on the final") and shows the max reachable grade.

## Our current features
- Current grade %, desired course grade %, final exam weight %.
- Required final exam score, with flags: already secured (≤0 → 0%), or not achievable (>100, shows max reachable with a perfect 100).
- Client-side, clear notes.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Reverse mode ("what final grade do I get?") — given current grade, final weight, and a hypothetical final score, compute the resulting course grade. RogerHub and RapidTables tool 3 do this. Simple inverse formula; add a mode toggle.
- [ ] "What-if" table of final scores → course grades — show a small table (e.g. final = 60/70/80/90/100 → resulting course grade). RapidTables has the grade-options table. Loop the existing formula; low effort, high clarity.
- [ ] Letter-grade support — accept/display letter grades (A/B/C…) mapped to % ranges, since students often think in letters. Optional mapping table; moderate effort.
- [ ] Build current grade from weighted categories — competitors let you enter homework/quiz/midterm weights to derive the current grade first. This overlaps with a broader "grade calculator"; consider whether it belongs here or a separate tool. Lower priority for THIS tool's scope.
