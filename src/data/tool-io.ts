
import { tools } from './tools';

export type InputType =
  | 'text'    
  | 'file'    
  | 'files'   
  | 'numbers' 
  | 'date'    
  | 'color'   
  | 'options' 
  | 'none';   

export type OutputType =
  | 'text'        
  | 'data'        
  | 'number'      
  | 'image'       
  | 'file'        
  | 'interactive';

export type RenderMode =
  | 'inline-text'   
  | 'inline-result' 
  | 'inline-image'  
  | 'inline-file'   
  | 'embed'         
  | 'link';         

export interface ToolIO {
  input: InputType;
  inputShape: string;
  does: string;
  output: OutputType;
  outputShape: string;
  render: RenderMode;
  runnableInChat: boolean;
}


export type Archetype =
  | 'text-transform'  
  | 'text-analyze'    
  | 'number-calc'     
  | 'date-calc'       
  | 'color-transform' 
  | 'image-convert'   
  | 'image-analyze'   
  | 'file-transform'  
  | 'generate-text'   
  | 'generate-image'  
  | 'generate-file'   
  | 'ai-text'         
  | 'interactive';    

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
    'txt-to-word', 'txt-to-docx', 'txt-to-pdf', 'txt-to-odt', 'txt-to-json', 'txt-to-html', 'txt-to-xml', 'txt-to-markdown', 'txt-to-rtf', 'txt-to-xlsx', 'txt-to-sql', 'txt-to-base64', 'txt-to-png', 'txt-to-jpg', 'txt-to-qr-code', 'txt-to-epub', 'markdown-to-word', 'markdown-to-pdf', 'csv-to-pdf', 'csv-to-xml', 'csv-to-sql', 'csv-to-html', 'csv-to-word', 'csv-to-markdown', 'csv-to-tsv', 'csv-to-yaml', 'csv-to-txt', 'csv-to-vcard',
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
    'jpg-to-word', 'jpg-to-excel', 'jpg-to-powerpoint', 'jpg-to-svg', 'jpg-to-bmp', 'jpg-to-tiff', 'jpg-to-ico', 'jpg-to-psd', 'jpg-to-html', 'bmp-to-jpg', 'bmp-to-png', 'bmp-to-webp', 'bmp-to-gif', 'bmp-to-pdf', 'bmp-to-ico', 'bmp-to-svg', 'bmp-to-tiff', 'bmp-to-base64', 'bmp-batch', 'jfif-to-jpg', 'jfif-to-png', 'jfif-to-webp', 'jfif-to-gif', 'jfif-to-bmp', 'jfif-to-ico', 'jfif-to-pdf', 'jfif-to-svg', 'jfif-to-tiff', 'jfif-to-psd', 'jfif-to-avif', 'jfif-to-base64',
  ],
  'image-analyze': [
    'image-color-picker', 'image-metadata-analyzer',
  ],
  'file-transform': [
    'image-to-pdf', 'pdf-merge', 'pdf-split', 'pdf-to-jpg', 'pdf-to-text', 'pdf-to-word',
    'pdf-to-excel', 'html-to-pdf', 'video-to-gif', 'gif-to-mp4', 'video-compressor',
    'audio-compressor', 'audio-speed-changer', 'waveform-generator', 'spectrogram-generator',
    'svg-downloader', 'base64-file-downloader', 'pdf-summarizer',
    'ipynb-to-python', 'ipynb-to-html', 'ipynb-to-json', 'ipynb-to-latex', 'ipynb-to-word', 'ipynb-to-pdf', 'epub-to-txt', 'epub-to-html', 'epub-to-pdf', 'epub-to-xml', 'epub-to-csv', 'epub-to-fb2', 'ebook-converter', 'word-to-pdf', 'excel-to-pdf', 'ppt-to-txt', 'ppt-to-word', 'ppt-to-doc', 'ppt-to-html', 'ppt-to-pdf', 'ppt-to-epub', 'pdf-to-csv', 'ofx-to-csv', 'ofx-to-excel', 'ofx-to-qfx', 'ofx-to-qbo', 'ofx-to-pdf', 'qif-to-ofx', 'qif-to-excel', 'iif-to-csv', 'iif-to-excel', 'jpg-to-pdf', 'png-to-pdf',
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
    'text-to-speech', 'speech-to-text', 'internet-speed-test', 'gps-speedometer', 'dpi-analyzer',
    'screen-tester', 'keyboard-tester', 'color-blindness-tester', 'typing-speed-tester',
    'reaction-time-tester', 'click-speed-tester', 'music-analyzer', 'bpm-analyzer',
    'currency-converter', 'crypto-converter', 'sitemap-generator',
    'dice-roller', 'coin-flip', 'random-picker', 'team-generator', 'probability-simulator',
    'roulette-simulator', 'slot-machine-simulator', 'monty-hall-simulator', 'savings-goal-simulator',
    'kanoodle-solver', 'pokemon-generator', 'pokemon-team-planner', 'pokemon-team-builder',
    'tarot-card-generator', 'random-animal-generator', 'zodiac-generator', 'emoji-generator',
    'gender-predictor', 'love-predictor', 'life-expectancy-predictor', 'child-height-predictor',
    'fake-email-generator',
    'collage-maker', 'meme-generator', 'gif-maker', 'sticker-maker', 'watermark-generator',
    'sprite-sheet-maker', 'timeline-creator', 'gantt-chart-creator',
    'org-chart-creator', 'checklist-creator', 'seating-chart-creator', 'pride-pfp-maker',
  ],
};

