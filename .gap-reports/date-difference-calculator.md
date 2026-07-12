# date-difference-calculator
verdict: gaps

## Competitors
1. timeanddate.com/date/duration.html — days/weeks/months/years breakdown; "include end date (+1 day)" toggle; option to count/exclude weekends and holidays (business days); weekday names; semantic "X weeks Y days" phrasing.
2. calculator.net/date-calculator.html — two tools: Days Between (with "include end day", full US federal holiday presets + custom holidays, count/skip holidays) and Add/Subtract (years/months/weeks/days, "calculate in business days" excluding weekends and/or holidays).
3. omnicalculator.com (days between dates) — inclusive/exclusive endpoints, business-days-only mode, breakdown in multiple units, complete/partial week+day output.

## Our current features
- Difference between two dates: exact days, weeks (floor), months, and a Y/M/D calendar breakdown with correct end-of-month clamping.
- Add or subtract N days from a date.
- Auto-swaps reversed date order; seeds today + one month; all client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Business/working-days count — exclude weekends (and optionally holidays) between the two dates. All three competitors have it. Implement client-side: iterate day-by-day (or compute via weekday math) counting Mon–Fri; optionally subtract a small built-in US federal-holiday list for the spanned years.
- [ ] "Include end date" toggle — adds 1 to the day count (inclusive counting). One checkbox; add 1 to `days` when checked. Common request for billing/booking spans.
- [ ] Weekday of result — show the day-of-week for the add/subtract output (and optionally start/end). One `toLocaleDateString` with `weekday:'long'`; low effort, useful for "what day will it fall on".
- [ ] Add/subtract in weeks/months/years — the add-subtract panel only does days; competitors let you add months/years too. Extend with unit dropdown using `setMonth`/`setFullYear`.
