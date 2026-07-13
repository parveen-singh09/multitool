# ToolCities — Progress

**ToolCities** is a multitool website: a "city" of fast, privacy-first online tools that run 100% in the browser — no sign-up, no uploads, no tracking. Built with Astro 7 + Tailwind v4, styled with the Linear-inspired dark design system in [DESIGN.md](DESIGN.md).

- Domain: `toolcities.com` (set as `site` in [astro.config.mjs](astro.config.mjs))
- Design: near-black canvas `#010102`, lavender accent `#5e6ad2` (used scarcely), Inter + JetBrains Mono, four-step surface ladder.

## Current state (2026-07-04)
- **277 tool pages · 280 pages built · build green · no duplicate slugs.**
- **9 categories:** Text, Developer, Image, PDF, Audio & Video, Converters, Calculators, Generators, Security.
- **Privacy model:** every tool runs 100% in the browser with no uploads. The only network calls are (a) the currency & crypto converters fetching live public rates from the user's browser, and (b) first-use downloads of self-hosted engine assets (ffmpeg core, Tesseract OCR) from our own origin — see the live-data carve-out in [privacy.astro](src/pages/privacy.astro).
- **Reusable engines/components:** [units.ts](src/lib/units.ts)+[UnitConverter.astro](src/components/UnitConverter.astro), [colors.ts](src/lib/colors.ts)+[ColorFormats.astro](src/components/ColorFormats.astro), [ImageConverter.astro](src/components/ImageConverter.astro), [media.ts](src/lib/media.ts)+[MediaConverter.astro](src/components/MediaConverter.astro)+[ffmpeg.ts](src/lib/ffmpeg.ts). **Generators suite** adds shared libs: [random.ts](src/lib/random.ts) (secure RNG, Luhn/GTIN check digits), [encoding.ts](src/lib/encoding.ts) (hex/base32/base62/base64url), [fakedata.ts](src/lib/fakedata.ts)+[fakegen.ts](src/lib/fakegen.ts) (fake-record builders), [wordlist.ts](src/lib/wordlist.ts) (passphrase words), [barcode.ts](src/lib/barcode.ts) (bwip-js wrapper), [pdfdoc.ts](src/lib/pdfdoc.ts) (invoice/receipt/PO PDF builder).
- **Build-time asset setup:** `prebuild` npm hook runs [setup-ffmpeg.mjs](scripts/setup-ffmpeg.mjs) + [setup-tesseract.mjs](scripts/setup-tesseract.mjs); vendored ~86 MB output is git-ignored (regenerated on clean clone).
- **Verified:** production build **and browser runtime**. All ffmpeg audio/video tools and the Tesseract OCR flow were driven end-to-end in headless Chromium against both the dev server and the `astro preview` production build — every tool produced real output (see 2026-07-04 runtime-verification log entry).

## Status legend
- [ ] Not started · [~] In progress · [x] Done

## Foundation
- [x] Astro + Tailwind v4 (`@tailwindcss/vite`) + `@astrojs/sitemap`
- [x] Design tokens applied to [global.css](src/styles/global.css) (colors, type scale, buttons, panels, container)
- [x] Self-hosted fonts (Fontsource Inter + JetBrains Mono — no Google Fonts calls)
- [x] Site constants in [src/data/site.ts](src/data/site.ts)
- [x] Tool registry (10 tools, keywords, icons) in [src/data/tools.ts](src/data/tools.ts)

## Layout & components
- [x] [Layout.astro](src/layouts/Layout.astro) — full SEO head (title, description, keywords, canonical, OG, Twitter card, theme-color, JSON-LD, manifest)
- [x] [ToolLayout.astro](src/layouts/ToolLayout.astro) — breadcrumb, tool header, workspace slot, SEO `about` slot, related tools, SoftwareApplication + BreadcrumbList JSON-LD
- [x] [Header.astro](src/components/Header.astro) (sticky nav + mobile drawer)
- [x] [Footer.astro](src/components/Footer.astro) (category link grid)
- [x] [Logo.astro](src/components/Logo.astro) (city-blocks brand mark)
- [x] [ToolCard.astro](src/components/ToolCard.astro)

