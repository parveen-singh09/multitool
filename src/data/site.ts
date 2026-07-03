// Shared site-wide constants used across SEO, header, footer and JSON-LD.

export const SITE = {
  name: 'ToolCities',
  domain: 'toolcities.com',
  url: 'https://toolcities.com',
  // Default social/OG image (absolute path resolved against `url`).
  ogImage: '/og-image.png',
  twitter: '@toolcities',
  tagline: 'Free online tools that run in your browser',
  description:
    'ToolCities is a free collection of fast, privacy-first online tools — word counter, password generator, JSON formatter, Base64 encoder, QR code generator and more. No sign-up, no uploads, everything runs in your browser.',
  // Primary site-level keywords.
  keywords: [
    'free online tools',
    'online utilities',
    'web tools',
    'text tools',
    'developer tools',
    'privacy-first tools',
    'browser tools',
    'no sign up tools',
  ],
} as const;
