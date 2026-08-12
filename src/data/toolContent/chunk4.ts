import type { ToolContentMap } from "./types";

export const chunk4: ToolContentMap = {
  "/tools/image-crop-tool": {
    intro: [
      "The Image Crop Tool lets you trim any photo directly in your browser using drag handles, a live preview and fixed aspect ratios such as 1:1, 4:3, 16:9 and passport sizes. Whether you need a square crop for an Instagram feed, a 4:5 portrait for a story, or a precise passport-photo ratio, you can drag the crop box, nudge the edges and see the exact result before exporting.",
      "Because nothing is uploaded to a server, cropping stays private and works with JPG, PNG and WebP files of almost any size. Photographers tidying up a shoot, social media managers preparing multiple ratios, and anyone trimming a screenshot before sharing it will find the drag-handle interface faster than opening a full photo editor just to cut a rectangle out of an image.",
    ],
    steps: [
      "Upload the image you want to crop by dragging it in or selecting it from your device.",
      "Choose a fixed ratio such as 1:1, 4:3, 16:9 or passport, or leave it freeform to crop any shape.",
      "Drag the crop box or its corner handles over the area of the photo you want to keep.",
      "Reposition or resize the selection until the live preview shows the framing you want.",
      "Click crop to apply the selection, then review the cropped result.",
      "Download the cropped image as JPG or PNG straight to your device.",
    ],
    benefits: [
      { title: "Fixed ratios built in", body: "Common ratios for social platforms and ID photos are one click away, so you do not need to calculate pixel dimensions by hand. Freeform mode is still available for irregular crops." },
      { title: "No quality loss on the kept pixels", body: "Cropping only removes pixels outside the selection; the pixels you keep are exported unchanged. This is different to resizing, which can soften detail." },
      { title: "Private by design", body: "The photo is decoded and cropped locally in your browser, so personal or sensitive images never leave your device." },
      { title: "Instant visual feedback", body: "Handles and the live preview update in real time as you drag, making it easy to line up a face, logo or horizon exactly where you want it." },
    ],
    useCases: [
      "Cropping a portrait photo to a 1:1 square for a profile picture.",
      "Trimming a wide photo down to 16:9 for a YouTube thumbnail or website banner.",
      "Cutting a passport or ID-style photo to the correct ratio before printing.",
      "Removing distracting edges or backgrounds from a product photo before listing it online.",
      "Preparing the same image in several ratios for Instagram feed, story and Facebook cover.",
      "Cropping a screenshot down to just the relevant window or dialog before sharing it.",
    ],
    sections: [
      { heading: "Supported formats and limits", body: "JPG, PNG and WebP images can be uploaded, and the cropped output can be exported as JPG or PNG. Because processing happens in the browser's own memory, extremely large images (many tens of megapixels) may take a moment longer to render, but there is no artificial file size cap or watermark." },
      { heading: "Crop image without losing quality", body: "Cropping is a lossless-by-selection operation: the tool copies the pixels inside your chosen box exactly as they are. Quality only changes if you also re-save as JPG at a lower quality setting, so keep PNG output if you need a perfectly untouched crop." },
      { heading: "Choosing the right ratio", body: "Use 1:1 for Instagram posts and most avatars, 4:5 for feed portraits, 9:16 for stories and reels, 16:9 for video thumbnails and banners, and the dedicated passport ratio for ID photos. Freeform crop suits screenshots and irregular subjects where no standard ratio applies." },
      { heading: "Compared to desktop editors", body: "Full editors like Photoshop or GIMP can crop too, but they require installation and a learning curve for a task that is really just dragging a rectangle. This tool opens instantly in a tab, keeps the interface focused on cropping, and needs no account or software licence." },
    ],
  },

  "/tools/image-format-converter": {
    intro: [
      "The Image Format Converter changes pictures between JPG, PNG, WebP, AVIF, BMP and GIF entirely inside your browser, with a quality slider and live before-and-after previews so you can judge the trade-off between file size and sharpness before downloading. It handles single images or a batch at once, which suits anyone preparing assets for a website, an app icon set or an email attachment limit.",
      "Different formats exist for different reasons: JPG suits photos, PNG suits graphics with transparency, WebP and AVIF give smaller files at similar quality for the web, and GIF and BMP remain useful for legacy compatibility. Rather than installing conversion software or relying on an online uploader that stores your files, this tool reads and re-encodes images locally, so you keep full control of your originals.",
    ],
    steps: [
      "Add one or more images by dragging them into the converter or browsing your files.",
      "Choose the output format — JPG, PNG, WebP, AVIF, BMP or GIF — from the format selector.",
      "Adjust the quality slider if the format supports lossy compression, watching the preview and estimated file size update.",
      "Repeat for additional images if converting a batch, or apply the same settings to all of them.",
      "Click convert to process the images locally in your browser.",
      "Download the converted file, or all files as a batch, to your device.",
    ],
    benefits: [
      { title: "One tool for every common format", body: "JPG, PNG, WebP, AVIF, BMP and GIF are all supported in both directions, so you rarely need a second converter regardless of the source or target format." },
      { title: "Quality control with live preview", body: "The quality slider shows the resulting file size and a visual preview before you commit, so you can pick the smallest file that still looks sharp." },
      { title: "Batch conversion", body: "Convert a folder's worth of images to the same target format in one pass instead of repeating the process file by file." },
      { title: "Runs entirely client-side", body: "Images are decoded and re-encoded in the browser using its own image APIs, so nothing is uploaded and the tool works even with confidential material." },
    ],
    useCases: [
      "Converting PNG screenshots to JPG to shrink email attachment size.",
      "Turning a batch of JPGs into WebP to speed up a website's page load.",
      "Converting a HEIC or PNG photo to AVIF for the smallest possible file size.",
      "Changing a GIF into a static PNG for use in a document.",
      "Preparing a transparent PNG logo from a converted graphic for use on a coloured background.",
      "Standardising a mixed batch of product photos into one consistent JPG format before uploading to a store.",
    ],
    sections: [
      { heading: "Choosing a format for the web", body: "WebP is a practical default for websites, typically 25-35% smaller than an equivalent-quality JPG with broad browser support. AVIF compresses further still but is slightly less universally supported in older software, and JPG remains the safest fallback for maximum compatibility." },
      { heading: "Does converting lose quality?", body: "Converting between two lossy formats (such as JPG to WebP) re-compresses the image, so some quality loss can occur, though it is usually invisible at sensible quality settings. Converting to a lossless format like PNG preserves whatever quality the source already had." },
      { heading: "Transparency and animation", body: "PNG, WebP and GIF can carry transparency; JPG and BMP cannot, so a transparent PNG converted to JPG will get a solid background fill. GIF can also hold simple animation, which is not preserved when converting to a single-frame format like JPG or PNG." },
      { heading: "Batch limits and performance", body: "The number of images you can convert in one batch is limited only by your device's memory and browser tab, since every image is processed locally. Very large batches of high-resolution photos may take longer to process than a handful of small images." },
    ],
  },

  "/tools/pdf-to-jpg": {
    intro: [
      "PDF to JPG renders every page of a PDF into a high-resolution image, letting you choose the output DPI and either JPG or PNG format before downloading all pages at once. It is built for situations where you need to view, edit or share PDF content as pictures — dropping a page into a slide deck, posting an excerpt on social media, or feeding a scanned page into an image editor.",
      "Because the conversion happens in your browser using the PDF's own rendering engine, layout, fonts and vector graphics come out looking exactly as they do in a PDF viewer, just as flattened images. You can convert a single-page PDF or a lengthy multi-page batch, and process several PDF files together when you need to turn a whole folder of documents into image files without opening each one individually.",
    ],
    steps: [
      "Upload one or more PDF files into the converter.",
      "Choose the output format, JPG or PNG, depending on whether you need transparency or smaller file size.",
      "Set the DPI — lower for on-screen use, 300 or higher for print-quality output.",
      "Preview the rendered pages to confirm they look correct before converting.",
      "Click convert to render every page locally in your browser.",
      "Download individual page images or all pages together as a batch.",
    ],
    benefits: [
      { title: "Adjustable resolution", body: "The DPI setting lets you balance file size against sharpness, from lightweight web previews up to print-ready 300 DPI output." },
      { title: "Handles multi-page and multi-file batches", body: "Every page of a long PDF converts in one pass, and you can queue several PDFs together instead of converting them one at a time." },
      { title: "Faithful rendering", body: "Text, vector graphics and embedded images are rendered exactly as laid out in the PDF, so the resulting JPG or PNG looks identical to the original page." },
      { title: "No file ever leaves your device", body: "Rendering happens locally in the browser, which matters when the PDF contains contracts, ID documents or other sensitive material." },
    ],
    useCases: [
      "Turning a signed contract page into a JPG to paste into an email body or chat message.",
      "Extracting a diagram or chart from a report PDF to reuse in a presentation.",
      "Converting a scanned form to PNG for editing in an image tool.",
      "Producing print-quality 300 DPI images from a PDF flyer for a print shop.",
      "Batch converting a folder of invoices to JPG for archiving alongside photo records.",
      "Creating thumbnail previews of PDF pages for a website or catalogue.",
    ],
    sections: [
      { heading: "Choosing the right DPI", body: "Use 96-150 DPI for images destined for screens and email, where smaller file size matters more than fine detail. Use 300 DPI when the image will be printed or when you need to zoom in on small text without it turning blurry." },
      { heading: "JPG or PNG output?", body: "JPG gives smaller files and suits photo-heavy or scanned pages, while PNG is lossless and better for pages with sharp text, line art or where you need a transparent background is not applicable but crisp edges are. For text-heavy pages, PNG often looks noticeably cleaner at the same DPI." },
      { heading: "Batch conversion and no artificial limits", body: "There is no page-count restriction or forced watermark, and multiple PDF files can be queued for conversion together. Very large documents with hundreds of pages will simply take longer to render since every page is processed as an image locally." },
      { heading: "Troubleshooting blurry output", body: "If the exported image looks soft, increase the DPI before converting rather than upscaling the JPG afterwards, since upscaling cannot recover detail that was never rendered. If text looks fuzzy specifically, try PNG output instead of JPG to avoid compression artefacts." },
    ],
  },

  "/tools/add-page-numbers": {
    intro: [
      "Add Page Numbers to PDF stamps a number onto every page of a document, with full control over position, starting value, font size and format — plain digits, 'Page 1', or 'Page 1 of 20'. It is aimed at anyone finalising a report, thesis, contract or handout who needs consistent, correctly placed numbering without opening a full PDF editing suite.",
      "You can choose where numbering starts, which page it begins on, and where on the page it appears, so a cover page or table of contents can stay unnumbered while the body of the document counts from page one. The whole process runs locally in the browser: the PDF is read, numbers are stamped onto each page, and a new numbered file is produced for download, with no watermark and no page limit.",
    ],
    steps: [
      "Upload the PDF you want to number.",
      "Choose the position for the page number, such as bottom centre, bottom right or top corner.",
      "Select the number format — plain number, 'Page X', or 'Page X of Y'.",
      "Set the starting number and which page the numbering should begin from.",
      "Adjust font size if needed so numbers sit comfortably within existing margins.",
      "Click apply and download the numbered PDF.",
    ],
    benefits: [
      { title: "Flexible starting point", body: "Numbering can begin on any page and from any value, so a cover page or preface stays unnumbered while the main content counts correctly from page one." },
      { title: "Multiple formats", body: "Choose plain numbers, 'Page X' or 'Page X of Y' to match the convention used in academic, legal or corporate documents." },
      { title: "Position and size control", body: "Numbers can be placed in any corner or centred, and sized to sit neatly within existing margins without overlapping content." },
      { title: "Works on any PDF locally", body: "Because the stamping happens in the browser, confidential contracts or unpublished manuscripts never need to be uploaded anywhere." },
    ],
    useCases: [
      "Numbering the pages of a thesis or dissertation with a specific start page after the title and abstract.",
      "Adding 'Page X of Y' numbering to a lengthy contract so pages can be checked as complete.",
      "Stamping simple page numbers on a printed handout for a class or workshop.",
      "Numbering a scanned report before submitting it to a client or authority.",
      "Adding page numbers to an eBook manuscript before sending it to a formatter.",
      "Preparing a numbered meeting pack so attendees can reference specific pages.",
    ],
    sections: [
      { heading: "Where should page numbers go?", body: "Bottom centre or bottom right are the most common and least intrusive positions, keeping numbers clear of body text and any existing footers. Top corners work well for documents that already have a busy footer, such as invoices with banking details." },
      { heading: "Numbering formats explained", body: "Plain numbers suit informal documents, while 'Page X of Y' is preferred in legal and academic contexts because it shows readers the document is complete and how far through it they are. Choose the format before applying, since changing it afterwards means reprocessing the PDF." },
      { heading: "Skipping a cover page", body: "Set the first numbered page separately from the starting value — for example, begin numbering on page 3 with the value '1' so a title page and contents page remain unnumbered while the main body starts at page one." },
      { heading: "Compared to desktop software", body: "Acrobat and similar desktop tools offer the same header and footer stamping, but require an installed licence for a task that takes seconds here. This tool covers position, format and starting value entirely in the browser without needing Acrobat at all." },
    ],
  },

  "/tools/protect-pdf": {
    intro: [
      "Protect PDF marks a document with restriction metadata and permission flags that compliant PDF readers will honour, such as discouraging printing, copying or editing, before you share the file. It is aimed at people who want to signal that a document is restricted or confidential without needing full desktop encryption software.",
      "It is important to understand what this tool does and does not do: it sets permission flags and presentation metadata, it does not apply military-grade AES encryption that makes the file unreadable without a password. For documents that must be completely locked down for legal or compliance reasons, pair this with a password-protection feature in a full desktop PDF suite; for everyday sharing where you want to discourage casual copying or printing, this browser-based tool is quick and requires no installation.",
    ],
    steps: [
      "Upload the PDF you want to protect.",
      "Choose which permissions to restrict, such as printing, copying text or editing.",
      "Review the restriction summary shown before applying changes.",
      "Click apply to write the restriction metadata into the document.",
      "Download the protected PDF, ready to share.",
    ],
    benefits: [
      { title: "No installation required", body: "Restriction metadata is applied entirely in your browser, so you do not need Acrobat or another paid PDF suite to mark a document as restricted." },
      { title: "Granular permission control", body: "Choose independently whether printing, copying or editing should be discouraged, matching the level of restriction to how the document will be used." },
      { title: "Fast turnaround for everyday sharing", body: "For internal drafts or documents you simply want to discourage casual copying of, this is far quicker than setting up full encryption workflow." },
      { title: "Private processing", body: "The PDF is read and modified locally, so the content of confidential documents is never sent to a server during protection." },
    ],
    useCases: [
      "Marking an internal draft report as restricted before circulating it for review.",
      "Discouraging casual copying of proprietary text from a shared document.",
      "Adding a restriction flag to a template before distributing it externally.",
      "Signalling that a document should not be printed to help reduce paper handling of sensitive material.",
      "Preparing a document for limited distribution alongside a separate watermark for identification.",
    ],
    sections: [
      { heading: "Restriction metadata versus real encryption", body: "This tool sets document permission flags that well-behaved PDF readers respect, but it does not encrypt the file's content with AES, so a determined user with different tools could bypass the restriction. For files that must be genuinely unreadable without a password, use full password encryption in desktop software instead." },
      { heading: "Sharing confidential documents safely", body: "Combine restriction settings with a visible watermark identifying the recipient, and share the file through a controlled channel such as a secure link rather than an open upload. Restriction metadata is one layer of a sharing policy, not a complete substitute for access control." },
      { heading: "What readers see", body: "Most modern PDF viewers grey out printing or copying options when restriction flags are set, giving a clear visual signal to the reader that the file is intended to stay controlled, even though the underlying text remains technically present in the file." },
      { heading: "When to use full encryption instead", body: "If the document contains information that would cause real harm if read by an unauthorised person — legal filings, medical records, financial statements — apply password-based AES encryption in a desktop PDF suite rather than relying on restriction metadata alone." },
    ],
  },

  "/tools/powerpoint-to-pdf": {
    intro: [
      "PowerPoint to PDF Converter turns PPT and PPTX presentations into a PDF with one slide per page, ready to email, print as handouts or open on any device without PowerPoint installed. It preserves slide layout, text, images and formatting as a static snapshot of each slide exactly as it would print.",
      "This is useful whenever a presentation needs to travel outside the software that created it: sending slides to a client who may not have PowerPoint, archiving a finished deck in a format that will not reflow or change fonts on another machine, or producing a print-ready handout set for an audience. The conversion runs in your browser, reading the presentation file and rendering each slide into the PDF page by page.",
    ],
    steps: [
      "Upload your PPT or PPTX presentation file.",
      "Wait while each slide is rendered in your browser.",
      "Preview the generated pages to confirm layout and text look correct.",
      "Adjust page orientation or size settings if the option is available for your presentation.",
      "Click convert to produce the final PDF.",
      "Download the PDF, with one slide per page, ready to share or print.",
    ],
    benefits: [
      { title: "Universal compatibility", body: "A converted PDF opens identically on any device or operating system, unlike a PPTX file which can reflow fonts and layout if opened without the original template or fonts installed." },
      { title: "Smaller, simpler file", body: "PDF output is typically far smaller than the source presentation, especially once embedded fonts and editable objects are flattened into static pages." },
      { title: "Ready for print handouts", body: "One slide per page makes the output straightforward to print directly as an audience handout without further formatting." },
      { title: "No PowerPoint installation needed", body: "The conversion happens directly in the browser, so you can turn a deck into PDF on a device that does not have PowerPoint or any office suite installed." },
    ],
    useCases: [
      "Sending a client a finished pitch deck as a PDF so it displays identically on their device.",
      "Archiving a training presentation as PDF once it is finalised and unlikely to change.",
      "Printing lecture slides as a handout for students to annotate.",
      "Sharing a conference presentation publicly after the talk without exposing the editable source.",
      "Converting a proposal deck to PDF before attaching it to a formal tender submission.",
    ],
    sections: [
      { heading: "What is not preserved", body: "PDF is a static, page-based format, so animations, slide transitions and any embedded video playback are not carried over — each slide exports as it appears in its final build state. Speaker notes typically remain in the source file rather than the PDF unless a notes-page export option is chosen." },
      { heading: "Why convert to PDF at all", body: "PDF avoids the font-substitution and layout-shifting problems that occur when a PPTX file opens on a machine without the exact fonts or PowerPoint version used to create it, and it is generally far smaller once linked media is flattened." },
      { heading: "Supported file types", body: "Both legacy .ppt and modern .pptx presentation files are accepted. Very large decks with many high-resolution images may take longer to render since each slide is processed as a page image or vector layout in the browser." },
      { heading: "Compared to exporting from PowerPoint", body: "PowerPoint's own File > Export to PDF does the same core job, but requires an installed and licensed copy of PowerPoint. This tool produces an equivalent result from any browser on any device, which is useful on shared computers or mobile devices." },
    ],
  },

  "/tools/unit-converter": {
    intro: [
      "The Unit Converter switches values between metric and imperial units across length, weight, volume, area, speed, temperature, digital storage, pressure, energy and time, with results updating instantly as you type. It replaces hunting for a specific conversion formula online with a single interface covering the most commonly needed categories in daily life, cooking, travel, construction and study.",
      "Every conversion uses the official SI conversion factors with full floating-point precision, so results for common pairs like cm to inches, kg to lbs or Celsius to Fahrenheit are accurate to many decimal places, not rounded approximations. Selecting a category shows the relevant units for that measurement type, and switching the 'from' and 'to' units recalculates immediately without needing to press a separate convert button.",
    ],
    steps: [
      "Select the measurement category, such as length, weight, temperature or volume.",
      "Choose the unit you are converting from, for example centimetres or kilograms.",
      "Choose the unit you want to convert to, for example inches or pounds.",
      "Type the value into the input field and watch the converted result update instantly.",
      "Swap the from and to units with one click if you need the conversion in the opposite direction.",
    ],
    benefits: [
      { title: "Wide category coverage", body: "Length, weight, volume, area, speed, temperature, digital storage, pressure and energy are all included, avoiding the need for separate single-purpose converters." },
      { title: "Instant, precise results", body: "Conversions use official SI factors with full precision, updating live as you type rather than requiring a submit action." },
      { title: "One-click direction swap", body: "Reversing a conversion, such as switching from cm-to-inches to inches-to-cm, takes a single click instead of re-selecting both units." },
      { title: "No installation or account", body: "Runs entirely as a browser calculation, making it equally usable on a phone during travel or a desktop while doing homework." },
    ],
    useCases: [
      "Converting a recipe's metric measurements to cups and ounces for a US kitchen.",
      "Checking body weight in kg against a lbs-based fitness tracker.",
      "Converting a room's dimensions from feet to metres before ordering flooring.",
      "Working out Celsius to Fahrenheit for weather or oven temperatures while travelling.",
      "Converting file sizes between MB and GB when checking storage requirements.",
      "Converting speed between km/h and mph when reading a foreign road sign or spec sheet.",
    ],
    sections: [
      { heading: "Supported categories in detail", body: "Length (mm to miles), weight and mass (mg to tons), volume (ml to gallons), area (sq m to acres), temperature (Celsius, Fahrenheit, Kelvin), speed, time, digital storage (bytes to terabytes), pressure and energy are all covered, each offering the units people actually search for rather than obscure scientific-only variants." },
      { heading: "Accuracy notes", body: "Conversions are calculated using standard SI definitions and double-precision arithmetic, so results for exact conversions like inches to centimetres are mathematically exact, while approximate historical units are converted using their internationally agreed modern definitions." },
      { heading: "Temperature conversion quirks", body: "Unlike most units, temperature scales are not simple multiplicative conversions — Celsius to Fahrenheit involves both a multiplication and an offset, and Kelvin has no negative values. The tool handles this automatically so you never need to remember the formula." },
      { heading: "Compared to a search engine calculator", body: "Search engine unit converters typically only support one category at a time and require a fresh search per conversion type. This tool keeps all categories in one interface with instant swapping, which is faster when converting several related values in a row." },
    ],
  },

  "/tools/tip-calculator": {
    intro: [
      "The Tip Calculator works out the tip amount and total bill instantly, then splits the result evenly between any number of diners so nobody needs to do mental maths at the table. Enter the bill amount, pick a tip percentage or type a custom one, and set the number of people sharing the bill to see exactly how much each person owes.",
      "It also supports rounding the per-person amount up to a convenient figure, which is handy when paying with cash and wanting to avoid awkward small change. Whether you are settling a restaurant bill with friends, calculating gratuity for a delivery or service worker, or just want to double-check a percentage quickly, the calculator gives an instant, accurate breakdown without needing a separate app.",
    ],
    steps: [
      "Enter the total bill amount before tip.",
      "Choose a tip percentage from the presets or enter a custom percentage.",
      "Enter the number of people splitting the bill.",
      "Review the calculated tip amount, grand total and amount owed per person.",
      "Turn on rounding if you want the per-person amount rounded to a convenient figure.",
    ],
    benefits: [
      { title: "Instant per-person split", body: "Enter the number of diners once and every figure — tip, total and per-person share — updates together, avoiding manual division errors." },
      { title: "Custom and preset percentages", body: "Quick presets cover common tipping norms, while a custom field handles any percentage for unusual situations or local customs." },
      { title: "Convenient rounding option", body: "Rounding the per-person total to a whole number simplifies paying in cash without everyone needing exact change." },
      { title: "Works for any group size", body: "From a two-person dinner to a large group booking, the split calculation scales the same way." },
    ],
    useCases: [
      "Splitting a restaurant bill evenly among a group of friends.",
      "Working out an appropriate tip percentage while travelling in a country with different tipping norms.",
      "Calculating gratuity for a delivery driver or hairdresser quickly on a phone.",
      "Checking a printed receipt's service charge against what you intended to tip.",
      "Dividing a shared takeaway order plus tip fairly between housemates.",
    ],
    sections: [
      { heading: "How much should I tip?", body: "In the United States, 15-20% is standard for table service, rising to 20% or more for excellent service. In much of Europe, 5-10% or simply rounding up is customary since service charges are often already included, and in Japan and some other countries tipping is not expected at all." },
      { heading: "Pre-tax or post-tax bill?", body: "Tipping on the pre-tax subtotal is the traditional convention, since tax is not a service the staff provided. Many people now tip on the post-tax total for simplicity, and the calculator works with whichever figure you enter as the bill amount." },
      { heading: "Rounding for cash payments", body: "When paying in cash, rounding the per-person total up to the nearest whole unit of currency avoids fiddly coin change being handed back and forth, and the small difference this creates usually rounds in the server's favour." },
      { heading: "Splitting unevenly", body: "The equal-split feature assumes everyone shares the bill fairly; for orders where one person had a much more expensive meal, it is often fairer to calculate each person's own subtotal separately and apply the same tip percentage to each share manually." },
    ],
  },

  "/tools/base64-tool": {
    intro: [
      "The Base64 Encoder & Decoder converts plain text into Base64 and back again instantly in your browser, with full Unicode support so accented characters, emoji and non-Latin scripts round-trip correctly. Developers use Base64 constantly to embed binary-safe data inside text formats such as JSON, URLs, email attachments and data URIs, and this tool handles both directions of that conversion without needing a code snippet or terminal command.",
      "Encoding and decoding both happen locally as you type, so there is no delay waiting for a server round trip and no risk of pasting sensitive tokens or credentials into a third-party service. Paste a Base64 string to decode it back to readable text, or type plain text to see its encoded form immediately, with the output ready to copy straight into your code, config file or message.",
    ],
    steps: [
      "Choose whether you want to encode text to Base64 or decode Base64 back to text.",
      "Paste or type your input into the text box.",
      "Watch the converted output appear instantly in the result box.",
      "Copy the result using the copy button.",
      "Switch modes at any time to reverse the conversion on a new input.",
    ],
    benefits: [
      { title: "Full Unicode support", body: "Text containing accented letters, emoji or non-Latin scripts encodes and decodes correctly, unlike some naive Base64 implementations that only handle plain ASCII." },
      { title: "Instant two-way conversion", body: "Both encoding and decoding update live as you type or paste, with no submit button or waiting for a server response." },
      { title: "Safe for sensitive strings", body: "Because conversion happens locally, API keys, tokens or credentials being decoded for debugging are never transmitted anywhere." },
      { title: "Copy-ready output", body: "The result box is formatted for a single click copy straight into code, a config file or a browser address bar." },
    ],
    useCases: [
      "Decoding a JWT token payload segment to inspect its claims during debugging.",
      "Encoding a small image or file into a Base64 data URI for embedding in CSS or HTML.",
      "Decoding a Base64-encoded email attachment header to check its content.",
      "Encoding a string for use inside a URL query parameter that requires binary-safe text.",
      "Checking what a suspicious Base64-looking string in a log file actually says.",
    ],
    sections: [
      { heading: "Base64 is not encryption", body: "Base64 is reversible encoding, not encryption — it exists purely to represent binary data safely inside text-based systems, and anyone can decode it instantly with any Base64 tool. Never rely on Base64 to protect passwords, tokens or other secrets." },
      { heading: "Why the output is longer than the input", body: "Base64 encodes every three bytes of input as four ASCII characters, which inflates the size by roughly 33%. This overhead is the trade-off for making arbitrary binary data safe to place inside text formats like JSON or XML." },
      { heading: "Common uses in development", body: "Base64 commonly appears in JWT tokens, data URIs for inline images, email MIME attachments, and Basic HTTP authentication headers. Recognising the characteristic mix of letters, digits, plus, slash and trailing equals signs is a good sign a string is Base64 encoded." },
      { heading: "Decoding errors and troubleshooting", body: "If decoding fails, check that the input has no line breaks or stray whitespace inside it and that padding characters at the end have not been trimmed off, since both can produce invalid or garbled output." },
    ],
  },

  "/tools/json-formatter": {
    intro: [
      "The JSON Formatter & Validator beautifies messy or minified JSON into readable, indented text with syntax highlighting, and flags syntax errors with a message pointing to the exact line and character where parsing failed. It is aimed at developers debugging API responses, configuration files or data exports where a single misplaced comma or unquoted key can otherwise take a long time to spot by eye.",
      "Alongside pretty-printing, the tool can also minify JSON down to the smallest valid representation for production use, stripping all unnecessary whitespace. Paste any JSON payload, and the validator immediately confirms whether it is syntactically valid, showing a clear, human-readable error location instead of a cryptic parser exception if something is wrong.",
    ],
    steps: [
      "Paste your JSON text into the input area.",
      "Click format to pretty-print it with indentation and syntax highlighting.",
      "Check the error panel if the JSON is invalid — it points to the exact line and issue.",
      "Fix the flagged syntax problem in the input and re-validate.",
      "Switch to minify mode when you need the smallest possible output for production use.",
      "Copy the formatted or minified result to your clipboard.",
    ],
    benefits: [
      { title: "Precise error location", body: "Instead of a generic 'invalid JSON' message, errors point to the specific line and position, making even deeply nested documents quick to debug." },
      { title: "Both formatting directions", body: "Pretty-print for readability while developing, or minify for the smallest payload size in production, using the same tool." },
      { title: "Syntax highlighting", body: "Colour-coded keys, strings, numbers and booleans make it far easier to scan a large JSON document visually than plain monospace text." },
      { title: "No upload of potentially sensitive data", body: "API payloads and config files are formatted locally in the browser, which matters when the JSON contains internal identifiers or credentials." },
    ],
    useCases: [
      "Debugging why an API response fails to parse in an application.",
      "Beautifying a minified configuration file before editing it by hand.",
      "Minifying a JSON payload before shipping it in a production API response.",
      "Checking a webhook payload for syntax errors before writing handling code against it.",
      "Reviewing a large JSON export from a database for structure and correctness.",
    ],
    sections: [
      { heading: "Common JSON syntax errors", body: "Trailing commas after the last item, single quotes instead of double quotes, unquoted object keys, and comments are all invalid in strict JSON even though JavaScript itself tolerates similar-looking syntax. The validator catches each of these and reports where they occur." },
      { heading: "When to minify versus pretty-print", body: "Minify JSON for API responses and production payloads, where removing whitespace reduces bandwidth and parsing overhead. Keep pretty-printed JSON for configuration files, documentation examples and anywhere a human needs to read or edit it directly." },
      { heading: "Nested data and large documents", body: "The formatter handles deeply nested objects and arrays correctly, indenting each level consistently, which is particularly useful for spotting missing brackets in large, deeply nested API responses that would be unreadable in their raw minified form." },
      { heading: "Compared to browser dev tools", body: "Browser console JSON viewers are useful but tied to a specific request; this formatter works with any JSON text pasted from anywhere — a file, an email, a log line — without needing to trigger the original network request." },
    ],
  },

  "/tools/document-translator": {
    intro: [
      "Document Translator converts text and document content between dozens of languages while keeping paragraph structure intact, so a translated document still reads with the same layout and breaks as the source. It suits anyone who needs a quick, free translation of a letter, article, contract summary or extracted document text without setting up an account with a dedicated translation service.",
      "Paste text directly or work with content extracted from a document, choose the source and target languages, and the translation is generated immediately for review and copying. It is well suited to everyday translation needs — understanding foreign correspondence, translating a short document for a colleague, or getting the gist of text in a language you do not speak — rather than certified legal or medical translation, which should always involve a professional human translator.",
    ],
    steps: [
      "Paste or type the text you want to translate into the source box.",
      "Select the source language, or let the tool detect it automatically.",
      "Choose the target language you want the text translated into.",
      "Review the translated output, which preserves the original paragraph breaks.",
      "Copy the translated text to use in your document, email or message.",
    ],
    benefits: [
      { title: "Preserves paragraph structure", body: "Translated text keeps the same paragraph breaks as the source, so pasting it back into a document does not require manually re-splitting a wall of text." },
      { title: "Broad language coverage", body: "Dozens of major languages are supported, covering the languages most commonly needed for everyday correspondence and study." },
      { title: "No account required", body: "Translation happens without signing up or configuring an API key, making it usable the moment you need it." },
      { title: "Fast turnaround", body: "Translated results appear within moments of submitting text, without the delays of emailing a document to a translation service." },
    ],
    useCases: [
      "Translating a foreign-language email before replying to it.",
      "Getting the gist of an article or blog post written in another language.",
      "Translating a short document extract to share understanding with a colleague.",
      "Converting a travel itinerary or booking confirmation into your native language.",
      "Drafting a rough translation of a message before refining it with a native speaker.",
    ],
    sections: [
      { heading: "Which languages are supported", body: "Dozens of major world languages are available as both source and target, covering the languages most commonly requested for personal, academic and business correspondence. Language pairs that are less common may produce slightly less fluent results than translations between widely used languages." },
      { heading: "Machine translation limitations", body: "Automatic translation is excellent for understanding gist and drafting quick replies, but idioms, legal terminology and highly technical language can be translated imprecisely. For contracts, medical information or anything with legal or safety consequences, have the output checked by a qualified human translator." },
      { heading: "Working with document text", body: "For best results, extract the text you need from a PDF or Word document first using the appropriate conversion tool, then paste that plain text in for translation, since this keeps paragraph structure clean and avoids formatting artefacts interfering with the translation." },
      { heading: "Privacy considerations", body: "As with any translation service, avoid pasting highly sensitive personal, financial or confidential business information unless you have confirmed how that text is handled, and prefer redacting identifying details when only the general meaning is needed." },
    ],
  },

  "/tools/file-hash-checker": {
    intro: [
      "File Hash Checker calculates MD5, SHA-1 and SHA-256 checksums for any file selected from your device, letting you compare the result against a value published by the file's source to confirm the download has not been corrupted or tampered with. This is the standard way software distributors and security-conscious users verify that a downloaded ISO, installer or archive matches exactly what was released.",
      "The file is read and hashed locally in your browser using the same cryptographic algorithms used by command-line tools like certutil, md5sum and shasum, so the result is directly comparable to values published on a download page or in a release note. Because hashing happens on-device, even very large files such as operating system images can be verified without uploading gigabytes of data anywhere.",
    ],
    steps: [
      "Select the file you want to check from your device.",
      "Wait while the browser computes MD5, SHA-1 and SHA-256 hashes locally.",
      "Copy the computed hash for the algorithm the publisher provided.",
      "Paste or view the publisher's published checksum alongside it.",
      "Compare the two values character by character, or use the built-in match indicator if available.",
    ],
    benefits: [
      { title: "Multiple algorithms in one pass", body: "MD5, SHA-1 and SHA-256 are all calculated together, so whichever checksum format the publisher provided, you have a matching value ready to compare." },
      { title: "Handles large files", body: "Because hashing runs locally, even multi-gigabyte disk images or installers can be verified without waiting for an upload to complete." },
      { title: "No data transmitted", body: "The file itself never leaves your device — only the resulting hash values, which are just short strings, are ever shown on screen." },
      { title: "Same algorithms as command-line tools", body: "Results match what you would get from certutil, md5sum or shasum, so the check is trustworthy for verifying software releases." },
    ],
    useCases: [
      "Verifying a downloaded Linux distribution ISO against the checksum published on the project's website.",
      "Confirming a large file transfer between drives completed without corruption.",
      "Checking that a downloaded software installer matches the vendor's published SHA-256 hash before running it.",
      "Comparing two copies of the same file to confirm they are byte-for-byte identical.",
      "Verifying archived backup files have not degraded or changed over time.",
    ],
    sections: [
      { heading: "Why verify a download's checksum", body: "A matching hash proves the downloaded file is byte-for-byte identical to the one the publisher released, ruling out network corruption, an interrupted download, or a tampered mirror serving a modified file." },
      { heading: "Is my file uploaded to check the hash?", body: "No — the file is read and hashed entirely within your browser using built-in cryptographic functions, so nothing about the file's contents is sent to any server, which is why even very large files can be checked without a lengthy upload." },
      { heading: "MD5 versus SHA-256", body: "MD5 and SHA-1 are fast but considered cryptographically weak for security purposes, though they remain fine for simple integrity checks such as confirming a transfer completed correctly. SHA-256 is the modern standard and is what most security-conscious software distributors now publish." },
      { heading: "What to do if the hashes do not match", body: "A mismatch means the file differs from the published original in some way — re-download it from the official source, and if the mismatch persists, treat the file as untrustworthy and do not run or open it." },
    ],
  },

  "/tools/url-shortener": {
    intro: [
      "URL Shortener takes a long, unwieldy web address and produces a short, shareable link in one click, with no account creation and no artificial expiry games designed to push you toward a paid tier. It is built for the everyday moments where a long URL is awkward — pasting a link into a text message, reading it aloud, printing it on a flyer, or fitting it within a social media character limit.",
      "Paste in any valid URL and the shortener generates a compact link through a public shortening service, ready to copy and share immediately. Because there is no sign-up step, it suits quick, one-off sharing needs just as well as regular use, and the resulting short link can be pasted straight into a QR code generator when you need a scannable version for print material.",
    ],
    steps: [
      "Paste the long URL you want to shorten into the input field.",
      "Click the shorten button to generate a compact link.",
      "Copy the shortened URL using the copy button.",
      "Test the link by opening it to confirm it redirects to the correct page.",
      "Share the short link via message, social post or printed material.",
    ],
    benefits: [
      { title: "No account needed", body: "Short links are created instantly without registering, which is ideal for a one-off link you need to share right now." },
      { title: "Cleaner sharing for messages and print", body: "A compact URL fits comfortably in a text message, a printed flyer, a business card or a character-limited social post." },
      { title: "Pairs with QR code generation", body: "Shortening a URL first keeps the resulting QR code simpler and easier for phone cameras to scan reliably." },
      { title: "Persistent by default", body: "Links remain active indefinitely under normal use, rather than expiring after an arbitrary trial period." },
    ],
    useCases: [
      "Sharing a long product page link in a text message without it wrapping across several lines.",
      "Printing a short, memorable link on a flyer, poster or business card.",
      "Fitting a link within a character-limited social media post.",
      "Creating a compact link to convert into a QR code for a printed menu or poster.",
      "Reading a web address aloud during a presentation or video without stumbling over query parameters.",
    ],
    sections: [
      { heading: "Do the short links expire?", body: "Short links are created through a public shortening service and remain active indefinitely under normal circumstances, unless the provider removes a specific link for abuse or policy violations." },
      { heading: "Turning a short link into a QR code", body: "Shorten the URL first, then paste the result into a QR code generator. Because the QR code encodes fewer characters, the resulting pattern is simpler and easier for phone cameras to scan quickly, especially at small print sizes." },
      { heading: "Link safety considerations", body: "Because a short link hides the destination URL until it is clicked, it is good practice to only share short links you created yourself, and to be cautious clicking unfamiliar shortened links from untrusted sources." },
      { heading: "Limits and reliability", body: "Any valid, publicly reachable URL can be shortened. Extremely long URLs with unusual characters occasionally need minor adjustment, but standard web addresses with query parameters, anchors and international characters are all handled correctly." },
    ],
  },

  "/tools/credit-card-validator": {
    intro: [
      "Credit Card Validator checks whether a card number is mathematically valid using the Luhn checksum algorithm and identifies the issuing network — Visa, Mastercard, American Express and others — based on the number's prefix and length. It is a developer and testing tool for confirming input validation logic, not a way to check whether a real card has funds or is currently active.",
      "The entire check happens locally in your browser: the digits you type are run through the Luhn algorithm on-device, and nothing about the card number is transmitted anywhere or stored. This makes it safe to use with real card numbers for format-checking purposes, though the tool's real value is confirming that a number is structurally valid, which is only ever a first step before an actual payment processor performs the real authorisation.",
    ],
    steps: [
      "Type or paste the card number into the input field.",
      "Watch the tool identify the card network automatically from the number's prefix.",
      "Check the Luhn validation result to see whether the checksum is mathematically valid.",
      "Review the detected card length against the expected length for that network.",
      "Clear the field before closing the tab if you tested with a real card number.",
    ],
    benefits: [
      { title: "Instant Luhn validation", body: "The checksum calculation runs the moment you finish typing, immediately flagging a mistyped or fabricated card number." },
      { title: "Automatic network detection", body: "Visa, Mastercard, American Express, Discover and other major networks are identified from the number's prefix and length pattern." },
      { title: "Fully local processing", body: "No card number is ever transmitted to a server, since the Luhn algorithm and network detection both run as simple client-side calculations." },
      { title: "Useful for developers", body: "Testing payment form validation logic is quicker with a tool that instantly confirms whether a test number passes the same checksum real payment systems check first." },
    ],
    useCases: [
      "Testing a payment form's client-side validation logic during development.",
      "Confirming a manually typed card number was entered correctly before submitting a payment.",
      "Checking which network a card belongs to from its number alone.",
      "Verifying sample or test card numbers used in a QA environment follow the expected format.",
      "Teaching or demonstrating how the Luhn checksum algorithm works.",
    ],
    sections: [
      { heading: "Does this check whether a card has funds?", body: "No. This tool only validates the number's mathematical structure using the Luhn checksum and identifies the likely issuing network from its prefix; verifying balance, credit limit or whether the card is active requires contacting the issuing bank through an authorised payment processor." },
      { heading: "How the Luhn algorithm works", body: "Starting from the rightmost digit, every second digit is doubled, and if doubling produces a number greater than nine, its digits are summed. All digits are then added together, and the number is valid only if the total is a multiple of ten — a simple but effective way to catch typos and transposed digits." },
      { heading: "Identifying the card network", body: "Networks are identified by standardised prefixes: Visa numbers start with 4, Mastercard with 51-55 or 2221-2720, and American Express with 34 or 37, each with a defined expected length that the tool checks alongside the prefix." },
      { heading: "Privacy when testing with real numbers", body: "Although the check is entirely local and nothing is transmitted, it is good practice to clear the field after testing and avoid leaving real card numbers visible on screen or saved in browser history through autofill." },
    ],
  },

  "/tools/business-card-generator": {
    intro: [
      "Business Card Generator designs a print-ready business card in your browser, letting you set colours, fonts, a logo and your contact details, then export the finished design as a PDF or PNG at standard card dimensions. It removes the need for design software when you just need a clean, professional card quickly, whether for a new job, a freelance side project or an event.",
      "Choose from layout and colour options, add your name, title, company and contact details, upload a logo if you have one, and preview the card at actual size before exporting. Because the output is sized to standard card dimensions with correct proportions, the finished PDF or PNG can be sent straight to a print shop or an online printing service without further adjustment.",
    ],
    steps: [
      "Choose a card template or layout to start from.",
      "Enter your name, job title, company and contact details into the fields.",
      "Upload a logo image if you want one included on the card.",
      "Customise colours and fonts to match your branding.",
      "Preview the card at actual print size to check the layout.",
      "Export the finished design as a print-ready PDF or PNG.",
    ],
    benefits: [
      { title: "Standard print sizing", body: "The design is generated at recognised business card dimensions, so it is ready to send directly to a printer without needing to resize or reposition elements." },
      { title: "Full visual customisation", body: "Colours, fonts and logo placement are all adjustable, letting the card reflect a personal or company brand rather than a generic template look." },
      { title: "PDF or PNG export", body: "Export as a print-ready PDF for a professional printer, or as a PNG for quick digital sharing such as an email signature or LinkedIn profile card." },
      { title: "No design software required", body: "The whole process happens in the browser, so you do not need Illustrator, Canva or any other design tool installed to produce a finished card." },
    ],
    useCases: [
      "Designing a business card quickly for a new job or freelance role.",
      "Creating a digital business card image to attach to an email signature.",
      "Producing a print-ready PDF to send to an online printing service.",
      "Making a temporary event or conference name card with contact details.",
      "Designing a personal side-project or consulting card without hiring a designer.",
    ],
    sections: [
      { heading: "Standard business card sizes", body: "The most common size is 3.5 x 2 inches (89 x 51 mm) in North America, while most of Europe and Asia use 85 x 55 mm. For professional printing, a 3 mm bleed margin around the edge is recommended so trimming does not cut into text or the border." },
      { heading: "What to include on a card", body: "Name, role, company name, one phone number, one email address, and a website or social handle keep a card readable and useful. Adding too many contact methods clutters a small card — pick the ones you actually want people to use." },
      { heading: "Logo and image quality", body: "Upload a logo at the highest resolution you have available, since a small or heavily compressed image will look pixelated once placed and scaled on the card. PNG logos with a transparent background blend most cleanly into custom colour schemes." },
      { heading: "Preparing the file for a print shop", body: "Export as PDF for professional printing, since PDF preserves exact dimensions, colours and vector text sharpness better than a raster image, and most print shops expect a print-ready PDF as their standard upload format." },
    ],
  },

  "/tools/compound-interest-calculator": {
    intro: [
      "The Compound Interest Calculator projects how savings or an investment will grow over time, factoring in the initial deposit, annual interest rate, chosen compounding frequency and any regular monthly contributions. It produces a year-by-year breakdown so you can see exactly how much of the final balance came from your own contributions versus interest earned along the way.",
      "Because compounding frequency genuinely changes the outcome — daily compounding grows a balance faster than the same nominal rate compounded yearly — the calculator lets you choose yearly, half-yearly, quarterly, monthly or daily compounding to match a specific savings account, bond or investment product. It is useful for comparing savings products, planning retirement contributions, or simply understanding how much a habit of monthly deposits will be worth after a given number of years.",
    ],
    steps: [
      "Enter your initial deposit or starting principal amount.",
      "Enter the annual interest rate as a percentage.",
      "Select the compounding frequency — yearly, half-yearly, quarterly, monthly or daily.",
      "Add a monthly contribution amount if you plan to keep depositing money regularly.",
      "Set the number of years to project the growth over.",
      "Review the year-by-year breakdown showing balance, contributions and interest earned.",
    ],
    benefits: [
      { title: "Multiple compounding frequencies", body: "Comparing yearly against monthly or daily compounding on the same rate shows exactly how much difference the frequency itself makes to the final balance." },
      { title: "Supports regular contributions", body: "Adding a recurring monthly deposit models a realistic savings plan rather than only a single lump-sum investment." },
      { title: "Year-by-year transparency", body: "The breakdown separates how much of the ending balance came from contributions versus interest, making the power of compounding visible rather than just a final number." },
      { title: "Instant scenario comparison", body: "Changing the rate, frequency or contribution amount recalculates immediately, making it easy to compare several savings scenarios side by side." },
    ],
    useCases: [
      "Projecting how a savings account balance will grow over 10 years with monthly deposits.",
      "Comparing two savings products with the same rate but different compounding frequencies.",
      "Estimating retirement fund growth from a starting lump sum plus ongoing monthly contributions.",
      "Working out how long it will take a fixed deposit to reach a target amount.",
      "Understanding how much of a final balance is interest versus the money actually deposited.",
    ],
    sections: [
      { heading: "Supported compounding frequencies", body: "Yearly, half-yearly, quarterly, monthly and daily compounding are all available. The frequency matters because interest earned in one period starts earning its own interest sooner with more frequent compounding, so the same nominal annual rate compounded daily produces a slightly higher effective return than compounded yearly." },
      { heading: "Including monthly contributions", body: "Adding a monthly deposit models a realistic savings habit rather than assuming all money is invested at the start. The calculator adds each contribution at the point in the schedule it would occur and continues compounding on the growing balance from there." },
      { heading: "Reading the year-by-year breakdown", body: "Each row shows the balance at that point, the running total of contributions made, and the interest earned so far, which makes it clear that in the early years most growth comes from your own deposits, while in later years interest increasingly compounds on itself." },
      { heading: "Limitations of the projection", body: "The calculator assumes a constant interest rate and consistent contributions throughout the period, which is a simplification — real investments fluctuate, and interest rates on savings accounts can change. Treat the output as an illustrative projection rather than a guaranteed outcome." },
    ],
  },

  "/tools/image-to-text": {
    intro: [
      "Image to Text Converter uses optical character recognition (OCR) running entirely in your browser to pull editable text out of photos, screenshots and scanned pages, supporting twelve languages including English, Spanish, French, German, Arabic, Urdu, Hindi, Chinese, Japanese and Russian. Because the OCR engine processes the image on-device, nothing is uploaded, which matters when extracting text from personal documents, ID cards or handwritten notes.",
      "Upload a photo of a page, a screenshot of an article, or a scanned document, choose the correct language for the best accuracy, and the extracted text appears ready to copy and edit. It saves the tedious work of manually retyping text from an image — a printed recipe, a whiteboard photo from a meeting, a screenshot of an error message — into something you can actually search, edit or paste elsewhere.",
    ],
    steps: [
      "Upload the image containing the text you want to extract.",
      "Select the language the text is written in for the most accurate recognition.",
      "Click extract to run OCR on the image in your browser.",
      "Review the extracted text against the original image for any recognition errors.",
      "Edit or correct any misread characters directly in the output box.",
      "Copy the final text to use elsewhere.",
    ],
    benefits: [
      { title: "Twelve supported languages", body: "Covering English, Spanish, French, German, Arabic, Urdu, Hindi, Chinese, Japanese, Russian and more means the correct character set and language model is used for accurate recognition." },
      { title: "No upload of personal images", body: "OCR runs locally in the browser, so photographed documents, screenshots or ID cards never leave your device during processing." },
      { title: "Handles varied sources", body: "Photos, screenshots and scanned pages are all supported, rather than requiring a perfectly flat scanner input." },
      { title: "Editable output immediately", body: "Extracted text lands in an editable box, ready for quick correction of any misread characters before copying." },
    ],
    useCases: [
      "Extracting text from a photographed page of a book or printed document.",
      "Converting a screenshot of an error message or article into searchable, copyable text.",
      "Pulling text out of a scanned form to reuse in a digital document.",
      "Digitising handwritten or printed notes photographed on a whiteboard.",
      "Extracting a quote or paragraph from an image sent in a message.",
      "Recovering text from an image when the original document file is unavailable.",
    ],
    sections: [
      { heading: "Getting the most accurate result", body: "Use a sharp, well-lit, straight-on photo with good contrast between the text and its background. Blurry, angled, low-resolution or heavily shadowed images significantly reduce OCR accuracy, so retaking a photo in better lighting often helps more than any setting adjustment." },
      { heading: "Choosing the right language", body: "Selecting the correct language before extracting matters because the OCR engine uses a language-specific character model — choosing English for an Arabic document, for example, will produce garbled output even on a perfectly clear image." },
      { heading: "Handwriting recognition limits", body: "Printed text is recognised far more reliably than handwriting, since handwriting varies enormously between individuals. Neat, clearly separated handwriting has a reasonable chance of accurate extraction, but cursive or rushed handwriting may need manual correction afterwards." },
      { heading: "Reviewing and correcting output", body: "Always check extracted text against the original image before relying on it, particularly for numbers, punctuation and similar-looking characters such as 0/O or 1/l/I, which are the most common sources of OCR misreads." },
    ],
  },

  "/tools/bates-numbering": {
    intro: [
      "Bates Numbering stamps a sequential identifier — such as ABC000123 — onto every page of a PDF, with full control over the prefix, suffix, starting number and digit padding. This is the standard method legal teams and litigation support staff use to index discovery documents, so that any page can be cited precisely in correspondence, depositions or court filings.",
      "Set a case-specific prefix, choose how many digits the number should be padded to, and pick where on the page the stamp appears, then apply it across an entire PDF or a batch of documents in one pass. Because the numbering runs locally in the browser, confidential discovery material never needs to be uploaded to a third-party server just to have consistent page identifiers applied to it.",
    ],
    steps: [
      "Upload the PDF or set of PDFs that need Bates numbers applied.",
      "Set a prefix, such as an abbreviation for the case or client.",
      "Choose the starting number and how many digits it should be padded to.",
      "Add a suffix if your indexing convention requires one.",
      "Set the position and text size for the stamp on each page.",
      "Apply the numbering and download the stamped PDF.",
    ],
    benefits: [
      { title: "Full format control", body: "Prefix, suffix, starting number and digit padding can all be set precisely to match a firm's or court's specific indexing convention." },
      { title: "Consistent sequential stamping", body: "Every page receives the next number in sequence automatically, removing the risk of manual numbering errors across a large discovery set." },
      { title: "Batch-friendly workflow", body: "Multiple PDFs can be processed with continuous numbering, keeping a large document production correctly indexed from start to finish." },
      { title: "Confidential material stays local", body: "Discovery documents are stamped entirely in the browser, avoiding the need to upload sensitive case files to an external service." },
    ],
    useCases: [
      "Stamping a discovery production with sequential Bates numbers before sending it to opposing counsel.",
      "Applying a case-specific prefix and numbering to exhibits before a deposition.",
      "Re-numbering a document set after new pages have been inserted mid-production.",
      "Indexing a large PDF of scanned records for reference in a legal brief.",
      "Preparing a numbered document bundle for submission to a court or tribunal.",
    ],
    sections: [
      { heading: "What is Bates numbering", body: "It is a sequential identifier, typically combining a short prefix with a padded number such as ABC000123, stamped onto every page of a document set so that legal teams can reference an exact page unambiguously across potentially thousands of pages of discovery material." },
      { heading: "Choosing prefix and digit format", body: "The prefix commonly reflects a party abbreviation or case reference, while digit padding (such as six digits) ensures that page numbers sort and align consistently even once the total page count reaches the thousands, so ABC000001 lines up visually with ABC012345." },
      { heading: "Consistency across large productions", body: "When a discovery production spans multiple PDF files, applying numbering with a continuing starting value for each subsequent file (rather than restarting from one) keeps the overall document set correctly and uniquely indexed." },
      { heading: "Position and readability", body: "Bates stamps are typically placed in a bottom corner where they will not obscure body text, at a size small enough to be unobtrusive but large enough to remain legible when the document is printed or viewed as a scanned image." },
    ],
  },

  "/tools/extract-pdf-images": {
    intro: [
      "Extract Images from PDF scans a document for every embedded photo and graphic object and lets you download each one as a PNG file at its original resolution, without taking a screenshot or manually cropping a rendered page. This is useful whenever the actual images used to build a PDF — not a flattened copy of the whole page — are what you need.",
      "Because the tool reads the PDF's internal image objects directly, the extracted files come out at the same pixel dimensions they were embedded at, rather than being downsampled or recompressed as they would be if you exported the page as a screenshot. The entire process runs locally in the browser, so PDFs containing personal photos or proprietary graphics never need to be uploaded anywhere to pull the images back out.",
    ],
    steps: [
      "Upload the PDF that contains the images you want to extract.",
      "Wait while the tool scans the document for embedded image objects.",
      "Review the thumbnails of every image found in the PDF.",
      "Select the images you want, or choose to extract all of them at once.",
      "Download the selected images as PNG files, or as a batch if extracting several.",
    ],
    benefits: [
      { title: "Original resolution preserved", body: "Because the tool pulls the actual embedded image data rather than rendering the page, extracted files come out at full original pixel dimensions rather than a screen-resolution screenshot." },
      { title: "Finds every embedded image", body: "The scan checks the whole document's internal structure, catching images that might be easy to miss when scrolling through a long PDF manually." },
      { title: "Batch download", body: "All discovered images can be extracted together in one action, saving time compared with saving each picture from a page individually." },
      { title: "Fully offline processing", body: "Since extraction happens locally, PDFs containing personal, proprietary or otherwise sensitive graphics stay entirely on your device." },
    ],
    useCases: [
      "Recovering the original photos used in a PDF brochure or catalogue.",
      "Pulling diagrams or charts out of a report PDF for reuse in a new document.",
      "Extracting scanned photo attachments that were embedded inside a PDF cover sheet.",
      "Getting a company logo out of a PDF letterhead template as a standalone image file.",
      "Retrieving illustrations from an eBook or manual PDF for reference.",
    ],
    sections: [
      { heading: "Are images saved at full resolution?", body: "Yes — the tool reads the PDF's embedded image objects directly, so the files you download match the original pixel dimensions the images were embedded at, rather than a lower-resolution rendering of the printed page." },
      { heading: "Why nothing was found in a PDF", body: "PDFs built from vector graphics or text alone contain no bitmap image objects to extract, since lines, shapes and text are drawn as instructions rather than stored as pictures. In that case, use a PDF to JPG converter instead to export whole pages as images." },
      { heading: "Output format and file naming", body: "Extracted images are provided as PNG files, which preserve quality losslessly regardless of the image's original embedded format, and each file is numbered to correspond with its position and order of appearance in the source document." },
      { heading: "Handling PDFs with many images", body: "Documents containing dozens of embedded photos are scanned and listed as thumbnails so you can select only the ones you actually need, rather than being forced to download the entire set when only a couple of images are relevant." },
    ],
  },

  "/tools/n-up-pdf": {
    intro: [
      "Pages Per Sheet (N-up) rearranges a PDF so that 2, 4, 6 or 9 original pages are scaled down and placed together onto a single A4 sheet, cutting the number of physical pages needed to print a document. Each page is automatically scaled, centred and can be given a thin border, which keeps the layout tidy and makes cutting sheets apart afterwards straightforward if that is the goal.",
      "This is the browser-based equivalent of a printer driver's 'multiple pages per sheet' option, but it produces an actual reorganised PDF file rather than relying on print dialog settings that vary between printers and operating systems. It works well for slide handouts, flashcards, draft proofreading copies and any situation where saving paper and ink matters more than having each page at full size.",
    ],
    steps: [
      "Upload the PDF you want to rearrange.",
      "Choose how many pages per sheet you want — 2, 4, 6 or 9.",
      "Select whether to add a border around each page for easier cutting.",
      "Preview the arranged sheet layout before processing.",
      "Click apply to generate the new N-up PDF.",
      "Download the resulting PDF with reduced page count.",
    ],
    benefits: [
      { title: "Cuts paper and ink use directly", body: "Fitting multiple pages per sheet reduces the physical page count needed to print a document by half, a quarter or more depending on the layout chosen." },
      { title: "Consistent layout regardless of printer", body: "Because the rearrangement is baked into the PDF itself, the layout looks the same wherever it is printed, unlike relying on a printer driver's own multi-page option." },
      { title: "Optional cutting guides", body: "Adding a border around each shrunk page makes it easy to trim sheets apart cleanly when producing flashcards or individual handout slips." },
      { title: "Works for any page count", body: "Documents of any length can be rearranged, with the tool automatically calculating how many output sheets are needed for the chosen layout." },
    ],
    useCases: [
      "Printing lecture slides as a compact 4-up or 6-up handout for students.",
      "Producing flashcards from a PDF of vocabulary or study terms using 9-up layout.",
      "Creating a paper-saving draft printout of a long report for proofreading.",
      "Combining several small labels or tickets from separate pages onto one printable sheet.",
      "Printing a booklet-style handout with two pages per sheet for a meeting pack.",
    ],
    sections: [
      { heading: "Why put several pages on one sheet", body: "It reduces printing cost roughly in proportion to the layout chosen — halving it with 2-up, quartering it with 4-up — and is well suited to handouts, flashcards and draft copies where readability at full page size is not essential." },
      { heading: "Are the pages still readable?", body: "At 2-up and 4-up on A4, most standard documents remain comfortably legible, since each shrunk page is still a reasonable fraction of the sheet. At 6-up and 9-up, text-dense pages become harder to read, so these layouts suit slides, images or short pages with large text best." },
      { heading: "Layout and orientation", body: "Pages are automatically scaled to fit their allotted position on the sheet and centred within it, keeping margins even. The overall sheet orientation can typically be adjusted to landscape or portrait depending on which suits the chosen number of pages per sheet." },
      { heading: "Compared to printer driver settings", body: "Many printer drivers offer a similar multi-page-per-sheet option, but behaviour varies between printer models and operating systems, and it only affects the physical printout rather than the PDF file itself. This tool bakes the layout into a new PDF, so the same file prints identically anywhere and can also be shared digitally in its compact form." },
    ],
  },

  "/tools/sleep-calculator": {
    intro: [
      "The Sleep Calculator works out the best bedtime or wake-up time based on 90-minute sleep cycles, so you wake up between cycles rather than in the middle of deep sleep. Enter either the time you need to wake up or the time you plan to go to bed, and the calculator shows several options spaced a full cycle apart, each ending at a natural point in the sleep cycle.",
      "It also accounts for the typical time it takes to actually fall asleep after getting into bed, so the suggested bedtimes are realistic rather than assuming instant sleep onset. This is useful for anyone trying to avoid the groggy, disoriented feeling of being woken mid-cycle — students setting an alarm before an exam, shift workers adjusting their schedule, or anyone trying to build a more consistent sleep routine.",
    ],
    steps: [
      "Choose whether you want to calculate a bedtime or a wake-up time.",
      "Enter the wake-up time you need, or the time you plan to go to sleep.",
      "Review the list of suggested times, each spaced a full 90-minute cycle apart.",
      "Pick the option that gives you the closest to a full number of sleep cycles for your schedule.",
      "Adjust the input if your actual bedtime shifts, and recheck the updated suggestions.",
    ],
    benefits: [
      { title: "Based on real sleep cycle length", body: "Suggestions are spaced in 90-minute increments, matching the average length of a full human sleep cycle rather than arbitrary round numbers." },
      { title: "Works in either direction", body: "Calculate the ideal bedtime for a fixed wake-up time, or the ideal wake-up time for a bedtime you already have set." },
      { title: "Accounts for falling-asleep time", body: "The suggested bedtimes build in a realistic allowance for the time it typically takes to actually fall asleep after getting into bed." },
      { title: "Multiple options provided", body: "Several times are shown a cycle apart, letting you choose the option that best fits an exam, meeting or flight the next day." },
    ],
    useCases: [
      "Working out what time to go to bed to wake up refreshed for an early flight or exam.",
      "Planning an ideal wake-up time based on a fixed bedtime on a work night.",
      "Adjusting a sleep schedule gradually to avoid grogginess from mid-cycle waking.",
      "Helping a shift worker find sensible sleep windows around irregular hours.",
      "Choosing an alarm time that avoids waking during deep sleep before a demanding day.",
    ],
    sections: [
      { heading: "Why 90-minute cycles matter", body: "A full sleep cycle, moving through light sleep, deep sleep and REM, averages about 90 minutes in adults. Waking at the boundary between cycles, when sleep is naturally lighter, produces a noticeably more alert start to the day than waking abruptly from deep sleep mid-cycle." },
      { heading: "How many cycles do adults need", body: "Most adults function best on 5 to 6 complete cycles a night, which works out to roughly 7.5 to 9 hours of sleep. Fewer than 4-5 cycles regularly is associated with the kind of sleep debt that builds up and affects concentration and mood." },
      { heading: "Falling asleep time allowance", body: "The calculator adds a typical 10-20 minute allowance between getting into bed and actually falling asleep, since suggesting a bedtime based on instant sleep onset would consistently produce wake-up times slightly earlier than intended in practice." },
      { heading: "Limitations of the calculation", body: "Individual sleep cycle length varies somewhat from the 90-minute average, and factors like caffeine, stress, screen use before bed and irregular schedules all affect actual sleep quality. Treat the suggested times as a helpful guide rather than an exact guarantee." },
    ],
  },

  "/tools/pdf-to-excel": {
    intro: [
      "PDF to Excel converts tables inside a PDF into a genuine Excel .xlsx workbook, mapping detected rows and columns into real spreadsheet cells rather than producing an image or a single block of unstructured text. This means the output can be sorted, filtered, summed and referenced in formulas exactly as if the data had been entered into Excel directly, rather than needing to be retyped from scratch.",
      "It is aimed at anyone who receives financial statements, invoices, price lists or reports as PDF but actually needs to work with the underlying numbers — recalculating totals, building a pivot table, or merging the data with other spreadsheets. Because the conversion runs locally in the browser, financial and business documents can be converted without uploading them to a third-party server.",
    ],
    steps: [
      "Upload the PDF containing the table or tables you want to convert.",
      "Wait while the tool scans the document to detect table structures.",
      "Preview the detected rows and columns to confirm they match the source table.",
      "Select which pages or tables to include if the PDF contains several.",
      "Click convert to generate the Excel workbook.",
      "Download the resulting .xlsx file and open it in Excel or any compatible spreadsheet app.",
    ],
    benefits: [
      { title: "Produces a real workbook", body: "The output is a genuine .xlsx file with data placed in actual cells, so formulas, sorting and pivot tables all work immediately without any reformatting." },
      { title: "Preserves rows and columns", body: "Table structure detected in the PDF is mapped directly into the spreadsheet grid, keeping numbers aligned in their original columns." },
      { title: "No manual retyping", body: "Extracting a table this way avoids the error-prone process of retyping figures from a PDF by hand, which is both slow and a common source of transcription mistakes." },
      { title: "Local, unlimited conversion", body: "Because processing happens in the browser, there is no page limit or per-conversion cost, and financial documents stay private throughout." },
    ],
    useCases: [
      "Converting a bank or financial statement PDF into an editable spreadsheet for budgeting.",
      "Extracting a price list or product catalogue table for use in inventory software.",
      "Pulling data tables out of a research report PDF for further analysis.",
      "Converting an invoice's line-item table into Excel to check totals and calculations.",
      "Extracting survey or exam result tables from a PDF for statistical analysis.",
    ],
    sections: [
      { heading: "Is the output a real Excel file?", body: "Yes — the download is a genuine .xlsx workbook with each detected table mapped into cells, so formulas, sorting, filtering and pivot tables all work exactly as they would with data entered directly, not a picture of a table pasted into a sheet." },
      { heading: "Table detection accuracy", body: "Clearly ruled tables with consistent columns convert most accurately. Tables with merged cells, unusual spacing or no visible gridlines are harder for any extraction tool to interpret correctly, so it is worth checking the preview against the source PDF before relying on the output." },
      { heading: "Multi-page and multi-table documents", body: "PDFs containing several tables across multiple pages are supported, and each detected table can be reviewed individually. Long tables that continue across a page break are reassembled where the column structure remains consistent from one page to the next." },
      { heading: "Troubleshooting misaligned columns", body: "If a converted table has columns that do not line up correctly, this is usually because the source PDF uses unusual spacing rather than a true table structure; in that case, manually adjusting a few cells after conversion is typically faster than retyping the whole table." },
    ],
  },

  "/tools/crop-pdf": {
    intro: [
      "Crop PDF lets you trim the visible page area of a PDF by dragging a crop box over each page, removing unwanted margins, scanning borders or blank space without altering the actual content inside the crop area. This differs from cropping an image because the underlying text and vector graphics remain fully intact and selectable — only the visible page boundary changes.",
      "It is especially useful for cleaning up scanned documents that have wide, uneven margins, removing printer registration marks or crop guides that got included in an export, or tightening the page size of a PDF before merging it with other pages that use a smaller page format. The crop is applied locally in your browser, and you can preview the result on each page before saving the trimmed document.",
    ],
    steps: [
      "Upload the PDF you want to crop.",
      "Drag the crop box handles on the page preview to select the area you want to keep.",
      "Apply the same crop to all pages, or adjust it individually per page if margins vary.",
      "Preview the cropped result to confirm no content has been cut off.",
      "Click apply to crop the document.",
      "Download the cropped PDF.",
    ],
    benefits: [
      { title: "Text and graphics stay intact", body: "Cropping only changes the visible page boundary; the underlying text remains selectable and searchable, unlike cropping a rasterised image of the page." },
      { title: "Per-page or uniform cropping", body: "Apply one crop setting across the whole document, or adjust individual pages when scanned margins are inconsistent from page to page." },
      { title: "Removes unwanted margins and marks", body: "Wide scanner borders, printer crop marks or excess white space can be trimmed away, tidying up a document before sharing or printing." },
      { title: "Non-destructive preview", body: "The crop box can be repositioned and previewed as many times as needed before the final crop is applied and downloaded." },
    ],
    useCases: [
      "Trimming wide, uneven margins from a scanned document before sharing it.",
      "Removing printer crop marks or registration marks left over from a professional print export.",
      "Tightening a PDF's page size to match other documents before merging them together.",
      "Cropping out a header or footer band that is not needed in a reused excerpt.",
      "Adjusting a PDF page's visible area before converting it to an image at a specific aspect ratio.",
    ],
    sections: [
      { heading: "How cropping differs from editing content", body: "Cropping a PDF changes only the page's visible boundary box, similar to a mat around a picture frame — the text and graphics outside the crop are hidden from view but the file itself is not permanently altered at the content level in the same destructive way an image crop is." },
      { heading: "Uniform versus per-page cropping", body: "When every page shares the same layout, applying one crop setting to the whole document is fastest. Scanned documents often have margins that drift slightly from page to page, in which case adjusting the crop individually per page gives a cleaner, more consistent result." },
      { heading: "Common reasons to crop a PDF", body: "Typical uses include trimming a scanner's wide white borders, removing crop marks left by a commercial printer's export settings, and matching page dimensions across documents that will be merged or bound together." },
      { heading: "Checking the result before downloading", body: "Always preview each page after cropping, particularly on documents with varying content position, to confirm that no text, numbers or images near the edge have been accidentally hidden by an overly tight crop box." },
    ],
  },

  "/tools/word-to-text": {
    intro: [
      "Word to Text extracts the plain text content from a .docx Word document, stripping out formatting, styles, headers and images to leave just the raw words, ready to paste anywhere that needs clean, unformatted text. This is useful whenever formatting from a Word document causes problems — pasting into a plain text editor, a code comment, a content management system, or anywhere that would otherwise carry over unwanted fonts and styles.",
      "Upload a .docx file and the tool reads its contents directly in the browser, producing a plain text version that preserves paragraph breaks but removes bold, colours, tables layout and embedded objects. It is a quick way to get at the actual words in a document without opening Word itself, particularly useful on a device that does not have Microsoft Office installed.",
    ],
    steps: [
      "Upload the .docx Word document you want to convert.",
      "Wait while the tool reads and extracts the document's text content.",
      "Review the extracted plain text in the output box.",
      "Edit the text directly if any adjustments are needed.",
      "Copy the plain text, or download it as a .txt file.",
    ],
    benefits: [
      { title: "Strips unwanted formatting", body: "Fonts, colours, styles and embedded objects are all removed, leaving clean plain text that will not carry unexpected formatting when pasted elsewhere." },
      { title: "Preserves paragraph structure", body: "Paragraph breaks from the original document are kept, so the extracted text still reads with its original structure rather than becoming one unbroken block." },
      { title: "No Word installation needed", body: "Text can be extracted directly in the browser, useful on devices or shared computers that do not have Microsoft Word or Office installed." },
      { title: "Fast for large documents", body: "Even lengthy reports or manuscripts are processed quickly since only the text content, not layout or embedded media, needs to be extracted." },
    ],
    useCases: [
      "Extracting plain text from a Word document before pasting it into a plain-text code comment or config file.",
      "Getting the raw wording out of a formatted report for a content management system that strips its own styles.",
      "Converting a manuscript from .docx to plain text for a different word processor or writing tool.",
      "Pulling text out of a Word document on a device without Microsoft Office installed.",
      "Cleaning up a heavily formatted document before running a word count or text analysis tool on it.",
    ],
    sections: [
      { heading: "What gets removed", body: "Fonts, text colours, bold and italic styling, table layout, headers and footers, and embedded images are all stripped away, leaving only the sequence of words and paragraph breaks. If you need to preserve formatting, keep the original .docx rather than converting it." },
      { heading: "Supported input format", body: "The tool works with modern .docx files as used by current versions of Microsoft Word and compatible software such as Google Docs exports and LibreOffice Writer. Older legacy .doc files may need to be re-saved as .docx first." },
      { heading: "Paragraph structure and line breaks", body: "Paragraph breaks in the source document are preserved in the plain text output, so multi-paragraph documents remain readable rather than collapsing into a single continuous line, though bullet and numbered list formatting is converted to plain text without its original symbols." },
      { heading: "When to use this instead of opening Word", body: "This tool is faster than opening Word purely to copy text out, particularly on a device without Office installed, and avoids accidentally pasting hidden formatting, tracked changes or comments into a destination that expects clean plain text." },
    ],
  },
};
