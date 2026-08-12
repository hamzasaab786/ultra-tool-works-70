import type { ToolContentMap } from "./types";

export const chunk5: ToolContentMap = {
  "/tools/jpg-to-pdf": {
    intro: [
      "The JPG to PDF Converter turns your photos and screenshots into a single, well-ordered PDF without ever leaving your browser. Drop in one image or a whole folder, and each file becomes its own page inside one document — ideal for scanned receipts, portfolio pages, or a stack of camera-roll photos that need to travel as one attachment.",
      "Because everything runs client-side, your images are never uploaded to a server, which matters when the photos contain personal documents like IDs or contracts. You control page size, margins and the order pages appear in before you export, so the final PDF looks deliberate rather than thrown together — useful for anyone converting multiple JPG to one PDF online without installing desktop software.",
    ],
    steps: [
      "Drag and drop your JPG or PNG files onto the upload area, or click to browse and select several at once.",
      "Reorder the thumbnails by dragging them until the pages are in the sequence you want.",
      "Choose a page size (A4, Letter or fit-to-image) and set the margin spacing around each photo.",
      "Preview the page order and rotate any image that is sideways.",
      "Click Convert to PDF and download the finished multi-page file straight to your device.",
    ],
    benefits: [
      { title: "One PDF from many photos", body: "Combine an unlimited number of JPGs or PNGs into a single document instead of sending a folder of separate attachments. Recipients get one clean file to open and print." },
      { title: "Full control over layout", body: "Set page size and margins before exporting so photos don't get awkwardly cropped or shrunk. Reordering by drag-and-drop means you decide the final sequence, not the file names." },
      { title: "No upload, no watermark", body: "Conversion happens locally in your browser, so private photos never touch a remote server. The output PDF carries no watermark or branding." },
    ],
    useCases: [
      "Turning a phone camera roll of receipts into one PDF for an expense report.",
      "Compiling scanned ID documents into a single file for a visa or loan application.",
      "Building a simple photo lookbook or portfolio to email a client.",
      "Converting screenshots of a chat or webpage into a shareable PDF record.",
      "Assembling multiple pages of a handwritten worksheet photographed with a phone.",
    ],
    sections: [
      { heading: "Supported image formats", body: "JPG and PNG files are supported, including photos straight from a phone camera or exported from editing apps. There is no fixed page limit, though very large batches of high-resolution photos will take longer to render and produce a bigger PDF." },
      { heading: "Keeping file size manageable", body: "Large photos make for large PDFs. Run images through the Image Compressor first, or pick a smaller export scale, to keep a 20-page document comfortably under typical email attachment limits." },
      { heading: "Versus desktop converters", body: "Desktop tools like Adobe Acrobat require installation and often a subscription for batch conversion. This converter does the same reordering and page-sizing job directly in the browser, for free, with no account needed." },
    ],
  },

  "/tools/image-metadata-extractor": {
    intro: [
      "The Image Metadata Extractor reads the EXIF data embedded in a photo — camera model, lens, aperture, shutter speed, ISO, focal length, capture date and, if location services were enabled, the GPS coordinates where the shot was taken. Photographers use it to check shooting settings after the fact; journalists and researchers use it to verify when and where an image was captured.",
      "All parsing happens locally in your browser: the photo is never uploaded anywhere, which is important given that EXIF data can reveal a precise location. Upload a JPG, PNG, HEIC or TIFF file and the tool lays out every available field in a readable table, including GPS coordinates plotted for quick reference, so you can decide what to keep or strip before sharing the image publicly.",
    ],
    steps: [
      "Upload a photo by dragging it in or selecting it from your device.",
      "Wait for the tool to parse the file's metadata block in your browser.",
      "Review the camera and lens details, exposure settings and timestamp in the results table.",
      "Check the GPS section if the photo has embedded location coordinates.",
      "Copy or export the metadata fields you need for a report or investigation.",
    ],
    benefits: [
      { title: "Full EXIF breakdown", body: "See camera make and model, lens, aperture, shutter speed, ISO and focal length in one readable table. No need to hunt through a camera app or desktop software to check shooting settings." },
      { title: "GPS location detection", body: "Instantly see whether a photo carries embedded location coordinates, which is essential when vetting images before they're published or shared publicly." },
      { title: "Fully private", body: "The image and its metadata never leave your device, since parsing happens entirely client-side in JavaScript." },
    ],
    useCases: [
      "Checking the camera settings used for a favourite shot to replicate the look later.",
      "Verifying whether a photo submitted for a listing or claim contains GPS data.",
      "Journalists confirming the timestamp and location claimed for a news photo.",
      "Photographers auditing a shoot's EXIF data before archiving RAW-converted JPGs.",
      "Checking for accidental location leaks before posting personal photos online.",
    ],
    sections: [
      { heading: "What EXIF data actually contains", body: "EXIF is a metadata standard embedded by most digital cameras and phones. It typically records exposure settings, the device model, orientation and a timestamp; GPS coordinates are added only if location services were enabled at the time the photo was taken." },
      { heading: "Removing metadata before sharing", body: "If you'd rather strip this information out, re-save the image through the Image Compressor or Format Converter — re-encoding a photo drops the original metadata block, including any GPS tag, without visibly affecting the picture." },
      { heading: "Formats and limits", body: "JPG, TIFF and HEIC files typically carry the richest EXIF data, since most cameras write to these formats natively. PNG and WebP files often have little or no EXIF data because many editing tools strip it on export." },
    ],
  },

  "/tools/pdf-compressor": {
    intro: [
      "The PDF Compressor shrinks large PDF files so they fit within email attachment limits or upload restrictions, without the file leaving your device. Choose a compression level and the tool re-encodes embedded images to reduce file size while keeping text and vector graphics sharp — the part of a PDF that actually matters for readability.",
      "It's built for the common situation where a scanned report, portfolio or presentation exported as PDF turns out far larger than expected. Because everything runs client-side, there's no waiting for an upload and no risk of a confidential document sitting on someone else's server. Pick a compression level, preview the estimated size reduction, and download a smaller PDF ready for email or a strict upload cap.",
    ],
    steps: [
      "Upload the PDF you want to shrink by dragging it in or browsing your files.",
      "Choose a compression level — light, medium or aggressive — depending on how much size reduction you need.",
      "Review the before-and-after size estimate shown for the file.",
      "Compress the document and check that the text and images still look acceptable.",
      "Download the smaller PDF, ready to attach or upload.",
    ],
    benefits: [
      { title: "Meaningful size reduction", body: "Image-heavy PDFs typically shrink by 50–80% because compression targets embedded photos, which are usually the bulk of the file. Text-only documents still compress, just by a smaller margin." },
      { title: "Text stays sharp", body: "Vector text and line art are untouched by compression, so contracts and reports remain crisp to read even at the most aggressive setting." },
      { title: "No account, no watermark", body: "There's no signup wall and no watermark stamped on the output — just a smaller version of the file you uploaded." },
    ],
    useCases: [
      "Getting a scanned contract under an email provider's attachment size limit.",
      "Reducing a portfolio PDF so it uploads faster to a job application portal.",
      "Shrinking a photo-heavy report before archiving it to save storage space.",
      "Compressing a presentation exported as PDF for faster sharing over messaging apps.",
      "Preparing a PDF for a form that caps uploads at a fixed size, such as 100 KB or 200 KB.",
    ],
    sections: [
      { heading: "How the compression levels differ", body: "Light compression trims image quality subtly, best when the PDF will be printed. Medium is a good default for email and general sharing. Aggressive compression produces the smallest file but can introduce visible artefacts in photos, so it suits documents where images are secondary to text." },
      { heading: "What compression cannot fix", body: "A PDF made almost entirely of vector text, like a plain Word export, is already small and won't shrink much further regardless of the setting chosen — there simply isn't image data to re-encode." },
      { heading: "Versus desktop compression tools", body: "Acrobat and similar desktop apps offer comparable compression settings but usually require a paid licence for batch or high-volume use. This tool applies the same image re-encoding approach directly in the browser at no cost." },
    ],
  },

  "/tools/compare-pdf": {
    intro: [
      "Compare PDF lines up two versions of a document and highlights exactly what changed between them — additions, deletions and edited passages — so you don't have to read both files side by side line by line. It's built for reviewing contract redlines, comparing draft revisions, or checking that a signed copy matches the version that was agreed.",
      "The tool extracts the text layer from each PDF and runs a line-by-line diff, marking inserted text and removed text with distinct highlighting. Because comparison happens in your browser, sensitive contracts and legal drafts never leave your device. Upload the original and the revised file, and scroll through a clear visual record of every change between the two versions.",
    ],
    steps: [
      "Upload the original PDF into the first slot.",
      "Upload the revised or updated version into the second slot.",
      "Let the tool extract and align the text from both documents.",
      "Review the highlighted differences — additions and removals are marked separately.",
      "Scroll or jump between changes to confirm what was edited before signing off.",
    ],
    benefits: [
      { title: "Line-by-line accuracy", body: "Differences are computed on the extracted text layer, so even small wording changes in a long contract are caught rather than glossed over." },
      { title: "Clear visual highlighting", body: "Insertions and deletions are marked with distinct colours, making it fast to scan a long document for the handful of clauses that actually changed." },
      { title: "Private by design", body: "Both PDFs are compared locally in your browser, which matters for legal drafts and financial documents you don't want sitting on a third-party server." },
    ],
    useCases: [
      "Reviewing redlines on a contract before signing a final version.",
      "Checking that a supplier's revised quote matches the terms originally discussed.",
      "Comparing two drafts of a policy document during an internal review cycle.",
      "Verifying a signed PDF matches the last agreed draft, word for word.",
      "Tracking edits between successive versions of a report submitted by different authors.",
    ],
    sections: [
      { heading: "How the comparison works", body: "Text is pulled from both PDFs' internal text layer and diffed the same way a code diff tool compares two versions of a file, then insertions and deletions are rendered as highlighted spans over the original layout." },
      { heading: "Comparing scanned documents", body: "Scanned pages are images, not text, so there's nothing for a text diff to compare. Run each scan through the PDF OCR tool first to generate a text layer, then compare the recognised output." },
      { heading: "What it won't catch", body: "Purely visual changes — a moved image, a different font, or a resized logo — won't show up in a text diff. This tool is aimed at wording changes, not pixel-level layout differences." },
    ],
  },

  "/tools/extract-text-pdf": {
    intro: [
      "Extract Text from PDF pulls every piece of selectable text out of a document and lets you copy it or download it as a plain .txt file. It's the fastest way to reuse the contents of a report, quote a passage accurately, or feed a PDF's text into another tool such as an AI assistant that doesn't accept PDFs directly.",
      "The extraction reads the document page by page in its original order and inserts page separators, so you can trace any extracted line back to where it appeared in the source file. Because the PDF is processed locally in your browser, there's no upload step and no limit on how many times you can run it — useful when you're working through a stack of reports rather than a single file.",
    ],
    steps: [
      "Upload the PDF you want to pull text from.",
      "Wait while the tool reads the text layer page by page.",
      "Review the extracted text in the preview pane, with page breaks marked.",
      "Copy the text to your clipboard, or download it as a .txt file.",
      "Paste the result into a document, spreadsheet or another tool as needed.",
    ],
    benefits: [
      { title: "Preserves page order", body: "Text is extracted in document order with page separators included, so you always know which passage came from which page." },
      { title: "Works on any length of document", body: "There's no artificial page cap — a 5-page memo and a 200-page report are processed the same way, entirely in the browser." },
      { title: "Instant copy or download", body: "Grab the text straight to your clipboard for a quick paste, or save it as a plain text file for archiving or further editing." },
    ],
    useCases: [
      "Quoting a passage from a PDF report accurately without retyping it.",
      "Feeding a PDF's content into an AI tool or search index that only accepts plain text.",
      "Pulling text from an e-book or manual to search or edit in a word processor.",
      "Extracting the wording of a contract clause for a comparison document.",
      "Archiving the text content of old PDFs as searchable plain-text files.",
    ],
    sections: [
      { heading: "Why some PDFs won't copy", body: "If a PDF is a scan or was created from a photograph, it has no underlying text layer — only pixels laid out like text. Run those files through the PDF OCR tool, which recognises the characters visually and returns text you can copy." },
      { heading: "Formatting expectations", body: "Extracted text keeps line breaks and paragraph order but drops visual formatting like tables, columns and fonts, since it's designed to capture the words, not replicate the layout." },
      { heading: "Accuracy on complex layouts", body: "Multi-column pages and text wrapped around images can occasionally extract in an unexpected reading order. For those cases, check the output against the original PDF before relying on it for anything formal." },
    ],
  },

  "/tools/pdf-ocr": {
    intro: [
      "PDF OCR turns scanned documents and photographed pages into searchable, copyable text by recognising characters visually rather than relying on an existing text layer. It supports more than a dozen languages, including English, Spanish, French, German, Portuguese, Italian, Arabic, Hindi, Urdu, Chinese, Japanese and Russian, so it handles documents well beyond English-only scans.",
      "Recognition runs entirely in your browser using an on-device OCR engine, which means scanned contracts, ID documents and medical records never get uploaded anywhere to be processed. Select the correct language before scanning, upload your file, and the tool returns text you can copy, search or export — the same capability as commercial scan-to-text software, without the subscription.",
    ],
    steps: [
      "Upload the scanned PDF or image file you want to make searchable.",
      "Select the correct language from the dropdown for the document's content.",
      "Run the OCR scan and wait for the recognition engine to process each page.",
      "Review the recognised text against the original scan for any errors.",
      "Copy the text or export the result for use elsewhere.",
    ],
    benefits: [
      { title: "12+ language support", body: "Recognises text in English, Spanish, French, German, Arabic, Chinese, Japanese, Russian and more, so multilingual archives don't need separate tools." },
      { title: "Runs entirely on-device", body: "The OCR engine processes images locally in your browser, which matters for scanned documents that contain personal or confidential information." },
      { title: "Turns scans into usable text", body: "Once recognised, previously uneditable scanned pages become copyable, searchable and ready to paste into other documents." },
    ],
    useCases: [
      "Making an old scanned contract searchable and copyable again.",
      "Digitising a photographed page from a book or printed manual.",
      "Extracting text from a scanned invoice for bookkeeping software.",
      "Recognising foreign-language documents before translating them.",
      "Turning a stack of scanned forms into text data for a spreadsheet.",
    ],
    sections: [
      { heading: "Getting the best accuracy", body: "Use scans of at least 300 DPI, keep pages straight rather than skewed, and ensure even lighting with no glare. Clean printed text typically reaches 95%+ recognition accuracy; handwriting is far less reliable and should be checked manually." },
      { heading: "Choosing the right language", body: "Selecting the correct language before scanning matters, since the OCR engine uses language-specific character models. Running an Arabic document through an English model, for instance, will produce garbled results." },
      { heading: "Difference from plain text extraction", body: "Use the Extract Text from PDF tool for documents that already contain a text layer — it's faster since there's nothing to recognise. Reach for OCR specifically when a PDF is made of scanned images with no underlying text." },
    ],
  },

  "/tools/currency-converter": {
    intro: [
      "The Currency Converter converts between more than 150 world currencies using exchange rates fetched from a public rate feed each time you open the tool. Type an amount, pick your source and target currencies, and get an instant conversion — handy for travel budgeting, invoicing overseas clients, or simply checking what a price tag in another currency really costs.",
      "There's no account, no ad interruptions and no limit on how many conversions you run. Rates refresh through the day so figures track the mid-market rate closely, though it's worth remembering that banks and card networks apply their own margin on top. Use this tool as the benchmark figure, then compare it against what your bank or payment provider actually charges.",
    ],
    steps: [
      "Enter the amount you want to convert.",
      "Select the currency you're converting from using the dropdown.",
      "Select the currency you want to convert to.",
      "Read the converted amount, updated instantly as you type or change currencies.",
      "Swap the two currencies with one click to check the reverse conversion.",
    ],
    benefits: [
      { title: "150+ currencies covered", body: "From major currencies like USD and EUR to less common ones, the converter covers a wide range of world currencies in one interface." },
      { title: "Regularly refreshed rates", body: "Rates are pulled from a public exchange-rate feed and refresh through the day, so figures stay close to the current mid-market rate." },
      { title: "No account or fees", body: "There's nothing to sign up for and no fee added to the figure shown — it's a straightforward benchmark conversion." },
    ],
    useCases: [
      "Budgeting for a trip abroad by converting prices into your home currency.",
      "Checking the value of an invoice or quote received in a foreign currency.",
      "Comparing an online price against your local currency before buying.",
      "Estimating what a foreign salary or freelance rate is worth at home.",
      "Quickly checking today's rate before wiring money internationally.",
    ],
    sections: [
      { heading: "Why bank rates differ", body: "Banks and card networks typically add a spread and fees of roughly 1–3% on top of the mid-market rate shown here, so the amount you actually receive or pay through a bank will usually be slightly worse than this benchmark figure." },
      { heading: "How current are the rates", body: "Rates come from a public exchange-rate feed fetched when you load the tool and refreshed periodically through the day, tracking market movements closely enough for everyday budgeting and quoting purposes." },
      { heading: "Best use for this tool", body: "Use it to get a fast, reliable benchmark for what a foreign amount is roughly worth. For actual money transfers, compare this figure against the rate your bank or transfer service quotes to see their margin." },
    ],
  },

  "/tools/hex-to-rgb": {
    intro: [
      "The HEX to RGB Converter translates colour values between HEX, RGB, RGBA, HSL and CSS-ready formats, with a live swatch so you can see the colour as you type. Designers and developers use it constantly when a design tool exports one colour format but the codebase expects another, or when building a colour scale that needs HSL's intuitive lightness control.",
      "Paste in a hex code like #FF5733, or start from RGB or HSL values instead, and every other format updates instantly alongside a preview swatch. Copy any value straight into your CSS, design tool or code editor. Because conversion runs in the browser, there's no delay and no need to open a separate design app just to check what a colour looks like in a different notation.",
    ],
    steps: [
      "Enter a HEX colour code, or switch input mode to RGB or HSL.",
      "Watch the live swatch update to preview the exact colour.",
      "Check the converted values shown in HEX, RGB, RGBA and HSL formats.",
      "Adjust sliders or type new values to fine-tune the colour.",
      "Copy the format you need directly into your CSS or design file.",
    ],
    benefits: [
      { title: "All formats at once", body: "See HEX, RGB, RGBA, HSL and CSS-ready output simultaneously instead of converting one format at a time in separate tools." },
      { title: "Live colour preview", body: "A visible swatch updates as you type, so you can confirm the colour looks right before copying it into a project." },
      { title: "Ready for code and design", body: "Copy values in the exact syntax your CSS or design tool expects, saving the manual reformatting that's easy to get wrong by hand." },
    ],
    useCases: [
      "Converting a HEX brand colour from a style guide into RGBA for a CSS overlay with transparency.",
      "Building a design system's colour scale by adjusting HSL lightness values.",
      "Matching a colour picked from an image editor to the CSS value used in code.",
      "Checking what a hex code looks like before committing it to a stylesheet.",
      "Converting between formats when moving assets between design tools with different colour notations.",
    ],
    sections: [
      { heading: "How HEX to RGB conversion works", body: "A hex colour packs three byte pairs for red, green and blue. #FF5733 splits into FF, 57 and 33, which convert from base 16 to decimal as rgb(255, 87, 51) — the same colour, expressed in a different numbering system." },
      { heading: "When to reach for HSL", body: "HSL separates hue, saturation and lightness, which makes building tints and shades intuitive: keep hue and saturation fixed and vary only lightness to generate a consistent colour scale for buttons, borders and backgrounds." },
      { heading: "RGBA and transparency", body: "RGBA adds a fourth alpha channel for transparency, useful for overlays and hover states. HEX and plain RGB have no transparency component, so converting to RGBA is often the step needed before adding opacity in CSS." },
    ],
  },

  "/tools/markdown-to-html": {
    intro: [
      "The Markdown to HTML Converter turns Markdown into clean, semantic HTML with a live side-by-side preview, so you can see exactly how a README, blog post or documentation page will render as you write. It supports standard CommonMark syntax plus common GitHub extensions: headings, bold and italic, ordered and unordered lists, links, images, blockquotes, tables, inline code and fenced code blocks.",
      "Paste or type Markdown into the editor and the HTML output updates instantly next to it, with no build step or Markdown library needed on your end. The generated HTML carries no inline styles, so it inherits your site's existing CSS the moment you paste it in — useful for publishing to a CMS, a static site, or an email template that needs plain HTML rather than a Markdown file.",
    ],
    steps: [
      "Type or paste your Markdown content into the editor panel.",
      "Watch the live preview render on the right as you type.",
      "Check formatting for headings, lists, tables and code blocks in the preview.",
      "Switch to the HTML output view to see the generated markup.",
      "Copy the HTML and paste it into your CMS, static site or email template.",
    ],
    benefits: [
      { title: "Live side-by-side preview", body: "See exactly how the rendered page will look as you type, catching formatting mistakes before they reach a live site." },
      { title: "GitHub-flavoured extensions", body: "Tables, fenced code blocks and other GitHub Markdown extensions are supported alongside standard CommonMark syntax." },
      { title: "Clean, unstyled HTML output", body: "The generated markup has no inline styles, so it picks up your site's own CSS instead of clashing with an inherited design." },
    ],
    useCases: [
      "Converting a README written in Markdown into HTML for a project's website.",
      "Drafting a blog post in Markdown and exporting HTML for a CMS that doesn't support Markdown.",
      "Previewing documentation formatting before committing it to a repository.",
      "Turning Markdown release notes into HTML for an email newsletter.",
      "Checking that tables and code blocks render correctly before publishing.",
    ],
    sections: [
      { heading: "Supported Markdown syntax", body: "Standard CommonMark elements are supported — headings, emphasis, lists, links, images and blockquotes — alongside GitHub extensions like tables and fenced code blocks, covering the syntax used in the vast majority of README files and documentation." },
      { heading: "Using the HTML output directly", body: "Because the output has no inline styling, pasting it into an existing webpage lets it inherit that page's fonts, colours and spacing automatically, rather than fighting with hardcoded styles from the converter." },
      { heading: "Limitations to be aware of", body: "Non-standard Markdown extensions specific to certain platforms, such as custom callout boxes, aren't guaranteed to render the same way. Stick to standard syntax for the most predictable HTML output." },
    ],
  },

  "/tools/csv-to-json": {
    intro: [
      "The CSV to JSON Converter turns spreadsheet data into structured JSON, ready to paste into an API request, a database seed file, or a JavaScript project. It automatically detects the header row and uses it as the object keys, so each following row becomes one JSON object with named fields instead of an anonymous array of values.",
      "Custom delimiters are supported for CSVs exported with semicolons or tabs instead of commas, and the output is pretty-printed so it's readable straight away rather than a single unbroken line. Paste in CSV data or upload a file, and the converter handles quoted fields, embedded commas and mismatched row lengths that commonly trip up hand-written parsing scripts.",
    ],
    steps: [
      "Paste your CSV data into the input box, or upload a .csv file.",
      "Confirm the delimiter matches your data — comma, semicolon or tab.",
      "Check that the first row is being read correctly as column headers.",
      "Review the pretty-printed JSON output generated on the right.",
      "Copy the JSON or download it as a .json file for your project.",
    ],
    benefits: [
      { title: "Automatic header detection", body: "The first row is read as field names automatically, so you get properly labelled JSON objects instead of raw arrays needing manual key mapping." },
      { title: "Custom delimiter support", body: "CSVs exported from different tools sometimes use semicolons or tabs instead of commas; the converter handles that without requiring pre-processing." },
      { title: "Pretty-printed, ready-to-use output", body: "The resulting JSON is formatted for readability, so you can immediately review it or drop it straight into an API test or database seed script." },
    ],
    useCases: [
      "Converting an exported spreadsheet of contacts into JSON for an API import.",
      "Turning survey results from a CSV export into structured data for analysis scripts.",
      "Preparing seed data for a database from a spreadsheet of products or records.",
      "Converting Excel-exported CSV data into a JSON array for a JavaScript front end.",
      "Reformatting CSV log exports into JSON for easier parsing in code.",
    ],
    sections: [
      { heading: "How headers become keys", body: "The first row of the CSV becomes the object keys, so a column named 'email' produces an 'email' field in every resulting JSON object — the structure most REST APIs and NoSQL databases expect data in." },
      { heading: "Handling quoted and complex fields", body: "Fields containing commas, line breaks or quotation marks inside quoted CSV cells are parsed correctly rather than being split incorrectly, which is a common failure point in hand-rolled CSV parsers." },
      { heading: "Working with large files", body: "Because conversion happens in the browser, there's no server-side row limit imposed by the tool itself — very large spreadsheets are limited only by your device's available memory." },
    ],
  },

  "/tools/qr-code-generator": {
    intro: [
      "The QR Code Generator creates custom QR codes for URLs, WiFi networks, vCards, email addresses and SMS messages, with full control over colours, gradients, dot styles and an embedded logo. Rather than a plain black-and-white square, you can produce a QR code that matches a brand's colour palette and still scans reliably.",
      "QR codes use Reed-Solomon error correction, and setting the correction level to high allows up to 30% of the code to be damaged or covered without breaking a scan — which is exactly what makes adding a logo in the centre possible. Set up your content, style the code, then download it as PNG, JPG or SVG depending on whether you need it for print, web or further editing.",
    ],
    steps: [
      "Choose the QR code type — URL, WiFi, vCard, email or SMS.",
      "Enter the relevant details, such as the destination link or WiFi credentials.",
      "Customise the colours, gradient and dot style to match your branding.",
      "Upload a logo to place in the centre of the code, keeping it under about 30% coverage.",
      "Preview the code with a test scan, then download as PNG, JPG or SVG.",
    ],
    benefits: [
      { title: "Multiple content types", body: "Generate codes for URLs, WiFi network logins, contact vCards, email addresses and SMS messages, not just plain links." },
      { title: "Full visual customisation", body: "Adjust colours, gradients and dot patterns so the QR code fits a brand's visual identity instead of looking like a generic black-and-white square." },
      { title: "Logo support without breaking scans", body: "High-level error correction allows a logo to sit in the centre of the code while it remains reliably scannable." },
      { title: "Export in multiple formats", body: "Download as PNG or JPG for quick use, or SVG for crisp scaling on large print materials like posters and banners." },
    ],
    useCases: [
      "Creating a branded QR code linking to a restaurant's digital menu.",
      "Generating a WiFi QR code so guests can join a network without typing a password.",
      "Building a vCard QR code for a business card that adds contact details on scan.",
      "Producing an SVG QR code for a large-format poster or storefront sign.",
      "Making an SMS QR code that pre-fills a message for event RSVPs.",
    ],
    sections: [
      { heading: "Will a logo stop the code from scanning?", body: "Not if it covers roughly 30% or less of the code's centre. QR codes are built with Reed-Solomon error correction, and level H can recover up to 30% of missing or obscured data, which is what makes a centred logo possible without breaking the scan." },
      { heading: "Choosing an export format", body: "PNG and JPG are convenient for digital use and quick sharing, but they're raster images that pixelate at large sizes. SVG is a vector format that stays crisp at any size, making it the better choice for posters, packaging or anything printed large." },
      { heading: "Testing before printing", body: "Always test-scan a generated code with a few different phones before committing it to print, particularly if it uses a logo or a low-contrast colour combination, since scanner sensitivity varies across devices." },
    ],
  },

  "/tools/timer-stopwatch": {
    intro: [
      "The Timer & Stopwatch combines a countdown timer with an alarm, a lap-tracking stopwatch, and Pomodoro presets in one browser tool — no app install, no ads interrupting a focus session. Set a countdown for a specific task, switch to the stopwatch to record lap splits, or use a Pomodoro preset to structure work into focused intervals with built-in breaks.",
      "Elapsed and remaining time are calculated from timestamps rather than a simple tick counter, so switching tabs or letting your laptop sleep briefly doesn't cause the timer to drift out of sync. Whether you're timing a workout, running a classroom activity, or working through a Pomodoro session, the tool keeps accurate time in the background while you focus on the task.",
    ],
    steps: [
      "Choose between Timer, Stopwatch or Pomodoro mode.",
      "For the timer, set the countdown duration and start it — an alarm sounds when it reaches zero.",
      "For the stopwatch, press start and tap Lap to record split times as you go.",
      "Review your recorded lap times listed in order once you stop the stopwatch.",
      "For Pomodoro, select a work/break preset and let the tool cycle through focus and rest intervals automatically.",
    ],
    benefits: [
      { title: "Accurate even in background tabs", body: "Time is calculated from timestamps rather than tick counts, so the countdown or stopwatch never drifts even if the tab loses focus." },
      { title: "Three tools in one", body: "Switch between a countdown timer, a lap stopwatch and Pomodoro presets without needing three separate apps." },
      { title: "Audible alarm on completion", body: "A sound plays when a countdown reaches zero, so you don't need to keep glancing at the screen while working on something else." },
    ],
    useCases: [
      "Running Pomodoro focus sessions with built-in work and break intervals.",
      "Timing a workout circuit with a countdown and alarm between exercises.",
      "Recording lap splits for a practice run or timed drill.",
      "Setting a countdown for a classroom activity or exam section.",
      "Timing cooking steps that need a precise countdown with an alert.",
    ],
    sections: [
      { heading: "Why timestamps matter for accuracy", body: "Simple tick-based timers can lose time if the browser throttles background tabs, a common behaviour used to save battery. Calculating elapsed time from the difference between two timestamps avoids that drift entirely, so the timer stays accurate even minimised." },
      { heading: "Using Pomodoro presets", body: "The Pomodoro technique splits work into focused intervals — typically 25 minutes — followed by a short break, with a longer break after several cycles. The presets handle the switching automatically so you can stay in the work session without resetting a timer manually." },
      { heading: "Lap timing accuracy", body: "Each lap records the exact time since the previous lap and the total elapsed time, useful for comparing split consistency across repeated efforts like interval training or timed reading exercises." },
    ],
  },

  "/tools/email-validator": {
    intro: [
      "The Email Validator checks whether an email address is correctly formatted, whether its domain has valid mail server records, and whether it belongs to a known disposable email provider — three checks that catch most invalid entries before they end up in a mailing list or database. It's built for anyone who needs to clean a list of email addresses before importing it somewhere that matters.",
      "Syntax validation catches obvious typos like missing @ symbols or invalid characters. Domain checking confirms the domain actually has mail server (MX) records configured, which flags addresses at domains that can't receive mail at all. It won't confirm that a specific mailbox exists — that requires either a mail-server probe or sending a real confirmation email — but it filters out the bulk of clearly invalid or disposable addresses quickly.",
    ],
    steps: [
      "Paste a single email address, or a list of addresses, into the input box.",
      "Run the validation check.",
      "Review the syntax result, showing whether the address is correctly formatted.",
      "Check the domain validation result for mail server records.",
      "Note any addresses flagged as disposable or temporary email providers.",
    ],
    benefits: [
      { title: "Three layers of checking", body: "Syntax, domain mail records and disposable-provider detection catch different categories of invalid or unwanted addresses in one pass." },
      { title: "Bulk-friendly", body: "Paste a list of addresses at once rather than checking them one at a time, useful for cleaning a mailing list before an import." },
      { title: "Filters out disposable addresses", body: "Temporary email providers are flagged separately, helping keep sign-up forms and mailing lists free of throwaway addresses." },
    ],
    useCases: [
      "Cleaning a mailing list before importing it into email marketing software.",
      "Validating an email field in a sign-up form before submission.",
      "Checking a list of leads for invalid or disposable addresses before a sales outreach.",
      "Confirming a customer-entered email domain can actually receive mail.",
      "Filtering disposable addresses out of a newsletter subscriber list.",
    ],
    sections: [
      { heading: "What this can and can't confirm", body: "The tool verifies correct syntax and that a domain's mail configuration exists, both strong signals an address is real. Confirming that a specific mailbox is active and receiving mail requires either a direct mail-server probe or sending a real confirmation email, which goes beyond what a client-side check can do." },
      { heading: "Why disposable email detection matters", body: "Disposable or temporary email services let users sign up without giving a real address, which is useful for privacy but a problem for anyone building a genuine mailing list. Flagging these domains separately helps keep sign-up data usable." },
      { heading: "Bulk verification workflow", body: "For lists in the hundreds or thousands, paste addresses in bulk rather than checking individually — the tool processes each entry the same way and returns a per-address result so problem entries are easy to spot and remove." },
    ],
  },

  "/tools/emoji-picker": {
    intro: [
      "The Emoji Picker lets you search thousands of emojis by name or category and copy them to your clipboard with a single click, without switching to your operating system's built-in emoji keyboard. It's a faster alternative on desktop, where native emoji pickers can be slow to open or awkward to search by keyword.",
      "Search for an emoji by typing what it represents — 'fire', 'thumbs up', 'birthday cake' — or browse by category if you're not sure exactly what you're after. Clicking any emoji copies it instantly, ready to paste into a social post, a document, a code comment or a chat message, making it a handy companion for anyone typing on a keyboard without an easy emoji shortcut.",
    ],
    steps: [
      "Type a keyword into the search box, such as 'heart' or 'celebrate'.",
      "Browse the matching emoji results shown below the search bar.",
      "Alternatively, browse by category if you don't have a specific search term in mind.",
      "Click any emoji to copy it to your clipboard instantly.",
      "Paste the emoji into your document, message or code editor.",
    ],
    benefits: [
      { title: "Fast keyword search", body: "Find the exact emoji you want by typing what it represents, rather than scrolling through long category grids." },
      { title: "One-click copy", body: "Clicking an emoji copies it immediately, ready to paste anywhere without extra steps." },
      { title: "Works across platforms", body: "Since it's browser-based, the same picker works identically on any desktop operating system, unlike native emoji keyboards that vary between systems." },
    ],
    useCases: [
      "Adding emojis to a social media post while typing on a desktop keyboard.",
      "Finding a specific emoji for a document or presentation without a native picker.",
      "Copying emojis for use in code comments, commit messages or documentation.",
      "Searching for aesthetic symbols to use in bios or captions.",
      "Quickly grabbing an emoji for a chat message on a platform without a built-in picker.",
    ],
    sections: [
      { heading: "Why emojis look different on other devices", body: "Unicode defines what each emoji means, not how it's drawn. Apple, Google, Microsoft and Samsung each design their own artwork for the same character, so an emoji copied here may render with a different style once it reaches someone else's device." },
      { heading: "Searching effectively", body: "Search by the concept rather than a literal description — searching 'happy' surfaces smiling faces even if the emoji's official name doesn't include that word, since the search matches common associated terms as well as names." },
      { heading: "Copy and paste compatibility", body: "Emojis copied from the picker are standard Unicode characters, so they paste correctly into virtually any app, website or code editor that supports Unicode text input." },
    ],
  },

  "/tools/test-card-generator": {
    intro: [
      "The Test Card Generator produces Luhn-valid card numbers for Visa, Mastercard, American Express and Discover, intended purely for exercising payment forms in sandbox and staging environments during development. Generated numbers pass the same checksum validation real card numbers do, so they're useful for testing input masking, card-type detection and form validation logic without needing a real card.",
      "These numbers are not tied to any real bank account or payment processor — they exist solely to validate that a form correctly accepts or rejects properly formatted input. For testing an actual payment flow end to end, use your payment processor's own official test card numbers, which are recognised specifically by their sandbox systems; this generator focuses on the Luhn-valid structure a form's front-end validation checks for.",
    ],
    steps: [
      "Select the card network you want to test — Visa, Mastercard, Amex or Discover.",
      "Generate a card number, which is automatically Luhn-valid for that network's format.",
      "Copy the generated number, along with a matching expiry date and CVV.",
      "Paste the details into your sandbox or staging payment form.",
      "Verify that your form's validation correctly accepts or formats the test number.",
    ],
    benefits: [
      { title: "Correct network formatting", body: "Numbers match the digit length and prefix pattern of the selected network, so card-type detection logic can be tested realistically." },
      { title: "Luhn-valid by construction", body: "Every generated number passes the Luhn checksum algorithm, the same basic validation most payment forms run before submission." },
      { title: "No real financial data involved", body: "Generated numbers have no bank account behind them, making them safe to use repeatedly in development without any risk." },
    ],
    useCases: [
      "Testing that a checkout form correctly detects card type from the number entered.",
      "Verifying input masking and formatting logic in a payment form during development.",
      "Populating demo data for a staging environment without using real card numbers.",
      "Checking that Luhn validation correctly rejects malformed numbers by comparing against valid ones.",
      "QA testing a form's error states with structurally valid but clearly non-production numbers.",
    ],
    sections: [
      { heading: "Can these be used for real purchases?", body: "No. They are structurally valid numbers built purely to pass checksum validation, with no associated bank account or credit line behind them — they exist solely to test form logic, not to move money." },
      { heading: "Luhn validation explained", body: "The Luhn algorithm is a simple checksum formula that most card numbers must satisfy; it catches typos and formatting errors but says nothing about whether an account actually exists. Generated numbers here satisfy the algorithm the same way real cards do." },
      { heading: "For full payment-flow testing", body: "To test an actual transaction end to end, use the official test card numbers provided by your payment processor's sandbox, such as Stripe or PayPal's documented test cards — those are recognised specifically by the processor and won't trigger a real charge." },
    ],
  },

  "/tools/salary-calculator": {
    intro: [
      "The Salary & Hourly Wage Calculator converts an hourly rate into weekly, monthly and annual pay, or works backwards from an annual salary to figure out the equivalent hourly rate. Set your own working hours and weeks per year so the numbers reflect your actual schedule, whether that's a standard 40-hour week or a part-time arrangement with fewer hours or paid holiday weeks.",
      "An optional flat tax deduction percentage gives a rough estimate of take-home pay alongside the gross figures. This is deliberately a simplified estimate — real payslips apply progressive tax bands, national insurance or social security contributions, and other deductions that vary significantly by country and income level — but it's a quick way to sanity-check what an hourly rate or salary offer actually works out to.",
    ],
    steps: [
      "Enter your hourly rate, or switch to enter an annual salary instead.",
      "Set the number of hours you work per week.",
      "Set the number of weeks you work per year, adjusting for holidays if relevant.",
      "Optionally enter a flat tax deduction percentage to estimate take-home pay.",
      "Read the calculated weekly, monthly and annual figures instantly.",
    ],
    benefits: [
      { title: "Works in both directions", body: "Convert an hourly rate up to an annual salary, or convert an annual salary down to an equivalent hourly rate, depending on which figure you're starting with." },
      { title: "Adjustable for your real schedule", body: "Custom hours-per-week and weeks-per-year fields mean the calculation reflects part-time work, unpaid leave or non-standard schedules accurately." },
      { title: "Optional take-home estimate", body: "A flat deduction percentage gives a rough sense of net pay alongside the gross figures, useful for a quick comparison between job offers." },
    ],
    useCases: [
      "Comparing a job offer's hourly rate against your current annual salary.",
      "Working out what a freelance day rate needs to be to match a salaried position.",
      "Estimating monthly take-home pay before budgeting for rent or bills.",
      "Checking whether a part-time role's hourly rate meets a target annual income.",
      "Converting between pay frequencies when negotiating a new contract.",
    ],
    sections: [
      { heading: "Converting hourly rate to annual salary", body: "Multiply the hourly rate by hours worked per week, then by weeks worked per year. Setting your own hours and weeks matters here, since holidays, unpaid leave and part-time schedules all change the real annual total compared to a generic 2,080-hour assumption." },
      { heading: "How accurate is the take-home figure?", body: "The take-home estimate applies only the flat percentage you enter, so it's a simplified approximation. Real payslips use progressive tax bands, national insurance or social security contributions and other deductions that vary by country, so treat this as a rough guide rather than an exact figure." },
      { heading: "Common uses beyond salary comparison", body: "Freelancers use the reverse calculation to figure out what day rate matches a target annual income once non-billable time is factored in, by adjusting the weeks-per-year field down to reflect actual billable weeks." },
    ],
  },

  "/tools/pdf-viewer": {
    intro: [
      "The PDF Viewer opens and displays PDF files directly in your browser, with zoom, page rotation, a thumbnail sidebar and full-text search — everything a desktop PDF reader offers, without needing Adobe Reader or any other software installed. It's a fast way to check a document's contents when you don't want to download a dedicated app just to open one file.",
      "Because rendering happens entirely on your device, confidential documents like contracts, medical records or financial statements never leave your computer to be processed on a server. Open a file, jump between pages using the thumbnail panel, zoom in on fine print, and use full-text search to jump straight to a specific term buried deep inside a long document.",
    ],
    steps: [
      "Upload or drag in the PDF file you want to view.",
      "Use the thumbnail sidebar to jump between pages quickly.",
      "Zoom in or out to check fine print or get an overview of a page layout.",
      "Rotate pages that were scanned sideways or upside down.",
      "Use the search bar to find and jump to a specific word or phrase in the document.",
    ],
    benefits: [
      { title: "No software installation needed", body: "Opens PDFs instantly in the browser tab you already have open, without waiting for Adobe Reader or another app to launch." },
      { title: "Full-text search built in", body: "Jump directly to any word or phrase inside a long document instead of scrolling through page by page." },
      { title: "Private by design", body: "The file is rendered locally on your device, so confidential documents are never uploaded to a server to be displayed." },
    ],
    useCases: [
      "Quickly checking the contents of a PDF received by email without downloading a reader app.",
      "Reading a long report and jumping straight to a section using full-text search.",
      "Viewing a scanned document that needs rotating to read correctly.",
      "Opening a confidential contract on a shared or public computer without leaving a trace on a server.",
      "Zooming in on fine print in a legal document or small-text diagram.",
    ],
    sections: [
      { heading: "Is my file uploaded to a server?", body: "No. The PDF is rendered locally in your browser using client-side rendering, so confidential documents never leave your device during viewing." },
      { heading: "Handling large PDFs", body: "Large files with many high-resolution pages take a little longer to render initially, but the thumbnail sidebar and search index build progressively so you can start reading before the entire document has finished loading." },
      { heading: "When to use this instead of downloading", body: "If you just need to check a PDF's contents once — confirm a detail, search for a term, or glance at a page — viewing it in the browser is faster than downloading, opening a separate app, and remembering to delete the file afterwards." },
    ],
  },

  "/tools/insert-pdf-pages": {
    intro: [
      "Insert PDF Pages adds one PDF document into another at a precise position — the start, the end, or before or after any specific page you choose — rather than simply appending files one after another the way a merge tool does. It's the right tool when a second document needs to slot into an exact spot inside an existing report, contract or manual.",
      "Original page quality is preserved throughout, since pages are combined at the PDF structure level rather than being rasterised and reassembled. Choose your base document, choose the file to insert, pick the exact insertion point, and download a single combined PDF — all processed locally in your browser with nothing uploaded to a server.",
    ],
    steps: [
      "Upload the base PDF you want to insert pages into.",
      "Upload the second PDF containing the pages you want to add.",
      "Choose the insertion point — at the start, at the end, or before/after a specific page number.",
      "Preview the resulting page order before finalising.",
      "Download the combined PDF with the pages inserted at the exact position chosen.",
    ],
    benefits: [
      { title: "Precise insertion point", body: "Unlike a simple merge, you choose exactly where the second document's pages land within the first, down to a specific page number." },
      { title: "Original quality preserved", body: "Pages are combined at the file structure level, so there's no re-rendering or quality loss compared with the source documents." },
      { title: "No upload required", body: "Both files are processed locally in the browser, keeping contracts and internal documents off any external server." },
    ],
    useCases: [
      "Adding a signed signature page into the middle of a contract at the correct point.",
      "Inserting an updated appendix into an existing report without rebuilding the whole document.",
      "Adding a cover letter PDF before the start of a job application document.",
      "Slotting a new chapter into an existing manual at a specific page.",
      "Inserting a scanned addendum immediately after a specific clause in an agreement.",
    ],
    sections: [
      { heading: "How this differs from merging", body: "Merging appends whole files one after another in the order you arrange them; inserting drops the second PDF's pages at an exact position inside the first document, which matters when the new content needs to appear mid-document rather than at either end." },
      { heading: "Choosing the insertion point", body: "You can insert before or after any page number in the base document, or simply at the very start or end if that's easier — the preview lets you confirm the resulting order before the final file is generated." },
      { heading: "File size and page count", body: "There's no fixed page limit enforced by the tool; very large combined documents simply take a little longer to process, since everything runs using your device's own processing power rather than a server." },
    ],
  },

  "/tools/flatten-pdf": {
    intro: [
      "Flatten PDF merges interactive form fields, comments, annotations and layers into the static page content, so a document that could previously be edited or re-filled becomes a fixed, uneditable version that looks identical everywhere it's opened. This matters once a form has been filled in and needs to be locked before sending, or when comments and markup should become permanent rather than removable.",
      "After flattening, viewers see plain text and graphics rather than editable widgets — form fields can no longer be re-filled, and highlighted comments can't be deleted or moved. The whole process runs locally in your browser, so a completed application form or an annotated contract never has to be uploaded anywhere just to be locked down before it's sent on.",
    ],
    steps: [
      "Upload the PDF containing form fields, annotations or layers you want to lock.",
      "Review which fields and annotations are present in the document.",
      "Run the flatten process to merge them into the page content.",
      "Check the resulting PDF to confirm fields are no longer editable.",
      "Download the flattened, locked version of the document.",
    ],
    benefits: [
      { title: "Prevents further editing", body: "Once flattened, form fields and annotations become fixed page content, so recipients can't accidentally or deliberately change filled-in answers." },
      { title: "Consistent appearance everywhere", body: "Flattened PDFs display identically across different PDF readers, since there's no interactive layer that might render slightly differently on another viewer." },
      { title: "Processed locally", body: "The file never leaves your device during flattening, which matters for completed forms containing personal or financial details." },
    ],
    useCases: [
      "Locking a completed job application or benefits form before submitting it.",
      "Making annotated review comments on a contract permanent before sending it back.",
      "Ensuring a filled tax or government form displays consistently across different PDF readers.",
      "Preventing further edits to a signed agreement's form fields.",
      "Finalising a filled template so it can be archived without risk of accidental changes.",
    ],
    sections: [
      { heading: "What flattening actually changes", body: "It merges interactive form fields, comments and layers into the static page content, converting what was previously an editable widget into fixed text or graphics that render the same way in every PDF viewer." },
      { heading: "Is my document uploaded?", body: "No. Flattening runs inside your browser, so a completed form containing personal details or financial information never needs to touch an external server during processing." },
      { heading: "When not to flatten", body: "If you still expect to edit the form fields later — for example, a template you plan to reuse and refill multiple times — keep the original interactive file and only flatten the final completed copy that's ready to send." },
    ],
  },

  "/tools/calorie-calculator": {
    intro: [
      "The Calorie Calculator estimates your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation, then suggests a daily calorie target for weight loss, maintenance or muscle gain. It's the same formula most dietitians consider the most accurate for healthy adults, applied here with an activity multiplier that scales your BMR based on how active your day-to-day life actually is.",
      "Enter your age, sex, height, weight and activity level, and the calculator works out your BMR — the energy your body needs at complete rest — then multiplies it by an activity factor ranging from 1.2 for sedentary lifestyles up to around 1.9 for very active ones to estimate your TDEE. From there it's straightforward to see what calorie range applies to a deficit, a maintenance diet, or a surplus for muscle gain.",
    ],
    steps: [
      "Enter your age, sex, height and current weight.",
      "Select your activity level, from sedentary to very active.",
      "Review your calculated BMR and TDEE figures.",
      "Choose a goal — weight loss, maintenance or muscle gain — to see the suggested calorie target.",
      "Adjust your activity level if your routine changes to keep the estimate current.",
    ],
    benefits: [
      { title: "Uses the Mifflin-St Jeor formula", body: "This is widely regarded by dietitians as the most accurate BMR equation for healthy adults, more precise than older formulas like Harris-Benedict for most people." },
      { title: "Adjusts for real activity levels", body: "An activity multiplier from 1.2 to 1.9 scales your BMR into a TDEE that reflects how active your actual daily routine is, not just your exercise habits." },
      { title: "Goal-specific targets", body: "See calorie targets tailored to weight loss, maintenance or muscle gain, rather than a single generic number." },
    ],
    useCases: [
      "Setting a starting calorie target before beginning a weight loss plan.",
      "Estimating maintenance calories after reaching a target weight.",
      "Working out a calorie surplus needed to support muscle gain alongside training.",
      "Adjusting a diet plan after a change in activity level, such as starting a new job or training programme.",
      "Getting a baseline TDEE figure to use alongside a food tracking app.",
    ],
    sections: [
      { heading: "Which formula does this use?", body: "The calculator uses the Mifflin-St Jeor equation, generally considered the most accurate formula for estimating BMR in healthy adults, then multiplies the result by an activity factor between 1.2 and 1.9 depending on your selected activity level to arrive at TDEE." },
      { heading: "Understanding calorie deficits and surpluses", body: "A moderate deficit below TDEE supports gradual weight loss, while eating at TDEE maintains current weight, and a surplus above TDEE supports muscle gain when paired with resistance training. The size of the deficit or surplus affects how fast changes happen." },
      { heading: "Limitations of BMR formulas", body: "Mifflin-St Jeor is an estimate based on population averages for age, sex, height and weight — individual metabolic rates vary, so treat the result as a starting point to adjust based on real progress rather than an exact number." },
    ],
  },

  "/tools/split-bill-calculator": {
    intro: [
      "The Split Bill Calculator divides a shared bill between any number of people, adds a tip if needed, and works out the smallest set of payments required to settle up — rather than everyone paying the total separately and reconciling later. It's designed for the common situation of a group dinner, a shared trip, or ongoing rent and utility costs split between housemates.",
      "Add each person and what they owe or contributed, include a tip percentage if relevant, and the calculator produces a simplified settlement: who pays whom, and how much, using the fewest transactions possible. Instead of everyone transferring money to everyone else, it consolidates payments down to a minimal set that settles every balance exactly.",
    ],
    steps: [
      "Add each person involved in splitting the bill.",
      "Enter the total bill amount, or itemise individual amounts if the split isn't equal.",
      "Add a tip percentage if one applies to the total.",
      "Review the calculated per-person share.",
      "Check the settlement summary showing exactly who owes whom and how much.",
    ],
    benefits: [
      { title: "Minimal number of payments", body: "Rather than everyone paying everyone else, the calculator works out the smallest set of transactions needed to settle every balance." },
      { title: "Handles uneven splits", body: "Not every split needs to be equal — enter individual amounts when people ordered different things or contributed different sums." },
      { title: "Built-in tip handling", body: "Add a tip percentage once and it's factored into everyone's share automatically, rather than calculating it separately." },
    ],
    useCases: [
      "Splitting a restaurant bill between a group of friends, including tip.",
      "Working out shared costs for a trip where people paid for different things.",
      "Dividing monthly rent and utility bills fairly between housemates.",
      "Settling group event costs, such as a shared gift or party expenses.",
      "Figuring out the simplest way to settle up after a group holiday with mixed spending.",
    ],
    sections: [
      { heading: "How settlement simplification works", body: "Instead of every person paying every other person they owe money to, the calculator nets out balances across the whole group and produces the minimum number of transfers needed for everyone to end up even — often just one or two payments instead of many." },
      { heading: "Splitting unequal amounts fairly", body: "When people didn't spend the same amount — one person ordered a more expensive dish, or someone paid for a shared item upfront — enter individual contributions rather than dividing the total equally, and the calculator will account for the imbalance in the final settlement." },
      { heading: "Adding tips and service charges", body: "A tip percentage applied to the total is distributed proportionally across the group's shares, so the settlement figures already include everyone's fair portion of the tip without needing a separate calculation." },
    ],
  },

  "/tools/pdf-to-powerpoint": {
    intro: [
      "PDF to PowerPoint converts each page of a PDF into a slide inside a PowerPoint file, rendered at high resolution so the deck presents cleanly on a projector or screen. It's a straightforward way to turn a PDF deck, report or handout into an editable presentation format without recreating every slide from scratch.",
      "Each PDF page is rendered to fit a standard 16:9 slide and scaled without distortion, so proportions stay correct regardless of the original page's aspect ratio. Because the page content is placed as a high-resolution image on each slide, you can still add your own text boxes, speaker notes and shapes on top — useful when you need to present from a PDF but want the flexibility of PowerPoint's editing tools.",
    ],
    steps: [
      "Upload the PDF you want to convert into a PowerPoint deck.",
      "Wait while each page is rendered at high resolution.",
      "Preview the generated slides in order.",
      "Download the resulting .pptx file.",
      "Open it in PowerPoint or a compatible app to add notes, text boxes or additional slides.",
    ],
    benefits: [
      { title: "Correct slide sizing", body: "Pages are rendered to fit standard 16:9 slides and scaled proportionally, so nothing looks stretched or squashed on a projector or screen." },
      { title: "High-resolution rendering", body: "Each page is converted at a resolution suitable for large-screen presentation, keeping text and diagrams sharp rather than blurry." },
      { title: "Editable afterwards", body: "Because page content sits on each slide as a render, you can still layer your own text boxes, speaker notes and annotations on top in PowerPoint." },
    ],
    useCases: [
      "Turning a PDF report into a presentable slide deck for a meeting.",
      "Converting a PDF handout into slides to present alongside spoken commentary.",
      "Preparing a PDF brochure for a pitch presentation that needs speaker notes added.",
      "Rebuilding an old PDF deck into an editable PowerPoint format for updating.",
      "Converting lecture slides distributed as PDF back into an editable presentation.",
    ],
    sections: [
      { heading: "Are the slides the right size for presenting?", body: "Yes — pages are rendered to fit standard 16:9 slides and scaled without distortion, so the deck displays cleanly whether it's shown on a laptop screen, a conference room projector or a large venue display." },
      { heading: "Can I still edit the text?", body: "Page content is placed as a high-resolution image render on each slide, so the original PDF text itself isn't a separate editable text layer — but you can add your own text boxes, notes and shapes directly on top of each slide once it's open in PowerPoint." },
      { heading: "Best use cases for this conversion", body: "This works best for PDFs designed as visual decks or handouts, where preserving the exact layout matters more than having fully editable text. For a PDF that's mostly dense paragraphs, converting to Word first may be a better starting point for a from-scratch presentation." },
    ],
  },

  "/tools/redact-pdf": {
    intro: [
      "Redact PDF permanently blacks out names, account numbers and other sensitive details in a document by burning the redaction into the page itself, rather than just drawing a black box over the top that hidden text could later be copied out from underneath. It's built for exactly the situations where a simple visual cover-up isn't good enough — contracts, medical records and bank statements being shared with someone who shouldn't see every detail.",
      "Mark the areas you want to redact directly on the page preview, and the tool flattens that region into the page render so the underlying characters are gone, not merely obscured. Because everything happens locally in your browser, the sensitive document never has to be uploaded to a third-party redaction service just to remove a few lines of private information.",
    ],
    steps: [
      "Upload the PDF containing information you need to redact.",
      "Navigate to the page or pages with sensitive content.",
      "Draw a redaction box over each piece of text or detail you want to permanently remove.",
      "Review the marked redactions across all pages before finalising.",
      "Apply the redactions and download the finished PDF with the content permanently removed.",
    ],
    benefits: [
      { title: "Truly permanent removal", body: "Redacted areas are flattened into the page render, so the underlying text is gone completely rather than hidden beneath a rectangle that could be selected and copied." },
      { title: "Processed entirely offline", body: "The document never leaves your browser, which is exactly what's needed for contracts, medical records and bank statements containing sensitive personal data." },
      { title: "Visual precision", body: "Draw redaction boxes exactly over the text or detail that needs removing, rather than covering an entire page or section unnecessarily." },
    ],
    useCases: [
      "Blacking out account numbers before sharing a bank statement with a third party.",
      "Redacting personal identifiers from a medical record before sending it for review.",
      "Removing salary figures from a contract before sharing it more broadly within a company.",
      "Hiding a signature or ID number in a document shared publicly or with a vendor.",
      "Preparing a legal document for discovery by redacting privileged or irrelevant sections.",
    ],
    sections: [
      { heading: "Can redacted text be recovered?", body: "No. The redacted area is flattened directly into the page's rendered content, meaning the underlying characters are removed entirely rather than simply covered by a rectangle that could later be deleted or the text copied out from beneath." },
      { heading: "Is my document uploaded?", body: "No. Redaction happens inside your browser, keeping the process local for exactly the kind of documents where that matters most — contracts, medical records and financial statements." },
      { heading: "Getting redaction boxes right", body: "Zoom in on the page before drawing a redaction box to make sure it fully covers the target text with a small margin, since a box that's slightly too small can leave the edge of a character or digit visible in the final flattened page." },
    ],
  },

  "/tools/word-to-excel": {
    intro: [
      "Word to Excel pulls every table out of a Word document and rebuilds each one as a separate worksheet inside a single Excel workbook, keeping the data structured the way it appeared in the original file rather than dumping it as unformatted text. It's built for the common frustration of receiving data trapped inside a .docx table when what you actually need is a spreadsheet you can sort, filter or calculate with.",
      "Tables become proper spreadsheet rows and columns, while surrounding paragraph text is collected separately so nothing important gets silently dropped during conversion. Multiple tables in the same document each land on their own worksheet inside one workbook, keeping them cleanly separated exactly as they were laid out in the source document, rather than merging everything into one messy sheet.",
    ],
    steps: [
      "Upload the Word document (.docx) containing the tables you want to extract.",
      "Let the tool scan the document and identify each table.",
      "Review the detected tables before conversion.",
      "Convert the document, generating one worksheet per table inside a single workbook.",
      "Download the resulting .xlsx file and open it to check the extracted data.",
    ],
    benefits: [
      { title: "One worksheet per table", body: "Each table in the source document becomes its own sheet in the output workbook, keeping the data separated exactly as it was structured originally." },
      { title: "Nothing gets lost", body: "Non-table paragraph text is captured separately rather than being discarded, so surrounding context isn't silently dropped during the conversion." },
      { title: "Ready to work with immediately", body: "The output is a genuine spreadsheet with real rows and columns, so sorting, filtering and formulas work straight away without reformatting." },
    ],
    useCases: [
      "Extracting a pricing table from a Word proposal into an editable spreadsheet.",
      "Pulling structured data out of a report written in Word into Excel for analysis.",
      "Converting a Word-based inventory list into a spreadsheet for calculations.",
      "Turning a document with multiple comparison tables into separate, sortable worksheets.",
      "Reformatting meeting minutes with tabular action items into a trackable spreadsheet.",
    ],
    sections: [
      { heading: "What happens to non-table text?", body: "Tables become spreadsheet rows and columns as expected, while surrounding paragraphs and headings are collected separately in the output rather than being discarded, so context around each table isn't silently lost during conversion." },
      { heading: "How multiple tables are handled", body: "Each table detected in the source document becomes its own worksheet inside the same workbook, which keeps unrelated tables — for example, a pricing table and a schedule table — cleanly separated instead of being merged into one confusing sheet." },
      { heading: "Formatting expectations after conversion", body: "Cell values transfer as plain data, so any conditional formatting, merged cells or embedded styling from the Word table won't carry over automatically — expect to reapply formatting in Excel if the visual presentation of the original table needs to be preserved." },
    ],
  },
};
