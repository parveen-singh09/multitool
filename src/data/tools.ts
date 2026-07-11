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
    tagline: 'Design custom QR codes with logos, colors and shapes.',
    description:
      'Free online QR code generator. Encode a URL, WiFi login, vCard, email, SMS, location, event or Bitcoin address, then customize the dot and eye shapes, colors, gradients and center logo. Download high-resolution PNG or vector SVG. Generated privately in your browser — nothing is uploaded.',
    category: 'Generators',
    keywords: [
      'qr code generator',
      'custom qr code generator',
      'qr code with logo',
      'wifi qr code generator',
      'vcard qr code',
      'free qr code maker',
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
      'Free online Unix timestamp converter. Convert epoch timestamps (seconds, milliseconds, microseconds or nanoseconds) to human-readable dates in any timezone — with ISO 8601, RFC 2822, GMT, relative time and a custom format. Runs in your browser.',
    category: 'Developer',
    keywords: [
      'unix timestamp converter',
      'epoch converter',
      'timestamp to date',
      'date to timestamp',
      'unix time converter',
      'epoch time now',
      'milliseconds to date',
      'gmt to local time',
      'timezone converter',
      'iso 8601 converter',
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
    tagline: 'Resize images by pixels or percent.',
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
    tagline: 'Generate v1, v3, v4, v5, v6 & v7 UUIDs in bulk.',
    description:
      'Free online UUID / GUID generator. Create RFC 4122 & 9562 UUIDs — v4 random, v7 time-ordered, v1/v6 time-based, v3/v5 namespace, plus nil & max — one at a time or up to 10,000 at once. Runs in your browser; nothing is sent to a server.',
    category: 'Generators',
    keywords: [
      'uuid generator',
      'guid generator',
      'v4 uuid',
      'v7 uuid',
      'uuid v5 generator',
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
    tagline: 'Create 30+ barcode types (PNG / SVG).',
    description:
      'Free online barcode generator supporting 30+ symbologies — Code 128, Code 39, EAN/UPC, GS1, QR Code, Data Matrix, PDF417, Aztec, MaxiCode and postal codes. Adjust size, colors, rotation and label, then download as PNG or SVG. Generated privately in your browser.',
    category: 'Generators',
    keywords: ['barcode generator', 'code 128 generator', 'ean upc generator', 'gs1 barcode', 'free barcode maker', 'barcode png svg'],
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
  {
    slug: 'music-analyzer',
    name: 'Music Analyzer',
    tagline: 'Detect BPM, key, Camelot, genre, mood & loudness.',
    description:
      'Free online music analyzer. Detect the tempo (BPM), musical key and Camelot code, genre and mood, energy and danceability, plus LUFS loudness and the HPCP chroma of any song. Analyze a file or microphone entirely in your browser — never uploaded.',
    category: 'Audio & Video',
    keywords: ['music analyzer', 'bpm detector', 'song key finder', 'camelot wheel', 'lufs meter', 'genre finder', 'key and bpm analyzer'],
    icon: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
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
    tagline: 'Ed25519 & RSA key pairs in OpenSSH format.',
    description:
      'Free online SSH key generator. Generate an Ed25519 or RSA key pair in your browser and download the OpenSSH public and private keys. Keys are created locally with a JS crypto engine and never leave your device.',
    category: 'Security',
    keywords: ['ssh key generator', 'generate ssh key', 'ed25519 key generator', 'rsa key generator', 'ssh keygen online', 'ssh key pair generator'],
    icon: 'M14 7a5 5 0 1 0-4.9 6H12v3h3v3h4v-3l-1.1-1.1A5 5 0 0 0 14 7ZM7 12a1 1 0 1 0 0 .01',
  },
  {
    slug: 'ssl-csr-generator',
    name: 'SSL CSR Generator',
    tagline: 'Certificate signing requests & private key.',
    description:
      'Free online SSL CSR generator. Create a certificate signing request (CSR) and matching Ed25519 or RSA private key from your domain and organization details, entirely in your browser. Your private key never leaves your device.',
    category: 'Security',
    keywords: ['csr generator', 'ssl csr generator', 'certificate signing request generator', 'generate csr online', 'csr and private key generator', 'ed25519 csr generator'],
    icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM9 12l2 2 4-4',
  },

  // ---- Batch 3: Fake / test data ----
  {
    slug: 'fake-name-generator',
    name: 'Fake Name Generator',
    tagline: 'Random names by nationality for testing & demos.',
    description:
      'Free online fake name generator. Generate random realistic names across 13 nationality name sets — American, British, Italian, Spanish, French, German, Japanese, Chinese, Indian, Arabic, Russian and more — by gender and display format, one at a time or in bulk. Runs in your browser, nothing uploaded.',
    category: 'Generators',
    keywords: ['fake name generator', 'random name generator', 'random full name', 'test name generator', 'dummy name generator', 'name generator by nationality', 'international name generator'],
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  },
  {
    slug: 'fake-address-generator',
    name: 'Fake Address Generator',
    tagline: 'Random addresses for 16 countries.',
    description:
      'Free online fake address generator for 16 countries — US, UK, Canada, Australia, Germany, France, Italy, Spain, Netherlands, Sweden, Japan, China, India, Brazil, Mexico and Russia. Generates a coherent persona per record: locale name, street, real city and region, correct postal code and phone, plus coordinates, currency and timezone. Single identity with click-to-copy fields or bulk export as CSV/JSON. Fictional only. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['fake address generator', 'random address generator', 'international address generator', 'test address generator', 'dummy address', 'random street address', 'fake address by country', 'us uk canada address generator'],
    icon: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6',
  },
  {
    slug: 'fake-email-generator',
    name: 'Fake Email Generator',
    tagline: 'Disposable inbox that really receives mail.',
    description:
      'Free temporary email generator with a real disposable inbox — receive verification codes and links with no signup, then throw the address away. Plus bulk random addresses for test data. Runs in your browser.',
    category: 'Generators',
    keywords: ['fake email generator', 'temporary email', 'disposable email', 'temp mail', 'throwaway email', 'random email generator', '10 minute mail'],
    icon: 'M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM4 7l8 6 8-6',
  },
  {
    slug: 'fake-phone-generator',
    name: 'Fake Phone Number Generator',
    tagline: 'Random phone numbers for 16 countries.',
    description:
      'Free online fake phone number generator for 16 countries — US, UK, Canada, Australia, Germany, France, Japan, India, Brazil and more. Get a number in national, international, E.164 and plain-digit formats at once, or generate up to 1000 unique numbers and export as list, CSV or JSON. Uses reserved test ranges. Runs in your browser.',
    category: 'Generators',
    keywords: ['fake phone number generator', 'random phone number generator', 'test phone number', 'dummy phone number', 'sample phone numbers', 'e164 phone number', 'international phone number generator', 'bulk phone numbers'],
    icon: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l2 5v0a2 2 0 0 1-2 2 16 16 0 0 1-15-15 2 2 0 0 1 2-2Z',
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
    tagline: 'Brandable business names from your keywords.',
    description:
      'Free company name generator. Turn keywords into brandable business and startup name ideas across styles like brandable, compound and evocative, with logo previews and saved favorites. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['company name generator', 'business name generator', 'startup name generator', 'brandable name generator', 'namelix alternative'],
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
    tagline: 'Build custom test data tables in any format.',
    description:
      'Free online test data generator. Define your own columns and data types — names, emails, dates, number ranges, UUIDs, credit cards, pick-from-list and more — set a row count and locale, and export fictional records as JSON, CSV, SQL, XML or YAML. Seedable and reproducible. Not a real ID. Runs in your browser.',
    category: 'Generators',
    keywords: ['fake id generator', 'test data generator', 'fake data generator', 'sample data generator', 'random data generator', 'mock data generator'],
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
    tagline: 'Templates, draggable text boxes, stickers, and captions.',
    description:
      'Free online meme generator with a full canvas editor. Start from a popular template or upload your own image, then add unlimited draggable, resizable text boxes — each with its own font, size, color, outline, alignment, and opacity. Drop in emoji and image stickers, rotate or flip the picture, add caption space, undo/redo, and download a full-resolution, watermark-free meme. Your image, text, and stickers are composited in your browser and never uploaded.',
    category: 'Image',
    keywords: ['meme generator', 'meme maker', 'meme templates', 'caption image', 'top bottom text meme', 'add text to photo', 'meme editor', 'make a meme online'],
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
    tagline: 'Add a text or logo watermark to your photos in batch.',
    description:
      'Free online watermark generator. Add a text or logo watermark to one photo or a whole batch — single or tiled (straight/diagonal), with adjustable opacity, size, rotation, color, drag-to-position and reusable templates. Export to PNG, JPEG or WEBP, or download all as a ZIP. Processed in your browser — never uploaded.',
    category: 'Image',
    keywords: ['watermark generator', 'add watermark to image', 'photo watermark maker', 'text watermark online', 'logo watermark', 'batch watermark', 'tile watermark', 'watermark photos free'],
    icon: 'M4 5h16v14H4zM7 16l3-3 2 2 3-4 2 3M8 9a1 1 0 1 0 0 .01',
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
    tagline: 'Design a business card from 12 templates.',
    description:
      'Free online business card generator with 12 designed templates, front & back sides, logo and background upload, custom accent color and fonts, and a scannable vCard QR code. Preview live and download 300-DPI PNGs or a print-ready PDF. Runs in your browser.',
    category: 'Image',
    keywords: ['business card generator', 'business card maker', 'create business card', 'business card templates', 'digital business card', 'business card design online', 'double sided business card', 'business card with qr code'],
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
    tagline: 'Crawl a website and generate its sitemap.xml.',
    description:
      'Free online sitemap.xml generator. Enter a website URL and it crawls your pages by following internal links, then builds a valid XML sitemap with automatic depth-based priority, change frequency and lastmod. Or paste your own URL list. Copy or download the file. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['sitemap generator', 'sitemap.xml generator', 'xml sitemap generator', 'website crawler sitemap', 'create sitemap', 'seo sitemap generator'],
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
    tagline: 'Build regex from example text, no syntax.',
    description:
      'Free online regex generator. Paste example text and it auto-recognizes dates, times, IPs, emails, URLs, UUIDs and numbers — click any part to change how it matches. Add named capture groups, test live, and copy ready-to-run code for JavaScript, Python, PHP, Java, Go or C#. No regex syntax required. Runs in your browser.',
    category: 'Developer',
    keywords: ['regex generator', 'regular expression generator', 'regex from example', 'regex pattern generator', 'build regex online', 'regex maker'],
    icon: 'M4 17l6-6-6-6M12 19h8',
  },
  {
    slug: 'html-table-generator',
    name: 'HTML Table Generator',
    tagline: 'Build, style, and merge cells, then export HTML, Markdown, or CSV.',
    description:
      'Free online HTML table generator. Edit cells in a live grid, paste from Excel or Google Sheets, upload a CSV, style header/body colors, striped rows, borders, padding, and a caption, merge cells with colspan/rowspan, and export clean HTML with scoped CSS, Markdown, or CSV. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['html table generator', 'table html generator', 'create html table', 'html table maker', 'generate table html', 'csv to html table', 'merge table cells', 'table markdown generator'],
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
      'Free hashtag generator for Instagram, TikTok, YouTube, X, Facebook & LinkedIn. Turns keywords into relevant tags grouped by reach tier — broad, popular and niche — with select-and-copy. Runs in your browser.',
    category: 'Generators',
    keywords: ['hashtag generator', 'instagram hashtag generator', 'social media hashtags', 'hashtag maker', 'tiktok hashtag generator', 'youtube hashtag generator'],
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
    tagline: 'Fancy fonts, symbols and nicknames for your name.',
    description:
      'Free stylish name generator. Turn any name into 100+ fancy fonts, cool symbols and nickname styles — bold, italic, cursive, gothic, bubble and upside-down text, plus decorated gaming frames for PUBG, Free Fire, Roblox, Discord, Instagram and TikTok. Tap to copy. Runs in your browser.',
    category: 'Generators',
    keywords: ['stylish name generator', 'fancy text generator', 'nickname generator', 'cool fonts generator', 'fancy name maker', 'stylish text', 'gamer name generator'],
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
      'Free online receipt generator with two styles: a classic thermal point-of-sale roll and a standard A4 business receipt. Add your logo, store and customer details, line items, tax, discount, tip and shipping, record the payment method and amount tendered for automatic change due, then download a PDF. A live preview updates as you type. Great for small businesses, cafes and reimbursements. Runs entirely in your browser — nothing uploaded.',
    category: 'PDF',
    keywords: ['receipt generator', 'free receipt maker', 'create receipt online', 'receipt pdf generator', 'itemized receipt template', 'thermal receipt generator', 'pos receipt maker', 'cash receipt generator'],
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
  {
    slug: 'gif-maker',
    name: 'GIF Maker',
    tagline: 'Make an animated GIF with captions, stickers and templates.',
    description:
      'Free online GIF maker. Build frames from images (drag to reorder), a short video clip, or hundreds of popular templates, then add text captions and stickers with per-frame control, preview the animation, reverse or boomerang it, and export a looping GIF. Composited and encoded entirely in your browser — nothing is uploaded.',
    category: 'Image',
    keywords: ['gif maker', 'animated gif creator', 'gif caption maker', 'images to gif', 'video to gif', 'make a gif online'],
    icon: 'M3 5h18v14H3zM7 9v6M7 9h2M7 12h1.5M12 9v6M16 9h1.5M16 9v6M16 12h1',
  },
  {
    slug: 'logo-generator',
    name: 'Logo Generator',
    tagline: 'Design a clean text-and-icon logo in seconds.',
    description:
      'Free online logo generator. Pair your brand name with a symbol, font, layout and color scheme, then download a crisp SVG or PNG. Designed live in your browser — nothing is uploaded.',
    category: 'Generators',
    keywords: ['logo generator', 'logo maker', 'free logo creator', 'text logo design', 'brand logo maker'],
    icon: 'M12 3l7 4v10l-7 4-7-4V7zM12 3v18M5 7l7 4 7-4',
  },
  {
    slug: 'mockup-generator',
    name: 'Mockup Generator',
    tagline: 'Drop a screenshot into a device or browser frame.',
    description:
      'Free online mockup generator. Place a screenshot inside a browser window, phone or laptop frame over a clean gradient backdrop and export a shareable PNG. Rendered in your browser — nothing is uploaded.',
    category: 'Image',
    keywords: ['mockup generator', 'screenshot mockup', 'device mockup maker', 'browser frame mockup', 'product mockup'],
    icon: 'M4 5h16v11H4zM2 20h20M9 20l.5-4M15 20l-.5-4',
  },
  {
    slug: 'ambigram-generator',
    name: 'Ambigram Generator',
    tagline: 'Words that read the same upside down.',
    description:
      'Free online ambigram generator. Type one or two words and preview a rotational ambigram that reads the same when flipped 180°, then download it. Rendered in your browser — nothing is uploaded.',
    category: 'Generators',
    keywords: ['ambigram generator', 'ambigram maker', 'upside down text art', 'rotational ambigram', 'tattoo ambigram'],
    icon: 'M12 3v18M7 8a5 5 0 0 1 10 0M17 16a5 5 0 0 1-10 0',
  },
  {
    slug: 'pictionary-word-generator',
    name: 'Pictionary Word Generator',
    tagline: 'Random words to draw, by difficulty.',
    description:
      'Free Pictionary word generator. Draw random words for Pictionary, charades and drawing games across easy, medium and hard difficulty, with a hide-and-reveal mode for the drawer. Runs in your browser.',
    category: 'Generators',
    keywords: ['pictionary word generator', 'random pictionary words', 'drawing game words', 'charades generator', 'pictionary ideas'],
    icon: 'M3 21l3-1 11-11-2-2L4 18zM15 5l2-2 2 2-2 2M14 6l4 4',
  },
  {
    slug: 'anagram-generator',
    name: 'Anagram Generator',
    tagline: 'Rearrange letters to find hidden words.',
    description:
      'Free online anagram generator. Enter letters or a word and find every dictionary word that can be built from them, sorted by length — great for word games and Scrabble. Solved in your browser.',
    category: 'Generators',
    keywords: ['anagram generator', 'anagram solver', 'word unscrambler', 'scrabble word finder', 'letters to words'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M14 12h6M17 9v6',
  },
  {
    slug: 'random-animal-generator',
    name: 'Random Animal Generator',
    tagline: 'Discover a random animal and a fun fact.',
    description:
      'Free random animal generator. Draw a random animal with an emoji, its group and a surprising fact — filter by mammals, birds, reptiles and more, or pull a whole list. Runs in your browser.',
    category: 'Generators',
    keywords: ['random animal generator', 'random animal picker', 'animal name generator', 'random animal facts', 'wheel of animals'],
    icon: 'M5 11a2 2 0 1 0 0-.01M9 7a2 2 0 1 0 0-.01M15 7a2 2 0 1 0 0-.01M19 11a2 2 0 1 0 0-.01M7 16c0-3 2-5 5-5s5 2 5 5a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z',
  },
  {
    slug: 'tarot-card-generator',
    name: 'Tarot Card Generator',
    tagline: 'Draw random tarot cards and readings.',
    description:
      'Free online tarot card generator. Draw a single card or a three-card past-present-future spread with upright and reversed meanings from the full 78-card deck. Shuffled in your browser.',
    category: 'Generators',
    keywords: ['tarot card generator', 'random tarot card', 'tarot reading online', 'three card tarot spread', 'daily tarot draw'],
    icon: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12l1.5 3 1.5-3M11.5 15v3',
  },
  {
    slug: 'pokemon-generator',
    name: 'Pokémon Generator',
    tagline: 'Draw a random Pokémon or invent a new one.',
    description:
      'Free Pokémon generator. Spin a random Kanto Pokémon with its number and types, or invent a brand-new fantasy creature name and type combo. Generated in your browser — nothing is uploaded.',
    category: 'Generators',
    keywords: ['pokemon generator', 'random pokemon generator', 'who am i pokemon', 'fakemon name generator', 'random kanto pokemon'],
    icon: 'M3 12h6a3 3 0 0 0 6 0h6M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 9a3 3 0 0 1 0 6',
  },
  {
    slug: 'pet-name-generator',
    name: 'Pet Name Generator',
    tagline: 'Find the perfect name for your dog, cat or critter.',
    description:
      'Free pet name generator. Generate dog, cat and small-pet name ideas by style — cute, tough, foodie, mythic or unisex — with an optional personality trait. Runs in your browser.',
    category: 'Generators',
    keywords: ['pet name generator', 'dog name generator', 'cat name generator', 'puppy name ideas', 'unique pet names'],
    icon: 'M9 5a2 2 0 1 0 0-.01M15 5a2 2 0 1 0 0-.01M5 9a2 2 0 1 0 0-.01M19 9a2 2 0 1 0 0-.01M12 11c-2.5 0-4 2-4 4a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3c0-2-1.5-4-4-4z',
  },
  {
    slug: 'gamertag-generator',
    name: 'Gamertag Generator',
    tagline: 'Cool, available-looking usernames for gaming.',
    description:
      'Free gamertag generator. Create cool gaming usernames and handles for Xbox, PSN, Steam and Discord — mix adjectives, nouns, leetspeak and suffixes, with an optional keyword. Runs in your browser.',
    category: 'Generators',
    keywords: ['gamertag generator', 'gaming username generator', 'cool gamertags', 'xbox gamertag ideas', 'random username generator'],
    icon: 'M7 8h10a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.5L12 15l-2 .5A4 4 0 0 1 3 13v-1a4 4 0 0 1 4-4zM8 11v2M7 12h2M15 11.5h.01M17 13h.01',
  },
  {
    slug: 'square-face-generator',
    name: 'Square Face Generator',
    tagline: 'Build a blocky square-head character from parts.',
    description:
      'Free square face generator. Mix and match eyes, mouth, eyebrows, hair and accessories, pick skin, hair and background colors, then download your square face as an SVG or PNG. Drawn entirely in your browser — nothing is uploaded.',
    category: 'Image',
    keywords: ['square face generator', 'square head avatar maker', 'square face avatar', 'blocky face creator', 'square character generator'],
    icon: 'M5 5h14v14H5zM9 10h.01M15 10h.01M9 15h6',
  },

  // ─── Validators ───────────────────────────────────────────────
  {
    slug: 'email-validator',
    name: 'Email Validator',
    tagline: 'Syntax, live MX/DNS, disposable & role checks.',
    description:
      'Free email validator. Check syntax, look up live MX/DNS records to confirm the domain can receive mail, flag disposable and role-based addresses, spot typos, and validate a whole list at once. Runs in your browser.',
    category: 'Developer',
    keywords: ['email validator', 'validate email address', 'email format checker', 'check email syntax', 'email verification tool', 'mx record lookup', 'disposable email checker'],
    icon: 'M4 6h16v12H4zM4 7l8 6 8-6',
  },
  {
    slug: 'json-validator',
    name: 'JSON Validator',
    tagline: 'Validate JSON and pinpoint syntax errors.',
    description:
      'Free JSON validator. Paste JSON to check if it is valid, with the exact line and column of any syntax error plus a formatted preview. Nothing is uploaded — validation runs in your browser.',
    category: 'Developer',
    keywords: ['json validator', 'validate json online', 'json syntax checker', 'json lint', 'check json'],
    icon: 'M8 4H6a2 2 0 0 0-2 2v3l-1 3 1 3v3a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v3l1 3-1 3v3a2 2 0 0 1-2 2h-2',
  },
  {
    slug: 'url-validator',
    name: 'URL Validator',
    tagline: 'Validate URL syntax and inspect parts.',
    description:
      'Free URL validator. Check whether a URL is well-formed and break it into protocol, host, port, path, query and fragment. Validate a single URL or a list at once, entirely in your browser.',
    category: 'Developer',
    keywords: ['url validator', 'validate url', 'url checker', 'check url format', 'url syntax validator'],
    icon: 'M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1',
  },
  {
    slug: 'phone-number-validator',
    name: 'Phone Number Validator',
    tagline: 'Validity, country, line type & E.164 format.',
    description:
      'Free phone number validator. Check if a number is valid worldwide, detect the country and region, identify the line type (mobile, fixed, toll-free, VoIP), and format it as E.164, international, national and a tel: URI. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['phone number validator', 'validate phone number', 'phone format checker', 'e164 validator', 'check phone number', 'phone line type lookup', 'international phone validator'],
    icon: 'M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  },
  {
    slug: 'xml-validator',
    name: 'XML Validator',
    tagline: 'Check XML for well-formedness.',
    description:
      'Free XML validator. Paste XML to check it is well-formed, with the location of any parse error and a tidy formatted view. Everything runs in your browser — nothing is uploaded.',
    category: 'Developer',
    keywords: ['xml validator', 'validate xml online', 'xml syntax checker', 'well formed xml', 'check xml'],
    icon: 'M10 8l-4 4 4 4M14 8l4 4-4 4',
  },

  // ─── Formatters ───────────────────────────────────────────────
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    tagline: 'Beautify and minify XML instantly.',
    description:
      'Free XML formatter. Beautify XML with clean indentation or minify it to one line, with adjustable indent size. Well-formedness is checked as you go. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['xml formatter', 'xml beautifier', 'format xml online', 'pretty print xml', 'xml minify'],
    icon: 'M10 8l-4 4 4 4M14 8l4 4-4 4',
  },
  {
    slug: 'html-formatter',
    name: 'HTML Formatter',
    tagline: 'Beautify and minify HTML markup.',
    description:
      'Free HTML formatter. Clean up messy markup with consistent indentation or minify it for production, with a configurable indent. Formatting runs in your browser — nothing is uploaded.',
    category: 'Developer',
    keywords: ['html formatter', 'html beautifier', 'format html online', 'pretty print html', 'html minify'],
    icon: 'M8 6l-4 6 4 6M16 6l4 6-4 6M13 4l-2 16',
  },
  {
    slug: 'css-formatter',
    name: 'CSS Formatter',
    tagline: 'Beautify and minify CSS stylesheets.',
    description:
      'Free CSS formatter. Beautify stylesheets with tidy indentation and spacing, or minify them to save bytes. Adjustable indent size. Runs entirely in your browser — nothing is uploaded.',
    category: 'Developer',
    keywords: ['css formatter', 'css beautifier', 'format css online', 'pretty print css', 'css minify'],
    icon: 'M5 4h14l-1.5 15L12 21l-5.5-2L5 4zM8 8h8M8 12h6',
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    tagline: 'Reformat and validate YAML.',
    description:
      'Free YAML formatter. Reformat YAML with consistent indentation and flag syntax errors as you type, with adjustable indent. Parsing and formatting run entirely in your browser.',
    category: 'Developer',
    keywords: ['yaml formatter', 'yaml beautifier', 'format yaml online', 'yaml validator', 'pretty print yaml'],
    icon: 'M4 5l4 6v8m8-14l-4 6M16 5h.01M4 5h.01',
  },
  {
    slug: 'javascript-formatter',
    name: 'JavaScript Formatter',
    tagline: 'Beautify and tidy JavaScript code.',
    description:
      'Free JavaScript formatter. Re-indent and clean up messy JS with consistent spacing and braces, plus a minify option. Runs entirely in your browser — your code is never uploaded.',
    category: 'Developer',
    keywords: ['javascript formatter', 'js beautifier', 'format javascript online', 'js pretty print', 'javascript minify'],
    icon: 'M6 4h12v16H6zM10 10v5a1 1 0 0 1-2 0m6-5v5',
  },
  {
    slug: 'csv-formatter',
    name: 'CSV Formatter',
    tagline: 'Clean up and align CSV data.',
    description:
      'Free CSV formatter. Normalize delimiters, trim whitespace and align columns into a clean table, or convert to a chosen separator. Everything runs locally in your browser.',
    category: 'Developer',
    keywords: ['csv formatter', 'format csv online', 'clean csv', 'csv beautifier', 'align csv columns'],
    icon: 'M4 5h16v14H4zM4 9h16M9 5v14M14 5v14',
  },
  {
    slug: 'markdown-formatter',
    name: 'Markdown Formatter',
    tagline: 'Tidy Markdown and preview it live.',
    description:
      'Free Markdown formatter. Normalize headings, lists and spacing to clean Markdown and see a live rendered preview. Formatting and rendering run entirely in your browser.',
    category: 'Developer',
    keywords: ['markdown formatter', 'format markdown online', 'markdown beautifier', 'clean markdown', 'markdown preview'],
    icon: 'M4 6h16v12H4zM7 15V9l3 3 3-3v6M17 9v6m-2-2l2 2 2-2',
  },

  // ─── Converters (data formats) ────────────────────────────────
  {
    slug: 'yaml-to-json-converter',
    name: 'YAML to JSON Converter',
    tagline: 'Convert YAML into formatted JSON.',
    description:
      'Free YAML to JSON converter. Paste YAML and get clean, formatted JSON instantly, with syntax errors flagged. Conversion runs entirely in your browser — nothing is uploaded.',
    category: 'Converters',
    keywords: ['yaml to json', 'convert yaml to json', 'yaml json converter', 'yaml to json online', 'yaml parser'],
    icon: 'M4 5l3 5v6m6-11l-3 5M14 12h6m-3-3l3 3-3 3',
  },
  {
    slug: 'csv-to-json-converter',
    name: 'CSV to JSON Converter',
    tagline: 'Turn CSV rows into JSON objects.',
    description:
      'Free CSV to JSON converter. Convert CSV with a header row into an array of JSON objects, with delimiter detection and pretty printing. Everything runs locally in your browser.',
    category: 'Converters',
    keywords: ['csv to json', 'convert csv to json', 'csv json converter', 'csv to json online', 'csv parser'],
    icon: 'M4 5h7v14H4zM14 8h6m-3-3l3 3-3 3M14 16h6',
  },
  {
    slug: 'json-to-csv-converter',
    name: 'JSON to CSV Converter',
    tagline: 'Flatten JSON arrays into CSV.',
    description:
      'Free JSON to CSV converter. Convert an array of JSON objects into CSV with headers, handling nested keys and a chosen delimiter. Conversion runs entirely in your browser.',
    category: 'Converters',
    keywords: ['json to csv', 'convert json to csv', 'json csv converter', 'json to csv online', 'export json to csv'],
    icon: 'M4 5h6v14H4zM14 5h6v14h-6zM10 12h4',
  },
  {
    slug: 'xml-to-json-converter',
    name: 'XML to JSON Converter',
    tagline: 'Convert XML documents into JSON.',
    description:
      'Free XML to JSON converter. Parse XML and turn elements, attributes and text into structured JSON, formatted for readability. Runs entirely in your browser — nothing is uploaded.',
    category: 'Converters',
    keywords: ['xml to json', 'convert xml to json', 'xml json converter', 'xml to json online', 'parse xml to json'],
    icon: 'M8 8l-3 4 3 4M13 8l-1 8m8-8h-4m2-2l2 2-2 2',
  },
  {
    slug: 'markdown-to-html-converter',
    name: 'Markdown to HTML Converter',
    tagline: 'Render Markdown into clean HTML.',
    description:
      'Free Markdown to HTML converter. Paste Markdown and get the equivalent HTML plus a live preview, covering headings, lists, links, code and more. Conversion runs in your browser.',
    category: 'Converters',
    keywords: ['markdown to html', 'convert markdown to html', 'md to html', 'markdown html converter', 'render markdown'],
    icon: 'M4 6h16v12H4zM7 15V9l3 3 3-3v6M18 9l-2 6',
  },
  {
    slug: 'html-to-markdown-converter',
    name: 'HTML to Markdown Converter',
    tagline: 'Convert HTML back into Markdown.',
    description:
      'Free HTML to Markdown converter. Turn HTML markup into clean Markdown — headings, links, lists, bold, code and blockquotes. Everything runs locally in your browser.',
    category: 'Converters',
    keywords: ['html to markdown', 'convert html to markdown', 'html markdown converter', 'html to md', 'markdown from html'],
    icon: 'M8 6l-4 6 4 6M16 6l4 6-4 6',
  },
  {
    slug: 'toml-to-json-converter',
    name: 'TOML to JSON Converter',
    tagline: 'Convert TOML config into JSON.',
    description:
      'Free TOML to JSON converter. Parse TOML tables, arrays and key-value pairs into formatted JSON, with syntax errors flagged. Conversion runs entirely in your browser.',
    category: 'Converters',
    keywords: ['toml to json', 'convert toml to json', 'toml json converter', 'toml parser', 'toml to json online'],
    icon: 'M4 6h16M12 6v13M7 19h10',
  },

  // ─── Parsers ──────────────────────────────────────────────────
  {
    slug: 'url-parser',
    name: 'URL Parser',
    tagline: 'Break a URL into all its parts.',
    description:
      'Free URL parser. Split any URL into protocol, host, port, path, query parameters and fragment, with each query key-value listed. Parsing runs entirely in your browser.',
    category: 'Developer',
    keywords: ['url parser', 'parse url', 'url components', 'query string parser', 'url breakdown'],
    icon: 'M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1',
  },
  {
    slug: 'user-agent-parser',
    name: 'User Agent Parser',
    tagline: 'Detect browser, OS and device.',
    description:
      'Free user agent parser. Paste a User-Agent string to identify the browser, engine, operating system and device type, or parse your own. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['user agent parser', 'parse user agent', 'ua parser', 'browser detection', 'user agent lookup'],
    icon: 'M4 5h16v12H4zM4 17l3 3m10-3l-3 3M9 9h.01M9 13h6',
  },
  {
    slug: 'query-string-parser',
    name: 'Query String Parser',
    tagline: 'Decode URL query parameters.',
    description:
      'Free query string parser. Paste a query string or full URL to list every parameter as a decoded key-value pair, and rebuild it. Parsing runs entirely in your browser.',
    category: 'Developer',
    keywords: ['query string parser', 'parse query string', 'url parameters', 'querystring decoder', 'url query parser'],
    icon: 'M6 4v6a2 2 0 0 0 2 2h8a2 2 0 0 1 2 2v6M9 9h.01M13 9h4',
  },
  {
    slug: 'csv-parser',
    name: 'CSV Parser',
    tagline: 'Parse CSV into a table and JSON.',
    description:
      'Free CSV parser. Paste CSV to view it as a table and as JSON, with delimiter detection and quoted-field handling. Everything runs locally in your browser.',
    category: 'Developer',
    keywords: ['csv parser', 'parse csv online', 'csv to table', 'read csv', 'csv reader'],
    icon: 'M4 5h16v14H4zM4 9h16M9 5v14M14 5v14',
  },
  {
    slug: 'log-parser',
    name: 'Log Parser',
    tagline: 'Extract fields from log lines.',
    description:
      'Free log parser. Paste log output to split lines into timestamp, level and message, filter by level and search text. Parsing runs entirely in your browser — nothing is uploaded.',
    category: 'Developer',
    keywords: ['log parser', 'parse logs online', 'log analyzer', 'log viewer', 'log file parser'],
    icon: 'M5 4h11l3 3v13H5zM8 11h8M8 15h5M8 7h5',
  },
  {
    slug: 'cron-parser',
    name: 'Cron Parser',
    tagline: 'Explain a cron expression in plain English.',
    description:
      'Free cron parser. Paste a cron expression to see a plain-English description of its schedule and the next few run times. Parsing runs entirely in your browser.',
    category: 'Developer',
    keywords: ['cron parser', 'cron expression explained', 'parse cron', 'cron to human readable', 'cron schedule'],
    icon: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  },

  // ─── Analyzers ────────────────────────────────────────────────
  {
    slug: 'text-analyzer',
    name: 'Text Analyzer',
    tagline: 'Word, character and readability stats.',
    description:
      'Free text analyzer. Get word, character, sentence and paragraph counts, average word and sentence length, reading time and top words for any text. Runs in your browser.',
    category: 'Text',
    keywords: ['text analyzer', 'text statistics', 'word frequency', 'text analysis tool', 'analyze text online'],
    icon: 'M4 6h16M4 12h10M4 18h7M18 14v6m3-3h-6',
  },
  {
    slug: 'password-analyzer',
    name: 'Password Analyzer',
    tagline: 'Estimate password strength and entropy.',
    description:
      'Free password analyzer. Measure a password’s strength, entropy in bits, character variety and estimated crack time, with tips to improve it. Runs locally — nothing is sent.',
    category: 'Security',
    keywords: ['password analyzer', 'password strength checker', 'password entropy', 'how strong is my password', 'password meter'],
    icon: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6zM9 12l2 2 4-4',
  },
  {
    slug: 'color-contrast-analyzer',
    name: 'Color Contrast Analyzer',
    tagline: 'WCAG contrast ratio for two colors.',
    description:
      'Free color contrast analyzer. Check the WCAG contrast ratio between text and background colors and see AA/AAA pass or fail for normal and large text. Runs in your browser.',
    category: 'Image',
    keywords: ['color contrast analyzer', 'wcag contrast checker', 'contrast ratio', 'accessibility contrast', 'color contrast tool'],
    icon: 'M12 3a9 9 0 0 0 0 18zM12 3a9 9 0 0 1 0 18',
  },
  {
    slug: 'sentiment-analyzer',
    name: 'Sentiment Analyzer',
    tagline: 'Gauge positive or negative tone.',
    description:
      'Free sentiment analyzer. Paste text to get a positive, neutral or negative sentiment score based on a word lexicon, with the words that drove the result. Runs in your browser.',
    category: 'Text',
    keywords: ['sentiment analyzer', 'sentiment analysis online', 'text tone checker', 'positive negative text', 'sentiment score'],
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 10h.01M16 10h.01M8 15a5 5 0 0 0 8 0',
  },
  {
    slug: 'image-metadata-analyzer',
    name: 'Image Metadata Analyzer',
    tagline: 'Read full EXIF, GPS, IPTC & XMP — and strip it.',
    description:
      'Free image metadata analyzer. Drop a photo to read its dimensions, format and full metadata — EXIF camera settings, capture date, GPS location with a map link, plus IPTC and XMP. Remove all metadata and download a clean copy. Everything runs locally — your image is never uploaded.',
    category: 'Image',
    keywords: ['image metadata analyzer', 'exif viewer', 'exif remover', 'remove exif', 'gps photo location', 'image info tool', 'read image metadata', 'photo exif reader', 'iptc xmp viewer'],
    icon: 'M4 5h16v14H4zM4 15l4-4 3 3 4-4 5 5M9 9h.01',
  },
  {
    slug: 'csv-analyzer',
    name: 'CSV Analyzer',
    tagline: 'View, profile, sort and convert CSV or TSV.',
    description:
      'Free CSV analyzer and viewer. Upload a file, paste text or load a URL, then browse the data in a searchable, sortable, paged table. Profiles every column — data type, unique values, min/max/mean and empty cells — and exports to JSON, TSV or clean CSV. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['csv analyzer', 'csv viewer', 'view csv online', 'csv statistics', 'data profiling', 'analyze csv online', 'csv column stats', 'csv to json', 'sort csv'],
    icon: 'M4 19V5m0 14h16M8 17V9m4 8V6m4 11v-5',
  },

  // ─── Checkers ─────────────────────────────────────────────────
  {
    slug: 'palindrome-checker',
    name: 'Palindrome Checker',
    tagline: 'Check if text reads the same backward.',
    description:
      'Free palindrome checker. Test whether a word, phrase or number is a palindrome, ignoring case, spaces and punctuation, and see it reversed. Runs entirely in your browser.',
    category: 'Text',
    keywords: ['palindrome checker', 'is it a palindrome', 'palindrome test', 'check palindrome', 'palindrome finder'],
    icon: 'M8 7l-4 5 4 5M16 7l4 5-4 5M12 5v14',
  },
  {
    slug: 'prime-number-checker',
    name: 'Prime Number Checker',
    tagline: 'Test whether a number is prime.',
    description:
      'Free prime number checker. Enter a number to check if it is prime, see its factors if not, and find the nearest primes. Calculations run entirely in your browser.',
    category: 'Calculators',
    keywords: ['prime number checker', 'is it prime', 'prime test', 'check prime number', 'prime factorization'],
    icon: 'M12 3l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z',
  },
  {
    slug: 'leap-year-checker',
    name: 'Leap Year Checker',
    tagline: 'Is a given year a leap year?',
    description:
      'Free leap year checker. Enter any year to see whether it is a leap year under the Gregorian rules, with the reasoning and the next few leap years. Runs in your browser.',
    category: 'Calculators',
    keywords: ['leap year checker', 'is it a leap year', 'leap year calculator', 'check leap year', 'leap year test'],
    icon: 'M5 5h14v14H5zM5 9h14M9 3v4M15 3v4M12 13l1.5 1.5',
  },
  {
    slug: 'readability-checker',
    name: 'Readability Checker',
    tagline: 'Flesch reading ease and grade level.',
    description:
      'Free readability checker. Paste text to get Flesch Reading Ease, Flesch-Kincaid grade level and other scores, so you can gauge how easy it is to read. Runs in your browser.',
    category: 'Text',
    keywords: ['readability checker', 'flesch reading ease', 'reading level checker', 'readability score', 'grade level calculator'],
    icon: 'M5 4h11l3 3v13H5zM8 11h8M8 15h5',
  },
  {
    slug: 'armstrong-number-checker',
    name: 'Armstrong Number Checker',
    tagline: 'Test for narcissistic numbers.',
    description:
      'Free Armstrong number checker. Enter a number to check if it equals the sum of its digits each raised to the number of digits, with the full working. Runs in your browser.',
    category: 'Calculators',
    keywords: ['armstrong number checker', 'narcissistic number', 'is it armstrong number', 'armstrong number test', 'check armstrong number'],
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9 9l6 6m0-6l-6 6',
  },
  {
    slug: 'perfect-number-checker',
    name: 'Perfect Number Checker',
    tagline: 'Check if divisors sum to the number.',
    description:
      'Free perfect number checker. Enter a number to see whether it equals the sum of its proper divisors, with the divisor list and result. Calculations run in your browser.',
    category: 'Calculators',
    keywords: ['perfect number checker', 'is it a perfect number', 'perfect number test', 'divisor sum', 'check perfect number'],
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12l3 3 5-6',
  },
  {
    slug: 'anagram-checker',
    name: 'Anagram Checker',
    tagline: 'Do two words use the same letters?',
    description:
      'Free anagram checker. Enter two words or phrases to check whether they are anagrams, ignoring case, spaces and punctuation, with the sorted letters shown. Runs in your browser.',
    category: 'Text',
    keywords: ['anagram checker', 'is it an anagram', 'anagram test', 'check anagram', 'anagram solver'],
    icon: 'M7 8h10M7 12h10M7 16h6M4 4l1 16m14-16l-1 16',
  },
  {
    slug: 'squaredle-solver',
    name: 'Squaredle Solver',
    tagline: 'Find every word in the daily letter grid.',
    description:
      'Free Squaredle solver and answer finder. Type any Squaredle grid (4×4 and other sizes) and instantly get every valid word, grouped by length, with the path traced on the board. Handles blocked cells and a 361,000-word dictionary. Runs entirely in your browser.',
    category: 'Text',
    keywords: ['squaredle solver', 'squaredle answers', 'squaredle cheat', 'squaredle helper', 'squaredle today', 'word grid solver', 'squaredle word finder'],
    icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  },

  // ─── Testers ──────────────────────────────────────────────────
  {
    slug: 'typing-speed-tester',
    name: 'Typing Speed Tester',
    tagline: 'Measure your words per minute.',
    description:
      'Free typing speed tester. Type a sample passage and get your words-per-minute, accuracy and error count in real time. Everything runs in your browser — no sign-up needed.',
    category: 'Text',
    keywords: ['typing speed tester', 'typing test', 'wpm test', 'words per minute test', 'typing speed check'],
    icon: 'M4 7h16v10H4zM7 10h.01M11 10h.01M15 10h.01M8 14h8',
  },
  {
    slug: 'reaction-time-tester',
    name: 'Reaction Time Tester',
    tagline: 'How fast are your reflexes?',
    description:
      'Free reaction time tester. Wait for the color to change, then click as fast as you can to measure your reaction time in milliseconds over several rounds. Runs in your browser.',
    category: 'Text',
    keywords: ['reaction time tester', 'reaction time test', 'reflex test', 'reaction speed test', 'human benchmark'],
    icon: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  },
  {
    slug: 'click-speed-tester',
    name: 'Click Speed Tester',
    tagline: 'Measure your clicks per second (CPS).',
    description:
      'Free click speed tester. Click as fast as you can within a set time to measure your clicks per second (CPS), with a live counter and your best score. Runs in your browser.',
    category: 'Text',
    keywords: ['click speed tester', 'cps test', 'clicks per second', 'click speed test', 'click test'],
    icon: 'M9 3v6m-4-2l3 3M3 9h6m3 3l7 3-3 1-1 3-3-7z',
  },
  {
    slug: 'screen-tester',
    name: 'Screen Tester',
    tagline: 'Test any display end to end, right in your browser.',
    description:
      'Free screen tester. Cycle full-screen solid colors and gradients to spot dead or stuck pixels and check backlight uniformity on any display. Runs entirely in your browser.',
    category: 'Image',
    keywords: ['screen tester', 'dead pixel test', 'monitor test', 'stuck pixel checker', 'screen color test'],
    icon: 'M4 5h16v11H4zM9 20h6M12 16v4',
  },
  {
    slug: 'color-blindness-tester',
    name: 'Color Blindness Tester',
    tagline: 'Simulate and test color vision.',
    description:
      'Free color blindness tester. Take a quick Ishihara-style plate test and simulate protanopia, deuteranopia and tritanopia on your own images. Runs entirely in your browser.',
    category: 'Image',
    keywords: ['color blindness tester', 'color blind test', 'ishihara test online', 'color vision test', 'colorblindness simulator'],
    icon: 'M12 5c-5 0-9 7-9 7s4 7 9 7 9-7 9-7-4-7-9-7zM12 15a3 3 0 1 0 0-6',
  },
  {
    slug: 'keyboard-tester',
    name: 'Keyboard Tester',
    tagline: 'Check that every key registers.',
    description:
      'Free keyboard tester. Press keys to see them light up on an on-screen keyboard and confirm every key and modifier registers correctly. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['keyboard tester', 'key test', 'keyboard test online', 'check keyboard keys', 'key press test'],
    icon: 'M3 6h18v12H3zM6 9h.01M10 9h.01M14 9h.01M18 9h.01M8 13h8',
  },

  // ─── Estimators ───────────────────────────────────────────────
  {
    slug: 'reading-time-estimator',
    name: 'Reading Time Estimator',
    tagline: 'How long your text takes to read.',
    description:
      'Free reading time estimator. Paste text to estimate reading and speaking time at your chosen words-per-minute, with word and sentence counts. Runs entirely in your browser.',
    category: 'Calculators',
    keywords: ['reading time estimator', 'reading time calculator', 'how long to read', 'words per minute', 'speaking time estimator'],
    icon: 'M4 5h11l3 3v11H4zM12 3v5h5M12 12v5l3-2',
  },
  {
    slug: 'project-cost-estimator',
    name: 'Project Cost Estimator',
    tagline: 'Estimate cost from hours and rates.',
    description:
      'Free project cost estimator. Add tasks with hours and hourly rates to estimate total project cost, apply a contingency and see a per-task breakdown. Runs in your browser.',
    category: 'Calculators',
    keywords: ['project cost estimator', 'project cost calculator', 'estimate project cost', 'labor cost estimator', 'job cost calculator'],
    icon: 'M4 5h16v14H4zM8 9h8M8 13h5M16 17l2 2 3-3',
  },
  {
    slug: 'calorie-burn-estimator',
    name: 'Calorie Burn Estimator',
    tagline: 'Calories burned by activity and time.',
    description:
      'Free calorie burn estimator. Estimate calories burned from an activity, your weight and duration using MET values across dozens of exercises. Runs entirely in your browser.',
    category: 'Calculators',
    keywords: ['calorie burn estimator', 'calories burned calculator', 'exercise calorie calculator', 'met calorie calculator', 'activity calories'],
    icon: 'M12 3c1 3-1 4-1 6a3 3 0 0 0 6 0c0-1-.5-2-1-3 2 1 4 4 4 7a6 6 0 0 1-12 0c0-4 3-5 4-10z',
  },
  {
    slug: 'paint-estimator',
    name: 'Paint Estimator',
    tagline: 'How much paint your walls need.',
    description:
      'Free paint estimator. Enter room dimensions, doors and windows to estimate the wall area, paint quantity and number of coats needed. Calculations run in your browser.',
    category: 'Calculators',
    keywords: ['paint estimator', 'paint calculator', 'how much paint do i need', 'wall paint calculator', 'paint coverage calculator'],
    icon: 'M4 4h13v6H4zM17 6h3v5l-6 2v3M11 18v3',
  },
  {
    slug: 'wallpaper-estimator',
    name: 'Wallpaper Estimator',
    tagline: 'Rolls of wallpaper for a room.',
    description:
      'Free wallpaper estimator. Enter wall dimensions and roll size to estimate how many rolls of wallpaper you need, accounting for pattern repeat and waste. Runs in your browser.',
    category: 'Calculators',
    keywords: ['wallpaper estimator', 'wallpaper calculator', 'how many rolls of wallpaper', 'wallpaper coverage', 'rolls calculator'],
    icon: 'M4 4h16v5H4zM6 9v11m6-11v11m6-11v11M4 20h16',
  },
  {
    slug: 'freelance-rate-estimator',
    name: 'Freelance Rate Estimator',
    tagline: 'Set your hourly and day rate.',
    description:
      'Free freelance rate estimator. Turn your target income, expenses, billable days and time off into a recommended hourly and daily rate. Calculations run in your browser.',
    category: 'Calculators',
    keywords: ['freelance rate estimator', 'freelance rate calculator', 'hourly rate calculator', 'day rate calculator', 'freelance pricing'],
    icon: 'M12 3v18M8 7h6a2 2 0 0 1 0 4H9a2 2 0 0 0 0 4h7',
  },

  // ─── Predictors ───────────────────────────────────────────────
  {
    slug: 'gender-predictor',
    name: 'Gender Predictor',
    tagline: 'Chinese-calendar baby gender for fun.',
    description:
      'Free gender predictor. A just-for-fun tool that guesses baby gender from the Chinese lunar calendar using conception month and mother’s age. For entertainment only — runs in your browser.',
    category: 'Calculators',
    keywords: ['gender predictor', 'baby gender predictor', 'chinese gender predictor', 'boy or girl predictor', 'gender prediction'],
    icon: 'M10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm3-3l6-6m-4 0h4v4',
  },
  {
    slug: 'love-predictor',
    name: 'Love Predictor',
    tagline: 'Fun love compatibility percentage.',
    description:
      'Free love predictor. Enter two names for a just-for-fun compatibility percentage and playful message. Purely for entertainment — the score runs in your browser.',
    category: 'Calculators',
    keywords: ['love predictor', 'love calculator', 'love compatibility test', 'name compatibility', 'love percentage calculator'],
    icon: 'M12 20s-7-4.5-9-9a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2c-2 4.5-9 9-9 9z',
  },
  {
    slug: 'life-expectancy-predictor',
    name: 'Life Expectancy Predictor',
    tagline: 'Rough lifespan estimate from habits.',
    description:
      'Free life expectancy predictor. Answer a few lifestyle questions for a rough life-expectancy estimate based on general averages. For entertainment and awareness only — runs in your browser.',
    category: 'Calculators',
    keywords: ['life expectancy predictor', 'life expectancy calculator', 'lifespan calculator', 'how long will i live', 'longevity calculator'],
    icon: 'M4 12h4l2 6 4-14 2 8h4',
  },
  {
    slug: 'child-height-predictor',
    name: 'Child Height Predictor',
    tagline: "Estimate a child's adult height.",
    description:
      'Free child height predictor. Estimate a child’s likely adult height from the parents’ heights using the mid-parental method. A rough guide only — calculations run in your browser.',
    category: 'Calculators',
    keywords: ['child height predictor', 'adult height calculator', 'how tall will my child be', 'height predictor', 'midparental height'],
    icon: 'M8 21V8a2 2 0 0 1 4 0v13M6 21h8M16 21V4m0 0l-2 2m2-2l2 2',
  },
  {
    slug: 'lucky-number-predictor',
    name: 'Lucky Number Predictor',
    tagline: 'Personal lucky numbers from your name.',
    description:
      'Free lucky number predictor. Enter your name and birth date for a set of just-for-fun lucky numbers derived from numerology. For entertainment only — runs in your browser.',
    category: 'Calculators',
    keywords: ['lucky number predictor', 'lucky number generator', 'numerology lucky number', 'my lucky numbers', 'lucky number calculator'],
    icon: 'M12 3l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z',
  },
  {
    slug: 'career-predictor',
    name: 'Career Predictor',
    tagline: 'Fun career suggestions from a quiz.',
    description:
      'Free career predictor. Answer a short interests quiz to get playful career suggestions that match your style. For fun and inspiration only — everything runs in your browser.',
    category: 'Calculators',
    keywords: ['career predictor', 'career quiz', 'what job should i have', 'career test', 'career suggestion tool'],
    icon: 'M4 8h16v11H4zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 13h16',
  },

  // ─── Simulators ───────────────────────────────────────────────
  {
    slug: 'probability-simulator',
    name: 'Probability Simulator',
    tagline: 'Run coin and dice trials at scale.',
    description:
      'Free probability simulator. Run thousands of coin flips or dice rolls to watch outcomes converge on theoretical probability, with live charts. Everything runs in your browser.',
    category: 'Calculators',
    keywords: ['probability simulator', 'coin flip simulator', 'dice roll simulator', 'monte carlo simulator', 'probability experiment'],
    icon: 'M4 6h7v7H4zM13 11h7v7h-7zM7 9h.01M16 14h.01',
  },
  {
    slug: 'roulette-simulator',
    name: 'Roulette Simulator',
    tagline: 'Practice roulette with fake chips.',
    description:
      'Free roulette simulator. Place bets with virtual chips and spin a European wheel to see how strategies play out over many rounds. For practice only — runs in your browser.',
    category: 'Generators',
    keywords: ['roulette simulator', 'free roulette', 'roulette practice', 'roulette wheel simulator', 'virtual roulette'],
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 3v5M12 16v5',
  },
  {
    slug: 'slot-machine-simulator',
    name: 'Slot Machine Simulator',
    tagline: 'Spin virtual reels for fun.',
    description:
      'Free slot machine simulator. Spin three reels with virtual credits and watch your balance over time. Purely for fun with no real money — everything runs in your browser.',
    category: 'Generators',
    keywords: ['slot machine simulator', 'free slot machine', 'slot simulator', 'virtual slots', 'slot machine game'],
    icon: 'M5 7h14v10H5zM9 7v10M15 7v10M7 3h10v4H7z',
  },
  {
    slug: 'monty-hall-simulator',
    name: 'Monty Hall Simulator',
    tagline: 'See why switching doors wins.',
    description:
      'Free Monty Hall simulator. Play the three-door puzzle and run thousands of automated trials to see the win rate for staying versus switching. Runs entirely in your browser.',
    category: 'Calculators',
    keywords: ['monty hall simulator', 'monty hall problem', 'three door problem', 'monty hall game', 'switch or stay simulator'],
    icon: 'M5 20V6l4-2v16M15 20V6l4-2v16M9 12h.01M19 12h.01',
  },
  {
    slug: 'stock-market-simulator',
    name: 'Stock Market Simulator',
    tagline: 'Practice trading with fake money.',
    description:
      'Free stock market simulator. Trade a simulated stock with virtual cash on a random-walk price and track your portfolio value. For practice only — everything runs in your browser.',
    category: 'Calculators',
    keywords: ['stock market simulator', 'trading simulator', 'paper trading', 'stock simulator', 'investing simulator'],
    icon: 'M4 19V5m0 14h16M8 15l3-4 3 2 4-6',
  },
  {
    slug: 'savings-goal-simulator',
    name: 'Savings Goal Simulator',
    tagline: 'See how savings grow over time.',
    description:
      'Free savings goal simulator. Enter a starting balance, monthly contribution and interest rate to project how long a savings goal takes to reach, with a growth chart. Runs in your browser.',
    category: 'Calculators',
    keywords: ['savings goal simulator', 'savings calculator', 'savings goal calculator', 'compound savings simulator', 'save money calculator'],
    icon: 'M4 19V5m0 14h16M7 16l3-3 3 1 4-5M18 6h3v3',
  },

  // ─── Makers ───────────────────────────────────────────────────
  {
    slug: 'collage-maker',
    name: 'Collage Maker',
    tagline: 'Full collage editor: layouts, text, stickers, shapes and more.',
    description:
      'Free collage maker and photo editor. Choose grid or freeform layouts, set the canvas size, add text with custom fonts, stickers, shapes and doodles, and style the background with colors, gradients or a photo. Drag, resize, rotate and layer everything on an interactive canvas, save reusable templates, then export a high-resolution PNG or JPEG. Your photos are edited locally and never uploaded; optional stock photo search uses Pexels.',
    category: 'Image',
    keywords: ['collage maker', 'photo collage maker', 'picture collage', 'make a collage', 'image collage tool', 'photo editor', 'collage templates', 'add text to photo', 'photo stickers', 'collage layouts'],
    icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  },
  {
    slug: 'chart-maker',
    name: 'Chart Maker',
    tagline: '24 chart types from spreadsheet data.',
    description:
      'Free online chart maker with 24 chart types: bar, column, horizontal, stacked and 100% stacked bar, line, smooth line, area and stacked area, pie, doughnut, half-doughnut, gauge, polar area, radar, scatter, bubble, box plot, funnel, pyramid, treemap, heatmap, candlestick, and dual-axis bar-plus-line. Paste CSV straight from a spreadsheet, set a title, colors and legend, then download a high-resolution PNG. Charts are rendered locally in your browser and never uploaded.',
    category: 'Image',
    keywords: ['chart maker', 'graph maker', 'create charts online', 'bar chart maker', 'pie chart generator', 'line graph maker', 'scatter plot maker', 'radar chart maker', 'doughnut chart', 'area chart maker', 'bubble chart', 'box plot maker', 'treemap maker', 'heatmap generator', 'candlestick chart maker', 'histogram maker', 'funnel chart', 'gauge chart', 'stacked bar chart'],
    icon: 'M4 19V5m0 14h16M8 17V9m4 8V6m4 11v-4',
  },
  {
    slug: 'word-cloud-maker',
    name: 'Word Cloud Maker',
    tagline: 'Turn text into a word cloud.',
    description:
      'Free word cloud maker. Paste text to generate a word cloud sized by frequency, with color and font options, then download it as a PNG. Rendered entirely in your browser.',
    category: 'Image',
    keywords: ['word cloud maker', 'word cloud generator', 'tag cloud maker', 'create word cloud', 'text cloud generator'],
    icon: 'M6 12h4M12 9h6M8 15h8M5 9h.01M19 15h.01',
  },
  {
    slug: 'subtitle-maker',
    name: 'Subtitle Maker',
    tagline: 'Build SRT subtitle files by hand.',
    description:
      'Free subtitle maker. Add caption lines with start and end times to build a valid SRT subtitle file, then download it. Everything is created locally in your browser.',
    category: 'Audio & Video',
    keywords: ['subtitle maker', 'srt maker', 'create subtitles', 'subtitle file generator', 'srt file creator'],
    icon: 'M4 5h16v14H4zM7 15h4M13 15h4M7 11h10',
  },
  {
    slug: 'sprite-sheet-maker',
    name: 'Sprite Sheet Maker',
    tagline: 'Pack, reorder and export sprite sheets.',
    description:
      'Free sprite sheet maker. Drop frames, drag to reorder, pack them into a uniform grid or a tight texture atlas, preview the animation at any FPS, then export the PNG plus a JSON atlas, CSS sprites or a ZIP bundle. You can also split an existing sheet back into frames. Runs entirely in your browser.',
    category: 'Image',
    keywords: ['sprite sheet maker', 'sprite sheet generator', 'css sprite generator', 'game sprite packer', 'texture atlas maker', 'sprite sheet splitter', 'json atlas export', 'animation preview'],
    icon: 'M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4z',
  },
  {
    slug: 'sticker-maker',
    name: 'Sticker Maker',
    tagline: 'Auto-remove backgrounds and add a die-cut outline.',
    description:
      'Free sticker maker. Drop any photo — it auto-removes the background and wraps your subject in a die-cut outline. Add text, pick a shape, drop shadows, and lay out a print sheet. Everything runs locally in your browser, nothing is uploaded.',
    category: 'Image',
    keywords: ['sticker maker', 'sticker creator', 'make stickers online', 'die cut sticker', 'sticker outline generator', 'background remover', 'remove background from image', 'custom sticker', 'sticker sheet maker', 'text sticker'],
    icon: 'M5 5h10l4 4v10H5zM15 5v4h4',
  },

  // ─── Creators ─────────────────────────────────────────────────
  {
    slug: 'email-signature-creator',
    name: 'Email Signature Creator',
    tagline: 'Build an HTML email signature.',
    description:
      'Free email signature creator. Fill in your name, title, company and links to build a clean HTML email signature, preview it live and copy the code. Runs entirely in your browser.',
    category: 'Generators',
    keywords: ['email signature creator', 'email signature generator', 'html signature maker', 'create email signature', 'signature template'],
    icon: 'M4 6h16v12H4zM4 7l8 6 8-6M7 17h4',
  },
  {
    slug: 'timeline-creator',
    name: 'Timeline Creator',
    tagline: 'Make a visual event timeline.',
    description:
      'Free timeline maker with vertical, horizontal and alternating infographic layouts. Add point events or date ranges, auto-sort by date (even BC dates), start from ready-made templates, or auto-fill from Wikipedia history and public holidays. Import and export TimelineJS JSON, and download as PNG, SVG or PDF. Everything runs locally in your browser.',
    category: 'Image',
    keywords: ['timeline creator', 'timeline maker', 'create a timeline', 'timeline generator', 'event timeline maker', 'timeline infographic', 'timeline template', 'history timeline', 'timelinejs', 'roadmap timeline'],
    icon: 'M4 12h16M8 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0M8 12V7M16 12a2 2 0 1 0 0-.01M16 12v5',
  },
  {
    slug: 'gantt-chart-creator',
    name: 'Gantt Chart Creator',
    tagline: 'Plan and schedule tasks on a Gantt chart.',
    description:
      'Free Gantt chart maker with dependencies, milestones, critical path and auto-scheduling. Add tasks with working-day durations, link them, and drag bars to reschedule — dependents update automatically. Weekends and holidays are skipped, progress and summary tasks roll up, and you can import/export MS Project XML, CSV and JSON or download PNG, SVG and PDF. Everything runs in your browser.',
    category: 'Image',
    keywords: ['gantt chart creator', 'gantt chart maker', 'create gantt chart', 'project timeline chart', 'gantt generator', 'critical path', 'ms project alternative', 'project scheduler', 'task dependencies'],
    icon: 'M4 5h16v14H4zM6 9h6M6 12h9M6 15h4',
  },
  {
    slug: 'org-chart-creator',
    name: 'Org Chart Creator',
    tagline: 'Build an organization chart visually.',
    description:
      'Free visual org chart maker. Add people with titles, photos and departments, drag boxes to change who reports to whom, switch layouts and themes, or build the whole chart from a CSV. Export PNG, SVG, PDF or a reusable JSON project. Everything runs in your browser.',
    category: 'Image',
    keywords: ['org chart creator', 'org chart maker', 'organizational chart generator', 'create org chart', 'hierarchy chart maker', 'org chart from csv', 'org chart with photos', 'company structure chart', 'reporting structure diagram', 'smartdraw org chart alternative'],
    icon: 'M9 4h6v4H9zM4 16h6v4H4zM14 16h6v4h-6zM12 8v4M7 16v-2h10v2',
  },
  {
    slug: 'checklist-creator',
    name: 'Checklist Creator',
    tagline: 'Build and print a task checklist.',
    description:
      'Free checklist creator. Type tasks to build a clean, tickable checklist you can check off, print or download as text. Everything is saved locally in your browser.',
    category: 'Generators',
    keywords: ['checklist creator', 'checklist maker', 'create a checklist', 'todo list maker', 'printable checklist'],
    icon: 'M4 6h2l1 1 2-2M11 6h9M4 12h2l1 1 2-2M11 12h9M4 18h2l1 1 2-2M11 18h9',
  },
  {
    slug: 'seating-chart-creator',
    name: 'Seating Chart Creator',
    tagline: 'Drag guests onto tables and plan your event.',
    description:
      'Free drag-and-drop seating chart creator. Start from a wedding, banquet, classroom, restaurant or theater template, add round, rectangular, head, sweetheart or U-shape tables, then drag guests onto seats. Import your list from Excel or CSV, set keep-together and keep-apart rules, auto-seat the rest, and export a PNG, PDF or printable table cards. Everything runs in your browser.',
    category: 'Image',
    keywords: ['seating chart creator', 'seating chart maker', 'wedding seating chart', 'table plan maker', 'seating plan generator', 'drag and drop seating chart', 'reception table planner', 'classroom seating chart', 'banquet floor plan'],
    icon: 'M7 10a2 2 0 1 0 0-.01M17 10a2 2 0 1 0 0-.01M5 20v-3a3 3 0 0 1 3-3M19 20v-3a3 3 0 0 0-3-3M12 14a3 3 0 0 0-3 3v3h6v-3a3 3 0 0 0-3-3z',
  },

  // ─── Downloaders (client-side only) ───────────────────────────
  {
    slug: 'svg-downloader',
    name: 'SVG Downloader',
    tagline: 'Paste SVG code and save it as a file.',
    description:
      'Free SVG downloader. Paste SVG markup to preview it, then download it as an .svg file or rasterize it to a PNG at a chosen size. Everything runs locally in your browser.',
    category: 'Image',
    keywords: ['svg downloader', 'download svg', 'svg to file', 'save svg', 'svg to png download'],
    icon: 'M12 4v10m-4-4l4 4 4-4M5 18h14',
  },
  {
    slug: 'base64-file-downloader',
    name: 'Base64 File Downloader',
    tagline: 'Turn a data URI into a saved file.',
    description:
      'Free base64 file downloader. Paste a base64 string or data URI to decode it and download the resulting file, with type auto-detected. Everything runs locally in your browser.',
    category: 'Developer',
    keywords: ['base64 file downloader', 'base64 to file', 'data uri to file', 'decode base64 download', 'base64 decoder download'],
    icon: 'M12 4v10m-4-4l4 4 4-4M5 18h14M9 8H7V6',
  },
  {
    slug: 'ics-calendar-downloader',
    name: 'ICS Calendar Downloader',
    tagline: 'Create a calendar event .ics file.',
    description:
      'Free ICS calendar downloader. Enter an event’s title, time and location to build a valid .ics file you can import into any calendar. Everything is created in your browser.',
    category: 'Generators',
    keywords: ['ics calendar downloader', 'ics file generator', 'create ics file', 'calendar event generator', 'ical download'],
    icon: 'M5 5h14v14H5zM5 9h14M9 3v4M15 3v4M12 13v3m-2-2h4',
  },
  {
    slug: 'vcard-downloader',
    name: 'vCard Downloader',
    tagline: 'Build a contact .vcf file.',
    description:
      'Free vCard downloader. Enter contact details to build a valid .vcf vCard you can import into any address book, with a QR option. Everything is created in your browser.',
    category: 'Generators',
    keywords: ['vcard downloader', 'vcf file generator', 'create vcard', 'contact card generator', 'vcf download'],
    icon: 'M4 5h16v14H4zM9 10a2 2 0 1 0 0-.01M6 16a3 3 0 0 1 6 0M14 9h4M14 13h4',
  },
  {
    slug: 'typegrow-linkedin-formatter',
    name: 'LinkedIn Text Formatter',
    tagline: 'Bold, italic & styled text for LinkedIn posts.',
    description:
      'Free LinkedIn text formatter (Typegrow-style). Add bold, italic, underline, strikethrough and bullet lists to LinkedIn posts using Unicode that survives copy-paste. Runs in your browser.',
    category: 'Text',
    keywords: ['linkedin text formatter', 'typegrow', 'bold text for linkedin', 'linkedin bold generator', 'linkedin post formatter'],
    icon: 'M4 7V5h16v2M9 5v14M7 19h4M14 12h6M14 16h6',
  },
  {
    slug: 'small-text-generator',
    name: 'Small Text Generator',
    tagline: 'Tiny superscript, subscript & small-caps text.',
    description:
      'Free small text generator. Convert normal text into tiny Unicode superscript, subscript and small caps that paste into Instagram, X, Discord and bios. Runs entirely in your browser.',
    category: 'Text',
    keywords: ['small text generator', 'tiny text', 'superscript generator', 'small caps generator', 'subscript text'],
    icon: 'M4 7V5h10v2M9 5v10M7 15h4M16 9h4v2h-4zM16 13h4',
  },
  {
    slug: 'sql-validator',
    name: 'SQL Validator',
    tagline: 'Check SQL syntax & structure for errors.',
    description:
      'Free SQL validator. Check SQL queries for unbalanced parentheses, unterminated strings, trailing commas, misplaced clauses and other syntax problems. Runs in your browser — nothing uploaded.',
    category: 'Developer',
    keywords: ['sql validator', 'sql syntax checker', 'validate sql', 'sql linter', 'check sql online'],
    icon: 'M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2zM4 6v12c0 1.1 3.6 2 8 2s8-.9 8-2V6M4 12c0 1.1 3.6 2 8 2s8-.9 8-2',
  },
  {
    slug: 'structured-data-validator',
    name: 'Structured Data Validator',
    tagline: 'Validate schema.org JSON-LD for rich results.',
    description:
      'Free structured data validator. Check schema.org JSON-LD markup for Google rich results — extracts blocks from HTML and verifies required and recommended properties per type. Runs in your browser.',
    category: 'Developer',
    keywords: ['structured data validator', 'schema markup validator', 'json-ld validator', 'rich results test', 'schema.org checker'],
    icon: 'M4 5h16v14H4zM4 9h16M9 5v14M13 12l2 2 3-3',
  },
  {
    slug: 'rust-formatter',
    name: 'Rust Formatter',
    tagline: 'Beautify & indent Rust source code.',
    description:
      'Free Rust formatter. Tidy Rust source with consistent brace-based indentation and spacing, right in your browser. A lightweight in-browser beautifier — no uploads, no account.',
    category: 'Developer',
    keywords: ['rust formatter', 'rust beautifier', 'format rust code', 'rustfmt online', 'rust code formatter'],
    icon: 'M8 6l-4 6 4 6M16 6l4 6-4 6M13 4l-2 16',
  },
  {
    slug: 'har-file-analyzer',
    name: 'HAR File Analyzer',
    tagline: 'Break down a browser HAR network capture.',
    description:
      'Free HAR file analyzer. Summarize a HTTP Archive capture — total requests, size and time, breakdown by type and domain, and the slowest and largest requests. Parsed locally, nothing uploaded.',
    category: 'Developer',
    keywords: ['har file analyzer', 'har viewer', 'analyze har', 'har file reader', 'network waterfall analyzer'],
    icon: 'M4 5h16v14H4zM4 9h16M8 13h8M8 16h5',
  },
  {
    slug: 'ssn-validator',
    name: 'SSN Validator',
    tagline: 'Check a US Social Security Number format.',
    description:
      'Free SSN validator. Check whether a US Social Security Number is structurally valid per SSA rules — area, group and serial checks plus known-invalid numbers. For form validation and test data only. Runs in your browser.',
    category: 'Developer',
    keywords: ['ssn validator', 'social security number validator', 'validate ssn', 'ssn format checker', 'ssn checker'],
    icon: 'M4 5h16v14H4zM7 9h6M7 12h10M7 15h4M15 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  },
  {
    slug: 'discord-time-converter',
    name: 'Discord Time Converter',
    tagline: 'Generate Discord timestamp markup.',
    description:
      'Free Discord timestamp converter. Turn any date and time into Discord <t:UNIX:STYLE> markup that renders in each viewer’s timezone. All seven styles with live preview and copy. Runs in your browser.',
    category: 'Converters',
    keywords: ['discord time converter', 'discord timestamp', 'discord timestamp generator', 'unix to discord', 'discord time format'],
    icon: 'M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  },
  {
    slug: 'grams-to-cups-converter',
    name: 'Grams to Cups Converter',
    tagline: 'Convert baking weights to cups by ingredient.',
    description:
      'Free grams to cups converter. Convert flour, sugar, butter and more between grams, cups, tablespoons, teaspoons, ounces and millilitres using per-ingredient densities. Runs in your browser.',
    category: 'Converters',
    keywords: ['grams to cups', 'grams to cups converter', 'cups to grams', 'baking conversion', 'flour grams to cups'],
    icon: 'M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM6 8V5h12v3M9 3v2M15 3v2',
  },
  {
    slug: 'ebay-fee-calculator',
    name: 'eBay Fee Calculator',
    tagline: 'Estimate eBay fees & net profit on a sale.',
    description:
      'Free eBay fee calculator. Estimate final value fees, fixed per-order fees and optional surcharges, then subtract item cost to see net profit and margin. Based on eBay US defaults. Runs in your browser.',
    category: 'Calculators',
    keywords: ['ebay fee calculator', 'ebay profit calculator', 'ebay final value fee', 'ebay seller fees', 'ebay fees'],
    icon: 'M4 7h16l-1.5 10.5A2 2 0 0 1 16.5 19h-9a2 2 0 0 1-2-1.5zM9 7V5a3 3 0 0 1 6 0v2M12 11v4',
  },
  {
    slug: 'pride-pfp-maker',
    name: 'Pride PFP Maker',
    tagline: 'Add a Pride flag to your profile picture.',
    description:
      'Free Pride PFP maker. Add a Pride flag ring, overlay or corner banner to your profile picture — Rainbow, Progress, Trans, Bi, Pan, Lesbian and more. Drawn locally, your photo is never uploaded.',
    category: 'Image',
    keywords: ['pride pfp maker', 'pride flag profile picture', 'pride filter', 'rainbow profile picture', 'lgbt pfp maker'],
    icon: 'M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M3 10h18M3 14h18M9 3v18',
  },
  {
    slug: 'dpi-analyzer',
    name: 'DPI Analyzer',
    tagline: 'Measure your mouse DPI by dragging.',
    description:
      'Free DPI analyzer. Measure your mouse’s real DPI/CPI by dragging a set physical distance across a pad and comparing to your configured setting. Runs entirely in your browser.',
    category: 'Developer',
    keywords: ['dpi analyzer', 'mouse dpi checker', 'dpi calculator', 'measure mouse dpi', 'cpi analyzer'],
    icon: 'M6 3l4 18 3-7 7-3zM6 3l7 7',
  },
  {
    slug: 'picrew-oc-maker',
    name: 'Picrew OC Maker',
    tagline: 'Build a cute cartoon avatar for your OC.',
    description:
      'Free Picrew-style OC maker. Build a cute cartoon avatar from layered parts — face, skin, hair, eyes and background — then download a PNG. Original art, drawn in your browser.',
    category: 'Generators',
    keywords: ['picrew oc maker', 'oc maker', 'anime avatar maker', 'character avatar creator', 'picrew style maker'],
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0',
  },
  {
    slug: 'character-creator',
    name: 'Character Creator',
    tagline: 'Roll an RPG character with stats & backstory.',
    description:
      'Free character creator. Roll a complete tabletop character — name, race, class, six ability scores, a trait, ideal, flaw and backstory hook — for D&D, writing and RPGs. Runs in your browser.',
    category: 'Generators',
    keywords: ['character creator', 'rpg character generator', 'dnd character generator', 'random character maker', 'character sheet generator'],
    icon: 'M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16l-4.9 2.6.9-5.5-4-3.9 5.5-.8z',
  },
  {
    slug: 'oligo-analyzer',
    name: 'Oligo Analyzer',
    tagline: 'DNA/RNA oligo Tm, GC%, MW & rev-comp.',
    description:
      'Free oligo analyzer. Compute DNA/RNA oligonucleotide length, GC content, melting temperature, molecular weight, extinction coefficient and reverse complement for PCR primer design. Runs in your browser.',
    category: 'Calculators',
    keywords: ['oligo analyzer', 'oligo calculator', 'primer tm calculator', 'dna melting temperature', 'gc content calculator'],
    icon: 'M6 3c6 3 6 15 12 18M18 3c-6 3-6 15-12 18M7 7h10M7 12h10M7 17h10',
  },
  {
    slug: 'bpm-analyzer',
    name: 'BPM Analyzer',
    tagline: 'Find a song’s tempo by tap or audio file.',
    description:
      'Free BPM analyzer. Find any track’s tempo by tapping to the beat, or drop an audio file for automatic beat detection. Great for DJing and production. Processed locally, nothing uploaded.',
    category: 'Audio & Video',
    keywords: ['bpm analyzer', 'bpm counter', 'tap tempo', 'song bpm finder', 'tempo detector'],
    icon: 'M9 18V5l12-2v13M9 13l12-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  },
  {
    slug: 'pokemon-team-builder',
    name: 'Pokémon Team Builder',
    tagline: 'Build a team & analyze type coverage.',
    description:
      'Free Pokémon team builder. Assemble a team of up to six Kanto Pokémon and instantly analyze type weaknesses, resistances and coverage. Type badges in official colors. Runs in your browser.',
    category: 'Generators',
    keywords: ['pokemon team builder', 'pokemon type coverage', 'team weakness calculator', 'pokemon team planner', 'kanto team builder'],
    icon: 'M3 12h6a3 3 0 0 1 6 0h6M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  },
  {
    slug: 'cryptogram-solver',
    name: 'Cryptogram Solver',
    tagline: 'Crack substitution ciphers automatically.',
    description:
      'Free cryptogram solver. Crack substitution-cipher puzzles with a hill-climbing auto-solver scored on English letter and trigram frequencies, or solve manually with a live substitution key. Runs in your browser.',
    category: 'Text',
    keywords: ['cryptogram solver', 'substitution cipher solver', 'cryptoquote solver', 'cipher decoder', 'crack cryptogram'],
    icon: 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5zM12 15v3',
  },
  {
    slug: 'squardle-solver',
    name: 'Squardle Solver',
    tagline: 'Find 5-letter words from green/yellow clues.',
    description:
      'Free Squardle solver. Find every valid 5-letter word from your green, yellow and gray clues, ranked by letter commonness — the same logic as Squardle and Wordle. Runs in your browser.',
    category: 'Text',
    keywords: ['squardle solver', 'wordle solver', 'word finder', '5 letter word solver', 'squardle helper'],
    icon: 'M4 4h16v16H4zM4 9h16M4 14h16M9 4v16M14 4v16',
  },
  {
    slug: 'kanoodle-solver',
    name: 'Kanoodle Solver',
    tagline: 'Solve the 5×11 Kanoodle puzzle board.',
    description:
      'Free Kanoodle solver. Mark the pieces already on your 5×11 board and let a backtracking exact-cover solver fit the remaining polyomino pieces to fill every empty square. Runs in your browser.',
    category: 'Generators',
    keywords: ['kanoodle solver', 'kanoodle solutions', 'polyomino solver', 'kanoodle answers', 'puzzle solver'],
    icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  },
  {
    slug: 'internet-speed-test',
    name: 'Internet Speed Test',
    tagline: 'Download, upload, ping, jitter & bufferbloat.',
    description:
      'Free internet speed test with multi-stream download and upload measurement for accurate gigabit results. Measures ping, jitter, latency under load and a bufferbloat grade, detects your ISP, IP and test server, and rates your connection for calls, streaming and gaming. Runs entirely in your browser against Cloudflare’s global edge.',
    category: 'Developer',
    keywords: [
      'internet speed test',
      'bandwidth test',
      'download speed test',
      'upload speed test',
      'ping test',
      'bufferbloat test',
      'latency under load',
      'jitter test',
      'gigabit speed test',
    ],
    icon: 'M4 15a8 8 0 0116 0M12 15l4.5-4.5',
  },
  {
    slug: 'gps-speedometer',
    name: 'GPS Speedometer',
    tagline: 'Live speed from your device’s GPS.',
    description:
      'Free GPS speedometer. See your real-world speed in km/h or mph live from your device’s GPS, with current, average and top speed on an animated dial. Runs entirely in your browser — no location data is uploaded.',
    category: 'Calculators',
    keywords: [
      'gps speedometer',
      'speedometer online',
      'digital speedometer',
      'car speed tracker',
      'speed tracker app',
    ],
    icon: 'M4 15a8 8 0 0116 0M12 15l5-3M12 21v-2',
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
