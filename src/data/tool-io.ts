// Tool I/O contracts for the AI chat router.
//
// The AI chat needs to know, for any tool the user's request routes to:
//   1. what INPUT the tool needs (and what that input looks like),
//   2. what the tool DOES with it,
//   3. what OUTPUT comes back (and what it looks like),
//   4. HOW the chat should show that output.
//
// Display category (tools.ts) does NOT map to I/O — "Generators" alone spans
// text, image and PDF outputs. So we classify by I/O ARCHETYPE instead: the
// contract IS the archetype. Every tool maps to exactly one archetype; the
// archetype is defined once. Per-tool nuance goes in OVERRIDES.
//
// getToolIO(slug) is what the router calls. The dev self-check at the bottom
// asserts every tool in tools.ts is classified — that's the coverage guarantee.

import { tools } from './tools';

// What the tool needs from the user.
export type InputType =
  | 'text'    // freeform text pasted/typed into the chat
  | 'file'    // a single uploaded file (image, pdf, audio, video)
  | 'files'   // two or more files
  | 'numbers' // one or more numeric values / measurements
  | 'date'    // a date (or dates)
  | 'color'   // a color value (hex/rgb/name)
  | 'options' // config only — no user content (e.g. "length 16, include symbols")
  | 'none';   // nothing to supply; the tool is a live interaction (device, game)

// What the tool produces.
export type OutputType =
  | 'text'        // a string result
  | 'data'        // structured facts (valid/invalid, stats, parsed fields)
  | 'number'      // a computed number or set of numbers
  | 'image'       // a raster/vector image
  | 'file'        // a downloadable file (pdf, zip, audio, video, docx…)
  | 'interactive';// no static result — the user must operate the tool live

// How the chat surfaces the result.
export type RenderMode =
  | 'inline-text'   // print the text in the assistant card (copyable)
  | 'inline-result' // small card of computed values / facts
  | 'inline-image'  // image preview + download button
  | 'inline-file'   // download button (+ short note)
  | 'embed'         // iframe the live tool page inside the chat
  | 'link';         // open the tool in a new tab

export interface ToolIO {
  input: InputType;
  /** One line: what the input looks like, so the AI can ask for it correctly. */
  inputShape: string;
  /** One line: what the tool does with the input. */
  does: string;
  output: OutputType;
  /** One line: what the output looks like. */
  outputShape: string;
  render: RenderMode;
  /**
   * Can the chat produce this result itself (inline), or must it hand off to
   * the live tool (embed/link)? The 6 image format-conversions + pdf-to-jpg are
   * the only jobs wired to run inline today (see AiToolChat.astro INLINE map);
   * everything else with runnableInChat=false is embedded/linked. This flags
   * intent — the router decides embed vs link from render.
   */
  runnableInChat: boolean;
}

// --- archetypes: the contract, defined once each -----------------------------

export type Archetype =
  | 'text-transform'  // text in  → transformed text out
  | 'text-analyze'    // text in  → stats / validation / parsed data out
  | 'number-calc'     // numbers in → computed result
  | 'date-calc'       // date(s) in → computed result
  | 'color-transform' // color in → converted color(s) out
  | 'image-convert'   // image file in → image file out
  | 'image-analyze'   // image file in → data (metadata, colors) out
  | 'file-transform'  // file(s) in → file out (pdf/audio/video/docx)
  | 'generate-text'   // options in → generated text out
  | 'generate-image'  // options in → generated image out
  | 'generate-file'   // options in → generated downloadable file out
  | 'ai-text'         // options/text in → AI-written text out
  | 'interactive';    // live tool — device, game, editor, tester

