# time-calculator
verdict: gaps

## Competitors
1. calculator.net/time-calculator.html — key features: THREE tools — (a) duration add/subtract with **days** + hours + minutes + seconds, (b) **add/subtract time from a date** (start date+time, AM/PM/24h, "Now"), (c) **expression parser** ("1d 2h 3m 4s + 4h 5s - 2030s + 28h") supporting many operands.
2. timecalculator.net — key features: add/subtract h/m/s from a starting time, "Now" button, output as days+hours+minutes+seconds AND resulting clock time, arrow-key adjustment, clear button; separate duration-between-two-times tool linked.
3. timeanddate.com/date/timeduration.html — key features: duration between two full date-times, include/exclude end date, output in weeks/days/hours/minutes/seconds and combined units.

## Our current features
- Add or subtract two durations in hours/minutes/seconds.
- Normalised h/m/s output plus total seconds and total minutes.
- Handles negative results.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Days field — every competitor includes days in duration math; we cap at hours, so multi-day durations force manual hour conversion. Add a days input to each operand and fold into the seconds math. ~6 lines.
- [ ] More than two operands / chained add-subtract — calculator.net's expression tool and general use want summing several durations. Either allow "add row" or parse an expression. Bigger change; the add-row list is the lazier client-side option.
- [ ] Add/subtract a duration to a clock time or date — a distinct, high-traffic use case ("what time is it 3h40m from now?"). Could be a second mode reusing the same normalise logic plus a time/date input. Medium effort.
- [ ] Richer unit breakdown (also show total in hours, and days:h:m:s) — timeanddate shows multiple unit views; we show seconds and minutes only. Add total-hours and a d:h:m:s line. ~3 lines.
