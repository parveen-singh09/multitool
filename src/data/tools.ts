// Central tool registry. Drives the home grid, dynamic routes, sitemap,
// and per-tool SEO. Each tool is a "district" in ToolCities.

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