export const ARCHETYPES: Record<Archetype, ToolIO> = {
  'text-transform': {
    input: 'text', inputShape: 'A block of text (or code) pasted into the chat.',
    does: 'Transforms the text — reformat, encode/decode, change case, translate representation.',
    output: 'text', outputShape: 'The transformed text.',
    render: 'inline-text', runnableInChat: false,
  },
  'text-analyze': {
    input: 'text', inputShape: 'A block of text, code, or a data string (JSON/URL/CSV/log line).',
    does: 'Inspects the input and reports facts — counts, validity, parsed fields, a score.',
    output: 'data', outputShape: 'A set of facts: valid/invalid + details, or stats/metrics.',
    render: 'inline-result', runnableInChat: false,
  },
  'number-calc': {
    input: 'numbers', inputShape: 'One or more numbers / measurements (amounts, rates, weights, scores).',
    does: 'Runs a formula over the numbers.',
    output: 'number', outputShape: 'The computed value(s), often with a short breakdown.',
    render: 'inline-result', runnableInChat: false,
  },
  'date-calc': {
    input: 'date', inputShape: 'One or two dates (and sometimes a time).',
    does: 'Computes a date-based result — a span, an age, a projected date.',
    output: 'number', outputShape: 'A duration, age, or resulting date.',
    render: 'inline-result', runnableInChat: false,
  },
  'color-transform': {
    input: 'color', inputShape: 'A color as hex, RGB, HSL, or a CSS name.',
    does: 'Converts the color between formats (or names it).',
    output: 'text', outputShape: 'The same color in the requested format(s), with a swatch.',
    render: 'inline-result', runnableInChat: false,
  },
  'image-convert': {
    input: 'file', inputShape: 'An image file (paperclip attach). Format depends on the tool.',
    does: 'Re-encodes or transforms the image into another format/size.',
    output: 'file', outputShape: 'A converted image file to download.',
    render: 'inline-image', runnableInChat: true,
  },
  'image-analyze': {
    input: 'file', inputShape: 'An image file (paperclip attach).',
    does: 'Reads data out of the image — metadata, colors, dimensions.',
    output: 'data', outputShape: 'Extracted facts about the image.',
    render: 'embed', runnableInChat: false,
  },
  'file-transform': {
    input: 'file', inputShape: 'A file to attach — PDF, audio, video, or image (tool-specific).',
    does: 'Converts, splits, merges, or extracts from the file.',
    output: 'file', outputShape: 'A downloadable output file (or files).',
    render: 'embed', runnableInChat: false,
  },
  'generate-text': {
    input: 'options', inputShape: 'Settings only — count, length, charset, type. No user content needed.',
    does: 'Generates text/values deterministically from the options.',
    output: 'text', outputShape: 'The generated string(s) or list.',
    render: 'inline-text', runnableInChat: false,
  },
  'generate-image': {
    input: 'options', inputShape: 'Settings — the content to encode plus style/size options.',
    does: 'Renders an image (code, graphic, or visual) from the options.',
    output: 'image', outputShape: 'A generated image to preview and download.',
    render: 'embed', runnableInChat: false,
  },
  'generate-file': {
    input: 'options', inputShape: 'Form fields — the document/data content and layout options.',
    does: 'Builds a downloadable document or data file from the fields.',
    output: 'file', outputShape: 'A downloadable file (PDF, CSV, ICS, docx…).',
    render: 'embed', runnableInChat: false,
  },
  'ai-text': {
    input: 'text', inputShape: 'A prompt, topic, or keywords — plus optional style/length.',
    does: 'Writes original text from the prompt (creative or drafted content).',
    output: 'text', outputShape: 'Generated prose — a story, poem, bio, headline, etc.',
    render: 'embed', runnableInChat: false,
  },
  'interactive': {
    input: 'none', inputShape: 'Nothing to paste — the tool is used live (device access, a game, a visual editor, a timed test).',
    does: 'Runs an interactive session the user drives directly.',
    output: 'interactive', outputShape: 'Live, on-screen — no static result to hand back.',
    render: 'embed', runnableInChat: false,
  },
};

// --- slug → archetype: every tool classified ---------------------------------
// Grouped by archetype for compact authoring. Coverage is asserted below.

