import type { ToolContentMap } from "./types";

export const chunk1: ToolContentMap = {
  "/tools/image-compressor": {
    intro: [
      "The Image Compressor shrinks JPG, PNG, WebP and GIF files directly in your browser, cutting file size by up to 80% without visible quality loss. Instead of uploading photos to a server and waiting for a queue, the compression runs on your own device using the browser's canvas and codec APIs, so large batches finish in seconds and nothing you upload is ever transmitted anywhere.",
      "It suits anyone who needs smaller images fast: bloggers trying to hit a page-speed score, sellers uploading product photos with strict size limits, or people who just need to compress a photo to under 100KB or 50KB for a form. A live before-and-after preview and file-size readout let you dial in the quality slider until the image is as small as possible while still looking sharp on screen.",
    ],
    steps: [
      "Drag and drop your JPG, PNG, WebP or GIF images onto the upload area, or select multiple files for batch compression.",
      "Choose an output format if you want to convert while compressing, such as PNG to JPG for smaller file sizes.",
      "Drag the quality slider and watch the live preview and estimated file size update in real time.",
      "Compare the before and after thumbnails side by side to confirm the compressed image still looks sharp.",
      "Click compress to process every image in the batch, then download each file or grab them all as a ZIP.",
    ],
    benefits: [
      {
        title: "Real-time size feedback",
        body: "The estimated output size updates as you move the quality slider, so you can target an exact limit such as 100KB or 50KB without guessing. This removes the trial-and-error of re-exporting from desktop software.",
      },
      {
        title: "Batch compression",
        body: "Multiple images can be compressed together with the same settings, which is much faster than opening files one at a time in an editor. A ZIP download bundles the results for easy uploading elsewhere.",
      },
      {
        title: "No upload required",
        body: "Compression happens using in-browser canvas rendering, so photos never leave your device. This matters for client work, ID scans or anything you would rather not send to a third-party server.",
      },
    ],
    useCases: [
      "Shrinking product photos so an online store page loads faster and passes Core Web Vitals checks.",
      "Compressing a profile photo or attachment to fit under a website's upload size cap.",
      "Preparing dozens of event photos for a shared gallery without eating into limited storage.",
      "Reducing screenshot file sizes before pasting them into a support ticket or documentation.",
      "Getting a scanned ID or document image under 100KB for an online application form.",
    ],
    sections: [
      {
        heading: "Which format should you compress to?",
        body: "JPG or WebP gives the smallest files for photographs because they use lossy compression tuned for natural colour gradients. PNG keeps flat-colour graphics like logos and screenshots crisp but produces larger files, so WebP is often the better choice when the target platform supports it. GIF should generally be converted to PNG or WebP unless animation is required.",
      },
      {
        heading: "How much quality can you sacrifice?",
        body: "Most photographs can be compressed to a quality setting of 70–80% with no visible difference on a typical screen, cutting file size by 60–80%. Below about 50% quality, blocky artefacts start appearing around sharp edges and text. The live preview lets you find that threshold visually rather than relying on a fixed number.",
      },
      {
        heading: "Compared with desktop compressors",
        body: "Desktop tools like Photoshop's export dialog or standalone compression apps require installation and manual file handling. This tool needs nothing installed, processes a whole batch in one pass, and keeps files private since nothing is uploaded — a practical advantage when compressing sensitive documents or client photos.",
      },
    ],
  },

  "/tools/svg-to-jpg": {
    intro: [
      "The SVG to JPG Converter rasterises vector SVG files into JPG or PNG images at the resolution you choose, rendering entirely in your browser. Because SVGs are resolution-independent, you can export the same file at 800px for a thumbnail or 4000px for print, and the vector's curves and text will stay perfectly sharp at whatever size you pick.",
      "This is the tool to reach for whenever a platform, template or print process needs a raster image instead of a vector — many email clients, older CMS platforms and social media uploaders reject SVG entirely. Set your output width, choose a background colour for transparent areas, and adjust quality before downloading, all without installing Inkscape or another vector editor.",
    ],
    steps: [
      "Upload your SVG file by dragging it into the drop zone or selecting it from your device.",
      "Enter the output width in pixels — height scales automatically to preserve the aspect ratio.",
      "Choose a background colour to fill transparent areas, since JPG has no transparency channel.",
      "Select JPG or PNG as the output format depending on whether you need transparency support.",
      "Adjust the quality slider for JPG output, then click convert and download the rasterised image.",
    ],
    benefits: [
      {
        title: "Choose your own resolution",
        body: "Because SVGs are vector graphics, you set the exact pixel width needed for the destination — web banner, app icon or print poster — and the edges stay crisp rather than blurry from upscaling a fixed-size bitmap.",
      },
      {
        title: "Background colour control",
        body: "Transparent regions in the SVG are filled with a background colour of your choosing before export to JPG, giving predictable results instead of an unexpected black or white fill.",
      },
      {
        title: "No vector software needed",
        body: "Rendering happens with the browser's own SVG engine, so there is no need to open Illustrator or Inkscape just to export a raster copy of a logo or icon.",
      },
    ],
    useCases: [
      "Converting a vector logo to JPG for a Word document or PowerPoint slide that does not support SVG.",
      "Exporting an icon set as PNG at multiple pixel sizes for an app or website favicon.",
      "Preparing a vector illustration as a high-resolution JPG for print without leaving the browser.",
      "Turning an SVG chart or diagram into an image that can be embedded in an email newsletter.",
      "Rasterising an SVG badge for upload to social media platforms that reject vector formats.",
    ],
    sections: [
      {
        heading: "Resolution guidance",
        body: "For web use, 800–1200px wide is usually enough; for print, aim for at least 2400px wide so the image holds up at 300 DPI. Since the source is a vector, there is no upper limit on quality — only file size grows as resolution increases.",
      },
      {
        heading: "JPG vs PNG output",
        body: "Choose JPG for photographic or gradient-heavy artwork where file size matters and a solid background is acceptable. Choose PNG when the SVG needs to stay transparent, such as a logo that will sit over other design elements.",
      },
      {
        heading: "Common transparency issue",
        body: "If exported JPGs come out with an unexpected black or white background, it's because JPG cannot store transparency — any area that was see-through in the SVG gets filled with your chosen background colour. Switch to PNG export if the transparent regions need to stay transparent.",
      },
    ],
  },


  "/tools/PdfToExcel": {
    intro: [
      "PDF to Excel Converter extracts tabular data from a PDF and rebuilds it as an editable XLSX spreadsheet, detecting rows and columns from the document's text layout. Rather than manually retyping figures from a bank statement, invoice or report, you get a workbook you can sort, filter and calculate on immediately, with the conversion happening entirely in your browser.",
      "It works best on PDFs generated directly from spreadsheets or reporting software, where column positions are consistent across the page. Upload the file, let the tool detect the table structure, review the preview, and export to XLSX — useful for accountants, analysts or anyone who receives data locked inside a PDF and needs it back in a workable spreadsheet format.",
    ],
    steps: [
      "Upload the PDF containing the table you want to extract, using drag-and-drop or the file browser.",
      "Let the tool scan the document and automatically detect rows, columns and table boundaries.",
      "Review the extracted preview to check that columns have lined up correctly against the original PDF.",
      "Select which pages or tables to include if the PDF contains multiple tables across pages.",
      "Export the result as an XLSX file and download it directly to your device.",
    ],
    benefits: [
      {
        title: "Automatic table detection",
        body: "Column and row boundaries are inferred from the text layout of the PDF, saving the time it would take to manually mark up cell positions in a generic PDF viewer.",
      },
      {
        title: "Editable output, not an image",
        body: "The result is a genuine XLSX workbook with real cell values, so figures can be summed, sorted and referenced in formulas straight away rather than copied out of a picture.",
      },
      {
        title: "Private, local conversion",
        body: "Financial statements and confidential reports are processed in the browser rather than sent to a remote conversion server, which matters when the source document contains sensitive numbers.",
      },
    ],
    useCases: [
      "Converting a PDF bank statement into a spreadsheet to reconcile transactions in Excel.",
      "Pulling a pricing table out of a supplier's PDF catalogue for comparison in a spreadsheet.",
      "Extracting exam or attendance records from a printed report into an editable gradebook.",
      "Turning a PDF invoice's line items into a spreadsheet for expense tracking.",
      "Rebuilding a research paper's data table as a spreadsheet for further analysis.",
    ],
    sections: [
      {
        heading: "Handling scanned PDFs",
        body: "This converter reads the text layer embedded in the PDF, so it cannot extract a table from a scanned image with no underlying text. Run scanned documents through the PDF OCR tool first to recognise the characters, then convert the resulting text-based PDF to Excel.",
      },
      {
        heading: "Accuracy on complex tables",
        body: "Ruled tables with evenly spaced columns convert cleanly in most cases. Tables with merged cells, nested sub-tables or multi-line wrapped text may need a short manual tidy-up after export, since column detection relies on consistent horizontal spacing rather than visible gridlines.",
      },
      {
        heading: "XLSX vs CSV export",
        body: "XLSX preserves multiple sheets and basic formatting, making it the better default for most spreadsheet software. If you need to import the data into a database or another system that expects plain comma-separated values, export as CSV instead and skip the extra formatting layer.",
      },
    ],
  },

  "/tools/add-watermark": {
    intro: [
      "Add Watermark to PDF stamps a text or image watermark across every page of a PDF, with full control over opacity, rotation, size and position, and the whole process runs client-side in your browser. Type a word like DRAFT or CONFIDENTIAL, or upload a company logo, then preview how it sits over the existing content before applying it to the whole document.",
      "It is the tool to use before circulating a draft, sharing a confidential report, or distributing a document that needs a visible ownership mark. You can target specific page ranges so cover pages or signature pages stay clean, and adjust the watermark's transparency so the underlying text remains fully legible underneath.",
    ],
    steps: [
      "Upload the PDF you want to watermark using the file selector or drag-and-drop.",
      "Choose text or image mode, then type your watermark text or upload a logo file.",
      "Set the opacity, rotation angle and size so the watermark sits clearly but doesn't obscure the content.",
      "Position the watermark using the alignment controls, such as centred or tiled across the page.",
      "Enter a page range if only some pages should be watermarked, leaving others untouched.",
      "Apply the watermark and download the stamped PDF.",
    ],
    benefits: [
      {
        title: "Text or logo watermarking",
        body: "Switch between a typed text stamp like DRAFT or CONFIDENTIAL and an uploaded image watermark such as a company logo, covering both branding and document-control use cases with one tool.",
      },
      {
        title: "Fine opacity and rotation control",
        body: "Adjustable opacity keeps the underlying text readable while the mark stays visible, and rotation lets you angle the stamp diagonally across the page the way traditional paper watermarks appear.",
      },
      {
        title: "Selective page ranges",
        body: "Specifying which pages receive the watermark means covers, appendices or signature pages can be left clean while the main body carries the stamp, without exporting two separate documents.",
      },
    ],
    useCases: [
      "Marking a contract draft as DRAFT before it circulates for internal review.",
      "Stamping CONFIDENTIAL across a financial report shared with external auditors.",
      "Adding a company logo watermark to a proposal document sent to prospective clients.",
      "Protecting a portfolio PDF with a semi-transparent copyright watermark before publishing online.",
      "Marking a sample chapter or preview document as SAMPLE — NOT FOR DISTRIBUTION.",
    ],
    sections: [
      {
        heading: "Choosing an opacity level",
        body: "Around 15–30% opacity keeps the mark clearly visible without interfering with reading the underlying text — the setting most business documents use. Push it higher, closer to 50%, only when the goal is specifically to discourage screenshots or unauthorised reuse of the page.",
      },
      {
        heading: "Text vs image watermarks",
        body: "Text watermarks are quick to set up and instantly communicate status words like DRAFT or CONFIDENTIAL. Image watermarks work better for branding, letting you stamp a logo consistently across every page of a proposal, report or portfolio without retyping text each time.",
      },
      {
        heading: "Applying to specific pages only",
        body: "Enter a page range such as 2-10 to skip the cover and final signature page, which is common practice for legal and business documents where the first and last pages need to stay visually clean while the body pages are marked.",
      },
    ],
  },

  "/tools/organize-pdf": {
    intro: [
      "Organize PDF gives you a visual, drag-and-drop way to reorder, rotate and delete pages in a PDF, with thumbnails representing every page so you can see exactly what you're changing. Rather than exporting individual pages and stitching them back together, you manipulate the whole document as a grid of thumbnails and export the result in one pass, entirely in the browser.",
      "This is the tool for tidying up a document that has pages in the wrong order, sideways scans mixed in with upright ones, or extra pages that need to go. Because pages are copied rather than re-rendered, text, images and embedded fonts stay identical to the original — only their order, rotation or presence changes.",
    ],
    steps: [
      "Upload the PDF you want to reorganise to load its pages as thumbnails.",
      "Drag thumbnails into the new order you want the pages to appear in the final document.",
      "Click the rotate icon on any page that is sideways or upside down to fix its orientation.",
      "Select the pages you want removed and delete them from the layout.",
      "Review the thumbnail grid to confirm the order, rotation and page count look correct.",
      "Export the reorganised PDF and download the finished file.",
    ],
    benefits: [
      {
        title: "Visual thumbnail editing",
        body: "Seeing every page as a thumbnail makes it far easier to spot pages that are out of order, duplicated or rotated incorrectly than scrolling through a text-heavy PDF viewer page by page.",
      },
      {
        title: "Reorder, rotate and delete together",
        body: "All three operations happen in the same session before a single export, so a document needing several fixes at once doesn't require multiple round trips through separate tools.",
      },
      {
        title: "No quality loss",
        body: "Pages are copied directly rather than being flattened and re-rendered, so fonts stay embedded, text stays selectable and images keep their original resolution after reorganising.",
      },
    ],
    useCases: [
      "Fixing a scanned document where pages were fed into the scanner in the wrong order.",
      "Rotating a handful of sideways pages mixed into an otherwise upright PDF.",
      "Removing a blank or duplicate page that ended up in a merged report.",
      "Rearranging chapters of a compiled PDF report before sending it to a client.",
      "Deleting outdated appendix pages from a contract before recirculating it.",
    ],
    sections: [
      {
        heading: "Rotating vs re-scanning",
        body: "If only the orientation is wrong, rotating the existing page is instant and lossless, whereas re-scanning a document takes time and re-introduces scan artefacts. Use the rotate control for anything upside down or sideways before considering a re-scan.",
      },
      {
        heading: "Doing several edits in one pass",
        body: "Delete unwanted pages first, then drag the remaining thumbnails into their final order, and rotate any that need it — all changes are held in the thumbnail view and applied together when you export, avoiding repeated file re-uploads.",
      },
      {
        heading: "Page count limits",
        body: "Because everything is rendered as thumbnails in the browser, very large PDFs with hundreds of pages can take longer to load initially. Once loaded, dragging and rotating remain responsive since only page order metadata changes until the final export.",
      },
    ],
  },

  "/tools/sign-pdf": {
    intro: [
      "Sign PDF lets you add a signature to any PDF document by drawing it with your mouse or finger, typing it in a handwriting-style font, or uploading a photo of your handwritten signature. Once created, the signature can be dragged onto the page, resized with handles, and positioned exactly where it needs to go, with the whole workflow completed in the browser.",
      "It covers the everyday need to sign a contract, form or agreement without printing, physically signing and re-scanning the document. Positions are stored as percentages of the page, so what you see in the preview matches the final exported PDF precisely, and multiple signature instances can be added if a document needs signing in more than one place.",
    ],
    steps: [
      "Upload the PDF that needs a signature using the file picker or drag-and-drop.",
      "Choose how to create your signature: draw it with the mouse or touchscreen, type it in a script font, or upload an image.",
      "Drag the signature onto the correct location on the page.",
      "Resize the signature using the corner handles and nudge its position with the arrow keys for precision.",
      "Add initials or a date stamp on additional pages if the document requires them.",
      "Export the signed PDF and download it to your device.",
    ],
    benefits: [
      {
        title: "Three ways to create a signature",
        body: "Drawing gives the most natural look, typing is fastest for a quick sign-off, and uploading an image lets you reuse an existing scanned signature — covering different preferences and use cases in one tool.",
      },
      {
        title: "Precise placement controls",
        body: "Resize handles and arrow-key nudging let you position the signature exactly on a signature line or initials box, and percentage-based positioning means the exported file matches what you saw in the preview.",
      },
      {
        title: "No printing or scanning needed",
        body: "The whole sign-and-return workflow happens digitally, which is faster than printing a document, signing it by hand and scanning it back in, especially for agreements that need a same-day turnaround.",
      },
    ],
    useCases: [
      "Signing a rental agreement or lease before returning it to a landlord by email.",
      "Adding your signature to a freelance contract sent by a new client.",
      "Signing a school permission slip or consent form that was distributed as a PDF.",
      "Co-signing a multi-party agreement where several people each add their signature to the same file.",
      "Placing initials on each page of a lengthy agreement alongside a final signature.",
    ],
    sections: [
      {
        heading: "Legal validity of electronic signatures",
        body: "In most jurisdictions, including under the US ESIGN Act and the EU eIDAS regulation, a signature applied with clear intent to sign is legally binding for everyday agreements such as contracts, leases and consent forms. Certain deeds, wills and notarised documents still require a qualified digital certificate or wet-ink signature, so check requirements for anything unusually formal.",
      },
      {
        heading: "Getting precise placement",
        body: "After dragging the signature roughly into place, use the resize handles to match the size of a printed signature line, then use the arrow keys for pixel-level nudging. Because positions are stored as page percentages rather than fixed pixel coordinates, the signature lands in the same relative spot regardless of how the PDF is later viewed or printed.",
      },
      {
        heading: "Signature vs image upload quality",
        body: "A signature drawn directly with a mouse or touchscreen tends to look more natural than a low-resolution photo of a paper signature, which can appear pixelated once resized. If uploading an image, use a clear, well-lit photo or scan cropped tightly to the signature itself.",
      },
    ],
  },

  "/tools/age-calculator": {
    intro: [
      "The Age Calculator works out an exact age in years, months, days, hours and total elapsed days from a date of birth, handling leap years correctly the same way official forms and registries do. Enter a birth date and it instantly breaks the result down into full years plus the remaining months and days, rather than giving a rounded estimate.",
      "Beyond calculating current age, the target date can be changed to any point in the past or future, so you can find out how old someone was on a specific historical date, or how old they will be on a future one. A countdown to the next birthday is also shown, useful for planning celebrations or eligibility deadlines that depend on reaching a particular age.",
    ],
    steps: [
      "Enter the date of birth using the date picker or by typing it directly.",
      "Leave the target date as today, or change it to calculate age at a different past or future date.",
      "View the breakdown showing exact years, months and days, along with total days and hours lived.",
      "Check the countdown to the next birthday shown alongside the main result.",
      "Adjust either date to explore age at different points in time as needed.",
    ],
    benefits: [
      {
        title: "Exact breakdown, not an estimate",
        body: "Results are shown as full years, remaining months and remaining days rather than a single rounded number, matching the precision required on official documents and eligibility forms.",
      },
      {
        title: "Calculate age at any date",
        body: "Changing the target date away from today lets you determine someone's exact age on a historical event date or a future qualifying date, not just their current age.",
      },
      {
        title: "Leap year handling",
        body: "Calculations correctly account for leap years and varying month lengths, avoiding the small errors that come from simple date-subtraction formulas in a spreadsheet.",
      },
    ],
    useCases: [
      "Working out a child's exact age in years and months for a school enrolment form.",
      "Calculating age at the date of an event, such as a wedding or graduation, for a speech or record.",
      "Checking eligibility for an age-restricted service by calculating exact age on a specific qualifying date.",
      "Finding the countdown to an upcoming birthday for planning a party or gift.",
      "Determining someone's age at a historical date for genealogy or biography research.",
    ],
    sections: [
      {
        heading: "How the calculation works",
        body: "Full years between the two dates are counted first, then the remaining months, then the remaining days — the same method used on birth certificates and official identification. This avoids the rounding errors that come from simply dividing the number of days by 365.",
      },
      {
        heading: "Total days and hours lived",
        body: "Alongside the years/months/days breakdown, the calculator shows a running total of days and hours between the two dates, which is a common curiosity for milestone birthdays such as reaching 10,000 or 20,000 days old.",
      },
      {
        heading: "Accuracy around leap years",
        body: "Because February has 29 days in leap years, calculations that ignore this can be off by a day for people born in or spanning leap years. This tool accounts for the actual calendar, so the years/months/days figures remain accurate regardless of how many leap years fall within the range.",
      },
    ],
  },

  "/tools/number-base-converter": {
    intro: [
      "The Number Base Converter converts a number between binary, octal, decimal, hexadecimal, or any custom base from 2 to 36, showing every representation side by side as you type. Enter a value in one base and the others update instantly, making it a quick reference for anyone working with binary logic, hex colour codes, or low-level programming concepts.",
      "Rather than manually dividing by the target base and tracking remainders, or looking up a static conversion table, this tool handles arbitrary bases in real time, including uncommon ones used in specific contexts like base-36 for compact identifiers. It is a practical companion for students learning number systems and developers debugging binary or hex values.",
    ],
    steps: [
      "Type a number into any of the base input fields — binary, octal, decimal or hexadecimal.",
      "Watch the other base fields update automatically to show the equivalent value.",
      "Switch to a custom base between 2 and 36 if you need a conversion outside the standard four.",
      "Copy the converted value from whichever field you need using the copy button.",
      "Clear the fields and enter a new number to perform another conversion.",
    ],
    benefits: [
      {
        title: "All bases shown simultaneously",
        body: "Binary, octal, decimal and hexadecimal values are displayed together and update live, so there's no need to convert one pair of bases at a time and re-enter values manually.",
      },
      {
        title: "Custom base support",
        body: "Beyond the four common bases, any base from 2 to 36 can be selected, covering less common needs like base-36 encoding used in short URL identifiers or certain hashing schemes.",
      },
      {
        title: "Instant, error-free results",
        body: "Manual base conversion is error-prone, especially with long binary strings. Automated conversion removes the risk of a misplaced digit or dropped remainder during manual working.",
      },
    ],
    useCases: [
      "Converting a binary value from a datasheet into decimal to understand a register setting.",
      "Turning a hexadecimal colour code into its decimal RGB components for a design tool.",
      "Checking a student's manual binary-to-decimal homework conversion for correctness.",
      "Converting between octal and decimal for Unix file permission values like 755.",
      "Working with base-36 identifiers used in some URL shortening or ID-encoding schemes.",
    ],
    sections: [
      {
        heading: "Converting decimal to binary by hand",
        body: "The standard manual method divides the decimal number repeatedly by 2, recording the remainder each time, then reads the remainders from bottom to top. For example, 13 divided down gives remainders 1, 0, 1, 1, which read backwards gives 1101 — the tool performs this instantly for any base pair.",
      },
      {
        heading: "Why hexadecimal is common in computing",
        body: "One hexadecimal digit represents exactly four binary bits, so a full byte always maps to exactly two hex digits. This makes hex a compact, human-readable stand-in for binary values in memory addresses, colour codes and low-level debugging output.",
      },
      {
        heading: "Supported range and precision",
        body: "The converter handles bases from 2 through 36, using the digits 0-9 and letters A-Z for bases above 10. Very large numbers are supported up to the precision limits of standard numeric representation in the browser, which comfortably covers typical programming and educational use.",
      },
    ],
  },

  "/tools/text-diff": {
    intro: [
      "Text Diff Checker compares two blocks of text or code line by line and highlights every addition, deletion and change, making it easy to spot what's different between two versions of a document. Paste the original in one box and the revised version in the other, and the comparison updates to show green highlights for additions and red for removals.",
      "It handles both prose and source code, respecting whitespace and indentation so it works equally well for reviewing a contract redline, comparing two drafts of an article, or checking a code change before a commit. Because everything runs in the browser, pasted text — including confidential drafts — is never sent anywhere for the comparison to work.",
    ],
    steps: [
      "Paste the original version of your text into the first input box.",
      "Paste the revised or updated version into the second input box.",
      "Review the highlighted differences, with additions shown in green and deletions shown in red.",
      "Scroll through unchanged lines shown in neutral colour to see the full context around each change.",
      "Copy either version or export the comparison if you need to share the result.",
    ],
    benefits: [
      {
        title: "Line-by-line highlighting",
        body: "Additions and deletions are colour-coded directly inline, so even a single-word change in a long paragraph is immediately visible without manually re-reading both versions.",
      },
      {
        title: "Works for code and prose",
        body: "Whitespace and indentation are preserved and compared, which makes the tool equally useful for reviewing a code diff before committing changes as it is for comparing two drafts of a document.",
      },
      {
        title: "Nothing leaves your browser",
        body: "Both text inputs are compared locally, so contracts, drafts or proprietary code being reviewed are never transmitted to a server during the comparison.",
      },
    ],
    useCases: [
      "Comparing two versions of a contract to spot every clause that was added or removed during negotiation.",
      "Reviewing an editor's changes to an article draft before approving the final copy.",
      "Checking a code snippet against a previous version to understand exactly what changed.",
      "Comparing two exported configuration files to track down what setting was altered.",
      "Verifying that a translated document's structure matches the original paragraph for paragraph.",
    ],
    sections: [
      {
        heading: "How changes are displayed",
        body: "Added content appears highlighted in green, removed content in red, and lines that are identical in both versions stay in neutral colour. This three-way colour coding makes it possible to scan a long document quickly and jump straight to the lines that actually changed.",
      },
      {
        heading: "Comparing source code",
        body: "Because the diff respects exact whitespace and indentation, it is suitable for reviewing code changes where a shifted indent level or an extra space is meaningful. This makes it a lightweight alternative to a full version control diff view for a quick one-off comparison.",
      },
      {
        heading: "Tips for large documents",
        body: "For very long documents, it helps to compare section by section rather than pasting an entire book-length file at once, since it is easier to review a manageable block of highlighted differences than to scroll through hundreds of lines. Removing unrelated boilerplate before comparing also reduces visual noise in the results.",
      },
    ],
  },

  "/tools/text-encryption": {
    intro: [
      "The Text Encryption Tool encrypts and decrypts text using a passphrase you choose, with all the cryptographic work happening locally in your browser. Type or paste a message, set a passphrase, and the tool produces ciphertext that can only be decrypted by someone who has that same passphrase — nothing about the message or the key is ever transmitted or stored.",
      "It is designed for anyone who needs to send a private note, password or sensitive detail through a channel they don't fully trust, such as email or a shared document. Because the passphrase exists only in memory during your session, losing it means the ciphertext cannot be recovered by anyone, including the tool itself, which is the trade-off for genuine end-to-end privacy.",
    ],
    steps: [
      "Type or paste the text you want to protect into the input box.",
      "Enter a passphrase — the stronger and more unique it is, the harder the ciphertext is to break.",
      "Click encrypt to generate the ciphertext, then copy it to share through your chosen channel.",
      "To decrypt, paste the ciphertext into the tool and enter the same passphrase used to encrypt it.",
      "Click decrypt to recover the original text, and clear the fields afterwards for privacy.",
    ],
    benefits: [
      {
        title: "Nothing is stored or transmitted",
        body: "Both encryption and decryption happen entirely in your browser using the passphrase you provide, so there's no server-side copy of your message or key that could later be exposed.",
      },
      {
        title: "No account or key management needed",
        body: "A single shared passphrase is all that's required between sender and recipient, avoiding the complexity of generating and exchanging public/private key pairs for a one-off private message.",
      },
      {
        title: "Works with any text channel",
        body: "Because the output is plain ciphertext, it can be pasted into any medium — email, chat, a shared document — without needing that channel to support encryption itself.",
      },
    ],
    useCases: [
      "Sending a sensitive password or account detail to a colleague through email without it being readable in transit.",
      "Storing a private note in a shared document where the plaintext should not be visible to casual viewers.",
      "Sharing confidential figures with a client over a chat platform that isn't end-to-end encrypted.",
      "Protecting a message pasted into a support ticket or public forum before the recipient decrypts it privately.",
      "Encrypting personal notes before backing them up to a cloud service you'd rather not trust with plaintext.",
    ],
    sections: [
      {
        heading: "Choosing a strong passphrase",
        body: "Use at least four unrelated words, or sixteen or more mixed characters, rather than a short dictionary word or predictable phrase. The Password Generator tool can create a strong passphrase for this purpose, and the Password Strength Checker will rate how resistant it is to guessing.",
      },
      {
        heading: "What happens if you lose the passphrase",
        body: "There is no recovery mechanism — the passphrase is never stored anywhere, which is exactly what makes the encryption trustworthy. If it's forgotten, the ciphertext becomes permanently unreadable, so keep the passphrase somewhere safe and separate from the encrypted text itself.",
      },
      {
        heading: "Sharing the ciphertext safely",
        body: "Send the encrypted output and the passphrase through two different channels — for example, the ciphertext by email and the passphrase by phone or text message — so that intercepting one alone isn't enough to read the message.",
      },
    ],
  },

  "/tools/password-generator": {
    intro: [
      "The Password Generator creates strong random passwords using the browser's cryptographically secure random number source, rather than a predictable pseudo-random function. You control the length and which character types to include — uppercase, lowercase, numbers and symbols — and can exclude ambiguous characters like 0, O, l and 1 that are easy to misread.",
      "Because generation happens locally using the crypto.getRandomValues API, passwords are never transmitted or logged anywhere, making this suitable for generating credentials for sensitive accounts. Adjust the length slider up to cover anything from a quick PIN-style code to a long passphrase suitable for a master password vault.",
    ],
    steps: [
      "Set the desired password length using the slider or input field.",
      "Toggle which character types to include: uppercase letters, lowercase letters, numbers and symbols.",
      "Enable the option to exclude ambiguous characters if the password will be typed manually.",
      "Click generate to produce a new random password.",
      "Copy the password to your clipboard and paste it directly into your password manager or account signup form.",
    ],
    benefits: [
      {
        title: "Cryptographically secure randomness",
        body: "Passwords are generated using crypto.getRandomValues rather than Math.random, which produces output that is statistically unpredictable and suitable for real security use rather than simple randomisation.",
      },
      {
        title: "Full control over composition",
        body: "Length and character set toggles let you meet specific site requirements, whether that's a minimum length, mandatory symbols, or a policy that disallows certain character types.",
      },
      {
        title: "Ambiguous character exclusion",
        body: "Turning off characters that look alike, such as 0 and O, or l and 1, makes a generated password easier to type accurately when it must be entered manually rather than pasted.",
      },
    ],
    useCases: [
      "Generating a new unique password for every online account instead of reusing the same one.",
      "Creating a master password strong enough to protect an entire password manager vault.",
      "Producing a temporary password to share with a new employee that meets a strict complexity policy.",
      "Generating Wi-Fi router passwords that are long and random rather than a simple guessable phrase.",
      "Creating API keys or service credentials during development that need to be unpredictable.",
    ],
    sections: [
      {
        heading: "How long should a password be?",
        body: "At least 16 characters is a sensible baseline for important accounts, since length increases cracking time far more than adding complexity to a short password does. Every extra character multiplies the number of possible combinations an attacker would need to try.",
      },
      {
        heading: "Length vs complexity trade-off",
        body: "A long password made of ordinary lowercase letters can be more resistant to brute-force attacks than a short one packed with symbols, simply because of how exponentially the possible combinations grow with each added character. This tool lets you push length up while still including full character variety for maximum resistance.",
      },
      {
        heading: "Storing generated passwords safely",
        body: "A randomly generated password is only as useful as the system used to remember it — save each one in a password manager rather than a plain text file or sticky note, since a truly random string is not something anyone can reliably memorise.",
      },
    ],
  },

  "/tools/color-picker": {
    intro: [
      "The Color Picker lets you select colours visually and instantly copy their HEX, RGB and HSL values, then build out a palette with tints, shades and complementary suggestions based on your chosen base colour. It's a lightweight design utility for anyone working on a website, app or graphic who needs consistent, well-documented colour values without opening a full design application.",
      "Beyond picking a single colour, the tool generates a broader palette automatically, suggesting harmonious variations so your colour scheme feels cohesive rather than arbitrary. Every value updates live as you adjust the colour, and all formats are displayed together so you can copy whichever one your CSS, design tool or code needs.",
    ],
    steps: [
      "Use the colour wheel or gradient picker to select a base colour visually.",
      "Or type a specific HEX, RGB or HSL value directly into the corresponding input field.",
      "View the automatically generated tints, shades and complementary colour suggestions.",
      "Click any value to copy it in HEX, RGB or HSL format for use in your project.",
      "Build out a small palette by picking several colours and keeping track of their codes.",
    ],
    benefits: [
      {
        title: "All three formats at once",
        body: "HEX, RGB and HSL values are shown side by side for the same colour, so you can grab whichever format your CSS, design software or code framework expects without manual conversion.",
      },
      {
        title: "Automatic palette suggestions",
        body: "Tints, shades and complementary colours are generated from your chosen base colour, giving a starting point for a cohesive colour scheme rather than picking every shade by trial and error.",
      },
      {
        title: "Instant copy-to-clipboard",
        body: "Every colour value can be copied with one click, speeding up the process of pasting exact values into a stylesheet or design tool compared with retyping codes manually.",
      },
    ],
    useCases: [
      "Picking a brand's primary colour and generating complementary accents for a website design.",
      "Converting a colour from a client's brand guide between HEX and RGB for different software.",
      "Building a simple light-to-dark tint scale for button states like hover and active.",
      "Matching a colour spotted in an existing design by fine-tuning HSL sliders until it lines up.",
      "Choosing an accessible text colour by checking contrast against a chosen background shade.",
    ],
    sections: [
      {
        heading: "Building an accessible palette",
        body: "Keep body text at a contrast ratio of at least 4.5:1 against its background, and 3:1 for large text and interface icons, to meet the WCAG AA accessibility standard. Checking contrast early in the palette-building process avoids having to redesign colour choices later for accessibility compliance.",
      },
      {
        heading: "Understanding complementary schemes",
        body: "A complementary colour scheme pairs two hues from opposite sides of the colour wheel, such as blue and orange, producing strong visual contrast. This makes complementary pairs a common choice for call-to-action buttons that need to stand out clearly from the surrounding page.",
      },
      {
        heading: "HEX, RGB and HSL explained",
        body: "HEX is a compact six-digit code used almost universally in CSS and design tools. RGB expresses the same colour as separate red, green and blue values from 0-255, useful when blending colours numerically. HSL describes hue, saturation and lightness separately, which makes it easier to create tints and shades by adjusting just the lightness value.",
      },
    ],
  },

  "/tools/whois-lookup": {
    intro: [
      "WHOIS Lookup retrieves domain registration details using live RDAP data, showing the registrar, creation and expiry dates, name servers and current status codes for any domain you search. It's a quick way to check who manages a domain, when it was first registered, and whether it's approaching renewal, without needing access to a paid domain research tool.",
      "Whether you're evaluating a domain before purchase, investigating who operates a website, or simply checking your own domain's renewal date, this tool queries the relevant registry directly and returns the results instantly in the browser. Personal contact information is generally redacted under privacy rules, but registrar, dates and technical details remain fully visible.",
    ],
    steps: [
      "Type the domain name you want to look up into the search field.",
      "Click search to query the domain's RDAP record from the relevant registry.",
      "Review the registrar name, creation date and expiry date shown in the results.",
      "Check the name servers listed to see which DNS provider is hosting the domain's records.",
      "Note any status codes, which indicate things like transfer locks or pending deletion.",
    ],
    benefits: [
      {
        title: "Live RDAP data",
        body: "Results are pulled directly from the current registry data rather than a cached or outdated database, so the registration and expiry dates shown reflect the domain's actual current status.",
      },
      {
        title: "No account or fee required",
        body: "Domain lookups that would otherwise require a paid research subscription or registrar account are available instantly and for free, directly in the browser.",
      },
      {
        title: "Full technical detail",
        body: "Alongside registrar and dates, name servers and status codes are shown, giving a fuller technical picture than a simple ownership check would provide.",
      },
    ],
    useCases: [
      "Checking when a domain you own is due for renewal before it lapses.",
      "Researching who registered a domain before entering a business negotiation to buy it.",
      "Verifying which registrar and name servers a domain is currently using during a migration.",
      "Investigating a suspicious website's registration date to help assess its legitimacy.",
      "Confirming a competitor's domain expiry date out of general market curiosity.",
    ],
    sections: [
      {
        heading: "Why is the owner's name hidden?",
        body: "GDPR and similar privacy regulations require registrars to redact personal contact details from public WHOIS and RDAP records by default. Registrar name, registration dates, name servers and status codes remain visible even when the registrant's personal information is masked behind a privacy proxy service.",
      },
      {
        heading: "Understanding domain expiry",
        body: "The expiry date shown is when the current registration period ends. Most registries then apply a redemption grace period of around 30 days after expiry, during which the original owner can still renew it before the domain is released back for general registration.",
      },
      {
        heading: "RDAP vs traditional WHOIS",
        body: "RDAP is the modern, structured replacement for the older plain-text WHOIS protocol, offering more consistent and machine-readable data across different domain registries. This tool queries RDAP directly, which generally returns more reliable and up-to-date results than legacy WHOIS servers.",
      },
    ],
  },

  "/tools/invoice-generator": {
    intro: [
      "The Invoice Generator creates professional A4 invoices with your business logo, itemised line items, tax, discounts and totals, then produces a print-ready PDF you can download and send immediately. It handles all the layout and calculation work automatically, so a freelancer or small business can produce a polished invoice in minutes rather than formatting one from scratch in a word processor.",
      "Because it runs entirely in the browser, client billing details never leave your device during the process — the invoice is only saved once you download the finished PDF. Add your logo, set your currency and tax rate, and the totals update as you add or edit line items, giving an accurate, ready-to-send document every time.",
    ],
    steps: [
      "Enter your business details and upload your logo if you want it on the invoice.",
      "Add the client's name and billing details in the recipient section.",
      "Add line items with a description, quantity and rate for each product or service.",
      "Set your tax rate and any discount, and watch the subtotal and total update automatically.",
      "Fill in the invoice number, issue date and due date.",
      "Download the finished invoice as a print-ready PDF.",
    ],
    benefits: [
      {
        title: "Automatic total calculations",
        body: "Subtotals, tax and discounts are calculated live as line items are added or edited, removing the risk of a manual arithmetic error appearing on a document sent to a paying client.",
      },
      {
        title: "Branding with logo and currency",
        body: "Uploading a logo and selecting your currency and tax rate lets the invoice match your business identity and locale without needing a paid invoicing subscription.",
      },
      {
        title: "Private, on-device generation",
        body: "Client names, amounts and billing details are processed locally in the browser and only saved when you export the PDF, keeping sensitive billing information off third-party servers.",
      },
    ],
    useCases: [
      "Freelancers billing clients for project work with itemised hours or milestones.",
      "Small businesses issuing invoices for product sales including applicable sales tax.",
      "Consultants sending a one-off invoice without subscribing to dedicated accounting software.",
      "Contractors billing for materials and labour as separate line items on the same invoice.",
      "Service providers applying a discount code to a client's total before sending the final bill.",
    ],
    sections: [
      {
        heading: "What a professional invoice must include",
        body: "A complete invoice needs a unique invoice number, issue and due dates, your business and client details, itemised descriptions with quantities and rates, a subtotal, applicable tax, the grand total, and clear payment instructions. Missing any of these can delay payment or cause accounting issues for the client.",
      },
      {
        heading: "Setting tax and currency correctly",
        body: "Select the currency your client will be paying in and enter the correct tax rate for your jurisdiction and transaction type before finalising the invoice — getting this wrong after sending typically means reissuing a corrected version, which looks less professional than getting it right the first time.",
      },
      {
        heading: "Keeping records after sending",
        body: "Since the invoice generator does not store past invoices on a server, keep a copy of every downloaded PDF in your own file system or accounting software, and consider keeping a simple sequential numbering system across invoices for your own bookkeeping and tax records.",
      },
    ],
  },

  "/tools/gpa-calculator": {
    intro: [
      "The GPA & CGPA Calculator works out a semester GPA from your course credits and letter grades, then lets you combine multiple semesters into an accurate cumulative CGPA on the standard 4.0 scale. Enter each course's grade and credit hours, and the calculator applies the credit-weighted average automatically rather than requiring you to work through the arithmetic by hand.",
      "It's built for students who need to track their academic standing across a semester or an entire degree, whether checking eligibility for a scholarship, monitoring progress toward a target GPA, or simply understanding how a single course's grade will affect the overall average. The CGPA panel takes semester GPAs and credit totals to roll everything up into one cumulative figure.",
    ],
    steps: [
      "Enter each course name, its letter grade and its credit hours in the GPA panel.",
      "Add additional courses as needed, and the semester GPA recalculates automatically.",
      "Switch to the CGPA panel to combine results across multiple semesters.",
      "Enter each semester's GPA and total credit hours into the CGPA panel.",
      "Review the cumulative CGPA calculated across all entered semesters.",
    ],
    benefits: [
      {
        title: "Credit-weighted accuracy",
        body: "Each course's grade point is multiplied by its credit hours before averaging, so a 4-credit course correctly counts more toward the overall GPA than a 1-credit elective, matching how universities actually calculate it.",
      },
      {
        title: "Semester and cumulative in one tool",
        body: "Both a single semester's GPA and a full multi-semester CGPA can be calculated without switching to a separate spreadsheet or tool partway through.",
      },
      {
        title: "Instant recalculation",
        body: "Adding, editing or removing a course updates the GPA immediately, making it easy to see how a hypothetical grade change would affect the overall average before grades are finalised.",
      },
    ],
    useCases: [
      "Calculating end-of-semester GPA after entering final grades for every course taken.",
      "Checking whether a specific final exam result would be enough to reach a target GPA.",
      "Combining GPAs from several completed semesters into a cumulative CGPA for a scholarship application.",
      "Estimating how retaking a failed course would change the overall cumulative average.",
      "Converting a semester's letter grades into the numeric GPA scale required by a graduate school application.",
    ],
    sections: [
      {
        heading: "How GPA is calculated",
        body: "Each course's grade point value is multiplied by its credit hours, all of these are added together, and the total is divided by the sum of all credit hours. The calculator performs this automatically as courses are entered, removing the risk of an arithmetic slip when averaging several different credit weights.",
      },
      {
        heading: "GPA vs CGPA",
        body: "GPA reflects performance in a single semester, while CGPA is the credit-weighted average across every semester completed so far. To get an accurate CGPA, enter each semester's GPA along with that semester's total credit hours into the CGPA panel, since semesters with more credits should carry proportionally more weight.",
      },
      {
        heading: "Working on the 4.0 scale",
        body: "Most letter grades map onto the 4.0 scale with A as 4.0, B as 3.0, C as 2.0 and so on, though plus/minus grading can shift this slightly depending on the institution. If your school uses a non-standard scale, check its official grade-point table to make sure the values entered match its specific conversion.",
      },
    ],
  },

  "/tools/roman-numeral-converter": {
    intro: [
      "The Roman Numeral Converter turns ordinary numbers into Roman numerals and converts them back again, plus it can convert an entire date into Roman numerals for use on tattoos, certificates, wedding invitations, logos and monument-style designs. Enter a number up to 3999 or a full date, and the converter handles the numeral construction rules — including subtractive notation like IV for 4 — automatically.",
      "Because Roman numerals follow specific combination rules rather than a simple digit-by-digit substitution, manually converting larger or more awkward numbers is error-prone. This tool removes that risk, instantly showing the correct numeral for any valid input, or decoding an existing Roman numeral back into its numeric value for verification.",
    ],
    steps: [
      "Enter a whole number between 1 and 3999 to convert it to Roman numerals.",
      "Or enter an existing Roman numeral to convert it back into a standard number.",
      "Switch to the date mode and select a day, month and year to convert an entire date.",
      "Review the resulting Roman numeral output for the date, shown as separate converted components.",
      "Copy the result for use in a design, tattoo reference or document.",
    ],
    benefits: [
      {
        title: "Handles subtractive notation correctly",
        body: "Rules like IV for 4 and IX for 9 are applied automatically, avoiding the common manual mistake of writing IIII instead of the correct subtractive form.",
      },
      {
        title: "Date conversion built in",
        body: "A full date can be converted into Roman numerals with day, month and year handled as separate components, matching the format commonly used for tattoos and monument inscriptions.",
      },
      {
        title: "Bidirectional conversion",
        body: "Numbers can be converted to Roman numerals and existing Roman numerals converted back to standard numbers, useful both for creating new numerals and verifying ones you've already seen.",
      },
    ],
    useCases: [
      "Converting a birth year or anniversary date into Roman numerals for a tattoo design.",
      "Creating a Roman numeral date for a wedding invitation or save-the-date card.",
      "Checking the numeric value of a Roman numeral seen on a building cornerstone or old document.",
      "Formatting a movie or edition number in Roman numerals for a title design.",
      "Converting a graduation year into Roman numerals for a class ring or certificate.",
    ],
    sections: [
      {
        heading: "Maximum supported value",
        body: "Standard Roman numerals support values up to 3999, written as MMMCMXCIX. Numbers beyond this require an overline notation to indicate multiplication by 1000, which falls outside standard everyday usage and isn't handled by this tool.",
      },
      {
        heading: "Converting a full date",
        body: "Using the date field converts the day, month and year separately into their own Roman numeral components, which is the format seen on tattoos and monument inscriptions rather than converting the date as one combined number.",
      },
      {
        heading: "Common numeral combinations",
        body: "Numerals follow additive and subtractive rules: values are built by combining symbols like I, V, X, L, C, D and M, with a smaller symbol placed before a larger one to subtract, such as IX for 9 or XL for 40. Understanding this makes it easier to sanity-check a converted result at a glance.",
      },
    ],
  },

  "/tools/pdf-form-filler": {
    intro: [
      "PDF Form Filler lets you complete interactive PDF forms directly in the browser, handling text boxes, checkboxes, radio buttons and dropdown menus exactly as they were designed in the original document. Once every field is filled in, you can flatten the form so the answers become permanent, uneditable content, then download the completed PDF.",
      "It's built for the common scenario of receiving a fillable PDF — an application, tax form or agreement — that needs to be completed and returned without printing it out by hand. Because the form data is processed locally, nothing you enter into personal or financial fields is transmitted to a server during the process.",
    ],
    steps: [
      "Upload the fillable PDF form you need to complete.",
      "Click into each text field and type your answers.",
      "Tick checkboxes and select radio buttons or dropdown options as required by the form.",
      "Review every field to confirm nothing has been left blank or entered incorrectly.",
      "Choose whether to flatten the form so answers become permanent, then download the completed PDF.",
    ],
    benefits: [
      {
        title: "Supports all common field types",
        body: "Text boxes, checkboxes, radio buttons and dropdowns are all recognised and rendered as their original interactive controls, rather than forcing you to type answers into a static overlay.",
      },
      {
        title: "Optional flattening",
        body: "Flattening converts your filled answers into fixed content that can't be altered later, which is useful when sending the final version, while leaving it unflattened keeps fields editable if further changes are expected.",
      },
      {
        title: "Private form completion",
        body: "Because the form is filled and processed locally in your browser, personal and financial details entered into the fields are never uploaded to a remote server.",
      },
    ],
    useCases: [
      "Filling out a fillable tax form or government application received as a PDF.",
      "Completing a job application form with interactive fields before emailing it back.",
      "Filling a rental application with checkboxes for pet ownership or employment status.",
      "Completing a medical intake form with dropdown menus for insurance provider selection.",
      "Filling out a permission or consent form containing radio button choices before submission.",
    ],
    sections: [
      {
        heading: "What if the PDF has no fillable fields?",
        body: "If a document is a flat, non-interactive PDF rather than a true form, there are no fields to fill in directly. Use the Edit PDF Text tool or the Sign PDF tool instead to place typed text or a signature anywhere on the page manually.",
      },
      {
        heading: "Should you flatten the form?",
        body: "Flatten the form before sending the final version to prevent anyone else from altering the answers after submission. Leave it unflattened if you expect to come back and make further edits yourself, since flattening removes the ability to click back into individual fields.",
      },
      {
        heading: "Checking your answers before submitting",
        body: "Because interactive fields can sometimes be easy to overlook, especially checkboxes near the edge of a page, it's worth scrolling through every page of the completed form once more before flattening and downloading, to confirm nothing required has been left blank.",
      },
    ],
  },

  "/tools/scan-to-pdf": {
    intro: [
      "Scan to PDF turns your phone camera or webcam into a document scanner, capturing pages and assembling them into a clean, multi-page PDF with automatic paper-whitening enhancement applied to each shot. There's no app to install — the camera feed is accessed directly through the browser, and every captured page can be reviewed, retaken or reordered before the final PDF is generated.",
      "It's a practical replacement for a dedicated scanner or scanning app when you need to digitise a physical document quickly: a receipt, a signed form, a multi-page contract or a page from a book. Because everything runs offline in the browser, captured images and the resulting PDF stay entirely on your device.",
    ],
    steps: [
      "Allow camera access and position the document within the capture frame.",
      "Take a photo of the page, and let the automatic enhancement whiten the background and sharpen the text.",
      "Repeat for each additional page you need to include in the same document.",
      "Reorder or retake any pages that didn't come out clearly.",
      "Combine all captured pages into a single PDF and download it.",
    ],
    benefits: [
      {
        title: "No app installation required",
        body: "The camera feed is accessed directly in the browser, so there's no need to download a separate scanning app just to digitise an occasional document.",
      },
      {
        title: "Automatic enhancement",
        body: "Captured images are converted to high-contrast grayscale automatically, making the paper background appear cleanly white and the printed text stand out crisply, similar to a dedicated flatbed scanner.",
      },
      {
        title: "Multi-page assembly",
        body: "Multiple pages can be captured in sequence and combined into a single PDF, rather than ending up with several separate image files that need manual merging afterwards.",
      },
    ],
    useCases: [
      "Scanning a signed contract or agreement to send back as a single PDF.",
      "Digitising a paper receipt for an expense report before the physical copy fades or is lost.",
      "Capturing multiple pages of a handwritten form to submit electronically.",
      "Scanning pages from a physical book or magazine for personal reference.",
      "Turning a stack of paper invoices into a searchable PDF archive.",
    ],
    sections: [
      {
        heading: "How the enhancement works",
        body: "The captured photo is converted to high-contrast grayscale, which lightens the paper background toward white and darkens the printed text, producing a result that looks closer to a proper scanner output than a raw camera photo would, even under uneven lighting.",
      },
      {
        heading: "Getting the clearest capture",
        body: "Use even, diffuse lighting and hold the camera directly above the page to avoid keystoning distortion. Fill the capture frame with the document edges visible, and avoid shadows falling across the text, since these factors affect enhancement quality more than camera resolution alone.",
      },
      {
        heading: "Offline and private by design",
        body: "Because the camera feed, image processing and PDF assembly all happen locally in the browser, no image of your scanned document is ever transmitted to a server, which matters for scanning anything containing personal or financial information.",
      },
    ],
  },

  "/tools/text-to-pdf": {
    intro: [
      "Text to PDF converts plain text or a .txt file into a clean, paginated PDF document, with control over page size, font and margins, and the resulting text stays fully selectable and searchable rather than being flattened into an image. Paste text directly into the tool or upload a .txt file, adjust the layout settings, and download a properly formatted PDF.",
      "It's a simple way to turn notes, a script, a manuscript draft or exported plain-text content into a shareable, professional-looking PDF without opening a word processor. Because real fonts are embedded rather than rendered as pictures, the output can be copied, searched and indexed like any standard text document.",
    ],
    steps: [
      "Paste your text directly into the input box, or upload a .txt file.",
      "Choose your page size, such as A4 or Letter.",
      "Select a font and adjust the margins to suit the intended layout.",
      "Preview how the text paginates across multiple pages.",
      "Generate and download the finished PDF.",
    ],
    benefits: [
      {
        title: "Fully searchable text",
        body: "Real fonts are embedded in the output PDF, so every word can be selected, copied and searched, unlike a PDF built from scanned or screenshotted text.",
      },
      {
        title: "Customisable layout",
        body: "Page size, font and margins can all be adjusted before export, letting the output match anything from a standard business document to a manuscript-style draft.",
      },
      {
        title: "Automatic pagination",
        body: "Long text automatically wraps to the page width and flows onto new pages as needed, so there's no manual page-break management required for lengthy documents.",
      },
    ],
    useCases: [
      "Converting a plain-text manuscript draft into a shareable PDF for beta readers.",
      "Turning exported chat logs or notes into an archived, searchable PDF record.",
      "Creating a simple PDF handout from lecture notes stored as plain text.",
      "Converting a script or transcript file into a properly paginated PDF for printing.",
      "Producing a quick PDF version of a README or documentation file for distribution.",
    ],
    sections: [
      {
        heading: "Text vs image-based PDFs",
        body: "This tool embeds actual font glyphs into the PDF, so the resulting document behaves like any text-based file: text can be selected, copied and searched. This is different from tools that render a page as an image, which produce a PDF that looks like text but can't be interacted with the same way.",
      },
      {
        heading: "How pagination is handled",
        body: "Lines wrap automatically at the page width based on the chosen font and margins, and new pages are added whenever content reaches the bottom margin. Adjusting the margins or font size before conversion changes how many pages the final document spans.",
      },
      {
        heading: "Choosing page size and font",
        body: "A4 is the standard choice outside North America, while Letter is standard in the US and Canada — pick whichever matches your printer or the recipient's expectations. A serif font like Times New Roman suits formal documents, while a sans-serif font can look cleaner for notes and informal handouts.",
      },
    ],
  },

  "/tools/fuel-cost-calculator": {
    intro: [
      "The Fuel Cost Calculator works out how much fuel a trip will need and its total cost, based on the distance, your vehicle's fuel efficiency and the current price per litre, and can split that cost evenly between passengers for a shared journey. Enter the trip details and it calculates fuel required as distance divided by kilometres per litre, then multiplies by the fuel price for the total.",
      "It's useful for planning any road trip, commute or delivery run where you want to know the fuel cost in advance, whether that's for personal budgeting, agreeing a fair fuel-cost split with travel companions, or comparing the running cost of different vehicles. A round-trip toggle automatically doubles the distance for return journeys.",
    ],
    steps: [
      "Enter the one-way trip distance in kilometres or miles.",
      "Enter your vehicle's fuel efficiency, such as kilometres per litre or miles per gallon.",
      "Enter the current fuel price per litre or gallon.",
      "Toggle on round trip if the journey includes a return leg, doubling the distance automatically.",
      "Enter the number of passengers to see the fuel cost split evenly between them.",
    ],
    benefits: [
      {
        title: "Accurate distance and price inputs",
        body: "Using your actual trip distance, vehicle efficiency and current local fuel price produces a realistic cost estimate rather than a rough average that ignores your specific vehicle or route.",
      },
      {
        title: "Automatic round-trip doubling",
        body: "Toggling round trip on doubles the distance calculation automatically, avoiding the need to manually re-enter or double the distance figure yourself for a return journey.",
      },
      {
        title: "Built-in cost splitting",
        body: "Entering the number of passengers immediately shows each person's fair share of the total fuel cost, which is handy for agreeing a contribution before setting off on a shared trip.",
      },
    ],
    useCases: [
      "Estimating the total fuel cost of a road trip before setting a shared travel budget.",
      "Splitting petrol costs fairly between friends carpooling to a festival or event.",
      "Comparing the running cost of two different cars over the same regular commute.",
      "Budgeting fuel expenses for a delivery driver's daily route.",
      "Working out whether driving or flying is cheaper for a particular journey distance.",
    ],
    sections: [
      {
        heading: "How the calculation works",
        body: "Fuel needed is calculated as distance divided by kilometres per litre, and total cost is that fuel amount multiplied by the price per litre. Turning on the round-trip toggle simply doubles the distance figure before this calculation runs, so the outbound and return legs are both accounted for automatically.",
      },
      {
        heading: "Finding your vehicle's real fuel efficiency",
        body: "The most reliable method is the odometer trip test: fill the tank completely, reset the trip counter, drive normally, then refill and divide the kilometres driven by the litres needed to top up again. City driving efficiency is typically 15–25% lower than highway driving due to more frequent stopping and idling.",
      },
      {
        heading: "Splitting costs fairly",
        body: "Dividing the total fuel cost evenly by the number of passengers is the simplest approach for a shared trip, though some groups prefer to exclude the driver from the split since they're providing the vehicle — the calculator gives the even-split figure as a starting point for that conversation.",
      },
    ],
  },

  "/tools/typing-speed-test": {
    intro: [
      "The Typing Speed Test measures your words-per-minute and accuracy in real time as you type a given passage, with a choice of 15, 30, 60 or 120 second test durations. As you type, the test tracks both raw speed and net speed after accounting for mistakes, giving a realistic picture of practical typing performance rather than just how fast your fingers can move.",
      "It's a quick way to check your current typing speed, warm up before a data-entry task, or track improvement over repeated attempts as you build muscle memory. Because everything runs locally, there's no signup needed to try a test — just pick a duration and start typing to see live WPM and accuracy update as you go.",
    ],
    steps: [
      "Choose a test duration: 15, 30, 60 or 120 seconds.",
      "Click into the typing area and begin typing the displayed passage as accurately and quickly as you can.",
      "Watch your live WPM and accuracy percentage update as you type.",
      "Finish the test once the timer ends, or complete the full passage if it ends sooner.",
      "Review your final net WPM, raw WPM and accuracy score, then try again to beat your result.",
    ],
    benefits: [
      {
        title: "Live WPM and accuracy tracking",
        body: "Speed and accuracy figures update continuously during the test rather than only appearing at the end, giving immediate feedback on typing rhythm and mistakes as they happen.",
      },
      {
        title: "Multiple test durations",
        body: "Choosing between 15, 30, 60 and 120 second tests allows a quick check or a longer, more representative measurement of sustained typing speed depending on how much time you have.",
      },
      {
        title: "Net vs raw speed distinction",
        body: "Separating raw typing speed from net speed after errors gives a clearer, more honest measurement of practical typing ability than a raw character count alone would.",
      },
    ],
    useCases: [
      "Checking current typing speed before applying for a job that requires a minimum WPM.",
      "Warming up hands and building typing rhythm before a long stretch of data entry.",
      "Tracking typing speed improvement over repeated practice sessions.",
      "Comparing typing speed on a new keyboard versus a familiar one.",
      "Running a quick friendly typing speed competition between colleagues or classmates.",
    ],
    sections: [
      {
        heading: "How WPM is calculated",
        body: "One word is standardised as five characters for scoring purposes. Net WPM counts only correctly typed characters, divides by five, then divides by the minutes elapsed — the same method used by professional typing test standards, which is why net WPM is usually lower than raw WPM once mistakes are factored in.",
      },
      {
        heading: "What counts as a good typing speed?",
        body: "Around 40 WPM is considered an average typing speed, 60–80 WPM is fast, and professional typists often exceed 100 WPM. Accuracy above 95% generally matters more for real-world productivity than chasing the highest possible raw speed, since correcting mistakes afterwards costs more time than typing slightly slower and getting it right first time.",
      },
      {
        heading: "Improving typing speed over time",
        body: "Consistent short practice sessions tend to build speed more reliably than occasional long ones, since typing speed is largely a matter of muscle memory. Focusing on accuracy first and allowing speed to increase naturally as errors reduce is generally more effective than trying to type faster while still making frequent mistakes.",
      },
    ],
  },

  "/tools/pdf-to-pdfa": {
    intro: [
      "PDF to PDF/A converts a standard PDF into an archive-ready PDF/A style document suited to long-term storage, compliance submissions and institutional record-keeping, with the entire conversion running in the browser. PDF/A embeds fonts, colour profiles and other display-critical information directly into the file, ensuring the document will render identically decades from now regardless of what software or fonts happen to be installed.",
      "This matters whenever a court, university, government portal or corporate archive specifically requires PDF/A rather than a regular PDF, since standard PDFs can rely on external font references or unembedded resources that degrade or disappear over time. The conversion preserves page content, order and dimensions exactly — only metadata and embedding rules are normalised for archiving.",
    ],
    steps: [
      "Upload the standard PDF you need to convert for archiving or compliance purposes.",
      "Let the tool process the file, embedding fonts and normalising the internal structure.",
      "Review the converted file to confirm pages and content appear unchanged.",
      "Download the resulting PDF/A style document.",
      "Submit or archive the converted file wherever PDF/A compliance is required.",
    ],
    benefits: [
      {
        title: "Long-term display stability",
        body: "Fonts and other resources are embedded directly into the file, so the document will look the same in ten or twenty years regardless of whether the original fonts are still installed on the viewing computer.",
      },
      {
        title: "Meets institutional requirements",
        body: "Courts, universities and government portals frequently mandate PDF/A specifically for submissions, and this conversion produces a file structured to meet that requirement without specialist archiving software.",
      },
      {
        title: "No visible change to content",
        body: "Page content, order and dimensions remain exactly as they were in the source PDF — only the underlying metadata and embedding rules are adjusted, so there's no risk of the document looking different after conversion.",
      },
    ],
    useCases: [
      "Preparing a court filing that specifically requires submission in PDF/A format.",
      "Archiving company records in a format designed to remain readable for decades.",
      "Submitting a thesis or dissertation to a university repository that mandates PDF/A.",
      "Converting scanned historical documents into an archive-safe format for a library or museum.",
      "Meeting a government portal's compliance requirement for long-term document storage.",
    ],
    sections: [
      {
        heading: "Why PDF/A matters for archiving",
        body: "Regular PDFs can reference external fonts or colour profiles that may not exist on a future computer, causing the document to render incorrectly or substitute fonts. PDF/A eliminates this risk by requiring every resource needed to display the page to be embedded directly inside the file itself.",
      },
      {
        heading: "Does conversion change how the file looks?",
        body: "No — page content, layout, order and dimensions stay identical to the source PDF. The conversion only adjusts internal metadata and font/resource embedding rules to meet the PDF/A specification, so a side-by-side visual comparison of the two files should show no difference.",
      },
      {
        heading: "When you don't need PDF/A",
        body: "For everyday sharing, printing or emailing, a standard PDF is perfectly adequate and doesn't need converting. PDF/A conversion is specifically for situations where long-term archival stability or a formal compliance requirement makes the extra embedding rules necessary.",
      },
    ],
  },

  "/tools/repair-pdf": {
    intro: [
      "Repair PDF rebuilds a damaged PDF file that won't open, shows blank pages, or reports a broken internal structure, reconstructing what can still be read and producing a usable document you can download immediately. This runs entirely in the browser, rebuilding broken cross-reference tables and malformed page trees without needing desktop repair software.",
      "PDF corruption commonly happens from an interrupted download, a failed transfer, or a file saved incorrectly by another application. Rather than losing access to the document entirely, this tool attempts to recover every page the parser can still successfully read, discarding only the fragments that are genuinely unreadable, so the rest of the file opens normally again.",
    ],
    steps: [
      "Upload the corrupted or damaged PDF file that won't open properly.",
      "Let the tool scan the file's internal structure to identify what can be recovered.",
      "Wait while broken cross-reference tables and page trees are rebuilt.",
      "Review the repaired document to confirm which pages were successfully recovered.",
      "Download the repaired PDF file.",
    ],
    benefits: [
      {
        title: "Rebuilds broken internal structure",
        body: "Common causes of PDF corruption — broken cross-reference tables, truncated downloads and malformed page trees — are specifically targeted and reconstructed rather than the tool simply giving up on the file.",
      },
      {
        title: "Recovers what's still readable",
        body: "Every page the parser can successfully interpret is kept in its original order, maximising how much of the original document survives the repair process.",
      },
      {
        title: "No software installation needed",
        body: "Repair happens directly in the browser, avoiding the need to install a dedicated desktop PDF recovery tool just to fix an occasional corrupted file.",
      },
    ],
    useCases: [
      "Recovering a PDF that stopped downloading partway through and now won't open.",
      "Fixing a document that shows blank or garbled pages after being saved by another application.",
      "Repairing a PDF that a PDF reader reports has a broken or invalid structure.",
      "Rescuing a report or contract file that was corrupted during a file transfer.",
      "Attempting recovery of an important scanned document before resorting to a re-scan.",
    ],
    sections: [
      {
        heading: "What kind of damage can be fixed",
        body: "Broken cross-reference tables, files truncated by an interrupted download, and malformed page tree structures are the typical issues this tool rebuilds. Files with genuinely missing content — for example, if the download was cut off so early that entire pages were never written — cannot be restored, since that data simply isn't present anywhere in the file.",
      },
      {
        heading: "Will I lose any pages?",
        body: "Every page the parser can still successfully read is preserved in its original order during the repair. Only fragments that are truly unreadable are dropped, which allows the rest of the document to open normally rather than the whole file remaining unusable because of a few damaged sections.",
      },
      {
        heading: "Preventing future corruption",
        body: "Corruption often stems from an interrupted download or a crash during saving, so re-downloading a file completely before opening it, and avoiding force-quitting an application mid-save, reduces the risk of needing repair in the first place. Keeping a backup copy of important PDFs is also good practice.",
      },
    ],
  },

  "/tools/word-to-jpg": {
    intro: [
      "Word to JPG converts a Word document into high-resolution JPG images, producing one image per page so the content is ready to share directly on WhatsApp, Instagram, slides or anywhere that doesn't accept document uploads. Upload your .docx file and the tool renders each page at a high pixel density, keeping text sharp rather than blurry the way a low-resolution screenshot would look.",
      "This is useful whenever a document needs to be shared as an image rather than a file — a flyer, a single-page announcement, or a page from a longer document that someone wants to view without opening Word. Because every page becomes its own separate JPG file, individual pages can be shared or uploaded independently in the original document order.",
    ],
    steps: [
      "Upload the Word document (.docx) you want to convert to images.",
      "Let the tool render each page of the document at high resolution.",
      "Preview the resulting images to confirm formatting and layout have converted correctly.",
      "Download individual JPG images or all pages together as a ZIP file.",
      "Share or upload the images to whichever platform requires an image rather than a document file.",
    ],
    benefits: [
      {
        title: "High-resolution rendering",
        body: "Pages are rendered at a high pixel density so text stays sharp when zoomed in or printed, rather than looking blurry or pixelated the way a basic screenshot of a document would appear.",
      },
      {
        title: "One image per page",
        body: "Every page of the document is exported as its own separate JPG file in the original order, making it easy to share, upload or post individual pages without extra editing.",
      },
      {
        title: "No document viewer needed",
        body: "Recipients can view the content as a standard image without needing Word or any document-reading software installed, which matters for sharing on messaging apps and social platforms.",
      },
    ],
    useCases: [
      "Sharing a single-page flyer or announcement created in Word directly on social media.",
      "Sending a page from a Word document over WhatsApp when the recipient can't open .docx files.",
      "Turning a Word-based worksheet into an image for uploading to a slideshow or presentation.",
      "Posting a page of a printed newsletter created in Word to an Instagram story.",
      "Converting a certificate or letter drafted in Word into an image for easy digital sharing.",
    ],
    sections: [
      {
        heading: "Image resolution and quality",
        body: "Pages are rendered at a high pixel density specifically so that text remains crisp and legible when the image is zoomed in on or printed at a reasonably large size, avoiding the softness typically seen in a basic screen capture of a document page.",
      },
      {
        heading: "Getting one image per page",
        body: "Every page in the source document is exported as its own individual JPG, preserving the original page order, which makes it straightforward to share or upload single pages separately rather than dealing with one combined multi-page image.",
      },
      {
        heading: "Formatting fidelity",
        body: "Since each page is rendered visually rather than reflowed as plain text, layouts, fonts, images and formatting from the original Word document carry across into the JPG images faithfully, so complex documents with columns, tables or embedded images convert accurately.",
      },
    ],
  },
};
