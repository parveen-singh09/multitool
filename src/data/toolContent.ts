// Rich per-tool content: unique How-to steps, an explainer, and a real FAQ.
// This is the AdSense "low value content" fix — each entry must be GENUINELY
// unique prose, not a filled-in template, or Google flags it as scaled content
// again. ToolLayout renders whatever's here and pushes FAQPage schema; a slug
// with no entry renders exactly as before. Extend in batches.
export interface Faq { q: string; a: string; }
export interface ToolContent {
  // Extra explainer paragraphs, shown under an "About" heading.
  body?: string[];
  // "How to use" numbered steps.
  steps?: string[];
  // Real questions a visitor actually asks. 3–5 each.
  faqs?: Faq[];
}

export const TOOL_CONTENT: Record<string, ToolContent> = {
  'jpg-to-png': {
    body: [
      'JPG (JPEG) is a lossy format built for photographs — it throws away detail to keep files small, and it cannot store transparency. PNG is lossless and supports an alpha channel, so it is the right choice when you need a transparent background, crisp edges on text and logos, or an image you will edit repeatedly without compounding compression damage.',
      'Converting a JPG to PNG will not recover detail the JPEG already discarded, and the PNG will usually be larger because it stores every pixel exactly. The reason to convert is compatibility and editing headroom — a PNG you can drop onto any background, feed to a design tool, or re-export without generation loss.',
    ],
    steps: [
      'Drop your JPG onto the box above, or click to pick a file from your device.',
      'The image is decoded in your browser and re-encoded as PNG — nothing is uploaded to a server.',
      'Preview the result, then click Download to save the .png file.',
    ],
    faqs: [
      { q: 'Does converting to PNG improve image quality?', a: 'No. A PNG cannot restore detail that JPEG compression already removed. It preserves the pixels the JPG contains exactly and stops further quality loss from re-saving, but it will not sharpen or clean up a blurry or blocky JPEG.' },
      { q: 'Why is my PNG file larger than the JPG?', a: 'PNG is lossless — it stores every pixel without discarding data — so photographs almost always come out larger than their JPEG version. That is expected. Use PNG when you need transparency or lossless editing, and keep JPG when small file size matters most.' },
      { q: 'Will the converted PNG have a transparent background?', a: 'No. A JPG has no transparency to begin with, so the PNG keeps the solid background the photo already has. To actually remove a background you need a background-removal tool, not a format conversion.' },
      { q: 'Are my files uploaded anywhere?', a: 'No. The conversion runs entirely in your browser using the canvas API. Your image never leaves your device, so it works offline once the page has loaded and is safe for private files.' },
    ],
  },

  'png-to-jpg': {
    body: [
      'PNG stores images losslessly and supports transparency, which makes it perfect for logos and screenshots but heavy for photographs. JPG uses lossy compression tuned for photos, producing much smaller files — often a fraction of the PNG size — at a quality most people cannot distinguish by eye.',
      'One thing to know before converting: JPG has no transparency. Any transparent areas in the PNG have to be filled with a solid colour (white by default) when the file is flattened to JPEG. If a hard edge or transparent cut-out matters to you, keep the PNG.',
    ],
    steps: [
      'Add your PNG using the box above.',
      'Choose a quality level if the tool offers a slider — higher keeps more detail, lower makes a smaller file.',
      'Transparent pixels are flattened onto a solid background, then the image is encoded as JPG.',
      'Download the finished .jpg.',
    ],
    faqs: [
      { q: 'What happens to transparency when I convert PNG to JPG?', a: 'JPG does not support transparency, so any transparent regions are filled with a solid background colour (usually white) during conversion. If preserving transparency matters, use PNG or WebP instead.' },
      { q: 'How much smaller will the JPG be?', a: 'For photographs, JPG is typically 5–10× smaller than the equivalent PNG at a visually similar quality. For flat graphics like logos or screenshots the saving is smaller, and PNG may even stay competitive.' },
      { q: 'Is converting PNG to JPG lossy?', a: 'Yes. JPEG compression discards some detail to shrink the file, so a converted JPG is not a pixel-perfect copy. At high quality settings the difference is hard to see, but avoid repeatedly re-saving the same image as JPG.' },
      { q: 'Does this upload my image?', a: 'No. Everything runs locally in your browser. The PNG is read, converted, and offered as a download without ever being sent to a server.' },
    ],
  },

  'jpg-to-webp': {
    body: [
      'WebP is a modern image format from Google that typically produces files 25–35% smaller than JPEG at the same visual quality, thanks to more advanced compression. Smaller images mean faster-loading pages, which is why WebP is now the default choice for photos on the web and is supported by every current browser.',
      'Because WebP supports both lossy and lossless modes plus transparency, it is a genuine upgrade over JPG for web use. The main reason to keep a JPG is when you need to hand the file to older software or a print workflow that does not recognise WebP.',
    ],
    steps: [
      'Select or drop your JPG into the box above.',
      'Adjust the quality slider — around 80 is a good balance of size and clarity for photos.',
      'The image is re-encoded to WebP in your browser using the canvas API.',
      'Preview and download the .webp file.',
    ],
    faqs: [
      { q: 'Is WebP better than JPG?', a: 'For the web, usually yes — WebP delivers similar quality at a noticeably smaller file size, which speeds up page loads. JPG remains more universally supported by older desktop software and print tools.' },
      { q: 'Do all browsers support WebP?', a: 'Yes. Every current version of Chrome, Firefox, Safari, and Edge displays WebP images. Only very old browsers lack support, which is rarely a concern today.' },
      { q: 'Will converting to WebP reduce quality?', a: 'At the same quality setting WebP looks comparable to JPG while being smaller. Choosing a very low quality value will introduce visible artefacts, so keep the slider around 75–85 for photos.' },
      { q: 'Is my photo uploaded to convert it?', a: 'No. The conversion happens entirely in your browser, so the file stays on your device and the tool works even without an internet connection after loading.' },
    ],
  },

  'webp-to-png': {
    body: [
      'WebP is excellent for shipping images on the web, but not every program accepts it — some older editors, document tools, and operating-system previews still expect PNG or JPG. Converting WebP to PNG gives you a lossless, universally readable file that keeps any transparency the WebP had.',
      'PNG is the safer target when transparency matters, because it preserves the alpha channel exactly. If you do not need transparency and want the smallest possible file, converting to JPG instead will save space.',
    ],
    steps: [
      'Drop your WebP file into the box above.',
      'The browser decodes it and re-encodes it losslessly as PNG.',
      'Transparency is preserved automatically.',
      'Download the resulting .png.',
    ],
    faqs: [
      { q: 'Does WebP to PNG keep transparency?', a: 'Yes. PNG supports an alpha channel, so any transparency in the WebP is carried over intact to the converted PNG.' },
      { q: 'Why would I convert WebP back to PNG?', a: 'Compatibility. Some older applications, editors, and workflows do not read WebP, whereas PNG is accepted almost everywhere and is lossless, making it a safe universal format.' },
      { q: 'Is the conversion lossless?', a: 'Yes. PNG stores pixels without further compression loss. The PNG will usually be larger than the WebP because WebP compresses more aggressively.' },
      { q: 'Are my files sent to a server?', a: 'No. The whole process runs in your browser, so your image never leaves your device.' },
    ],
  },

  'heic-to-jpg': {
    body: [
      'HEIC is the high-efficiency format iPhones and iPads use to save photos — it stores great-looking images in about half the space of JPEG. The trade-off is compatibility: many Windows programs, websites, and older devices cannot open a .heic file directly, which is why converting to JPG is so common.',
      'JPG is the universal photo format. Converting a HEIC to JPG produces a file that opens on any device or app, at the cost of a somewhat larger size and JPEG\'s lossy compression. The visible quality difference is minimal for everyday photos.',
    ],
    steps: [
      'Add your HEIC photo using the box above.',
      'The tool decodes the HEIC in your browser and re-encodes it as a standard JPG.',
      'Wait a moment — HEIC decoding is more work than ordinary formats.',
      'Download the .jpg, ready to use anywhere.',
    ],
    faqs: [
      { q: 'Why can\'t I open HEIC files on Windows?', a: 'HEIC is Apple\'s default photo format and older Windows versions lack the codec to display it without an add-on. Converting to JPG produces a file Windows and virtually every other program can open natively.' },
      { q: 'Does converting HEIC to JPG lose quality?', a: 'JPG is lossy, so there is a small amount of quality loss during conversion, but for normal photos it is not noticeable. The JPG will typically be larger than the original HEIC because HEIC compresses more efficiently.' },
      { q: 'Can I convert several HEIC photos at once?', a: 'This page converts one photo at a time in your browser. For a whole album, convert them individually, or use the general file converter if batch handling is available.' },
      { q: 'Are my photos private?', a: 'Yes. Conversion runs entirely on your device in the browser — your photos are never uploaded, which matters for personal images.' },
    ],
  },

  'image-compressor': {
    body: [
      'Image compression reduces a file\'s size so pages load faster and uploads finish sooner. Most photos carry far more data than a screen actually needs, so trimming that excess — by lowering JPEG quality slightly or stripping metadata — can cut file size dramatically with little or no visible change.',
      'There is always a trade-off between size and quality. Aggressive compression introduces blocky artefacts and soft edges; gentle compression is invisible. The right level depends on use: an email attachment or web thumbnail tolerates more compression than a print master.',
    ],
    steps: [
      'Drop the image you want to shrink into the box above.',
      'Choose a quality or target size — lower quality means a smaller file.',
      'Compare the before-and-after preview to check the result still looks good.',
      'Download the compressed image.',
    ],
    faqs: [
      { q: 'How much can I compress an image without it looking bad?', a: 'For most photos, a JPEG quality around 70–80% removes a lot of file size while staying visually indistinguishable from the original. Below about 50% you start to see blocky artefacts, especially in smooth gradients.' },
      { q: 'Does compressing change the image dimensions?', a: 'No. Compression reduces file size by simplifying the data, not by shrinking width and height. To reduce dimensions use an image resizer instead — combining both gives the smallest files.' },
      { q: 'Is compression reversible?', a: 'Lossy compression is not reversible — the discarded detail is gone for good. Always keep your original if you might need the full-quality version later.' },
      { q: 'Are my images uploaded?', a: 'No. Compression happens in your browser, so the file never leaves your device and the tool works offline once loaded.' },
    ],
  },

  'image-resizer': {
    body: [
      'Resizing changes an image\'s pixel dimensions — its width and height — which is different from compression. You resize to fit a specific slot: a profile photo that must be 400×400, a banner capped at 1920px wide, or a photo that needs to be under a forum\'s dimension limit.',
      'Making an image smaller is safe and usually improves file size. Enlarging beyond the original dimensions cannot add real detail, so upscaled images look soft or pixelated. Keeping the aspect ratio locked avoids stretching, which distorts faces and shapes.',
    ],
    steps: [
      'Add your image using the box above.',
      'Enter a new width or height. Keep the aspect-ratio lock on to avoid distortion.',
      'The browser redraws the image at the new size.',
      'Download the resized image.',
    ],
    faqs: [
      { q: 'What is the difference between resizing and compressing?', a: 'Resizing changes the pixel dimensions (width × height), while compressing reduces file size by simplifying the image data at the same dimensions. Doing both together produces the smallest usable files.' },
      { q: 'Can I make a small image larger without losing quality?', a: 'Not really. Enlarging cannot invent detail that was never captured, so upscaled images look soft or blocky. Resizing down is lossless in appearance; resizing up rarely is.' },
      { q: 'How do I keep the image from looking stretched?', a: 'Keep the aspect-ratio lock enabled so width and height scale together. Changing only one dimension without the lock squashes or stretches the image.' },
      { q: 'Is my photo sent to a server?', a: 'No. Resizing is done in your browser with the canvas API, so your image stays private on your device.' },
    ],
  },

  'image-to-pdf': {
    body: [
      'Turning images into a PDF is the easiest way to bundle photos or scans into one tidy, shareable document. A PDF keeps every page in order, opens identically on any device, and is the format most people expect when you send a receipt, a signed form, or a set of scanned pages.',
      'This tool assembles your images into a single PDF in the browser, one image per page, without uploading anything. It is ideal for combining photographed documents, receipts, or ID scans into one file you can email or print.',
    ],
    steps: [
      'Add one or more images using the box above.',
      'Arrange them in the order you want the pages to appear.',
      'The images are placed into a multi-page PDF, one per page.',
      'Download the finished PDF.',
    ],
    faqs: [
      { q: 'Can I combine multiple images into one PDF?', a: 'Yes. Add several images and each becomes a page in a single PDF, in the order you arrange them — perfect for scanned documents or a set of receipts.' },
      { q: 'What image formats can I turn into a PDF?', a: 'Common formats like JPG, PNG, and WebP work directly. Each image is placed on its own page at its native proportions.' },
      { q: 'Will the PDF reduce my image quality?', a: 'The images are embedded as-is, so quality is preserved. The PDF file size roughly reflects the combined size of the images you add.' },
      { q: 'Are my images uploaded to make the PDF?', a: 'No. The PDF is built entirely in your browser, so your images and the resulting document never leave your device.' },
    ],
  },

  'pdf-merge': {
    body: [
      'Merging combines several PDFs into one file in the order you choose — handy for assembling a contract with its appendices, stitching scanned pages into a single document, or bundling reports before sending them on. One file is easier to share, store, and print than a scattered set.',
      'This merger runs in your browser using pdf-lib, so your documents are never uploaded. That makes it safe for contracts, statements, and other sensitive PDFs you would not want passing through a third-party server.',
    ],
    steps: [
      'Add the PDF files you want to combine.',
      'Drag them into the order you want — the first file\'s pages come first.',
      'The tool concatenates all pages into one document.',
      'Download the merged PDF.',
    ],
    faqs: [
      { q: 'Does merging PDFs change their quality?', a: 'No. Merging copies the original pages into a new file without re-compressing them, so text stays sharp and images keep their quality.' },
      { q: 'Can I reorder the files before merging?', a: 'Yes. Arrange the files in any order before merging and the final PDF follows that sequence exactly.' },
      { q: 'Is there a limit on how many PDFs I can merge?', a: 'There is no fixed limit, but because everything runs in your browser, very large combinations depend on your device\'s available memory.' },
      { q: 'Are my documents uploaded?', a: 'No. Merging happens locally with pdf-lib, so your PDFs never leave your device — important for confidential files.' },
    ],
  },

  'pdf-split': {
    body: [
      'Splitting a PDF lets you pull out the pages you actually need — extract a single chapter, separate a signed page from a long contract, or break a bulky scan into smaller files. It is the counterpart to merging and just as common in everyday document work.',
      'Because the split runs entirely in your browser, the original never leaves your device. You choose which pages or ranges to keep, and the tool writes new PDF files containing only those pages.',
    ],
    steps: [
      'Add the PDF you want to split.',
      'Choose the page or page range to extract.',
      'The tool creates a new PDF containing just those pages.',
      'Download the extracted PDF.',
    ],
    faqs: [
      { q: 'Can I extract just one page from a PDF?', a: 'Yes. Specify a single page and the tool produces a new PDF containing only that page, leaving the original untouched.' },
      { q: 'Does splitting reduce quality?', a: 'No. The selected pages are copied exactly as they are, so text and images keep their original quality.' },
      { q: 'Can I split into several separate files at once?', a: 'You can extract page ranges to create the pieces you need. Repeat the process for each range you want as its own file.' },
      { q: 'Is my PDF uploaded?', a: 'No. Splitting is done in your browser, so the document stays private on your device.' },
    ],
  },

  'pdf-to-jpg': {
    body: [
      'Converting PDF pages to JPG turns a document into ordinary images — useful when you need to post a page as a picture, insert it into a slide deck, or share it where PDFs are awkward. Each page becomes its own JPG at the resolution you need.',
      'The pages are rendered in your browser with pdf.js and captured as images, so nothing is uploaded. Text becomes part of the image and is no longer selectable, which is exactly what you want when the goal is a shareable picture rather than an editable document.',
    ],
    steps: [
      'Add your PDF using the box above.',
      'The tool renders each page to a canvas in your browser.',
      'Each rendered page is exported as a JPG image.',
      'Download the images.',
    ],
    faqs: [
      { q: 'Will the text still be selectable after converting to JPG?', a: 'No. A JPG is a flat image, so text becomes pixels and can no longer be selected or searched. If you need selectable text, keep the PDF or use a PDF-to-text tool.' },
      { q: 'What resolution are the JPG images?', a: 'Pages are rendered at a screen-friendly resolution suitable for sharing and slides. Higher resolutions produce sharper but larger images.' },
      { q: 'Does each page become a separate image?', a: 'Yes. Every page in the PDF is rendered as its own JPG so you can use them individually.' },
      { q: 'Are my documents uploaded?', a: 'No. Rendering happens entirely in your browser with pdf.js, so your PDF never leaves your device.' },
    ],
  },

  'pdf-to-text': {
    body: [
      'This tool pulls the text out of a PDF so you can copy, edit, or search it. For PDFs created from a word processor or export, it reads the embedded text layer directly and quickly. For scanned pages — which are really images of text — it falls back to OCR (optical character recognition) to recognise the words.',
      'OCR is powerful but not perfect: results depend on scan quality, and unusual fonts or handwriting may not read cleanly. For born-digital PDFs the extraction is exact. Everything runs in your browser, including the OCR engine, so your document stays private.',
    ],
    steps: [
      'Add your PDF using the box above.',
      'If the PDF has a text layer, the words are extracted instantly.',
      'For scanned pages, the built-in OCR engine reads the text from the images.',
      'Copy the extracted text or download it.',
    ],
    faqs: [
      { q: 'Can this extract text from a scanned PDF?', a: 'Yes. When a page has no text layer — as with scans and photos of documents — the tool uses OCR to recognise the words from the image. Accuracy depends on the scan\'s clarity.' },
      { q: 'Why is the extracted text sometimes wrong?', a: 'Errors come from OCR on scanned or low-quality pages, where blurry text, unusual fonts, or handwriting are hard to recognise. Born-digital PDFs with a real text layer extract exactly.' },
      { q: 'Does it keep the original formatting?', a: 'It extracts the words, not the layout. Columns, tables, and styling are not preserved — you get plain, editable text.' },
      { q: 'Is my PDF uploaded for OCR?', a: 'No. Both text extraction and OCR run in your browser, so the document never leaves your device.' },
    ],
  },

  'pdf-to-word': {
    body: [
      'This converter reads the text layer of a PDF and rebuilds it as an editable Word (.docx) file, so you can revise a document you only have as a PDF. It preserves the text and paragraph flow — not the exact page layout — which is the practical trade-off for a conversion that runs privately in your browser.',
      'It works best on PDFs that were exported from a word processor and contain real, selectable text. Scanned or image-only PDFs have no text layer to read, so run them through a PDF-to-text OCR tool first, then convert the recognised text.',
    ],
    steps: [
      'Add your PDF using the box above.',
      'The tool reads the embedded text with pdf.js.',
      'The text and paragraphs are written into a .docx document.',
      'Download the editable Word file.',
    ],
    faqs: [
      { q: 'Does PDF to Word preserve the exact layout?', a: 'No. It preserves the text and paragraph structure, not pixel-perfect page layout. Complex formatting, columns, and precise positioning are not reproduced — the goal is editable text, not a visual clone.' },
      { q: 'Can I convert a scanned PDF to Word?', a: 'Not directly. A scan is an image with no text layer to read. Run it through a PDF-to-text OCR tool first, then convert the recognised text.' },
      { q: 'Will the Word file open in Microsoft Word?', a: 'Yes. It produces a standard .docx that opens in Microsoft Word, Google Docs, LibreOffice, and other compatible editors.' },
      { q: 'Is my document uploaded?', a: 'No. The conversion runs in your browser, so your PDF and the resulting Word file stay on your device.' },
    ],
  },

  'pdf-to-excel': {
    body: [
      'This tool extracts tabular data from a PDF and rebuilds it as an editable Excel (.xlsx) spreadsheet. It reads the position of every piece of text on the page and uses the gaps between them to detect rows and columns, then coerces numbers so you can sum and sort them in Excel.',
      'Clean, grid-like tables convert well. Tables with merged cells, wrapped text, or irregular spacing are harder for any heuristic to read perfectly and usually need a little cleanup afterwards. It works only on PDFs with a real text layer — scanned tables need OCR first.',
    ],
    steps: [
      'Add your PDF using the box above.',
      'The tool reads the text and its position on each page.',
      'Gaps between text are used to detect rows and columns.',
      'Download the .xlsx spreadsheet and tidy up any cells if needed.',
    ],
    faqs: [
      { q: 'How accurate is PDF to Excel conversion?', a: 'Accuracy depends on the table. Clean, evenly spaced grids convert reliably, while merged cells, wrapped text, and irregular layouts may need manual cleanup after conversion. It is a strong starting point, not a guaranteed pixel-perfect copy.' },
      { q: 'Can it convert a scanned table?', a: 'No. It reads the PDF\'s text layer, which scans do not have. Use an OCR tool on the scan first, then work with the recognised text.' },
      { q: 'Are numbers usable for calculations in Excel?', a: 'Yes. Numeric cells are coerced to numbers where possible, so you can sum, sort, and use formulas rather than treating them as text.' },
      { q: 'Is my PDF uploaded?', a: 'No. Extraction happens in your browser, so the document never leaves your device.' },
    ],
  },

  'html-to-pdf': {
    body: [
      'This tool turns HTML into a clean, text-selectable PDF using your browser\'s own rendering and print engine. Because the browser lays out the page exactly as it would display it, the result is high-fidelity — fonts, spacing, and colours match what you see — and the text stays selectable and searchable in the PDF.',
      'It is handy for saving a formatted invoice, a report, or a snippet of markup as a polished document. Using the native print path means no heavy library and no upload — the conversion happens right on your device.',
    ],
    steps: [
      'Paste or load your HTML into the tool.',
      'Preview how it will render.',
      'Use the built-in print-to-PDF action, which opens your browser\'s print dialog.',
      'Choose "Save as PDF" as the destination and save.',
    ],
    faqs: [
      { q: 'Will the PDF text be selectable?', a: 'Yes. Because the PDF is produced through the browser\'s print engine rather than as a flat image, text remains selectable and searchable.' },
      { q: 'Does the PDF look exactly like the web page?', a: 'Very close. The browser renders the HTML the same way it displays it, so fonts, colours, and layout carry over faithfully, subject to print-specific CSS like page breaks.' },
      { q: 'Can I control page size and margins?', a: 'Yes, through the browser\'s print dialog and any @page CSS rules in your HTML, which let you set paper size, margins, and orientation.' },
      { q: 'Is my HTML uploaded?', a: 'No. Rendering and PDF creation happen entirely in your browser, so nothing is sent to a server.' },
    ],
  },

  'word-counter': {
    body: [
      'A word counter tallies words, characters, sentences, and paragraphs as you type or paste, so you can hit a target length precisely. Writers use it for essays with strict limits, marketers for meta descriptions and tweets, and students for assignments with a required word count.',
      'Beyond the raw total, seeing character counts helps with hard limits like the 160 characters in an SMS or the character caps on social posts, while reading-time estimates help gauge how long an article will take an audience to get through.',
    ],
    steps: [
      'Type directly in the box, or paste your text.',
      'Counts update live as you edit.',
      'Read the word, character, sentence, and paragraph totals.',
      'Adjust your text to hit the length you need.',
    ],
    faqs: [
      { q: 'Does the word counter count spaces as characters?', a: 'It shows both totals — characters with spaces and characters without — so you can match whichever limit applies, since some platforms count spaces and others do not.' },
      { q: 'Is my text saved or uploaded?', a: 'No. Counting happens live in your browser and nothing is stored or sent anywhere, so it is safe for private or unpublished writing.' },
      { q: 'How is a "word" defined?', a: 'A word is a run of characters separated by spaces or line breaks, which matches how word processors and most assignment guidelines count.' },
      { q: 'Can I use it on my phone?', a: 'Yes. The tool works in any modern mobile browser with no installation, counting as you type just as it does on desktop.' },
    ],
  },

  'case-converter': {
    body: [
      'A case converter transforms text between UPPERCASE, lowercase, Title Case, Sentence case, and often programmer styles like camelCase or snake_case. It saves you retyping when you have pasted text in the wrong case or need to match a specific style guide or code convention.',
      'Title Case capitalises the first letter of each significant word for headings, Sentence case capitalises only the first word for body text, and the code cases join words without spaces for variable and file names.',
    ],
    steps: [
      'Paste your text into the box.',
      'Pick the case style you want.',
      'The converted text appears instantly.',
      'Copy the result to use anywhere.',
    ],
    faqs: [
      { q: 'What is the difference between Title Case and Sentence case?', a: 'Title Case capitalises the first letter of each major word, which suits headings and titles. Sentence case capitalises only the first word (and proper nouns), which suits normal body sentences.' },
      { q: 'Can it convert to camelCase or snake_case?', a: 'Where offered, yes. These join words for code — camelCase capitalises each word after the first with no spaces, and snake_case joins lowercase words with underscores.' },
      { q: 'Will converting case change my punctuation?', a: 'No. Only letter casing changes; punctuation, numbers, and spacing stay exactly as they were.' },
      { q: 'Is my text private?', a: 'Yes. Conversion runs entirely in your browser, so nothing you paste is uploaded or stored.' },
    ],
  },

  'json-formatter': {
    body: [
      'A JSON formatter takes minified or messy JSON and pretty-prints it with consistent indentation, making nested structures easy to read and debug. It also validates as it formats — if the JSON is malformed, it flags the syntax error so you can fix a stray comma or missing bracket quickly.',
      'Developers reach for this constantly when inspecting API responses, config files, and log payloads. Formatting turns a single unreadable line into a clear tree; minifying does the reverse to shrink a payload before shipping it.',
    ],
    steps: [
      'Paste your JSON into the box.',
      'Click Format to indent and pretty-print it, or Minify to compact it.',
      'Any syntax error is highlighted so you can correct it.',
      'Copy the clean JSON.',
    ],
    faqs: [
      { q: 'Does the formatter validate my JSON?', a: 'Yes. If the JSON has a syntax error — a missing bracket, trailing comma, or unquoted key — the tool reports it so you can fix the problem before using the data.' },
      { q: 'What is the difference between formatting and minifying?', a: 'Formatting adds indentation and line breaks so JSON is easy to read; minifying strips all unnecessary whitespace to make the payload as small as possible for transmission.' },
      { q: 'Can it handle large JSON files?', a: 'Yes, within your browser\'s memory. Very large files may take a moment to process since everything runs locally on your device.' },
      { q: 'Is my JSON uploaded?', a: 'No. Formatting and validation happen entirely in your browser, so sensitive data in API responses or configs never leaves your machine.' },
    ],
  },

  'base64-encoder': {
    body: [
      'Base64 encoding represents binary or text data using only 64 safe ASCII characters, so it can travel through channels that expect plain text — email bodies, JSON fields, data URIs, and HTTP headers. Encoding makes data transport-safe; decoding turns it back into the original.',
      'It is not encryption: anyone can decode Base64, so it hides nothing. Its job is safe transport, such as embedding a small image directly in CSS as a data URI or carrying binary tokens inside a JSON payload.',
    ],
    steps: [
      'Paste text to encode, or a Base64 string to decode.',
      'Choose Encode or Decode.',
      'The converted result appears instantly.',
      'Copy it for use in your code or document.',
    ],
    faqs: [
      { q: 'Is Base64 a form of encryption?', a: 'No. Base64 is an encoding, not encryption — anyone can decode it. It makes data safe to transmit as text, but it provides no secrecy or security on its own.' },
      { q: 'Why does Base64 make data larger?', a: 'Base64 represents every 3 bytes as 4 characters, so encoded output is roughly 33% larger than the original. That size cost is the price of text-safe transport.' },
      { q: 'What is Base64 used for?', a: 'Common uses include embedding images in CSS or HTML as data URIs, encoding binary data inside JSON, and carrying credentials in HTTP Basic Auth headers.' },
      { q: 'Is my data uploaded?', a: 'No. Encoding and decoding happen in your browser, so your data stays on your device.' },
    ],
  },

  'hash-generator': {
    body: [
      'A hash function turns any input into a fixed-length fingerprint — the same input always produces the same hash, and even a tiny change produces a completely different one. This makes hashes ideal for verifying that a file or message has not been altered and for comparing values without storing the original.',
      'This tool computes hashes like SHA-256 directly in your browser using the Web Crypto API. Note that hashing is one-way: you cannot reverse a hash back to its input, which is exactly why hashes are used for integrity checks and fingerprinting rather than reversible encoding.',
    ],
    steps: [
      'Type or paste the text you want to hash.',
      'Pick a hash algorithm such as SHA-256.',
      'The hash is computed instantly with the Web Crypto API.',
      'Copy the resulting digest.',
    ],
    faqs: [
      { q: 'Can a hash be reversed back to the original text?', a: 'No. Hash functions are one-way by design — you cannot recover the input from the hash. That property is what makes them useful for integrity checks and fingerprinting.' },
      { q: 'Which hash algorithm should I use?', a: 'SHA-256 is a solid default for integrity and fingerprinting. Avoid MD5 and SHA-1 for security-sensitive work, as both are considered broken for collision resistance.' },
      { q: 'Why do I get the same hash every time?', a: 'Hashes are deterministic — identical input always yields identical output. That is precisely how you verify two files or messages are the same.' },
      { q: 'Is my input uploaded?', a: 'No. Hashing runs locally via the Web Crypto API, so nothing you enter leaves your browser.' },
    ],
  },

  'password-generator': {
    body: [
      'A strong password is long and random, which makes it far harder to guess or crack than a memorable word. This generator uses your browser\'s cryptographically secure random source to build passwords from the character sets you choose, so each one is unpredictable.',
      'Length matters more than complexity: every extra character multiplies the number of possibilities an attacker must try. Pairing a long random password with a password manager — so you never have to memorise it — is the practical way to stay secure across many accounts.',
    ],
    steps: [
      'Choose a length — longer is stronger.',
      'Select which character types to include (uppercase, lowercase, numbers, symbols).',
      'A secure random password is generated instantly.',
      'Copy it and store it in your password manager.',
    ],
    faqs: [
      { q: 'How long should my password be?', a: 'Aim for at least 16 characters for important accounts. Length adds security faster than complexity, because each extra character dramatically increases the number of combinations an attacker must try.' },
      { q: 'Are these passwords truly random?', a: 'Yes. They are generated with the browser\'s cryptographically secure random number generator (Web Crypto), not a predictable formula, so each password is genuinely unpredictable.' },
      { q: 'Is it safe to generate a password on a website?', a: 'This generator runs entirely in your browser and never transmits or stores the passwords it creates, so nothing leaves your device. Still, always use a password manager to store them.' },
      { q: 'Should I reuse a generated password?', a: 'No. Use a unique password for every account so that a breach of one service cannot compromise the others.' },
    ],
  },

  'qr-code-generator': {
    body: [
      'A QR code packs text — most often a URL — into a square barcode that any phone camera can read instantly, bridging the physical and digital worlds. Businesses use them on posters, menus, packaging, and business cards to send people straight to a link without typing.',
      'This generator builds the code in your browser and lets you download it as an image to print or embed. Because a QR code is just an encoded version of whatever you enter, it works offline once created and never expires on its own — the destination it points to is what needs to stay live.',
    ],
    steps: [
      'Enter the URL or text you want to encode.',
      'The QR code updates live as you type.',
      'Download it as an image.',
      'Print or embed it wherever people will scan it.',
    ],
    faqs: [
      { q: 'Do QR codes expire?', a: 'The code itself never expires — it is a fixed encoding of your text or link. What can stop working is the destination: if the URL it points to goes offline, scanning the code leads nowhere.' },
      { q: 'What can I put in a QR code?', a: 'Most commonly a website URL, but also plain text, contact details, Wi-Fi credentials, or an email address. Shorter content produces a simpler, easier-to-scan code.' },
      { q: 'Can I use the QR code commercially?', a: 'Yes. The codes you generate are yours to print on products, posters, menus, or business cards without restriction.' },
      { q: 'Is my data uploaded to generate the code?', a: 'No. The QR code is generated in your browser, so whatever you encode stays on your device.' },
    ],
  },

  'file-converter': {
    body: [
      'A universal file converter saves you from hunting down a separate tool for every format. Whether you have a document, image, audio clip, video, spreadsheet, ebook, or archive, you pick the file and the target format and the right engine handles it — many conversions run right in your browser, while heavier formats use a conversion service.',
      'Choosing the correct target format matters: convert to PDF to lock a document\'s layout for sharing, to MP4 for wide video compatibility, or to a modern image format like WebP for smaller web files. The converter offers only the targets that make sense for the file you provide.',
    ],
    steps: [
      'Add the file you want to convert.',
      'Choose the output format from the options offered for that file type.',
      'The file is converted — in your browser where possible, otherwise via the conversion service.',
      'Download the converted file.',
    ],
    faqs: [
      { q: 'What kinds of files can I convert?', a: 'Documents, images, audio, video, spreadsheets, presentations, ebooks, and archives. When you add a file, the tool shows only the output formats that make sense for it.' },
      { q: 'Are my files converted privately?', a: 'Many conversions — images, audio, video, archives, fonts — run entirely in your browser and never leave your device. Some document and office formats are processed by a conversion service; those files are handled for the conversion and not retained.' },
      { q: 'Is there a file size limit?', a: 'Browser-based conversions are bounded by your device\'s memory. Conversions that use the service have a size cap, shown if you exceed it.' },
      { q: 'Why isn\'t my desired output format listed?', a: 'The tool only offers conversions it can perform reliably for that input. If a target is not shown, it means that specific pair is not supported.' },
    ],
  },

  'video-converter': {
    body: [
      'Different players, devices, and websites expect different video formats. MP4 is the most universally compatible and a safe default for sharing, while WebM is favoured on the web for its open codecs, and MKV is popular for high-quality archived video. Converting lets a clip that won\'t play somewhere become one that will.',
      'This converter processes video in your browser using ffmpeg compiled to WebAssembly, so files are not uploaded. Video transcoding is computationally heavy, so larger clips take longer and depend on your device\'s speed — but the privacy trade-off is that nothing leaves your machine.',
    ],
    steps: [
      'Add your video file.',
      'Choose the output format (MP4, WebM, MKV, MOV, AVI, and more).',
      'The video is transcoded in your browser with ffmpeg.wasm.',
      'Download the converted video.',
    ],
    faqs: [
      { q: 'Which video format is most compatible?', a: 'MP4 (H.264) plays on virtually every device, browser, and player, making it the safest choice for sharing. WebM is great for the web, and MKV suits high-quality storage.' },
      { q: 'Why does conversion take a while?', a: 'Video transcoding is processor-intensive and here it runs in your browser rather than on a server. Larger files and higher resolutions take longer, and speed depends on your device.' },
      { q: 'Are my videos uploaded?', a: 'No. Conversion runs locally with ffmpeg compiled to WebAssembly, so your video never leaves your device — a real privacy advantage over upload-based converters.' },
      { q: 'Will converting reduce the video quality?', a: 'Any re-encoding involves some quality change, but at sensible settings the difference is minimal. Converting between formats does not magically improve quality beyond the source.' },
    ],
  },

  'nef-to-jpg': {
    body: [
      'NEF is Nikon\'s RAW format — the unprocessed sensor data straight off a Nikon camera. It holds far more tonal range than a JPG, which is why photographers shoot it, but most apps, phones, and websites cannot open a .nef file. Converting to JPG produces a universally viewable, shareable photo.',
      'A RAW file is like a photographic negative: converting it "develops" the image into a finished JPG using default settings. You keep the .nef as your master for serious editing, and hand out the JPG for viewing, uploading, and printing.',
    ],
    steps: [
      'Add your Nikon .nef file using the box above.',
      'The RAW sensor data is decoded and rendered to a viewable image in your browser.',
      'It is then encoded as a standard JPG.',
      'Download the .jpg, ready to share anywhere.',
    ],
    faqs: [
      { q: 'Why can\'t I open NEF files normally?', a: 'NEF is Nikon\'s proprietary RAW format containing raw sensor data, not a finished image. Most viewers, phones, and websites do not include a Nikon RAW decoder, so converting to JPG gives you a file that opens everywhere.' },
      { q: 'Will I lose quality converting NEF to JPG?', a: 'JPG is a finished, lossy format, so it holds less editing headroom than the RAW original — but for viewing and sharing the visible quality is excellent. Keep the .nef if you plan to do heavy edits later.' },
      { q: 'Should I keep my original NEF files?', a: 'Yes. The NEF is your high-quality master, like a negative. Convert copies to JPG for sharing but archive the originals for future editing.' },
      { q: 'Are my photos uploaded?', a: 'No. The RAW file is decoded and converted in your browser, so your photos never leave your device.' },
    ],
  },

  'nef-to-png': {
    body: [
      'This converts a Nikon NEF RAW file into a lossless PNG. Compared with JPG, PNG stores the developed image without compression artefacts, which suits cases where you want the cleanest possible export — say, a photo headed into a design tool or one with fine detail you do not want JPEG to soften.',
      'The trade-off is size: a PNG of a full-resolution photo is large because it keeps every pixel exactly. If you mainly need to view or upload the shot, JPG is more practical; choose PNG when losslessness matters more than file size.',
    ],
    steps: [
      'Add your Nikon .nef file.',
      'The RAW data is decoded and developed into an image in your browser.',
      'The image is saved losslessly as PNG.',
      'Download the .png.',
    ],
    faqs: [
      { q: 'Should I convert NEF to PNG or JPG?', a: 'Choose PNG when you want a lossless export with no compression artefacts, such as for design work. Choose JPG when you want a much smaller file for viewing and sharing — the visible quality is similar.' },
      { q: 'Why is the PNG so large?', a: 'PNG is lossless and stores every pixel of a full-resolution photo exactly, so photographic PNGs are big. That is the cost of avoiding compression loss.' },
      { q: 'Does PNG preserve more detail than JPG here?', a: 'PNG avoids JPEG\'s compression artefacts, so it is technically cleaner, but both are developed from the same RAW data. The practical difference is visible mainly in fine gradients and hard edges.' },
      { q: 'Is my file uploaded?', a: 'No. Decoding and conversion run entirely in your browser.' },
    ],
  },

  'cr2-to-jpg': {
    body: [
      'CR2 is Canon\'s RAW format used by most Canon DSLRs — raw sensor data that captures far more detail and dynamic range than a JPG, but that few programs outside dedicated photo editors can open. Converting to JPG turns a Canon RAW into a photo you can view, email, upload, or print anywhere.',
      'Think of the CR2 as your digital negative and the JPG as the print. The conversion develops the RAW into a finished image; you keep the original CR2 for serious editing and share the lightweight JPG.',
    ],
    steps: [
      'Add your Canon .cr2 file using the box above.',
      'The RAW sensor data is decoded and rendered in your browser.',
      'It is encoded as a standard JPG.',
      'Download the finished .jpg.',
    ],
    faqs: [
      { q: 'What is a CR2 file?', a: 'CR2 is Canon\'s RAW image format from most Canon DSLRs, holding unprocessed sensor data with maximum detail and dynamic range. Because it is raw rather than a finished image, it needs converting to JPG for everyday use.' },
      { q: 'Does converting CR2 to JPG reduce quality?', a: 'The JPG is a finished, lossy file with less editing latitude than the RAW, but for viewing, sharing, and printing the quality is excellent. Retain the CR2 for future edits.' },
      { q: 'What is the difference between CR2 and CR3?', a: 'CR3 is Canon\'s newer RAW format used by more recent cameras; CR2 is the older one. Both are Canon RAW files and both convert to JPG the same way — use the matching tool for your file.' },
      { q: 'Are my photos uploaded?', a: 'No. The conversion happens in your browser, so your Canon RAW files stay on your device.' },
    ],
  },

  'cr2-to-png': {
    body: [
      'This develops a Canon CR2 RAW file into a lossless PNG. PNG keeps the exported image free of JPEG compression artefacts, which is useful when the photo is destined for editing software or a workflow where you want the cleanest possible starting point rather than the smallest file.',
      'Because PNG stores every pixel exactly, a full-resolution photo becomes a large file. If your goal is simply to view or share the shot, JPG is the more practical export; reach for PNG when losslessness outweighs size.',
    ],
    steps: [
      'Add your Canon .cr2 file.',
      'The RAW data is decoded and developed in your browser.',
      'The result is saved losslessly as PNG.',
      'Download the .png.',
    ],
    faqs: [
      { q: 'Why convert CR2 to PNG instead of JPG?', a: 'PNG is lossless, avoiding JPEG compression artefacts, which suits photos headed into design tools or precise editing. JPG is better when you want a small, easily shared file.' },
      { q: 'Will the PNG be large?', a: 'Yes. A lossless PNG of a full-resolution Canon photo stores every pixel exactly, so expect a big file compared with the JPG version.' },
      { q: 'Is quality better than JPG?', a: 'PNG avoids compression artefacts, so it is technically cleaner, though both develop from the same RAW sensor data.' },
      { q: 'Are my files private?', a: 'Yes. Decoding and conversion run in your browser and nothing is uploaded.' },
    ],
  },

  'cr3-to-jpg': {
    body: [
      'CR3 is Canon\'s newer RAW format, used by recent EOS cameras — it replaced the older CR2 with more efficient compression while still storing full raw sensor data. Like all RAW files it is not meant for direct viewing, so converting to JPG produces a photo you can open and share on any device.',
      'The CR3 remains your editing master with the widest tonal range; the JPG is the developed, ready-to-use version. Keep the RAW for serious post-processing and distribute the JPG.',
    ],
    steps: [
      'Add your Canon .cr3 file using the box above.',
      'The RAW data is decoded and rendered in your browser.',
      'It is encoded as a standard JPG.',
      'Download the .jpg.',
    ],
    faqs: [
      { q: 'What cameras produce CR3 files?', a: 'CR3 is the RAW format from Canon\'s more recent EOS cameras, including many mirrorless models. It succeeds the older CR2 format with more efficient compression.' },
      { q: 'Is CR3 harder to open than CR2?', a: 'Both are Canon RAW formats that most general apps cannot open. CR3 is newer, so some older software recognises it even less — converting to JPG sidesteps the issue entirely.' },
      { q: 'Does converting to JPG lose detail?', a: 'The JPG is a finished, lossy image with less editing headroom than the CR3, but it looks excellent for viewing and sharing. Keep the RAW for editing.' },
      { q: 'Are my photos uploaded?', a: 'No. Everything runs in your browser, so your files stay private.' },
    ],
  },

  'arw-to-jpg': {
    body: [
      'ARW is Sony\'s RAW format, produced by Alpha and other Sony cameras. It stores unprocessed sensor data with the full detail and dynamic range the camera captured, which is ideal for editing but means most viewers and websites cannot open it. Converting to JPG gives you a shareable, universally supported photo.',
      'The ARW is your master negative; the JPG is the developed print. Archive the RAW for high-quality editing and hand out JPGs for everyday viewing, uploading, and printing.',
    ],
    steps: [
      'Add your Sony .arw file using the box above.',
      'The RAW sensor data is decoded and rendered in your browser.',
      'It is encoded as a standard JPG.',
      'Download the finished .jpg.',
    ],
    faqs: [
      { q: 'What is an ARW file?', a: 'ARW is Sony\'s RAW image format from Alpha and other Sony cameras, containing unprocessed sensor data with maximum detail and dynamic range for editing.' },
      { q: 'Why won\'t my ARW files open?', a: 'ARW is raw sensor data, not a finished image, and it is Sony-specific — most viewers and websites lack the decoder. Converting to JPG produces a file that opens everywhere.' },
      { q: 'Will converting reduce quality?', a: 'The JPG has less editing latitude than the RAW original, but for viewing and sharing it looks excellent. Keep the ARW for serious edits.' },
      { q: 'Are my Sony RAW files uploaded?', a: 'No. Conversion runs in your browser, so your photos never leave your device.' },
    ],
  },

  'dng-to-jpg': {
    body: [
      'DNG (Digital Negative) is Adobe\'s open RAW format, designed as a universal container so RAW photos are not locked to one camera maker\'s proprietary format. Many cameras and phone apps can save DNG directly, and photographers often convert other RAW files to DNG for archiving. Either way, a DNG still needs developing into JPG for normal viewing.',
      'Because DNG is an open standard, it is more future-proof than maker-specific RAW formats, but it is still raw data rather than a finished image. Converting to JPG gives you a photo any device can open, while the DNG stays as your editable master.',
    ],
    steps: [
      'Add your .dng file using the box above.',
      'The RAW data is decoded and developed in your browser.',
      'It is encoded as a standard JPG.',
      'Download the .jpg.',
    ],
    faqs: [
      { q: 'What is a DNG file?', a: 'DNG (Digital Negative) is Adobe\'s open, non-proprietary RAW format. It works as a universal RAW container so photos are not tied to one manufacturer\'s format, and it is widely used for archiving.' },
      { q: 'Is DNG better than other RAW formats?', a: 'Its advantage is openness and longevity — being a documented standard, it is more future-proof than maker-specific formats. Image quality depends on the camera, not the container.' },
      { q: 'Does converting DNG to JPG lose quality?', a: 'The JPG is a finished, lossy file with less editing headroom than the DNG. For viewing and sharing it looks great; keep the DNG for editing.' },
      { q: 'Are my files uploaded?', a: 'No. Decoding and conversion run in your browser.' },
    ],
  },

  'crw-to-jpg': {
    body: [
      'CRW is Canon\'s original RAW format from older EOS and PowerShot cameras, used before CR2 took over. As one of the earliest RAW formats it is especially poorly supported by modern software, so if you have old Canon photos in CRW, converting to JPG is often the only practical way to view and use them today.',
      'The CRW holds the camera\'s raw sensor data; converting develops it into a finished JPG. If these are archival shots, keep the CRW originals and work from JPG copies.',
    ],
    steps: [
      'Add your Canon .crw file using the box above.',
      'The RAW data is decoded and rendered in your browser.',
      'It is encoded as a standard JPG.',
      'Download the .jpg.',
    ],
    faqs: [
      { q: 'What is the difference between CRW and CR2?', a: 'CRW is Canon\'s original, older RAW format; CR2 replaced it on later cameras, and CR3 is newer still. CRW is the least supported by modern software, which is why converting to JPG is often necessary.' },
      { q: 'Why is CRW so hard to open?', a: 'It is an old, proprietary Canon format that most current viewers and editors no longer support. Converting to JPG produces a file that opens on any device today.' },
      { q: 'Will I lose quality?', a: 'The JPG has less editing latitude than the RAW, but for viewing old photos the quality is fine. Keep the CRW originals if they have archival value.' },
      { q: 'Are my photos uploaded?', a: 'No. The conversion happens entirely in your browser.' },
    ],
  },

  'bmi-calculator': {
    body: [
      'Body Mass Index (BMI) estimates whether your weight is in a healthy range for your height. It divides weight by height squared and sorts the result into categories — underweight, normal, overweight, and obese — giving a quick, standardised screening figure used widely in health guidance.',
      'BMI is a useful population-level screen but a blunt individual measure: it cannot tell muscle from fat, so very muscular people can read as "overweight" despite low body fat, and it does not account for age, sex, or fat distribution. Treat it as one signal among several, not a diagnosis.',
    ],
    steps: [
      'Enter your height and weight in metric or imperial units.',
      'The calculator computes your BMI instantly.',
      'Read your BMI value and which category it falls in.',
      'Use it as a rough screening figure, alongside other health indicators.',
    ],
    faqs: [
      { q: 'What is a healthy BMI range?', a: 'For adults, a BMI of 18.5 to 24.9 is generally classed as the healthy range, 25 to 29.9 as overweight, and 30 or above as obese. These are screening bands, not precise health verdicts.' },
      { q: 'Is BMI accurate for athletes?', a: 'Not always. BMI cannot distinguish muscle from fat, so muscular people may register as overweight despite being lean and healthy. In those cases body-fat measures are more informative.' },
      { q: 'Does BMI work for children?', a: 'Children use age-and-sex-specific BMI percentiles rather than the fixed adult bands, so the adult categories here do not apply to them.' },
      { q: 'Is my data stored?', a: 'No. The calculation runs in your browser and nothing you enter is saved or uploaded.' },
    ],
  },

  'age-calculator': {
    body: [
      'An age calculator works out an exact age — or the span between any two dates — in years, months, and days, handling the awkward parts like varying month lengths and leap years automatically. It is handy for forms that need a precise age, working out anniversaries, or counting down to a date.',
      'Because month lengths differ and leap years add a day, mental date arithmetic is error-prone. The calculator does it precisely, so "how old will I be on this date" or "how many days until then" takes no guesswork.',
    ],
    steps: [
      'Enter your date of birth (or the start date).',
      'Enter the date to calculate to, or use today.',
      'The exact difference is shown in years, months, and days.',
      'Read the total days or other breakdowns if provided.',
    ],
    faqs: [
      { q: 'Does the age calculator account for leap years?', a: 'Yes. It uses real calendar dates, so leap years and differing month lengths are handled automatically for an accurate result.' },
      { q: 'Can I calculate the time between two arbitrary dates?', a: 'Yes. Set both the start and end dates to any values to find the exact span between them, not just an age from birth to today.' },
      { q: 'How is age counted — completed years?', a: 'Age is shown as completed years, months, and days, matching how age is normally stated (you are a given age until your next birthday).' },
      { q: 'Is my birth date stored?', a: 'No. The calculation is done in your browser and nothing is uploaded or saved.' },
    ],
  },

  'percentage-calculator': {
    body: [
      'A percentage calculator handles the everyday percentage questions that trip people up: what is X% of a number, what percentage one number is of another, and percentage increase or decrease between two values. It saves you from remembering which way to divide and multiply.',
      'These come up constantly — working out a discount, a tip, a test score, a markup, or how much a price changed. Getting the base of the percentage right is the usual source of mistakes, and the calculator keeps that straight for you.',
    ],
    steps: [
      'Choose the type of percentage question you have.',
      'Enter your numbers into the fields.',
      'The answer is calculated instantly.',
      'Read the result and any breakdown of the working.',
    ],
    faqs: [
      { q: 'How do I find what percentage one number is of another?', a: 'Divide the part by the whole and multiply by 100. For example, 30 out of 120 is 30 ÷ 120 × 100 = 25%. The calculator does this for you.' },
      { q: 'How is percentage increase calculated?', a: 'Subtract the old value from the new, divide by the old value, and multiply by 100. A rise from 40 to 50 is (10 ÷ 40) × 100 = 25% increase.' },
      { q: 'What is the difference between percentage points and percent?', a: 'A change from 10% to 15% is a 5 percentage-point rise but a 50% relative increase. The two describe the same change in different ways, which is a common source of confusion.' },
      { q: 'Is anything I enter stored?', a: 'No. All calculations run in your browser with nothing uploaded.' },
    ],
  },

  'loan-calculator': {
    body: [
      'A loan calculator works out your regular repayment on an instalment loan from the amount borrowed, the interest rate, and the term. It uses the standard amortisation formula, so it also reveals the total interest you will pay over the life of the loan — often an eye-opening figure.',
      'Seeing how the monthly payment and total interest shift as you change the rate or term helps you compare offers and understand the real cost of borrowing. A longer term lowers the monthly payment but usually increases total interest paid.',
    ],
    steps: [
      'Enter the loan amount you want to borrow.',
      'Enter the annual interest rate and the loan term.',
      'The calculator shows your regular payment.',
      'Review the total interest and total repayment over the term.',
    ],
    faqs: [
      { q: 'How is my monthly loan payment calculated?', a: 'It uses the standard amortisation formula, which spreads principal and interest into equal payments across the term based on the amount, rate, and number of payments.' },
      { q: 'Does a longer loan term cost more?', a: 'Usually yes. A longer term lowers each monthly payment but means more payments and more interest overall, so the total cost of borrowing rises.' },
      { q: 'Does this include fees or insurance?', a: 'The calculation covers principal and interest. Arrangement fees, insurance, or other charges are not included and would add to the real cost.' },
      { q: 'Is my financial data stored?', a: 'No. Everything is calculated in your browser and nothing is uploaded.' },
    ],
  },

  'mortgage-calculator': {
    body: [
      'A mortgage calculator estimates the monthly payment on a home loan from the loan amount, interest rate, and term, using the same amortisation maths as any instalment loan. Because mortgages are large and long, small rate differences translate into big swings in monthly cost and total interest.',
      'It helps you gauge affordability before you commit and compare deals side by side. Bear in mind the figure here is principal and interest — real housing costs also include property tax, insurance, and sometimes association fees, which a lender may bundle into your payment.',
    ],
    steps: [
      'Enter the mortgage amount (property price minus deposit).',
      'Enter the interest rate and the term in years.',
      'The estimated monthly principal-and-interest payment is shown.',
      'Review total interest over the life of the mortgage.',
    ],
    faqs: [
      { q: 'Does this mortgage calculator include taxes and insurance?', a: 'No. It calculates principal and interest only. Property taxes, home insurance, and any association fees are extra and can add significantly to your true monthly cost.' },
      { q: 'How much does the interest rate affect my payment?', a: 'A lot. Because a mortgage is large and runs for decades, even a fraction of a percent changes the monthly payment and adds up to substantial differences in total interest.' },
      { q: 'What happens if I make extra payments?', a: 'Paying more than required reduces the principal faster, which cuts the total interest and can shorten the term. This basic calculator shows the standard payment; overpayment effects need a dedicated tool.' },
      { q: 'Is my data private?', a: 'Yes. All figures are calculated in your browser and nothing is uploaded.' },
    ],
  },

  'compound-interest-calculator': {
    body: [
      'Compound interest is interest earned on both your original money and the interest it has already earned, so growth accelerates over time. This calculator projects how a starting balance — plus any regular contributions — grows given an interest rate and a number of compounding periods.',
      'The key lesson it reveals is the power of time: the longer money compounds, the more dramatic the growth, because each period builds on a larger base. It is the core idea behind long-term saving and investing.',
    ],
    steps: [
      'Enter your starting amount (principal).',
      'Enter the interest rate, time period, and compounding frequency.',
      'Add regular contributions if you make them.',
      'See the projected final balance and total interest earned.',
    ],
    faqs: [
      { q: 'What is the difference between simple and compound interest?', a: 'Simple interest is calculated only on the original principal, while compound interest is calculated on the principal plus previously earned interest — so compound growth accelerates over time.' },
      { q: 'How does compounding frequency affect growth?', a: 'More frequent compounding (monthly vs annually) earns slightly more because interest is added to the balance sooner and starts earning itself. The effect grows with higher rates and longer periods.' },
      { q: 'Why does time matter so much for compound interest?', a: 'Because each period builds on a larger base, growth is exponential rather than linear. Starting earlier can outweigh contributing more later — the hallmark of compounding.' },
      { q: 'Is this a guaranteed projection?', a: 'No. It assumes a fixed rate for illustration. Real investment returns vary, so treat the result as an estimate, not a promise.' },
    ],
  },

  'bmr-calculator': {
    body: [
      'Basal Metabolic Rate (BMR) is the number of calories your body burns at complete rest just to keep you alive — powering your heart, brain, breathing, and other basic functions. It is the foundation for working out how many calories you need each day, before any activity is added.',
      'This calculator estimates BMR from your age, sex, height, and weight using an established formula. Multiplying BMR by an activity factor gives your total daily energy expenditure, which is what you compare against your intake to lose, maintain, or gain weight.',
    ],
    steps: [
      'Enter your age, sex, height, and weight.',
      'The calculator estimates your BMR using a standard formula.',
      'Read your resting daily calorie burn.',
      'Apply an activity multiplier to estimate your total daily needs.',
    ],
    faqs: [
      { q: 'What is the difference between BMR and TDEE?', a: 'BMR is the calories you burn at complete rest. TDEE (total daily energy expenditure) is BMR multiplied by an activity factor, reflecting the extra calories burned through movement and exercise.' },
      { q: 'How accurate is a BMR estimate?', a: 'Formula-based BMR is a solid estimate for most people but not exact — it cannot account for individual differences in body composition, genetics, and metabolism. Use it as a starting point.' },
      { q: 'How do I use BMR to lose weight?', a: 'Estimate your TDEE from BMR and activity, then eat below that number to lose weight. A moderate deficit is generally safer and more sustainable than a severe one.' },
      { q: 'Is my data stored?', a: 'No. The calculation runs in your browser and nothing is uploaded.' },
    ],
  },

  'calorie-calculator': {
    body: [
      'A calorie calculator estimates how many calories you need each day to maintain, lose, or gain weight. It first works out your resting metabolic rate, then scales it by your activity level to give total daily energy expenditure — the number your intake should sit around to hold your weight steady.',
      'From that maintenance figure you subtract calories to lose weight or add them to gain. The estimate is a starting point: real needs vary with body composition and metabolism, so adjust based on how your weight actually responds over a few weeks.',
    ],
    steps: [
      'Enter your age, sex, height, and weight.',
      'Select your typical activity level.',
      'The calculator estimates your maintenance calories.',
      'Adjust up or down for your weight goal.',
    ],
    faqs: [
      { q: 'How many calories should I eat to lose weight?', a: 'Eat below your estimated maintenance calories. A moderate daily deficit of roughly 500 calories is a common, sustainable target for gradual loss, but adjust based on your real-world results.' },
      { q: 'How is my calorie need calculated?', a: 'The tool estimates your resting metabolic rate from your details, then multiplies by an activity factor to give total daily energy expenditure — your maintenance calorie level.' },
      { q: 'Why isn\'t my weight changing as predicted?', a: 'Calorie formulas are estimates and individual metabolism varies. If your weight is not moving as expected after a few weeks, adjust your intake or activity accordingly.' },
      { q: 'Is my data private?', a: 'Yes. Calculations run in your browser and nothing you enter is uploaded.' },
    ],
  },

  'tip-calculator': {
    body: [
      'A tip calculator works out the gratuity on a bill and, when you are with others, splits the total evenly per person. It removes the mental arithmetic of percentages and division at the table, so you can settle up quickly and fairly.',
      'Customary tip rates vary by country and service — in the US around 15–20% is typical for restaurants, while many other countries tip little or not at all. The calculator lets you set whatever percentage fits the situation and see the tip and grand total at once.',
    ],
    steps: [
      'Enter the bill amount.',
      'Choose a tip percentage.',
      'Enter how many people are splitting the bill, if sharing.',
      'See the tip, total, and amount per person.',
    ],
    faqs: [
      { q: 'How much should I tip?', a: 'It varies by country and service. In the US, 15–20% is customary at restaurants; elsewhere tipping norms differ widely, from rounding up to not tipping at all. Set the percentage that suits your situation.' },
      { q: 'Should I tip on the pre-tax or post-tax total?', a: 'Conventions differ, but tipping on the pre-tax amount is common. The calculator lets you enter whichever bill figure you prefer to base the tip on.' },
      { q: 'How does bill splitting work here?', a: 'Enter the number of people and the calculator divides the total (bill plus tip) evenly, showing the amount each person owes.' },
      { q: 'Is my data stored?', a: 'No. The calculation is instant and local to your browser.' },
    ],
  },

  'discount-calculator': {
    body: [
      'A discount calculator shows the final price after a percentage off and how much you actually save. It answers the question every shopper has at a sale — "what does this cost now?" — without fumbling the percentage maths in your head.',
      'It is handy for comparing deals, stacking a sale price against a coupon, or checking that an advertised "50% off" really lands where you expect. Enter the original price and the discount, and both the sale price and the saving appear.',
    ],
    steps: [
      'Enter the original price.',
      'Enter the discount percentage.',
      'The calculator shows the final price.',
      'See how much you save in total.',
    ],
    faqs: [
      { q: 'How do I calculate a percentage discount?', a: 'Multiply the original price by the discount percentage to get the saving, then subtract it from the original. For example, 20% off $50 is a $10 saving, leaving $40. The calculator does this instantly.' },
      { q: 'How do I work out stacked discounts?', a: 'Apply them one after another, not by adding the percentages. An extra 10% off an already 20%-reduced price is 10% off the lower price, not 30% off the original.' },
      { q: 'Can it show the original price from a sale price?', a: 'This tool calculates the sale price and saving from the original. Reversing from a discounted price back to the original is a different calculation.' },
      { q: 'Is anything stored?', a: 'No. The calculation runs in your browser with nothing uploaded.' },
    ],
  },

  // --- Unit converters: the pages already carry an explainer in their `about`
  // slot, so these add How-to steps + a real FAQ (with FAQPage schema) rather
  // than repeating prose, which would read as padding.
  'length-converter': {
    steps: [
      'Enter a value and pick the unit you are converting from.',
      'Choose the unit you want to convert to.',
      'Read the result, the full table of every unit, and the feet-and-inches readout.',
      'Use presets like cm→in for common conversions, or batch mode for a whole column.',
    ],
    faqs: [
      { q: 'How many centimetres are in an inch?', a: 'One inch is exactly 2.54 centimetres. The conversion is defined, not approximate, so 12 inches (a foot) is exactly 30.48 cm.' },
      { q: 'What is the difference between a mile and a nautical mile?', a: 'A statute mile is 1,609.344 metres, used on land. A nautical mile is 1,852 metres, based on the Earth\'s circumference and used in sea and air navigation — noticeably longer.' },
      { q: 'Can I convert scientific units like light years and parsecs?', a: 'Yes. This converter includes astronomical units, light years, and parsecs alongside everyday metric and imperial units, switching to scientific notation for very large or small values.' },
      { q: 'Are my conversions private?', a: 'Yes. All maths runs in your browser, so nothing you enter is uploaded or stored.' },
    ],
  },
  'weight-converter': {
    steps: [
      'Enter a value and select the unit to convert from (kg, lb, oz, and more).',
      'Choose your target unit.',
      'Read the converted result and the full unit table.',
      'Use quick presets or batch mode for multiple values.',
    ],
    faqs: [
      { q: 'How many pounds are in a kilogram?', a: 'One kilogram equals about 2.20462 pounds. So 5 kg is roughly 11.02 lb. The converter shows the precise figure at your chosen precision.' },
      { q: 'What is the difference between mass and weight?', a: 'Strictly, mass (kg, g) is the amount of matter, while weight is the force gravity exerts on it. In everyday use the terms are mixed, and this tool converts the common mass units people mean by "weight".' },
      { q: 'Does this handle both metric and imperial units?', a: 'Yes. It converts between grams, kilograms, tonnes, ounces, pounds, stones, and more, so you can move freely between metric and imperial.' },
      { q: 'Is my data uploaded?', a: 'No. Everything is calculated locally in your browser.' },
    ],
  },
  'temperature-converter': {
    steps: [
      'Enter a temperature and choose its scale (Celsius, Fahrenheit, or Kelvin).',
      'Pick the scale to convert to.',
      'Read the converted temperature.',
      'See the value in all scales at once.',
    ],
    faqs: [
      { q: 'How do I convert Celsius to Fahrenheit?', a: 'Multiply by 9/5 and add 32. So 20°C is (20 × 9/5) + 32 = 68°F. The converter applies this exactly for any value.' },
      { q: 'What temperature is the same in Celsius and Fahrenheit?', a: 'Minus 40 degrees: -40°C equals -40°F. It is the single point where the two scales cross.' },
      { q: 'Why does temperature not scale like other units?', a: 'Unlike length or weight, temperature scales have different zero points, so conversion needs an offset (the +32 for Fahrenheit), not just multiplication. Kelvin shares Celsius\'s degree size but starts at absolute zero.' },
      { q: 'Is my input stored?', a: 'No. The conversion is instant and local to your browser.' },
    ],
  },
  'area-converter': {
    steps: [
      'Enter a value and select the unit to convert from.',
      'Choose your target area unit.',
      'Read the result and the full table.',
      'Use presets or batch mode as needed.',
    ],
    faqs: [
      { q: 'How many square feet are in a square metre?', a: 'One square metre is about 10.764 square feet. Note this is the square of the length conversion, not the same factor.' },
      { q: 'How big is an acre?', a: 'An acre is 43,560 square feet, or about 4,047 square metres — roughly the size of a standard football pitch without the end zones. A hectare (10,000 m²) is about 2.47 acres.' },
      { q: 'Why can\'t I just use the length conversion factor for area?', a: 'Because area is two-dimensional, you square the length factor. One metre is 3.28 feet, but one square metre is 3.28² ≈ 10.76 square feet. The converter handles this automatically.' },
      { q: 'Is my data private?', a: 'Yes. All calculations run in your browser.' },
    ],
  },
  'volume-converter': {
    steps: [
      'Enter a value and pick the unit to convert from.',
      'Choose the unit to convert to.',
      'Read the result and full table.',
      'Use presets for common cooking and liquid conversions.',
    ],
    faqs: [
      { q: 'How many millilitres are in a litre?', a: 'One litre is 1,000 millilitres. A litre is also 1,000 cubic centimetres, so 1 mL equals 1 cm³.' },
      { q: 'Are US and UK (imperial) gallons the same?', a: 'No. A US gallon is about 3.785 litres, while an imperial (UK) gallon is about 4.546 litres — significantly larger. Make sure you pick the right one.' },
      { q: 'Does this convert cooking measures like cups and tablespoons?', a: 'Yes, it includes common cooking volumes. Note that cup and spoon sizes differ by country, so results are based on standard definitions.' },
      { q: 'Is anything uploaded?', a: 'No. Conversion happens locally in your browser.' },
    ],
  },
  'speed-converter': {
    steps: [
      'Enter a speed and choose its unit (km/h, mph, m/s, knots).',
      'Pick the target unit.',
      'Read the converted speed.',
      'See all units at once for quick reference.',
    ],
    faqs: [
      { q: 'How do I convert km/h to mph?', a: 'Divide by 1.609, or multiply by 0.6214. So 100 km/h is about 62.1 mph. The converter does this precisely.' },
      { q: 'What is a knot?', a: 'A knot is one nautical mile per hour, about 1.852 km/h or 1.151 mph. It is the standard speed unit in sea and air navigation.' },
      { q: 'How fast is the speed of sound or light in these units?', a: 'The speed of sound is roughly 1,235 km/h at sea level; light travels about 1.08 billion km/h. Enter them to see conversions across units.' },
      { q: 'Is my data stored?', a: 'No. The conversion runs in your browser only.' },
    ],
  },
  'time-converter': {
    steps: [
      'Enter a value and select the time unit to convert from.',
      'Choose the target unit (seconds, minutes, hours, days, weeks, years).',
      'Read the result and the full breakdown.',
      'Use batch mode for a list of values.',
    ],
    faqs: [
      { q: 'How many seconds are in a day?', a: 'A standard day has 86,400 seconds (24 × 60 × 60). A week has 604,800 seconds.' },
      { q: 'How many days are in a year for these conversions?', a: 'This tool uses 365.25 days per year to account for leap years on average, which is why year conversions may differ slightly from a plain 365-day assumption.' },
      { q: 'Can I convert between weeks, months, and years?', a: 'Yes. Because month lengths vary, months are treated using an average length, so results for months are approximate by nature.' },
      { q: 'Is my input uploaded?', a: 'No. All calculations are local to your browser.' },
    ],
  },
  'pressure-converter': {
    steps: [
      'Enter a value and choose the pressure unit to convert from.',
      'Select the target unit (Pa, bar, psi, atm, mmHg).',
      'Read the converted result.',
      'See the value across all units.',
    ],
    faqs: [
      { q: 'How many psi are in a bar?', a: 'One bar is about 14.504 psi. Car tyre pressures are often quoted in both, which is a common reason to convert.' },
      { q: 'What is standard atmospheric pressure?', a: 'One standard atmosphere (atm) is 101,325 pascals, about 1.013 bar or 14.696 psi — the average air pressure at sea level.' },
      { q: 'What is mmHg used for?', a: 'Millimetres of mercury (mmHg) is common in medicine, such as blood-pressure readings, and in some scientific contexts. One atmosphere is 760 mmHg.' },
      { q: 'Is my data private?', a: 'Yes. Conversion runs entirely in your browser.' },
    ],
  },
  'energy-converter': {
    steps: [
      'Enter a value and pick the energy unit to convert from.',
      'Choose your target unit (joules, calories, kWh, BTU).',
      'Read the converted result.',
      'View all units at once.',
    ],
    faqs: [
      { q: 'How many joules are in a calorie?', a: 'One (small) calorie is 4.184 joules. A food Calorie (kilocalorie) is 1,000 of those, or 4,184 joules — worth knowing when reading nutrition labels.' },
      { q: 'What is a kilowatt-hour?', a: 'A kilowatt-hour (kWh) is the energy of using one kilowatt for one hour — 3.6 million joules. It is the unit your electricity bill uses.' },
      { q: 'What is a BTU?', a: 'A British Thermal Unit is about 1,055 joules, the energy to raise one pound of water by one degree Fahrenheit. It is common in heating and air-conditioning ratings.' },
      { q: 'Is anything uploaded?', a: 'No. All maths is done locally in your browser.' },
    ],
  },
  'power-converter': {
    steps: [
      'Enter a value and choose the power unit to convert from.',
      'Select the target unit (watts, kilowatts, horsepower).',
      'Read the converted result.',
      'See every unit at once.',
    ],
    faqs: [
      { q: 'How many watts are in one horsepower?', a: 'One mechanical horsepower is about 745.7 watts. So a 100 hp engine is roughly 74.6 kW.' },
      { q: 'What is the difference between power and energy?', a: 'Power is the rate of using energy (watts = joules per second), while energy is the total amount (joules, kWh). A powerful device uses energy quickly.' },
      { q: 'Are there different kinds of horsepower?', a: 'Yes — mechanical, metric, and electrical horsepower differ slightly. This converter uses standard definitions; small discrepancies between sources usually come from which horsepower is meant.' },
      { q: 'Is my data stored?', a: 'No. The conversion runs in your browser only.' },
    ],
  },
  'data-storage-converter': {
    steps: [
      'Enter a value and pick the data unit to convert from (bit, byte, KB, MB, GB, TB).',
      'Choose the target unit.',
      'Read the result and the full table.',
      'Switch between decimal and binary interpretations if offered.',
    ],
    faqs: [
      { q: 'How many megabytes are in a gigabyte?', a: 'It depends on the standard: decimally, 1 GB = 1,000 MB; in binary (gibibytes), 1 GiB = 1,024 MiB. Storage makers use the decimal figure, which is why a "1 TB" drive shows as less in some operating systems.' },
      { q: 'What is the difference between a bit and a byte?', a: 'A byte is 8 bits. Network speeds are usually quoted in bits per second (Mbps) while file sizes are in bytes (MB), so a connection is 8× slower in bytes than the megabit number suggests.' },
      { q: 'Why does my hard drive show less space than advertised?', a: 'Manufacturers count 1 TB as 1,000,000,000,000 bytes (decimal), but many operating systems display in binary (1 TB ≈ 0.909 TiB), so the same drive looks smaller. No space is actually missing.' },
      { q: 'Is my data uploaded?', a: 'No. Everything is calculated locally.' },
    ],
  },
  'fuel-economy-converter': {
    steps: [
      'Enter a value and choose its unit (mpg, L/100km, km/L).',
      'Pick the unit to convert to.',
      'Read the converted fuel economy.',
      'Compare across units at once.',
    ],
    faqs: [
      { q: 'How do I convert mpg to litres per 100 km?', a: 'The two are inversely related, so it is not a simple multiply. This converter handles the reciprocal maths — for example, 40 US mpg is about 5.9 L/100km.' },
      { q: 'Is US mpg the same as UK mpg?', a: 'No. Because a UK (imperial) gallon is larger than a US gallon, the same car scores a higher mpg in UK figures. Be sure to pick the correct gallon.' },
      { q: 'Which is better, a higher or lower number?', a: 'It depends on the unit. Higher mpg and km/L mean better economy, but lower L/100km means better economy — because it measures fuel used per distance rather than distance per fuel.' },
      { q: 'Is my input stored?', a: 'No. The conversion runs entirely in your browser.' },
    ],
  },
  'angle-converter': {
    steps: [
      'Enter a value and choose its unit (degrees, radians, gradians).',
      'Pick the target unit.',
      'Read the converted angle.',
      'See all units at once.',
    ],
    faqs: [
      { q: 'How do I convert degrees to radians?', a: 'Multiply by π/180. So 180° is π radians (≈ 3.14159), and 90° is π/2 (≈ 1.5708). The converter does this precisely.' },
      { q: 'What is a gradian?', a: 'A gradian (or gon) divides a right angle into 100 parts, so a full circle is 400 gradians. It is used in some surveying and engineering contexts.' },
      { q: 'How many radians are in a full circle?', a: 'A full circle is 2π radians, about 6.2832 — equivalent to 360 degrees or 400 gradians.' },
      { q: 'Is my data private?', a: 'Yes. All maths runs in your browser.' },
    ],
  },
  'frequency-converter': {
    steps: [
      'Enter a value and choose its unit (Hz, kHz, MHz, GHz).',
      'Pick the unit to convert to.',
      'Read the converted frequency.',
      'View all units at once.',
    ],
    faqs: [
      { q: 'How many hertz are in a kilohertz?', a: 'One kilohertz (kHz) is 1,000 hertz, one megahertz (MHz) is 1,000,000 Hz, and one gigahertz (GHz) is 1,000,000,000 Hz.' },
      { q: 'What does hertz measure?', a: 'Hertz measures cycles per second — how many times something repeats each second. It applies to sound waves, radio signals, and processor clock speeds alike.' },
      { q: 'What frequency is my Wi-Fi or CPU?', a: 'Wi-Fi commonly uses 2.4 GHz and 5 GHz bands; CPUs run at a few GHz. Enter the number to convert between Hz, kHz, MHz, and GHz.' },
      { q: 'Is anything uploaded?', a: 'No. The conversion is local to your browser.' },
    ],
  },
  'cooking-converter': {
    steps: [
      'Enter a value and choose its unit (cups, tablespoons, millilitres, grams).',
      'Pick the unit to convert to.',
      'Read the converted measurement.',
      'Use presets for common recipe conversions.',
    ],
    faqs: [
      { q: 'How many tablespoons are in a cup?', a: 'A US cup holds 16 tablespoons. Note that cup and spoon sizes differ between the US, UK, and metric systems, so pick the right one for your recipe.' },
      { q: 'Why do cup sizes differ between countries?', a: 'A US cup is about 237 mL, a metric cup is 250 mL, and older UK recipes use a 284 mL cup. Using the wrong one throws off a recipe, so this converter uses standard definitions.' },
      { q: 'Can I convert cups to grams?', a: 'Only approximately, because grams measure weight and cups measure volume — the conversion depends on the ingredient (a cup of flour weighs less than a cup of sugar). Volume-to-volume conversions are exact; volume-to-weight are ingredient-specific.' },
      { q: 'Is my data stored?', a: 'No. Everything runs in your browser.' },
    ],
  },

  // --- Color tools ---
  'hex-to-rgb': {
    body: [
      'Hex and RGB describe the exact same colour in different notations. A hex code like #5E6AD2 packs the red, green, and blue channels into a six-digit string web browsers understand, while RGB writes them as three numbers from 0 to 255. Converting between them is a routine part of web and design work.',
      'You reach for RGB when you need to tweak a channel numerically or set an alpha value with rgba(), and hex when you want the compact form used across CSS, design tools, and style guides. This converter shows both plus HSL, so you can copy whichever your context wants.',
    ],
    steps: [
      'Enter a hex colour code, with or without the leading #.',
      'The equivalent RGB values are shown instantly.',
      'See HSL and a live colour preview alongside.',
      'Copy the format you need.',
    ],
    faqs: [
      { q: 'How do I convert a hex colour to RGB?', a: 'Each pair of hex digits is one channel in base 16. #FF is 255, so #FF0000 is rgb(255, 0, 0) — pure red. The converter does this for all three channels automatically.' },
      { q: 'What does a 3-digit hex code mean?', a: 'Shorthand hex like #F00 expands each digit to a pair, so #F00 equals #FF0000. This tool accepts both the 3- and 6-digit forms.' },
      { q: 'Can I get an rgba value with transparency?', a: 'Hex itself has no alpha in the standard 6-digit form, so the RGB output is opaque. To add transparency, use the RGB values in an rgba() rule with your chosen alpha.' },
      { q: 'Is my input stored?', a: 'No. The conversion runs entirely in your browser.' },
    ],
  },
  'rgb-to-hex': {
    body: [
      'This converts an RGB colour — three numbers for red, green, and blue — into the six-digit hex code used throughout CSS and design software. Both describe the identical colour; hex is simply the compact form most stylesheets and design tools expect.',
      'It is the everyday direction when you have picked a colour numerically, say from a colour picker or a brand spec given in RGB, and need the hex string to drop into your CSS or share in a style guide.',
    ],
    steps: [
      'Enter the red, green, and blue values (0–255).',
      'The matching hex code appears instantly.',
      'See HSL and a live preview too.',
      'Copy the hex code.',
    ],
    faqs: [
      { q: 'How is an RGB value turned into hex?', a: 'Each channel (0–255) is written as a two-digit base-16 number, then joined. For example, rgb(94, 106, 210) becomes #5E6AD2. The converter handles the base conversion for you.' },
      { q: 'Why do designers prefer hex codes?', a: 'Hex is compact and unambiguous — a single string like #5E6AD2 is easy to copy, share, and paste into CSS or design tools, which is why brand guidelines usually list hex values.' },
      { q: 'What if my RGB numbers are out of range?', a: 'Each channel must be 0–255. Values outside that range are not valid colours; keep them within bounds for an accurate hex result.' },
      { q: 'Is my data private?', a: 'Yes. Conversion happens in your browser only.' },
    ],
  },
  'rgb-to-hsl-hsv': {
    body: [
      'HSL and HSV describe colour the way people think about it — as a hue (the colour itself, around a wheel), plus saturation and either lightness (HSL) or value/brightness (HSV). Converting from RGB into these models makes it far easier to create tints, shades, and harmonious palettes by adjusting one intuitive property at a time.',
      'Designers use HSL when building colour scales, because nudging lightness up or down gives natural tints and shades of the same hue — something that is fiddly to do directly in RGB or hex.',
    ],
    steps: [
      'Enter an RGB colour.',
      'See its HSL and HSV equivalents.',
      'Adjust hue, saturation, or lightness to explore variations.',
      'Copy the values you need.',
    ],
    faqs: [
      { q: 'What is the difference between HSL and HSV?', a: 'Both share hue and saturation, but HSL\'s third value is lightness (0% black, 100% white, 50% the pure colour), while HSV\'s is value/brightness (0% black, 100% the brightest form). They suit slightly different palette workflows.' },
      { q: 'Why convert RGB to HSL?', a: 'HSL makes colour adjustments intuitive — change lightness for tints and shades, or rotate hue for a different colour — which is awkward to do by editing RGB channels directly.' },
      { q: 'What does the hue number mean?', a: 'Hue is an angle from 0 to 360 degrees around the colour wheel: 0 is red, 120 is green, 240 is blue, wrapping back to red at 360.' },
      { q: 'Is my input uploaded?', a: 'No. All conversion runs locally in your browser.' },
    ],
  },
  'cmyk-converter': {
    body: [
      'CMYK — cyan, magenta, yellow, and key (black) — is the colour model used in printing, where inks are layered on white paper. It is subtractive: inks absorb light, so more ink means darker. Screens use additive RGB instead, which is why converting between them is necessary when moving a design from screen to print.',
      'Because the two models cover different ranges of colour, the conversion is an approximation — some vivid RGB colours simply cannot be reproduced with CMYK inks. Treat the result as a close guide and always proof critical print colours.',
    ],
    steps: [
      'Enter an RGB or hex colour.',
      'See the approximate CMYK percentages for printing.',
      'View a live preview of the colour.',
      'Copy the CMYK values for your print workflow.',
    ],
    faqs: [
      { q: 'Why is CMYK conversion only approximate?', a: 'Screens (RGB) and print (CMYK) reproduce colour by different physical means and cover different colour ranges (gamuts). Some bright RGB colours fall outside what CMYK inks can print, so conversion is a best approximation — always proof important colours.' },
      { q: 'What does the K in CMYK stand for?', a: 'K is "key", meaning black. Black ink is added separately rather than mixed from cyan, magenta, and yellow because pure CMY mixing produces a muddy dark brown, and using black ink is cheaper and sharper for text.' },
      { q: 'Should I design in RGB or CMYK?', a: 'Design on screen in RGB for the widest colour range, then convert to CMYK when preparing files for a commercial printer — and check with the printer\'s colour profile for accuracy.' },
      { q: 'Is my data stored?', a: 'No. The conversion runs in your browser only.' },
    ],
  },
  'color-name': {
    body: [
      'This tool identifies the nearest named colour to any hex or RGB value, matching against the 148 standard CSS colour names (like "cornflowerblue" or "tomato"). It is handy when you want a human-readable label for a colour, or a CSS keyword you can use in place of a hex code.',
      'Because named colours are a fixed set, an arbitrary colour rarely matches one exactly — so the tool finds the closest name and tells you how near it is, letting you decide whether the keyword is a good enough substitute.',
    ],
    steps: [
      'Enter a hex code or RGB colour.',
      'The tool finds the closest CSS colour name.',
      'See how close the match is and the exact values.',
      'Copy the name or the precise code.',
    ],
    faqs: [
      { q: 'How many named colours are there in CSS?', a: 'There are 148 standard named colours recognised across browsers, from common ones like "red" and "blue" to specific shades like "mediumaquamarine" and "rebeccapurple".' },
      { q: 'Will my colour match a name exactly?', a: 'Only if it happens to equal one of the 148 defined values. Otherwise the tool reports the nearest name and the distance, so you can judge whether it is close enough to use.' },
      { q: 'Can I use a colour name instead of a hex code in CSS?', a: 'Yes, for the 148 standard names — writing color: tomato is valid CSS. For a precise custom colour, use the hex or RGB value instead.' },
      { q: 'Is my input private?', a: 'Yes. The matching runs entirely in your browser.' },
    ],
  },
  'gradient-generator': {
    body: [
      'A CSS gradient blends smoothly between two or more colours, and this generator builds the exact linear or radial gradient code for you to copy straight into a stylesheet. Gradients add depth to backgrounds, buttons, and hero sections without needing an image file.',
      'You control the colours, their positions (stops), and the angle or shape, and the tool writes standards-compliant CSS. Because a gradient is pure CSS, it scales crisply to any size and adds no download weight to your page.',
    ],
    steps: [
      'Choose your start and end colours, and add more stops if you want.',
      'Set the gradient type (linear or radial) and angle.',
      'Preview the gradient live.',
      'Copy the generated CSS.',
    ],
    faqs: [
      { q: 'What is the difference between a linear and radial gradient?', a: 'A linear gradient blends colours along a straight line at an angle you set, while a radial gradient blends outward from a centre point in a circle or ellipse. Each suits different effects.' },
      { q: 'What are colour stops?', a: 'Stops are the points where each colour sits along the gradient. Positioning them controls how quickly one colour transitions to the next — bunching stops makes a sharper blend.' },
      { q: 'Do CSS gradients work in all browsers?', a: 'Yes. Linear and radial gradients are fully supported in every modern browser and need no image file, so they are lightweight and scale to any size.' },
      { q: 'Is my design uploaded?', a: 'No. The gradient CSS is generated in your browser.' },
    ],
  },
  'color-converter': {
    body: [
      'This all-in-one colour converter shows a single colour in every common format at once — hex, RGB, HSL, and more — so you can grab whichever notation your context needs without switching tools. Pick or type a colour and read all its representations side by side with a live preview.',
      'It is the fast path when you have a colour in one format and need it in another: a hex code from a design tool that your code wants as RGB, or an RGB value you need as HSL to build a tint scale.',
    ],
    steps: [
      'Enter a colour in any supported format, or use the picker.',
      'See it expressed in hex, RGB, HSL, and other formats simultaneously.',
      'Check the live preview.',
      'Copy whichever format you need.',
    ],
    faqs: [
      { q: 'Which colour formats does this convert between?', a: 'It shows hex, RGB, and HSL together for any colour you enter, with a live preview, so you can copy the notation your project requires.' },
      { q: 'Do these formats describe the same colour?', a: 'Yes. Hex, RGB, and HSL are just different notations for the same colour — converting between them does not change the colour, only how it is written.' },
      { q: 'Which format should I use in CSS?', a: 'All are valid in CSS. Hex is compact and common, RGB (and rgba) is handy for transparency, and HSL makes creating tints and shades intuitive. Use whichever fits the task.' },
      { q: 'Is my input stored?', a: 'No. All conversion runs in your browser.' },
    ],
  },

  // --- Generators ---
  'lorem-ipsum': {
    body: [
      'Lorem ipsum is scrambled Latin-like placeholder text used to fill a design before the real copy is ready. It lets designers and developers see how a layout looks with text flowing through it, without the distraction of readable words pulling attention to the content instead of the design.',
      'This generator produces as many paragraphs, sentences, or words as you need. Using placeholder text rather than "content content content" gives a realistic sense of length, rhythm, and line breaks while a page is still being designed.',
    ],
    steps: [
      'Choose how much text you need — paragraphs, sentences, or words.',
      'Set the amount.',
      'The placeholder text is generated instantly.',
      'Copy it into your mockup or template.',
    ],
    faqs: [
      { q: 'What is lorem ipsum and why is it used?', a: 'It is scrambled, meaningless placeholder text based on Latin. Designers use it so a layout can be reviewed for look and spacing without readable words distracting from the design itself.' },
      { q: 'Does lorem ipsum mean anything?', a: 'No. It is deliberately nonsensical, derived from a classical Latin text but jumbled so it reads as neutral filler rather than real content.' },
      { q: 'Can I generate a specific number of words or paragraphs?', a: 'Yes. Choose the unit (words, sentences, or paragraphs) and the count, and the generator produces exactly that much placeholder text.' },
      { q: 'Is anything stored?', a: 'No. The text is generated in your browser and nothing is uploaded.' },
    ],
  },
  'slug-generator': {
    body: [
      'A URL slug is the readable part of a web address that identifies a page — the "url-slug-generator" in this page\'s own URL. A good slug is lowercase, uses hyphens between words, and drops punctuation and accents, which keeps links clean, shareable, and friendly to search engines.',
      'This generator turns any title or phrase into a valid slug: it lowercases the text, replaces spaces with hyphens, strips special characters, and transliterates accented letters. Handy for blog posts, product pages, and any CMS that builds URLs from titles.',
    ],
    steps: [
      'Type or paste your title or phrase.',
      'The slug is generated live — lowercased, hyphenated, cleaned.',
      'Review the result.',
      'Copy it into your URL or CMS field.',
    ],
    faqs: [
      { q: 'What makes a good URL slug?', a: 'Keep it lowercase, short, and descriptive, with hyphens between words and no special characters or spaces. Clean slugs are easier to read, share, and index.' },
      { q: 'Why use hyphens instead of underscores in a slug?', a: 'Search engines treat hyphens as word separators but underscores as joiners, so "url-slug" reads as two words while "url_slug" can read as one. Hyphens are the web standard for slugs.' },
      { q: 'Does the generator handle accented characters?', a: 'Yes. Accented letters are transliterated to their plain equivalents (é becomes e), so the slug stays URL-safe.' },
      { q: 'Is my text uploaded?', a: 'No. The slug is generated in your browser.' },
    ],
  },
  'uuid-generator': {
    body: [
      'A UUID (universally unique identifier) is a 128-bit value written as 36 characters, used to label things — database rows, files, API objects — with an ID that is effectively guaranteed never to collide with another, even when generated independently on different machines. This tool produces version 4 UUIDs, which are random.',
      'The appeal of a UUID is that you can create one anywhere without a central authority handing out numbers, and still be confident it is unique. That makes them ideal for distributed systems, offline record creation, and merging data from multiple sources.',
    ],
    steps: [
      'Open the tool — a UUID is generated immediately.',
      'Generate more, or a batch, as needed.',
      'Each is a random version-4 UUID.',
      'Copy the IDs you need.',
    ],
    faqs: [
      { q: 'Are UUIDs really unique?', a: 'A version-4 UUID has 122 random bits, so the chance of two colliding is astronomically small — you could generate billions and never expect a duplicate. They are treated as unique for all practical purposes.' },
      { q: 'What is a version 4 UUID?', a: 'Version 4 is the random variant, generated from random numbers rather than time or hardware address. It is the most common type because it needs no special inputs and leaks no information.' },
      { q: 'Can I use a UUID as a database key?', a: 'Yes, and it is common in distributed systems because IDs can be created independently without coordination. The trade-off is that UUID keys are larger and less sequential than auto-increment integers.' },
      { q: 'Are the UUIDs generated privately?', a: 'Yes. They are created in your browser using its secure random source and never leave your device.' },
    ],
  },
  'passphrase-generator': {
    body: [
      'A passphrase is a password made of several random words, like "harbor-velvet-mimic-ledger". It is easier for a human to remember than a jumble of symbols yet, because it is long, it is very hard for a computer to crack. This generator picks words at random from a wordlist using your browser\'s secure random source.',
      'The security comes from length and true randomness, not from clever substitutions. Four or five randomly chosen words already give an enormous number of combinations, which is why passphrases are recommended for master passwords you must actually memorise.',
    ],
    steps: [
      'Choose how many words the passphrase should contain.',
      'Pick a separator and any options (capitalisation, a number).',
      'A random passphrase is generated securely.',
      'Copy it and store it in your password manager.',
    ],
    faqs: [
      { q: 'Are passphrases more secure than passwords?', a: 'A random multi-word passphrase can be both more memorable and harder to crack than a short complex password, because its length dramatically increases the possible combinations. The key is that the words are chosen truly at random.' },
      { q: 'How many words should my passphrase have?', a: 'Four words is a reasonable minimum; five or six is stronger, especially for a master password. Each added random word multiplies the difficulty of guessing it.' },
      { q: 'Should I pick the words myself?', a: 'No. Human-chosen words are predictable and much weaker. Let the generator select them randomly — that randomness is what provides the security.' },
      { q: 'Is the passphrase generated privately?', a: 'Yes. It is created in your browser with the secure random generator and never transmitted.' },
    ],
  },
  'pin-generator': {
    body: [
      'A PIN is a short numeric code used for cards, phones, locks, and door entry systems. This generator creates random PINs of the length you choose, using your browser\'s cryptographically secure random source so the digits are genuinely unpredictable rather than a pattern.',
      'Random PINs matter because the most common codes — 1234, 0000, birth years — are the first an attacker tries. A randomly generated PIN avoids those predictable choices while staying the right length for whatever device or account requires it.',
    ],
    steps: [
      'Choose the PIN length (commonly 4 or 6 digits).',
      'Generate one, or several at once.',
      'Each PIN uses secure random digits.',
      'Copy the PIN you need.',
    ],
    faqs: [
      { q: 'What is a secure PIN length?', a: 'Longer is better: a 6-digit PIN has a hundred times more combinations than a 4-digit one. Use the longest length your device or bank allows for sensitive access.' },
      { q: 'Why avoid PINs like 1234 or a birth year?', a: 'Those are the codes attackers guess first because they are extremely common. A randomly generated PIN has no such pattern, making it much harder to guess.' },
      { q: 'Are these PINs truly random?', a: 'Yes. They use the browser\'s cryptographically secure random number generator, not a predictable sequence.' },
      { q: 'Is the PIN sent anywhere?', a: 'No. It is generated in your browser and never leaves your device.' },
    ],
  },
  'api-key-generator': {
    body: [
      'An API key is a long random string used to identify and authorise an application calling a service. This generator produces high-entropy random keys suitable for that purpose, built from your browser\'s secure random source so they cannot be predicted or guessed.',
      'A strong API key needs enough randomness that brute-forcing it is infeasible. This tool creates keys of a configurable length and character set; treat every key as a secret, store it securely, and rotate it if it is ever exposed.',
    ],
    steps: [
      'Choose the key length and character set.',
      'Generate the key.',
      'A secure random string is produced.',
      'Copy it and store it safely as a secret.',
    ],
    faqs: [
      { q: 'What makes an API key secure?', a: 'Length and randomness. A long key drawn from a large character set using a cryptographically secure generator has so many possibilities that guessing it is infeasible.' },
      { q: 'How should I store an API key?', a: 'Treat it like a password: keep it out of source code and public repositories, store it in environment variables or a secrets manager, and rotate it if it may have leaked.' },
      { q: 'Can I generate keys in a specific format?', a: 'You can set the length and character set to match a service\'s requirements. Some services issue keys in their own format, so use their key where one is provided.' },
      { q: 'Are the keys generated privately?', a: 'Yes. They are created in your browser and never transmitted, which is essential for a secret value.' },
    ],
  },
  'jwt-generator': {
    body: [
      'A JSON Web Token (JWT) is a compact, signed token that carries claims — such as a user ID and expiry — between a client and a server. This tool builds a JWT from your header and payload and signs it with the HS256 algorithm using a secret you provide, all in the browser via the Web Crypto API.',
      'JWTs are widely used for stateless authentication: the server can verify the signature to trust the token\'s contents without storing session data. Remember that the payload is only encoded, not encrypted — anyone can read it — so never put secrets in the claims.',
    ],
    steps: [
      'Enter the claims for the payload (and adjust the header if needed).',
      'Provide the signing secret.',
      'The token is signed with HS256 in your browser.',
      'Copy the generated JWT.',
    ],
    faqs: [
      { q: 'Is the data in a JWT encrypted?', a: 'No. The header and payload are only Base64URL-encoded, so anyone with the token can read them. Never put sensitive data in the claims — the signature protects against tampering, not against reading.' },
      { q: 'What does HS256 mean?', a: 'HS256 is HMAC using SHA-256: the token is signed with a shared secret. The same secret is needed to verify it, so keep the secret private on your server.' },
      { q: 'What is a JWT used for?', a: 'Most commonly stateless authentication — after login, the server issues a signed JWT the client sends with each request, letting the server verify identity without storing session state.' },
      { q: 'Is my secret uploaded?', a: 'No. Signing happens in your browser with the Web Crypto API, so your secret and token never leave your device.' },
    ],
  },
  'bcrypt-generator': {
    body: [
      'bcrypt is a password-hashing function designed specifically to store passwords safely. Unlike a fast hash, bcrypt is deliberately slow and includes a built-in salt and an adjustable "cost" factor, which makes large-scale brute-force cracking expensive even if a database is stolen. This tool hashes a password with bcrypt in your browser.',
      'You store the bcrypt hash, never the plain password. When a user logs in, you hash their input and compare — the salt and cost are embedded in the hash itself, so verification needs nothing extra. Raising the cost factor makes hashing slower and hence more resistant to attack.',
    ],
    steps: [
      'Enter the password to hash.',
      'Choose the cost factor (higher is slower and stronger).',
      'The bcrypt hash is computed in your browser.',
      'Copy the hash to store in your database.',
    ],
    faqs: [
      { q: 'Why use bcrypt instead of SHA-256 for passwords?', a: 'General hashes like SHA-256 are fast, which helps attackers try billions of guesses. bcrypt is deliberately slow and salted, making mass cracking far more expensive — exactly what password storage needs.' },
      { q: 'What is the cost factor?', a: 'It controls how much work each hash takes; each increment roughly doubles the time. A higher cost slows attackers but also your own logins, so choose the highest value your server can tolerate.' },
      { q: 'Do I need to store the salt separately?', a: 'No. bcrypt embeds the salt (and cost) inside the resulting hash string, so you store just that one value and verification works automatically.' },
      { q: 'Is my password uploaded?', a: 'No. Hashing runs entirely in your browser, so the password never leaves your device.' },
    ],
  },
  'htpasswd-generator': {
    body: [
      'An .htpasswd file stores usernames and hashed passwords for HTTP Basic Authentication on Apache and Nginx servers. This tool builds a valid htpasswd line — username plus a securely hashed password — that you can paste into the file to protect a directory or admin area.',
      'Because the password is hashed, the file never contains plain-text credentials. Basic Auth is simple and effective for locking down staging sites or internal tools, though it should always be paired with HTTPS so the credentials are not sent in the clear.',
    ],
    steps: [
      'Enter the username and password.',
      'Choose the hashing algorithm (such as bcrypt).',
      'The htpasswd line is generated.',
      'Paste it into your .htpasswd file.',
    ],
    faqs: [
      { q: 'What is an .htpasswd file for?', a: 'It stores credentials for HTTP Basic Authentication, letting Apache or Nginx password-protect a directory, admin panel, or staging site with a login prompt.' },
      { q: 'Is the password stored in plain text?', a: 'No. The generator hashes it, so the .htpasswd file holds only the hash. The original password is never written to the file.' },
      { q: 'Is Basic Auth secure enough?', a: 'It is fine for simple access control, but always serve the protected site over HTTPS — otherwise the credentials travel unencrypted and can be intercepted.' },
      { q: 'Is my password uploaded?', a: 'No. The line is generated in your browser and nothing is sent to a server.' },
    ],
  },
  'username-generator': {
    body: [
      'This generator invents available-looking usernames by combining words, adjectives, and optional numbers into memorable handles. It is handy when your first choice is taken and you need fresh ideas for a new account, gaming profile, or social handle.',
      'A good username is easy to say, type, and remember, and distinctive enough to still be free. The generator gives you a stream of options in different styles so you can pick one that fits the platform and your taste.',
    ],
    steps: [
      'Choose a style or options if offered (length, numbers, theme).',
      'Generate a batch of username ideas.',
      'Scroll through the suggestions.',
      'Copy the one you like and check its availability.',
    ],
    faqs: [
      { q: 'Will the generated username be available?', a: 'The tool creates ideas but cannot check any specific site\'s database, so you should verify availability on the platform. Adding numbers or an extra word improves your chances of finding a free handle.' },
      { q: 'What makes a good username?', a: 'Something easy to remember, spell, and type, and distinctive enough to still be available. Avoid overly long strings or confusing character substitutions.' },
      { q: 'Can I get themed usernames?', a: 'Where the tool offers styles or themes, yes — you can steer the suggestions toward a mood or category to match a gaming, professional, or social context.' },
      { q: 'Is anything stored?', a: 'No. Suggestions are generated in your browser.' },
    ],
  },
  'meta-tag-generator': {
    body: [
      'Meta tags tell search engines and social platforms what a web page is about. This generator builds the essential HTML head tags — title, description, and often viewport and Open Graph tags — from the details you enter, ready to paste into your page\'s <head>.',
      'A well-written title and meta description influence how your page appears in search results and how appealing it looks to click. Getting these right is one of the simplest, highest-impact pieces of on-page SEO.',
    ],
    steps: [
      'Enter your page title, description, and other details.',
      'The corresponding meta tags are generated.',
      'Review the HTML.',
      'Copy it into the <head> of your page.',
    ],
    faqs: [
      { q: 'How long should a meta description be?', a: 'Aim for roughly 150–160 characters. Search engines truncate longer descriptions, so keep the key message near the front and make it compelling to encourage clicks.' },
      { q: 'Do meta tags improve SEO?', a: 'The title and description do not directly boost rankings much, but they strongly affect how your result looks and how many people click it, which matters. Other tags like viewport affect usability.' },
      { q: 'What are Open Graph tags?', a: 'Open Graph tags control how your page looks when shared on social platforms — the title, description, and image in the preview card. Many meta generators include them.' },
      { q: 'Is my input uploaded?', a: 'No. The tags are generated in your browser.' },
    ],
  },
  'open-graph-generator': {
    body: [
      'Open Graph tags control the preview card that appears when your page is shared on social media and messaging apps — the title, description, and image people see before they click. This generator builds the correct og: meta tags from your inputs so shared links look polished instead of bare.',
      'Without Open Graph tags, platforms guess at your preview, often picking the wrong image or text. Setting them explicitly makes your links more inviting and consistent across Facebook, LinkedIn, and other services that read the protocol.',
    ],
    steps: [
      'Enter your title, description, image URL, and page URL.',
      'The Open Graph meta tags are generated.',
      'Review the HTML.',
      'Paste it into your page\'s <head>.',
    ],
    faqs: [
      { q: 'What are Open Graph tags?', a: 'They are meta tags (prefixed og:) that tell social platforms how to display your page when shared — controlling the preview title, description, and image in the link card.' },
      { q: 'What image size works best for Open Graph?', a: 'A common recommendation is 1200×630 pixels, which displays cleanly as a large card on most platforms. Smaller images may be cropped or shown as thumbnails.' },
      { q: 'Do I still need a regular meta description?', a: 'Yes. Open Graph controls social previews, while the standard meta description serves search engines. It is good practice to set both.' },
      { q: 'Is my data stored?', a: 'No. The tags are generated in your browser.' },
    ],
  },
  'robots-txt-generator': {
    body: [
      'A robots.txt file sits at the root of a site and tells search-engine crawlers which paths they may or may not access. This generator builds a valid robots.txt from simple choices — which user agents to address, which directories to disallow, and where your sitemap lives.',
      'It is a guidance file, not a security control: well-behaved crawlers obey it, but it cannot force compliance and should never be used to hide sensitive pages. Its real job is steering crawlers away from low-value or duplicate areas so they spend their crawl budget on pages that matter.',
    ],
    steps: [
      'Choose which crawlers the rules apply to.',
      'List any paths to disallow (or allow).',
      'Add your sitemap URL.',
      'Copy the generated robots.txt to your site root.',
    ],
    faqs: [
      { q: 'What does robots.txt do?', a: 'It instructs search-engine crawlers which parts of your site they may crawl. It helps steer crawl budget toward important pages and away from duplicate or low-value ones.' },
      { q: 'Can robots.txt hide a page from the public?', a: 'No. It only requests that compliant crawlers skip a path — the file is public and anyone can read it. Use real authentication to protect private content.' },
      { q: 'Does disallowing a page remove it from search results?', a: 'Not reliably. Blocking crawling can still leave a URL indexed without a description. To keep a page out of results, use a noindex tag instead of, or alongside, robots rules.' },
      { q: 'Is my input uploaded?', a: 'No. The file is generated in your browser.' },
    ],
  },
  'htaccess-generator': {
    body: [
      'An .htaccess file configures the Apache web server on a per-directory basis — handling redirects, URL rewriting, access rules, custom error pages, and more. This generator produces common .htaccess snippets from your choices so you do not have to memorise the exact syntax.',
      'Because .htaccess changes take effect immediately without restarting the server, it is a convenient way to add redirects or protections. Its rules can be finicky, though, so always keep a backup and test after changing anything, since a syntax error can take a site offline.',
    ],
    steps: [
      'Choose the rule type (redirect, rewrite, block, error page).',
      'Enter the relevant paths or conditions.',
      'The .htaccess snippet is generated.',
      'Add it to your .htaccess file and test.',
    ],
    faqs: [
      { q: 'What is an .htaccess file used for?', a: 'On Apache servers it configures per-directory behaviour such as redirects, URL rewriting, access restrictions, and custom error pages, without editing the main server config.' },
      { q: 'Will .htaccess work on any server?', a: 'Only on Apache (and some compatible servers) with the file feature enabled. Nginx and others use different configuration and ignore .htaccess.' },
      { q: 'How do I set up a 301 redirect in .htaccess?', a: 'A 301 permanent redirect maps an old URL to a new one so visitors and search engines follow the move. This generator can produce the correct Redirect or RewriteRule line for you.' },
      { q: 'Is my configuration stored?', a: 'No. Snippets are generated in your browser.' },
    ],
  },
  'gitignore-generator': {
    body: [
      'A .gitignore file tells Git which files and folders to leave out of version control — build outputs, dependency folders, logs, editor settings, and secrets. This generator assembles a .gitignore tailored to the languages and tools your project uses, so you start with sensible rules instead of a blank file.',
      'Keeping generated and local files out of the repository keeps it clean, smaller, and free of machine-specific clutter — and, crucially, helps avoid committing secrets or huge dependency directories that should never be tracked.',
    ],
    steps: [
      'Select the languages, frameworks, and tools your project uses.',
      'The matching ignore rules are combined.',
      'Review the generated .gitignore.',
      'Save it at the root of your repository.',
    ],
    faqs: [
      { q: 'What should go in a .gitignore file?', a: 'Anything that should not be version-controlled: dependency folders (like node_modules), build artefacts, logs, local editor and OS files, and secret or environment files.' },
      { q: 'Why not commit node_modules or build folders?', a: 'They are large, machine-generated, and reproducible from your source and lockfiles. Committing them bloats the repository and causes needless merge conflicts.' },
      { q: 'Does .gitignore remove files already tracked?', a: 'No. It only prevents untracked files from being added. To stop tracking a file already committed, you must remove it from the index separately.' },
      { q: 'Is my selection uploaded?', a: 'No. The file is generated in your browser.' },
    ],
  },
  'random-string-generator': {
    body: [
      'This tool generates random strings of a length and character set you choose — letters, numbers, symbols, or any mix. It draws from your browser\'s secure random source, making the output suitable for tokens, test data, temporary passwords, or any place you need unpredictable text.',
      'Being able to control length and which characters are allowed matters because different systems have different rules — some want only alphanumerics, others require symbols. The generator lets you match those constraints while keeping the result genuinely random.',
    ],
    steps: [
      'Choose the string length.',
      'Select which character types to include.',
      'Generate one or many strings.',
      'Copy the result.',
    ],
    faqs: [
      { q: 'Are the random strings secure?', a: 'Yes. They are generated with the browser\'s cryptographically secure random source, so they are suitable for tokens and temporary secrets, not just casual use.' },
      { q: 'Can I choose which characters to include?', a: 'Yes. Toggle uppercase, lowercase, numbers, and symbols to match a system\'s requirements, and set the exact length you need.' },
      { q: 'What can I use random strings for?', a: 'Common uses include tokens, temporary passwords, test and sample data, unique identifiers, and cache-busting values.' },
      { q: 'Is anything sent to a server?', a: 'No. Strings are generated entirely in your browser.' },
    ],
  },
  'dice-roller': {
    body: [
      'This dice roller simulates rolling dice of any number of sides, from a standard six-sided die to the d20 and other polyhedral dice used in tabletop role-playing games. It uses your browser\'s random source, so each roll is fair and independent — no physical dice required.',
      'It is handy when you have lost your dice, need many dice at once, or want unusual types like a d100. You choose how many dice and how many sides, roll, and see each result plus the total.',
    ],
    steps: [
      'Choose the number of sides per die.',
      'Choose how many dice to roll.',
      'Roll.',
      'Read each die\'s result and the total.',
    ],
    faqs: [
      { q: 'Are the dice rolls fair?', a: 'Yes. Each roll uses the browser\'s random generator so every face is equally likely and rolls are independent, just like fair physical dice.' },
      { q: 'Can I roll polyhedral dice like a d20?', a: 'Yes. Set the number of sides to 4, 6, 8, 10, 12, 20, 100, or any value you need for tabletop games.' },
      { q: 'Can I roll several dice at once?', a: 'Yes. Choose how many dice to roll together and the tool shows each result and the combined total.' },
      { q: 'Is the roll generated locally?', a: 'Yes. Everything happens in your browser.' },
    ],
  },
  'coin-flip': {
    body: [
      'This tool flips a virtual coin, returning heads or tails at random with an even chance of each. It is the quick way to make a fair 50/50 decision, settle a friendly dispute, or run a demonstration of probability when no real coin is at hand.',
      'Each flip uses your browser\'s random source, so results are unbiased and independent — a run of heads does not make tails "due" next, just as with a real coin. You can flip repeatedly and, in many versions, see a tally of the results.',
    ],
    steps: [
      'Open the tool.',
      'Flip the coin.',
      'Read the heads-or-tails result.',
      'Flip again as many times as you like.',
    ],
    faqs: [
      { q: 'Is the coin flip truly 50/50?', a: 'Yes. Heads and tails are equally likely on each flip, using the browser\'s random generator, with no bias toward either outcome.' },
      { q: 'After several heads, is tails more likely next?', a: 'No. Each flip is independent, so previous results do not change the odds — the next flip is still 50/50. Expecting otherwise is the gambler\'s fallacy.' },
      { q: 'Can I flip many coins at once?', a: 'Depending on the version, you can flip repeatedly and often see a running tally of heads versus tails.' },
      { q: 'Is the flip done locally?', a: 'Yes. It runs entirely in your browser.' },
    ],
  },
  'barcode-generator': {
    body: [
      'This tool generates retail and industrial barcodes — such as UPC, EAN, and Code 128 — from the number or text you enter, and lets you download the result as an image. Barcodes encode data into a pattern of bars that a scanner reads instantly, which is why they are everywhere in retail, inventory, and shipping.',
      'You pick the barcode type your use case needs and enter the value; the tool renders a scannable image you can print on labels or embed in documents. Different symbologies suit different data — retail products use UPC/EAN, while Code 128 handles arbitrary alphanumeric text.',
    ],
    steps: [
      'Choose the barcode type (UPC, EAN, Code 128, and more).',
      'Enter the number or text to encode.',
      'The barcode image is rendered.',
      'Download it as an image to print or embed.',
    ],
    faqs: [
      { q: 'Which barcode type should I use?', a: 'Use UPC or EAN for retail products (they encode a fixed-length product number), and Code 128 for general alphanumeric data like internal SKUs or tracking codes. Pick the symbology your scanner and system expect.' },
      { q: 'Will the generated barcode actually scan?', a: 'Yes, provided the value fits the chosen symbology\'s rules and you print it at a sufficient size and contrast. Very small or low-resolution prints can be hard to scan.' },
      { q: 'What is the difference between UPC and EAN?', a: 'UPC is the 12-digit standard common in North America; EAN is the 13-digit international version. They are closely related and most scanners read both.' },
      { q: 'Is my data uploaded?', a: 'No. The barcode is generated in your browser and the value never leaves your device.' },
    ],
  },

  // --- More calculators ---
  'body-fat-calculator': {
    body: [
      'Body fat percentage tells you what proportion of your weight is fat versus everything else — muscle, bone, water, and organs. It is often a more useful health and fitness measure than weight or BMI alone, because two people at the same weight can have very different amounts of fat. This calculator uses the US Navy method, which estimates body fat from a few tape measurements.',
      'The US Navy formula uses circumference measurements (waist, neck, and for women the hips) along with height. It is a practical estimate rather than a lab-grade reading, so treat the result as a guide for tracking change over time rather than an exact figure.',
    ],
    steps: [
      'Select your sex and enter your height.',
      'Measure and enter your neck and waist (and hips for women).',
      'The calculator estimates your body fat percentage.',
      'Track the number over time to gauge progress.',
    ],
    faqs: [
      { q: 'How accurate is the US Navy body fat method?', a: 'It is a reasonable estimate — typically within a few percent of more precise methods — as long as you measure carefully. It is best used to track changes over time rather than as an exact clinical value.' },
      { q: 'What is a healthy body fat percentage?', a: 'Healthy ranges differ by sex and age, but broadly around 10–20% for men and 18–28% for women is often cited as healthy. Athletes are usually lower. Consult a professional for guidance specific to you.' },
      { q: 'Why measure body fat instead of just weight?', a: 'Weight cannot tell fat from muscle. Body fat percentage shows body composition, so you can see whether you are losing fat while keeping muscle — which weight alone hides.' },
      { q: 'Is my data stored?', a: 'No. The calculation runs in your browser and nothing is uploaded.' },
    ],
  },
  'ideal-weight-calculator': {
    body: [
      'An ideal weight calculator estimates a healthy target weight for your height and sex using established formulas (such as Devine, Robinson, and Hamwi). These give a reference range rather than a single correct number, since a healthy weight also depends on build, muscle, and individual factors.',
      'The result is a useful starting point for setting goals, but it is not a verdict. Someone muscular may sit above the "ideal" and still be healthy, so pair the figure with other measures like body fat percentage and how you feel.',
    ],
    steps: [
      'Enter your height and select your sex.',
      'The calculator applies standard ideal-weight formulas.',
      'Read the estimated healthy weight range.',
      'Use it as a reference alongside other health measures.',
    ],
    faqs: [
      { q: 'How is ideal weight calculated?', a: 'It uses formulas based mainly on height and sex, such as the Devine and Robinson equations. Different formulas give slightly different numbers, which is why a range is more meaningful than a single value.' },
      { q: 'Is ideal weight the same as a healthy weight?', a: 'Not exactly. It is a statistical reference; a healthy weight also depends on your build, muscle mass, and overall health. A muscular person may weigh more and still be healthy.' },
      { q: 'Should I aim exactly for my ideal weight?', a: 'Treat it as a guide, not a strict target. Focus on healthy habits and use body composition and how you feel alongside the number rather than chasing an exact figure.' },
      { q: 'Is my data private?', a: 'Yes. The calculation runs entirely in your browser.' },
    ],
  },
  'macro-calculator': {
    body: [
      'Macros — short for macronutrients — are protein, carbohydrates, and fat, the three nutrients that supply calories. A macro calculator works out how many grams of each to eat per day based on your calorie needs and goal, whether that is losing fat, maintaining, or building muscle.',
      'It starts from your estimated daily calories, then splits them into macro targets using ratios suited to your goal. Tracking macros rather than just calories helps ensure you get enough protein to preserve muscle and enough of each nutrient to feel and perform well.',
    ],
    steps: [
      'Enter your details and activity level to estimate daily calories.',
      'Choose your goal (lose, maintain, or gain).',
      'The calculator splits calories into protein, carb, and fat grams.',
      'Use the gram targets to plan your meals.',
    ],
    faqs: [
      { q: 'What are macros and why track them?', a: 'Macros are protein, carbohydrate, and fat — the calorie-providing nutrients. Tracking them, not just total calories, helps ensure adequate protein for muscle and a balance that supports your energy and goals.' },
      { q: 'How much protein should I eat?', a: 'A common range is about 1.6–2.2 grams per kilogram of body weight for those exercising or trying to preserve muscle while losing fat. The calculator suggests a target based on your inputs.' },
      { q: 'Do macro ratios change with my goal?', a: 'Yes. Fat loss, maintenance, and muscle gain use different calorie levels and often different splits — for example, higher protein when cutting to protect muscle. The tool adjusts accordingly.' },
      { q: 'Is my data stored?', a: 'No. Everything is calculated in your browser.' },
    ],
  },
  'scientific-calculator': {
    body: [
      'A scientific calculator handles far more than arithmetic — trigonometry, logarithms, exponents, roots, and constants like π and e — while respecting the correct order of operations. This one evaluates expressions you type, so you can enter a whole formula and get the answer in one step.',
      'It parses your input safely rather than using the browser\'s eval, so a mistyped expression gives a clear error instead of unexpected behaviour. That makes it reliable for maths homework, engineering checks, and any calculation with parentheses and functions.',
    ],
    steps: [
      'Type a mathematical expression, using functions like sin, log, or sqrt.',
      'Use parentheses to control the order of operations.',
      'The result is calculated as you go.',
      'Copy the answer if you need it elsewhere.',
    ],
    faqs: [
      { q: 'What functions does the scientific calculator support?', a: 'It handles trigonometric functions, logarithms, exponents and powers, square and other roots, and constants such as π and e, all following standard order of operations.' },
      { q: 'How does it handle order of operations?', a: 'It follows the standard precedence (parentheses, exponents, multiplication and division, then addition and subtraction), so complex expressions evaluate the way you would expect on paper.' },
      { q: 'Are angles in degrees or radians?', a: 'Trigonometric functions typically expect radians by default in most calculators; check the tool\'s mode setting if it offers one, and convert if you are working in degrees.' },
      { q: 'Is my input uploaded?', a: 'No. Calculations run entirely in your browser.' },
    ],
  },
  'fraction-calculator': {
    body: [
      'A fraction calculator adds, subtracts, multiplies, and divides fractions and gives the answer as a simplified fraction — handling the common-denominator and reducing steps that make fraction arithmetic fiddly by hand. It also converts between improper fractions and mixed numbers.',
      'It is useful for cooking measurements, woodworking and construction where inches are divided into fractions, and schoolwork. Because it keeps exact fractional values rather than rounding to decimals, the results stay precise.',
    ],
    steps: [
      'Enter the two fractions.',
      'Choose the operation (add, subtract, multiply, divide).',
      'The calculator computes and simplifies the result.',
      'Read the answer as a fraction and, where relevant, a mixed number.',
    ],
    faqs: [
      { q: 'How do you add fractions with different denominators?', a: 'You convert them to a common denominator, add the numerators, then simplify. The calculator does all of this automatically and gives the reduced result.' },
      { q: 'What is the difference between an improper fraction and a mixed number?', a: 'An improper fraction has a numerator larger than its denominator (like 7/4); a mixed number writes the same value as a whole number and a fraction (1 3/4). The tool can show both.' },
      { q: 'Does it simplify the answer automatically?', a: 'Yes. Results are reduced to lowest terms, so 2/4 is shown as 1/2, giving you the simplest exact form.' },
      { q: 'Is my input stored?', a: 'No. The calculation runs in your browser.' },
    ],
  },
  'standard-deviation-calculator': {
    body: [
      'Standard deviation measures how spread out a set of numbers is around their average. A small standard deviation means the values cluster near the mean; a large one means they are widely scattered. This calculator computes it for a list of numbers you enter, along with the mean and variance.',
      'It matters because two datasets can share the same average yet behave completely differently — test scores tightly bunched around 70 versus scores swinging from 30 to 100. Standard deviation captures that difference, which is central to statistics, quality control, and finance.',
    ],
    steps: [
      'Enter your numbers, separated by commas or new lines.',
      'Choose population or sample standard deviation if prompted.',
      'The calculator computes the mean, variance, and standard deviation.',
      'Read the results.',
    ],
    faqs: [
      { q: 'What is the difference between population and sample standard deviation?', a: 'Population standard deviation divides by the number of values (N); sample divides by N−1 to correct for estimating from a sample. Use sample when your data is a subset of a larger group.' },
      { q: 'What does a high standard deviation mean?', a: 'It means the values are widely spread from the average. A low standard deviation means they cluster closely around the mean.' },
      { q: 'How is standard deviation related to variance?', a: 'Standard deviation is the square root of the variance. Variance is in squared units, so standard deviation is often preferred because it is in the same units as the data.' },
      { q: 'Is my data uploaded?', a: 'No. All statistics are computed in your browser.' },
    ],
  },
  'gpa-calculator': {
    body: [
      'A GPA (grade point average) calculator converts your course grades into a single averaged number on a points scale, weighting each course by its credit hours. It saves you from manually multiplying grades by credits and dividing — and lets you see instantly how a new grade will move your average.',
      'Because courses with more credit hours count more, a large course carries more weight than a small one. Entering your courses shows both your term GPA and, if you include past results, your cumulative average.',
    ],
    steps: [
      'Enter each course\'s grade and its credit hours.',
      'Add all your courses.',
      'The calculator weights grades by credits and averages them.',
      'Read your GPA.',
    ],
    faqs: [
      { q: 'How is GPA calculated?', a: 'Each grade is converted to grade points, multiplied by the course\'s credit hours, and the total is divided by the total credit hours. This weights bigger courses more heavily than smaller ones.' },
      { q: 'What is the difference between weighted and unweighted GPA?', a: 'Unweighted GPA treats all courses on the same scale (often up to 4.0), while weighted GPA gives extra points for harder courses like honours or AP. Check which your school uses.' },
      { q: 'Why do credit hours matter for GPA?', a: 'Courses with more credit hours contribute more to your average, so a strong grade in a large course helps more — and a weak one hurts more — than in a small course.' },
      { q: 'Is my data private?', a: 'Yes. The calculation runs in your browser.' },
    ],
  },
  'sales-tax-calculator': {
    body: [
      'A sales tax calculator works out the tax added to a purchase and the final total, given a price and a tax rate. It can also work backwards to find the pre-tax price from a total. Handy for shoppers checking a receipt and for sellers quoting tax-inclusive prices.',
      'Sales tax rates vary widely by country, state, and even city, so the calculator lets you enter whatever rate applies. Enter the price and rate to see the tax amount and the grand total at a glance.',
    ],
    steps: [
      'Enter the price before tax.',
      'Enter the sales tax rate as a percentage.',
      'The calculator shows the tax amount and total.',
      'Read the final price.',
    ],
    faqs: [
      { q: 'How do I calculate sales tax on a price?', a: 'Multiply the price by the tax rate as a decimal to get the tax, then add it to the price. For example, 8% tax on $50 is $4, giving a $54 total. The calculator does this instantly.' },
      { q: 'Can it find the pre-tax price from a total?', a: 'Yes, by reversing the calculation — dividing the total by one plus the tax rate. This is useful when a receipt shows only the tax-inclusive amount.' },
      { q: 'Why do sales tax rates vary so much?', a: 'Rates are set at national, state, and local levels, so they differ by location. Enter the exact rate that applies to your purchase for an accurate result.' },
      { q: 'Is my data stored?', a: 'No. The calculation runs in your browser.' },
    ],
  },
  'simple-interest-calculator': {
    body: [
      'Simple interest is calculated only on the original principal, never on interest already earned. This calculator finds the interest and total from a principal, an annual rate, and a time period. It is the model used for many short-term loans, some savings products, and everyday interest estimates.',
      'The contrast with compound interest is important: simple interest grows in a straight line, so over long periods it yields much less than compounding. For short terms the difference is small, which is why simple interest is common for brief loans.',
    ],
    steps: [
      'Enter the principal amount.',
      'Enter the annual interest rate and the time period.',
      'The calculator computes the interest and total.',
      'Read the results.',
    ],
    faqs: [
      { q: 'How is simple interest calculated?', a: 'Multiply the principal by the annual rate and by the time in years: Interest = Principal × Rate × Time. The total is the principal plus that interest.' },
      { q: 'What is the difference between simple and compound interest?', a: 'Simple interest is charged only on the original principal, while compound interest is charged on the principal plus accumulated interest. Compound grows faster, especially over long periods.' },
      { q: 'When is simple interest used?', a: 'It is common for short-term loans, some car loans, and quick interest estimates, where the straightforward calculation and short term make compounding\'s effect minor.' },
      { q: 'Is my data private?', a: 'Yes. Calculations run in your browser.' },
    ],
  },
  'investment-calculator': {
    body: [
      'An investment calculator projects how your money could grow over time given a starting amount, regular contributions, an expected annual return, and a time horizon. It shows the future value and how much of it comes from your contributions versus compounding growth.',
      'Seeing contributions and growth separately makes the power of time and consistency clear: over long horizons, compounding returns can eventually dwarf the money you put in. Bear in mind the projection assumes a steady return, whereas real markets fluctuate, so treat it as an estimate.',
    ],
    steps: [
      'Enter your initial investment.',
      'Add your regular contribution and its frequency.',
      'Enter the expected annual return and the time horizon.',
      'Read the projected future value and growth breakdown.',
    ],
    faqs: [
      { q: 'How does an investment calculator work?', a: 'It compounds your starting amount and regular contributions at the expected annual return over your time horizon, showing the projected total and how much comes from growth versus what you contributed.' },
      { q: 'Is the projected return guaranteed?', a: 'No. It assumes a constant annual return for illustration, but real investments rise and fall. Use the result as an estimate, and consider a range of return assumptions.' },
      { q: 'Why do regular contributions matter so much?', a: 'Consistent contributions add capital that then compounds too. Over long periods, steady investing often builds more wealth than a larger one-off amount left alone.' },
      { q: 'Is my data stored?', a: 'No. The projection is calculated in your browser.' },
    ],
  },
  'auto-loan-calculator': {
    body: [
      'An auto loan calculator estimates the monthly payment on a car loan from the amount financed, the interest rate, and the loan term, using standard amortisation. It also shows the total interest you will pay, which helps you see the real cost of financing beyond the sticker price.',
      'Because a car loses value while you pay off the loan, the term and rate matter a lot. A longer term lowers the monthly payment but increases total interest and the time you owe more than the car is worth. Factoring in your down payment and any trade-in gives a truer picture.',
    ],
    steps: [
      'Enter the car price minus any down payment or trade-in.',
      'Enter the interest rate and loan term.',
      'The calculator shows your monthly payment.',
      'Review the total interest over the loan.',
    ],
    faqs: [
      { q: 'How is my car loan payment calculated?', a: 'It uses standard amortisation, spreading the financed amount plus interest into equal monthly payments across the term based on the rate and number of months.' },
      { q: 'Does a longer auto loan term save money?', a: 'It lowers the monthly payment but increases total interest, and you stay "upside down" — owing more than the car is worth — for longer. Shorter terms cost less overall.' },
      { q: 'Should I make a down payment?', a: 'A larger down payment reduces the amount financed, lowering both your monthly payment and total interest, and reduces the risk of owing more than the car\'s value.' },
      { q: 'Is my financial data private?', a: 'Yes. Everything is calculated in your browser.' },
    ],
  },

  // --- Dev & text tools ---
  'text-diff': {
    body: [
      'A text diff tool compares two blocks of text and highlights exactly what changed — which lines or words were added, removed, or kept. It saves you from squinting at two nearly identical documents trying to spot the difference by eye.',
      'Developers use it to review code and config changes, writers to compare draft versions, and anyone to check what edited between two copies of a document. This one runs in your browser, so even sensitive text stays on your device.',
    ],
    steps: [
      'Paste the original text on one side.',
      'Paste the changed text on the other.',
      'The differences are highlighted automatically.',
      'Review the additions and deletions.',
    ],
    faqs: [
      { q: 'What does a text diff show?', a: 'It highlights what differs between two texts — additions, deletions, and unchanged parts — usually line by line or word by word, so you can see exactly what changed.' },
      { q: 'Can I compare code with it?', a: 'Yes. It works on any plain text, including source code and configuration files, making it handy for reviewing changes before committing them.' },
      { q: 'Does it change my text?', a: 'No. It only compares and highlights; your original and changed text are left exactly as you pasted them.' },
      { q: 'Is my text uploaded?', a: 'No. The comparison runs in your browser, so even confidential text stays private.' },
    ],
  },
  'regex-tester': {
    body: [
      'A regex tester lets you write a regular expression and immediately see what it matches in a block of sample text, with matches highlighted. Regular expressions are powerful but easy to get wrong, and testing interactively is far faster than guessing and re-running code.',
      'It typically shows capture groups and match positions, and lets you toggle flags like global and case-insensitive. Whether you are validating input, extracting data, or search-and-replacing, testing the pattern here first saves debugging time later.',
    ],
    steps: [
      'Enter your regular expression.',
      'Set any flags (global, case-insensitive, multiline).',
      'Paste the text to test against.',
      'See matches and capture groups highlighted live.',
    ],
    faqs: [
      { q: 'What are regex flags like g and i?', a: 'Flags modify matching: g (global) finds all matches not just the first, i makes it case-insensitive, and m (multiline) changes how ^ and $ behave. Toggle them to match your needs.' },
      { q: 'What is a capture group?', a: 'Parentheses in a pattern create a capture group, which extracts the matched part for reuse — useful for pulling specific pieces out of text, like the year from a date.' },
      { q: 'Does this use JavaScript regex syntax?', a: 'It tests patterns using the browser\'s regular expression engine (JavaScript flavour). Most syntax is common across languages, but some features differ, so verify in your target language for edge cases.' },
      { q: 'Is my text uploaded?', a: 'No. Matching runs entirely in your browser.' },
    ],
  },
  'timestamp-converter': {
    body: [
      'A Unix timestamp is the number of seconds since 1 January 1970 (UTC), a compact way computers store time. This converter translates a timestamp into a human-readable date and time, and converts a date back into a timestamp — bridging how machines and people express time.',
      'Developers hit timestamps constantly in logs, databases, and APIs. Converting quickly between the raw number and a readable date, in your local time or UTC, removes a common source of confusion when debugging.',
    ],
    steps: [
      'Enter a Unix timestamp, or a human date.',
      'The tool converts to the other format.',
      'View the result in UTC and your local time.',
      'Copy whichever value you need.',
    ],
    faqs: [
      { q: 'What is a Unix timestamp?', a: 'It is the number of seconds elapsed since midnight UTC on 1 January 1970, known as the Unix epoch. It gives computers a simple, timezone-independent way to represent a moment in time.' },
      { q: 'Is the timestamp in seconds or milliseconds?', a: 'Unix timestamps are traditionally in seconds, but JavaScript and some systems use milliseconds (1000× larger). Check the length — 10 digits is usually seconds, 13 is milliseconds.' },
      { q: 'Does the converter handle time zones?', a: 'Yes. It shows the date in UTC and in your local time zone, which helps avoid off-by-hours errors when debugging.' },
      { q: 'Is my input uploaded?', a: 'No. Conversion runs in your browser.' },
    ],
  },
  'number-base-converter': {
    body: [
      'This tool converts numbers between bases — binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Different bases are used in different contexts: binary is how computers store data, hex is a compact way to write binary, and decimal is what people use daily.',
      'Programmers convert between bases when working with bitmasks, colours, memory addresses, and low-level data. Entering a number in one base shows it instantly in the others, removing manual conversion errors.',
    ],
    steps: [
      'Enter a number and select its current base.',
      'The tool converts it to the other bases.',
      'Read the binary, octal, decimal, and hexadecimal forms.',
      'Copy the representation you need.',
    ],
    faqs: [
      { q: 'Why convert between number bases?', a: 'Different bases suit different tasks: binary reflects how computers store data, hexadecimal compactly represents binary (as in colour codes and memory addresses), and decimal is for everyday use. Converting bridges them.' },
      { q: 'How does hexadecimal relate to binary?', a: 'Each hex digit represents exactly four binary bits, so hex is a shorthand for binary — two hex digits make one byte. That is why hex is common in programming.' },
      { q: 'What bases does this support?', a: 'It handles binary (2), octal (8), decimal (10), and hexadecimal (16), the bases most used in computing.' },
      { q: 'Is my input stored?', a: 'No. Conversion runs entirely in your browser.' },
    ],
  },
  'markdown-previewer': {
    body: [
      'Markdown is a lightweight way to format text using plain characters — # for headings, ** for bold, - for lists — that converts to clean HTML. This previewer renders your Markdown live as you type, so you can see exactly how it will look before publishing.',
      'It is ideal for drafting README files, documentation, forum posts, and notes, where you want formatting without writing HTML. Seeing the rendered result side by side helps you catch mistakes and get the structure right.',
    ],
    steps: [
      'Type or paste Markdown into the editor.',
      'The formatted preview updates live.',
      'Adjust your Markdown until it looks right.',
      'Copy the Markdown, or the rendered output, as needed.',
    ],
    faqs: [
      { q: 'What is Markdown used for?', a: 'It is a simple formatting syntax that converts to HTML, widely used for README files, documentation, forum and chat posts, and notes — anywhere you want formatting without writing raw HTML.' },
      { q: 'How do I make text bold or italic in Markdown?', a: 'Wrap text in double asterisks for bold (**bold**) and single asterisks or underscores for italic (*italic*). The previewer shows the result instantly.' },
      { q: 'Does Markdown support tables and code?', a: 'Yes. Most Markdown supports tables, fenced code blocks, links, images, and lists. The previewer renders these so you can confirm the layout.' },
      { q: 'Is my text uploaded?', a: 'No. Rendering happens in your browser, so your content stays private.' },
    ],
  },
  'number-to-words': {
    body: [
      'This tool converts a number into its written-out words — 1234 becomes "one thousand two hundred thirty-four". It is essential for writing cheques, legal documents, and invoices, where amounts must appear in words to prevent tampering and ambiguity.',
      'It handles large numbers and, in currency mode, formats an amount as money with the correct units (dollars and cents, for example). Writing numbers out by hand is error-prone for big figures, so automating it avoids mistakes.',
    ],
    steps: [
      'Enter the number you want written out.',
      'Choose plain or currency mode if offered.',
      'The words are generated instantly.',
      'Copy the text for your cheque, invoice, or document.',
    ],
    faqs: [
      { q: 'Why write numbers as words?', a: 'On cheques, contracts, and invoices, amounts in words prevent tampering and remove ambiguity — a written "one hundred" cannot be altered to another figure as easily as a numeral.' },
      { q: 'Can it handle very large numbers?', a: 'Yes. It converts large figures into words with the correct place names (thousand, million, billion, and beyond), which is tedious and error-prone to do by hand.' },
      { q: 'Does it support currency amounts?', a: 'In currency mode it formats the number as money, writing out the main units and the fractional part (for example dollars and cents) in the standard cheque style.' },
      { q: 'Is my input uploaded?', a: 'No. The conversion runs in your browser.' },
    ],
  },
  'sql-formatter': {
    body: [
      'A SQL formatter takes a cramped or minified query and reformats it with consistent indentation, capitalised keywords, and clear line breaks, making it far easier to read and debug. Long queries with nested subqueries and many joins are especially hard to follow without formatting.',
      'It is a read-and-understand aid: the formatter changes only layout, never the query\'s meaning, so the results it produces are identical to the original. Cleanly formatted SQL is easier to review, share, and maintain.',
    ],
    steps: [
      'Paste your SQL query.',
      'Click format.',
      'The query is reindented with clear structure and keyword casing.',
      'Copy the formatted SQL.',
    ],
    faqs: [
      { q: 'Does formatting change what my SQL query does?', a: 'No. A formatter only changes whitespace, line breaks, and keyword casing — the query\'s logic and results are exactly the same as before.' },
      { q: 'Why format SQL?', a: 'Readable SQL is easier to debug, review, and maintain. Consistent indentation and line breaks make complex joins and subqueries much easier to follow.' },
      { q: 'Does it work with different SQL dialects?', a: 'It formats standard SQL syntax common across dialects. Some database-specific features may format differently, but the structure and readability improvements apply broadly.' },
      { q: 'Is my query uploaded?', a: 'No. Formatting runs entirely in your browser, so your SQL stays private.' },
    ],
  },
  'json-to-typescript': {
    body: [
      'This tool generates TypeScript interfaces from a sample of JSON, inferring the type of each field automatically. Instead of hand-writing types to match an API response, you paste the JSON and get ready-to-use interface definitions, saving time and avoiding mismatches.',
      'It infers strings, numbers, booleans, arrays, and nested objects, producing typed structures you can drop into your codebase. This gives you compile-time safety and editor autocompletion when working with data whose shape you already know from an example.',
    ],
    steps: [
      'Paste a representative JSON sample.',
      'The tool infers the types of each field.',
      'TypeScript interfaces are generated.',
      'Copy them into your project.',
    ],
    faqs: [
      { q: 'How does it infer types from JSON?', a: 'It examines each value in the sample — strings, numbers, booleans, arrays, and nested objects — and generates matching TypeScript types, building interfaces for nested structures automatically.' },
      { q: 'Will the generated types be perfectly accurate?', a: 'They match the sample you provide, so use a representative example. Fields that are optional or can hold multiple types may need manual adjustment, since one sample cannot show every possibility.' },
      { q: 'Why generate TypeScript types from JSON?', a: 'It gives you compile-time checking and editor autocompletion for API data, catching mistakes early — far faster than writing the interfaces by hand.' },
      { q: 'Is my JSON uploaded?', a: 'No. Type generation runs in your browser, so your data stays private.' },
    ],
  },
};