const BY_ARCHETYPE: Record<Archetype, string[]> = {
  'text-transform': [
    'case-converter', 'base64-encoder', 'url-encoder', 'html-entity', 'json-formatter',
    'line-tools', 'slug-generator', 'markdown-previewer', 'number-base-converter',
    'json-converter', 'morse-code-translator', 'unicode-converter', 'ascii-art-generator',
    'binary-converter', 'hex-converter', 'roman-numeral-converter', 'number-to-words',
    'fraction-to-decimal', 'scientific-notation-converter', 'sql-formatter', 'curl-to-code',
    'json-to-typescript', 'js-beautifier', 'text-encoding-converter', 'css-to-scss',
    'ip-address-converter', 'coordinate-converter', 'jwt-decoder', 'timestamp-converter',
    'date-format-converter', 'px-to-rem', 'xml-formatter', 'html-formatter', 'css-formatter',
    'yaml-formatter', 'javascript-formatter', 'csv-formatter', 'markdown-formatter',
    'yaml-to-json-converter', 'csv-to-json-converter', 'json-to-csv-converter',
    'xml-to-json-converter', 'markdown-to-html-converter', 'html-to-markdown-converter',
    'toml-to-json-converter', 'rust-formatter', 'discord-time-converter',
    'typegrow-linkedin-formatter', 'small-text-generator', 'text-diff',
  ],
  'text-analyze': [
    'word-counter', 'regex-tester', 'email-validator', 'json-validator', 'url-validator',
    'phone-number-validator', 'xml-validator', 'sql-validator', 'structured-data-validator',
    'ssn-validator', 'url-parser', 'user-agent-parser', 'query-string-parser', 'csv-parser',
    'log-parser', 'cron-parser', 'text-analyzer', 'password-analyzer', 'sentiment-analyzer',
    'csv-analyzer', 'palindrome-checker', 'readability-checker', 'anagram-checker',
    'reading-time-estimator', 'har-file-analyzer', 'oligo-analyzer', 'color-contrast-analyzer',
    'anagram-generator', 'cryptogram-solver', 'squardle-solver', 'squaredle-solver',
  ],
  'number-calc': [
    'percentage-calculator', 'loan-calculator', 'mortgage-calculator', 'compound-interest-calculator',
    'simple-interest-calculator', 'investment-calculator', 'savings-calculator', 'tip-calculator',
    'discount-calculator', 'sales-tax-calculator', 'bmi-calculator', 'protein-calculator',
    'bmr-calculator', 'calorie-calculator', 'body-fat-calculator', 'ideal-weight-calculator',
    'pace-calculator', 'water-intake-calculator', 'scientific-calculator', 'fraction-calculator',
    'average-calculator', 'standard-deviation-calculator', 'ratio-calculator', 'gcd-lcm-calculator',
    'time-calculator', 'hours-calculator', 'gpa-calculator', 'aft-calculator', 'pft-calculator',
    'creatinine-clearance-calculator', 'peptide-calculator', 'texas-paycheck-calculator',
    'ap-lang-calculator', 'apush-calculator',
    'gold-calculator', 'silver-calculator', 'platinum-calculator', 'dynasty-trade-calculator',
    'retirement-calculator', 'auto-loan-calculator', 'credit-card-payoff-calculator',
    'debt-payoff-calculator', 'inflation-calculator', 'salary-calculator', 'margin-calculator',
    'macro-calculator', 'one-rep-max-calculator', 'sleep-calculator', 'bac-calculator',
    'heart-rate-zone-calculator', 'quadratic-calculator', 'probability-calculator',
    'permutation-combination-calculator', 'triangle-calculator', 'grade-calculator',
    'final-grade-calculator', 'fuel-cost-calculator', 'gematria-calculator', 'unit-converter',
    'aspect-ratio-calculator', 'shoe-size-converter', 'bra-size-converter', 'prime-number-checker',
    'armstrong-number-checker', 'perfect-number-checker', 'project-cost-estimator',
    'calorie-burn-estimator', 'paint-estimator', 'wallpaper-estimator', 'freelance-rate-estimator',
    'ebay-fee-calculator', 'grams-to-cups-converter',
  ],
  'date-calc': [
    'age-calculator', 'due-date-calculator', 'date-difference-calculator', 'ovulation-calculator',
    'timezone-converter', 'leap-year-checker', 'biological-age-calculator',
  ],
  'color-transform': [
    'color-converter', 'hex-to-rgb', 'rgb-to-hex', 'rgb-to-hsl-hsv', 'cmyk-converter', 'color-name',
  ],
  'image-convert': [
    'jpg-to-png', 'png-to-webp', 'webp-to-jpg', 'png-to-jpg', 'jpg-to-webp', 'webp-to-png',
    'svg-to-png', 'bmp-converter', 'ico-converter', 'base64-to-image', 'image-to-base64',
    'heic-to-jpg', 'tiff-converter', 'png-to-svg', 'image-resizer', 'image-compressor',
  ],
  'image-analyze': [
    'image-color-picker', 'image-metadata-analyzer',
  ],
  'file-transform': [
    'image-to-pdf', 'pdf-merge', 'pdf-split', 'pdf-to-jpg', 'pdf-to-text', 'pdf-to-word',
    'pdf-to-excel', 'html-to-pdf', 'video-to-gif', 'gif-to-mp4', 'video-compressor',
    'audio-compressor', 'audio-speed-changer', 'waveform-generator', 'spectrogram-generator',
    'svg-downloader', 'base64-file-downloader', 'pdf-summarizer',
  ],
  'generate-text': [
    'password-generator', 'hash-generator', 'lorem-ipsum', 'uuid-generator', 'random-number',
    'passphrase-generator', 'pin-generator', 'api-key-generator', 'secret-key-generator',
    'random-token-generator', 'jwt-generator', 'totp-generator', 'bcrypt-generator',
    'htpasswd-generator', 'ssh-key-generator', 'ssl-csr-generator', 'upc-generator',
    'isbn-generator', 'gtin-generator', 'imei-generator', 'vin-generator', 'serial-number-generator',
    'sku-generator', 'coupon-code-generator', 'voucher-code-generator', 'fake-name-generator',
    'fake-address-generator', 'fake-phone-generator', 'random-user-profile-generator',
    'company-name-generator', 'username-generator', 'mock-json-generator', 'meta-tag-generator',
    'open-graph-generator', 'robots-txt-generator', 'htaccess-generator', 'mailto-link-generator',
    'gitignore-generator', 'cron-generator', 'regex-generator', 'html-table-generator',
    'markdown-table-generator', 'schema-markup-generator', 'hashtag-generator',
    'random-word-generator', 'random-sentence-generator', 'acronym-generator', 'nickname-generator',
    'random-string-generator', 'random-letter-generator', 'name-combiner', 'lucky-number-predictor',
    'gamertag-generator', 'random-date-generator', 'lottery-number-generator', 'pet-name-generator',
    'ambigram-generator', 'pictionary-word-generator',
  ],
  'generate-image': [
    'qr-code-generator', 'barcode-generator', 'data-matrix-generator', 'pdf417-generator',
    'aztec-generator', 'gradient-generator', 'box-shadow-generator', 'border-radius-generator',
    'glassmorphism-generator', 'css-animation-generator', 'media-query-generator',
    'flexbox-generator', 'svg-wave-generator', 'blob-generator', 'color-palette-generator',
    'pattern-generator', 'favicon-generator', 'placeholder-image-generator', 'avatar-generator',
    'banner-generator', 'signature-generator', 'business-card-generator', 'code-snippet-generator',
    'logo-generator', 'square-face-generator', 'word-cloud-maker', 'chart-maker',
  ],
  'generate-file': [
    'invoice-generator', 'receipt-generator', 'purchase-order-generator', 'certificate-generator',
    'terms-conditions-generator', 'privacy-policy-generator', 'pdf-generator',
    'csv-test-data-generator', 'fake-id-generator', 'email-signature-creator',
    'ics-calendar-downloader', 'subtitle-maker', 'audio-tone-generator',
  ],
  'ai-text': [
    'headline-generator', 'brand-name-generator', 'domain-name-generator', 'slogan-generator',
    'story-generator', 'poem-generator', 'bio-generator', 'excuse-generator',
    'insult-compliment-generator', 'trivia-generator', 'recipe-generator', 'workout-generator',
    'career-predictor', 'recipe-idea-generator',
  ],
  'interactive': [
    // Device / sensor access — needs live hardware, can't run from pasted input.
    'text-to-speech', 'speech-to-text', 'internet-speed-test', 'gps-speedometer', 'dpi-analyzer',
    'screen-tester', 'keyboard-tester', 'color-blindness-tester', 'typing-speed-tester',
    'reaction-time-tester', 'click-speed-tester', 'music-analyzer', 'bpm-analyzer',
    // Live prices / network lookups.
    'currency-converter', 'crypto-converter', 'sitemap-generator',
    // Games, simulators, fun spinners.
    'dice-roller', 'coin-flip', 'random-picker', 'team-generator', 'probability-simulator',
    'roulette-simulator', 'slot-machine-simulator', 'monty-hall-simulator', 'savings-goal-simulator',
    'kanoodle-solver', 'pokemon-generator', 'pokemon-team-planner', 'pokemon-team-builder',
    'tarot-card-generator', 'random-animal-generator', 'zodiac-generator', 'emoji-generator',
    'gender-predictor', 'love-predictor', 'life-expectancy-predictor', 'child-height-predictor',
    'fake-email-generator',
    // Visual editors / builders — drag-and-drop, needs the live canvas.
    'collage-maker', 'meme-generator', 'gif-maker', 'sticker-maker', 'watermark-generator',
    'sprite-sheet-maker', 'timeline-creator', 'gantt-chart-creator',
    'org-chart-creator', 'checklist-creator', 'seating-chart-creator', 'pride-pfp-maker',
  ],
};