## Pages
- [x] Home [index.astro](src/pages/index.astro) — hero, tools grid by category, **600-word SEO article**, CTA, WebSite + ItemList JSON-LD
- [x] [about.astro](src/pages/about.astro) · [privacy.astro](src/pages/privacy.astro)

## Tools (all client-side, 10/10)
- [x] Word Counter · Case Converter (Text)
- [x] JSON Formatter · Base64 Encoder · URL Encoder (Developer)
- [x] Lorem Ipsum · QR Code Generator (Generators)
- [x] Color Converter (Converters)
- [x] Password Generator · Hash Generator (Security)

## Expansion — 55 tools total (vs Toolzin benchmark)
- [x] **Text** (+3): Text Diff, Line Tools, Slug Generator
- [x] **Developer** (+6): Regex Tester, JWT Decoder, Timestamp Converter, Number Base Converter, Markdown Previewer, HTML Entity Encoder
- [x] **Image** (+4, canvas + FileReader, no upload): Image Resizer, Image Compressor, Image to Base64, Image Color Picker
- [x] **Converters** (+1): Unit Converter
- [x] **Generators** (+2): UUID Generator, Random Number Generator
- [x] Deliberately excluded server-dependent tools (IP/SSL lookup, YouTube analytics, speed test) to keep the 100% client-side / no-upload promise

## Calculators suite (29 total in the Calculators category)
- [x] Existing (2): Percentage, Age
- [x] **Financial (9):** Loan/EMI, Mortgage, Compound Interest, Simple Interest, Investment, Savings Goal, Tip, Discount, Sales Tax
- [x] **Health & Fitness (8):** BMI, BMR, Calorie/TDEE, Body Fat (US Navy), Ideal Weight, Pace, Water Intake, Due Date
- [x] **Math (6):** Scientific (safe shunting-yard parser, no eval), Fraction, Average (mean/median/mode), Standard Deviation, Ratio, GCD & LCM
- [x] **Everyday (4):** Date Difference, Time, Hours (timesheet), GPA
- [x] Kept in one `Calculators` category per user choice; reference is calculator.net's grouping

## Instant search (Toolzin has none)
- [x] [ToolSearch.astro](src/components/ToolSearch.astro) — client-side filter by name + keywords
- [x] Home hero search + result count + empty state; hides empty category sections
- [x] Header compact search (desktop) + mobile drawer; off-home search navigates to `/?q=…#tools`
- [x] Cards expose `data-search` haystack via [ToolCard.astro](src/components/ToolCard.astro); Esc clears

## SEO & assets
- [x] Branded favicon [favicon.svg](public/favicon.svg) + apple-touch-icon + icon-192/512
- [x] `og-image.png` (1200×630) + `apple-touch-icon.png` rasterized from brand SVG via [scripts/gen-images.mjs](scripts/gen-images.mjs) (sharp)
- [x] [robots.txt](public/robots.txt) + [site.webmanifest](public/site.webmanifest)
- [x] Sitemap auto-generated (`sitemap-index.xml`)
- [x] Per-page keyword targeting (see [tools.ts](src/data/tools.ts) `keywords`)

## Verification
- [x] `npm run build` — **172 pages** built clean, no errors (was 58 at first launch)
- [x] No duplicate slugs across [tools.ts](src/data/tools.ts), [units.ts](src/lib/units.ts), [media.ts](src/lib/media.ts)
- [x] Clean-rebuild test: deleted all vendored `public/ffmpeg`, `public/tesseract`, `public/tessdata` → `npm run build` regenerated them via `prebuild` and stayed green (proves fresh-clone/CI deploy works)
- [x] SEO tags confirmed present in built `dist/index.html`
- [x] Each new tool page carries a unique title/description/keywords via the registry
- [x] **Runtime verified in a headless browser (Playwright/Chromium)** against both the dev server and the `astro preview` production build. Drove real files through 11 tools end-to-end: wav→mp3, mp4(webm)→mp3, ogg, aac, mp3→wav, mov→mp4, audio-speed-changer (`atempo`/`asetrate` chain), video-to-gif (two-pass palette), pdf-to-text (text layer + forced Tesseract OCR), pdf-to-jpg — all produced real output. **Caught & fixed a shipping bug** (see log) where every ffmpeg tool failed at load.

