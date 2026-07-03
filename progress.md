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

## SEO & assets
- [x] Branded favicon [favicon.svg](public/favicon.svg) + apple-touch-icon + icon-192/512
- [x] `og-image.png` (1200×630) + `apple-touch-icon.png` rasterized from brand SVG via [scripts/gen-images.mjs](scripts/gen-images.mjs) (sharp)
- [x] [robots.txt](public/robots.txt) + [site.webmanifest](public/site.webmanifest)
- [x] Sitemap auto-generated (`sitemap-index.xml`)
- [x] Per-page keyword targeting (see [tools.ts](src/data/tools.ts) `keywords`)

## Verification
- [x] `npm run build` — 13 pages built clean, no errors
- [x] SEO tags confirmed present in built `dist/index.html`

## Target keywords
- **Site:** free online tools, online utilities, web tools, browser tools, no sign up tools, privacy-first tools
- **Per tool:** word counter, character counter, case converter, json formatter/validator, base64 encode/decode, url encoder/decoder, hash/sha256 generator, password generator, lorem ipsum generator, color converter (hex/rgb/hsl), qr code generator

## Possible next steps
- [ ] Rasterize a proper multi-size `favicon.ico` (currently the small starter .ico)
- [ ] Add FAQ (FAQPage schema) blocks to top tool pages for rich results
- [ ] Remove unused starter files ([Welcome.astro](src/components/Welcome.astro), `src/assets/*.svg`)
- [ ] Deploy (static `dist/` — Netlify / Vercel / Cloudflare Pages)

## Log
- 2026-07-03 — Full site built: 10 tools, home hub + 600-word SEO copy, about/privacy, full SEO meta + OG image + favicon. Production build green.
