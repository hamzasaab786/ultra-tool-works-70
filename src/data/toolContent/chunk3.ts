import type { ToolContentMap } from "./types";

export const chunk3: ToolContentMap = {
  "/tools/image-enhancer": {
    intro: [
      "The Image Enhancer sharpens and brightens photos directly in your browser, giving you sliders for sharpness, brightness, contrast and saturation with a live preview that updates instantly as you drag. It is built for anyone who needs to fix a slightly blurry picture, brighten a dim indoor shot, or add punch to a dull photo before posting it online, without installing Photoshop or Lightroom.",
      "Because every adjustment runs on your device using canvas image processing, nothing is uploaded to a server and the original file never leaves your computer. You can enhance blurry photos, boost clarity on low resolution images, and export the result in one click, making it a practical alternative to desktop photo editors for quick fixes rather than full retouching projects.",
    ],
    steps: [
      "Click the upload area or drag a JPG, PNG or WebP photo into the Image Enhancer.",
      "Drag the Sharpness slider to recover edge detail on soft or slightly blurred photos.",
      "Adjust Brightness and Contrast to lift dim shadows or tame an overexposed shot.",
      "Increase Saturation if colours look washed out, watching the live preview for natural results.",
      "Compare the before and after preview panels side by side.",
      "Click Export/Download to save the enhanced image to your device.",
    ],
    benefits: [
      {
        title: "Live before-and-after preview",
        body: "Every slider updates the preview instantly, so you can see exactly how sharpening or brightness changes affect the image before committing. This removes the guesswork of exporting, checking and re-editing repeatedly.",
      },
      {
        title: "Targeted sharpening, not a blur guess",
        body: "The sharpen control boosts edge contrast rather than applying a blanket filter, which helps recover soft focus and light motion blur without amplifying noise across flat areas of the photo.",
      },
      {
        title: "No install, no upload",
        body: "Processing happens with canvas operations in the browser tab, so private photos never touch a remote server. It works the same on a phone browser as on a desktop.",
      },
    ],
    useCases: [
      "Brightening a dark indoor photo taken without flash before sharing it.",
      "Sharpening a slightly out-of-focus product photo for an online listing.",
      "Boosting saturation on a travel photo that looks flat straight out of the camera.",
      "Cleaning up a scanned or screenshot image before adding it to a document.",
      "Quickly improving a profile picture without opening a full photo editor.",
    ],
    sections: [
      {
        heading: "What enhancement can and cannot fix",
        body: "Sharpening and contrast adjustments recover detail that is present but faint, boosting edge contrast so soft focus and light motion blur look crisper. They cannot invent detail the camera never captured, so heavily blurred or extremely low-resolution photos will only improve partially, not become perfectly sharp.",
      },
      {
        heading: "Supported formats and file size",
        body: "JPG, PNG and WebP images are supported, and processing speed depends on your device rather than an upload connection since nothing leaves the browser. Very large photos from modern phone cameras may take a moment longer to render the preview.",
      },
      {
        heading: "Getting natural-looking results",
        body: "Small, combined adjustments usually look better than one extreme slider. Raise sharpness first, then nudge brightness and contrast, and add saturation last in small steps, checking the preview after every change to avoid an over-processed look.",
      },
    ],
  },

  "/tools/image-to-url": {
    intro: [
      "The Image to URL Converter turns any picture into a Base64 data URL or copy-ready string that you can drop straight into HTML, CSS or an email template. Instead of hosting the file somewhere and linking to it, the image data itself is embedded in the code, which is handy for small icons, logos and inline assets.",
      "Conversion happens entirely in your browser: pick a file, and the tool reads it and encodes it as Base64 without any upload step. You get a data:image/...;base64,... string ready to paste, plus the raw Base64 text if you need it separately, making this a quick way to convert an image to a link-style value for embedding rather than public hosting.",
    ],
    steps: [
      "Select or drag in the PNG, JPG, GIF, SVG or WebP image you want to convert.",
      "Wait for the tool to read the file and generate the Base64 data URL.",
      "Copy the full data URL for use directly in an <img src=\"...\"> tag or CSS background-image.",
      "Optionally copy just the raw Base64 string if your use case needs it without the data: prefix.",
      "Paste the result into your HTML, CSS or email template code.",
    ],
    benefits: [
      {
        title: "No hosting required",
        body: "The image data lives inside the string itself, so there is no separate file to upload or link that can break. This suits small assets embedded directly in code or markup.",
      },
      {
        title: "Instant, local conversion",
        body: "Encoding happens in the browser as soon as the file loads, with no server round trip, so there is no waiting on an upload or download step for the result.",
      },
      {
        title: "Copy-ready output for both formats",
        body: "You get the full data URL and the plain Base64 string, covering both direct embedding and cases where a separate encoding value is needed, such as JSON payloads.",
      },
    ],
    useCases: [
      "Embedding a small logo or icon directly inside an HTML email template.",
      "Adding a CSS background-image without creating an extra image request.",
      "Sharing a tiny image as text inside a chat or code snippet.",
      "Testing how an inline image renders before wiring up real image hosting.",
      "Encoding an image for storage inside a JSON configuration file.",
    ],
    sections: [
      {
        heading: "When a data URL beats a regular image file",
        body: "Data URLs make sense for small assets under roughly 10 KB, such as icons, spacers and signature logos, because they save an extra HTTP request. Base64 encoding adds about 33% to the file size, so for larger photos a normal hosted image file loads faster.",
      },
      {
        heading: "Browser and email client support",
        body: "Data URLs are supported in all modern browsers for both <img> tags and CSS. Some older or more restrictive email clients strip or ignore embedded images, so it is worth testing critical email templates before relying on this method for a wide audience.",
      },
      {
        heading: "Formats handled",
        body: "PNG, JPG, GIF, WebP and SVG files all convert correctly, keeping their original MIME type in the data URL prefix. Transparency in PNG and SVG files is preserved because the encoding just represents the original file bytes as text.",
      },
    ],
  },

  "/tools/split-pdf": {
    intro: [
      "Split PDF breaks a single document into separate files, whether you need to extract a handful of pages, cut the file at a fixed interval, or produce one file per page. Everything happens client-side with pdf-lib style processing in the browser, so a long report, contract or scanned book never has to be uploaded anywhere to be divided up.",
      "You choose exactly how the split happens: enter specific page numbers or ranges such as 3-7, 12, or set an interval so every few pages becomes its own file. This makes the tool useful both for pulling one important page out of a larger PDF and for chopping a bulky document into manageable, share-sized chunks.",
    ],
    steps: [
      "Upload the PDF you want to split by dragging it in or browsing your files.",
      "Choose a split mode: extract specific pages, split by a fixed page interval, or split into single pages.",
      "Enter the page numbers or ranges you need, such as 3-7, 12, if extracting specific pages.",
      "Preview the page thumbnails to confirm which pages fall in each output file.",
      "Click Split to process the document in your browser.",
      "Download the resulting files individually or as a combined ZIP.",
    ],
    benefits: [
      {
        title: "Flexible splitting modes",
        body: "You are not limited to one splitting method — extract a custom page range, cut the document at regular intervals, or explode it into single-page files, all from the same tool.",
      },
      {
        title: "Original file stays untouched",
        body: "Splitting writes only the pages you select into new output files; the source PDF you uploaded is never modified, so you can re-run the split differently if needed.",
      },
      {
        title: "Private, browser-based processing",
        body: "The PDF is parsed and rewritten in your browser tab rather than on a server, which matters for contracts, statements or scanned documents containing sensitive information.",
      },
    ],
    useCases: [
      "Pulling a single signed page out of a long contract to send separately.",
      "Splitting a scanned multi-chapter book into one file per chapter.",
      "Breaking a large invoice batch PDF into individual invoices.",
      "Separating a combined statement into per-month files for filing.",
      "Extracting the pages relevant to one department from a shared report.",
    ],
    sections: [
      {
        heading: "Splitting vs extracting pages",
        body: "Splitting is aimed at dividing a whole document into multiple output files, whether by range, interval or single pages. If you only need to keep a handful of pages and discard the rest into one new file, the dedicated Extract PDF Pages tool does that more directly.",
      },
      {
        heading: "Page range syntax",
        body: "Ranges accept comma-separated numbers and hyphenated spans together, so 1-3, 5, 8-10 pulls pages one through three, page five, and pages eight through ten in that order. Page numbers refer to the position in the original document, not the printed page numbers shown on the paper.",
      },
      {
        heading: "File size and page count limits",
        body: "Because splitting runs in the browser's memory, very large PDFs with hundreds of high-resolution scanned pages may take longer to process or use more memory than a typical text document. Closing other heavy browser tabs helps when working with big scanned files.",
      },
    ],
  },

  "/tools/pdf-metadata-extractor": {
    intro: [
      "The PDF Metadata Extractor reads the hidden document information stored inside a PDF: title, author, subject, keywords, the producer and creator applications, creation and modification dates, page count, page dimensions and whether the file is encrypted. It is aimed at anyone who needs to verify who created a document, when, and with what software, without opening a full PDF editor.",
      "The file is parsed entirely in your browser, so you can check the properties of confidential contracts, submissions or scanned records without sending them to a third-party server. The results are displayed in a clear, readable list, useful for due diligence, plagiarism checks, or simply confirming a PDF's origin before relying on it.",
    ],
    steps: [
      "Upload the PDF file you want to inspect.",
      "Wait for the tool to parse the document information dictionary.",
      "Review the displayed title, author, subject, keywords, producer and creator fields.",
      "Check the creation and modification date and time stamps.",
      "Note the page count, page size and encryption status shown alongside the metadata.",
    ],
    benefits: [
      {
        title: "Full metadata picture in one view",
        body: "Title, author, dates, producer, page count and page size are all shown together, so you do not need multiple tools or a desktop PDF reader's properties dialog to get the full picture.",
      },
      {
        title: "Encryption and origin checks",
        body: "Seeing the producer and creator application can reveal whether a PDF was generated by Word, a scanner, or PDF software, which is useful when verifying the authenticity of a submitted document.",
      },
      {
        title: "No file leaves your browser",
        body: "Parsing happens locally, which matters when checking sensitive contracts, legal filings or personal records that you would rather not upload to an unknown server.",
      },
    ],
    useCases: [
      "Verifying when a contract PDF was actually created versus its claimed date.",
      "Checking the true author name embedded in a submitted assignment or report.",
      "Confirming which software produced a PDF before troubleshooting a rendering issue.",
      "Reviewing page count and page size before printing a large batch of documents.",
      "Checking whether a received PDF is password-protected or encrypted before sharing it further.",
    ],
    sections: [
      {
        heading: "What the document information dictionary stores",
        body: "Every PDF can carry a metadata block with title, author, subject, keywords, the producer library that wrote the file, the creating application, and creation and modification timestamps. Not every field is always filled in — many PDFs exported from simple tools leave author or subject blank.",
      },
      {
        heading: "Why the author field can look wrong",
        body: "The author field reflects whatever was set in the software or account used to create the file, such as a company template's default name or a colleague's user profile, rather than the person who last edited the content. It is a stored label, not a verified signature.",
      },
      {
        heading: "Metadata versus content", 
        body: "This tool reads only the structural metadata, not the visible text or images inside the pages. To search for specific words or extract tables from the content itself, a text-focused tool such as PDF to Word or PDF to CSV is the better fit.",
      },
    ],
  },

  "/tools/pdf-to-word": {
    intro: [
      "PDF to Word converts a PDF document into an editable DOCX file, keeping paragraphs, headings and basic formatting intact so you can open the result directly in Microsoft Word, Google Docs or LibreOffice and start editing. It is designed for reports, letters and forms where the original PDF is essentially a formatted text document rather than a scanned image.",
      "Conversion runs entirely client-side: the PDF's text layer is read and rebuilt as real Word paragraphs and headings in your browser, then packaged into a genuine .docx file for download. Because there is no server upload, this works well for confidential documents such as contracts or CVs that you would rather not send to an unknown conversion service.",
    ],
    steps: [
      "Upload the PDF file you want converted to Word.",
      "Wait while the tool reads the text layer and reconstructs paragraphs and headings.",
      "Preview the extracted content if a preview panel is shown.",
      "Click Convert or Download to generate the DOCX file.",
      "Open the downloaded .docx in Word, Google Docs or LibreOffice and edit as needed.",
    ],
    benefits: [
      {
        title: "Real editable paragraphs, not an image",
        body: "Text is rebuilt as genuine Word paragraphs with basic heading structure retained, so you can rewrite sentences, reflow text and apply new styles directly in your word processor.",
      },
      {
        title: "Works on confidential documents",
        body: "Because conversion happens in the browser, contracts, CVs and internal reports never leave your device during the process, unlike many online converters that require a file upload.",
      },
      {
        title: "Genuine DOCX output",
        body: "The download is a standard Office Open XML .docx file, so it opens correctly in Word, Google Docs, LibreOffice and Pages without needing a special reader.",
      },
    ],
    useCases: [
      "Editing an old CV or cover letter that only exists as a PDF.",
      "Updating a contract template that was exported to PDF for signing.",
      "Turning a downloaded report into an editable draft for a new version.",
      "Extracting the wording from a PDF form to reuse in a new document.",
      "Converting a PDF newsletter into an editable Word file for rewriting.",
    ],
    sections: [
      {
        heading: "Why scanned PDFs convert poorly",
        body: "A scanned page is really an image with no underlying text layer, so a straightforward PDF-to-Word conversion has no words to extract and produces a blank or near-empty document. Scanned documents need OCR (optical character recognition) first to turn the picture of text into actual selectable text.",
      },
      {
        heading: "What formatting survives conversion",
        body: "Paragraph breaks, heading levels and basic emphasis such as bold and italics typically carry over, since these map cleanly onto Word styles. Complex multi-column layouts, exact font matching and precise pixel positioning are harder to reproduce and may shift slightly in the converted file.",
      },
      {
        heading: "Compared with desktop conversion tools",
        body: "Desktop Word and Adobe Acrobat both offer PDF-to-Word conversion, but they require the software installed and, in Acrobat's case, a paid subscription. This browser-based tool covers the same core paragraph and heading conversion for free without installing anything.",
      },
    ],
  },

  "/tools/excel-to-pdf": {
    intro: [
      "Excel to PDF converts XLSX, XLS and CSV spreadsheets into clean, printable PDF tables, handling column widths, sheet names and page orientation so the output stays readable rather than cutting columns off mid-row. It suits anyone sending a spreadsheet to someone without Excel installed, or archiving a workbook in a format that always looks the same.",
      "The spreadsheet is parsed and rendered to PDF entirely in your browser, with support for selecting which sheets to include and choosing landscape orientation for wide tables. This keeps financial data, price lists or exported reports private during conversion, since the file is never uploaded to a server to be processed.",
    ],
    steps: [
      "Upload your XLSX, XLS or CSV spreadsheet file.",
      "Select which sheet or sheets you want included in the PDF.",
      "Choose page orientation, picking landscape for wide tables with many columns.",
      "Adjust page size if needed, such as A3 for particularly wide data.",
      "Click Convert to generate the PDF.",
      "Download the finished PDF file.",
    ],
    benefits: [
      {
        title: "Multi-sheet workbooks handled in order",
        body: "Every sheet in the workbook is exported in sequence, each starting on a fresh page with its sheet name shown as a heading, so a multi-tab spreadsheet stays organised and easy to navigate in the PDF.",
      },
      {
        title: "Landscape and page size control",
        body: "Wide tables with many columns can be switched to landscape orientation or a larger page size such as A3, reducing the chance that important data gets cut off at the page edge.",
      },
      {
        title: "No spreadsheet software needed to view results",
        body: "Recipients without Excel installed can open the PDF in any browser or PDF reader, making it a reliable way to share tabular data for viewing or printing rather than editing.",
      },
    ],
    useCases: [
      "Sending a price list to a client who does not use Excel.",
      "Archiving a monthly report spreadsheet as a fixed, unchangeable PDF.",
      "Printing a wide data table without columns being cut off.",
      "Converting a CSV export from an accounting system into a shareable PDF.",
      "Preparing a multi-sheet budget workbook as one PDF for a meeting.",
    ],
    sections: [
      {
        heading: "Supported spreadsheet formats",
        body: "XLSX and XLS workbook formats are supported along with plain CSV files, covering spreadsheets exported from Excel, Google Sheets and most accounting or database software. Formulas are converted using their last calculated values, since a PDF has no live formula engine.",
      },
      {
        heading: "Fixing a table that gets cut off",
        body: "If a wide table is truncated in the preview, switch orientation to landscape, move to a larger page size such as A3, or hide unnecessary columns in the spreadsheet before converting. Reducing font size in the source sheet can also help fit more columns per page.",
      },
      {
        heading: "Formatting fidelity",
        body: "Column widths, basic cell borders and simple number formatting carry through to the PDF, giving a result close to what you would get printing directly from Excel. Highly complex conditional formatting or embedded charts may render more simply than in the original spreadsheet.",
      },
    ],
  },

  "/tools/percentage-calculator": {
    intro: [
      "The Percentage Calculator handles the everyday percentage questions people search for: what is X percent of Y, what percentage increase or decrease happened between two numbers, and what percent one number represents of another. Each result shows the underlying formula, so you can see exactly how the answer was reached rather than just getting a bare number.",
      "It runs instantly in the browser as you type, with separate modes for straightforward percentage-of calculations and percentage change calculations. This makes it useful for quick everyday maths such as working out a tip, a pay rise, or how much a price has grown or shrunk, without needing to remember or rearrange the formulas yourself.",
    ],
    steps: [
      "Choose the calculation type: percentage of a number, percentage increase/decrease, or what percent X is of Y.",
      "Enter the two relevant numbers into the input fields.",
      "Read the calculated result and the percentage change or value shown instantly.",
      "Check the formula displayed underneath to see exactly how the figure was derived.",
      "Adjust either number to recalculate the result live.",
    ],
    benefits: [
      {
        title: "Formula shown with every answer",
        body: "Rather than a black-box result, each calculation displays the formula used, such as (new - old) / old x 100 for percentage change, so you can learn the method or double-check the maths by hand.",
      },
      {
        title: "Covers multiple percentage question types",
        body: "Percentage of a value, percentage increase, percentage decrease, and what-percent-is-X-of-Y are all handled in one tool, avoiding the need to search for a separate calculator for each variant.",
      },
      {
        title: "Instant, no sign-up calculation",
        body: "Results update as you type with no submit button or account required, which suits quick checks while shopping, budgeting or doing homework.",
      },
    ],
    useCases: [
      "Working out what percentage a discount actually represents while shopping.",
      "Calculating a percentage pay rise or salary increase between two figures.",
      "Checking what percent of a monthly budget a specific expense uses.",
      "Finding the original price of an item before a known discount was applied.",
      "Working out exam or test scores as a percentage of the total marks.",
    ],
    sections: [
      {
        heading: "Percentage increase and decrease formula",
        body: "Percentage change is calculated as (new value - old value) divided by the old value, multiplied by 100. Going from 80 to 100 gives (100-80)/80 x 100, which is 25% increase; a fall from 100 to 80 gives -20%, showing that increase and decrease percentages between the same two numbers are not simple mirror images.",
      },
      {
        heading: "Finding a price before a discount",
        body: "If you know the discounted price and the discount percentage, divide the discounted price by (1 minus the discount as a decimal). A £75 sale price after a 25% discount means the original price was £75 / 0.75, which equals £100.",
      },
      {
        heading: "Common percentage mistakes to avoid",
        body: "A common error is applying a percentage change to the wrong base number, for example calculating a decrease using the new value instead of the original. Always divide the difference by the starting value, not the ending value, to get a correct percentage change.",
      },
    ],
  },

  "/tools/loan-calculator": {
    intro: [
      "The Loan Calculator works out the monthly repayment, total interest paid and full amortisation schedule for mortgages, car loans and personal loans, based on the principal, interest rate and loan term you enter. It uses the standard amortisation formula so the figures match what a bank or lender would quote for a fixed-rate loan.",
      "Everything is calculated instantly in the browser as you adjust the inputs, letting you compare different terms, rates or deposit amounts side by side without opening a spreadsheet. This makes it useful for anyone budgeting for a mortgage, weighing up a car finance offer, or checking a lender's numbers before signing.",
    ],
    steps: [
      "Enter the loan amount (principal) you plan to borrow.",
      "Enter the annual interest rate offered by the lender.",
      "Enter the loan term in years or months.",
      "Review the calculated monthly payment and total interest over the life of the loan.",
      "Open the amortisation schedule to see how much of each payment goes to interest versus principal.",
      "Adjust the term or rate to compare alternative scenarios.",
    ],
    benefits: [
      {
        title: "Full amortisation schedule, not just a monthly figure",
        body: "Beyond the headline monthly payment, you can see how the balance of interest versus principal shifts with every payment across the full loan term, which is useful for understanding how extra payments would help.",
      },
      {
        title: "Standard amortisation formula",
        body: "The calculation uses the same P x r x (1+r)^n / ((1+r)^n - 1) formula lenders use, so the monthly payment figure lines up with quotes from banks and finance providers for a comparable fixed-rate loan.",
      },
      {
        title: "Instant comparison of scenarios",
        body: "Changing the term, rate or loan amount recalculates everything immediately, making it quick to compare a 15-year against a 30-year mortgage, or two competing loan offers.",
      },
    ],
    useCases: [
      "Estimating the monthly repayment on a mortgage before house hunting.",
      "Comparing car finance offers with different terms and interest rates.",
      "Checking a personal loan quote against the calculator's own numbers.",
      "Seeing how much total interest a longer loan term adds compared to a shorter one.",
      "Understanding how much of an early payment reduces the principal versus interest.",
    ],
    sections: [
      {
        heading: "How the monthly payment is calculated",
        body: "The amortisation formula P x r x (1+r)^n / ((1+r)^n - 1) uses the principal P, the monthly interest rate r (the annual rate divided by 12), and the total number of monthly payments n. This produces a fixed payment amount that fully repays the loan, with interest, by the end of the term.",
      },
      {
        heading: "Why a shorter term saves so much interest",
        body: "A shorter term means less time for interest to accrue on the outstanding balance, even though the monthly payment is higher. Cutting a 30-year mortgage down to 15 years, for example, typically cuts total interest paid by a large margin because the principal is repaid far faster.",
      },
      {
        heading: "What the calculator does not include",
        body: "This tool calculates interest and principal repayment only; it does not add property taxes, insurance, lender fees or variable-rate changes over time. For an adjustable-rate loan, treat the result as accurate for the current fixed rate period only.",
      },
    ],
  },

  "/tools/case-converter": {
    intro: [
      "The Case Converter instantly switches text between UPPERCASE, lowercase, Sentence case, Title Case, camelCase, snake_case and kebab-case, which is useful for writers cleaning up copy and developers reformatting variable names or file paths. Paste any block of text and choose the case you need from the available buttons.",
      "Conversion happens live in the browser with no character limit imposed beyond what your device can handle comfortably, and the result is ready to copy straight back out. This avoids manually retyping headlines, renaming variables one at a time, or fixing text that was accidentally typed with caps lock left on.",
    ],
    steps: [
      "Paste or type your text into the input box.",
      "Choose the target case: UPPERCASE, lowercase, Sentence case, Title Case, camelCase, snake_case or kebab-case.",
      "Review the converted text shown in the output area.",
      "Click Copy to copy the result to your clipboard.",
      "Repeat with a different case option if you need multiple versions of the same text.",
    ],
    benefits: [
      {
        title: "Covers writing and coding conventions together",
        body: "Sentence and Title Case suit everyday writing and headlines, while camelCase, snake_case and kebab-case cover programming naming conventions, so the one tool serves both writers and developers.",
      },
      {
        title: "Fixes accidental caps lock instantly",
        body: "Text typed entirely in capitals by mistake can be converted straight to Sentence case or lowercase in one click, rather than being retyped from scratch.",
      },
      {
        title: "Instant, in-browser conversion",
        body: "There is no processing delay or upload step; the case change is applied to the text as soon as you click the button, keeping the workflow fast for repeated edits.",
      },
    ],
    useCases: [
      "Converting a headline into Title Case for a blog post or article.",
      "Turning a database column name into camelCase for use in JavaScript code.",
      "Fixing an email or message accidentally typed with caps lock on.",
      "Converting a page title into kebab-case for a URL slug.",
      "Formatting a list of names or headings into consistent Sentence case.",
    ],
    sections: [
      {
        heading: "Title Case versus Sentence case",
        body: "Title Case capitalises each major word, as in \"How to Write Better Copy,\" and is typically used for headings and titles. Sentence case capitalises only the first word and proper nouns, as in \"How to write better copy,\" and matches normal prose formatting.",
      },
      {
        heading: "Choosing a case for code",
        body: "camelCase (myVariableName) is the convention for JavaScript and Java variables and functions, snake_case (my_variable_name) is common in Python and SQL, and kebab-case (my-variable-name) is standard for URL slugs and CSS class names. Picking the right one keeps code consistent with the surrounding codebase's style.",
      },
      {
        heading: "Handling punctuation and special characters",
        body: "Sentence and Title Case preserve existing punctuation and only adjust letter casing, while camelCase, snake_case and kebab-case strip spaces and punctuation to build a single continuous identifier. Numbers and existing hyphens or underscores are generally kept as separators during conversion.",
      },
    ],
  },

  "/tools/url-decoder": {
    intro: [
      "The URL Encoder & Decoder converts text and full URLs to and from percent-encoded form, correctly handling spaces, special characters and Unicode text such as accented letters or non-Latin scripts. It is aimed at developers debugging query strings and anyone who needs to make sense of a URL full of %20 and similar codes.",
      "Switch between encode and decode modes, paste in your text or URL, and get an instant, correctly escaped result with no server round trip involved. This is useful both for building safe query parameters to paste into a link, and for reading back a long encoded URL that has become hard to interpret by eye.",
    ],
    steps: [
      "Choose Encode or Decode mode depending on your task.",
      "Paste the URL, query string or plain text you want to convert.",
      "Read the converted result shown instantly in the output box.",
      "Click Copy to copy the encoded or decoded text to your clipboard.",
      "Switch modes and paste the result back in if you need to verify the round trip.",
    ],
    benefits: [
      {
        title: "Correct handling of Unicode and special characters",
        body: "Accented letters, emoji, spaces and reserved characters like & and ? are all percent-encoded correctly, matching what browsers actually produce, so encoded query parameters work reliably when used in real links.",
      },
      {
        title: "Two-way encode and decode in one tool",
        body: "You can both build a properly encoded query string and decode an existing long URL back into readable text, without needing separate tools for each direction.",
      },
      {
        title: "Instant feedback while debugging",
        body: "Pasting in a suspicious URL immediately reveals what it decodes to, which speeds up tracking down bugs caused by double-encoding or missing encoding in an application.",
      },
    ],
    useCases: [
      "Debugging why a query parameter with special characters is not matching in an application.",
      "Reading an unfamiliar, heavily encoded URL to see its real content.",
      "Encoding user-entered search terms before adding them to a link.",
      "Building a mailto link or share URL containing spaces and punctuation.",
      "Checking whether a URL has been accidentally double-encoded.",
    ],
    sections: [
      {
        heading: "Why URLs contain codes like %20",
        body: "URLs are restricted to a limited set of ASCII characters, so anything outside that set — spaces, ampersands, non-Latin letters — must be represented using percent-encoding. %20 represents a space, %26 an ampersand, and %3F a question mark, allowing those characters to safely appear inside a URL without breaking its structure.",
      },
      {
        heading: "When you need to encode a URL",
        body: "Encode whenever user input, search terms or non-English text is being placed into a query parameter or path segment, since unencoded special characters can break the URL structure or be interpreted incorrectly by the server. Static, hand-typed URLs with only letters and numbers typically need no encoding at all.",
      },
      {
        heading: "Avoiding double-encoding",
        body: "Encoding an already-encoded string turns % itself into %25, producing a broken, double-encoded URL. If a decoded result still contains percent signs followed by two-digit codes, run the decode step again, or check the original source for accidental repeated encoding.",
      },
    ],
  },

  "/tools/regex-tester": {
    intro: [
      "The Regex Tester lets you write a JavaScript regular expression, apply it to a sample text, and see matches highlighted live as you type, along with any capture groups the pattern defines. It is aimed at developers writing validation rules, search-and-replace patterns or parsing logic who want fast, visual feedback rather than testing inside their actual application code.",
      "Because it uses the browser's native regex engine, results match exactly what your JavaScript code will do at runtime, including support for named capture groups, lookahead and lookbehind assertions in modern browsers. Toggle flags like global, case-insensitive and multiline to see how they change which parts of the text are matched.",
    ],
    steps: [
      "Type or paste your regular expression pattern into the pattern field.",
      "Toggle flags such as g (global), i (case-insensitive) or m (multiline) as needed.",
      "Paste your sample text into the test string area.",
      "Review the highlighted matches shown live in the text.",
      "Check the capture groups panel to see what each group captured for every match.",
      "Adjust the pattern and repeat until the matches are exactly what you need.",
    ],
    benefits: [
      {
        title: "Live match highlighting",
        body: "Matches are highlighted directly in the sample text as you edit the pattern, making it immediately obvious whether the regex is too broad, too narrow, or matching the wrong part of the string.",
      },
      {
        title: "Capture group breakdown",
        body: "Named and numbered capture groups are listed separately for each match, which is essential when a pattern is being used to extract specific pieces of data rather than just test for a match.",
      },
      {
        title: "Matches real JavaScript behaviour",
        body: "Because the tool runs the browser's actual regex engine, the results reflect exactly how the same pattern will behave in your JavaScript code, avoiding surprises from a different regex flavour.",
      },
    ],
    useCases: [
      "Building and testing a validation pattern for email addresses or phone numbers.",
      "Debugging why a regex used in a form validator is rejecting valid input.",
      "Designing a search-and-replace pattern before running it across a codebase.",
      "Extracting structured data like dates or IDs from log files using capture groups.",
      "Learning how flags such as global and multiline change matching behaviour.",
    ],
    sections: [
      {
        heading: "Regex flavour used",
        body: "This tool uses JavaScript's built-in (ECMAScript) regular expression engine, the same one used by Node.js and every modern browser. This includes support for named capture groups such as (?<year>\\d{4}), and lookahead and lookbehind assertions in current browser versions.",
      },
      {
        heading: "Understanding flags",
        body: "The g flag finds all matches instead of stopping at the first one, i makes matching case-insensitive, m changes ^ and $ to match the start and end of each line rather than the whole string, and s allows . to match newline characters. Combining flags like gi is common for global, case-insensitive searches.",
      },
      {
        heading: "Common regex mistakes",
        body: "Forgetting to escape special characters like . or ( when they should be literal is a frequent source of unexpected matches. Overly greedy quantifiers such as .* can also match far more text than intended; switching to a non-greedy .*? or a more specific character class usually narrows the match correctly.",
      },
    ],
  },

  "/tools/hash-generator": {
    intro: [
      "The Hash Generator produces MD5, SHA-1, SHA-256 and SHA-512 hashes from any text you enter, calculated instantly in your browser using the Web Crypto API. It is built for developers checking file or message integrity, generating checksums, or needing a quick hash value for testing without installing a command-line tool.",
      "Type or paste text into the input, and every supported hash algorithm updates at once, showing the resulting hex digest ready to copy. Because the computation happens locally, sensitive input text is never transmitted anywhere, which matters when hashing passwords for testing or verifying content you would rather not send to a server.",
    ],
    steps: [
      "Type or paste the text you want to hash into the input field.",
      "View the MD5, SHA-1, SHA-256 and SHA-512 hashes generated simultaneously.",
      "Click the copy icon next to the hash you need to copy it to your clipboard.",
      "Change the input text to see all hash values update instantly.",
      "Compare a generated hash against a known value to verify integrity.",
    ],
    benefits: [
      {
        title: "Multiple algorithms calculated at once",
        body: "MD5, SHA-1, SHA-256 and SHA-512 are all generated from the same input simultaneously, so you can compare formats or find the algorithm a downstream system expects without re-entering the text.",
      },
      {
        title: "Uses the browser's native crypto engine",
        body: "Hashes are computed with the Web Crypto API rather than a JavaScript-only implementation, giving results that match standard cryptographic libraries used elsewhere.",
      },
      {
        title: "Text never leaves your device",
        body: "Because hashing runs client-side, this suits checking or generating hashes for sensitive strings such as test passwords or private tokens without transmitting them over the network.",
      },
    ],
    useCases: [
      "Generating a SHA-256 checksum to verify a downloaded file was not corrupted.",
      "Creating test password hashes while developing an authentication system.",
      "Checking whether two pieces of text are identical by comparing their hashes.",
      "Producing an MD5 hash for legacy systems that still require that format.",
      "Generating a unique fingerprint value for caching or deduplication logic.",
    ],
    sections: [
      {
        heading: "Which algorithm to choose",
        body: "SHA-256 is the right default for anything security-related, including password storage design and data integrity verification. MD5 and SHA-1 are both considered cryptographically broken and should be limited to non-critical uses such as checksums for accidental corruption, not for protecting sensitive data.",
      },
      {
        heading: "Hash length and format",
        body: "MD5 produces a 32-character hexadecimal digest, SHA-1 produces 40 characters, SHA-256 produces 64, and SHA-512 produces 128. All are shown here in lowercase hexadecimal, the most common representation used by checksum files and verification tools.",
      },
      {
        heading: "Hashing versus encryption",
        body: "Hashing is one-way: there is no way to recover the original text from the hash output. This differs from encryption, which is reversible with the correct key. Hashes are suited to verification and integrity checks, not to storing information you need to read back later.",
      },
    ],
  },

  "/tools/barcode-generator": {
    intro: [
      "The Barcode Generator creates scannable barcodes in Code 128, EAN-13, UPC-A, Code 39 and other common formats, rendered directly in your browser as you type the value and choose a symbology. You can adjust bar width, height and label text, then download the result as a print-ready PNG or scalable SVG.",
      "This suits small business owners labelling products, warehouse staff creating internal tracking codes, or anyone needing a one-off barcode without buying dedicated labelling software. Because generation happens locally, there is no limit on how many barcodes you create and no data is sent anywhere in the process.",
    ],
    steps: [
      "Choose a barcode format: Code 128, EAN-13, UPC-A, Code 39 or another supported symbology.",
      "Enter the number or text value to encode, matching the digit count required by that format.",
      "Adjust bar width, height and margin settings to fit your label size.",
      "Add or edit the human-readable label text shown below the bars.",
      "Preview the barcode and check it renders without warnings.",
      "Download the barcode as a PNG for printing or an SVG for scalable use.",
    ],
    benefits: [
      {
        title: "Multiple retail and industrial formats",
        body: "EAN-13, UPC-A, Code 128 and Code 39 cover most retail and warehouse labelling needs, letting you switch symbology depending on where the barcode will be scanned rather than being locked into one format.",
      },
      {
        title: "Print-ready PNG and scalable SVG output",
        body: "PNG suits quick printing at a fixed size, while SVG scales to any size without losing sharpness, which matters when a barcode needs to appear both on a small label and a larger poster or packaging design.",
      },
      {
        title: "Unlimited local generation",
        body: "Because barcodes render entirely in the browser, there is no per-barcode cost or daily limit, making it practical to generate many codes in a row for a full product catalogue.",
      },
    ],
    useCases: [
      "Creating EAN-13 barcodes for a small retail product line.",
      "Generating Code 128 labels for internal warehouse inventory tracking.",
      "Producing a UPC-A barcode for a product sold in North American stores.",
      "Making a Code 39 barcode for an asset tag or library catalogue system.",
      "Downloading an SVG barcode to embed in packaging design software.",
    ],
    sections: [
      {
        heading: "Choosing the right barcode format",
        body: "EAN-13 is the standard for retail products sold outside North America, while UPC-A is the equivalent standard within the United States and Canada. Code 128 is a flexible, high-density format suited to internal logistics and shipping labels, and Code 39 is an older but still widely supported format used in some industrial and library systems.",
      },
      {
        heading: "Getting a barcode to scan reliably",
        body: "Print at a large enough size that individual bars stay clearly separated, avoid stretching the image unevenly, and keep the surrounding quiet zone (blank margin) intact, since many scanners rely on that space to detect where the barcode starts and ends. Testing a printed barcode with an actual scanner or phone app before mass-printing labels is good practice.",
      },
      {
        heading: "Digit and character requirements",
        body: "EAN-13 requires exactly 13 digits and UPC-A requires exactly 12, both including a checksum digit calculated automatically from the rest. Code 128 and Code 39 are more flexible, supporting letters, numbers and some symbols depending on which subset is used.",
      },
    ],
  },

  "/tools/ip-geolocation": {
    intro: [
      "IP Geolocation Lookup looks up an IP address and returns its approximate country, region, city, internet service provider, ASN and timezone. It draws on public IP geolocation databases to give a quick read on where traffic or a connection is likely coming from, without requiring any account or API key from you.",
      "Enter an IPv4 or IPv6 address, or leave it blank to check your own connection's public IP, and the results appear within moments. This is useful for network troubleshooting, checking the rough origin of suspicious traffic in server logs, or simply confirming what location and ISP a given address reports.",
    ],
    steps: [
      "Enter the IPv4 or IPv6 address you want to look up, or leave the field blank to check your own IP.",
      "Click Lookup to query the geolocation data.",
      "Review the returned country, region, city and postal area.",
      "Check the listed ISP name and ASN (autonomous system number).",
      "Note the timezone shown for the address's reported location.",
    ],
    benefits: [
      {
        title: "Combines location and network details",
        body: "Alongside the approximate geographic location, the ISP name and ASN are shown together, giving a more complete picture of who owns and operates the address, not just where it is.",
      },
      {
        title: "No account or API key needed",
        body: "You can look up an address immediately without registering for an API key or signing into a service, which suits quick, one-off checks during troubleshooting.",
      },
      {
        title: "Works for your own connection too",
        body: "Leaving the address field blank checks your own outward-facing IP, giving a fast answer to \"what is my IP\" alongside the same location and ISP detail shown for any other address.",
      },
    ],
    useCases: [
      "Checking the rough origin of a suspicious login attempt in a server log.",
      "Verifying which ISP and region a customer's reported IP address belongs to.",
      "Confirming your own public IP and its detected location before configuring a VPN.",
      "Investigating whether traffic is coming from an expected country for a geofenced service.",
      "Looking up the ASN of an address as part of network abuse reporting.",
    ],
    sections: [
      {
        heading: "How accurate is IP geolocation",
        body: "Country-level accuracy is generally strong, around 95-99%, because IP address blocks are allocated to internet providers on a country basis. City-level accuracy is much lower, typically 55-80%, and can be significantly off for mobile connections, VPNs or addresses that have been reassigned since the geolocation database was last updated.",
      },
      {
        heading: "Why an IP does not reveal an exact street address",
        body: "Geolocation databases map IP ranges to the location of the ISP's infrastructure or a regional distribution point, not the individual customer's home. This is why results often show a city centre or ISP hub rather than someone's precise address, and why accuracy drops further outside major population centres.",
      },
      {
        heading: "IPv4 versus IPv6 lookups",
        body: "Both address formats are supported. IPv6 geolocation data can be less complete than IPv4 in some regions simply because IPv6 adoption and the associated geolocation mapping are still catching up in parts of the world, so results for an IPv6 address may be less precise.",
      },
    ],
  },

  "/tools/resume-builder": {
    intro: [
      "The Resume Builder creates an ATS-friendly resume using recruiter-tested templates, guiding you through contact details, work experience, education and skills with prompts for writing achievement-focused bullet points rather than vague duty descriptions. It is built for job seekers who want a clean, professional CV without wrestling with word processor formatting.",
      "Everything is filled in and previewed directly in the browser, and the finished resume exports as a high-resolution PDF ready to submit to job applications or upload to a company portal. Because the layout uses standard section headings and a single-column structure, the result is designed to parse correctly through applicant tracking systems as well as look good to a human reviewer.",
    ],
    steps: [
      "Choose a resume template from the available ATS-friendly designs.",
      "Fill in your contact details, summary, and target job title.",
      "Add work experience entries with company, role, dates and achievement-focused bullet points.",
      "Add your education, certifications and skills sections.",
      "Preview the formatted resume and check it fits the intended page length.",
      "Export the finished resume as a high-resolution PDF.",
    ],
    benefits: [
      {
        title: "ATS-friendly structure by design",
        body: "The templates use a single-column layout with standard section headings such as Experience, Education and Skills, which applicant tracking systems can reliably parse, reducing the risk of a well-written resume being misread or rejected by automated screening.",
      },
      {
        title: "Achievement-focused bullet guidance",
        body: "Rather than leaving you to write generic duty statements, the builder prompts for specific, results-oriented bullet points, which recruiters generally respond to better than a plain list of responsibilities.",
      },
      {
        title: "High-resolution PDF export",
        body: "The final resume downloads as a sharp, high-resolution PDF suitable for both digital application portals and printing, keeping fonts and layout consistent regardless of which device opens it.",
      },
    ],
    useCases: [
      "Building a first resume for a new graduate entering the job market.",
      "Rewriting an outdated CV to pass through modern applicant tracking systems.",
      "Creating a tailored resume version for a specific job application.",
      "Producing a clean, print-ready resume for an in-person job fair.",
      "Updating an existing resume with new roles and achievements before a job search.",
    ],
    sections: [
      {
        heading: "What makes a resume ATS-friendly",
        body: "A single-column layout with standard section headings, no text boxes, tables or graphics that confuse a parser, and a plain, readable font all help an applicant tracking system extract your details correctly. Avoiding headers and footers for critical information, such as contact details, also matters, since some systems ignore those areas entirely.",
      },
      {
        heading: "Writing achievement-focused bullet points",
        body: "Instead of \"Responsible for managing a sales team,\" a stronger bullet reads \"Led a six-person sales team to a 30% increase in quarterly revenue.\" Quantifying outcomes with numbers, percentages or timeframes wherever possible gives recruiters a clearer sense of real impact than a duty description alone.",
      },
      {
        heading: "Choosing a template and length",
        body: "One page suits early-career applicants with limited experience, while two pages are generally acceptable for candidates with ten or more years of relevant history. Pick a template with clear section breaks and consistent spacing, since a cluttered layout can undermine even strong content.",
      },
    ],
  },

  "/tools/discount-calculator": {
    intro: [
      "The Discount & Sales Tax Calculator works out the sale price of an item, how much you save, and the final total once VAT, GST or sales tax is applied, all updating instantly as you type. It handles both a simple percentage-off discount and the tax added afterwards, which is exactly the two-step maths involved in most real purchases.",
      "Because the calculator works with any currency symbol and any tax rate, it suits shoppers comparing sale prices, and small businesses working out pricing that includes local tax rules. Enter the original price, discount percentage and tax rate, and every figure — savings, discounted price and final total — appears together.",
    ],
    steps: [
      "Enter the original price of the item.",
      "Enter the discount percentage being offered.",
      "Enter the applicable sales tax, VAT or GST rate for your region.",
      "Review the calculated discount amount and the price after the discount.",
      "Check the final total once tax has been added to the discounted price.",
      "Adjust any field to see all figures recalculate instantly.",
    ],
    benefits: [
      {
        title: "Discount and tax combined in one calculation",
        body: "Most real-world purchases involve both a percentage discount and tax added afterwards; calculating each figure together avoids the common mistake of applying tax to the original price instead of the discounted one.",
      },
      {
        title: "Works with any currency or tax rate",
        body: "There is no fixed currency or region built in, so the calculator applies equally to VAT in the UK and EU, GST in countries that use it, or general sales tax elsewhere, using whatever rate you enter.",
      },
      {
        title: "Instant recalculation for comparison shopping",
        body: "Changing the discount percentage or tax rate updates every figure immediately, making it quick to compare two competing sale offers or check whether an advertised saving is accurate.",
      },
    ],
    useCases: [
      "Checking whether an advertised sale discount is calculated correctly before buying.",
      "Working out the final price of an item including local sales tax after a discount.",
      "Comparing two stores' discount percentages to see which gives the better final price.",
      "Calculating VAT-inclusive pricing for a small business's discounted product line.",
      "Estimating total spend on a shopping list where multiple items have different discounts.",
    ],
    sections: [
      {
        heading: "Calculating a percentage discount",
        body: "Multiply the original price by the discount percentage and divide by 100 to get the amount saved, then subtract that from the original price to get the discounted price. A £50 item with a 20% discount saves £10, bringing the price to £40 before any tax is added.",
      },
      {
        heading: "Applying tax after a discount",
        body: "Sales tax, VAT or GST should generally be calculated on the discounted price, not the original price, since that is the amount actually being charged. Applying tax to the pre-discount price would overstate the final total compared with what most retailers actually charge at checkout.",
      },
      {
        heading: "VAT, GST and sales tax differences",
        body: "VAT (used in the UK and EU) and GST (used in countries like Australia and Canada) are typically included in the displayed shelf price, while US-style sales tax is usually added at checkout on top of the shown price. This calculator handles both approaches depending on how you interpret the entered original price.",
      },
    ],
  },

  "/tools/random-picker": {
    intro: [
      "The Random Name Picker draws a random winner or a shuffled order from a list of names, and can also generate random numbers within a chosen range, all using the browser's cryptographically secure random number generator rather than a predictable pseudo-random seed. It suits giveaways, raffles, classroom selections and team assignments where a genuinely fair draw matters.",
      "Paste in a list of names, one per line, choose how many winners to pick, and the tool selects them instantly with no server involved in the draw. Because everything runs locally, you can run the selection live in front of an audience and trust that the result was not influenced ahead of time.",
    ],
    steps: [
      "Paste your list of names or entries, one per line, into the input box.",
      "Choose how many winners or random picks you want drawn.",
      "Click Draw or Shuffle to run the random selection.",
      "Review the winner or shuffled list shown in the results panel.",
      "Optionally remove already-picked names before running another draw for multiple prizes.",
    ],
    benefits: [
      {
        title: "Cryptographically secure randomness",
        body: "The draw uses the browser's crypto.getRandomValues function rather than a simple pseudo-random generator, which produces results that cannot be predicted or reverse-engineered from a known seed.",
      },
      {
        title: "Handles both single winners and full shuffles",
        body: "You can draw one or several winners for a giveaway, or shuffle an entire list into a new random order, covering raffle draws, seeding a tournament bracket, or assigning random teams.",
      },
      {
        title: "Runs entirely in the browser for live draws",
        body: "Because no server call is needed to produce a result, the draw can be run live on screen in front of participants, with the outcome generated at the moment the button is clicked.",
      },
    ],
    useCases: [
      "Picking a winner for a social media giveaway from a list of entrants.",
      "Running a raffle draw live during an event or meeting.",
      "Randomly assigning students or employees into teams.",
      "Shuffling a list of names into a random presentation or speaking order.",
      "Generating a random number for a game, lottery number check, or decision.",
    ],
    sections: [
      {
        heading: "How genuinely random is the draw",
        body: "The tool uses the Web Crypto API's crypto.getRandomValues method, which produces cryptographically strong random values, rather than Math.random, which is a faster but more predictable pseudo-random generator not intended for anything requiring fairness guarantees. This makes the draw suitable for competitions where participants expect a genuinely fair, unpredictable outcome.",
      },
      {
        heading: "Formatting your name list",
        body: "Enter one name or entry per line in the input box; blank lines are ignored. Duplicate names are treated as separate entries unless you remove duplicates yourself, so a name listed twice has double the chance of being drawn, which is worth checking before running a fairness-sensitive draw.",
      },
      {
        heading: "Picking multiple winners without repeats",
        body: "When drawing several winners at once, the tool selects distinct entries so the same name cannot win twice in a single draw. If you are running separate draws for different prizes, remove previous winners from the list first if repeat wins should not be allowed.",
      },
    ],
  },

  "/tools/grayscale-pdf": {
    intro: [
      "Grayscale PDF converts a colour PDF into grayscale, pure black and white, or an inverted dark-mode version, processing every page directly in your browser. It is aimed at anyone who needs to print a document without using colour ink, or who wants scanned pages to look cleaner and more consistent for reading or archiving.",
      "You choose the conversion mode — full grayscale tones, high-contrast black and white, or colour inversion — and the tool rewrites the PDF's pages accordingly before letting you download the result. Because the file never leaves your device, this works just as well for confidential documents as for everyday printing tasks.",
    ],
    steps: [
      "Upload the colour PDF you want to convert.",
      "Choose a conversion mode: grayscale, pure black and white, or inverted colours.",
      "Preview a sample page to check the tone and contrast look right.",
      "Adjust the mode if the result is too light, too dark, or loses important detail.",
      "Click Convert to process every page in the document.",
      "Download the converted grayscale, black-and-white or inverted PDF.",
    ],
    benefits: [
      {
        title: "Three distinct conversion modes",
        body: "Full grayscale keeps tonal gradients for photos and shaded diagrams, pure black and white gives high-contrast text ideal for photocopying, and inversion creates a dark-mode style document for comfortable screen reading.",
      },
      {
        title: "Cheaper, cleaner printing",
        body: "Grayscale files print without using colour ink cartridges, which saves money on high-volume printing and is often required for coursework, legal filings or internal document standards.",
      },
      {
        title: "Improves messy scanned documents",
        body: "Converting a scanned PDF to black and white or grayscale can even out uneven lighting and background discolouration from the original scan, making faint or patchy text noticeably easier to read.",
      },
    ],
    useCases: [
      "Preparing a colour report for black-and-white office printing to save ink.",
      "Cleaning up a poorly scanned document with uneven background shading.",
      "Meeting a university or legal submission requirement for grayscale-only PDFs.",
      "Creating a dark-mode version of a PDF for comfortable night-time reading.",
      "Reducing file size slightly by removing colour data from image-heavy pages.",
    ],
    sections: [
      {
        heading: "Grayscale versus pure black and white",
        body: "Grayscale conversion keeps a full range of grey tones, preserving shading in photos, charts and gradients so they still look natural. Pure black-and-white conversion pushes every pixel to either fully black or fully white based on a brightness threshold, which suits text-heavy pages and photocopied-style documents but can lose detail in photographs.",
      },
      {
        heading: "What colour inversion does",
        body: "Inversion flips light and dark, turning a white background with black text into a dark background with light text, similar to a dark-mode reading view. It works best on text-focused documents; heavily coloured images can look unnatural once inverted since their original hues are also flipped.",
      },
      {
        heading: "Quality and file size considerations",
        body: "Converting to grayscale or black and white can modestly reduce file size on image-heavy PDFs by simplifying colour data, though the effect on text-based documents is usually small. The conversion is visual only, so any text layer remains selectable and searchable exactly as before.",
      },
    ],
  },

  "/tools/extract-pdf-pages": {
    intro: [
      "Extract PDF Pages pulls specific pages out of a larger document and saves them into a single new PDF, using a page range syntax like 1-3, 7 to specify exactly which pages you want kept. It is the more direct option when you know precisely which handful of pages matter and just need them saved together, rather than dividing a whole document into multiple files.",
      "The extraction happens entirely in the browser: the original PDF is parsed, the selected pages are copied into a new document, and the file is ready to download in moments. This keeps sensitive documents such as contracts, reports or scanned records private throughout the process, since nothing is uploaded to a server to complete the extraction.",
    ],
    steps: [
      "Upload the PDF containing the pages you want to keep.",
      "View the page thumbnails to identify the pages you need.",
      "Enter a page range such as 1-3, 7 in the selection field, or click individual thumbnails to select them.",
      "Confirm the selected pages are highlighted correctly in the preview.",
      "Click Extract to build the new PDF from just those pages.",
      "Download the resulting single-file PDF.",
    ],
    benefits: [
      {
        title: "One clean output file",
        body: "All the pages you select are combined into a single new PDF in the order you specify, rather than being split into several separate files, which suits cases where you just need one trimmed-down document.",
      },
      {
        title: "Visual thumbnail selection",
        body: "Page thumbnails let you confirm visually which pages are being kept before extracting, reducing the risk of accidentally saving the wrong pages from a long or unfamiliar document.",
      },
      {
        title: "Private, local processing",
        body: "Because extraction runs in the browser rather than on a server, confidential contracts, statements or personal records stay on your device throughout the process.",
      },
    ],
    useCases: [
      "Pulling out just the signature page and terms section from a long contract.",
      "Saving a single relevant chapter from a large scanned textbook.",
      "Extracting an appendix or exhibit referenced in a legal filing.",
      "Keeping only the pages relevant to your department from a company-wide report.",
      "Creating a short excerpt of a PDF to share instead of the whole document.",
    ],
    sections: [
      {
        heading: "Extracting versus splitting",
        body: "Extracting keeps only the pages you list and combines them into one new PDF, discarding everything else. Splitting, by contrast, breaks the entire original document into multiple separate files, which is the better choice if you need every page preserved across several outputs rather than a single trimmed-down file.",
      },
      {
        heading: "Page range syntax",
        body: "Ranges accept individual page numbers and hyphenated spans combined, so 1-3, 7, 10-12 keeps pages one to three, page seven, and pages ten to twelve, in that order. Page numbers correspond to their position in the uploaded file, not any printed page numbers that may appear on the pages themselves.",
      },
      {
        heading: "Working with large or scanned PDFs",
        body: "Documents with many high-resolution scanned pages can take longer to load thumbnails and process the extraction than a typical text PDF, since more image data has to be handled in the browser's memory. Extracting fewer pages at a time can help if a very large scanned file feels slow to work with.",
      },
    ],
  },

  "/tools/pdf-header-footer": {
    intro: [
      "PDF Header & Footer stamps custom text onto every page of a PDF, supporting automatic page numbers, totals and dates through placeholders so you do not have to type a different number on every single page. It suits reports, contracts and printed handouts that need consistent headers such as a document title or footers showing page X of Y.",
      "You set the header and footer text once, choose font size, position and any placeholders needed, and the tool applies it consistently across the whole document directly in your browser. Because there is no upload step, this works for confidential documents just as well as for general-purpose paperwork, and the result is ready to download as soon as processing finishes.",
    ],
    steps: [
      "Upload the PDF you want to stamp with a header or footer.",
      "Type the header text, footer text, or both, into the input fields.",
      "Insert placeholders such as {page} and {total} where automatic numbering should appear.",
      "Adjust font size, alignment and margin position for the header or footer.",
      "Preview a sample page to confirm the placement looks correct.",
      "Click Apply and download the stamped PDF.",
    ],
    benefits: [
      {
        title: "Automatic page numbering placeholders",
        body: "Using {page} and {total} placeholders, such as \"Page {page} of {total},\" the tool fills in the correct number for every page automatically, avoiding manual retyping across a long document.",
      },
      {
        title: "Header and footer applied consistently",
        body: "The same text, formatting and position are applied to every page in one pass, ensuring a uniform look throughout the document rather than page-by-page manual editing.",
      },
      {
        title: "Works on documents you already have as PDF",
        body: "There is no need to go back to the original Word or design file to add headers and footers; the stamping is applied directly to the finished PDF.",
      },
    ],
    useCases: [
      "Adding a document title header and page numbers to a finished report.",
      "Stamping a confidentiality footer across every page of a contract.",
      "Adding a date and \"Page X of Y\" footer to printed meeting handouts.",
      "Branding a shared PDF with a company name in the header before distribution.",
      "Adding page numbers to a scanned document that lacked them originally.",
    ],
    sections: [
      {
        heading: "Using page number placeholders",
        body: "The {page} placeholder inserts the current page number and {total} inserts the total page count, so text like \"Page {page} of {total}\" automatically becomes \"Page 1 of 12,\" \"Page 2 of 12\" and so on throughout the document without any manual entry.",
      },
      {
        heading: "Formatting and placement options",
        body: "Header and footer text can be aligned left, centre or right, and font size and margin distance from the page edge can be adjusted to avoid overlapping existing content. Checking a preview page before applying to the full document helps catch placement issues on documents with unusual page margins.",
      },
      {
        heading: "Applying to existing headers or footers",
        body: "If the PDF already has its own header or footer content from the original source document, the new text is stamped on top rather than replacing it, so it is worth checking a sample page for overlap and adjusting the vertical position if needed before processing the whole file.",
      },
    ],
  },

  "/tools/pregnancy-due-date-calculator": {
    intro: [
      "The Pregnancy Due Date Calculator estimates your baby's due date, current pregnancy week and trimester boundaries based on the first day of your last menstrual period and your typical cycle length. It uses Naegele's rule, the standard clinical method for estimating a due date from LMP, and adjusts for cycle lengths that are shorter or longer than the typical 28 days.",
      "Enter your last period date and cycle length, and the calculator instantly returns the estimated due date, how many weeks and days pregnant you currently are, and the approximate dates each trimester begins. Everything is calculated locally in the browser, with nothing entered stored or transmitted, which matters for such personal information.",
    ],
    steps: [
      "Enter the first day of your last menstrual period (LMP).",
      "Enter your typical menstrual cycle length in days, if different from the default 28.",
      "Review the estimated due date shown by the calculator.",
      "Check how many weeks and days pregnant you currently are.",
      "Review the estimated start dates for each trimester.",
    ],
    benefits: [
      {
        title: "Standard clinical calculation method",
        body: "The estimate is based on Naegele's rule, the same method commonly used by midwives and doctors as a starting point for due dates, giving a familiar and comparable result to what you may be told at an appointment.",
      },
      {
        title: "Adjusts for your actual cycle length",
        body: "Rather than assuming everyone has a standard 28-day cycle, the calculator lets you enter your own typical cycle length, which shifts the estimated ovulation and due date to better reflect your situation.",
      },
      {
        title: "Private by design",
        body: "Because the calculation runs entirely in the browser, no personal dates or pregnancy information are sent to or stored on any server.",
      },
    ],
    useCases: [
      "Getting a quick early estimate of a due date after a positive pregnancy test.",
      "Checking how many weeks pregnant you are before an upcoming appointment.",
      "Working out roughly when each trimester will begin for planning purposes.",
      "Comparing an LMP-based due date estimate against one given by a scan.",
      "Estimating an approximate conception date range from a known last period.",
    ],
    sections: [
      {
        heading: "How Naegele's rule works",
        body: "Naegele's rule adds 280 days (40 weeks) to the first day of the last menstrual period to estimate the due date, then adjusts slightly if your cycle length differs from the standard 28 days, since ovulation timing shifts with cycle length. This is the same starting-point method most clinicians use before an ultrasound offers a more precise estimate.",
      },
      {
        heading: "Why due dates are estimates, not guarantees",
        body: "Only a small percentage of babies are born on their exact calculated due date; most arrive within a window of a couple of weeks either side. An early dating scan, which measures the foetus directly, is generally considered more accurate than an LMP-based calculation alone, particularly for people with irregular cycles.",
      },
      {
        heading: "Trimester boundaries explained",
        body: "Pregnancy is commonly divided into three trimesters: roughly weeks 1-13, weeks 14-27, and week 28 to birth. These boundaries are approximate guides used for describing typical development stages and are not fixed medical thresholds that change at an exact day.",
      },
    ],
  },

  "/tools/pdf-to-csv": {
    intro: [
      "PDF to CSV extracts tabular data from a PDF, such as a bank statement or invoice, and converts it into a clean CSV spreadsheet file that opens directly in Excel, Google Sheets or any data analysis tool. Column detection works by measuring the horizontal spacing between text on each line, identifying where consistent gaps mark the boundary between columns.",
      "Because parsing happens entirely in the browser, financial documents like bank statements never have to be uploaded to a server to have their tables extracted. This makes the tool a practical way to turn a PDF-only statement or invoice into structured, sortable, filterable data without manually retyping every row by hand.",
    ],
    steps: [
      "Upload the PDF containing the table you want to extract, such as a statement or invoice.",
      "Wait while the tool detects rows and column boundaries from the text layout.",
      "Review the extracted table preview to check columns have split correctly.",
      "Adjust column boundaries manually if any rows have merged or split incorrectly.",
      "Click Export or Download to save the result as a CSV file.",
      "Open the CSV in a spreadsheet application to verify and continue working with the data.",
    ],
    benefits: [
      {
        title: "Works from text layout, not guesswork",
        body: "Column boundaries are detected by measuring actual horizontal gaps between text runs on each line, which reliably identifies table structure in documents like statements and invoices that use consistent spacing.",
      },
      {
        title: "Keeps financial documents private",
        body: "Bank statements and invoices are parsed locally in the browser, so sensitive financial data never has to be uploaded to a third-party server to be converted into a spreadsheet.",
      },
      {
        title: "Saves manual data entry",
        body: "Extracting a table automatically avoids retyping every row from a PDF by hand, which is both slow and prone to transcription errors on documents with many rows.",
      },
    ],
    useCases: [
      "Converting a bank statement PDF into a CSV for budgeting or accounting software.",
      "Extracting invoice line items into a spreadsheet for record-keeping.",
      "Turning a PDF price list or product table into sortable, filterable data.",
      "Pulling attendance or grade tables out of a PDF report for analysis.",
      "Preparing PDF-only exported reports for import into a database.",
    ],
    sections: [
      {
        heading: "How column detection works",
        body: "The tool measures the horizontal gaps between text runs on each line of the PDF and treats consistent, repeated gaps as column boundaries. This approach works well for tables with clear spacing, such as bank statements and structured invoices, but can struggle with tables that use very tight spacing or unusually merged cells.",
      },
      {
        heading: "When extraction may need manual correction",
        body: "Tables with merged cells, multi-line entries within a single row, or inconsistent spacing between columns can occasionally cause rows to split incorrectly. Reviewing the preview before exporting and adjusting boundaries where needed helps ensure the final CSV lines up correctly with the source document.",
      },
      {
        heading: "PDF to CSV versus PDF to Word",
        body: "This tool is built specifically for structured tabular data destined for a spreadsheet, whereas PDF to Word is aimed at reconstructing prose paragraphs and headings for a document editor. Choosing the right tool for the content type gives a cleaner result than trying to force a table into a Word conversion, or paragraphs into a CSV.",
      },
    ],
  },

  "/tools/rotate-pdf": {
    intro: [
      "Rotate PDF fixes pages that were scanned or saved sideways or upside down, rotating them 90, 180 or 270 degrees and writing the new orientation permanently into the file. You can rotate the entire document at once or target individual pages, which is useful when only a few pages in an otherwise correctly oriented PDF came out wrong from a scanner.",
      "The rotation is applied directly in the browser using the PDF's own page rotation data, so the change is saved into the file itself rather than being a temporary viewer setting. This means the pages will appear the right way up in any PDF reader afterwards, not just in this tool's own preview.",
    ],
    steps: [
      "Upload the PDF containing pages that need to be rotated.",
      "Select the whole document or individual pages that need fixing.",
      "Choose the rotation angle: 90, 180 or 270 degrees.",
      "Preview the thumbnails to confirm the pages are now facing the right way.",
      "Click Save or Apply to write the new rotation into the document.",
      "Download the corrected PDF.",
    ],
    benefits: [
      {
        title: "Rotation is saved permanently into the file",
        body: "The change is written into the PDF's page data itself, so the corrected orientation shows up the right way up in every PDF reader afterwards, not just as a temporary view setting in this tool.",
      },
      {
        title: "Per-page control for mixed-orientation scans",
        body: "Individual pages can be selected and rotated separately, which handles the common case of a scanned document where only a few pages came out sideways while the rest scanned correctly.",
      },
      {
        title: "No re-scanning needed",
        body: "Fixing orientation digitally avoids having to physically re-scan pages that came out the wrong way round, saving time on documents that would otherwise need to go back through a scanner.",
      },
    ],
    useCases: [
      "Fixing a scanned document where a few pages came out sideways.",
      "Correcting an entire PDF that was saved upside down by mistake.",
      "Rotating a landscape-oriented spreadsheet export to match the rest of a report.",
      "Fixing photo-based PDF pages captured with a phone camera at the wrong angle.",
      "Standardising the orientation of pages combined from multiple source documents.",
    ],
    sections: [
      {
        heading: "Rotating individual pages versus the whole document",
        body: "If only specific pages are affected, selecting them individually and applying rotation avoids disturbing the pages that are already correctly oriented. Rotating the whole document is faster when every page needs the same correction, such as an entire file that was scanned upside down.",
      },
      {
        heading: "Why rotation needs to be saved, not just viewed",
        body: "Many PDF viewers let you temporarily rotate the on-screen view without changing the underlying file, which means the pages revert to their original orientation the next time the file is opened elsewhere. This tool writes the rotation into the PDF's page rotation property itself, so the fix persists across any reader or device.",
      },
      {
        heading: "Rotation angles available",
        body: "Pages can be rotated 90 degrees clockwise, 180 degrees for a full upside-down fix, or 270 degrees (90 degrees counter-clockwise). Applying the wrong angle can be corrected by simply rotating again by the remaining amount needed to reach the correct orientation.",
      },
    ],
  },

  "/tools/text-to-word": {
    intro: [
      "Text to Word converts plain text, either pasted directly or uploaded as a .txt file, into a properly formatted Microsoft Word .docx document with real paragraphs and standard page margins. It is aimed at anyone who has content sitting in a plain text file or a text editor and needs it in a genuine Word format for sharing, editing or submission.",
      "The conversion builds an actual Office Open XML document in the browser, so the result opens correctly in Word, Google Docs, LibreOffice and Pages rather than being a renamed text file. This is a quick way to turn notes, drafts or exported text content into a document that behaves like something written in Word from the start.",
    ],
    steps: [
      "Paste your plain text directly into the input box, or upload a .txt file.",
      "Review the text as it will appear, checking paragraph breaks look correct.",
      "Adjust any formatting options offered, such as page margins, if available.",
      "Click Convert to build the Word document.",
      "Download the resulting .docx file.",
      "Open it in Word, Google Docs or LibreOffice to continue editing.",
    ],
    benefits: [
      {
        title: "Produces a genuine .docx file",
        body: "The output is a real Office Open XML document built with Word's own document format, not a plain text file with a .docx extension, so it opens and behaves exactly like a document created directly in Word.",
      },
      {
        title: "Preserves paragraph structure",
        body: "Line and paragraph breaks in the original text are carried over into proper Word paragraphs, keeping the document's structure intact rather than collapsing everything into one continuous block.",
      },
      {
        title: "Works from pasted text or a file upload",
        body: "You can either paste text directly or upload an existing .txt file, covering both quick one-off conversions and turning an already-saved text file into a shareable Word document.",
      },
    ],
    useCases: [
      "Converting exported notes from a text editor into a Word document for editing.",
      "Turning a plain-text draft into a properly formatted document to submit.",
      "Converting a .txt export from another application into a shareable .docx.",
      "Preparing plain text content for a template that requires a Word file format.",
      "Creating a Word version of a README or documentation file for non-technical readers.",
    ],
    sections: [
      {
        heading: "Why the output is a genuine Word file",
        body: "The tool builds the actual XML structure that makes up a .docx file, including the document body, paragraph definitions and page margin settings, rather than simply renaming a text file. This is why it opens and edits normally in Word, Google Docs, LibreOffice and Pages without any compatibility warning.",
      },
      {
        heading: "Why Word might open a file as read-only",
        body: "If a downloaded document opens in a protected or read-only view, this is typically due to the operating system marking downloaded files as coming from the internet, a standard Windows security behaviour rather than an issue with the file itself. Selecting Enable Editing in Word's notification bar removes the restriction.",
      },
      {
        heading: "Formatting limits to be aware of",
        body: "Because the source is plain text, there is no bold, italic, font or colour information to carry over, so the result is a clean, unstyled document with standard paragraph breaks and margins. Any rich formatting needed afterwards, such as headings or emphasis, would need to be added manually once the file is open in Word.",
      },
    ],
  },
};