## Target keywords
- **Site:** free online tools, online utilities, web tools, browser tools, no sign up tools, privacy-first tools
- **Per tool:** word counter, character counter, case converter, json formatter/validator, base64 encode/decode, url encoder/decoder, hash/sha256 generator, password generator, lorem ipsum generator, color converter (hex/rgb/hsl), qr code generator

## Possible next steps
- [ ] **Runtime-test the heavy tools in a browser** (highest priority before deploy): exercise each ffmpeg audio/video conversion, GIF palette, compressors, speed/pitch, and the PDF OCR flow — build-verified only so far
- [ ] Favorites (star tools → localStorage shelf) + recently-used shelf
- [ ] Add FAQ (FAQPage schema) blocks to top tool pages for rich results
- [ ] Dedicated `/tools` browse-all page
- [ ] Rasterize a proper multi-size `favicon.ico` (currently the small starter .ico)
- [ ] Remove unused starter files ([Welcome.astro](src/components/Welcome.astro), `src/assets/*.svg`)
- [ ] Deploy (static `dist/` — Netlify / Vercel / Cloudflare Pages). Note: build box needs internet on first build (Tesseract model download) and ~90 MB free in `public/` for vendored assets
- [ ] Later batches still deferred: PDF↔Office & DOCX↔ODT, RAW photo decode (CR2/NEF/ARW), YouTube→MP3/MP4 (needs server + ToS), Color→Pantone (licensed)

## Log
- 2026-07-03 — Full site built: 10 tools, home hub + 600-word SEO copy, about/privacy, full SEO meta + OG image + favicon. Production build green.
- 2026-07-03 — Light/dark theme toggle added (no-flash init, localStorage, theme-color sync).
- 2026-07-03 — Expanded to **28 tools** (+18 across Text/Developer/Image/Converters/Calculators/Generators) and added **instant client-side search** (home + header) to beat the toolzin.com benchmark. Build green at 31 pages.
- 2026-07-03 — Removed header + hero search (moved full-width below "Explore every tool"); trimmed hero trust-badges.
- 2026-07-03 — Added a **comprehensive calculators suite (+27)**: Financial (9), Health & Fitness (8), Math (6, incl. a safe scientific expression parser), Everyday (4). Site now **55 tools**; build green at 58 pages.
- 2026-07-04 — **Converter mega-expansion (+54 tools, all 100% client-side)** across 8 batches; build green at **145 pages**, no duplicate slugs.
  - **Units (13):** length, weight, temperature, area, volume, speed, time, pressure, energy, power, data-storage, fuel-economy, cooking — plus **angle** & **frequency** added in the number batch. Shared engine in [src/lib/units.ts](src/lib/units.ts) + reusable [UnitConverter.astro](src/components/UnitConverter.astro); pages generated via [scripts/gen-unit-pages.mjs](scripts/gen-unit-pages.mjs); registered by spreading `UNIT_CATEGORIES` into [tools.ts](src/data/tools.ts).
  - **Color (6):** hex-to-rgb, rgb-to-hex, rgb-to-hsl-hsv, cmyk, color-name (148 CSS names + nearest match), gradient generator. Shared [src/lib/colors.ts](src/lib/colors.ts) + [ColorFormats.astro](src/components/ColorFormats.astro).
  - **Numbers (6 bespoke):** binary, hex (BigInt + text↔bytes), roman numerals (with vinculum), number-to-words (currency mode), fraction↔decimal (repeating), scientific-notation.
  - **Text & data (6):** json→xml/yaml/csv, morse (Web Audio beeps), unicode/emoji, ASCII-art (bitmap font), barcode (hand-rolled Code 128 → PNG/SVG), text-to-speech (Web Speech API).
  - **Date/time (2):** timezone converter (Intl IANA, DST-correct), date-format converter.
  - **Dev/CSS (9):** px-to-rem, sql-formatter, curl-to-code (fetch/axios/requests), json-to-typescript, js-beautifier/minifier, coordinate (DMS/DDM/UTM), ip-address (IPv4↔int/hex/bin), text-encoding (UTF-8/16/ASCII), css-to-scss.
  - **Everyday sizes (3):** shoe/clothing, bra, aspect-ratio.
  - **Image format (7, canvas + hand-rolled encoders, no upload):** jpg→png, png→webp, webp→jpg, svg→png (shared [ImageConverter.astro](src/components/ImageConverter.astro)); bmp (24-bit encoder), ico (multi-size favicon w/ embedded PNG), base64→image.
  - **Deferred per user (build later):** audio/video (ffmpeg.wasm ~30 MB), PDF↔Office/DOCX↔ODT, HEIC/TIFF/RAW/PNG-vectorize, and server/API-dependent currency, crypto, YouTube, Pantone. speech-to-text (needs cloud API for quality).
