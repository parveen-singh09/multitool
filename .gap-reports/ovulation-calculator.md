# ovulation-calculator
verdict: gaps

## Competitors
1. calculator.net/ovulation-calculator — key features: inputs LMP date + average cycle length (22–44 dropdown); outputs estimated ovulation/fertile window plus related dates; print option; explains BBT and OPK/LH-kit methods; birth-control disclaimer; links to pregnancy + due-date tools.
2. whattoexpect.com ovulation calculator — key features: LMP + cycle length; produces a calendar/timeline of fertile days across upcoming months, estimated due date if conception occurs, and "best days to conceive"; multi-cycle projection.
3. babycenter / clearblue ovulation calculators — key features: fertile-window calendar view, several months of predicted ovulation dates, most-fertile "peak" days highlighted, estimated due date, and boy/girl timing notes; some offer "when to test" for OPKs.

## Our current features
- Inputs: LMP date + average cycle length (20–45)
- Outputs: estimated ovulation date, fertile window (5 days before → 1 day after), next period date
- Clean single-cycle result; fully client-side; clear "not contraception" disclaimer

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Estimated due date if conception occurs — trivial add (ovulation + 266 days, or LMP + 280). Every major competitor shows it and it's a top user intent. One line.
- [ ] Multi-cycle projection (next 3–6 cycles) — list ovulation date + fertile window for the coming few months, not just one. Loop adding cycle length N times. Competitors lead with this calendar view.
- [ ] Highlight the peak/most-fertile days (ovulation day and day before) distinctly from the wider window — small labelling improvement; matches Clearblue/BabyCenter framing that users expect.
