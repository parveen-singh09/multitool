# inflation-calculator
verdict: gaps

## Competitors
1. calculator.net/inflation-calculator — key features: three modes (CPI historical-data conversion 1913–2026 via year dropdowns, forward flat-rate, backward flat-rate); historical US inflation-rate chart; worked CPI examples.
2. officialdata.org / in2013dollars.com — key features: CPI conversion 1635–2026; outputs cumulative change %, average annual rate, CPI for each year; CSV/Excel export; inflation by category (food/housing/etc.), by city, and by country; historical chart.
3. thecalculatorsite.com inflation calculator — key features: multi-country CPI datasets (US/UK/etc.), currency selection, historical rate lookups.

## Our current features
- Flat-rate forward projection (equivalent future cost).
- Backward purchasing-power (today's money after N years).
- Total inflation over the period.
- Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Historical CPI year-to-year conversion mode — every top competitor's headline feature: "what is $X in year A worth in year B" using real annual CPI figures. Implement by bundling a small static CPI table (annual US CPI-U, ~110 numbers, 1913–present) as a JSON/TS const in src/data; conversion is amount × CPI_target / CPI_source. Stays fully client-side and privacy-first.
- [ ] Derived stats on the historical mode — cumulative price change % and average annual rate between the two years. One-line each once the CPI table exists.