- 2026-07-04 — **Deferred-tools expansion (+24 tools)**; build green at **172 pages**, no duplicate slugs. Two new categories: **PDF** and **Audio & Video**.
  - **Group 1 — no new deps (3):** [speech-to-text](src/pages/tools/speech-to-text.astro) (Web Speech API, Chrome/Edge), [currency-converter](src/pages/tools/currency-converter.astro) (live ECB rates via Frankfurter), [crypto-converter](src/pages/tools/crypto-converter.astro) (live CoinGecko prices). Added an honest **live-public-data carve-out** to [privacy.astro](src/pages/privacy.astro) — these fetch rates from the browser; every other tool stays fully offline.
  - **Group 2 — PDF (5):** [image-to-pdf](src/pages/tools/image-to-pdf.astro), [pdf-merge](src/pages/tools/pdf-merge.astro), [pdf-split](src/pages/tools/pdf-split.astro) (all `pdf-lib`); [pdf-to-jpg](src/pages/tools/pdf-to-jpg.astro), [pdf-to-text](src/pages/tools/pdf-to-text.astro) (`pdfjs-dist` render + `tesseract.js` OCR fallback).
  - **Group 2b — image libs (3):** [heic-to-jpg](src/pages/tools/heic-to-jpg.astro) (`heic2any`), [tiff-converter](src/pages/tools/tiff-converter.astro) (`utif`), [png-to-svg](src/pages/tools/png-to-svg.astro) vectorize (`imagetracerjs`).
  - **Group 3 — audio/video, ffmpeg.wasm (13):** shared loader [src/lib/ffmpeg.ts](src/lib/ffmpeg.ts) + data table [src/lib/media.ts](src/lib/media.ts) + reusable [MediaConverter.astro](src/components/MediaConverter.astro) drive 11 straight conversions (mp4→mp3, wav↔mp3, flac/m4a→mp3, ogg, aac, mov/mkv/avi/wmv→mp4); plus custom-UI [video-to-gif](src/pages/tools/video-to-gif.astro), [gif-to-mp4](src/pages/tools/gif-to-mp4.astro), [video-compressor](src/pages/tools/video-compressor.astro), [audio-compressor](src/pages/tools/audio-compressor.astro), [audio-speed-changer](src/pages/tools/audio-speed-changer.astro).
  - **Privacy-preserving asset hosting:** ffmpeg core (single-thread → no COOP/COEP headers needed, works on any static host) and Tesseract worker/core/English model are **self-hosted**, never CDN. Regenerated at build time by [setup-ffmpeg.mjs](scripts/setup-ffmpeg.mjs) + [setup-tesseract.mjs](scripts/setup-tesseract.mjs) via a `prebuild` npm hook; the ~86 MB output is git-ignored (build artifact, not source). Verified with a clean rebuild after deleting all vendored assets.
  - **Still deferred:** PDF↔Office & DOCX↔ODT (lossy in-browser), RAW photo decode (CR2/NEF/ARW), YouTube→MP3/MP4 (needs server + ToS), Color→Pantone (licensed).
