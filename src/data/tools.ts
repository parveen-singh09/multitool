// Central tool registry. Drives the home grid, dynamic routes, sitemap,
// and per-tool SEO. Each tool is a "district" in ToolCities.

import { UNIT_CATEGORIES } from '../lib/units';

export type ToolCategory =
  | 'Text'
  | 'Developer'
  | 'Image'
  | 'Converters'
  | 'Calculators'
  | 'Generators'
  | 'Security';

export interface Tool {
  slug: string;
  name: string;
  /** Short tagline for cards. */
  tagline: string;
  /** Longer meta description (~150 chars) for the tool page. */
  description: string;
  category: ToolCategory;
  /** SEO keywords targeted by this tool page. */
  keywords: string[];
  /** Simple line-icon path drawn on a 24x24 viewbox. */
  icon: string;
}

export const tools: Tool[] = [
  {
    slug: 'word-counter',
    name: 'Word Counter',
    tagline: 'Count words, characters, sentences & reading time.',
    description:
      'Free online word counter. Instantly count words, characters, sentences, paragraphs and estimated reading time. Runs in your browser — nothing is uploaded.',
    category: 'Text',
    keywords: [
      'word counter',
      'character counter',
      'count words online',
      'word count tool',
      'reading time calculator',
    ],
    icon: 'M4 6h16M4 12h16M4 18h10',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    tagline: 'UPPERCASE, lowercase, Title Case, camelCase & more.',
    description:
      'Free online case converter. Change text to uppercase, lowercase, title case, sentence case, camelCase, snake_case and kebab-case instantly in your browser.',
    category: 'Text',
    keywords: [
      'case converter',
      'uppercase to lowercase',
      'title case converter',
      'camelcase converter',
      'text case changer',
    ],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    tagline: 'Strong, random passwords generated locally.',
    description:
      'Free secure password generator. Create strong, random passwords with custom length, symbols and numbers. Generated locally with your browser — never sent anywhere.',
    category: 'Security',
    keywords: [
      'password generator',
      'strong password generator',
      'random password generator',
      'secure password maker',
      'create password online',
    ],
    icon: 'M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3Z',
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    tagline: 'Format, beautify & validate JSON data.',
    description:
      'Free online JSON formatter and validator. Beautify, minify and validate JSON with clear error messages. Fast, private and runs entirely in your browser.',
    category: 'Developer',
    keywords: [
      'json formatter',
      'json beautifier',
      'json validator',
      'format json online',
      'json pretty print',
    ],
    icon: 'M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2',
  },
  {
    slug: 'base64-encoder',
    name: 'Base64 Encoder / Decoder',
    tagline: 'Encode and decode Base64 text instantly.',
    description:
      'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 back to text instantly. Private, client-side and works offline.',
    category: 'Developer',
    keywords: [
      'base64 encode',
      'base64 decode',
      'base64 encoder decoder',
      'text to base64',
      'base64 converter',
    ],
    icon: 'M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16',
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder / Decoder',
    tagline: 'Percent-encode and decode URLs safely.',
    description:
      'Free online URL encoder and decoder. Percent-encode query strings and decode URL-encoded text instantly. Runs locally in your browser for full privacy.',
    category: 'Developer',
    keywords: [
      'url encoder',
      'url decoder',
      'percent encoding',
      'encode url online',
      'uri encoder decoder',
    ],
    icon: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    tagline: 'SHA-1, SHA-256, SHA-384 & SHA-512 hashes.',
    description:
      'Free online hash generator. Create SHA-1, SHA-256, SHA-384 and SHA-512 hashes from any text using the Web Crypto API — computed locally, never uploaded.',
    category: 'Security',
    keywords: [
      'hash generator',
      'sha256 generator',
      'sha512 hash',
      'online hash tool',
      'text to hash',
    ],
    icon: 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18',
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    tagline: 'Placeholder text by words, sentences or paragraphs.',
    description:
      'Free Lorem Ipsum generator. Create placeholder text by paragraphs, sentences or words for mockups and designs. Instant, copy-ready dummy text.',
    category: 'Generators',
    keywords: [
      'lorem ipsum generator',
      'dummy text generator',
      'placeholder text',
      'filler text generator',
      'lorem ipsum online',
    ],
    icon: 'M4 5h16M4 10h16M4 15h12M4 20h8',
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    tagline: 'Convert between HEX, RGB and HSL colors.',
    description:
      'Free online color converter and picker. Convert colors between HEX, RGB and HSL, preview shades and copy values instantly. Perfect for designers and developers.',
    category: 'Converters',
    keywords: [
      'color converter',
      'hex to rgb',
      'rgb to hex',
      'hsl converter',
      'color picker online',
    ],
    icon: 'M12 3a9 9 0 1 0 0 18 3 3 0 0 0 0-6h-1a2 2 0 0 1 0-4h2a4 4 0 0 0 0-8ZM7.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    tagline: 'Turn text or links into scannable QR codes.',
    description:
      'Free online QR code generator. Turn any text, URL or contact info into a scannable QR code and download it as PNG or SVG. Generated privately in your browser.',
    category: 'Generators',
    keywords: [
      'qr code generator',
      'create qr code',
      'free qr code maker',
      'text to qr code',
      'url qr code generator',
    ],
    icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z',
  },

  // ---- Text ----
  {
    slug: 'text-diff',
    name: 'Text Diff Checker',
    tagline: 'Compare two texts and highlight the changes.',
    description:
      'Free online text diff checker. Compare two blocks of text line by line and highlight added and removed lines instantly. Runs in your browser — nothing uploaded.',
    category: 'Text',
    keywords: [
      'text diff',
      'diff checker',
      'compare text online',
      'text comparison tool',
      'find difference between two texts',
    ],
    icon: 'M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M12 4v16',
  },
  {
    slug: 'line-tools',
    name: 'Line Tools',
    tagline: 'Sort, dedupe, reverse & trim lines of text.',
    description:
      'Free online line tools. Sort lines alphabetically, remove duplicates, reverse order, shuffle and trim whitespace instantly in your browser. No uploads, fully private.',
    category: 'Text',
    keywords: [
      'sort lines online',
      'remove duplicate lines',
      'reverse text lines',
      'dedupe lines',
      'text line sorter',
    ],
    icon: 'M4 6h16M4 12h10M4 18h7M17 15l3 3-3 3M20 18h-6',
  },
  {
    slug: 'slug-generator',
    name: 'Slug Generator',
    tagline: 'Turn any title into a clean URL slug.',
    description:
      'Free online slug generator. Convert titles and text into clean, SEO-friendly URL slugs with hyphens and lowercase instantly. Runs locally in your browser.',
    category: 'Text',
    keywords: [
      'slug generator',
      'url slug generator',
      'seo slug maker',
      'text to slug',
      'permalink generator',
    ],
    icon: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
  },

  // ---- Developer ----
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    tagline: 'Test regular expressions with live match highlighting.',
    description:
      'Free online regex tester. Test JavaScript regular expressions against text with live match highlighting, flags and capture groups. Private and client-side.',
    category: 'Developer',
    keywords: [
      'regex tester',
      'regular expression tester',
      'regex online',
      'test regex',
      'regex match highlighter',
    ],
    icon: 'M4 17l6-6-6-6M12 19h8',
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    tagline: 'Decode JWT header and payload claims.',
    description:
      'Free online JWT decoder. Decode a JSON Web Token to inspect its header and payload claims instantly. Decoded locally in your browser — your token is never sent anywhere.',
    category: 'Developer',
    keywords: [
      'jwt decoder',
      'decode jwt',
      'json web token decoder',
      'jwt parser online',
      'read jwt token',
    ],
    icon: 'M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm0 11v4',
  },
  {
    slug: 'timestamp-converter',
    name: 'Timestamp Converter',
    tagline: 'Convert Unix timestamps to dates and back.',
    description:
      'Free online Unix timestamp converter. Convert epoch timestamps (seconds or milliseconds) to human-readable dates and back instantly. Runs in your browser.',
    category: 'Developer',
    keywords: [
      'unix timestamp converter',
      'epoch converter',
      'timestamp to date',
      'date to timestamp',
      'unix time converter',
    ],
    icon: 'M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
  },
  {
    slug: 'number-base-converter',
    name: 'Number Base Converter',
    tagline: 'Convert between binary, octal, decimal & hex.',
    description:
      'Free online number base converter. Convert numbers between binary, octal, decimal and hexadecimal instantly. Fast, private and runs entirely in your browser.',
    category: 'Developer',
    keywords: [
      'number base converter',
      'decimal to binary',
      'hex to decimal',
      'binary converter',
      'base converter online',
    ],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M15 9h5l-5 6h5',
  },
  {
    slug: 'markdown-previewer',
    name: 'Markdown Previewer',
    tagline: 'Write Markdown and preview HTML live.',
    description:
      'Free online Markdown previewer. Write Markdown and see the rendered HTML update live side by side. Great for READMEs and notes. Runs privately in your browser.',
    category: 'Developer',
    keywords: [
      'markdown previewer',
      'markdown editor online',
      'markdown to html',
      'md preview',
      'live markdown editor',
    ],
    icon: 'M3 5h18v14H3zM7 15V9l3 3 3-3v6M17 9v6M15 13l2 2 2-2',
  },
  {
    slug: 'html-entity',
    name: 'HTML Entity Encoder',
    tagline: 'Encode and decode HTML entities.',
    description:
      'Free online HTML entity encoder and decoder. Convert special characters to HTML entities and back to escape markup safely. Runs locally in your browser.',
    category: 'Developer',
    keywords: [
      'html entity encoder',
      'html entity decoder',
      'escape html',
      'html encode online',
      'special characters to html',
    ],
    icon: 'M4 17l6-6-6-6M20 17l-6-6 6-6',
  },

  // ---- Image ----
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    tagline: 'Resize images by pixels or percent, no upload.',
    description:
      'Free online image resizer. Resize JPG, PNG and WebP images by dimensions or percentage and download instantly. Processed in your browser — images never leave your device.',
    category: 'Image',
    keywords: [
      'image resizer',
      'resize image online',
      'photo resizer',
      'resize jpg png',
      'change image dimensions',
    ],
    icon: 'M4 4h10v10H4zM14 14h6v6h-6zM14 4l6 6M20 4v6h-6',
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    tagline: 'Shrink image file size right in your browser.',
    description:
      'Free online image compressor. Reduce JPG, PNG and WebP file size with adjustable quality and download instantly. Compressed locally — your images are never uploaded.',
    category: 'Image',
    keywords: [
      'image compressor',
      'compress image online',
      'reduce image size',
      'compress jpg',
      'photo compressor',
    ],
    icon: 'M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4M9 12h6',
  },
  {
    slug: 'image-to-base64',
    name: 'Image to Base64',
    tagline: 'Convert images to Base64 data URIs.',
    description:
      'Free online image to Base64 converter. Turn JPG, PNG, GIF and SVG images into Base64 data URI strings for CSS or HTML. Converted in your browser — no uploads.',
    category: 'Image',
    keywords: [
      'image to base64',
      'base64 image encoder',
      'convert image to base64',
      'png to base64',
      'data uri generator',
    ],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4M15 8h.01',
  },
  {
    slug: 'image-color-picker',
    name: 'Image Color Picker',
    tagline: 'Pick colors from any image as HEX or RGB.',
    description:
      'Free online image color picker. Upload an image and pick any pixel to get its HEX and RGB color values. Runs entirely in your browser — images stay on your device.',
    category: 'Image',
    keywords: [
      'image color picker',
      'color picker from image',
      'get color from image',
      'hex color picker',
      'pick color from photo',
    ],
    icon: 'M12 3a9 9 0 1 0 0 18 3 3 0 0 0 0-6h-1a2 2 0 0 1 0-4h2a4 4 0 0 0 0-8ZM7.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  },

  // ---- Generators ----
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    tagline: 'Generate random v4 UUIDs in bulk.',
    description:
      'Free online UUID generator. Create random RFC 4122 version-4 UUIDs (GUIDs) one at a time or in bulk, using your browser secure crypto. Nothing is sent to a server.',
    category: 'Generators',
    keywords: [
      'uuid generator',
      'guid generator',
      'v4 uuid',
      'random uuid',
      'generate uuid online',
    ],
    icon: 'M4 7h16v10H4zM8 7v10M16 7v10M4 12h4M16 12h4',
  },
  {
    slug: 'random-number',
    name: 'Random Number Generator',
    tagline: 'Random integers with min, max & count.',
    description:
      'Free online random number generator. Generate random integers between any min and max, in bulk, with optional unique and sorted output. Runs in your browser.',
    category: 'Generators',
    keywords: [
      'random number generator',
      'random integer generator',
      'number picker',
      'rng online',
      'generate random numbers',
    ],
    icon: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8.5 8.5h.01M15.5 8.5h.01M8.5 15.5h.01M15.5 15.5h.01M12 12h.01',
  },

  // ---- Converters ----
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    tagline: 'Convert length, weight & temperature units.',
    description:
      'Free online unit converter. Convert between metric and imperial units of length, weight and temperature instantly. Fast, accurate and runs in your browser.',
    category: 'Converters',
    keywords: [
      'unit converter',
      'metric to imperial',
      'length converter',
      'weight converter',
      'temperature converter',
    ],
    icon: 'M4 7h16M4 7l3-3M4 7l3 3M20 17H4M20 17l-3-3M20 17l-3 3',
  },

  // ---- Calculators ----
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    tagline: 'Work out percentages, changes & ratios.',
    description:
      'Free online percentage calculator. Find what X% of Y is, what percent one number is of another, and percentage increase or decrease. Instant and private.',
    category: 'Calculators',
    keywords: [
      'percentage calculator',
      'percent calculator',
      'percentage change calculator',
      'calculate percentage online',
      'percent of a number',
    ],
    icon: 'M19 5L5 19M6.5 6.5a1.5 1.5 0 1 0 0 .01M17.5 17.5a1.5 1.5 0 1 0 0 .01',
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    tagline: 'Calculate exact age in years, months & days.',
    description:
      'Free online age calculator. Enter a birth date to calculate exact age in years, months and days, plus total days lived. Runs instantly in your browser.',
    category: 'Calculators',
    keywords: [
      'age calculator',
      'calculate age from date of birth',
      'date of birth calculator',
      'how old am i',
      'age in days calculator',
    ],
    icon: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM12 12v4M10 14h4',
  },

  // ---- Calculators: Financial ----
  {
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    tagline: 'Monthly EMI, total interest & payment.',
    description:
      'Free online loan calculator. Calculate your monthly EMI, total interest and total repayment for any loan amount, interest rate and term. Instant and private.',
    category: 'Calculators',
    keywords: ['loan calculator', 'emi calculator', 'monthly payment calculator', 'loan repayment calculator', 'interest calculator'],
    icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  },
  {
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    tagline: 'Estimate monthly home loan payments.',
    description:
      'Free online mortgage calculator. Estimate monthly principal and interest payments, with optional property tax and insurance, for any home loan. Runs in your browser.',
    category: 'Calculators',
    keywords: ['mortgage calculator', 'home loan calculator', 'monthly mortgage payment', 'house payment calculator', 'mortgage estimator'],
    icon: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6',
  },
  {
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    tagline: 'Grow savings with compound interest.',
    description:
      'Free online compound interest calculator. See how your money grows over time with adjustable rate, compounding frequency and regular contributions. Private and instant.',
    category: 'Calculators',
    keywords: ['compound interest calculator', 'interest calculator', 'savings growth calculator', 'investment growth', 'compounding calculator'],
    icon: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  },
  {
    slug: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    tagline: 'Interest on principal, rate & time.',
    description:
      'Free online simple interest calculator. Calculate simple interest and total amount from principal, annual rate and time period instantly in your browser.',
    category: 'Calculators',
    keywords: ['simple interest calculator', 'interest calculator', 'principal interest calculator', 'si calculator', 'calculate interest'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9.5 9.5h.01M14.5 14.5h.01M15 9l-6 6',
  },
  {
    slug: 'investment-calculator',
    name: 'Investment Calculator',
    tagline: 'Project future value of investments.',
    description:
      'Free online investment calculator. Project the future value of a lump sum plus regular contributions at a given return rate over time. Runs entirely in your browser.',
    category: 'Calculators',
    keywords: ['investment calculator', 'future value calculator', 'roi calculator', 'investment growth calculator', 'return on investment'],
    icon: 'M3 3v18h18M7 14l3-3 3 3 4-5M17 9h3v3',
  },
  {
    slug: 'savings-calculator',
    name: 'Savings Goal Calculator',
    tagline: 'Find the monthly saving to hit a goal.',
    description:
      'Free online savings goal calculator. Work out how much to save each month to reach a target amount by a set date, including interest. Instant and private.',
    category: 'Calculators',
    keywords: ['savings calculator', 'savings goal calculator', 'monthly savings calculator', 'save money calculator', 'goal calculator'],
    icon: 'M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10a4 4 0 0 1 4-4h6M17 14h.01',
  },
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    tagline: 'Tip amount & split the bill by people.',
    description:
      'Free online tip calculator. Calculate the tip and total for any bill, split it between any number of people, and see the per-person amount. Fast and private.',
    category: 'Calculators',
    keywords: ['tip calculator', 'gratuity calculator', 'bill split calculator', 'restaurant tip calculator', 'split the bill'],
    icon: 'M12 1v22M6 5h9a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h9',
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    tagline: 'Sale price after a percentage off.',
    description:
      'Free online discount calculator. Enter a price and percentage off to get the amount saved and the final sale price. Add a second discount too. Runs in your browser.',
    category: 'Calculators',
    keywords: ['discount calculator', 'percent off calculator', 'sale price calculator', 'markdown calculator', 'discount percentage'],
    icon: 'M9 9h.01M15 15h.01M16 8 8 16M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z',
  },
  {
    slug: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    tagline: 'Add or remove sales tax / VAT / GST.',
    description:
      'Free online sales tax calculator. Add sales tax, VAT or GST to a price, or work backwards to find the pre-tax amount and tax portion. Instant, client-side.',
    category: 'Calculators',
    keywords: ['sales tax calculator', 'vat calculator', 'gst calculator', 'tax calculator', 'add tax to price'],
    icon: 'M9 14l6-6M9.5 9h.01M14.5 14h.01M5 3h14a1 1 0 0 1 1 1v17l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1Z',
  },

  // ---- Calculators: Health & Fitness ----
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    tagline: 'Body Mass Index & weight category.',
    description:
      'Free online BMI calculator. Calculate your Body Mass Index from height and weight in metric or imperial units, and see your weight category. Private and instant.',
    category: 'Calculators',
    keywords: ['bmi calculator', 'body mass index calculator', 'calculate bmi', 'bmi chart', 'weight category calculator'],
    icon: 'M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6 22l2-9h8l2 9M9 13l-2 4M15 13l2 4',
  },
  {
    slug: 'bmr-calculator',
    name: 'BMR Calculator',
    tagline: 'Basal metabolic rate (Mifflin-St Jeor).',
    description:
      'Free online BMR calculator. Estimate your basal metabolic rate — the calories your body burns at rest — using the Mifflin-St Jeor equation. Runs in your browser.',
    category: 'Calculators',
    keywords: ['bmr calculator', 'basal metabolic rate calculator', 'metabolism calculator', 'calories at rest', 'mifflin st jeor'],
    icon: 'M12 2a7 7 0 0 0-7 7c0 3 2 5 2 8a5 5 0 0 0 10 0c0-3 2-5 2-8a7 7 0 0 0-7-7ZM12 22v-6',
  },
  {
    slug: 'calorie-calculator',
    name: 'Calorie Calculator',
    tagline: 'Daily calorie needs (TDEE) by activity.',
    description:
      'Free online calorie calculator. Estimate your daily calorie needs (TDEE) from BMR and activity level for maintenance, weight loss or gain. Instant and private.',
    category: 'Calculators',
    keywords: ['calorie calculator', 'tdee calculator', 'daily calorie calculator', 'maintenance calories', 'calorie needs calculator'],
    icon: 'M12 2c3 3 5 6 5 10a5 5 0 0 1-10 0c0-1 .5-2 1-3 .5 2 2 2 2 2 0-3-1-6 2-9Z',
  },
  {
    slug: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    tagline: 'Body fat percentage (US Navy method).',
    description:
      'Free online body fat calculator. Estimate your body fat percentage using the US Navy tape method from a few body measurements. Runs entirely in your browser.',
    category: 'Calculators',
    keywords: ['body fat calculator', 'body fat percentage calculator', 'us navy body fat', 'bf% calculator', 'measure body fat'],
    icon: 'M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM7 22c0-4 2-8 5-8s5 4 5 8',
  },
  {
    slug: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    tagline: 'Healthy weight range for your height.',
    description:
      'Free online ideal weight calculator. Estimate your ideal body weight from height and sex using the Devine, Robinson and Hamwi formulas. Private and instant.',
    category: 'Calculators',
    keywords: ['ideal weight calculator', 'ideal body weight', 'healthy weight calculator', 'target weight calculator', 'devine formula'],
    icon: 'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM8 21l1-7-2 1M16 21l-1-7 2 1M9 14h6',
  },
  {
    slug: 'pace-calculator',
    name: 'Pace Calculator',
    tagline: 'Running pace, time or distance.',
    description:
      'Free online pace calculator. Calculate running pace, finish time or distance for runs — enter any two values to find the third. Great for race training. Private.',
    category: 'Calculators',
    keywords: ['pace calculator', 'running pace calculator', 'race time calculator', 'min per km calculator', 'marathon pace'],
    icon: 'M13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM7 22l3-6 3 2 1-4 3 3M10 10l2 2',
  },
  {
    slug: 'water-intake-calculator',
    name: 'Water Intake Calculator',
    tagline: 'Daily water needs by weight & activity.',
    description:
      'Free online water intake calculator. Estimate how much water you should drink each day based on your body weight and activity level. Runs in your browser.',
    category: 'Calculators',
    keywords: ['water intake calculator', 'daily water calculator', 'hydration calculator', 'how much water to drink', 'water needs calculator'],
    icon: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  },
  {
    slug: 'due-date-calculator',
    name: 'Pregnancy Due Date Calculator',
    tagline: 'Estimate due date from last period.',
    description:
      'Free online pregnancy due date calculator. Estimate your baby’s due date and current week from your last menstrual period using Naegele’s rule. Private and instant.',
    category: 'Calculators',
    keywords: ['due date calculator', 'pregnancy calculator', 'baby due date', 'gestational age calculator', 'estimated due date'],
    icon: 'M12 2a7 7 0 0 0-4 12.7V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6.3A7 7 0 0 0 12 2ZM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  },

  // ---- Calculators: Math ----
  {
    slug: 'scientific-calculator',
    name: 'Scientific Calculator',
    tagline: 'Evaluate expressions with functions.',
    description:
      'Free online scientific calculator. Evaluate math expressions with parentheses, powers, roots and trig, log and ln functions. Works entirely in your browser.',
    category: 'Calculators',
    keywords: ['scientific calculator', 'online calculator', 'math calculator', 'expression calculator', 'trigonometry calculator'],
    icon: 'M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM7 7h10M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01',
  },
  {
    slug: 'fraction-calculator',
    name: 'Fraction Calculator',
    tagline: 'Add, subtract, multiply & divide fractions.',
    description:
      'Free online fraction calculator. Add, subtract, multiply and divide fractions and get the result simplified to lowest terms. Instant, client-side and private.',
    category: 'Calculators',
    keywords: ['fraction calculator', 'add fractions', 'multiply fractions', 'simplify fractions', 'fraction math calculator'],
    icon: 'M17 5 7 19M8 6.5a1.5 1.5 0 1 0 0 .01M16 17.5a1.5 1.5 0 1 0 0 .01',
  },
  {
    slug: 'average-calculator',
    name: 'Average Calculator',
    tagline: 'Mean, median, mode & range.',
    description:
      'Free online average calculator. Enter a list of numbers to instantly get the mean, median, mode, range, sum and count. Runs entirely in your browser.',
    category: 'Calculators',
    keywords: ['average calculator', 'mean calculator', 'median calculator', 'mode calculator', 'mean median mode'],
    icon: 'M4 19h16M6 19V9M11 19V5M16 19v-6',
  },
  {
    slug: 'standard-deviation-calculator',
    name: 'Standard Deviation Calculator',
    tagline: 'Population & sample standard deviation.',
    description:
      'Free online standard deviation calculator. Get population and sample standard deviation, variance, mean and count from a list of numbers. Private and instant.',
    category: 'Calculators',
    keywords: ['standard deviation calculator', 'variance calculator', 'std dev calculator', 'sample standard deviation', 'population standard deviation'],
    icon: 'M3 12c3 0 3-7 6-7s3 14 6 14 3-7 6-7M3 20h18',
  },
  {
    slug: 'ratio-calculator',
    name: 'Ratio Calculator',
    tagline: 'Simplify ratios & solve for X.',
    description:
      'Free online ratio calculator. Simplify a ratio to its lowest terms or solve equivalent ratios for a missing value (A:B = C:X). Runs in your browser.',
    category: 'Calculators',
    keywords: ['ratio calculator', 'simplify ratio', 'ratio solver', 'proportion calculator', 'equivalent ratio calculator'],
    icon: 'M7 7a2 2 0 1 0 0 .01M17 17a2 2 0 1 0 0 .01M5 19 19 5',
  },
  {
    slug: 'gcd-lcm-calculator',
    name: 'GCD & LCM Calculator',
    tagline: 'Greatest common divisor & lowest multiple.',
    description:
      'Free online GCD and LCM calculator. Find the greatest common divisor (HCF) and least common multiple of two or more numbers instantly in your browser.',
    category: 'Calculators',
    keywords: ['gcd calculator', 'lcm calculator', 'hcf calculator', 'greatest common divisor', 'least common multiple'],
    icon: 'M6 6h12v12H6zM3 9h3M3 15h3M18 9h3M18 15h3M9 3v3M15 3v3M9 18v3M15 18v3',
  },

  // ---- Calculators: Everyday / Date & Time ----
  {
    slug: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    tagline: 'Days, weeks & months between dates.',
    description:
      'Free online date difference calculator. Count the exact days, weeks, months and years between two dates, or add and subtract days from a date. Private and instant.',
    category: 'Calculators',
    keywords: ['date difference calculator', 'days between dates', 'date calculator', 'add days to date', 'time between dates'],
    icon: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM9 15l2 2 4-4',
  },
  {
    slug: 'time-calculator',
    name: 'Time Calculator',
    tagline: 'Add & subtract hours, minutes, seconds.',
    description:
      'Free online time calculator. Add or subtract times and durations in hours, minutes and seconds and see the total. Runs entirely in your browser.',
    category: 'Calculators',
    keywords: ['time calculator', 'add time calculator', 'time duration calculator', 'hours minutes calculator', 'subtract time'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 7v5l3 2',
  },
  {
    slug: 'hours-calculator',
    name: 'Hours Calculator',
    tagline: 'Work hours between two clock times.',
    description:
      'Free online hours calculator. Calculate hours and minutes worked between a start and end time, minus breaks — a quick timesheet tool. Private and client-side.',
    category: 'Calculators',
    keywords: ['hours calculator', 'time card calculator', 'work hours calculator', 'timesheet calculator', 'hours worked calculator'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 7v5l4 2M8 22h8',
  },
  {
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    tagline: 'Weighted GPA from grades & credits.',
    description:
      'Free online GPA calculator. Add your courses with grades and credit hours to calculate a weighted grade point average on a 4.0 scale. Runs in your browser.',
    category: 'Calculators',
    keywords: ['gpa calculator', 'grade point average calculator', 'college gpa calculator', 'weighted gpa calculator', 'calculate gpa'],
    icon: 'M22 10 12 5 2 10l10 5 10-5ZM6 12v5c0 1 3 3 6 3s6-2 6-3v-5M22 10v6',
  },

  // ---- Calculators: Fitness Standards ----
  {
    slug: 'aft-calculator',
    name: 'AFT Calculator',
    tagline: 'Army Fitness Test score by event.',
    description:
      'Free Army Fitness Test (AFT) calculator. Score all six events — deadlift, power throw, push-ups, sprint-drag-carry, plank and the 2-mile run — out of 600 against the official age and sex standards, with the full scoring chart shown for verification. Runs in your browser.',
    category: 'Calculators',
    keywords: ['aft calculator', 'army fitness test calculator', 'acft calculator', 'army combat fitness test score', 'aft score chart'],
    icon: 'M6.5 6.5h11M4 10h2v4H4zM18 10h2v4h-2zM6 12h12M8 9h1v6H8zM15 9h1v6h-1z',
  },
  {
    slug: 'pft-calculator',
    name: 'PFT Calculator',
    tagline: 'USMC Physical Fitness Test score.',
    description:
      'Free USMC PFT calculator. Score pull-ups or push-ups, plank hold and the 3-mile run against Marine Corps age and sex standards for a total out of 300. Runs in your browser.',
    category: 'Calculators',
    keywords: ['pft calculator', 'usmc pft calculator', 'marine corps pft score', 'physical fitness test calculator', 'pft score chart'],
    icon: 'M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM8 8h8l-1 6H9zM9 14l-2 8M15 14l2 8',
  },

  // ---- Calculators: AP Exam Scores ----
  {
    slug: 'ap-lang-calculator',
    name: 'AP Lang Score Calculator',
    tagline: 'Predict your AP English Language score.',
    description:
      'Free AP English Language & Composition score calculator. Enter multiple-choice and essay scores to estimate your 1–5 AP Lang score from the composite. Runs in your browser.',
    category: 'Calculators',
    keywords: ['ap lang calculator', 'ap english language score calculator', 'ap lang score calculator', 'ap exam score predictor', 'ap english lang curve'],
    icon: 'M4 5h13a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 7v12M8 9h7M8 13h5',
  },
  {
    slug: 'apush-calculator',
    name: 'APUSH Score Calculator',
    tagline: 'Predict your AP US History score.',
    description:
      'Free APUSH score calculator. Enter your multiple-choice, short-answer, DBQ and long-essay scores to estimate your 1–5 AP US History score. Runs in your browser.',
    category: 'Calculators',
    keywords: ['apush calculator', 'ap us history score calculator', 'apush score calculator', 'ap exam score predictor', 'apush curve'],
    icon: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M10 10h.01M14 10h.01',
  },

  // ---- Calculators: Health & Medical ----
  {
    slug: 'biological-age-calculator',
    name: 'Biological Age Calculator',
    tagline: 'Estimate your body’s real age.',
    description:
      'Free biological age calculator. Estimate your body’s age from lifestyle factors like exercise, sleep, diet, smoking and stress compared to your actual age. Runs in your browser.',
    category: 'Calculators',
    keywords: ['biological age calculator', 'body age calculator', 'real age calculator', 'metabolic age calculator', 'how old is my body'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 7v5l3 3M8 3.5 6 6M16 3.5 18 6',
  },
  {
    slug: 'creatinine-clearance-calculator',
    name: 'Creatinine Clearance Calculator',
    tagline: 'Cockcroft-Gault CrCl estimate.',
    description:
      'Free creatinine clearance calculator. Estimate renal function (CrCl) with the Cockcroft-Gault equation from age, weight, sex and serum creatinine. Runs in your browser.',
    category: 'Calculators',
    keywords: ['creatinine clearance calculator', 'cockcroft gault calculator', 'crcl calculator', 'renal function calculator', 'gfr estimate'],
    icon: 'M12 3c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 9.5 9 7 12 3ZM10 13a2 2 0 0 0 4 0',
  },
  {
    slug: 'peptide-calculator',
    name: 'Peptide Reconstitution Calculator',
    tagline: 'Dose, volume & units for peptides.',
    description:
      'Free peptide reconstitution calculator. Work out how much bacteriostatic water to add and the syringe units to draw for a target peptide dose. Runs in your browser.',
    category: 'Calculators',
    keywords: ['peptide calculator', 'peptide reconstitution calculator', 'peptide dosage calculator', 'bacteriostatic water calculator', 'peptide dose units'],
    icon: 'M9 3h6M10 3v5l-3 8a3 3 0 0 0 3 4h4a3 3 0 0 0 3-4l-3-8V3M8 14h8',
  },

  // ---- Calculators: Finance & Value ----
  {
    slug: 'texas-paycheck-calculator',
    name: 'Texas Paycheck Calculator',
    tagline: 'Take-home pay for Texas, no state tax.',
    description:
      'Free Texas paycheck calculator. Estimate your take-home pay after federal income tax, Social Security and Medicare — Texas has no state income tax. Runs in your browser.',
    category: 'Calculators',
    keywords: ['texas paycheck calculator', 'texas take home pay calculator', 'texas salary calculator', 'net pay calculator texas', 'texas payroll calculator'],
    icon: 'M3 6h18v12H3zM3 10h18M7 15h4M12 2 8 6M12 2l4 4',
  },
  {
    slug: 'gold-calculator',
    name: 'Gold Value Calculator',
    tagline: 'Scrap gold value by weight & karat.',
    description:
      'Free gold value calculator. Work out the melt value of gold by weight and karat from the current spot price, for scrap, jewelry or coins. Runs in your browser.',
    category: 'Calculators',
    keywords: ['gold calculator', 'gold value calculator', 'scrap gold calculator', 'gold price calculator', 'gold melt value calculator'],
    icon: 'M4 8h16l-2 4H6zM6 12h12l1 8H5zM9 4h6l1 4H8z',
  },
  {
    slug: 'silver-calculator',
    name: 'Silver Value Calculator',
    tagline: 'Scrap silver value by weight & fineness.',
    description:
      'Free silver value calculator. Work out the melt value of silver by weight and fineness from the live spot price, for scrap, sterling, coins or bullion. Runs in your browser.',
    category: 'Calculators',
    keywords: ['silver calculator', 'silver value calculator', 'scrap silver calculator', 'silver price calculator', 'silver melt value calculator'],
    icon: 'M4 8h16l-2 4H6zM6 12h12l1 8H5zM9 4h6l1 4H8z',
  },
  {
    slug: 'platinum-calculator',
    name: 'Platinum Value Calculator',
    tagline: 'Scrap platinum value by weight & fineness.',
    description:
      'Free platinum value calculator. Work out the melt value of platinum by weight and fineness from the live spot price, for scrap, jewelry or bullion. Runs in your browser.',
    category: 'Calculators',
    keywords: ['platinum calculator', 'platinum value calculator', 'scrap platinum calculator', 'platinum price calculator', 'platinum melt value calculator'],
    icon: 'M4 8h16l-2 4H6zM6 12h12l1 8H5zM9 4h6l1 4H8z',
  },
  {
    slug: 'dynasty-trade-calculator',
    name: 'Dynasty Trade Calculator',
    tagline: 'Weigh fantasy football trades by value.',
    description:
      'Free dynasty fantasy football trade calculator. Add players and picks to each side and compare total trade value to see who wins the deal. Runs in your browser.',
    category: 'Calculators',
    keywords: ['dynasty trade calculator', 'fantasy football trade calculator', 'dynasty trade value chart', 'ff trade analyzer', 'dynasty value calculator'],
    icon: 'M7 10 3 14l4 4M17 6l4 4-4 4M3 14h13M8 10h13',
  },

  // ---- Calculators: Finance (added) ----
  {
    slug: 'retirement-calculator',
    name: 'Retirement Calculator',
    tagline: 'Project your 401(k) balance at retirement.',
    description:
      'Free online retirement calculator. Project your 401(k) or retirement savings balance from current age, contributions, employer match and expected return. Runs in your browser.',
    category: 'Calculators',
    keywords: ['retirement calculator', '401k calculator', 'retirement savings calculator', 'nest egg calculator', 'retirement planning calculator'],
    icon: 'M3 3v18h18M7 15l4-4 3 3 5-6M20 8v4h-4',
  },
  {
    slug: 'auto-loan-calculator',
    name: 'Auto Loan Calculator',
    tagline: 'Monthly car payment with tax & trade-in.',
    description:
      'Free online auto loan calculator. Estimate your monthly car payment from price, down payment, trade-in, sales tax, term and APR, plus total interest. Runs in your browser.',
    category: 'Calculators',
    keywords: ['auto loan calculator', 'car loan calculator', 'car payment calculator', 'vehicle finance calculator', 'monthly car payment'],
    icon: 'M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M5 11h14v5H5zM7 16v2M17 16v2M7.5 13.5h.01M16.5 13.5h.01',
  },
  {
    slug: 'credit-card-payoff-calculator',
    name: 'Credit Card Payoff Calculator',
    tagline: 'Months to clear a balance & interest cost.',
    description:
      'Free online credit card payoff calculator. See how many months it takes to clear a balance at a fixed monthly payment and APR, and the total interest paid. Runs in your browser.',
    category: 'Calculators',
    keywords: ['credit card payoff calculator', 'credit card interest calculator', 'debt payoff calculator', 'pay off credit card', 'card balance calculator'],
    icon: 'M3 7h18v10H3zM3 10h18M6 14h4',
  },
  {
    slug: 'debt-payoff-calculator',
    name: 'Debt Payoff Calculator',
    tagline: 'Snowball vs avalanche, months to debt-free.',
    description:
      'Free online debt payoff calculator. Compare the snowball and avalanche methods across multiple debts, with extra payments, to find months to debt-free and total interest. Runs in your browser.',
    category: 'Calculators',
    keywords: ['debt payoff calculator', 'debt snowball calculator', 'debt avalanche calculator', 'pay off debt calculator', 'debt free calculator'],
    icon: 'M3 3v18h18M7 17l3-3 3 3 4-5M6 21v-4M12 21v-6M18 21v-9',
  },
  {
    slug: 'inflation-calculator',
    name: 'Inflation Calculator',
    tagline: 'Future cost & purchasing power over time.',
    description:
      'Free online inflation calculator. See what an amount will cost in future years and how much today’s money will be worth in real terms at a given inflation rate. Runs in your browser.',
    category: 'Calculators',
    keywords: ['inflation calculator', 'purchasing power calculator', 'cost of living calculator', 'future value of money', 'inflation rate calculator'],
    icon: 'M3 3v18h18M7 14l4-6 3 4 5-8M19 4v4h-4',
  },
  {
    slug: 'salary-calculator',
    name: 'Salary Calculator',
    tagline: 'Convert pay between hourly and annual.',
    description:
      'Free online salary calculator. Convert a pay rate between hourly, daily, weekly, bi-weekly, monthly and annual figures using your hours and weeks worked. Runs in your browser.',
    category: 'Calculators',
    keywords: ['salary calculator', 'hourly to salary calculator', 'annual salary calculator', 'wage calculator', 'pay rate calculator'],
    icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  },
  {
    slug: 'margin-calculator',
    name: 'Margin Calculator',
    tagline: 'Profit, gross margin & markup from cost.',
    description:
      'Free online profit margin calculator. Enter cost and sale price to get profit, gross margin percentage and markup, or find the price needed for a target margin. Runs in your browser.',
    category: 'Calculators',
    keywords: ['margin calculator', 'profit margin calculator', 'markup calculator', 'gross margin calculator', 'selling price calculator'],
    icon: 'M4 20L20 4M8 6a2 2 0 1 1-.01 0M16 18a2 2 0 1 1-.01 0',
  },

  // ---- Calculators: Health & Fitness (added) ----
  {
    slug: 'macro-calculator',
    name: 'Macro Calculator',
    tagline: 'Daily protein, carbs & fat targets.',
    description:
      'Free online macro calculator. Get your daily calorie target and protein, carb and fat grams from your stats, activity level and goal using the Mifflin-St Jeor equation. Runs in your browser.',
    category: 'Calculators',
    keywords: ['macro calculator', 'macronutrient calculator', 'iifym calculator', 'protein carb fat calculator', 'macros calculator'],
    icon: 'M12 3a9 9 0 1 0 9 9h-9zM12 3v9M12 3a9 9 0 0 1 9 9',
  },
  {
    slug: 'one-rep-max-calculator',
    name: 'One Rep Max Calculator',
    tagline: 'Estimate your 1RM & training percentages.',
    description:
      'Free online one rep max calculator. Estimate your 1RM from weight and reps with the Epley and Brzycki formulas, plus a full table of training percentages. Runs in your browser.',
    category: 'Calculators',
    keywords: ['one rep max calculator', '1rm calculator', 'max lift calculator', 'bench press max calculator', 'epley formula calculator'],
    icon: 'M6.5 6.5h11M4 10h2v4H4zM18 10h2v4h-2zM6 12h12M8 9h1v6H8zM15 9h1v6h-1z',
  },
  {
    slug: 'sleep-calculator',
    name: 'Sleep Calculator',
    tagline: 'Best bedtimes & wake times by sleep cycle.',
    description:
      'Free online sleep calculator. Find the best times to go to bed or wake up based on 90-minute sleep cycles so you wake between cycles feeling refreshed. Runs in your browser.',
    category: 'Calculators',
    keywords: ['sleep calculator', 'bedtime calculator', 'sleep cycle calculator', 'wake up time calculator', 'when to sleep calculator'],
    icon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
  },
  {
    slug: 'bac-calculator',
    name: 'BAC Calculator',
    tagline: 'Estimate blood alcohol with the Widmark formula.',
    description:
      'Free online BAC calculator. Estimate blood alcohol content from drinks, body weight, sex and time using the Widmark formula. An estimate only — never a guide to drive. Runs in your browser.',
    category: 'Calculators',
    keywords: ['bac calculator', 'blood alcohol calculator', 'widmark formula calculator', 'alcohol level calculator', 'drink calculator'],
    icon: 'M8 3h8l-1 8a4 4 0 0 1-6 0zM7 21h10M12 15v6M8.5 7h7',
  },
  {
    slug: 'heart-rate-zone-calculator',
    name: 'Heart Rate Zone Calculator',
    tagline: 'Target training zones from your max HR.',
    description:
      'Free online heart rate zone calculator. Find your maximum heart rate and five target training zones in beats per minute, with optional Karvonen resting-rate method. Runs in your browser.',
    category: 'Calculators',
    keywords: ['heart rate zone calculator', 'target heart rate calculator', 'max heart rate calculator', 'karvonen calculator', 'training zone calculator'],
    icon: 'M3 12h4l2-6 4 12 2-6h6',
  },
  {
    slug: 'ovulation-calculator',
    name: 'Ovulation Calculator',
    tagline: 'Estimate your fertile window & ovulation.',
    description:
      'Free online ovulation calculator. Estimate your most fertile days, ovulation date and next period from your last period and average cycle length. An estimate, not contraception. Runs in your browser.',
    category: 'Calculators',
    keywords: ['ovulation calculator', 'fertility calculator', 'fertile window calculator', 'ovulation date calculator', 'conception calculator'],
    icon: 'M12 2a7 7 0 0 0-4 12.7V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6.3A7 7 0 0 0 12 2ZM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
  },

  // ---- Calculators: Math (added) ----
  {
    slug: 'quadratic-calculator',
    name: 'Quadratic Equation Calculator',
    tagline: 'Solve ax² + bx + c = 0 with steps.',
    description:
      'Free online quadratic equation calculator. Solve ax²+bx+c=0 for real or complex roots, with the discriminant and vertex shown. Handles linear cases too. Runs in your browser.',
    category: 'Calculators',
    keywords: ['quadratic calculator', 'quadratic equation solver', 'quadratic formula calculator', 'roots calculator', 'solve quadratic'],
    icon: 'M4 4v16M4 20c8 0 8-16 16-16M14 8h6M14 8v-2',
  },
  {
    slug: 'probability-calculator',
    name: 'Probability Calculator',
    tagline: 'Combine event probabilities (AND, OR).',
    description:
      'Free online probability calculator. Find the probability of two independent events happening together, either one, neither or just one, from P(A) and P(B). Runs in your browser.',
    category: 'Calculators',
    keywords: ['probability calculator', 'probability of two events', 'p(a and b) calculator', 'combined probability calculator', 'odds calculator'],
    icon: 'M6 6h.01M18 18h.01M8 5a3 3 0 1 1 0 .01M16 19a3 3 0 1 1 0-.01M5 19 19 5',
  },
  {
    slug: 'permutation-combination-calculator',
    name: 'Permutation & Combination Calculator',
    tagline: 'nPr and nCr from n and r.',
    description:
      'Free online permutation and combination calculator. Compute nPr and nCr from n and r, with factorials shown and big-number handling. Fast and private. Runs in your browser.',
    category: 'Calculators',
    keywords: ['permutation calculator', 'combination calculator', 'npr calculator', 'ncr calculator', 'nCr nPr calculator'],
    icon: 'M4 6h6v6H4zM14 12h6v6h-6zM10 9h4M14 15h-4M17 9V6h3',
  },
  {
    slug: 'triangle-calculator',
    name: 'Right Triangle Calculator',
    tagline: 'Solve sides, area & angles (Pythagoras).',
    description:
      'Free online right triangle calculator. Enter any two sides to solve the third with the Pythagorean theorem, plus area, perimeter and both acute angles. Runs in your browser.',
    category: 'Calculators',
    keywords: ['triangle calculator', 'pythagorean theorem calculator', 'right triangle calculator', 'hypotenuse calculator', 'triangle side calculator'],
    icon: 'M4 20h16L4 4zM4 16h4v4',
  },

  // ---- Calculators: Everyday / School (added) ----
  {
    slug: 'grade-calculator',
    name: 'Grade Calculator',
    tagline: 'Score percentage & weighted class grade.',
    description:
      'Free online grade calculator. Turn correct answers into a percentage and letter grade, and work out your weighted overall grade from assignments and their weights. Runs in your browser.',
    category: 'Calculators',
    keywords: ['grade calculator', 'ez grader', 'test grade calculator', 'weighted grade calculator', 'class grade calculator'],
    icon: 'M4 5h13a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM8 9h7M8 13h5M17 3l3 3-3 3',
  },
  {
    slug: 'final-grade-calculator',
    name: 'Final Grade Calculator',
    tagline: 'Find the final exam score you need.',
    description:
      'Free online final grade calculator. Work out the score you need on your final exam to reach a target course grade, from your current grade and the exam’s weight. Runs in your browser.',
    category: 'Calculators',
    keywords: ['final grade calculator', 'final exam calculator', 'what do i need on my final', 'grade needed calculator', 'exam grade calculator'],
    icon: 'M4 5h13a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM8 9h7M8 13h5M15 15l2 2 3-3',
  },
  {
    slug: 'fuel-cost-calculator',
    name: 'Fuel Cost Calculator',
    tagline: 'Trip fuel cost by distance & efficiency.',
    description:
      'Free online fuel cost calculator. Estimate the fuel needed and total cost of a trip from distance, fuel efficiency and price, in metric or US units. Runs in your browser.',
    category: 'Calculators',
    keywords: ['fuel cost calculator', 'gas cost calculator', 'trip cost calculator', 'gas mileage calculator', 'fuel calculator'],
    icon: 'M5 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M4 21h12M6 8h8M16 9l3 2v6a2 2 0 0 1-2 2',
  },

  // ---- Text / Numerology ----
  {
    slug: 'gematria-calculator',
    name: 'Gematria Calculator',
    tagline: 'Numeric value of words & phrases.',
    description:
      'Free gematria calculator. Convert words and phrases to their numeric value using English Ordinal, Full Reduction, Hebrew, Simple and Jewish gematria ciphers. Runs in your browser.',
    category: 'Text',
    keywords: ['gematria calculator', 'english gematria calculator', 'hebrew gematria calculator', 'numerology calculator', 'gematria value'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M14 9h6l-6 8h6',
  },

  // ---- Converters: Units (data lives in src/lib/units.ts) ----
  ...UNIT_CATEGORIES.map((c): Tool => ({
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    category: 'Converters',
    keywords: c.keywords,
    icon: c.icon,
  })),

  // ---- Converters: Color ----
  {
    slug: 'hex-to-rgb',
    name: 'HEX to RGB Converter',
    tagline: 'Turn hex color codes into RGB values.',
    description:
      'Free online HEX to RGB converter. Turn any hex color code into red, green and blue values for CSS, plus HSL, HSV, CMYK and the nearest color name. Runs in your browser.',
    category: 'Converters',
    keywords: ['hex to rgb', 'hex to rgb converter', 'hex color to rgb', 'convert hex to rgb', 'hexadecimal to rgb'],
    icon: 'M12 3a9 9 0 1 0 0 18 3 3 0 0 0 0-6h-1a2 2 0 0 1 0-4h2a4 4 0 0 0 0-8Z',
  },
  {
    slug: 'rgb-to-hex',
    name: 'RGB to HEX Converter',
    tagline: 'Turn RGB values into hex color codes.',
    description:
      'Free online RGB to HEX converter. Turn red, green and blue values into a hex color code for CSS and design tools, plus HSL, HSV and CMYK. Runs entirely in your browser.',
    category: 'Converters',
    keywords: ['rgb to hex', 'rgb to hex converter', 'rgb color to hex', 'convert rgb to hex', 'rgb to hexadecimal'],
    icon: 'M12 3a9 9 0 1 0 0 18 3 3 0 0 0 0-6h-1a2 2 0 0 1 0-4h2a4 4 0 0 0 0-8Z',
  },
  {
    slug: 'rgb-to-hsl-hsv',
    name: 'RGB to HSL / HSV Converter',
    tagline: 'Convert RGB to HSL and HSV/HSB.',
    description:
      'Free online RGB to HSL and HSV converter. Convert red, green and blue into hue, saturation, lightness (HSL) and value (HSB), plus HEX and CMYK. Runs in your browser.',
    category: 'Converters',
    keywords: ['rgb to hsl', 'rgb to hsv', 'hsl converter', 'hsv converter', 'rgb to hsb'],
    icon: 'M12 3a9 9 0 1 0 0 18 3 3 0 0 0 0-6h-1a2 2 0 0 1 0-4h2a4 4 0 0 0 0-8Z',
  },
  {
    slug: 'cmyk-converter',
    name: 'CMYK Converter',
    tagline: 'Convert CMYK to and from RGB & HEX.',
    description:
      'Free online CMYK converter. Convert colors between the CMYK print model and HEX, RGB, HSL and HSV screen models with accurate math. Runs entirely in your browser.',
    category: 'Converters',
    keywords: ['cmyk converter', 'rgb to cmyk', 'cmyk to rgb', 'hex to cmyk', 'cmyk color converter'],
    icon: 'M8 8a4 4 0 1 0 0 8M12 8a4 4 0 1 1 0 8M16 8a4 4 0 1 0 0 8',
  },
  {
    slug: 'color-name',
    name: 'Color Name to Code',
    tagline: 'CSS color names to HEX & RGB, both ways.',
    description:
      'Free online color name converter. Look up any of the 148 CSS named colors as HEX and RGB, or find the nearest color name for a hex or RGB value. Runs in your browser.',
    category: 'Converters',
    keywords: ['color name to code', 'css color names', 'color name to hex', 'html color names', 'name to rgb'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M14 9h6l-6 8h6',
  },
  {
    slug: 'gradient-generator',
    name: 'CSS Gradient Generator',
    tagline: 'Build linear, radial & conic CSS gradients.',
    description:
      'Free online CSS gradient generator. Build linear, radial and conic gradients with multiple color stops, adjustable angle and positions, and copy the CSS. Runs in your browser.',
    category: 'Generators',
    keywords: ['gradient generator', 'css gradient generator', 'linear gradient generator', 'radial gradient', 'background gradient css'],
    icon: 'M4 4h16v16H4zM4 12h16M12 4v16',
  },

  // ---- Converters: Numbers ----
  {
    slug: 'binary-converter',
    name: 'Binary Converter',
    tagline: 'Decimal ↔ binary, and text to binary.',
    description:
      'Free online binary converter. Convert decimal numbers to binary and back, and translate text to 8-bit binary ASCII codes, with hex and octal shown too. Runs in your browser.',
    category: 'Converters',
    keywords: ['binary converter', 'decimal to binary', 'binary to decimal', 'text to binary', 'binary translator'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M14 6h3v12h-3M14 6v12',
  },
  {
    slug: 'hex-converter',
    name: 'Hexadecimal Converter',
    tagline: 'Decimal ↔ hex, and text to hex bytes.',
    description:
      'Free online hexadecimal converter. Convert decimal numbers to hex and back, and translate text to its UTF-8 hex byte codes, with binary and octal shown too. Runs in your browser.',
    category: 'Converters',
    keywords: ['hex converter', 'decimal to hex', 'hex to decimal', 'text to hex', 'hexadecimal converter'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M15 9h5l-5 6h5',
  },
  {
    slug: 'roman-numeral-converter',
    name: 'Roman Numeral Converter',
    tagline: 'Numbers to Roman numerals and back.',
    description:
      'Free online Roman numeral converter. Convert numbers to Roman numerals and Roman numerals back to numbers, with subtractive notation and large-value overlines. Runs in your browser.',
    category: 'Converters',
    keywords: ['roman numeral converter', 'roman numerals', 'number to roman numerals', 'roman numeral translator', 'convert to roman numerals'],
    icon: 'M6 6v12M10 6v12M14 6l2 12M18 6l-2 12',
  },
  {
    slug: 'number-to-words',
    name: 'Number to Words Converter',
    tagline: 'Spell out numbers in English & currency.',
    description:
      'Free online number to words converter. Spell out any number in English for cheques, contracts and invoices, with decimals, negatives and a dollars-and-cents currency mode. Runs in your browser.',
    category: 'Converters',
    keywords: ['number to words', 'number to words converter', 'spell out numbers', 'number in words', 'amount in words'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M13 15h6M13 11h6M13 7h6',
  },
  {
    slug: 'fraction-to-decimal',
    name: 'Fraction to Decimal Converter',
    tagline: 'Fractions ↔ decimals & percentages.',
    description:
      'Free online fraction to decimal converter. Convert fractions and mixed numbers to decimals and percentages, and turn decimals — including repeating ones — into simplified fractions. Runs in your browser.',
    category: 'Converters',
    keywords: ['fraction to decimal', 'fraction to decimal converter', 'decimal to fraction', 'fraction to percent', 'convert fraction to decimal'],
    icon: 'M17 5 7 19M8 6.5a1.5 1.5 0 1 0 0 .01M16 17.5a1.5 1.5 0 1 0 0 .01',
  },
  {
    slug: 'scientific-notation-converter',
    name: 'Scientific Notation Converter',
    tagline: 'Decimals ↔ scientific & E-notation.',
    description:
      'Free online scientific notation converter. Convert decimal numbers to scientific notation and back, with E-notation, engineering notation and order of magnitude shown. Runs in your browser.',
    category: 'Converters',
    keywords: ['scientific notation converter', 'standard form converter', 'e notation converter', 'decimal to scientific notation', 'exponential notation'],
    icon: 'M3 3v18h18M7 15l3-4 3 2 4-6M18 7h2v2',
  },

  // ---- Text & Data ----
  {
    slug: 'json-converter',
    name: 'JSON to XML / YAML / CSV',
    tagline: 'Convert JSON into XML, YAML or CSV.',
    description:
      'Free online JSON converter. Transform JSON into XML, YAML or CSV with nested-structure support and copy the result. Fast, private and runs entirely in your browser.',
    category: 'Developer',
    keywords: ['json to xml', 'json to yaml', 'json to csv', 'json converter', 'convert json'],
    icon: 'M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2',
  },
  {
    slug: 'morse-code-translator',
    name: 'Morse Code Translator',
    tagline: 'Text ↔ Morse with audio playback.',
    description:
      'Free online Morse code translator. Convert text to Morse code and back, covering letters, numbers and punctuation, and play your message as audio beeps. Runs in your browser.',
    category: 'Text',
    keywords: ['morse code translator', 'text to morse code', 'morse code to text', 'morse code converter', 'morse translator'],
    icon: 'M4 12h2M9 12h.01M13 12h4M20 12h.01M4 12v0',
  },
  {
    slug: 'unicode-converter',
    name: 'Unicode & Emoji Converter',
    tagline: 'Characters ↔ code points & escapes.',
    description:
      'Free online Unicode and emoji converter. Reveal the code points behind any text or emoji and encode them as HTML entities, JavaScript escapes and U+ notation. Runs in your browser.',
    category: 'Developer',
    keywords: ['unicode converter', 'emoji to unicode', 'unicode to text', 'character code converter', 'html entity codes'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M14 5l3 14M20 5l-3 14',
  },
  {
    slug: 'ascii-art-generator',
    name: 'ASCII Art Generator',
    tagline: 'Turn text into big ASCII letter art.',
    description:
      'Free online ASCII art generator. Turn text into large ASCII letter banners for code comments, terminals and READMEs, in several styles, and copy the result. Runs in your browser.',
    category: 'Text',
    keywords: ['ascii art generator', 'text to ascii art', 'ascii text generator', 'text art generator', 'ascii banner'],
    icon: 'M4 5h16v14H4zM8 9v6M8 9h3M8 12h2M14 9v6M16 9v6M14 9h2',
  },
  {
    slug: 'barcode-generator',
    name: 'Barcode Generator',
    tagline: 'Create Code 128 barcodes (PNG / SVG).',
    description:
      'Free online barcode generator. Create Code 128 barcodes from any text or numbers, adjust the height and label, and download as PNG or SVG. Generated privately in your browser.',
    category: 'Generators',
    keywords: ['barcode generator', 'code 128 generator', 'create barcode', 'free barcode maker', 'barcode png svg'],
    icon: 'M4 5v14M7 5v14M9 5v14M12 5v14M14 5v14M17 5v14M20 5v14',
  },
  {
    slug: 'text-to-speech',
    name: 'Text to Speech',
    tagline: 'Read text aloud with natural voices.',
    description:
      'Free online text to speech tool. Read any text aloud using the voices built into your device, with adjustable rate and pitch. Uses your browser — text never leaves your device.',
    category: 'Text',
    keywords: ['text to speech', 'tts online', 'read text aloud', 'text to voice', 'speech synthesizer'],
    icon: 'M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14',
  },

  // ---- Converters: Date & Time ----
  {
    slug: 'timezone-converter',
    name: 'Time Zone Converter',
    tagline: 'Compare a time across world zones.',
    description:
      'Free online time zone converter. Convert a date and time across multiple world cities and zones at once, with daylight saving handled automatically. Runs in your browser.',
    category: 'Converters',
    keywords: ['time zone converter', 'timezone converter', 'world clock converter', 'meeting time planner', 'utc time converter'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
  },
  {
    slug: 'date-format-converter',
    name: 'Date Format Converter',
    tagline: 'One date shown in every format.',
    description:
      'Free online date format converter. Parse a date in almost any format or as a Unix timestamp and see it in ISO 8601, RFC 2822, US, European and long forms at once. Runs in your browser.',
    category: 'Converters',
    keywords: ['date format converter', 'date converter', 'iso 8601 converter', 'change date format', 'date to timestamp'],
    icon: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM8 13h3M8 17h5',
  },

  // ---- Developer / CSS ----
  {
    slug: 'px-to-rem',
    name: 'PX to REM Converter',
    tagline: 'Convert px to rem & em for CSS.',
    description:
      'Free online PX to REM converter. Convert pixel values to rem and em units for responsive CSS with a custom root font size, and back again, with a reference table. Runs in your browser.',
    category: 'Developer',
    keywords: ['px to rem', 'px to rem converter', 'rem to px', 'px to em', 'pixel to rem'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M14 12h6M17 9v6',
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    tagline: 'Beautify & format SQL queries.',
    description:
      'Free online SQL formatter. Beautify messy SQL into clean, readable queries with clause-per-line layout, indentation and configurable keyword case. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['sql formatter', 'sql beautifier', 'format sql online', 'sql pretty print', 'sql query formatter'],
    icon: 'M4 6a8 3 0 0 0 16 0 8 3 0 0 0-16 0v12a8 3 0 0 0 16 0V6M4 12a8 3 0 0 0 16 0',
  },
  {
    slug: 'curl-to-code',
    name: 'cURL to Code',
    tagline: 'Convert curl to fetch, axios or Python.',
    description:
      'Free online cURL to code converter. Turn a curl command into JavaScript fetch, Node.js axios or Python requests code, including method, headers and body. Runs in your browser.',
    category: 'Developer',
    keywords: ['curl to code', 'curl to fetch', 'curl to python', 'curl converter', 'curl to javascript'],
    icon: 'M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2M10 12h4',
  },
  {
    slug: 'json-to-typescript',
    name: 'JSON to TypeScript',
    tagline: 'Generate TypeScript interfaces from JSON.',
    description:
      'Free online JSON to TypeScript converter. Turn a JSON sample into clean TypeScript interfaces, inferring types for nested objects and arrays. Fast, private and runs in your browser.',
    category: 'Developer',
    keywords: ['json to typescript', 'json to interface', 'json to ts', 'generate typescript types', 'json to type'],
    icon: 'M3 3h18v18H3zM7 9h4M9 9v6M13 15h2a2 2 0 0 0 0-4 2 2 0 0 1 0-4h2',
  },
  {
    slug: 'js-beautifier',
    name: 'JavaScript Beautifier / Minifier',
    tagline: 'Format or minify JavaScript code.',
    description:
      'Free online JavaScript beautifier and minifier. Beautify messy code with clean indentation, or minify it to shrink file size, preserving strings and comments. Runs in your browser.',
    category: 'Developer',
    keywords: ['javascript beautifier', 'js minifier', 'js beautifier', 'format javascript', 'minify javascript'],
    icon: 'M4 17l6-6-6-6M12 19h8',
  },
  {
    slug: 'coordinate-converter',
    name: 'Coordinate Converter',
    tagline: 'GPS decimal ↔ DMS, DDM & UTM.',
    description:
      'Free online GPS coordinate converter. Convert latitude and longitude between decimal degrees, DMS, DDM and UTM, and build a geo URI. Great for maps and navigation. Runs in your browser.',
    category: 'Converters',
    keywords: ['coordinate converter', 'gps coordinate converter', 'decimal to dms', 'lat long converter', 'utm converter'],
    icon: 'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7ZM12 9a2 2 0 1 0 0 .01',
  },
  {
    slug: 'ip-address-converter',
    name: 'IP Address Converter',
    tagline: 'IPv4 ↔ integer, hex & binary.',
    description:
      'Free online IP address converter. Convert an IPv4 address between dotted-decimal, 32-bit integer, hexadecimal, binary and IPv4-mapped IPv6 forms. Runs entirely in your browser.',
    category: 'Converters',
    keywords: ['ip address converter', 'ip to decimal', 'ip to integer', 'ip to hex', 'ipv4 converter'],
    icon: 'M4 7h16v10H4zM4 12h16M8 9.5h.01M8 14.5h.01',
  },
  {
    slug: 'text-encoding-converter',
    name: 'Text Encoding Converter',
    tagline: 'Text ↔ UTF-8, UTF-16 & ASCII bytes.',
    description:
      'Free online text encoding converter. See the raw bytes behind text in UTF-8, UTF-16 and ASCII in hex, decimal or binary, and decode UTF-8 bytes back to text. Runs in your browser.',
    category: 'Developer',
    keywords: ['text encoding converter', 'utf-8 converter', 'text to bytes', 'ascii converter', 'utf-8 to text'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M15 9l3 3-3 3M20 12h-5',
  },
  {
    slug: 'css-to-scss',
    name: 'CSS to SCSS Converter',
    tagline: 'Convert CSS to nested SCSS with variables.',
    description:
      'Free online CSS to SCSS converter. Rewrite plain CSS into SCSS with nested selectors and repeated colors pulled into variables. Valid Sass output, generated in your browser.',
    category: 'Developer',
    keywords: ['css to scss', 'css to sass', 'convert css to scss', 'scss converter', 'css to scss online'],
    icon: 'M4 3h16l-1.5 17L12 22l-6.5-2zM8 8h8l-.5 5L12 14l-3.5-1',
  },

  // ---- Converters: Everyday sizes ----
  {
    slug: 'shoe-size-converter',
    name: 'Shoe & Clothing Size Converter',
    tagline: 'US, UK & EU shoe and clothing sizes.',
    description:
      'Free online shoe and clothing size converter. Convert between US, UK and EU shoe sizes with foot length in cm, plus clothing sizes, using full charts. Runs in your browser.',
    category: 'Converters',
    keywords: ['shoe size converter', 'clothing size converter', 'us to uk shoe size', 'eu shoe size converter', 'shoe size chart'],
    icon: 'M3 7c2 0 3 1 5 1s3 3 6 3 6 1 6 3v3H3zM3 14h18',
  },
  {
    slug: 'bra-size-converter',
    name: 'Bra Size Converter',
    tagline: 'US, UK, EU & FR band and cup sizes.',
    description:
      'Free online bra size converter. Convert band and cup sizes between US, UK, European and French systems, handling the differing band numbers and cup letters. Runs in your browser.',
    category: 'Converters',
    keywords: ['bra size converter', 'bra size chart', 'us to uk bra size', 'eu bra size converter', 'cup size converter'],
    icon: 'M4 6c2 0 3 4 8 4s6-4 8-4v3a8 8 0 0 1-16 0zM4 6v3M20 6v3',
  },
  {
    slug: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    tagline: 'Screen ratios & proportional resize.',
    description:
      'Free online aspect ratio calculator. Find the simplified ratio of any screen or image size and resize dimensions while keeping the ratio, with common presets. Runs in your browser.',
    category: 'Converters',
    keywords: ['aspect ratio calculator', 'screen resolution calculator', 'ratio calculator', '16:9 calculator', 'image aspect ratio'],
    icon: 'M3 5h18v14H3zM7 9h6v6H7z',
  },

  // ---- Image: format converters (canvas-based, no upload) ----
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    tagline: 'Convert JPEG photos to lossless PNG.',
    description:
      'Free online JPG to PNG converter. Turn JPEG photos into lossless PNG images right in your browser, with no quality loss and no uploads. Fast, private and free.',
    category: 'Image',
    keywords: ['jpg to png', 'jpeg to png', 'convert jpg to png', 'jpg to png converter', 'change jpg to png'],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4M15 8h.01',
  },
  {
    slug: 'png-to-webp',
    name: 'PNG to WebP Converter',
    tagline: 'Shrink PNGs to modern WebP format.',
    description:
      'Free online PNG to WebP converter. Convert PNG images to smaller WebP files with adjustable quality, keeping transparency. Runs entirely in your browser — no uploads.',
    category: 'Image',
    keywords: ['png to webp', 'convert png to webp', 'png to webp converter', 'webp converter', 'compress png to webp'],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4M15 8h.01',
  },
  {
    slug: 'webp-to-jpg',
    name: 'WebP to JPG Converter',
    tagline: 'Convert WebP images to JPEG.',
    description:
      'Free online WebP to JPG converter. Turn WebP images into widely compatible JPEG files with adjustable quality, flattening transparency to white. Runs in your browser — no uploads.',
    category: 'Image',
    keywords: ['webp to jpg', 'webp to jpeg', 'convert webp to jpg', 'webp to jpg converter', 'change webp to jpg'],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4M15 8h.01',
  },
  {
    slug: 'svg-to-png',
    name: 'SVG to PNG Converter',
    tagline: 'Rasterize SVG vectors to PNG.',
    description:
      'Free online SVG to PNG converter. Rasterize scalable vector graphics into PNG images with transparency, for platforms that do not accept SVG. Runs in your browser — no uploads.',
    category: 'Image',
    keywords: ['svg to png', 'convert svg to png', 'svg to png converter', 'rasterize svg', 'svg to image'],
    icon: 'M4 5h16v14H4zM8 15l3-3 2 2 3-4M15 8h.01',
  },
  {
    slug: 'bmp-converter',
    name: 'BMP Converter',
    tagline: 'Convert images to 24-bit BMP.',
    description:
      'Free online BMP converter. Convert JPG, PNG and WebP images into uncompressed 24-bit Windows Bitmap (.bmp) files. Encoded in your browser from raw pixels — no uploads.',
    category: 'Image',
    keywords: ['bmp converter', 'png to bmp', 'jpg to bmp', 'convert to bmp', 'image to bmp'],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4',
  },
  {
    slug: 'ico-converter',
    name: 'ICO Converter (Favicon)',
    tagline: 'Make multi-size .ico favicons.',
    description:
      'Free online ICO converter. Turn any image into a multi-resolution Windows icon or favicon (.ico) at 16, 32, 48 and 64 pixels using embedded PNG data. Runs in your browser.',
    category: 'Image',
    keywords: ['ico converter', 'favicon generator', 'png to ico', 'convert to ico', 'favicon converter'],
    icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  },
  {
    slug: 'base64-to-image',
    name: 'Base64 to Image',
    tagline: 'Decode Base64 or data URIs to images.',
    description:
      'Free online Base64 to image converter. Decode a Base64 string or data URI back into a viewable image and download it. The counterpart to image-to-Base64. Runs in your browser.',
    category: 'Image',
    keywords: ['base64 to image', 'base64 to png', 'data uri to image', 'decode base64 image', 'base64 image decoder'],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4M7 8l-2 2 2 2',
  },
];

export const categories: ToolCategory[] = [
  'Text',
  'Developer',
  'Image',
  'Converters',
  'Calculators',
  'Generators',
  'Security',
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}
