# pace-calculator
verdict: gaps

## Competitors
1. calculator.net/pace-calculator — key features: solve time/distance/pace (any two); US/metric/other unit tabs; distance in mi/km/m/yd; preset events dropdown (Marathon, Half, 1K, 5K, 10K, 1mi, 5mi, 10mi, 800m, 1500m); 8 pace/speed units (per mi, per km, mph, kph, m/min, m/s, yd/min, yd/s); separate Multipoint Pace Calculator (up to 12 segments/laps with per-row units); Pace Converter; Finish-Time-from-partial calculator; world-record pace reference table; heart-rate/zone training content.
2. omnicalculator.com/sports/pace — key features: race distance selector with presets + custom; outputs pace in many units + speed (km/h); race-time predictor (accounts for pace fade over distance, Riegel-style); runner comparison against levels (World Record → Beginner) with table/chart; works for cycling/skating too; share/reload/clear.
3. runnersworld / vdoto2 pace tools — key features: race-time equivalency/prediction across distances, goal splits per mile/km, and finish-time targets.

## Our current features
- Solve for pace, time, or distance from any two inputs
- Distance in km or mi
- hh:mm:ss and mm:ss parsing (lenient), clean solve-for-blank UX
- Fully client-side

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] Preset race-distance dropdown — one-tap fill for 5K/10K/half/marathon/1mi/etc. Both competitors have it; big time-saver. Static list of {label, km} that sets the distance field + unit.
- [ ] Split table (per-km / per-mile splits for the entered pace) — when distance+pace known, list cumulative time at each km/mile. Pure loop over distance, formatting existing fmt(). This is the single most-requested pace feature we lack.
- [ ] Speed units (mph / kph) — add a mode so users can read pace as speed, not just min/unit. calculator.net and Omni both do this. Small: convert seconds-per-unit ↔ units-per-hour.
- [ ] Race-time predictor across distances (Riegel: T2 = T1 × (D2/D1)^1.06) — predict a target-race finish from a known result. Both competitors offer it; one formula, two distance inputs.