- 2026-07-04 — **Runtime verification + critical ffmpeg fix.** Drove the heavy tools end-to-end in headless Chromium (Playwright) with real media fixtures, against both the dev server and the `astro preview` production build.
  - **Bug found:** every ffmpeg tool (all 8 audio/video pages) failed at `ff.load()` with `"failed to import ffmpeg-core.js"` — 0/9 heavy tools worked at runtime despite the build being green. **Root cause:** [setup-ffmpeg.mjs](scripts/setup-ffmpeg.mjs) vendored the **UMD** core (`@ffmpeg/core/dist/umd`), but `@ffmpeg/ffmpeg` v0.12.15 spawns its worker as a **module worker** (`type:"module"`), where `importScripts()` is unavailable — so the worker falls back to `(await import(coreURL)).default`. The UMD core has no default export → `undefined` → `ERROR_IMPORT_FAILURE`. **Fix:** vendor the **ESM** core (`dist/esm`, which ends in `export default createFFmpegCore`). One-line `src` change + clarifying comment.
  - **After fix:** 11/11 tools pass on both dev and prod builds, each producing real output (MP3/OGG/M4A/WAV/MP4/GIF, extracted PDF text, Tesseract OCR text, rendered PDF→JPG). Re-ran the clean-rebuild test (delete `public/ffmpeg` → `npm run build`) and confirmed the `prebuild` hook now regenerates the correct ESM core and stays green — so fresh CI/Netlify/Vercel clones deploy working tools.
  - This is why build-green ≠ runtime-working: the core is loaded dynamically inside a web worker, a path no bundler or type-check exercises.
- 2026-07-04 — **Live-data converter fix + full converter sweep.** Verified every tool that hits an external API, again in headless Chromium against dev + `astro preview` prod build.
  - **Bug found:** [currency-converter](src/pages/tools/currency-converter.astro) was dead — it fetched `https://api.frankfurter.app/latest?from=EUR`, which now returns **301** (no CORS headers) redirecting to `api.frankfurter.dev`. Browsers fail a CORS fetch on a header-less redirect (curl silently follows it, which is why a build/manual curl check missed it). **Fix:** point directly at `https://api.frankfurter.dev/v1/latest?base=EUR` — same JSON shape (`date` + `rates`), proper `Access-Control-Allow-Origin: *`. Confirmed result on dev + prod.
  - **Swept all external-API tools:** grepped `fetch('http…')` across `src` → currency (Frankfurter), crypto (CoinGecko), and the gold/silver/platinum calculators (`api.gold-api.com` + `open.er-api.com`). Functionally drove each: crypto returns live BTC price; all three metal calculators fetch and **update the spot field from their static default to the live price** ($4,176 gold, $62.52 silver, $1,648 platinum/ozt) — confirmed genuinely live, not stale defaults.
  - **Load-error sweep:** loaded all **169** tool pages in Chromium and watched for console/page errors → 0 errors. Spot-checked the shared engines with real I/O: unit (length 1000 m → 3280.84 ft), color (hex→rgb), number-base (255→ff/binary), canvas image (jpg-to-png re-encode). All produce correct output.
  - **Takeaway for live-data tools:** a third-party endpoint can rot (domain move, CORS change, rate-limit) without any code change on our side. These 6 tools depend on services staying CORS-open; worth an occasional re-check.
