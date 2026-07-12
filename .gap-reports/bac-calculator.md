# bac-calculator
verdict: gaps

## Competitors
1. calculator.net/bac-calculator — gender; weight in **lb/kg/grams**; time since first drink (**hours + minutes**); alcohol entered by **drink type with real sizes & ABV presets** (beer/wine/liquor/custom "other" with metric+US volume units). Outputs BAC, US 0.08% legal-limit reference, and an **"effects by BAC" table** (0.001–0.029 → >0.50). Computes grams of alcohol from volume×ABV automatically.
2. reasonabalcohol / thecalculatorsite BAC — sex, weight, drinks, ABV, time; BAC estimate, impairment level, and **estimated time until sober / BAC returns to 0**.
3. omnicalculator BAC — sex, weight+units, drink volume + ABV, time; Widmark BAC, legal-status note, time-to-sober.

## Our current features
- Sex toggle, weight unit toggle (kg/lb), body weight, number of standard drinks, grams of alcohol per drink, hours since first drink.
- Widmark formula with 0.015/hr elimination, BAC %, impairment band (color-coded), total alcohol grams, amount eliminated.
- Strong, repeated "estimate only / never drive" safety messaging. Fully client-side.

## Gaps to close (only genuine missing/worse features; empty if already-wins)
- [ ] **Estimated time until sober (BAC → 0)** — present on most competitors and genuinely useful; trivial from existing numbers (`currentBAC / 0.015` hours). Add a result line "~N h until BAC returns to 0". Highest-value add.
- [ ] **Time until below legal limit (0.08%)** — companion to the above: `(BAC - 0.08)/0.015` hours when over. One computed line; reinforces the safety message.
- [ ] **Drink-type presets (beer/wine/liquor with ABV & size)** — asking users for "grams of alcohol per drink" is a knowledge barrier; competitors let you pick a drink type + size + ABV and derive grams. Add optional volume(ml/oz) × ABV% → grams helper so users don't need to know the 14g standard-drink figure. Keep the raw grams field as an advanced option.