// Invert to slug → archetype. A slug listed under two archetypes is a bug the
// self-check catches.
const TOOL_ARCHETYPE: Record<string, Archetype> = {};
for (const [arch, slugs] of Object.entries(BY_ARCHETYPE) as [Archetype, string[]][])
  for (const slug of slugs) TOOL_ARCHETYPE[slug] = arch;

// --- per-tool overrides: only where the archetype default needs sharpening ---
// Partial — merged over the archetype contract. Add entries sparingly.
const OVERRIDES: Record<string, Partial<ToolIO>> = {
  // The 6 canvas image conversions + pdf-to-jpg actually run inline in chat today.
  'jpg-to-png': { does: 'Re-encodes a JPEG as lossless PNG.' },
  'png-to-jpg': { does: 'Flattens and re-encodes a PNG as JPEG (quality adjustable).' },
  'png-to-webp': { does: 'Re-encodes a PNG as WebP (quality adjustable).' },
  'jpg-to-webp': { does: 'Re-encodes a JPEG as WebP (quality adjustable).' },
  'webp-to-png': { does: 'Re-encodes a WebP as lossless PNG.' },
  'webp-to-jpg': { does: 'Flattens and re-encodes a WebP as JPEG (quality adjustable).' },
  'pdf-to-jpg': {
    inputShape: 'A PDF file (paperclip attach).',
    does: 'Renders each PDF page to a JPG or PNG image.',
    output: 'image', outputShape: 'One image per page, each downloadable.',
    render: 'inline-image', runnableInChat: true,
  },
  // Multi-file inputs — the AI must ask for more than one.
  'pdf-merge': { input: 'files', inputShape: 'Two or more PDF files to attach, in order.' },
  'image-to-pdf': { input: 'files', inputShape: 'One or more JPG/PNG images to attach.' },
  // PDF in, but the output is an AI-written recap, not a file.
  'pdf-summarizer': {
    inputShape: 'A PDF file (paperclip attach).',
    does: 'Reads the PDF and writes a short, faithful summary.',
    output: 'text', outputShape: 'A few paragraphs summarizing the document.',
    render: 'embed',
  },
  // Not a generated string — a real disposable inbox the user watches live.
  'fake-email-generator': {
    inputShape: 'Nothing — it hands you a throwaway address and shows incoming mail live.',
    does: 'Creates a disposable inbox that actually receives email.',
    outputShape: 'A live inbox address plus arriving messages.',
  },
  // Validators return a verdict, not just stats — make that explicit.
  'json-validator': { does: 'Checks JSON syntax and pinpoints the first error.', outputShape: 'Valid/invalid + error location.' },
  'email-validator': { does: 'Checks syntax, MX/DNS, disposable and role addresses.', outputShape: 'Valid/invalid + per-check details.' },
};