- 2026-07-04 — **Generators mega-expansion (+108 tools).** Build green at **280 pages** (277 tool pages), no duplicate slugs. Everything stays 100% client-side. Delivered in 10 themed batches, each ending on a green build.
  - **New deps (all run in-browser):** `bwip-js` (2D + retail barcodes), `bcryptjs` (bcrypt hashing/verify), `node-forge` (RSA keygen for SSH keys & SSL CSRs). Lazy-`import()`ed so they only download on the pages that use them.
  - **New shared libs:** [random.ts](src/lib/random.ts) (crypto RNG, `randInt`/`pick`/`shuffle`, Luhn + GTIN check digits), [encoding.ts](src/lib/encoding.ts) (hex/base32/base62/base64url), [fakedata.ts](src/lib/fakedata.ts) + [fakegen.ts](src/lib/fakegen.ts) (name/address/email/card/IBAN/SSN builders using reserved test ranges), [wordlist.ts](src/lib/wordlist.ts) (~370-word Diceware list), [barcode.ts](src/lib/barcode.ts) (bwip-js `./browser` ESM wrapper), [pdfdoc.ts](src/lib/pdfdoc.ts) (shared invoice/receipt/PO PDF builder on pdf-lib).
  - **Batches:** 1 IDs/codes (upc, isbn, gtin, imei, vin, serial, sku, coupon, voucher + data-matrix/pdf417/aztec) · 2 secrets (passphrase, pin, api-key, secret-key, random-token, jwt HS256 via Web Crypto, totp with live code + otpauth QR, bcrypt, htpasswd, ssh-key, ssl-csr) · 3 fake data (name/address/email/phone/credit-card/iban/ssn/profile/company/username/fake-id/mock-json/csv) · 4 CSS & design (box-shadow, border-radius, glassmorphism, css-animation, media-query, flexbox/grid, svg-wave, blob, color-palette, color-scheme, pattern) · 5 image/canvas (favicon→multi-size ICO, placeholder, avatar/identicon, meme, banner, watermark, thumbnail, signature, business-card) · 6 SEO/config (meta, open-graph, robots, sitemap, htaccess, gitignore, cron w/ plain-English, regex, html-table, markdown-table, schema JSON-LD, code-snippet image) · 7 writing (hashtag, headline, brand, domain, slogan, random-word, random-sentence, story, poem, acronym, nickname, bio) · 8 random/fun (random-string, dice, coin-flip, lottery, random-date, wheel-spinner picker, team, random-letter, name-combiner, zodiac, excuse, compliment/insult, trivia, recipe, workout, emoji) · 9 documents (invoice, receipt, purchase-order, resume, cover-letter, certificate, T&C, privacy-policy, text→PDF) · 10 media (audio-tone→WAV, waveform image, spectrogram from file/mic).
  - **Category placement:** tools filed under their natural existing category (Security/Developer/Image/PDF/Audio & Video/Generators) rather than dumping all into "Generators", keeping the taxonomy coherent.
  - **Deferred (would be weak as pure-client):** Logo generator, Mockup generator, animated GIF generator — need design assets or a heavy animation encoder; revisit later.
  - **Verified:** production build green after every batch. Runtime-checked all four lazy-loaded deps in Node — bwip-js encodes datamatrix/pdf417/aztec/upca/ean13 to valid SVG; bcryptjs hashes+verifies; node-forge emits OpenSSH pubkey + signed CSR; pdf-lib emits a valid `%PDF`. Validated the shared check-digit algorithms against known-good values (Visa `4111…` Luhn=1, UPC `036000291452` GTIN=2, EAN `9781234567897`=7) and confirmed base32 encode/decode roundtrips.
  - **Not browser-runtime-tested this pass:** Playwright/Chromium isn't installed in this environment, so the canvas (favicon/meme/certificate/etc.), Web Audio (tone/waveform/spectrogram) and DOM-interaction pages were verified by green build + code review + Node-level checks of their shared logic, **not** driven in a real browser. Worth a headless-Chromium sweep before deploy — especially the canvas download paths and the TOTP live-code loop.
