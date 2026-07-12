# gematria-calculator
verdict: gaps

## Competitors
1. gematrix.org — key features: English, Hebrew, Jewish, Simple, Latin gematria; large searchable DATABASE that returns other words/phrases sharing the same value; search-by-number; rude-words toggle; stats + recent feed; apps/extension. (DB is server-backed.)
2. gematriacalculator.us — key features: huge cipher list grouped by family — Pythagorean (Full/Single Reduction + reverses), Alphabetic Order (Ordinal, Reverse, Bacon, Extended, Sumerian, Satanic), Jewish (Reduced/Ordinal/full), Kabbalah (ALW/KFW/LCH), Mathematical (Primes, Trigonal, Squares), Septenary, Chaldean; English + Hebrew + Greek + Arabic; toggles for letter/word count, reduction, cipher chart; history.
3. Various (e.g. gematriaeffect / dcode) — key features: many ciphers, per-letter breakdown, cipher reference charts.

## Our current features
- English Ordinal, Full Reduction, Reverse Ordinal, Jewish/Latin, Hebrew Standard
- Per-letter breakdown (ordinal)
- Auto-detects Hebrew text
- Fully client-side (privacy-first)

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] More ciphers — competitors differentiate on breadth. Highest-value additions, all pure client-side arithmetic: Sumerian (ordinal × 6), Reverse Reduction, Single Reduction, Satanic (A=36…), and Greek isopsephy for Greek input. Each is a few lines in the same sumLatin pattern.
- [ ] Cipher reference chart — a collapsible A–Z value table per cipher; helps users verify and is common on ranking pages. Static render, no data cost.
- [ ] (Skip) Word-match database — gematrix's headline feature requires a server-side corpus + search; violates the privacy-first, client-side design. Do not implement.
