// Central tool registry. Drives the home grid, dynamic routes, sitemap,
// and per-tool SEO. Each tool is a "district" in ToolCities.

import { UNIT_CATEGORIES } from '../lib/units';
import { MEDIA_CONVERSIONS } from '../lib/media';

export type ToolCategory =
  | 'Text'
  | 'Developer'
  | 'Image'
  | 'Converters'
  | 'Calculators'
  | 'Generators'
  | 'Security'
  | 'PDF'
  | 'Audio & Video';

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
  /** Hide the tagline in the tool page header (still used for cards & SEO). */
  hideTagline?: boolean;
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

  // ---- Text: voice ----
  {
    slug: 'speech-to-text',
    name: 'Speech to Text',
    tagline: 'Transcribe your voice into editable text.',
    description:
      'Free online speech to text tool. Transcribe your voice into editable text live using your browser’s built-in speech recognition, in many languages. No audio is uploaded or stored.',
    category: 'Text',
    keywords: ['speech to text', 'voice to text', 'dictation online', 'transcribe voice', 'speech recognition'],
    icon: 'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM5 11a7 7 0 0 0 14 0M12 18v3M8 21h8',
  },

  // ---- Converters: live rates (fetch public data — see privacy policy) ----
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    tagline: 'Live exchange rates for 30+ currencies.',
    description:
      'Free online currency converter with live European Central Bank exchange rates for 30+ currencies. Convert any amount and see a quick reference table. Rates fetched in your browser.',
    category: 'Converters',
    keywords: ['currency converter', 'exchange rate calculator', 'usd to eur', 'money converter', 'live currency rates'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9.5 9a2.5 2.5 0 0 1 5 0M14.5 15a2.5 2.5 0 0 1-5 0M12 7v10',
  },
  {
    slug: 'crypto-converter',
    name: 'Cryptocurrency Converter',
    tagline: 'Live crypto prices in any currency.',
    hideTagline: true,
    description:
      'Free online cryptocurrency converter with live market prices. Convert Bitcoin, Ethereum, Solana and more to and from world currencies, with a live price table. Prices fetched in your browser.',
    category: 'Converters',
    keywords: ['crypto converter', 'bitcoin converter', 'cryptocurrency converter', 'btc to usd', 'eth to usd'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9 8h4a2 2 0 0 1 0 4H9m0 0h4.5a2 2 0 0 1 0 4H9m0-8V6m0 12v-2m2-10v2m0 8v2',
  },

  // ---- PDF (pdf-lib / pdf.js, all client-side) ----
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF Converter',
    tagline: 'Combine JPG & PNG images into one PDF.',
    description:
      'Free online image to PDF converter. Combine JPG and PNG images into a single PDF, reorder pages, and choose page size and margins. Assembled in your browser — never uploaded.',
    category: 'PDF',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert image to pdf', 'photos to pdf'],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4M15 8h.01',
  },
  {
    slug: 'pdf-merge',
    name: 'PDF Merge',
    tagline: 'Combine multiple PDFs into one.',
    description:
      'Free online PDF merge tool. Combine several PDF files into a single document and reorder them by dragging, preserving page content and sizes. Merged in your browser — never uploaded.',
    category: 'PDF',
    keywords: ['pdf merge', 'merge pdf', 'combine pdf', 'join pdf files', 'pdf combiner'],
    icon: 'M9 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M15 21h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3M12 8v8M9 12h6',
  },
  {
    slug: 'pdf-split',
    name: 'PDF Split',
    tagline: 'Extract pages or split a PDF apart.',
    description:
      'Free online PDF split tool. Extract a page range into a new PDF or split every page into its own file. The original is untouched. Runs in your browser — never uploaded.',
    category: 'PDF',
    keywords: ['pdf split', 'split pdf', 'extract pdf pages', 'separate pdf pages', 'pdf splitter'],
    icon: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M9 13h6M12 13v4',
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    tagline: 'Render PDF pages to JPG or PNG images.',
    description:
      'Free online PDF to JPG converter. Render each page of a PDF into a JPG or PNG image at your chosen resolution, then download single pages or all of them. Runs in your browser.',
    category: 'PDF',
    keywords: ['pdf to jpg', 'pdf to png', 'pdf to image', 'convert pdf to jpg', 'pdf pages to images'],
    icon: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 17l2-2 2 2 3-3',
  },
  {
    slug: 'pdf-to-text',
    name: 'PDF to Text (OCR)',
    tagline: 'Extract text from PDFs, with OCR fallback.',
    description:
      'Free online PDF to text tool. Extract the embedded text layer from digital PDFs instantly, or run in-browser OCR on scanned documents. Copy or download the result. Nothing is uploaded.',
    category: 'PDF',
    keywords: ['pdf to text', 'pdf ocr', 'extract text from pdf', 'pdf to txt', 'ocr pdf online'],
    icon: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5',
  },

  // ---- Image: format converters needing decode/vectorize libs ----
  {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG Converter',
    tagline: 'Convert iPhone HEIC photos to JPG/PNG.',
    description:
      'Free online HEIC to JPG converter. Convert Apple HEIC and HEIF photos into universal JPG or PNG images, in bulk, with adjustable quality. Decoded in your browser — never uploaded.',
    category: 'Image',
    keywords: ['heic to jpg', 'heic to jpeg', 'convert heic', 'heic to png', 'iphone photo converter'],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4M15 8h.01',
  },
  {
    slug: 'tiff-converter',
    name: 'TIFF Converter',
    tagline: 'TIFF ↔ PNG, JPG & WebP.',
    description:
      'Free online TIFF converter. Convert TIFF/TIF images to PNG, JPG or WebP, or turn ordinary images into TIFF. Decoded in your browser with a pure-JS engine — never uploaded.',
    category: 'Image',
    keywords: ['tiff converter', 'tiff to jpg', 'tiff to png', 'convert tiff', 'tif to jpg'],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4M15 8h.01',
  },
  {
    slug: 'png-to-svg',
    name: 'PNG to SVG (Vectorize)',
    tagline: 'Trace raster images into scalable SVG.',
    description:
      'Free online PNG to SVG converter. Vectorize logos, icons and flat graphics into scalable SVG paths with adjustable detail, then download. Traced in your browser — never uploaded.',
    category: 'Image',
    keywords: ['png to svg', 'image to svg', 'vectorize image', 'raster to vector', 'convert png to svg'],
    icon: 'M12 3l9 5v8l-9 5-9-5V8zM12 3v18M3 8l9 5 9-5',
  },

  // ---- Audio & Video: straight format conversions (data in src/lib/media.ts) ----
  ...MEDIA_CONVERSIONS.map((c): Tool => ({
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    category: 'Audio & Video',
    keywords: c.keywords,
    icon: c.icon,
  })),

  // ---- Audio & Video: special tools (custom UI) ----
  {
    slug: 'video-to-gif',
    name: 'Video to GIF Converter',
    tagline: 'Turn a video clip into an animated GIF.',
    description:
      'Free online video to GIF converter. Turn a clip from any video into an animated GIF with adjustable start, duration, width and frame rate, using a clean two-pass palette. Runs in your browser.',
    category: 'Audio & Video',
    keywords: ['video to gif', 'mp4 to gif', 'convert video to gif', 'make a gif', 'video to gif converter'],
    icon: 'M4 5h16v14H4zM10 9l5 3-5 3z',
  },
  {
    slug: 'gif-to-mp4',
    name: 'GIF to MP4 Converter',
    tagline: 'Convert animated GIFs to compact MP4.',
    description:
      'Free online GIF to MP4 converter. Turn animated GIFs into MP4 video that is a fraction of the size for the same animation, ideal for web and messaging. Runs in your browser.',
    category: 'Audio & Video',
    keywords: ['gif to mp4', 'convert gif to mp4', 'gif to video', 'gif to mp4 converter', 'animated gif to mp4'],
    icon: 'M4 5h16v14H4zM10 9l5 3-5 3z',
  },
  {
    slug: 'video-compressor',
    name: 'Video Compressor',
    tagline: 'Shrink video file size in your browser.',
    description:
      'Free online video compressor. Reduce video file size by re-encoding with H.264 at a chosen quality and optional lower resolution, with before-and-after sizes. Runs in your browser.',
    category: 'Audio & Video',
    keywords: ['video compressor', 'compress video', 'reduce video size', 'shrink video', 'video compressor online'],
    icon: 'M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4M4 12h16',
  },
  {
    slug: 'audio-compressor',
    name: 'Audio Compressor',
    tagline: 'Reduce audio file size to MP3.',
    description:
      'Free online audio compressor. Reduce MP3, WAV and M4A file size by re-encoding to MP3 at a chosen bitrate, with an optional mono mixdown for voice. Runs in your browser.',
    category: 'Audio & Video',
    keywords: ['audio compressor', 'compress audio', 'reduce audio size', 'compress mp3', 'shrink audio file'],
    icon: 'M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4M9 12h6',
  },
  {
    slug: 'audio-speed-changer',
    name: 'Audio Speed & Pitch Changer',
    tagline: 'Change audio speed and pitch.',
    description:
      'Free online audio speed and pitch changer. Slow down or speed up audio and shift pitch in semitones, independently or linked, for practice, transcription and effects. Runs in your browser.',
    category: 'Audio & Video',
    keywords: ['audio speed changer', 'change audio pitch', 'slow down audio', 'pitch shifter', 'speed up audio'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 7v5l4 2',
  },

  // ================= Generators mega-expansion =================

  // ---- Batch 1: IDs & codes ----
  {
    slug: 'upc-generator',
    name: 'UPC Code Generator',
    tagline: 'Generate valid UPC-A barcodes with check digit.',
    description:
      'Free online UPC code generator. Create valid UPC-A retail barcodes with a correct mod-10 check digit and download them as PNG or SVG. Generated in your browser — nothing is uploaded.',
    category: 'Generators',
    keywords: ['upc generator', 'upc code generator', 'upc-a barcode generator', 'create upc barcode', 'upc barcode maker'],
    icon: 'M4 6v12M7 6v12M10 6v12M13 6v12M17 6v12M20 6v12',
  },
  {
    slug: 'isbn-generator',
    name: 'ISBN Generator',
    tagline: 'Generate ISBN-13 numbers & barcodes.',
    description:
      'Free online ISBN generator. Create valid ISBN-13 book numbers with a correct check digit and matching EAN-13 barcode you can download as PNG or SVG. Runs in your browser.',
    category: 'Generators',
    keywords: ['isbn generator', 'isbn-13 generator', 'isbn barcode generator', 'book barcode generator', 'generate isbn'],
    icon: 'M4 5h13a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM4 5v12M8 8h7M8 12h5',
  },
  {
    slug: 'gtin-generator',
    name: 'GTIN Generator',
    tagline: 'Generate GTIN-8/12/13/14 with check digit.',
    description:
      'Free online GTIN generator. Create valid GTIN-8, GTIN-12, GTIN-13 and GTIN-14 global trade item numbers with a correct check digit and barcode. Runs in your browser.',
    category: 'Generators',
    keywords: ['gtin generator', 'gtin-14 generator', 'gtin check digit', 'global trade item number', 'generate gtin'],
    icon: 'M4 6v12M7 6v12M11 6v12M14 6v12M18 6v12M20 6v12',
  },
  {
    slug: 'imei-generator',
    name: 'IMEI Number Generator',
    tagline: 'Generate Luhn-valid IMEI numbers for testing.',
    description:
      'Free online IMEI number generator. Create 15-digit IMEI numbers that pass the Luhn checksum, for app testing and QA. For testing only — these are not real devices. Runs in your browser.',
    category: 'Generators',
    keywords: ['imei generator', 'imei number generator', 'fake imei generator', 'valid imei generator', 'test imei'],
    icon: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM10 19h4',
  },
  {
    slug: 'data-matrix-generator',
    name: 'Data Matrix Code Generator',
    tagline: 'Encode text into a Data Matrix 2D code.',
    description:
      'Free online Data Matrix generator. Encode any text or numbers into a compact Data Matrix 2D barcode and download it as PNG or SVG. Generated in your browser — never uploaded.',
    category: 'Generators',
    keywords: ['data matrix generator', 'data matrix code generator', 'datamatrix barcode', '2d barcode generator', 'create data matrix'],
    icon: 'M4 4h4v4H4zM10 4h2v2h-2zM16 4h4v4h-4zM4 10h2v2H4zM8 10h4v4H8zM14 10h2v2h-2zM18 12h2v2h-2zM4 16h4v4H4zM10 16h2v2h-2zM16 16h4v4h-4z',
  },
  {
    slug: 'pdf417-generator',
    name: 'PDF417 Barcode Generator',
    tagline: 'Encode data into a PDF417 stacked barcode.',
    description:
      'Free online PDF417 barcode generator. Encode text and data into a high-capacity PDF417 stacked 2D barcode — used on IDs and boarding passes — and download it. Runs in your browser.',
    category: 'Generators',
    keywords: ['pdf417 generator', 'pdf417 barcode generator', 'create pdf417', 'pdf417 code', '2d barcode generator'],
    icon: 'M3 6v12M5 6v12M8 6v12M10 6v12M13 6v12M15 6v12M18 6v12M21 6v12',
  },
  {
    slug: 'aztec-generator',
    name: 'Aztec Code Generator',
    tagline: 'Encode text into an Aztec 2D code.',
    description:
      'Free online Aztec code generator. Encode any text into an Aztec 2D barcode — common on transit and event tickets — and download it as PNG or SVG. Generated in your browser.',
    category: 'Generators',
    keywords: ['aztec code generator', 'aztec barcode generator', 'create aztec code', '2d barcode generator', 'aztec 2d code'],
    icon: 'M4 4h16v16H4zM8 8h8v8H8zM11 11h2v2h-2z',
  },
  {
    slug: 'vin-generator',
    name: 'VIN Generator',
    tagline: 'Generate check-digit-valid VINs for testing.',
    description:
      'Free online VIN generator. Create 17-character vehicle identification numbers with a valid position-9 check digit, for testing and sample data. Not real vehicles. Runs in your browser.',
    category: 'Generators',
    keywords: ['vin generator', 'vehicle identification number generator', 'fake vin generator', 'test vin', 'random vin'],
    icon: 'M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M5 11h14v5H5zM7 16v2M17 16v2',
  },
  {
    slug: 'serial-number-generator',
    name: 'Serial Number Generator',
    tagline: 'Bulk serial numbers with custom format.',
    description:
      'Free online serial number generator. Create sequential or random serial numbers in bulk with a custom prefix, suffix, length and padding. Generated in your browser — nothing uploaded.',
    category: 'Generators',
    keywords: ['serial number generator', 'random serial number', 'bulk serial generator', 'product serial generator', 'sequential number generator'],
    icon: 'M4 7h16v10H4zM8 7v10M12 7v10M16 7v10',
  },
  {
    slug: 'sku-generator',
    name: 'SKU Generator',
    tagline: 'Structured product SKUs from attributes.',
    description:
      'Free online SKU generator. Build structured stock-keeping unit codes from a brand, category, color and size, or generate them in bulk. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['sku generator', 'product sku generator', 'stock keeping unit generator', 'create sku', 'inventory sku maker'],
    icon: 'M3 7l9-4 9 4-9 4zM3 7v10l9 4M21 7v10l-9 4M3 12l9 4 9-4',
  },
  {
    slug: 'coupon-code-generator',
    name: 'Coupon Code Generator',
    tagline: 'Bulk unique coupon codes for promotions.',
    description:
      'Free online coupon code generator. Create batches of unique, hard-to-guess coupon codes with a custom prefix, length and character set for promotions. Generated in your browser.',
    category: 'Generators',
    keywords: ['coupon code generator', 'promo code generator', 'discount code generator', 'bulk coupon generator', 'create coupon codes'],
    icon: 'M4 8a2 2 0 0 0 0 8v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a2 2 0 0 1 0-8V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1zM12 6v12',
  },
  {
    slug: 'voucher-code-generator',
    name: 'Voucher Code Generator',
    tagline: 'Readable voucher / gift codes in bulk.',
    description:
      'Free online voucher code generator. Create readable gift and voucher codes in grouped blocks (e.g. XXXX-XXXX-XXXX) with no ambiguous characters, in bulk. Runs in your browser.',
    category: 'Generators',
    keywords: ['voucher code generator', 'gift code generator', 'gift card code generator', 'redeem code generator', 'bulk voucher codes'],
    icon: 'M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM7 12h4M15 12h2',
  },

  // ---- Batch 2: Secrets & security ----
  {
    slug: 'passphrase-generator',
    name: 'Passphrase Generator',
    tagline: 'Memorable multi-word passphrases (Diceware-style).',
    description:
      'Free online passphrase generator. Create strong, memorable passphrases from random common words in the Diceware style, with adjustable word count, separators and casing. Generated locally — never uploaded.',
    category: 'Security',
    keywords: ['passphrase generator', 'diceware generator', 'memorable password generator', 'word password generator', 'random passphrase'],
    icon: 'M4 12a4 4 0 0 1 8 0 4 4 0 0 0 8 0M4 12a4 4 0 0 0 8 0 4 4 0 0 1 8 0',
  },
  {
    slug: 'pin-generator',
    name: 'PIN Generator',
    tagline: 'Random numeric PIN codes in bulk.',
    description:
      'Free online PIN generator. Create random numeric PINs of any length (4, 6 or custom) one at a time or in bulk, using your browser secure random source. Nothing is sent to a server.',
    category: 'Security',
    keywords: ['pin generator', 'random pin generator', '4 digit pin generator', '6 digit pin generator', 'numeric pin code'],
    icon: 'M5 8h.01M12 8h.01M19 8h.01M5 14h.01M12 14h.01M19 14h.01',
  },
  {
    slug: 'api-key-generator',
    name: 'API Key Generator',
    tagline: 'Prefixed API keys with strong entropy.',
    description:
      'Free online API key generator. Create high-entropy API keys with an optional prefix (like sk_live_) in hex, base62 or base64url, one or many at a time. Generated in your browser — never uploaded.',
    category: 'Security',
    keywords: ['api key generator', 'generate api key', 'random api key', 'secret api key generator', 'api token generator'],
    icon: 'M14 7a5 5 0 1 0-4.9 6H12v3h3v3h4v-3l-1.1-1.1A5 5 0 0 0 14 7ZM7 12a1 1 0 1 0 0 .01',
  },
  {
    slug: 'secret-key-generator',
    name: 'Secret Key Generator',
    tagline: 'Cryptographic secret keys (128–512 bit).',
    description:
      'Free online secret key generator. Generate cryptographically strong secret keys of 128 to 512 bits in hex, base64 or base64url — ideal for JWT, session and app secrets. Generated locally in your browser.',
    category: 'Security',
    keywords: ['secret key generator', 'random secret generator', 'jwt secret generator', 'encryption key generator', 'app secret generator'],
    icon: 'M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3Z',
  },
  {
    slug: 'random-token-generator',
    name: 'Random Token Generator',
    tagline: 'Secure random tokens, any length or encoding.',
    description:
      'Free online random token generator. Generate secure random tokens in hex, base64url, base62 or a custom alphabet, at any length and in bulk, using the Web Crypto API. Runs entirely in your browser.',
    category: 'Security',
    keywords: ['random token generator', 'secure token generator', 'csrf token generator', 'access token generator', 'random string token'],
    icon: 'M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16',
  },
  {
    slug: 'jwt-generator',
    name: 'JWT Generator',
    tagline: 'Sign HS256 JSON Web Tokens in-browser.',
    description:
      'Free online JWT generator. Build and sign HMAC (HS256/384/512) JSON Web Tokens from a custom header, payload and secret, entirely in your browser with the Web Crypto API. Your secret never leaves your device.',
    category: 'Security',
    keywords: ['jwt generator', 'generate jwt', 'sign jwt online', 'json web token generator', 'hs256 jwt generator'],
    icon: 'M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm0 11v4',
  },
  {
    slug: 'totp-generator',
    name: 'TOTP / 2FA Code Generator',
    tagline: 'TOTP secrets, live codes & otpauth QR.',
    description:
      'Free online TOTP and 2FA code generator. Create a Base32 TOTP secret, see the live 6-digit code refresh every 30 seconds, and get the otpauth URL and QR for authenticator apps. Runs in your browser.',
    category: 'Security',
    keywords: ['totp generator', '2fa code generator', 'authenticator code generator', 'totp secret generator', 'otpauth qr generator'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 7v5l3 2M12 2v3M12 19v3',
  },
  {
    slug: 'bcrypt-generator',
    name: 'Bcrypt Hash Generator',
    tagline: 'Hash & verify passwords with bcrypt.',
    description:
      'Free online bcrypt generator. Hash passwords with bcrypt at an adjustable cost factor, and verify a password against an existing bcrypt hash — all locally in your browser. Your password is never uploaded.',
    category: 'Security',
    keywords: ['bcrypt generator', 'bcrypt hash generator', 'bcrypt password hash', 'bcrypt online', 'hash password bcrypt'],
    icon: 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18',
  },
  {
    slug: 'htpasswd-generator',
    name: '.htpasswd Generator',
    tagline: 'Apache/Nginx htpasswd credential lines.',
    description:
      'Free online .htpasswd generator. Create Apache and Nginx basic-auth credential lines with bcrypt or SHA hashing from a username and password, ready to paste into your .htpasswd file. Runs in your browser.',
    category: 'Security',
    keywords: ['htpasswd generator', 'apache htpasswd generator', 'nginx basic auth generator', 'htpasswd bcrypt', 'basic auth password generator'],
    icon: 'M4 6h16v12H4zM4 10h16M8 14h4',
  },
  {
    slug: 'ssh-key-generator',
    name: 'SSH Key Generator',
    tagline: 'RSA key pairs in OpenSSH & PEM format.',
    description:
      'Free online SSH key generator. Generate an RSA key pair in your browser and download the OpenSSH public key and PEM private key. Keys are created locally with a JS crypto engine and never leave your device.',
    category: 'Security',
    keywords: ['ssh key generator', 'generate ssh key', 'rsa key generator', 'ssh keygen online', 'ssh key pair generator'],
    icon: 'M14 7a5 5 0 1 0-4.9 6H12v3h3v3h4v-3l-1.1-1.1A5 5 0 0 0 14 7ZM7 12a1 1 0 1 0 0 .01',
  },
  {
    slug: 'ssl-csr-generator',
    name: 'SSL CSR Generator',
    tagline: 'Certificate signing requests & private key.',
    description:
      'Free online SSL CSR generator. Create a certificate signing request (CSR) and matching RSA private key from your domain and organization details, entirely in your browser. Your private key never leaves your device.',
    category: 'Security',
    keywords: ['csr generator', 'ssl csr generator', 'certificate signing request generator', 'generate csr online', 'csr and private key generator'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9 12l2 2 4-4',
  },

  // ---- Batch 3: Fake / test data ----
  {
    slug: 'fake-name-generator',
    name: 'Fake Name Generator',
    tagline: 'Random full names for testing & demos.',
    description:
      'Free online fake name generator. Generate random realistic full names — first and last, by gender — one at a time or in bulk for testing, mockups and sample data. Runs in your browser, nothing uploaded.',
    category: 'Generators',
    keywords: ['fake name generator', 'random name generator', 'random full name', 'test name generator', 'dummy name generator'],
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  },
  {
    slug: 'fake-address-generator',
    name: 'Fake Address Generator',
    tagline: 'Random street addresses for testing.',
    description:
      'Free online fake address generator. Generate random realistic-looking street addresses with city, state and ZIP for form testing and sample data. Fictional only. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['fake address generator', 'random address generator', 'test address generator', 'dummy address', 'random street address'],
    icon: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6',
  },
  {
    slug: 'fake-email-generator',
    name: 'Fake Email Generator',
    tagline: 'Random email addresses for test data.',
    description:
      'Free online fake email generator. Generate random email addresses from names for testing signup forms, databases and mailing lists. Uses example/test domains. Runs in your browser.',
    category: 'Generators',
    keywords: ['fake email generator', 'random email generator', 'test email generator', 'dummy email address', 'sample email generator'],
    icon: 'M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM4 7l8 6 8-6',
  },
  {
    slug: 'fake-phone-generator',
    name: 'Fake Phone Number Generator',
    tagline: 'Random phone numbers by country format.',
    description:
      'Free online fake phone number generator. Generate random phone numbers in US, UK and international formats for testing forms and sample data. Uses reserved test ranges. Runs in your browser.',
    category: 'Generators',
    keywords: ['fake phone number generator', 'random phone number generator', 'test phone number', 'dummy phone number', 'sample phone numbers'],
    icon: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l2 5v0a2 2 0 0 1-2 2 16 16 0 0 1-15-15 2 2 0 0 1 2-2Z',
  },
  {
    slug: 'credit-card-generator',
    name: 'Credit Card Number Generator',
    tagline: 'Luhn-valid test card numbers (not real).',
    description:
      'Free online credit card number generator. Generate Luhn-valid test card numbers for Visa, Mastercard, Amex and Discover with expiry and CVV, for payment-form QA. Test data only — not real cards. Runs in your browser.',
    category: 'Generators',
    keywords: ['credit card generator', 'test credit card number generator', 'fake credit card generator', 'luhn valid card number', 'dummy card number'],
    icon: 'M3 7h18v10H3zM3 10h18M6 14h4',
  },
  {
    slug: 'iban-generator',
    name: 'IBAN Generator',
    tagline: 'Format-valid IBANs for testing.',
    description:
      'Free online IBAN generator. Generate international bank account numbers with a valid mod-97 check for several countries, for testing payment and banking forms. Not real accounts. Runs in your browser.',
    category: 'Generators',
    keywords: ['iban generator', 'test iban generator', 'fake iban generator', 'valid iban generator', 'random iban'],
    icon: 'M3 21h18M4 10h16M5 10 12 4l7 6M6 10v11M18 10v11M10 10v11M14 10v11',
  },
  {
    slug: 'ssn-generator',
    name: 'SSN Generator',
    tagline: 'Format-valid test SSNs (non-issuable).',
    description:
      'Free online SSN generator. Generate US Social Security number-formatted test values using non-issuable ranges so they can never match a real person. For form testing only. Runs in your browser.',
    category: 'Generators',
    keywords: ['ssn generator', 'fake ssn generator', 'test ssn generator', 'random social security number', 'dummy ssn'],
    icon: 'M3 6h18v12H3zM7 10a2 2 0 1 1 0 .01M11 10h6M11 14h4',
  },
  {
    slug: 'random-user-profile-generator',
    name: 'Random User Profile Generator',
    tagline: 'Full fake profiles: name, email, address & more.',
    description:
      'Free online random user profile generator. Generate complete fake user profiles — name, username, email, phone, address, birthday and avatar initials — as JSON for testing. Runs in your browser.',
    category: 'Generators',
    keywords: ['random user generator', 'fake user profile generator', 'random profile generator', 'test user data generator', 'fake persona generator'],
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0M18 4h4M20 2v4',
  },
  {
    slug: 'company-name-generator',
    name: 'Company Name Generator',
    tagline: 'Business names from word combinations.',
    description:
      'Free online company name generator. Generate business and startup name ideas by combining descriptive words and industry terms, with an optional legal suffix. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['company name generator', 'business name generator', 'startup name generator', 'brand name ideas', 'random company name'],
    icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4',
  },
  {
    slug: 'username-generator',
    name: 'Username Generator',
    tagline: 'Unique usernames & handles in bulk.',
    description:
      'Free online username generator. Generate unique, available-looking usernames and handles from adjectives, nouns and numbers for games, social media and sign-ups. Runs in your browser.',
    category: 'Generators',
    keywords: ['username generator', 'random username generator', 'handle generator', 'gamertag generator', 'cool username ideas'],
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0M8 8h.01',
  },
  {
    slug: 'fake-id-generator',
    name: 'Fake ID Data Generator',
    tagline: 'Fictional identity fields for test data.',
    description:
      'Free online fake ID data generator. Generate a complete set of fictional identity fields — name, DOB, address, phone, email and a fake ID number — for QA and demos. Not a real ID. Runs in your browser.',
    category: 'Generators',
    keywords: ['fake id generator', 'fake identity generator', 'random identity generator', 'test id data generator', 'fictional identity generator'],
    icon: 'M3 5h18v14H3zM7 9a2 2 0 1 1 0 .01M6 15c0-1.5 1.5-3 3-3M14 9h4M14 13h4M14 16h2',
  },
  {
    slug: 'mock-json-generator',
    name: 'Mock JSON Data Generator',
    tagline: 'Arrays of fake records as JSON.',
    description:
      'Free online mock JSON data generator. Generate arrays of realistic fake records — id, name, email, address, dates and more — as JSON for API mocking and testing. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['mock json generator', 'fake json data generator', 'json test data generator', 'sample json generator', 'random json generator'],
    icon: 'M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2',
  },
  {
    slug: 'csv-test-data-generator',
    name: 'CSV Test Data Generator',
    tagline: 'Download fake records as a CSV file.',
    description:
      'Free online CSV test data generator. Generate rows of realistic fake records with the columns you choose and download them as a CSV file for spreadsheets, imports and testing. Runs in your browser.',
    category: 'Developer',
    keywords: ['csv test data generator', 'fake csv generator', 'sample csv generator', 'random csv data', 'dummy csv generator'],
    icon: 'M4 4h16v16H4zM4 9h16M4 14h16M9 4v16M15 4v16',
  },

  // ---- Batch 4: CSS & design ----
  {
    slug: 'box-shadow-generator',
    name: 'Box Shadow Generator',
    tagline: 'Visually build CSS box-shadow & copy it.',
    description:
      'Free online CSS box-shadow generator. Adjust offset, blur, spread, color and inset with a live preview and copy the exact box-shadow CSS. Layer multiple shadows. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['box shadow generator', 'css box shadow generator', 'box shadow css', 'drop shadow generator', 'css shadow maker'],
    icon: 'M6 6h10v10H6zM10 10h10v10H10z',
  },
  {
    slug: 'border-radius-generator',
    name: 'Border Radius Generator',
    tagline: 'Craft CSS border-radius with live preview.',
    description:
      'Free online CSS border-radius generator. Set each corner independently, create organic blob shapes with 8-point radii, and copy the border-radius CSS. Live preview. Runs in your browser.',
    category: 'Developer',
    keywords: ['border radius generator', 'css border radius generator', 'border radius css', 'rounded corners css', 'blob border radius'],
    icon: 'M4 12V8a4 4 0 0 1 4-4h4M20 12v4a4 4 0 0 1-4 4h-4',
  },
  {
    slug: 'glassmorphism-generator',
    name: 'Glassmorphism Generator',
    tagline: 'Frosted-glass CSS with blur & transparency.',
    description:
      'Free online glassmorphism generator. Design frosted-glass cards with adjustable blur, transparency, color and border, preview them over a gradient, and copy the CSS including backdrop-filter. Runs in your browser.',
    category: 'Developer',
    keywords: ['glassmorphism generator', 'glassmorphism css generator', 'frosted glass css', 'backdrop filter generator', 'glass effect css'],
    icon: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM8 8l8 8M8 12l4 4',
  },
  {
    slug: 'css-animation-generator',
    name: 'CSS Animation Generator',
    tagline: 'Keyframe animations with live preview.',
    description:
      'Free online CSS animation generator. Pick an effect like fade, slide, bounce, pulse or spin, tune duration, delay, timing and iterations, preview it live, and copy the @keyframes CSS. Runs in your browser.',
    category: 'Developer',
    keywords: ['css animation generator', 'keyframes generator', 'css keyframe animation', 'animation css generator', 'css transition generator'],
    icon: 'M12 2a10 10 0 1 0 0 20M12 2v4M12 2a10 10 0 0 1 7 3M17 17l3 3M20 14v6h-6',
  },
  {
    slug: 'media-query-generator',
    name: 'Media Query Generator',
    tagline: 'Responsive CSS breakpoints, copy-ready.',
    description:
      'Free online media query generator. Build responsive CSS media queries for common device breakpoints or custom min/max widths, orientation and dark mode, and copy the rule. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['media query generator', 'css media query generator', 'responsive breakpoints css', 'media query css', 'breakpoint generator'],
    icon: 'M3 5h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3zM19 9h2v10a1 1 0 0 1-1 1h-6v-2M7 20h6',
  },
  {
    slug: 'flexbox-generator',
    name: 'Flexbox & Grid Generator',
    tagline: 'Build flex/grid layouts and copy the CSS.',
    description:
      'Free online Flexbox and CSS Grid generator. Toggle direction, justify, align, wrap and gap (or grid columns and rows), see the layout update live, and copy the container CSS. Runs in your browser.',
    category: 'Developer',
    keywords: ['flexbox generator', 'css grid generator', 'flexbox css generator', 'grid layout generator', 'flex css maker'],
    icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  },
  {
    slug: 'svg-wave-generator',
    name: 'SVG Wave Generator',
    tagline: 'Layered SVG wave dividers for sections.',
    description:
      'Free online SVG wave generator. Create smooth wave section dividers with adjustable height, amplitude, randomness and color, and download the SVG or copy the code. Great for hero and footer edges. Runs in your browser.',
    category: 'Image',
    keywords: ['svg wave generator', 'wave generator', 'svg wave divider', 'section wave svg', 'wavy background generator'],
    icon: 'M2 12c3 0 3-5 6-5s3 5 6 5 3-5 6-5 3 5 6 5M2 17c3 0 3-5 6-5s3 5 6 5',
  },
  {
    slug: 'blob-generator',
    name: 'Blob Shape Generator',
    tagline: 'Random organic SVG blob shapes.',
    description:
      'Free online blob shape generator. Create smooth, random organic blob shapes as SVG with adjustable complexity, contrast and color, and download or copy the code — great for backgrounds and avatars. Runs in your browser.',
    category: 'Image',
    keywords: ['blob generator', 'svg blob generator', 'blob shape generator', 'organic shape generator', 'blob maker'],
    icon: 'M12 3c4 0 7 2 7 6s-1 5-3 7-3 4-6 4-7-3-7-8 5-9 9-9Z',
  },
  {
    slug: 'color-palette-generator',
    name: 'Color Palette Generator',
    tagline: 'Random & harmony-based color palettes.',
    description:
      'Free online color palette generator. Generate random palettes or build harmonies — complementary, analogous, triadic and more — from a base color, lock favorites and copy HEX values. Runs in your browser.',
    category: 'Generators',
    keywords: ['color palette generator', 'color scheme generator', 'random color palette', 'palette generator', 'color combination generator'],
    icon: 'M12 3a9 9 0 1 0 0 18 3 3 0 0 0 0-6h-1a2 2 0 0 1 0-4h2a4 4 0 0 0 0-8ZM7.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm3-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  },
  {
    slug: 'color-scheme-generator',
    name: 'Color Scheme Generator',
    tagline: 'Harmonious schemes from one base color.',
    description:
      'Free online color scheme generator. Enter a base color and get complementary, analogous, triadic, tetradic, split-complementary and monochromatic schemes with tints and shades. Runs in your browser.',
    category: 'Generators',
    keywords: ['color scheme generator', 'color harmony generator', 'complementary color generator', 'analogous colors', 'triadic color scheme'],
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 3v9l6 6',
  },
  {
    slug: 'pattern-generator',
    name: 'Pattern Background Generator',
    tagline: 'Repeating SVG/CSS background patterns.',
    description:
      'Free online pattern background generator. Create seamless repeating background patterns — dots, grid, stripes, checkers and more — with custom colors and scale, then download the SVG or copy the CSS. Runs in your browser.',
    category: 'Image',
    keywords: ['pattern generator', 'background pattern generator', 'svg pattern generator', 'css pattern generator', 'seamless pattern maker'],
    icon: 'M4 4h4v4H4zM12 4h4v4h-4zM8 8h4v4H8zM16 8h4v4h-4zM4 12h4v4H4zM12 12h4v4h-4z',
  },

  // ---- Batch 5: Image generators (canvas) ----
  {
    slug: 'favicon-generator',
    name: 'Favicon Generator',
    tagline: 'Make favicons from text, emoji or a shape.',
    description:
      'Free online favicon generator. Create a favicon from a letter, emoji or shape with custom colors, and download PNG sizes (16–512) plus a multi-size ICO. Generated in your browser — nothing uploaded.',
    category: 'Image',
    keywords: ['favicon generator', 'favicon maker', 'create favicon', 'favicon.ico generator', 'text favicon generator'],
    icon: 'M4 4h16v16H4zM8 8h8v8H8z',
  },
  {
    slug: 'placeholder-image-generator',
    name: 'Placeholder Image Generator',
    tagline: 'Custom placeholder images with size label.',
    description:
      'Free online placeholder image generator. Create placeholder images at any size with custom colors and a size label, and download as PNG or copy a data URI for mockups. Generated in your browser.',
    category: 'Image',
    keywords: ['placeholder image generator', 'dummy image generator', 'placeholder png generator', 'image placeholder maker', 'mockup image generator'],
    icon: 'M4 5h16v14H4zM4 15l4-4 5 5M14 13l2-2 4 4M15 8h.01',
  },
  {
    slug: 'avatar-generator',
    name: 'Avatar Generator',
    tagline: 'Initials & geometric identicon avatars.',
    description:
      'Free online avatar generator. Create clean initials avatars or unique geometric identicons from a name or seed, with color themes, and download as PNG. Generated entirely in your browser.',
    category: 'Image',
    keywords: ['avatar generator', 'initials avatar generator', 'identicon generator', 'profile picture generator', 'default avatar maker'],
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  },
  {
    slug: 'meme-generator',
    name: 'Meme Generator',
    tagline: 'Top/bottom text captions on your image.',
    description:
      'Free online meme generator. Upload an image, add classic top and bottom captions with the bold outlined meme font, adjust size, and download the result. Your image stays in your browser — never uploaded.',
    category: 'Image',
    keywords: ['meme generator', 'meme maker', 'caption image', 'top bottom text meme', 'make a meme online'],
    icon: 'M4 5h16v14H4zM8 10a1 1 0 1 0 0 .01M16 10a1 1 0 1 0 0 .01M8 15c1 1.5 2.5 2 4 2s3-.5 4-2',
  },
  {
    slug: 'banner-generator',
    name: 'Banner Generator',
    tagline: 'Social & web banners at preset sizes.',
    description:
      'Free online banner generator. Create social media and web banners at preset sizes (Twitter, Facebook, LinkedIn, YouTube) with a gradient or solid background, heading and subtext, and download as PNG. Runs in your browser.',
    category: 'Image',
    keywords: ['banner generator', 'social media banner maker', 'header image generator', 'cover photo maker', 'web banner generator'],
    icon: 'M3 6h18v12H3zM3 11h18M7 15h6',
  },
  {
    slug: 'watermark-generator',
    name: 'Watermark Generator',
    tagline: 'Tile text watermark over your image.',
    description:
      'Free online watermark generator. Add a tiled or single text watermark to your photo with adjustable opacity, size, angle and color, then download. Your image is processed in your browser — never uploaded.',
    category: 'Image',
    keywords: ['watermark generator', 'add watermark to image', 'photo watermark maker', 'text watermark online', 'watermark photos free'],
    icon: 'M4 5h16v14H4zM7 16l3-3 2 2 3-4 2 3M8 9a1 1 0 1 0 0 .01',
  },
  {
    slug: 'thumbnail-generator',
    name: 'Thumbnail Generator',
    tagline: 'Crop & resize images to thumbnail sizes.',
    description:
      'Free online thumbnail generator. Crop and resize any image to common thumbnail sizes or a custom square, with cover or contain fit, and download as PNG or JPG. Processed in your browser — never uploaded.',
    category: 'Image',
    keywords: ['thumbnail generator', 'thumbnail maker', 'create thumbnail', 'resize to thumbnail', 'image thumbnail generator'],
    icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  },
  {
    slug: 'signature-generator',
    name: 'Signature Generator',
    tagline: 'Draw or type a signature, download PNG.',
    description:
      'Free online signature generator. Draw your signature with a mouse or finger, or type it in a handwriting-style font, then download a transparent PNG for documents and emails. Created in your browser — never uploaded.',
    category: 'Image',
    keywords: ['signature generator', 'online signature maker', 'draw signature', 'e-signature generator', 'signature png maker'],
    icon: 'M3 17c3 0 5-10 8-10s2 6 4 6 2-3 6-3M3 20h18',
  },
  {
    slug: 'business-card-generator',
    name: 'Business Card Generator',
    tagline: 'Design a business card & download it.',
    description:
      'Free online business card generator. Enter your name, title, company and contact details, pick a color theme, preview a standard 3.5×2 inch card, and download it as a high-resolution PNG. Runs in your browser.',
    category: 'Image',
    keywords: ['business card generator', 'business card maker', 'create business card', 'digital business card', 'business card design online'],
    icon: 'M3 6h18v12H3zM7 10a2 2 0 1 1 0 .01M12 10h5M12 14h5M6 14h3',
  },

  // ---- Batch 6: SEO & config ----
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    tagline: 'SEO meta tags for title, description & more.',
    description:
      'Free online meta tag generator. Create SEO meta tags — title, description, keywords, author, robots, viewport and charset — plus Open Graph and Twitter cards, ready to paste into your HTML head. Runs in your browser.',
    category: 'Developer',
    keywords: ['meta tag generator', 'seo meta tags generator', 'html meta tags', 'meta description generator', 'meta tags for seo'],
    icon: 'M4 7h16M4 12h16M4 17h10M18 15l3 3-3 3',
  },
  {
    slug: 'open-graph-generator',
    name: 'Open Graph Generator',
    tagline: 'og: tags for rich social link previews.',
    description:
      'Free online Open Graph generator. Build og: and Twitter card meta tags for title, description, image, URL and type so your links show rich previews on Facebook, LinkedIn and X. Runs in your browser.',
    category: 'Developer',
    keywords: ['open graph generator', 'og tags generator', 'open graph meta tags', 'twitter card generator', 'social meta tags'],
    icon: 'M4 5h16v14H4zM4 15l4-4 4 4M14 13l2-2 4 4M9 9a1 1 0 1 0 0 .01',
  },
  {
    slug: 'robots-txt-generator',
    name: 'robots.txt Generator',
    tagline: 'Build a robots.txt with allow/disallow rules.',
    description:
      'Free online robots.txt generator. Build a valid robots.txt with per-user-agent allow and disallow rules, crawl delay and a sitemap reference, then copy or download it. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['robots.txt generator', 'robots txt generator', 'create robots.txt', 'robots file generator', 'seo robots.txt'],
    icon: 'M9 3h6l1 3h3v4h-2v9H7v-9H5V6h3zM10 12v4M14 12v4',
  },
  {
    slug: 'sitemap-generator',
    name: 'sitemap.xml Generator',
    tagline: 'Turn a list of URLs into a sitemap.xml.',
    description:
      'Free online sitemap.xml generator. Paste your page URLs and set change frequency and priority to generate a valid XML sitemap for search engines, then copy or download it. Runs in your browser.',
    category: 'Developer',
    keywords: ['sitemap generator', 'sitemap.xml generator', 'xml sitemap generator', 'create sitemap', 'seo sitemap generator'],
    icon: 'M12 3v4M6 21v-4M18 21v-4M4 17h4v4H4zM10 3h4v4h-4zM16 17h4v4h-4zM12 7v6M6 17v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2',
  },
  {
    slug: 'htaccess-generator',
    name: '.htaccess Generator',
    tagline: 'Common Apache .htaccess rules, ready to use.',
    description:
      'Free online .htaccess generator. Assemble common Apache rules — force HTTPS, force www or non-www, redirects, custom error pages, caching and compression — into a ready-to-use .htaccess file. Runs in your browser.',
    category: 'Developer',
    keywords: ['htaccess generator', 'apache htaccess generator', 'htaccess redirect generator', 'force https htaccess', 'htaccess rewrite generator'],
    icon: 'M4 6h16v12H4zM4 10h16M7 14h6',
  },
  {
    slug: 'gitignore-generator',
    name: '.gitignore Generator',
    tagline: 'Build .gitignore from language & tool presets.',
    description:
      'Free online .gitignore generator. Select the languages, frameworks and tools you use — Node, Python, macOS, VS Code and more — to build a combined .gitignore, then copy or download it. Runs in your browser.',
    category: 'Developer',
    keywords: ['gitignore generator', '.gitignore generator', 'create gitignore', 'gitignore template', 'gitignore file generator'],
    icon: 'M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8M12 2a10 10 0 0 1 3.2 19.5',
  },
  {
    slug: 'cron-generator',
    name: 'Cron Expression Generator',
    tagline: 'Build & explain cron schedules in plain English.',
    description:
      'Free online cron expression generator. Build a cron schedule from simple dropdowns or presets, see it explained in plain English, and copy the five-field expression for your crontab. Runs in your browser.',
    category: 'Developer',
    keywords: ['cron generator', 'cron expression generator', 'crontab generator', 'cron schedule generator', 'cron job expression'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 7v5l3 2',
  },
  {
    slug: 'regex-generator',
    name: 'Regex Generator',
    tagline: 'Build regex from common patterns, no syntax.',
    description:
      'Free online regex generator. Build regular expressions for emails, URLs, phone numbers, dates, IPs and more from a menu of common patterns, then test them live and copy. No regex syntax required. Runs in your browser.',
    category: 'Developer',
    keywords: ['regex generator', 'regular expression generator', 'regex pattern generator', 'build regex online', 'regex maker'],
    icon: 'M4 17l6-6-6-6M12 19h8',
  },
  {
    slug: 'html-table-generator',
    name: 'HTML Table Generator',
    tagline: 'Build an HTML table and copy the markup.',
    description:
      'Free online HTML table generator. Set the rows and columns, edit cell text in a live grid, toggle a header row and border styling, and copy clean HTML table markup. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['html table generator', 'table html generator', 'create html table', 'html table maker', 'generate table html'],
    icon: 'M4 4h16v16H4zM4 9h16M4 14h16M9 4v16M15 4v16',
  },
  {
    slug: 'markdown-table-generator',
    name: 'Markdown Table Generator',
    tagline: 'Build a Markdown table from a grid.',
    description:
      'Free online Markdown table generator. Fill in a live grid, choose column alignment, and get a clean, aligned Markdown table you can paste into READMEs, GitHub and docs. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['markdown table generator', 'md table generator', 'create markdown table', 'github table generator', 'markdown table maker'],
    icon: 'M3 5h18v14H3zM3 10h18M3 15h18M8 5v14M14 5v14',
  },
  {
    slug: 'schema-markup-generator',
    name: 'Schema Markup Generator',
    tagline: 'JSON-LD structured data for rich results.',
    description:
      'Free online schema markup generator. Create JSON-LD structured data for common Schema.org types — Article, Product, LocalBusiness, FAQ, Organization and more — for rich search results. Runs in your browser.',
    category: 'Developer',
    keywords: ['schema markup generator', 'json-ld generator', 'structured data generator', 'schema.org generator', 'rich results markup'],
    icon: 'M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2',
  },
  {
    slug: 'code-snippet-generator',
    name: 'Code Snippet Image Generator',
    tagline: 'Turn code into a shareable image.',
    description:
      'Free online code snippet image generator. Paste code, pick a theme and window style, and export a polished PNG image of your snippet for slides, docs and social — like Carbon. Rendered in your browser.',
    category: 'Developer',
    keywords: ['code snippet generator', 'code to image', 'carbon code image', 'code screenshot generator', 'beautiful code image'],
    icon: 'M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2M9 12l2 2 4-4',
  },

  // ---- Batch 7: Writing & naming ----
  {
    slug: 'hashtag-generator',
    name: 'Hashtag Generator',
    tagline: 'Turn keywords into social hashtags.',
    description:
      'Free online hashtag generator. Turn a topic or keywords into a set of relevant hashtags for Instagram, TikTok, X and LinkedIn, with camel-case and popularity variations. Runs in your browser.',
    category: 'Generators',
    keywords: ['hashtag generator', 'instagram hashtag generator', 'social media hashtags', 'hashtag maker', 'tiktok hashtag generator'],
    icon: 'M10 3 8 21M16 3l-2 18M4 8h16M3 16h16',
  },
  {
    slug: 'headline-generator',
    name: 'Headline Generator',
    tagline: 'Catchy blog & article headline ideas.',
    description:
      'Free online headline generator. Enter a topic and get catchy, click-worthy blog and article headline ideas using proven copywriting formulas — how-tos, listicles and questions. Runs in your browser.',
    category: 'Generators',
    keywords: ['headline generator', 'blog title generator', 'article headline generator', 'catchy headline maker', 'title generator'],
    icon: 'M4 6h16M4 12h16M4 18h10',
  },
  {
    slug: 'brand-name-generator',
    name: 'Brand Name Generator',
    tagline: 'Inventive brand & startup name ideas.',
    description:
      'Free online brand name generator. Generate inventive brand and startup name ideas from a keyword using blends, prefixes, suffixes and invented words, with a matching tagline hint. Runs in your browser.',
    category: 'Generators',
    keywords: ['brand name generator', 'business name generator', 'startup name generator', 'brand name ideas', 'company name maker'],
    icon: 'M12 2l2.4 7.4H22l-6 4.5 2.3 7.1L12 16.7 5.7 21l2.3-7.1-6-4.5h7.6z',
  },
  {
    slug: 'domain-name-generator',
    name: 'Domain Name Generator',
    tagline: 'Available-looking domain ideas & TLDs.',
    description:
      'Free online domain name generator. Turn a keyword into domain name ideas across popular TLDs — .com, .io, .app, .dev and more — with prefixes, suffixes and blends to spark availability. Runs in your browser.',
    category: 'Generators',
    keywords: ['domain name generator', 'domain name ideas', 'website name generator', 'domain finder', 'available domain generator'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
  },
  {
    slug: 'slogan-generator',
    name: 'Slogan Generator',
    tagline: 'Catchy taglines & slogans for any brand.',
    description:
      'Free online slogan generator. Enter your brand or product name to generate catchy taglines and slogans from proven marketing templates, ready to inspire your campaign. Runs in your browser.',
    category: 'Generators',
    keywords: ['slogan generator', 'tagline generator', 'catchphrase generator', 'motto generator', 'marketing slogan maker'],
    icon: 'M3 11l18-5v12L3 15v-4zM11.6 16.8a3 3 0 0 1-5.8-1.6',
  },
  {
    slug: 'random-word-generator',
    name: 'Random Word Generator',
    tagline: 'Random words by type, in bulk.',
    description:
      'Free online random word generator. Generate random words — nouns, verbs, adjectives or a mix — one at a time or in bulk, great for brainstorming, games, writing prompts and passwords. Runs in your browser.',
    category: 'Generators',
    keywords: ['random word generator', 'random words', 'word generator', 'random noun generator', 'random adjective generator'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M14 10h6M14 14h6M14 18h4',
  },
  {
    slug: 'random-sentence-generator',
    name: 'Random Sentence Generator',
    tagline: 'Random sentences for prompts & tests.',
    description:
      'Free online random sentence generator. Generate grammatically-structured random sentences for writing prompts, typing practice, placeholder copy and creativity exercises. Runs in your browser.',
    category: 'Generators',
    keywords: ['random sentence generator', 'sentence generator', 'random sentences', 'writing prompt generator', 'random phrase generator'],
    icon: 'M4 5h16M4 10h16M4 15h10',
  },
  {
    slug: 'story-generator',
    name: 'Story Idea Generator',
    tagline: 'Plot prompts with character, setting & conflict.',
    description:
      'Free online story idea generator. Spark your next story with random prompts combining a character, setting, goal and obstacle, plus a genre and opening line. Great for writers beating the blank page. Runs in your browser.',
    category: 'Generators',
    keywords: ['story generator', 'story idea generator', 'plot generator', 'writing prompt generator', 'story prompt maker'],
    icon: 'M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM14 3v6h6M8 13h8M8 17h5',
  },
  {
    slug: 'poem-generator',
    name: 'Poem Generator',
    tagline: 'Short poems from a theme or word.',
    description:
      'Free online poem generator. Generate short poems — including haiku and rhyming couplets — from a theme or word to inspire your writing or add a personal touch to a card. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['poem generator', 'poetry generator', 'haiku generator', 'rhyme generator', 'random poem maker'],
    icon: 'M4 4h16v16H4zM8 8h8M8 12h6M8 16h4',
  },
  {
    slug: 'acronym-generator',
    name: 'Acronym Generator',
    tagline: 'Build acronyms & backronyms from words.',
    description:
      'Free online acronym generator. Turn a phrase into an acronym, or build a backronym by finding words that fit each letter of a name, for projects, teams and branding. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['acronym generator', 'backronym generator', 'acronym maker', 'abbreviation generator', 'acronym creator'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M14 6h6M14 12h6M14 18h6',
  },
  {
    slug: 'nickname-generator',
    name: 'Nickname Generator',
    tagline: 'Fun nicknames from your name.',
    description:
      'Free online nickname generator. Turn a name into fun nicknames — cute, cool and gamer-style — using prefixes, suffixes and playful word pairings. Great for games, social media and friends. Runs in your browser.',
    category: 'Generators',
    keywords: ['nickname generator', 'cool nickname generator', 'gamer nickname generator', 'nickname ideas', 'random nickname maker'],
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0M18 5l2 2-2 2',
  },
  {
    slug: 'bio-generator',
    name: 'Bio Generator',
    tagline: 'Short social & profile bios in seconds.',
    description:
      'Free online bio generator. Create short, punchy bios for Instagram, X, LinkedIn and personal sites from your role, interests and a vibe — professional, casual or witty. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['bio generator', 'instagram bio generator', 'social media bio generator', 'profile bio maker', 'short bio generator'],
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0M9 8h.01',
  },

  // ---- Batch 8: Random & fun ----
  {
    slug: 'random-string-generator',
    name: 'Random String Generator',
    tagline: 'Custom random strings with your character set.',
    description:
      'Free online random string generator. Generate random strings of any length from letters, numbers, symbols or a custom character set, in bulk, using secure randomness. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['random string generator', 'random text generator', 'generate random string', 'random alphanumeric generator', 'random character generator'],
    icon: 'M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16',
  },
  {
    slug: 'dice-roller',
    name: 'Dice Roller',
    tagline: 'Roll D4–D20 dice, any count, with totals.',
    description:
      'Free online dice roller. Roll any number of dice from D4 to D20 (and D100) with a modifier and running total, for board games and tabletop RPGs. Uses secure randomness. Runs in your browser.',
    category: 'Generators',
    keywords: ['dice roller', 'roll dice online', 'virtual dice', 'd20 roller', 'dnd dice roller'],
    icon: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8.5 8.5h.01M15.5 8.5h.01M8.5 15.5h.01M15.5 15.5h.01M12 12h.01',
  },
  {
    slug: 'coin-flip',
    name: 'Coin Flip',
    tagline: 'Flip a virtual coin, heads or tails.',
    description:
      'Free online coin flip. Flip a fair virtual coin for heads or tails, flip several at once, and see running stats — a quick, unbiased way to decide. Uses secure randomness. Runs in your browser.',
    category: 'Generators',
    keywords: ['coin flip', 'flip a coin', 'coin toss online', 'heads or tails', 'virtual coin flip'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 6v12M9 9h4a2 2 0 0 1 0 4H9M9 13h4a2 2 0 0 1 0 4H9',
  },
  {
    slug: 'lottery-number-generator',
    name: 'Lottery Number Generator',
    tagline: 'Random picks for Powerball, EuroMillions & more.',
    description:
      'Free online lottery number generator. Generate random number picks for Powerball, Mega Millions, EuroMillions, Lotto 6/49 or a custom game, with a bonus ball. Uses secure randomness. Runs in your browser.',
    category: 'Generators',
    keywords: ['lottery number generator', 'random lottery numbers', 'powerball generator', 'lucky number generator', 'lotto number picker'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z',
  },
  {
    slug: 'random-date-generator',
    name: 'Random Date Generator',
    tagline: 'Random dates between two bounds.',
    description:
      'Free online random date generator. Generate random dates within a range you set, optionally with times, in bulk, for testing, sampling and games. Uses secure randomness. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['random date generator', 'random date picker', 'generate random dates', 'random date range', 'random datetime generator'],
    icon: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM9 13h.01M13 13h.01M9 17h.01',
  },
  {
    slug: 'random-picker',
    name: 'Random Picker / Wheel Spinner',
    tagline: 'Spin a wheel to pick from your list.',
    description:
      'Free online random picker and wheel spinner. Enter a list of names or options and spin a colorful wheel to pick a winner at random — great for giveaways, decisions and classrooms. Runs in your browser.',
    category: 'Generators',
    keywords: ['random picker', 'wheel spinner', 'wheel of names', 'random name picker', 'spin the wheel'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 2v10l7 7M12 12 5 19M12 12l7-7M12 12 5 5',
  },
  {
    slug: 'team-generator',
    name: 'Team Generator',
    tagline: 'Split a list of names into fair teams.',
    description:
      'Free online team generator. Paste a list of names and split them randomly into a set number of teams or by team size, with balanced groups — great for sports, class and games. Runs in your browser.',
    category: 'Generators',
    keywords: ['team generator', 'random team generator', 'group generator', 'team picker', 'split into teams'],
    icon: 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0 0-6M15 20a6 6 0 0 1 6-3',
  },
  {
    slug: 'random-letter-generator',
    name: 'Random Letter Generator',
    tagline: 'Random letters A–Z, in bulk.',
    description:
      'Free online random letter generator. Generate random letters from A to Z, uppercase or lowercase, one or many at a time — great for games, drawing prompts and teaching. Uses secure randomness. Runs in your browser.',
    category: 'Generators',
    keywords: ['random letter generator', 'random letter picker', 'generate random letters', 'random alphabet generator', 'pick a random letter'],
    icon: 'M4 20 9 6l5 14M6 15h6M16 20V8M16 8h3a2 2 0 0 1 0 4h-3',
  },
  {
    slug: 'name-combiner',
    name: 'Name Combiner Generator',
    tagline: 'Blend two names into one (ship name).',
    description:
      'Free online name combiner. Blend two names into portmanteau combinations — for couple ship names, brand mashups, pet names and baby names. Generates several blends to choose from. Runs in your browser.',
    category: 'Generators',
    keywords: ['name combiner', 'name blender', 'ship name generator', 'couple name generator', 'combine two names'],
    icon: 'M8 7a4 4 0 1 0 0 .01M16 7a4 4 0 1 0 0 .01M8 21v-4a4 4 0 0 1 8 0v4',
  },
  {
    slug: 'zodiac-generator',
    name: 'Zodiac Sign Generator',
    tagline: 'Find your zodiac sign & traits from a date.',
    description:
      'Free online zodiac sign finder. Enter a birth date to get the Western zodiac sign, its element, dates and key traits, plus the Chinese zodiac animal for the year. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['zodiac generator', 'zodiac sign finder', 'star sign calculator', 'chinese zodiac calculator', 'what is my zodiac sign'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 6l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L6.2 10.2l4-.6z',
  },
  {
    slug: 'excuse-generator',
    name: 'Excuse Generator',
    tagline: 'Random excuses for any situation.',
    description:
      'Free online excuse generator. Generate funny, plausible excuses for being late, missing work, skipping the gym or ducking an event — for laughs, not lying. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['excuse generator', 'random excuse generator', 'funny excuses', 'excuse maker', 'late excuse generator'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01',
  },
  {
    slug: 'insult-compliment-generator',
    name: 'Compliment & Insult Generator',
    tagline: 'Playful compliments or cheeky roasts.',
    description:
      'Free online compliment and insult generator. Generate warm, uplifting compliments or lighthearted, playful insults (Shakespearean roasts included) for fun and banter. All in good humor. Runs in your browser.',
    category: 'Generators',
    keywords: ['compliment generator', 'insult generator', 'random compliment', 'funny insult generator', 'shakespearean insult generator'],
    icon: 'M12 21s-8-4.5-8-10a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 5.5-8 10-8 10Z',
  },
  {
    slug: 'trivia-generator',
    name: 'Trivia Question Generator',
    tagline: 'Random trivia questions with answers.',
    description:
      'Free online trivia question generator. Draw random trivia questions across categories — science, history, geography, pop culture and more — with reveal-on-click answers for quizzes and game night. Runs in your browser.',
    category: 'Generators',
    keywords: ['trivia generator', 'trivia question generator', 'random trivia', 'quiz question generator', 'trivia questions and answers'],
    icon: 'M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z',
  },
  {
    slug: 'recipe-generator',
    name: 'Recipe Idea Generator',
    tagline: 'Random meal ideas from ingredients.',
    description:
      'Free online recipe idea generator. Get random meal ideas — a dish name, key ingredients and a simple method sketch — by cuisine and meal type, to break out of a cooking rut. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['recipe generator', 'random recipe generator', 'meal idea generator', 'what to cook generator', 'dinner idea generator'],
    icon: 'M7 3v8a3 3 0 0 0 6 0V3M10 11v10M17 3c-1.5 1-2 3-2 6s0 4 2 5v7',
  },
  {
    slug: 'workout-generator',
    name: 'Workout Generator',
    tagline: 'Random workout routines by focus.',
    description:
      'Free online workout generator. Generate a random workout routine by focus — full body, upper, lower, core or cardio — with exercises, sets and reps scaled to your level. No equipment options included. Runs in your browser.',
    category: 'Generators',
    keywords: ['workout generator', 'random workout generator', 'workout routine generator', 'exercise generator', 'wod generator'],
    icon: 'M6.5 6.5h11M4 10h2v4H4zM18 10h2v4h-2zM6 12h12M8 9h1v6H8zM15 9h1v6h-1z',
  },
  {
    slug: 'emoji-generator',
    name: 'Emoji Generator',
    tagline: 'Random emojis & fun emoji combos.',
    description:
      'Free online emoji generator. Get random emojis by category, build fun emoji combos and reactions, and copy them with one click for chats, captions and posts. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['emoji generator', 'random emoji generator', 'emoji picker', 'emoji combo generator', 'random emoji'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8 10h.01M16 10h.01M8 15c1 1.5 2.5 2 4 2s3-.5 4-2',
  },

  // ---- Batch 9: Documents ----
  {
    slug: 'invoice-generator',
    name: 'Invoice Generator',
    tagline: 'Create & download professional invoices.',
    description:
      'Free online invoice generator. Fill in your business and client details, add line items with automatic totals and tax, preview a clean invoice and download it as a PDF. Runs entirely in your browser — nothing uploaded.',
    category: 'PDF',
    keywords: ['invoice generator', 'free invoice maker', 'create invoice online', 'invoice pdf generator', 'invoice template'],
    icon: 'M6 2h9l5 5v15a0 0 0 0 1 0 0H6a0 0 0 0 1 0 0zM14 2v6h6M9 13h6M9 17h6M9 9h2',
  },
  {
    slug: 'receipt-generator',
    name: 'Receipt Generator',
    tagline: 'Generate itemized receipts as PDF.',
    description:
      'Free online receipt generator. Create itemized sales receipts with store details, line items, subtotal, tax and total, then download as a PDF. Great for small businesses and reimbursements. Runs in your browser.',
    category: 'PDF',
    keywords: ['receipt generator', 'free receipt maker', 'create receipt online', 'receipt pdf generator', 'itemized receipt template'],
    icon: 'M5 2h14v20l-2-1.5L15 22l-2-1.5L11 22l-2-1.5L7 22l-2-1.5zM9 8h6M9 12h6M9 16h4',
  },
  {
    slug: 'purchase-order-generator',
    name: 'Purchase Order Generator',
    tagline: 'Create purchase orders and download PDF.',
    description:
      'Free online purchase order generator. Enter buyer and vendor details, add ordered items with quantities and prices, and download a professional PO as a PDF. Runs entirely in your browser — nothing uploaded.',
    category: 'PDF',
    keywords: ['purchase order generator', 'po generator', 'create purchase order', 'purchase order template', 'purchase order pdf'],
    icon: 'M6 2h9l5 5v15H6zM14 2v6h6M9 12h6M9 16h6M9 8h2',
  },
  {
    slug: 'resume-generator',
    name: 'Resume Generator',
    tagline: 'Build a clean resume and export to PDF.',
    description:
      'Free online resume generator. Enter your experience, education and skills into a clean template, preview it live, and export a print-ready PDF. Your data stays in your browser — nothing is uploaded.',
    category: 'PDF',
    keywords: ['resume generator', 'resume builder', 'cv maker', 'create resume online', 'resume pdf generator'],
    icon: 'M6 2h12v20H6zM9 7h6M9 11h6M9 15h4M9 2v4',
  },
  {
    slug: 'cover-letter-generator',
    name: 'Cover Letter Generator',
    tagline: 'Draft a cover letter from a template.',
    description:
      'Free online cover letter generator. Fill in your details and the job, pick a tone, and generate a polished cover letter you can edit, copy or print to PDF. Runs entirely in your browser — nothing uploaded.',
    category: 'PDF',
    keywords: ['cover letter generator', 'cover letter maker', 'cover letter template', 'write cover letter', 'job application letter generator'],
    icon: 'M4 5h16v14H4zM4 7l8 6 8-6',
  },
  {
    slug: 'certificate-generator',
    name: 'Certificate Generator',
    tagline: 'Design award certificates & download.',
    description:
      'Free online certificate generator. Create award, completion and appreciation certificates with a decorative border, recipient name, title and date, and download as a PDF or PNG. Runs in your browser.',
    category: 'PDF',
    keywords: ['certificate generator', 'certificate maker', 'award certificate template', 'certificate of completion generator', 'printable certificate'],
    icon: 'M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM8.5 12.5 7 22l5-3 5 3-1.5-9.5',
  },
  {
    slug: 'terms-conditions-generator',
    name: 'Terms & Conditions Generator',
    tagline: 'Draft a T&C template for your site.',
    description:
      'Free online terms and conditions generator. Answer a few questions about your website or app and generate a customizable terms of service template you can copy or download. A starting point, not legal advice. Runs in your browser.',
    category: 'Generators',
    keywords: ['terms and conditions generator', 'terms of service generator', 'tos generator', 't&c template', 'terms of use generator'],
    icon: 'M6 2h9l5 5v15H6zM14 2v6h6M9 12h6M9 16h6',
  },
  {
    slug: 'privacy-policy-generator',
    name: 'Privacy Policy Generator',
    tagline: 'Generate a privacy policy template.',
    description:
      'Free online privacy policy generator. Answer questions about the data your site collects and generate a customizable privacy policy template you can copy or download. A starting point, not legal advice. Runs in your browser.',
    category: 'Generators',
    keywords: ['privacy policy generator', 'privacy policy maker', 'privacy policy template', 'gdpr privacy policy generator', 'free privacy policy'],
    icon: 'M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6zM9 12l2 2 4-4',
  },
  {
    slug: 'pdf-generator',
    name: 'Text to PDF Generator',
    tagline: 'Turn text into a downloadable PDF.',
    description:
      'Free online text to PDF generator. Paste or write text, choose page size, font size and margins, and download a clean multi-page PDF. Built with an in-browser PDF engine — your text is never uploaded.',
    category: 'PDF',
    keywords: ['pdf generator', 'text to pdf', 'create pdf online', 'make pdf from text', 'text to pdf converter'],
    icon: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h4',
  },

  // ---- Batch 10: Media ----
  {
    slug: 'audio-tone-generator',
    name: 'Audio Tone Generator',
    tagline: 'Play & download pure tones by frequency.',
    description:
      'Free online audio tone generator. Play pure sine, square, triangle or sawtooth tones at any frequency and volume, useful for testing speakers, tinnitus matching and tuning, and download the tone as a WAV. Runs in your browser.',
    category: 'Audio & Video',
    keywords: ['audio tone generator', 'frequency generator', 'sine wave generator', 'test tone generator', 'online tone generator'],
    icon: 'M3 12h3l3-8 4 16 3-10 2 6h3',
  },
  {
    slug: 'waveform-generator',
    name: 'Waveform Generator',
    tagline: 'Render an audio file as a waveform image.',
    description:
      'Free online waveform generator. Load an audio file and render its waveform as a clean image you can customize and download as PNG — great for podcasts, music and social posts. Decoded in your browser, never uploaded.',
    category: 'Audio & Video',
    keywords: ['waveform generator', 'audio waveform image', 'waveform maker', 'soundwave generator', 'audio to waveform'],
    icon: 'M2 12h2l2-6 3 12 3-9 2 6 3-4 2 2h3',
  },
  {
    slug: 'spectrogram-generator',
    name: 'Spectrogram Generator',
    tagline: 'Visualize audio frequencies over time.',
    description:
      'Free online spectrogram generator. Visualize the frequency content of an audio file or your microphone over time as a color spectrogram, and download the image. Analyzed in your browser — nothing is uploaded.',
    category: 'Audio & Video',
    keywords: ['spectrogram generator', 'audio spectrogram', 'frequency spectrogram', 'spectrogram maker', 'audio frequency analyzer'],
    icon: 'M4 4v16h16M7 16v2M11 12v6M15 8v10M19 14v4M7 12a1 1 0 1 0 0 .01M11 8a1 1 0 1 0 0 .01',
  },
];

export const categories: ToolCategory[] = [
  'Text',
  'Developer',
  'Image',
  'PDF',
  'Audio & Video',
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