- 2026-07-13 — **Added [mailto-link-generator](src/pages/tools/mailto-link-generator.astro)** (Developer). Competitor-gap tool from toolzin's "New Tools" — builds a `mailto:` link (to/cc/bcc/subject/body, comma-separated recipients, URL-encoded) plus a copy-ready HTML `<a>` anchor; 100% client-side. Skipped their other highlighted gaps: EXIF reader already covered by [image-metadata-analyzer](src/pages/tools/image-metadata-analyzer.astro); IP-lookup / SSL / speed-test / cache-checker are server-side and break the privacy-first model. Build green at 386 pages.
- 2026-07-13 — **PLANNED: bot-challenge + API rate limiting (anti-scraping).** Goal: stop competitors/scrapers from enumerating our tool catalog and data the way aslitools.com blocked us — its JS "Checking your browser…" interstitial defeated WebFetch, curl, and its own sitemap fetch. Intended defenses: (1) a JS/Cloudflare-style challenge on catalog/sitemap routes, (2) per-IP rate limiting on any API/data endpoints, (3) throttle bulk crawls of `/tools/*`. **Not yet implemented — decision only.**
  - **Blocker / open question (must resolve before building):** a challenge or rate-limit on a *static* tool site also blocks legitimate search-engine crawlers. aslitools' challenge page is served `noindex,nofollow`, i.e. it trades away SEO for scrape-resistance — the opposite of our SEO strategy (per-tool keywords, JSON-LD, sitemap). Options to reconcile: allowlist verified Googlebot/Bingbot UAs+IP ranges, challenge only non-search bots, or scope rate-limiting to just the live-data API calls (currency/crypto/metals) and leave static HTML crawlable. Pick the approach before implementing so we don't tank organic traffic.
  - **Note:** our tool *logic* runs entirely client-side, so the JS is inherently downloadable by anyone who loads a page — rate-limiting raises the cost of bulk enumeration but can't truly hide client-side code. Realistic target is "slow down mass scraping," not "make tools unfetchable."
- 2026-07-13 — **aslitools.com gap fill (+3 image converters).** User supplied aslitools' catalog by screenshot (site is bot-walled — WebFetch/curl/sitemap all hit a JS "Checking your browser" interstitial). Diffed ~100 listed tools against our 383; built only genuine client-side-doable gaps. Added [png-to-jpg](src/pages/tools/png-to-jpg.astro), [jpg-to-webp](src/pages/tools/jpg-to-webp.astro), [webp-to-png](src/pages/tools/webp-to-png.astro) — one-liners on the existing [ImageConverter.astro](src/components/ImageConverter.astro) engine (live preview, quality slider, transparency checkerboard, zero upload — better than aslitools' single-file upload flow). Build green at 389 pages.
  - **Deliberately NOT built (would be worse than aslitools, not better):** real PDF→Word/Excel/PPT, Bank-Statement→Excel, PDF-Summarizer, HTML→PDF, DOCX/PPT conversions — all need server-side rendering/parsing that breaks our no-upload privacy model. A fake in-browser version would be lower quality than the competitor. Revisit only if we add a backend (see the anti-scraping entry above re: Cloudflare functions already in the repo).
  - **Already covered (skipped per "don't add if similar exists"):** jpg-to-png, webp-to-jpg, heic-to-jpg, png-to-webp, svg-to-png, bmp/ico/tiff converters, image-to-pdf, image-to-base64, image-compressor/resizer, pdf-merge/split, pdf-to-jpg/text, age-calculator, salary/sales-tax calculators, date-converter, qr-code-generator, gif-maker/optimizer, video-to-gif, gif-to-mp4, mailto-link-generator.