// --- public API --------------------------------------------------------------

/** The I/O contract for a tool slug, or null if the slug is unknown. */
export function getToolIO(slug: string): ToolIO | null {
  const arch = TOOL_ARCHETYPE[slug];
  if (!arch) return null;
  return { ...ARCHETYPES[arch], ...OVERRIDES[slug] };
}

/** The archetype a tool belongs to (null if unknown). */
export function getArchetype(slug: string): Archetype | null {
  return TOOL_ARCHETYPE[slug] ?? null;
}

// --- dev self-check: coverage is the whole point ------------------------------
// Asserts every tool in tools.ts is classified exactly once, and no override
// targets an unknown slug. If this fires, a new tool was added without an I/O
// contract — the router would treat it as unroutable.
if (import.meta.env.DEV) {
  const missing = tools.filter((t) => !TOOL_ARCHETYPE[t.slug]).map((t) => t.slug);
  console.assert(missing.length === 0, `tool-io: unclassified tools (add to BY_ARCHETYPE): ${missing.join(', ')}`);

  const known = new Set(tools.map((t) => t.slug));
  const ghosts = Object.keys(TOOL_ARCHETYPE).filter((s) => !known.has(s));
  console.assert(ghosts.length === 0, `tool-io: classified slugs not in tools.ts (stale, remove): ${ghosts.join(', ')}`);

  const dupes = Object.values(BY_ARCHETYPE).flat().filter((s, i, a) => a.indexOf(s) !== i);
  console.assert(dupes.length === 0, `tool-io: slugs classified under more than one archetype: ${[...new Set(dupes)].join(', ')}`);

  const badOverrides = Object.keys(OVERRIDES).filter((s) => !TOOL_ARCHETYPE[s]);
  console.assert(badOverrides.length === 0, `tool-io: overrides for unclassified slugs: ${badOverrides.join(', ')}`);
}