const TOOL_ARCHETYPE: Record<string, Archetype> = {};
for (const [arch, slugs] of Object.entries(BY_ARCHETYPE) as [Archetype, string[]][])
  for (const slug of slugs) TOOL_ARCHETYPE[slug] = arch;

const OVERRIDES: Record<string, Partial<ToolIO>> = {
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
  'pdf-merge': { input: 'files', inputShape: 'Two or more PDF files to attach, in order.' },
  'image-to-pdf': { input: 'files', inputShape: 'One or more JPG/PNG images to attach.' },
  'pdf-summarizer': {
    inputShape: 'A PDF file (paperclip attach).',
    does: 'Reads the PDF and writes a short, faithful summary.',
    output: 'text', outputShape: 'A few paragraphs summarizing the document.',
    render: 'embed',
  },
  'fake-email-generator': {
    inputShape: 'Nothing — it hands you a throwaway address and shows incoming mail live.',
    does: 'Creates a disposable inbox that actually receives email.',
    outputShape: 'A live inbox address plus arriving messages.',
  },
  'json-validator': { does: 'Checks JSON syntax and pinpoints the first error.', outputShape: 'Valid/invalid + error location.' },
  'email-validator': { does: 'Checks syntax, MX/DNS, disposable and role addresses.', outputShape: 'Valid/invalid + per-check details.' },
  'txt-to-word': { output: 'file', outputShape: 'A downloadable a Word .docx.', render: 'inline-file', runnableInChat: true },
  'txt-to-docx': { output: 'file', outputShape: 'A downloadable a Word .docx.', render: 'inline-file', runnableInChat: true },
  'txt-to-pdf': { output: 'file', outputShape: 'A downloadable a PDF.', render: 'inline-file', runnableInChat: true },
  'txt-to-odt': { output: 'file', outputShape: 'A downloadable an ODT document.', render: 'inline-file', runnableInChat: true },
  'txt-to-rtf': { output: 'file', outputShape: 'A downloadable an RTF document.', render: 'inline-file', runnableInChat: true },
  'txt-to-xlsx': { output: 'file', outputShape: 'A downloadable an Excel .xlsx.', render: 'inline-file', runnableInChat: true },
  'txt-to-epub': { output: 'file', outputShape: 'A downloadable an EPUB ebook.', render: 'inline-file', runnableInChat: true },
  'txt-to-png': { output: 'file', outputShape: 'A downloadable a PNG image.', render: 'inline-file', runnableInChat: true },
  'txt-to-jpg': { output: 'file', outputShape: 'A downloadable a JPG image.', render: 'inline-file', runnableInChat: true },
  'txt-to-qr-code': { output: 'file', outputShape: 'A downloadable a QR code image.', render: 'inline-file', runnableInChat: true },
  'markdown-to-word': { output: 'file', outputShape: 'A downloadable a Word .docx.', render: 'inline-file', runnableInChat: true },
  'markdown-to-pdf': { output: 'file', outputShape: 'A downloadable a PDF.', render: 'inline-file', runnableInChat: true },
  'csv-to-pdf': { output: 'file', outputShape: 'A downloadable a PDF.', render: 'inline-file', runnableInChat: true },
  'csv-to-word': { output: 'file', outputShape: 'A downloadable a Word .docx.', render: 'inline-file', runnableInChat: true },
  'csv-to-vcard': { output: 'file', outputShape: 'A downloadable vCard contacts.', render: 'inline-file', runnableInChat: true },
  'ipynb-to-python': { output: 'text', outputShape: 'Extracted Python source.', render: 'inline-text', runnableInChat: true },
  'ipynb-to-html': { output: 'text', outputShape: 'Extracted an HTML document.', render: 'inline-text', runnableInChat: true },
  'ipynb-to-json': { output: 'text', outputShape: 'Extracted formatted JSON.', render: 'inline-text', runnableInChat: true },
  'ipynb-to-latex': { output: 'text', outputShape: 'Extracted a LaTeX document.', render: 'inline-text', runnableInChat: true },
  'epub-to-txt': { output: 'text', outputShape: 'Extracted plain text.', render: 'inline-text', runnableInChat: true },
  'epub-to-html': { output: 'text', outputShape: 'Extracted an HTML document.', render: 'inline-text', runnableInChat: true },
  'epub-to-xml': { output: 'text', outputShape: 'Extracted an XML document.', render: 'inline-text', runnableInChat: true },
  'epub-to-csv': { output: 'text', outputShape: 'Extracted CSV rows.', render: 'inline-text', runnableInChat: true },
  'ebook-converter': { output: 'text', outputShape: 'Extracted readable text.', render: 'inline-text', runnableInChat: true },
  'ppt-to-txt': { output: 'text', outputShape: 'Extracted plain text.', render: 'inline-text', runnableInChat: true },
  'ppt-to-html': { output: 'text', outputShape: 'Extracted an HTML document.', render: 'inline-text', runnableInChat: true },
  'pdf-to-csv': { output: 'text', outputShape: 'Extracted CSV rows.', render: 'inline-text', runnableInChat: true },
  'ofx-to-csv': { output: 'text', outputShape: 'Extracted CSV rows.', render: 'inline-text', runnableInChat: true },
  'iif-to-csv': { output: 'text', outputShape: 'Extracted CSV rows.', render: 'inline-text', runnableInChat: true },
  'txt-to-json': { runnableInChat: true },
  'txt-to-html': { runnableInChat: true },
  'txt-to-xml': { runnableInChat: true },
  'txt-to-markdown': { runnableInChat: true },
  'txt-to-sql': { runnableInChat: true },
  'txt-to-base64': { runnableInChat: true },
  'csv-to-xml': { runnableInChat: true },
  'csv-to-sql': { runnableInChat: true },
  'csv-to-html': { runnableInChat: true },
  'csv-to-markdown': { runnableInChat: true },
  'csv-to-tsv': { runnableInChat: true },
  'csv-to-yaml': { runnableInChat: true },
  'csv-to-txt': { runnableInChat: true },
  'ipynb-to-word': { runnableInChat: true },
  'ipynb-to-pdf': { runnableInChat: true },
  'epub-to-pdf': { runnableInChat: true },
  'epub-to-fb2': { runnableInChat: true },
  'word-to-pdf': { runnableInChat: true },
  'excel-to-pdf': { runnableInChat: true },
  'ppt-to-word': { runnableInChat: true },
  'ppt-to-doc': { runnableInChat: true },
  'ppt-to-pdf': { runnableInChat: true },
  'ppt-to-epub': { runnableInChat: true },
  'ofx-to-excel': { runnableInChat: true },
  'ofx-to-qfx': { runnableInChat: true },
  'ofx-to-qbo': { runnableInChat: true },
  'ofx-to-pdf': { runnableInChat: true },
  'qif-to-ofx': { runnableInChat: true },
  'qif-to-excel': { runnableInChat: true },
  'iif-to-excel': { runnableInChat: true },
  'jpg-to-pdf': { runnableInChat: true },
  'png-to-pdf': { runnableInChat: true },
  'jpg-to-word': { runnableInChat: true },
  'jpg-to-excel': { runnableInChat: true },
  'jpg-to-powerpoint': { runnableInChat: true },
  'jpg-to-svg': { runnableInChat: true },
  'jpg-to-bmp': { runnableInChat: true },
  'jpg-to-tiff': { runnableInChat: true },
  'jpg-to-ico': { runnableInChat: true },
  'jpg-to-psd': { runnableInChat: true },
  'jpg-to-html': { runnableInChat: true },
  'bmp-to-jpg': { runnableInChat: true },
  'bmp-to-png': { runnableInChat: true },
  'bmp-to-webp': { runnableInChat: true },
  'bmp-to-gif': { runnableInChat: true },
  'bmp-to-pdf': { runnableInChat: true },
  'bmp-to-ico': { runnableInChat: true },
  'bmp-to-svg': { runnableInChat: true },
  'bmp-to-tiff': { runnableInChat: true },
  'bmp-to-base64': { runnableInChat: true },
  'bmp-batch': { runnableInChat: true },
  'jfif-to-jpg': { runnableInChat: true },
  'jfif-to-png': { runnableInChat: true },
  'jfif-to-webp': { runnableInChat: true },
  'jfif-to-gif': { runnableInChat: true },
  'jfif-to-bmp': { runnableInChat: true },
  'jfif-to-ico': { runnableInChat: true },
  'jfif-to-pdf': { runnableInChat: true },
  'jfif-to-svg': { runnableInChat: true },
  'jfif-to-tiff': { runnableInChat: true },
  'jfif-to-psd': { runnableInChat: true },
  'jfif-to-avif': { runnableInChat: true },
  'jfif-to-base64': { runnableInChat: true },
};


export function getToolIO(slug: string): ToolIO | null {
  const arch = TOOL_ARCHETYPE[slug];
  if (!arch) return null;
  return { ...ARCHETYPES[arch], ...OVERRIDES[slug] };
}

export function getArchetype(slug: string): Archetype | null {
  return TOOL_ARCHETYPE[slug] ?? null;
}

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