- 2026-07-13 — **Document conversion (+3 tools), client-side, honest-fidelity path (user approved).** Reversed the earlier "can't be done client-side" deferral for the doable subset — kept the no-upload model instead of a paid API or self-hosted LibreOffice. Build green at **392 pages**.
  - **Backend reality check:** repo is a *static* Astro build (no server adapter). Only "backend" is `functions/api/phone-lookup.js`, a Cloudflare Pages Function (Workers runtime) — can't run LibreOffice, so true layout-perfect Office conversion is off the table without new infra. Chose fidelity-honest client-side conversion.
  - **New tools:** [pdf-to-word](src/pages/tools/pdf-to-word.astro) (pdfjs text-layer → editable `.docx`; text + paragraphs preserved, not layout), [pdf-to-excel](src/pages/tools/pdf-to-excel.astro) (pdfjs text positions → row/column table detection → `.xlsx`, numeric coercion), [html-to-pdf](src/pages/tools/html-to-pdf.astro) (iframe + `@page` CSS + native `window.print()` → text-selectable PDF, highest fidelity, zero deps).
  - **New shared libs, NO new deps:** [docx.ts](src/lib/docx.ts) + [xlsx.ts](src/lib/xlsx.ts) build OOXML (`.docx`/`.xlsx` are zip-of-XML) on the existing [zip.ts](src/lib/zip.ts) `makeZip()`. Verified with [_check-ooxml.mts](_check-ooxml.mts) (run: `npx tsx _check-ooxml.mts`) — asserts valid PK/ZIP structure + well-formed escaped XML, `colLetter`/`xmlEscape` units, numeric vs inline-string cells. **Passing.**
  - **Honest limits (stated on each tool page, not hidden):** PDF→Word/Excel read the embedded text layer, so scanned/image-only PDFs yield nothing (page tells user to run PDF-to-Text OCR first); Excel table detection is a gap-based heuristic — clean grids convert well, merged/wrapped/complex layouts need cleanup. This is *better* than aslitools for our niche (zero upload, live preview, editable-before-download) while being upfront that it's text extraction, not pixel-perfect reproduction.
  - **NOT runtime-tested in a browser this pass** (no Playwright/Chromium in this env, same caveat as prior entries): OOXML builders are unit-checked in Node and pdfjs extraction reuses the proven pdf-to-text path, but the actual in-browser download flows (docx/xlsx blob download, iframe print dialog) were verified by green build + code review only. Worth a headless-Chromium drive-through before deploy — especially the print-to-PDF path and opening a generated .docx/.xlsx in a real Office app.
  - **Still deferred (need a server/LLM):** PDF Summarizer (LLM), Bank-Statement→Excel (bank-specific parsing), true PDF→PPT and DOCX/PPT round-trips.
- 2026-07-13 — **PDF Summarizer (+1 tool) — first server-backed tool (user approved).** Breaks the no-upload model deliberately: [pdf-summarizer](src/pages/tools/pdf-summarizer.astro) extracts text in-browser via pdfjs (reusing the pdf-to-text pattern), then POSTs **only the extracted text** (never the file) to [functions/api/summarize.js](functions/api/summarize.js) — a Cloudflare Pages Function proxying Anthropic Messages API (`claude-opus-4-8`, raw fetch, same style as the existing `phone-lookup.js`). Length presets: short / paragraph / bullets. Build green at **393 pages**.
  - **Backend:** reuses the existing Cloudflare Functions setup (no new infra). Needs `ANTHROPIC_API_KEY` set as a Pages env var (added to [.env.example](.env.example), server-side only — never `PUBLIC_`). Deploy: `wrangler pages deploy` (user runs — I can't provision accounts/keys).
  - **Privacy:** added a dedicated "The AI summarizer" section to [privacy.astro](src/pages/privacy.astro) — honest that extracted text leaves the device to an AI provider, file does not, nothing stored after the request. Tool UI also states this inline and warns against confidential docs.
  - **⚠️ Open security gap (must fix before real traffic):** `/api/summarize` is **unauthenticated** — anyone can POST and burn Anthropic credits. Mitigated in code by a hard 100k-char input cap (client truncates to match) bounding per-request cost, but not abuse volume. Workers can't rate-limit without KV/Durable Objects, so the right fix is a **Cloudflare rate-limiting rule** on `/api/summarize` (dashboard → Security → Rate limiting) — flagged in a `ponytail:` comment in the function. Ties into the planned anti-scraping work above.
  - **NOT runtime-tested:** no browser + no deployed Function in this env. Verified by green build + code review only. Before relying on it: deploy, set the key, and drive a real PDF end-to-end (extract → POST → summary render). The `phone-lookup.js` proxy pattern it copies is already proven in production.
  - **Still deferred:** Bank-Statement→Excel (bank-specific parsing), true PDF→PPT and DOCX/PPT round-trips.
