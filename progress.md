# ToolCities — Progress

**ToolCities** is a multitool website: a "city" of fast, privacy-first online tools that run 100% in the browser — no sign-up, no uploads, no tracking. Built with Astro 7 + Tailwind v4, styled with the Linear-inspired dark design system in [DESIGN.md](DESIGN.md).

- Domain: `toolcities.com` (set as `site` in [astro.config.mjs](astro.config.mjs))
- Design: near-black canvas `#010102`, lavender accent `#5e6ad2` (used scarcely), Inter + JetBrains Mono, four-step surface ladder.

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

## Expansion — 28 tools total (vs Toolzin benchmark)
- [x] **Text** (+3): Text Diff, Line Tools, Slug Generator
- [x] **Developer** (+6): Regex Tester, JWT Decoder, Timestamp Converter, Number Base Converter, Markdown Previewer, HTML Entity Encoder
- [x] **Image** (+4, canvas + FileReader, no upload): Image Resizer, Image Compressor, Image to Base64, Image Color Picker
- [x] **Converters** (+1): Unit Converter
- [x] **Calculators** (+2): Percentage Calculator, Age Calculator
- [x] **Generators** (+2): UUID Generator, Random Number Generator
- [x] Deliberately excluded server-dependent tools (IP/SSL lookup, YouTube analytics, speed test) to keep the 100% client-side / no-upload promise

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
- [x] `npm run build` — 31 pages built clean, no errors
- [x] SEO tags confirmed present in built `dist/index.html`
- [x] Each new tool page carries a unique title/description/keywords via the registry

## Target keywords
- **Site:** free online tools, online utilities, web tools, browser tools, no sign up tools, privacy-first tools
- **Per tool:** word counter, character counter, case converter, json formatter/validator, base64 encode/decode, url encoder/decoder, hash/sha256 generator, password generator, lorem ipsum generator, color converter (hex/rgb/hsl), qr code generator

## Possible next steps
- [ ] Favorites (star tools → localStorage shelf) + recently-used shelf
- [ ] Add FAQ (FAQPage schema) blocks to top tool pages for rich results
- [ ] Dedicated `/tools` browse-all page
- [ ] Rasterize a proper multi-size `favicon.ico` (currently the small starter .ico)
- [ ] Remove unused starter files ([Welcome.astro](src/components/Welcome.astro), `src/assets/*.svg`)
- [ ] Deploy (static `dist/` — Netlify / Vercel / Cloudflare Pages)

## Log
- 2026-07-03 — Full site built: 10 tools, home hub + 600-word SEO copy, about/privacy, full SEO meta + OG image + favicon. Production build green.
- 2026-07-03 — Light/dark theme toggle added (no-flash init, localStorage, theme-color sync).
- 2026-07-03 — Expanded to **28 tools** (+18 across Text/Developer/Image/Converters/Calculators/Generators) and added **instant client-side search** (home + header) to beat the toolzin.com benchmark. Build green at 31 pages.
