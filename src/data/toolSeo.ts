// Per-tool SEO catalog for Klipza.
// Every entry powers a unique <title>, meta description, keyword set and
// FAQPage / SoftwareApplication / BreadcrumbList JSON-LD block for that route.

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolSeoEntry {
  /** Route path, e.g. /tools/merge-pdf */
  path: string;
  /** Human tool name used in schema + breadcrumbs */
  name: string;
  /** Category shown in breadcrumbs */
  category: string;
  /** <title> — keep under ~60 chars where possible */
  title: string;
  /** meta description — under 160 chars */
  description: string;
  /** comma separated keyword set */
  keywords: string;
  /** tool specific FAQs (generic ones are appended automatically) */
  faqs: ToolFaq[];
}

const IMAGE = "Image Tools";
const PDF = "PDF Tools";
const CALC = "Calculators";
const TEXT = "Text Tools";
const UTIL = "Utility Tools";

export const toolSeoEntries: ToolSeoEntry[] = [
  /* ---------------------------------------------------------------- IMAGE */
  {
    path: "/tools/image-compressor",
    name: "Image Compressor",
    category: IMAGE,
    title: "Free Image Compressor — Reduce JPG & PNG Size Online",
    description:
      "Compress JPG, PNG, WebP and GIF images up to 80% smaller without visible quality loss. Batch compression runs in your browser — no upload, no signup.",
    keywords:
      "image compressor, compress jpg online, reduce image size, png compressor, compress photo without losing quality, bulk image compression, image compressor to 100kb, compress image to 50kb online, reduce jpg file size in kb, compress png without losing quality free",
    faqs: [
      {
        q: "How much can I compress an image without losing quality?",
        a: "Most photos shrink by 60–80% at a quality setting of 70–80 with no visible difference on screen. Use the live preview and the before/after size readout to pick the smallest file that still looks sharp.",
      },
      {
        q: "Which image formats can I compress?",
        a: "JPG/JPEG, PNG, WebP and GIF are supported. For photographs JPG or WebP gives the smallest files; for logos and screenshots with flat colour, PNG or WebP keeps edges crisp.",
      },
    ],
  },
  {
    path: "/tools/image-resizer",
    name: "Image Resizer",
    category: IMAGE,
    title: "Image Resizer — Resize Photos by Pixels or Percent",
    description:
      "Resize images online to exact pixel dimensions or a percentage, with aspect-ratio lock and social-media presets. Fast, private and completely free.",
    keywords:
      "image resizer, resize image online, change image dimensions, resize photo pixels, social media image size, bulk image resize, resize image to passport size online, resize image in cm online, resize image to 4x6 inches, change photo size in kb online",
    faqs: [
      {
        q: "Will resizing make my image blurry?",
        a: "Scaling down stays sharp. Scaling far above the original resolution always softens detail, so upscale by no more than about 200% — or use the Image Enhancer for a cleaner result.",
      },
      {
        q: "How do I keep the original proportions?",
        a: "Leave the aspect-ratio lock enabled and type only the width or only the height; the other value is calculated automatically so the photo never looks stretched.",
      },
    ],
  },
  {
    path: "/tools/image-enhancer",
    name: "Image Enhancer",
    category: IMAGE,
    title: "Image Enhancer — Sharpen & Brighten Photos Online",
    description:
      "Enhance photo quality online: adjust sharpness, brightness, contrast and saturation with a live preview, then export a high-quality image in one click.",
    keywords:
      "image enhancer, photo quality improver, sharpen image online, brighten photo, increase image clarity, fix blurry picture, enhance blurry photo online free, increase image quality online free, sharpen low resolution image online",
    faqs: [
      {
        q: "Can this fix a very blurry photo?",
        a: "Sharpening recovers soft focus and light motion blur by boosting edge contrast. Detail that was never captured by the camera cannot be invented, so heavily blurred shots improve only partially.",
      },
      {
        q: "What settings work best for most photos?",
        a: "Start with a small sharpness boost, +5 to +10 contrast and a slight saturation lift. Compare against the original preview and stop before halos appear around edges.",
      },
    ],
  },
  {
    path: "/tools/image-crop-tool",
    name: "Image Crop Tool",
    category: IMAGE,
    title: "Crop Image Online — Free Photo Cropper with Ratios",
    description:
      "Crop photos online with drag handles and fixed ratios (1:1, 4:3, 16:9, passport). Trim, straighten and export instantly in your browser.",
    keywords:
      "crop image online, photo cropper, crop picture free, square crop, 16:9 crop tool, trim image, crop image to circle online free, crop photo to 1x1 ratio online, crop image without losing quality online",
    faqs: [
      {
        q: "Which crop ratio should I use for social media?",
        a: "Use 1:1 for Instagram feed posts and profile pictures, 4:5 for portrait feed posts, 9:16 for stories and reels, and 16:9 for YouTube thumbnails or website banners.",
      },
      {
        q: "Does cropping reduce image quality?",
        a: "No. Cropping removes pixels outside the selection but never re-compresses the pixels you keep, so the remaining area is exactly as sharp as the original.",
      },
    ],
  },
  {
    path: "/tools/jpg-to-pdf",
    name: "JPG to PDF Converter",
    category: IMAGE,
    title: "JPG to PDF Converter — Combine Photos into One PDF",
    description:
      "Convert JPG and PNG images to PDF online. Drag to reorder pages, choose page size and margins, and merge many photos into a single clean PDF file.",
    keywords:
      "jpg to pdf, convert image to pdf, photo to pdf converter, png to pdf, combine jpg into pdf, images to pdf online, convert multiple jpg to one pdf online, jpg to pdf converter free no watermark, photo to pdf converter online free",
    faqs: [
      {
        q: "Can I put several photos into one PDF?",
        a: "Yes. Add all your images, drag the thumbnails into the order you want, and the export creates a single multi-page PDF with one photo per page.",
      },
      {
        q: "How do I keep the PDF file small?",
        a: "Compress the images first with the Image Compressor, or pick a lower export quality. A 300 KB photo per page keeps a 20-page PDF comfortably under 10 MB for email.",
      },
    ],
  },
  {
    path: "/tools/svg-to-jpg",
    name: "SVG to JPG Converter",
    category: IMAGE,
    title: "SVG to JPG Converter — Rasterise Vectors Online Free",
    description:
      "Convert SVG vector files to high-resolution JPG or PNG. Pick output width, background colour and quality — rendering happens locally in your browser.",
    keywords:
      "svg to jpg, convert svg to png, svg converter online, rasterize svg, export svg as image, vector to jpg, svg to jpg converter high resolution, convert svg to jpg with transparent background, svg to jpg online free no signup",
    faqs: [
      {
        q: "What resolution should I export an SVG at?",
        a: "Vectors are resolution independent, so choose the size you need: 1200 px wide for web images, 2400 px or more for print. Larger exports stay perfectly sharp.",
      },
      {
        q: "Why is my SVG transparent area black or white?",
        a: "JPG has no transparency channel, so transparent pixels are filled with the background colour you select. Export to PNG instead if you need to keep transparency.",
      },
    ],
  },
  {
    path: "/tools/passport-photo-maker",
    name: "Passport Photo Maker",
    category: IMAGE,
    title: "Passport Photo Maker — Official Size ID Photos Online",
    description:
      "Create passport and visa photos online in official sizes (35x45mm, 2x2in and more) with correct head positioning, white background and print-ready sheets.",
    keywords:
      "passport photo maker, passport size photo online, visa photo tool, id photo generator, 2x2 passport photo, 35x45mm photo, passport size photo maker online free, 2x2 passport photo online, visa photo size converter online",
    faqs: [
      {
        q: "What size should a passport photo be?",
        a: "Most countries use 35x45 mm; the United States, India visa and several others use 2x2 inches (51x51 mm). Pick your country preset and the crop guides adjust automatically.",
      },
      {
        q: "Can I print several copies on one sheet?",
        a: "Yes. Export the 4x6 inch print sheet layout to get multiple correctly spaced copies you can print at home or at any photo lab and cut apart.",
      },
    ],
  },
  {
    path: "/tools/image-to-url",
    name: "Image to URL Converter",
    category: IMAGE,
    title: "Image to URL — Convert Pictures to Base64 Data URLs",
    description:
      "Turn any image into a shareable data URL or Base64 string for HTML, CSS and email templates. Instant conversion with copy-ready output.",
    keywords:
      "image to url, image to base64, data url generator, convert png to base64, embed image in css, base64 image encoder, convert image to url link online free, image to link generator free, host image get url instantly",
    faqs: [
      {
        q: "When should I use a Base64 data URL instead of a file?",
        a: "Data URLs suit tiny assets — icons, spacers and email signatures — because they remove an HTTP request. Above roughly 10 KB the ~33% size overhead makes a normal image file faster.",
      },
      {
        q: "Do data URLs work in every browser and email client?",
        a: "All modern browsers support them. Some desktop email clients, notably older Outlook builds, block them, so test before sending a campaign that relies on embedded images.",
      },
    ],
  },
  {
    path: "/tools/image-format-converter",
    name: "Image Format Converter",
    category: IMAGE,
    title: "Image Format Converter — JPG, PNG, WebP, AVIF Online",
    description:
      "Convert between JPG, PNG, WebP, AVIF, BMP, GIF and more with quality control and live previews. Batch convert images free in your browser.",
    keywords:
      "image format converter, png to jpg, jpg to webp, convert to avif, webp converter online, change image format, png to webp converter online free, webp to jpg converter bulk, heic to jpg converter online free",
    faqs: [
      {
        q: "Which image format is best for websites?",
        a: "WebP is the practical default — typically 25–35% smaller than JPG at the same quality with wide browser support. AVIF is smaller still, and JPG remains the safest universal fallback.",
      },
      {
        q: "Does converting between formats lose quality?",
        a: "Converting to a lossless format (PNG, BMP) preserves everything. Converting to JPG, WebP or AVIF re-encodes the image, so keep quality at 80 or above and avoid repeated round trips.",
      },
    ],
  },
  {
    path: "/tools/image-metadata-extractor",
    name: "Image Metadata Extractor",
    category: IMAGE,
    title: "Image EXIF Viewer — Extract Photo Metadata Online",
    description:
      "View EXIF data from any photo: camera model, lens, ISO, shutter speed, GPS location, timestamps and more. Read metadata privately in your browser.",
    keywords:
      "exif viewer, image metadata extractor, photo exif data online, read gps from photo, camera info from image, exif reader, view exif data online free, check photo metadata online, image gps location viewer online",
    faqs: [
      {
        q: "What information does EXIF data contain?",
        a: "Typically camera and lens model, aperture, shutter speed, ISO, focal length, capture date and — if location services were on — the GPS coordinates where the photo was taken.",
      },
      {
        q: "How do I remove EXIF data before sharing a photo?",
        a: "Re-save the picture through the Image Compressor or Format Converter. Re-encoding drops the original metadata block, including any GPS coordinates.",
      },
    ],
  },
  {
    path: "/tools/remove-watermark",
    name: "Watermark Remover",
    category: IMAGE,
    title: "Remove Watermark from Image — Free Online Cleaner",
    description:
      "Clean unwanted watermarks, logos and text from your own images with brush and clone retouching. Works locally in your browser, free and unlimited.",
    keywords:
      "remove watermark from image, watermark remover online, erase logo from photo, clean image text, photo retouch tool, remove watermark from photo online free, delete watermark from image ai free",
    faqs: [
      {
        q: "Is it legal to remove a watermark?",
        a: "Only on images you own or have written permission to edit. Removing a watermark from someone else's copyrighted work to reuse it is copyright infringement.",
      },
      {
        q: "Which watermarks are easiest to remove?",
        a: "Semi-transparent marks over flat or evenly textured backgrounds clean up almost invisibly. Opaque marks across faces or fine detail leave traces because the hidden pixels no longer exist.",
      },
    ],
  },

  /* ------------------------------------------------------------------ PDF */
  {
    path: "/tools/merge-pdf",
    name: "Merge PDF",
    category: PDF,
    title: "Merge PDF Files — Combine PDFs Online Free",
    description:
      "Combine multiple PDF files into one document. Drag to reorder, keep original quality and formatting, and download instantly — no upload, no watermark.",
    keywords:
      "merge pdf, combine pdf files, pdf merger online free, join pdf documents, merge pdf without watermark, merge pdf files free online, combine 2 pdf into one online free, merge pdf without watermark free",
    faqs: [
      {
        q: "How many PDF files can I merge at once?",
        a: "There is no fixed limit — merging is done by your own device, so the practical ceiling is your available memory. Dozens of typical documents merge in a few seconds.",
      },
      {
        q: "Will merging change my fonts or layout?",
        a: "No. Pages are copied byte-for-byte with their embedded fonts, images and vector content, so the merged file looks exactly like the originals.",
      },
    ],
  },
  {
    path: "/tools/split-pdf",
    name: "Split PDF",
    category: PDF,
    title: "Split PDF Online — Extract Pages or Split by Range",
    description:
      "Split a PDF into separate files, extract selected pages or break a document at chosen intervals. Fast, private, free and completely browser-based.",
    keywords:
      "split pdf, extract pages from pdf, separate pdf pages, pdf splitter online, divide pdf file, save one page of pdf, split pdf pages online free, extract single page from pdf online, separate pdf pages free no signup",
    faqs: [
      {
        q: "How do I extract just a few pages from a PDF?",
        a: "Enter the page numbers or a range such as 3-7, 12 in the selection box and export. Only those pages are written to the new file; the source document stays untouched.",
      },
      {
        q: "Can I split one PDF into many single-page files?",
        a: "Yes. Choose the split-every-1-page option and each page is exported as its own PDF, delivered together so you can save them in one go.",
      },
    ],
  },
  {
    path: "/tools/pdf-to-jpg",
    name: "PDF to JPG Converter",
    category: PDF,
    title: "PDF to JPG — Convert PDF Pages to Images Online",
    description:
      "Convert every PDF page to a high-resolution JPG or PNG image. Choose DPI, convert multiple files at once and download all pages in seconds.",
    keywords:
      "pdf to jpg, convert pdf to image, pdf to png, pdf page to picture, high resolution pdf to jpg, batch pdf to image, convert pdf to jpg high resolution online, pdf to image converter free no limit, pdf page to jpg online free",
    faqs: [
      {
        q: "What DPI should I choose when converting a PDF to JPG?",
        a: "Use 96–150 DPI for on-screen use and email, and 300 DPI when the image will be printed or when you need to read small text after zooming.",
      },
      {
        q: "Can I convert several PDFs at the same time?",
        a: "Yes — batch mode accepts multiple PDFs in one run and keeps each document's pages grouped and numbered so nothing gets mixed up.",
      },
    ],
  },
  {
    path: "/tools/pdf-compressor",
    name: "PDF Compressor",
    category: PDF,
    title: "Compress PDF Online — Reduce PDF Size Free",
    description:
      "Shrink large PDF files for email and uploads. Choose a compression level, keep text sharp and download a smaller PDF without watermarks or signup.",
    keywords:
      "compress pdf, reduce pdf file size, pdf compressor online free, shrink pdf for email, make pdf smaller, compress pdf online free without losing quality, reduce pdf size to 100kb online, compress pdf to 200kb free",
    faqs: [
      {
        q: "How much smaller will my PDF get?",
        a: "Image-heavy documents typically drop 50–80%. Text-only PDFs are already compact, so expect smaller gains — often 5–20%.",
      },
      {
        q: "Will compression make the text unreadable?",
        a: "No. Text and vector graphics stay sharp; compression works mainly by re-encoding embedded images, so only photo detail is affected at aggressive settings.",
      },
    ],
  },
  {
    path: "/tools/PdfToExcel",
    name: "PDF to Excel Converter",
    category: PDF,
    title: "PDF to Excel — Convert PDF Tables to XLSX Online",
    description:
      "Extract tables from PDF into an editable Excel spreadsheet. Rows and columns are detected automatically and exported as a clean XLSX file.",
    keywords:
      "pdf to excel, convert pdf table to spreadsheet, pdf to xlsx, extract table from pdf, pdf to csv converter, pdf table to excel converter free, convert pdf bank statement to excel free, pdf to xlsx online no email",
    faqs: [
      {
        q: "Will my table structure be preserved?",
        a: "Column and row positions are detected from the PDF text layout, which works well for ruled and evenly spaced tables. Merged cells and multi-line rows may need a quick manual tidy-up.",
      },
      {
        q: "Can I convert a scanned PDF to Excel?",
        a: "A scan has no text layer, so run it through the PDF OCR tool first to recognise the characters, then bring the recognised text into a spreadsheet.",
      },
    ],
  },
  {
    path: "/tools/UnlockPdf",
    name: "Unlock PDF",
    category: PDF,
    title: "Unlock PDF — Remove Password & Restrictions Online",
    description:
      "Remove open passwords and printing or copying restrictions from PDFs you own. Unlocked files download instantly and stay private on your device.",
    keywords:
      "unlock pdf, remove pdf password, pdf password remover, decrypt pdf online, remove pdf restrictions, enable pdf printing, remove pdf password online free, unlock pdf without password online, decrypt pdf file free online",
    faqs: [
      {
        q: "Do I need to know the password to unlock a PDF?",
        a: "Yes for encrypted documents — enter the password you already have and the tool writes out a copy without protection. It does not crack or guess unknown passwords.",
      },
      {
        q: "Can I remove restrictions that block printing or copying?",
        a: "Owner-permission restrictions on printing, copying and editing can be cleared, provided you are the legitimate owner of the document.",
      },
    ],
  },
  {
    path: "/tools/pdf-metadata-extractor",
    name: "PDF Metadata Extractor",
    category: PDF,
    title: "PDF Metadata Viewer — Read Title, Author & Dates",
    description:
      "Inspect PDF metadata online: title, author, subject, keywords, producer, creation and modification dates, page count, page size and encryption status.",
    keywords:
      "pdf metadata viewer, read pdf properties, pdf author info, pdf document info, check pdf creation date, view pdf properties online, check pdf author and title online, pdf metadata viewer free",
    faqs: [
      {
        q: "What metadata is stored inside a PDF?",
        a: "The document information dictionary holds title, author, subject, keywords, the creating application, the producer library and creation plus modification timestamps.",
      },
      {
        q: "Why does my PDF show an unexpected author name?",
        a: "The author field is inherited from the account or template that created the source document, so exported files often carry the original writer's name until it is edited.",
      },
    ],
  },
  {
    path: "/tools/add-page-numbers",
    name: "Add Page Numbers to PDF",
    category: PDF,
    title: "Add Page Numbers to PDF — Free Online Numbering",
    description:
      "Insert page numbers into any PDF with control over position, starting number, font size and format such as 1, Page 1 or 1 of 20. Instant download.",
    keywords:
      "add page numbers to pdf, pdf page numbering online, number pdf pages, insert page numbers free, pdf footer numbers, add page numbers to pdf online free, insert bates numbering pdf free, number pdf pages without acrobat",
    faqs: [
      {
        q: "Can I start numbering from a page other than the first?",
        a: "Yes. Set the first page to number and the starting value separately, which is ideal when a cover page or table of contents should stay unnumbered.",
      },
      {
        q: "Where should page numbers go on a document?",
        a: "Bottom-centre is the academic standard, bottom-right suits business reports and single-sided printing, and outer corners work best for documents printed double-sided.",
      },
    ],
  },
  {
    path: "/tools/compare-pdf",
    name: "Compare PDF",
    category: PDF,
    title: "Compare Two PDF Files — Find Text Differences Online",
    description:
      "Compare two PDF documents side by side and highlight added, removed and changed text so you can review contract or draft revisions in seconds.",
    keywords:
      "compare pdf files, pdf diff tool, find differences between pdfs, document comparison online, contract version compare, compare two pdf files for differences online free, pdf diff checker online",
    faqs: [
      {
        q: "How does PDF comparison work?",
        a: "The text layer of both documents is extracted and diffed line by line, then insertions and deletions are highlighted so you can see exactly what changed between versions.",
      },
      {
        q: "Can it compare scanned documents?",
        a: "Scans contain images rather than text, so run each file through the PDF OCR tool first and compare the recognised text.",
      },
    ],
  },
  {
    path: "/tools/add-watermark",
    name: "Add Watermark to PDF",
    category: PDF,
    title: "Add Watermark to PDF — Text or Logo Stamp Online",
    description:
      "Stamp a text or image watermark across every PDF page with control over opacity, rotation, size and position. Protect drafts and confidential files.",
    keywords:
      "add watermark to pdf, pdf watermark online, stamp confidential on pdf, draft watermark, logo watermark pdf, add watermark to pdf online free, add text watermark to pdf free, stamp confidential on pdf online",
    faqs: [
      {
        q: "What opacity works best for a watermark?",
        a: "Around 15–30% keeps the mark clearly visible while leaving the underlying text easy to read. Go higher only when you specifically want to discourage reuse.",
      },
      {
        q: "Can I watermark only some pages?",
        a: "Yes — enter a page range so covers, appendices or signature pages can stay clean while the body pages carry the stamp.",
      },
    ],
  },
  {
    path: "/tools/word-to-pdf",
    name: "Word to PDF Converter",
    category: PDF,
    title: "Word to PDF Converter — DOCX to PDF Online Free",
    description:
      "Convert DOC and DOCX files to PDF with headings, lists, tables and images preserved. Runs entirely in your browser — documents never leave your device.",
    keywords:
      "word to pdf, docx to pdf converter, convert doc to pdf online, free word pdf converter, doc to pdf no upload, convert docx to pdf online free, word to pdf converter without losing formatting",
    faqs: [
      {
        q: "Are my fonts and layout preserved?",
        a: "Headings, lists, tables, images and basic styling carry over faithfully. Very complex layouts with text boxes, columns or macros may need a quick visual check.",
      },
      {
        q: "Is my document uploaded to a server?",
        a: "No. Conversion runs locally in your browser, so a confidential contract or CV never leaves your computer.",
      },
    ],
  },
  {
    path: "/tools/pdf-to-word",
    name: "PDF to Word Converter",
    category: PDF,
    title: "PDF to Word — Convert PDF to Editable DOCX Free",
    description:
      "Turn PDFs into editable Word documents with paragraphs and formatting kept intact. Download a clean DOCX file instantly, free and without signup.",
    keywords:
      "pdf to word, convert pdf to docx, editable word from pdf, pdf to doc converter free, pdf into word online, pdf to word converter free online, convert pdf to editable word document free, pdf to docx no email required",
    faqs: [
      {
        q: "Will the converted Word file be fully editable?",
        a: "Yes — text becomes real editable paragraphs with headings and basic styling, so you can rewrite content directly in Word, Google Docs or LibreOffice.",
      },
      {
        q: "Why does my scanned PDF convert to an empty document?",
        a: "Scans store pictures of text rather than characters. Use the PDF OCR tool first to recognise the text, then convert or paste the result into Word.",
      },
    ],
  },
  {
    path: "/tools/protect-pdf",
    name: "Protect PDF",
    category: PDF,
    title: "Protect PDF — Set Document Restrictions Online",
    description:
      "Mark a PDF as restricted, set permission metadata and control how the document is presented before sharing it. Free, private and browser-based.",
    keywords:
      "protect pdf, pdf permissions, restrict pdf editing, secure pdf document, pdf protection tool online, add password to pdf online free, lock pdf file free online",
    faqs: [
      {
        q: "Does this apply real AES encryption?",
        a: "No — it sets document restriction metadata that compliant readers honour. For legally sensitive files that must be unreadable without a password, use full encryption in a desktop PDF suite.",
      },
      {
        q: "What is the safest way to share a confidential PDF?",
        a: "Combine restriction settings with a watermark identifying the recipient, and send through a link that expires rather than as an open email attachment.",
      },
    ],
  },
  {
    path: "/tools/extract-text-pdf",
    name: "Extract Text from PDF",
    category: PDF,
    title: "Extract Text from PDF — Copy PDF Text Online Free",
    description:
      "Pull all selectable text out of a PDF and copy or download it as plain text. Perfect for quoting reports, reusing content and feeding AI tools.",
    keywords:
      "extract text from pdf, copy text from pdf, pdf text extractor online, pdf to txt, get text out of pdf, extract text from pdf online free, copy text from pdf online, pdf to text converter free",
    faqs: [
      {
        q: "Why can't I copy text from some PDFs?",
        a: "Those files are scans or images with no text layer. Run them through the PDF OCR tool, which recognises the characters visually and returns copyable text.",
      },
      {
        q: "Is the page order preserved in the extracted text?",
        a: "Yes. Text is read page by page in document order, with page separators so you can trace any passage back to its original page.",
      },
    ],
  },
  {
    path: "/tools/organize-pdf",
    name: "Organize PDF",
    category: PDF,
    title: "Organize PDF Pages — Reorder, Rotate & Delete Online",
    description:
      "Rearrange, rotate and delete PDF pages visually with drag-and-drop thumbnails, then export the reorganised document in one click.",
    keywords:
      "organize pdf, reorder pdf pages, delete pages from pdf, rotate pdf pages, rearrange pdf online free, rearrange pdf pages online free, delete pages from pdf free online, reorder pdf pages without acrobat",
    faqs: [
      {
        q: "Can I delete and reorder pages in the same session?",
        a: "Yes. Remove the pages you do not need, drag the remaining thumbnails into the order you want, and export once — everything is applied together.",
      },
      {
        q: "Does reorganising a PDF reduce quality?",
        a: "No. Pages are copied without re-rendering, so text, images and embedded fonts stay identical to the source file.",
      },
    ],
  },
  {
    path: "/tools/html-to-pdf",
    name: "HTML to PDF Converter",
    category: PDF,
    title: "HTML to PDF Converter — Web Page to PDF Online",
    description:
      "Convert HTML markup or a full web page into a paginated PDF with your choice of page size, orientation and margins. Free and instant.",
    keywords:
      "html to pdf, convert web page to pdf, html file to pdf online, save html as pdf, code to pdf converter, convert html code to pdf online free, html to pdf converter with css",
    faqs: [
      {
        q: "Is CSS styling applied in the PDF?",
        a: "Yes — inline and embedded CSS is rendered, so colours, fonts and layout carry over. Print media queries are respected, which is useful for hiding navigation.",
      },
      {
        q: "How do I control page breaks?",
        a: "Add the CSS rule page-break-before or break-inside: avoid to the relevant elements so tables and cards are not split awkwardly across pages.",
      },
    ],
  },
  {
    path: "/tools/excel-to-pdf",
    name: "Excel to PDF Converter",
    category: PDF,
    title: "Excel to PDF — Convert XLSX Spreadsheets Online",
    description:
      "Convert XLSX, XLS and CSV spreadsheets to clean, printable PDF tables with sheet selection and landscape support. Free and browser-based.",
    keywords:
      "excel to pdf, xlsx to pdf converter, spreadsheet to pdf, csv to pdf, convert excel sheet to pdf online, convert excel to pdf online free, xlsx to pdf without losing formatting",
    faqs: [
      {
        q: "Can I convert a workbook with several sheets?",
        a: "Yes — every sheet is exported in order, each starting on a new page with its sheet name as a heading so the PDF stays easy to navigate.",
      },
      {
        q: "My wide table is cut off — what should I do?",
        a: "Switch to landscape orientation or a larger page size such as A3, and hide columns you do not need before converting.",
      },
    ],
  },
  {
    path: "/tools/powerpoint-to-pdf",
    name: "PowerPoint to PDF Converter",
    category: PDF,
    title: "PowerPoint to PDF — Convert PPTX Slides Online",
    description:
      "Convert PPT and PPTX presentations to PDF with one slide per page, ready to email, print as handouts or share without PowerPoint installed.",
    keywords:
      "powerpoint to pdf, pptx to pdf converter, convert slides to pdf, presentation to pdf online free, convert ppt to pdf online free, pptx to pdf handout converter free",
    faqs: [
      {
        q: "Are animations and transitions kept?",
        a: "No — PDF is a static format, so each slide is exported in its final state. Presenter notes and builds are not animated in the output.",
      },
      {
        q: "Why convert a presentation to PDF at all?",
        a: "PDF opens identically everywhere, never reflows fonts on another machine and is far smaller to email, which makes it the safest format for sharing decks.",
      },
    ],
  },
  {
    path: "/tools/pdf-ocr",
    name: "PDF OCR",
    category: PDF,
    title: "PDF OCR — Extract Text from Scanned PDFs Free",
    description:
      "Run OCR on scanned PDFs and images in 12+ languages to turn pictures of text into searchable, copyable content. Recognition runs in your browser.",
    keywords:
      "pdf ocr, scanned pdf to text, ocr online free, extract text from scan, image to text converter, searchable pdf, pdf ocr online free, scanned pdf to text converter free, extract text from scanned document online",
    faqs: [
      {
        q: "Which languages does the OCR support?",
        a: "More than a dozen, including English, Spanish, French, German, Portuguese, Italian, Arabic, Hindi, Urdu, Chinese, Japanese and Russian. Pick the language before scanning for best accuracy.",
      },
      {
        q: "How can I improve OCR accuracy?",
        a: "Use scans of at least 300 DPI, keep pages straight and evenly lit, and choose the correct language. Clean printed text typically reaches 95%+ accuracy; handwriting is far less reliable.",
      },
    ],
  },
  {
    path: "/tools/sign-pdf",
    name: "Sign PDF",
    category: PDF,
    title: "Sign PDF Online — Draw or Type Your Signature Free",
    description:
      "Add a signature to any PDF: draw it, type it in a handwriting font or upload an image, then position, resize and export the signed document.",
    keywords:
      "sign pdf online, electronic signature pdf, esign document free, add signature to pdf, digital signature tool, sign pdf online free, add signature to pdf free no signup, draw signature on pdf online",
    faqs: [
      {
        q: "Is an electronic signature legally valid?",
        a: "In most jurisdictions — including under the US ESIGN Act and the EU eIDAS regulation — a signature applied with clear intent is binding for everyday agreements. Some deeds and notarised documents still require a qualified digital certificate.",
      },
      {
        q: "How do I place the signature precisely?",
        a: "Drag it onto the page, resize with the handles and nudge with the arrow keys. Positions are stored as page percentages, so the export matches the preview exactly.",
      },
    ],
  },
  {
    path: "/tools/edit-pdf-text",
    name: "Edit PDF Text",
    category: PDF,
    title: "Edit PDF Text Online — Add & Change Text Free",
    description:
      "Edit text in a PDF: add new text boxes, choose font, size, bold and italic, mask old content with a white background and drag lines into exact position.",
    keywords:
      "edit pdf text, pdf text editor online free, change text in pdf, add text to pdf, modify pdf document, edit pdf text online free, change text in pdf without acrobat, add text to pdf online free",
    faqs: [
      {
        q: "How do I replace existing text in a PDF?",
        a: "Turn on the white background option for your text box so it covers the old line, then type the replacement and match the font, size and position.",
      },
      {
        q: "Which fonts can I use?",
        a: "The standard PDF fonts Helvetica, Times and Courier — each with bold and italic — are embedded, so the exported file renders identically in every PDF reader.",
      },
    ],
  },

  /* ---------------------------------------------------------- CALCULATORS */
  {
    path: "/tools/percentage-calculator",
    name: "Percentage Calculator",
    category: CALC,
    title: "Percentage Calculator — Increase, Decrease & Of",
    description:
      "Calculate percentages, percentage increase and decrease, and what percent one number is of another — with the formula shown for every result.",
    keywords:
      "percentage calculator, percent increase calculator, percentage decrease, what percent of, discount calculator, percentage change formula, percentage increase calculator online, what percent is x of y calculator, percentage decrease calculator free",
    faqs: [
      {
        q: "How do I calculate a percentage increase?",
        a: "Subtract the old value from the new one, divide by the old value and multiply by 100. From 80 to 100 is (100-80)/80 x 100 = 25% increase.",
      },
      {
        q: "How do I find the original price before a discount?",
        a: "Divide the sale price by (1 minus the discount as a decimal). A 30% discount at $70 means 70 / 0.7 = $100 original price.",
      },
    ],
  },
  {
    path: "/tools/unit-converter",
    name: "Unit Converter",
    category: CALC,
    title: "Unit Converter — Length, Weight, Temperature & More",
    description:
      "Convert between metric and imperial units for length, weight, volume, area, speed, temperature, data and time with instant, accurate results.",
    keywords:
      "unit converter, metric to imperial, cm to inches, kg to lbs, celsius to fahrenheit, measurement converter online, unit converter online free, cm to inches converter online, kg to lbs converter tool",
    faqs: [
      {
        q: "Which unit categories are supported?",
        a: "Length, weight and mass, volume, area, temperature, speed, time, digital storage, pressure and energy — each with the common metric and imperial units.",
      },
      {
        q: "How accurate are the conversions?",
        a: "Conversions use the official SI factors and full double precision, so results are exact to well beyond the number of decimals shown.",
      },
    ],
  },
  {
    path: "/tools/currency-converter",
    name: "Currency Converter",
    category: CALC,
    title: "Currency Converter — Live Exchange Rates Online",
    description:
      "Convert between 150+ world currencies using up-to-date exchange rates. Fast, free, ad-free and no account required.",
    keywords:
      "currency converter, exchange rate calculator, usd to eur, live forex rates, money converter online, foreign exchange, currency converter live rates, usd to pkr converter today, exchange rate calculator online free",
    faqs: [
      {
        q: "How often are the exchange rates updated?",
        a: "Rates are fetched from a public exchange-rate feed each time you open the tool and refresh through the day, so they track the mid-market rate closely.",
      },
      {
        q: "Why does my bank give a different rate?",
        a: "Banks and card networks add a spread and fees of roughly 1–3% on top of the mid-market rate shown here, so treat this figure as the benchmark rather than the amount you will receive.",
      },
    ],
  },
  {
    path: "/tools/age-calculator",
    name: "Age Calculator",
    category: CALC,
    title: "Age Calculator — Exact Age in Years, Months & Days",
    description:
      "Work out your exact age from a date of birth in years, months, days, hours and total days, plus the countdown to your next birthday.",
    keywords:
      "age calculator, calculate age from date of birth, exact age in days, birthday countdown, how old am i, age calculator by date of birth, exact age calculator in years months days, how old am i calculator online",
    faqs: [
      {
        q: "How is exact age calculated?",
        a: "Full years are counted first, then the remaining months and days, with leap years handled correctly — the same method used on official forms.",
      },
      {
        q: "Can I calculate age at a past or future date?",
        a: "Yes. Change the target date from today to any date to find how old someone was, or will be, at that moment.",
      },
    ],
  },
  {
    path: "/tools/bmi-calculator",
    name: "BMI Calculator",
    category: CALC,
    title: "BMI Calculator — Body Mass Index in Metric & Imperial",
    description:
      "Calculate your BMI from height and weight in metric or imperial units, see your WHO weight category and the healthy weight range for your height.",
    keywords:
      "bmi calculator, body mass index, healthy weight range, bmi chart, calculate bmi metric imperial, bmi calculator online, bmi calculator kg and cm, body mass index calculator for women",
    faqs: [
      {
        q: "What is a healthy BMI range?",
        a: "The WHO classifies 18.5–24.9 as healthy, below 18.5 as underweight, 25–29.9 as overweight and 30 or above as obese.",
      },
      {
        q: "Is BMI accurate for everyone?",
        a: "It is a population screening measure, not a diagnosis. Muscular athletes often score high despite low body fat, and it does not account for age, sex or fat distribution.",
      },
    ],
  },
  {
    path: "/tools/loan-calculator",
    name: "Loan Calculator",
    category: CALC,
    title: "Loan Calculator — Monthly Payment & Interest Total",
    description:
      "Calculate monthly loan repayments, total interest and the full amortisation schedule for mortgages, car loans and personal finance.",
    keywords:
      "loan calculator, monthly payment calculator, mortgage repayment, emi calculator, amortization schedule, interest calculator, loan emi calculator online, monthly mortgage payment calculator free, car loan interest calculator online",
    faqs: [
      {
        q: "How is a monthly loan payment calculated?",
        a: "With the amortisation formula P x r x (1+r)^n / ((1+r)^n - 1), where P is the principal, r the monthly interest rate and n the number of payments.",
      },
      {
        q: "How much does a shorter term save?",
        a: "A great deal. Cutting a 30-year mortgage to 15 years raises the monthly payment but typically removes more than half of the total interest paid.",
      },
    ],
  },
  {
    path: "/tools/tip-calculator",
    name: "Tip Calculator",
    category: CALC,
    title: "Tip Calculator — Split the Bill and Tip Per Person",
    description:
      "Calculate the tip and total instantly, split a restaurant bill between any number of people and round to a convenient amount per person.",
    keywords:
      "tip calculator, split bill calculator, gratuity calculator, tip per person, restaurant bill splitter, tip calculator online, split bill tip calculator, 20 percent tip calculator",
    faqs: [
      {
        q: "How much should I tip?",
        a: "In the US 15–20% is standard for table service and 20%+ for excellent service. In most of Europe 5–10% or rounding up is normal, and in Japan tipping is not customary.",
      },
      {
        q: "Should the tip be based on the pre-tax total?",
        a: "Tipping on the pre-tax subtotal is the traditional rule, though many people simply use the final total — the difference is usually a small amount.",
      },
    ],
  },
  {
    path: "/tools/hex-to-rgb",
    name: "HEX to RGB Converter",
    category: CALC,
    title: "HEX to RGB Converter — Colour Code Conversion Tool",
    description:
      "Convert colours between HEX, RGB, RGBA, HSL and CSS formats with a live swatch preview. Copy production-ready values for design and code.",
    keywords:
      "hex to rgb, rgb to hex converter, color code converter, hsl converter, css color values, hex color picker, hex to rgb converter, rgb to hex color code converter, hex color to hsl converter online",
    faqs: [
      {
        q: "How does HEX to RGB conversion work?",
        a: "A hex colour holds three byte pairs. #FF5733 splits into FF, 57 and 33, which convert from base 16 to decimal as rgb(255, 87, 51).",
      },
      {
        q: "When should I use HSL instead of HEX?",
        a: "HSL makes tints and shades intuitive: keep hue and saturation and change only lightness to build a consistent colour scale for a design system.",
      },
    ],
  },
  {
    path: "/tools/number-base-converter",
    name: "Number Base Converter",
    category: CALC,
    title: "Number Base Converter — Binary, Hex, Octal, Decimal",
    description:
      "Convert numbers between binary, octal, decimal, hexadecimal and any base from 2 to 36 instantly, with all representations shown side by side.",
    keywords:
      "number base converter, binary to decimal, decimal to hex, octal converter, hex to binary, radix converter, binary to decimal converter online, hex to binary converter free",
    faqs: [
      {
        q: "How do I convert decimal to binary by hand?",
        a: "Divide repeatedly by 2 and record each remainder, then read the remainders bottom to top. 13 gives 1101.",
      },
      {
        q: "Why do programmers use hexadecimal?",
        a: "One hex digit maps exactly to four bits, so a byte is always two digits. That makes memory addresses, colour codes and bit masks far easier to read than long binary strings.",
      },
    ],
  },

  /* ----------------------------------------------------------------- TEXT */
  {
    path: "/tools/word-counter",
    name: "Word Counter",
    category: TEXT,
    title: "Word Counter — Count Words, Characters & Read Time",
    description:
      "Count words, characters with and without spaces, sentences and paragraphs in real time, plus reading and speaking time estimates and keyword density.",
    keywords:
      "word counter, character count tool, count words online, reading time calculator, essay word count, keyword density, word counter tool online, character count with spaces online, essay word count checker free",
    faqs: [
      {
        q: "How is reading time estimated?",
        a: "From an average silent reading speed of about 225 words per minute; speaking time uses roughly 130 words per minute, the comfortable pace for presentations.",
      },
      {
        q: "Does the counter include spaces in the character count?",
        a: "Both figures are shown — characters with spaces and without — because platforms differ: Twitter/X counts spaces, while many form limits do not.",
      },
    ],
  },
  {
    path: "/tools/case-converter",
    name: "Case Converter",
    category: TEXT,
    title: "Case Converter — UPPERCASE, lowercase, Title & camelCase",
    description:
      "Convert text between UPPERCASE, lowercase, Sentence case, Title Case, camelCase, snake_case and kebab-case instantly, then copy the result.",
    keywords:
      "case converter, uppercase to lowercase, title case generator, camelcase converter, snake case, text capitalization tool, case converter online, uppercase to lowercase converter online, title case converter free tool",
    faqs: [
      {
        q: "What is the difference between Title Case and Sentence case?",
        a: "Title Case capitalises each major word (How to Write Better Copy); Sentence case capitalises only the first word and proper nouns (How to write better copy).",
      },
      {
        q: "Which case should I use for code?",
        a: "camelCase for JavaScript variables, PascalCase for classes and React components, snake_case for Python and SQL, and kebab-case for URLs and CSS class names.",
      },
    ],
  },
  {
    path: "/tools/base64-tool",
    name: "Base64 Encoder & Decoder",
    category: TEXT,
    title: "Base64 Encoder & Decoder — Encode Text Online Free",
    description:
      "Encode text to Base64 or decode Base64 back to plain text instantly, with full Unicode support. Everything runs locally in your browser.",
    keywords:
      "base64 encoder, base64 decoder online, encode text base64, decode base64 string, base64 converter free, base64 encode decode online, base64 to image converter online, decode base64 string free",
    faqs: [
      {
        q: "Is Base64 a form of encryption?",
        a: "No. It is reversible encoding designed to carry binary data safely through text channels — anyone can decode it, so never use it to protect secrets.",
      },
      {
        q: "Why is Base64 output longer than the input?",
        a: "Every three bytes become four ASCII characters, which adds about 33% to the size. That overhead is the cost of being safe to transmit as plain text.",
      },
    ],
  },
  {
    path: "/tools/markdown-to-html",
    name: "Markdown to HTML Converter",
    category: TEXT,
    title: "Markdown to HTML Converter — Live Preview Online",
    description:
      "Convert Markdown to clean, semantic HTML with a live side-by-side preview. Supports headings, lists, tables, links, images and code blocks.",
    keywords:
      "markdown to html, md to html converter, markdown preview online, convert readme to html, markdown editor, markdown to html converter, md to html online free, convert readme markdown to html",
    faqs: [
      {
        q: "Which Markdown syntax is supported?",
        a: "Standard CommonMark plus common GitHub extensions: headings, bold and italic, ordered and unordered lists, links, images, blockquotes, tables, inline code and fenced code blocks.",
      },
      {
        q: "Can I use the output directly on my website?",
        a: "Yes — the HTML is clean and semantic with no inline styles, so it inherits your site's CSS when you paste it into a page or CMS.",
      },
    ],
  },
  {
    path: "/tools/text-diff",
    name: "Text Diff Checker",
    category: TEXT,
    title: "Text Diff Checker — Compare Two Texts Online Free",
    description:
      "Compare two blocks of text or code and highlight every addition, deletion and change line by line. Ideal for drafts, contracts and code review.",
    keywords:
      "text diff checker, compare two texts, difference between two files, online diff tool, text comparison free, text diff checker online, compare two texts for differences free, find difference between two paragraphs",
    faqs: [
      {
        q: "Does the diff work for source code?",
        a: "Yes. Whitespace and indentation are respected, so it works well for reviewing code changes as well as prose.",
      },
      {
        q: "How are changes displayed?",
        a: "Added content is highlighted in green, removed content in red and unchanged lines stay neutral, which makes even small edits easy to spot.",
      },
    ],
  },
  {
    path: "/tools/lorem-ipsum",
    name: "Lorem Ipsum Generator",
    category: TEXT,
    title: "Lorem Ipsum Generator — Placeholder Text Online",
    description:
      "Generate Lorem Ipsum placeholder text by words, sentences or paragraphs for mockups, wireframes and layout testing. Copy with one click.",
    keywords:
      "lorem ipsum generator, placeholder text, dummy text generator, filler text for design, lipsum online, dummy text generator paragraphs, placeholder text generator words",
    faqs: [
      {
        q: "Why do designers use Lorem Ipsum?",
        a: "Nonsense Latin keeps reviewers focused on layout, hierarchy and typography instead of reading and critiquing draft copy.",
      },
      {
        q: "How much placeholder text should I generate?",
        a: "Match the real content length: 5–8 words for a headline, 15–25 for a subheading and 50–80 words for a body paragraph, so the mockup reflects the finished page.",
      },
    ],
  },
  {
    path: "/tools/url-decoder",
    name: "URL Encoder & Decoder",
    category: TEXT,
    title: "URL Encoder & Decoder — Percent Encoding Tool",
    description:
      "Encode or decode URLs and query strings with correct percent-encoding for special characters, spaces and Unicode. Instant and free.",
    keywords:
      "url encoder, url decoder online, percent encoding, encode query string, decode url parameters, uri encode, url encoder decoder online, decode url percent encoding free, encode query string online",
    faqs: [
      {
        q: "Why do URLs contain %20 and similar codes?",
        a: "URLs may only carry a limited ASCII set, so other characters are percent-encoded — %20 is a space, %26 an ampersand and %3F a question mark.",
      },
      {
        q: "When should I encode a URL?",
        a: "Whenever user input, search terms or non-English text goes into a query parameter, otherwise special characters break the link or corrupt the value.",
      },
    ],
  },
  {
    path: "/tools/json-formatter",
    name: "JSON Formatter & Validator",
    category: TEXT,
    title: "JSON Formatter & Validator — Beautify JSON Online",
    description:
      "Format, validate and minify JSON with syntax highlighting and clear error messages that point to the exact line. Free developer tool, no upload.",
    keywords:
      "json formatter, json validator, beautify json online, minify json, pretty print json, fix json syntax error, json formatter online, json beautifier and validator free, minify json online free",
    faqs: [
      {
        q: "What are the most common JSON syntax errors?",
        a: "Trailing commas, single quotes instead of double quotes, unquoted keys, and comments — none of which are valid JSON even though JavaScript allows them.",
      },
      {
        q: "When should I minify JSON?",
        a: "For API responses and production payloads, where removing whitespace cuts size noticeably. Keep formatted JSON for config files that humans need to read.",
      },
    ],
  },
  {
    path: "/tools/csv-to-json",
    name: "CSV to JSON Converter",
    category: TEXT,
    title: "CSV to JSON Converter — Spreadsheet Data to JSON",
    description:
      "Convert CSV data into structured JSON with automatic header detection, custom delimiters and pretty-printed output ready for any API.",
    keywords:
      "csv to json, convert csv to json online, spreadsheet to json, csv parser, json from excel data, csv to json converter online, convert excel csv to json array free",
    faqs: [
      {
        q: "How are CSV headers handled?",
        a: "The first row becomes the object keys, so each following row is converted into one JSON object — the format most APIs and databases expect.",
      },
      {
        q: "What if my data contains commas inside a field?",
        a: "Wrap those values in double quotes in the CSV. Quoted fields are parsed correctly, and embedded quotes are escaped by doubling them.",
      },
    ],
  },
  {
    path: "/tools/text-encryption",
    name: "Text Encryption Tool",
    category: TEXT,
    title: "Text Encryption — Encrypt & Decrypt Messages Online",
    description:
      "Encrypt and decrypt text with a passphrase directly in your browser. Nothing is transmitted or stored, so private notes stay on your device.",
    keywords:
      "text encryption online, encrypt message with password, decrypt text tool, secure note encryption, cipher tool, encrypt text with password online, aes text encryption online free, decrypt message online tool",
    faqs: [
      {
        q: "Where is my encryption key stored?",
        a: "Nowhere. The passphrase exists only in memory during the session, so if you lose it the ciphertext cannot be recovered by anyone, including us.",
      },
      {
        q: "How do I choose a strong passphrase?",
        a: "Use at least four unrelated words or 16+ mixed characters. The Password Generator can create one, and the Password Strength tool will rate it.",
      },
    ],
  },
  {
    path: "/tools/morse-code-translator",
    name: "Morse Code Translator",
    category: TEXT,
    title: "Morse Code Translator — Text to Morse with Sound",
    description:
      "Translate text to Morse code and Morse back to text, with audio playback and adjustable speed. Free, instant and works offline in your browser.",
    keywords:
      "morse code translator, text to morse, morse to english, morse code audio, learn morse code online, morse code to english converter, text to morse code with sound",
    faqs: [
      {
        q: "What is SOS in Morse code?",
        a: "Three dots, three dashes, three dots — ... --- ... — sent as one continuous signal. It was chosen for being unmistakable, not as an abbreviation.",
      },
      {
        q: "How is Morse timing structured?",
        a: "A dash lasts three dot units, gaps between symbols are one unit, between letters three units and between words seven units.",
      },
    ],
  },
  {
    path: "/tools/regex-tester",
    name: "Regex Tester",
    category: TEXT,
    title: "Regex Tester — Test Regular Expressions Online",
    description:
      "Test and debug regular expressions with live match highlighting, capture groups, flags and a quick reference. Free tool for developers.",
    keywords:
      "regex tester, regular expression tester online, regex debugger, test regex pattern, javascript regex tool, regex tester online, test regular expression javascript online, regex match highlighter free",
    faqs: [
      {
        q: "Which regex flavour does this use?",
        a: "JavaScript (ECMAScript) regular expressions, including named capture groups, lookahead and lookbehind in modern browsers.",
      },
      {
        q: "What do the g, i and m flags do?",
        a: "g finds every match rather than just the first, i makes matching case-insensitive, and m makes ^ and $ match at each line break instead of only the whole string.",
      },
    ],
  },
  {
    path: "/tools/document-translator",
    name: "Document Translator",
    category: TEXT,
    title: "Document Translator — Translate Text & Files Online",
    description:
      "Translate documents and text between dozens of languages while keeping paragraph structure intact. Fast, free and no account needed.",
    keywords:
      "document translator, translate pdf text, online translation tool, translate docx, multilingual document converter, translate document online free, translate pdf to english free, docx translator keep formatting",
    faqs: [
      {
        q: "Which languages are supported?",
        a: "Dozens of major languages including English, Spanish, French, German, Arabic, Hindi, Urdu, Chinese, Japanese, Russian and Portuguese.",
      },
      {
        q: "Is machine translation good enough for business documents?",
        a: "It is excellent for understanding and internal drafts. Have a native speaker review anything contractual, medical or public-facing before it is published.",
      },
    ],
  },

  /* -------------------------------------------------------------- UTILITY */
  {
    path: "/tools/qr-code-generator",
    name: "QR Code Generator",
    category: UTIL,
    title: "QR Code Generator with Logo — Custom QR Codes Free",
    description:
      "Create custom QR codes with your logo, colours, gradients and dot styles for URLs, WiFi, vCard, email and SMS. Download as PNG, JPG or SVG.",
    keywords:
      "qr code generator, qr code with logo, custom qr code free, wifi qr code, vcard qr code, svg qr code download, qr code generator with logo free, custom qr code generator with colors, wifi qr code generator free, vcard qr code generator online",
    faqs: [
      {
        q: "Will adding a logo stop my QR code from scanning?",
        a: "No, as long as the logo covers under about 30% of the centre. QR codes use Reed-Solomon error correction, and level H can restore up to 30% of damaged or covered data.",
      },
      {
        q: "Do these QR codes ever expire?",
        a: "Never. The data is encoded directly into the image rather than routed through a redirect service, so the code keeps working forever with no account or subscription.",
      },
      {
        q: "What is the minimum size for printing a QR code?",
        a: "Keep it at least 2x2 cm (0.8 inch) for close-range scanning, and use roughly one tenth of the scan distance as the code width for posters and signage.",
      },
    ],
  },
  {
    path: "/tools/password-generator",
    name: "Password Generator",
    category: UTIL,
    title: "Strong Password Generator — Secure Random Passwords",
    description:
      "Generate strong random passwords using cryptographically secure randomness. Control length, symbols, numbers and ambiguous characters.",
    keywords:
      "password generator, strong random password, secure password creator, 16 character password, passphrase generator, password generator strong free, random password generator 16 characters, secure passphrase generator online",
    faqs: [
      {
        q: "How long should a secure password be?",
        a: "At least 16 characters with mixed types for important accounts. Length matters more than complexity — every extra character multiplies the time needed to crack it.",
      },
      {
        q: "Are these passwords truly random?",
        a: "Yes. They use the browser's crypto.getRandomValues API rather than Math.random, and are generated locally so they are never transmitted or logged.",
      },
    ],
  },
  {
    path: "/tools/password-strength",
    name: "Password Strength Checker",
    category: UTIL,
    title: "Password Strength Checker — Test How Strong It Is",
    description:
      "Check password strength instantly with an entropy score, estimated crack time and specific advice for making it harder to guess. Nothing is sent anywhere.",
    keywords:
      "password strength checker, test password security, how strong is my password, password entropy calculator, password strength checker online, how strong is my password test, check password crack time",
    faqs: [
      {
        q: "Is it safe to type my real password here?",
        a: "The analysis runs entirely in your browser — nothing is uploaded, stored or logged. Even so, testing a close variant rather than your live password is a good habit.",
      },
      {
        q: "What makes a password weak?",
        a: "Short length, dictionary words, names, dates, keyboard runs like qwerty, and predictable substitutions such as replacing a with @ — attackers test all of these first.",
      },
    ],
  },
  {
    path: "/tools/hash-generator",
    name: "Hash Generator",
    category: UTIL,
    title: "Hash Generator — MD5, SHA-1, SHA-256 & SHA-512",
    description:
      "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text instantly. Useful for checksums, integrity checks and development work.",
    keywords:
      "hash generator, sha256 online, md5 generator, sha512 hash, checksum calculator, text hash tool, hash generator online, sha256 hash generator free, md5 hash generator online text",
    faqs: [
      {
        q: "Which hash algorithm should I use?",
        a: "SHA-256 for anything security related. MD5 and SHA-1 are broken for security purposes and should be limited to non-critical checksums and legacy compatibility.",
      },
      {
        q: "Can a hash be reversed?",
        a: "No — hashing is one-way. Weak hashes of short or common inputs can still be looked up in rainbow tables, which is why passwords must be salted and hashed with bcrypt or Argon2.",
      },
    ],
  },
  {
    path: "/tools/file-hash-checker",
    name: "File Hash Checker",
    category: UTIL,
    title: "File Hash Checker — Verify MD5 & SHA-256 Checksums",
    description:
      "Calculate MD5, SHA-1 and SHA-256 checksums for any file and compare them against a published value to verify a download has not been tampered with.",
    keywords:
      "file hash checker, verify checksum, md5 of file, sha256 file hash, check download integrity, file hash checker online, verify sha256 checksum of file, md5 checksum calculator online",
    faqs: [
      {
        q: "Why should I verify a download's checksum?",
        a: "A matching hash proves the file is byte-for-byte identical to what the publisher released, ruling out corrupted transfers and tampered mirrors.",
      },
      {
        q: "Is my file uploaded to check the hash?",
        a: "No. The file is read locally and hashed in your browser, so even large or confidential files never leave your device.",
      },
    ],
  },
  {
    path: "/tools/timer-stopwatch",
    name: "Timer & Stopwatch",
    category: UTIL,
    title: "Online Timer & Stopwatch — Countdown with Alarm",
    description:
      "A free online countdown timer and stopwatch with lap times, alarm sound and Pomodoro presets. Runs in your browser, nothing to install.",
    keywords:
      "online timer, countdown timer with alarm, stopwatch online, pomodoro timer, lap timer free, online stopwatch with laps, countdown timer online free, pomodoro timer online free",
    faqs: [
      {
        q: "Does the timer keep running in a background tab?",
        a: "Yes. Elapsed time is calculated from timestamps rather than tick counts, so switching tabs never causes drift.",
      },
      {
        q: "What is the Pomodoro technique?",
        a: "Work for 25 focused minutes, take a 5-minute break, and after four rounds take a longer 15–30 minute break — a simple rhythm that protects concentration.",
      },
    ],
  },
  {
    path: "/tools/color-picker",
    name: "Color Picker",
    category: UTIL,
    title: "Color Picker — HEX, RGB & HSL Palette Generator",
    description:
      "Pick colours visually and copy HEX, RGB and HSL values, then build harmonious palettes with tints, shades and complementary suggestions.",
    keywords:
      "color picker online, hex color picker, rgb picker, palette generator, color scheme tool, css colors, color picker from image online, hex color picker online free, eyedropper color tool online",
    faqs: [
      {
        q: "How do I build an accessible colour palette?",
        a: "Keep body text at a contrast ratio of at least 4.5:1 against its background, and 3:1 for large text and interface icons, to meet WCAG AA.",
      },
      {
        q: "What is a complementary colour scheme?",
        a: "Two hues opposite each other on the colour wheel — such as blue and orange. The high contrast makes call-to-action elements stand out sharply.",
      },
    ],
  },
  {
    path: "/tools/budget-tracker",
    name: "Budget Tracker",
    category: UTIL,
    title: "Budget Tracker — Track Income & Expenses Online Free",
    description:
      "Track income and expenses by category, see where your money goes with visual summaries and manage a monthly budget privately in your browser.",
    keywords:
      "budget tracker, expense tracker online, monthly budget planner, income and expense manager, personal finance tool free, monthly budget tracker online free, simple expense tracker no signup, 50 30 20 budget calculator",
    faqs: [
      {
        q: "Where is my financial data stored?",
        a: "Only in your own browser's local storage. Nothing is uploaded to a server, so your spending records stay entirely private to your device.",
      },
      {
        q: "How should I split a monthly budget?",
        a: "The 50/30/20 rule is a solid starting point: 50% for needs, 30% for wants and 20% for savings and debt repayment.",
      },
    ],
  },
  {
    path: "/tools/barcode-generator",
    name: "Barcode Generator",
    category: UTIL,
    title: "Barcode Generator — EAN, UPC, Code 128 Online Free",
    description:
      "Create scannable barcodes in Code 128, EAN-13, UPC-A, Code 39 and more. Customise size and labels, then download print-ready PNG or SVG.",
    keywords:
      "barcode generator, ean 13 barcode, upc barcode maker, code 128 generator, printable barcode free, svg barcode, barcode generator online free, ean 13 barcode generator free, code 128 barcode maker online",
    faqs: [
      {
        q: "Which barcode format should I use?",
        a: "EAN-13 for retail products outside North America, UPC-A inside it, Code 128 for internal logistics and asset tags, and Code 39 for legacy industrial systems.",
      },
      {
        q: "Can I sell products with a barcode I generate here?",
        a: "For internal stock control, yes. Retail chains require a GS1-issued company prefix, so buy an official number from GS1 before listing products in stores.",
      },
    ],
  },
  {
    path: "/tools/url-shortener",
    name: "URL Shortener",
    category: UTIL,
    title: "URL Shortener — Create Short Links Free & Instantly",
    description:
      "Shorten long URLs into clean, shareable links in one click. No account, no expiry games — ideal for social posts, messages and printed material.",
    keywords:
      "url shortener, short link generator, shorten url free, link shortener no signup, tiny url alternative, url shortener free, shorten link online no signup, short link generator free",
    faqs: [
      {
        q: "Do the short links expire?",
        a: "Links are created through a public shortening service and remain active indefinitely unless that provider removes them for abuse.",
      },
      {
        q: "Can I turn a short link into a QR code?",
        a: "Yes — shorten the URL first, then paste it into the QR Code Generator. Fewer characters mean a simpler pattern that scans faster from a distance.",
      },
    ],
  },
  {
    path: "/tools/email-validator",
    name: "Email Validator",
    category: UTIL,
    title: "Email Validator — Check Email Address Format & Domain",
    description:
      "Validate email addresses for correct syntax, domain records and disposable providers before you add them to a mailing list. Free and instant.",
    keywords:
      "email validator, verify email address, check email format, disposable email checker, email syntax validation, email validator online, check if email address is valid free, bulk email verifier free tool",
    faqs: [
      {
        q: "Can this confirm an inbox actually exists?",
        a: "It verifies syntax and the domain's mail configuration. Confirming a specific mailbox requires a mail-server probe or a real confirmation email.",
      },
      {
        q: "Why does list validation matter?",
        a: "Invalid addresses cause bounces, and a bounce rate above roughly 2% damages sender reputation and pushes future campaigns into spam folders.",
      },
    ],
  },
  {
    path: "/tools/whois-lookup",
    name: "WHOIS Lookup",
    category: UTIL,
    title: "WHOIS Lookup — Domain Registration Info Online",
    description:
      "Look up domain registration details: registrar, creation and expiry dates, name servers and status codes, using live RDAP data.",
    keywords:
      "whois lookup, domain registration info, check domain owner, domain expiry date, rdap lookup online, whois lookup domain owner, check domain registration details free, domain expiry date checker",
    faqs: [
      {
        q: "Why is the owner's name hidden?",
        a: "GDPR and registrar privacy services redact personal contact details from public records. Registrar, dates and name servers remain visible.",
      },
      {
        q: "How do I check when a domain expires?",
        a: "The expiry date appears in the lookup results. Domains usually enter a redemption grace period for 30 days after expiry before being released.",
      },
    ],
  },
  {
    path: "/tools/dns-lookup",
    name: "DNS Lookup",
    category: UTIL,
    title: "DNS Lookup — Check A, MX, TXT & CNAME Records",
    description:
      "Query DNS records for any domain: A, AAAA, MX, TXT, CNAME, NS and SOA. Diagnose email, hosting and propagation issues in seconds.",
    keywords:
      "dns lookup, check dns records, mx record lookup, txt record checker, cname lookup online, nslookup web, dns lookup online, check mx records of domain, a record lookup tool free",
    faqs: [
      {
        q: "What do the main DNS record types do?",
        a: "A and AAAA point a name at an IPv4 or IPv6 address, CNAME aliases one name to another, MX routes email, TXT carries verification and SPF/DKIM data, and NS lists authoritative name servers.",
      },
      {
        q: "How long does a DNS change take to propagate?",
        a: "Usually minutes to a few hours, governed by the record's TTL. Lower the TTL a day before a planned migration to speed up the cutover.",
      },
    ],
  },
  {
    path: "/tools/ip-geolocation",
    name: "IP Geolocation Lookup",
    category: UTIL,
    title: "IP Geolocation — Find Location, ISP & ASN of an IP",
    description:
      "Look up any IP address to see its approximate country, region, city, ISP, ASN and timezone. Fast, free and no registration required.",
    keywords:
      "ip geolocation, ip address lookup, find location of ip, what is my ip, isp lookup tool, asn lookup, ip geolocation lookup, find location of ip address free, what is my ip location checker",
    faqs: [
      {
        q: "How accurate is IP geolocation?",
        a: "Country level is accurate around 95–99% of the time; city level is roughly 55–80% and can be far off on mobile networks, VPNs and satellite links.",
      },
      {
        q: "Can an IP address reveal a home address?",
        a: "No. It resolves to the ISP's routing area, not a street address. Only the ISP can link an IP to a subscriber, and normally only under legal process.",
      },
    ],
  },
  {
    path: "/tools/credit-card-validator",
    name: "Credit Card Validator",
    category: UTIL,
    title: "Credit Card Validator — Luhn Check & Card Type",
    description:
      "Validate a card number's format with the Luhn algorithm and identify the issuing network. Runs locally — no card data is transmitted or stored.",
    keywords:
      "credit card validator, luhn algorithm check, card number validation, bin checker, verify card format, credit card validator luhn check, card number bin checker online free",
    faqs: [
      {
        q: "Does this check whether a card has funds?",
        a: "No. It only validates the number's mathematical structure using the Luhn checksum and identifies the network. Balance and authorisation require the issuing bank.",
      },
      {
        q: "How does the Luhn algorithm work?",
        a: "Every second digit from the right is doubled (subtracting 9 if the result exceeds 9), all digits are summed, and a valid number gives a total divisible by 10.",
      },
    ],
  },
  {
    path: "/tools/emoji-picker",
    name: "Emoji Picker",
    category: UTIL,
    title: "Emoji Picker — Search & Copy Emojis Online Free",
    description:
      "Search thousands of emojis by name or category and copy them with one click for social posts, documents, code and messages.",
    keywords:
      "emoji picker, copy paste emoji, emoji search online, emoji keyboard web, find emoji by name, emoji picker copy and paste, emoji keyboard online copy paste, aesthetic symbols copy paste",
    faqs: [
      {
        q: "Why do emojis look different on other devices?",
        a: "Unicode defines the meaning, not the artwork. Apple, Google, Microsoft and Samsung each draw their own set, so the same character renders differently per platform.",
      },
      {
        q: "Do emojis affect SEO or accessibility?",
        a: "Used sparingly in titles they can lift click-through rate. Screen readers announce the emoji's full name, so avoid strings of them in body content.",
      },
    ],
  },
  {
    path: "/tools/invoice-generator",
    name: "Invoice Generator",
    category: UTIL,
    title: "Free Invoice Generator — Professional PDF Invoices",
    description:
      "Create professional A4 invoices with your logo, itemised lines, tax, discounts and totals, then download a print-ready PDF. Free, no signup.",
    keywords:
      "invoice generator, free invoice maker, create invoice pdf, billing template online, freelance invoice tool, invoice generator free online, create invoice pdf free no signup, freelance invoice template generator",
    faqs: [
      {
        q: "What must a professional invoice include?",
        a: "A unique invoice number, issue and due dates, your business and client details, itemised descriptions with quantities and rates, subtotal, tax, total and payment instructions.",
      },
      {
        q: "Can I add my own logo and currency?",
        a: "Yes — upload a logo, choose your currency and tax rate, and the layout adapts. Everything is generated on your device, so client data stays private.",
      },
    ],
  },
  {
    path: "/tools/receipt-generator",
    name: "Receipt Generator",
    category: UTIL,
    title: "Receipt Generator — Create Printable PDF Receipts",
    description:
      "Generate clean, professional payment receipts with itemised lines, tax and totals, then download or print them as PDF. Free and instant.",
    keywords:
      "receipt generator, create receipt online, printable receipt pdf, payment receipt maker, cash receipt template, receipt generator online, make a receipt pdf free, cash receipt maker online free",
    faqs: [
      {
        q: "What is the difference between an invoice and a receipt?",
        a: "An invoice requests payment before it is made; a receipt confirms payment has been received. Many businesses issue both for the same transaction.",
      },
      {
        q: "What should a valid receipt contain?",
        a: "Business name and contact details, receipt number, date, items or services with amounts, tax, total paid, and the payment method used.",
      },
    ],
  },
  {
    path: "/tools/resume-builder",
    name: "Resume Builder",
    category: UTIL,
    title: "ATS Resume Builder — Free Professional CV Maker",
    description:
      "Build an ATS-friendly resume with recruiter-tested templates, achievement-focused bullet guidance and a high-resolution PDF export. Free, no signup.",
    keywords:
      "resume builder, ats resume template, free cv maker, professional resume pdf, faang resume format, cv builder online, ats resume builder free, free resume maker pdf download no signup, professional cv builder online free",
    faqs: [
      {
        q: "What makes a resume ATS-friendly?",
        a: "A single-column layout with standard section headings (Experience, Education, Skills), real selectable text rather than images, common fonts, no tables or text boxes, and a PDF export.",
      },
      {
        q: "How long should a resume be?",
        a: "One page for under 10 years of experience, two pages beyond that. Senior and academic profiles may run longer, but every line should earn its place.",
      },
      {
        q: "How should I write my bullet points?",
        a: "Lead with a strong verb, state the action, and finish with a measured result — for example, 'Cut checkout load time 42%, lifting mobile conversion by 11%.' Quantified impact outperforms duty lists.",
      },
    ],
  },
  {
    path: "/tools/business-card-generator",
    name: "Business Card Generator",
    category: UTIL,
    title: "Business Card Maker — Free Print-Ready Card Designer",
    description:
      "Design professional business cards online with custom colours, fonts and logo, then export print-ready PDF or PNG at standard card size.",
    keywords:
      "business card generator, free business card maker, print ready card design, visiting card online, custom business card pdf, business card maker online free, create business card pdf print ready, digital visiting card maker free",
    faqs: [
      {
        q: "What size is a standard business card?",
        a: "3.5 x 2 inches (89 x 51 mm) in North America and 85 x 55 mm in most of Europe and Asia. Add a 3 mm bleed for professional printing.",
      },
      {
        q: "What should I put on a business card?",
        a: "Name, role, company, one phone number, one email and a website — plus a QR code linking to your portfolio or vCard. Leave white space; a crowded card looks cheap.",
      },
    ],
  },
  {
    path: "/tools/test-card-generator",
    name: "Test Card Generator",
    category: UTIL,
    title: "Test Card Generator — Sandbox Card Numbers for Devs",
    description:
      "Generate Luhn-valid test card numbers for Visa, Mastercard, Amex and Discover to exercise payment forms in sandbox environments. Developer testing only.",
    keywords:
      "test card generator, sandbox card numbers, luhn valid test cards, payment testing developer, dummy card numbers for testing, test credit card numbers for sandbox testing, luhn valid test card generator developers",
    faqs: [
      {
        q: "Can these cards be used for real purchases?",
        a: "No. They are structurally valid numbers with no bank account behind them, intended purely for validating form logic in sandbox and staging environments.",
      },
      {
        q: "What are test card numbers actually for?",
        a: "Developers use them to test Luhn validation, card-type detection, input masking and error handling without touching a live payment gateway.",
      },
    ],
  },
  {
    path: "/tools/gpa-calculator",
    name: "GPA & CGPA Calculator",
    category: CALC,
    title: "GPA & CGPA Calculator — Free 4.0 Scale Grade Tool",
    description:
      "Calculate semester GPA from credits and letter grades, then combine every semester into an accurate cumulative CGPA on the 4.0 scale. Free and instant.",
    keywords:
      "gpa calculator, cgpa calculator, semester gpa calculator online, how to calculate cgpa from gpa, 4.0 scale grade calculator, college gpa calculator with credits, cumulative gpa calculator free, university cgpa calculator online",
    faqs: [
      { q: "How is GPA calculated?", a: "Multiply each course's grade point by its credit hours, add them all up, then divide by the total credit hours. The calculator does this automatically as you type." },
      { q: "What is the difference between GPA and CGPA?", a: "GPA covers a single semester, while CGPA is the credit-weighted average of every semester you have completed. Enter your semester GPAs and credits in the CGPA panel to get it." },
    ],
  },
  {
    path: "/tools/date-difference-calculator",
    name: "Date Difference Calculator",
    category: CALC,
    title: "Date Difference Calculator — Days Between Two Dates",
    description:
      "Find the exact days, weeks, months and working days between two dates, or add days to any date to get a deadline. Free, instant and accurate.",
    keywords:
      "date difference calculator, days between two dates, how many days until date, working days calculator online, add days to date calculator, business days between dates, date duration calculator free",
    faqs: [
      { q: "Does it count working days only?", a: "Both. The result shows total calendar days as well as a separate working-days figure that excludes Saturdays and Sundays." },
      { q: "Can I add or subtract days from a date?", a: "Yes. Enter a start date and the number of days in the second panel — use a minus sign to go backwards in time." },
    ],
  },
  {
    path: "/tools/discount-calculator",
    name: "Discount & Sales Tax Calculator",
    category: CALC,
    title: "Discount Calculator — Percent Off, Sale Price & Tax",
    description:
      "Calculate the sale price, how much you save and the final total after VAT, GST or sales tax. Works with any currency and updates instantly.",
    keywords:
      "discount calculator, percent off calculator, sale price calculator online, how much do i save calculator, gst calculator online free, vat calculator, sales tax calculator with discount",
    faqs: [
      { q: "How do I calculate a percentage discount?", a: "Multiply the original price by the discount percent and divide by 100 to get the saving, then subtract it from the price. Enter both values and the tool shows every step." },
      { q: "Can I add tax after the discount?", a: "Yes. Enter your VAT, GST or sales-tax rate and it is applied to the discounted price, exactly like a real checkout." },
    ],
  },
  {
    path: "/tools/compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: CALC,
    title: "Compound Interest Calculator — Savings Growth Tool",
    description:
      "See how savings and investments grow with compound interest, monthly contributions and any compounding frequency, with a year-by-year breakdown.",
    keywords:
      "compound interest calculator, savings growth calculator, investment return calculator online, monthly compound interest calculator, future value calculator free, sip calculator online, daily compound interest calculator",
    faqs: [
      { q: "What compounding frequencies are supported?", a: "Yearly, half-yearly, quarterly, monthly and daily. Frequency matters: the same rate compounded monthly grows faster than compounded yearly." },
      { q: "Can I include monthly deposits?", a: "Yes. Add a monthly contribution and the calculator compounds those deposits alongside your starting balance and shows the totals separately." },
    ],
  },
  {
    path: "/tools/salary-calculator",
    name: "Salary & Hourly Wage Calculator",
    category: CALC,
    title: "Salary Calculator — Hourly to Monthly & Yearly Pay",
    description:
      "Convert an hourly rate into weekly, monthly and annual pay or work backwards, with custom working hours and an optional tax deduction.",
    keywords:
      "salary calculator, hourly to annual salary calculator, hourly wage to monthly salary, take home pay calculator online, annual salary to hourly rate, pay rate converter free, monthly income calculator",
    faqs: [
      { q: "How do I convert an hourly rate to a yearly salary?", a: "Multiply the hourly rate by hours worked per week and weeks worked per year. Set your own hours and weeks so holidays and part-time schedules stay accurate." },
      { q: "Is the take-home figure exact?", a: "It applies the flat deduction percentage you enter, which is an estimate. Real payslips use progressive tax bands and local contributions that vary by country." },
    ],
  },
  {
    path: "/tools/roman-numeral-converter",
    name: "Roman Numeral Converter",
    category: CALC,
    title: "Roman Numeral Converter — Numbers & Dates to Roman",
    description:
      "Convert numbers to Roman numerals and back, and turn any date into Roman numerals for tattoos, certificates, logos and design work.",
    keywords:
      "roman numeral converter, number to roman numerals, roman numerals to numbers converter, roman numeral date converter, roman numeral tattoo generator, convert year to roman numerals free",
    faqs: [
      { q: "What is the largest number supported?", a: "3999 (MMMCMXCIX). Standard Roman numerals have no symbol for larger values without overline notation." },
      { q: "How do I write a date in Roman numerals?", a: "Use the date field: the day, month and year are each converted separately, which is the format used for tattoos and monument inscriptions." },
    ],
  },
  {
    path: "/tools/time-zone-converter",
    name: "Time Zone Converter",
    category: UTIL,
    title: "Time Zone Converter — World Clock & Meeting Planner",
    description:
      "Convert any date and time between world time zones and compare several cities side by side. Perfect for scheduling meetings, calls and flights.",
    keywords:
      "time zone converter, world clock converter online, meeting time planner across time zones, utc to local time converter, est to pst converter, compare time zones tool free",
    faqs: [
      { q: "Does it handle daylight saving time?", a: "Yes. Conversions use your browser's IANA time-zone database, so DST shifts are applied automatically for the exact date you pick." },
      { q: "Can I compare more than two zones?", a: "Yes — add as many target zones as you need and every one updates at once when you change the source time." },
    ],
  },
  {
    path: "/tools/random-picker",
    name: "Random Name Picker",
    category: UTIL,
    title: "Random Name Picker & Number Generator — Free",
    description:
      "Pick random winners from a list, shuffle names into a fair order or generate random numbers in any range using cryptographically secure randomness.",
    keywords:
      "random name picker, giveaway winner picker online, random number generator free, list randomizer online, pick a random name from list, raffle picker tool, random team generator",
    faqs: [
      { q: "Is the draw really random?", a: "Yes. It uses the browser's cryptographic random generator (crypto.getRandomValues), not a predictable pseudo-random seed, so results cannot be guessed or reproduced." },
      { q: "Can I pick multiple winners without duplicates?", a: "Yes. Set how many names to draw and keep the no-duplicates option enabled to remove each winner from the pool as it is picked." },
    ],
  },
  {
    path: "/tools/image-to-text",
    name: "Image to Text Converter",
    category: IMAGE,
    title: "Image to Text (OCR) — Extract Text From Photos Free",
    description:
      "Extract editable text from photos, screenshots and scanned pages in 12+ languages. OCR runs in your browser, so images are never uploaded.",
    keywords:
      "image to text, photo to text converter online, ocr online free, screenshot to text converter, extract text from image free, jpg to text converter, handwriting to text online",
    faqs: [
      { q: "Which languages can it read?", a: "Twelve languages including English, Spanish, French, German, Arabic, Urdu, Hindi, Chinese, Japanese and Russian. Pick the language before extracting for the best accuracy." },
      { q: "How do I get the most accurate result?", a: "Use a sharp, well-lit, straight-on image with good contrast between text and background. Blurry, skewed or low-resolution photos reduce OCR accuracy." },
    ],
  },
  {
    path: "/tools/pdf-viewer",
    name: "PDF Viewer",
    category: PDF,
    title: "PDF Viewer Online — Read & Search Any PDF Free",
    description:
      "Open, read and search PDFs in your browser with zoom, rotation, thumbnails and full-text search. No Adobe Reader, no upload, no signup required.",
    keywords:
      "pdf viewer online, read pdf in browser, pdf reader free, search text in pdf online, open pdf without adobe",
    faqs: [
      {
        q: "Is my file uploaded to a server?",
        a: "No. The PDF is rendered locally in your browser, so confidential documents never leave your device.",
      },
      {
        q: "Can I search inside the PDF?",
        a: "Yes. Type a word and the viewer lists every page containing it so you can jump straight to the match.",
      },
    ],
  },
  {
    path: "/tools/pdf-form-filler",
    name: "PDF Form Filler",
    category: PDF,
    title: "PDF Form Filler — Fill Fillable PDF Forms Online",
    description:
      "Complete interactive PDF forms online: text boxes, checkboxes, radio buttons and dropdowns. Flatten your answers and download — free and private.",
    keywords:
      "pdf form filler, fill pdf form online free, fillable pdf editor, complete pdf form in browser, flatten filled pdf",
    faqs: [
      {
        q: "What if my PDF has no fillable fields?",
        a: "Then it is a flat document. Use Edit PDF Text or Sign PDF to place text and signatures anywhere on the page.",
      },
      {
        q: "Should I flatten the form?",
        a: "Flatten it when sending the final version so nobody can alter your answers. Leave it unflattened if you still need to edit later.",
      },
    ],
  },
  {
    path: "/tools/annotate-pdf",
    name: "Annotate PDF",
    category: PDF,
    title: "Annotate PDF — Highlight, Draw & Comment Free",
    description:
      "Highlight passages, draw freehand, add boxes and sticky notes on any PDF page, then export a real annotated PDF. Runs entirely in your browser.",
    keywords:
      "annotate pdf online, highlight pdf free, draw on pdf, add comments to pdf, markup pdf in browser",
    faqs: [
      {
        q: "Are the annotations permanent?",
        a: "They are drawn into the page content on export, so they display identically in every PDF reader.",
      },
      {
        q: "Can I annotate more than one page?",
        a: "Yes. Move between pages with the arrows and every mark is kept until you export the finished file.",
      },
    ],
  },
  {
    path: "/tools/grayscale-pdf",
    name: "Grayscale PDF",
    category: PDF,
    title: "Convert PDF to Grayscale or Black & White Free",
    description:
      "Turn a colour PDF into grayscale, pure black and white, or inverted dark mode. Saves colour ink and makes scanned pages far cleaner to read.",
    keywords:
      "grayscale pdf converter, convert pdf to black and white, remove colour from pdf, invert pdf colours, pdf dark mode converter",
    faqs: [
      {
        q: "Why convert a PDF to grayscale?",
        a: "Grayscale files print without colour ink, are usually smaller, and are often required for coursework or legal submissions.",
      },
      {
        q: "What does the black and white threshold do?",
        a: "It decides which greys become white and which become black — lower keeps more detail, higher gives a cleaner page.",
      },
    ],
  },
  {
    path: "/tools/bates-numbering",
    name: "Bates Numbering",
    category: PDF,
    title: "Bates Numbering for PDF — Legal Page Stamping",
    description:
      "Apply sequential Bates numbers with a custom prefix, suffix and digit count to every PDF page — the standard way to index legal discovery documents.",
    keywords:
      "bates numbering pdf, bates stamp online free, legal pdf numbering, sequential pdf page stamping, add bates numbers to pdf",
    faqs: [
      {
        q: "What is Bates numbering?",
        a: "It is a sequential identifier such as ABC000123 stamped on every page so legal teams can cite an exact page across a discovery set.",
      },
      {
        q: "Can I control the number format?",
        a: "Yes. Set the prefix, suffix, starting number, digit padding, position and text size before stamping.",
      },
    ],
  },
  {
    path: "/tools/insert-pdf-pages",
    name: "Insert PDF Pages",
    category: PDF,
    title: "Insert Pages into PDF — Add One PDF into Another",
    description:
      "Add a PDF into another document at the start, at the end, or before/after any page you choose. Original quality is preserved and nothing is uploaded.",
    keywords:
      "insert pages into pdf, add pdf into another pdf, combine pdf at specific page, insert page in pdf online free",
    faqs: [
      {
        q: "How is this different from merging?",
        a: "Merging appends whole files in order; inserting drops the second PDF at an exact position inside the first one.",
      },
      {
        q: "Does inserting recompress my pages?",
        a: "No. Pages are copied object-for-object, so text, fonts and images stay pixel-identical.",
      },
    ],
  },
  {
    path: "/tools/scan-to-pdf",
    name: "Scan to PDF",
    category: PDF,
    title: "Scan to PDF — Free Camera Document Scanner",
    description:
      "Scan documents with your phone camera or webcam into a clean multi-page PDF, with automatic paper-whitening enhancement. Fully offline and private.",
    keywords:
      "scan to pdf, document scanner online, camera to pdf, scan documents with phone to pdf free, photo to pdf scanner",
    faqs: [
      {
        q: "Do I need to install a scanner app?",
        a: "No. The tool uses your device camera directly in the browser and builds the PDF locally.",
      },
      {
        q: "What does scanner enhancement do?",
        a: "It converts the shot to high-contrast grayscale so paper looks white and printed text stays crisp, just like a dedicated scanner.",
      },
    ],
  },
  {
    path: "/tools/delete-pdf-pages",
    name: "Delete PDF Pages",
    category: PDF,
    title: "Delete Pages from PDF — Remove PDF Pages Free",
    description:
      "Remove unwanted pages from any PDF in seconds. Pick single pages or ranges, keep the rest untouched, and download instantly — no upload, no signup.",
    keywords:
      "delete pages from pdf, remove pdf pages, pdf page remover online free, how to delete a page from a pdf, erase blank pages from pdf",
    faqs: [
      {
        q: "Can I delete several pages at once?",
        a: "Yes. Type a mix of single pages and ranges such as 1, 4-6, 12 and every listed page is removed in one pass.",
      },
      {
        q: "Will deleting pages reduce quality?",
        a: "No. The remaining pages are copied byte-for-byte, so text, fonts and images stay exactly as they were.",
      },
    ],
  },
  {
    path: "/tools/extract-pdf-pages",
    name: "Extract PDF Pages",
    category: PDF,
    title: "Extract Pages from PDF — Save Selected Pages",
    description:
      "Pull chosen pages out of a PDF into a new document. Select ranges like 1-3, 7 and download a clean file — free, instant and processed in your browser.",
    keywords:
      "extract pages from pdf, pdf page extractor, save selected pdf pages, separate pdf pages online, pull one page out of a pdf",
    faqs: [
      {
        q: "What is the difference between extracting and splitting?",
        a: "Splitting breaks the whole file into parts; extracting keeps only the pages you list and puts them into a single new PDF.",
      },
      {
        q: "Does the original file change?",
        a: "Never. Your source PDF stays untouched — the tool only creates a new document for download.",
      },
    ],
  },
  {
    path: "/tools/extract-pdf-images",
    name: "Extract Images from PDF",
    category: PDF,
    title: "Extract Images from PDF — Save Photos as PNG",
    description:
      "Find every embedded photo and graphic inside a PDF and download them as PNG files at original resolution. Fully offline in your browser.",
    keywords:
      "extract images from pdf, pdf image extractor, save pictures from pdf, get photos out of pdf free, pdf to png images",
    faqs: [
      {
        q: "Are images saved at full resolution?",
        a: "Yes. The tool reads the embedded image objects, so you get the original pixel dimensions rather than a screenshot of the page.",
      },
      {
        q: "Nothing was found in my PDF — why?",
        a: "Vector-drawn or text-only pages contain no bitmap images. Use the PDF to JPG tool to export whole pages instead.",
      },
    ],
  },
  {
    path: "/tools/flatten-pdf",
    name: "Flatten PDF",
    category: PDF,
    title: "Flatten PDF Online — Lock Forms & Annotations",
    description:
      "Flatten PDF form fields, annotations and layers so the file looks identical everywhere and can no longer be edited or re-filled. Free and private.",
    keywords:
      "flatten pdf, flatten pdf form fields, make pdf non editable, lock pdf annotations online, flatten filled pdf form free",
    faqs: [
      {
        q: "What does flattening a PDF do?",
        a: "It merges interactive form fields, comments and layers into the static page content, so viewers see fixed text instead of editable widgets.",
      },
      {
        q: "Which mode should I choose?",
        a: "Use forms mode to keep text selectable and searchable. Use full flatten when you want every page converted to a fixed image.",
      },
    ],
  },
  {
    path: "/tools/text-to-pdf",
    name: "Text to PDF",
    category: PDF,
    title: "Text to PDF Converter — TXT to PDF Online Free",
    description:
      "Convert plain text or .txt notes into a clean, paginated PDF with your choice of page size, font and margins. Text stays selectable and searchable.",
    keywords:
      "text to pdf, txt to pdf converter, convert notes to pdf online free, plain text pdf generator, paste text and download pdf",
    faqs: [
      {
        q: "Is the text searchable in the finished PDF?",
        a: "Yes. Real fonts are embedded, so you can select, copy and search every word — it is not an image.",
      },
      {
        q: "How is long text paginated?",
        a: "Lines wrap to the page width and new pages are added automatically when the margin is reached.",
      },
    ],
  },
  {
    path: "/tools/pdf-page-resizer",
    name: "PDF Page Resizer",
    category: PDF,
    title: "Resize PDF Page Size — A4, Letter, Legal & A3",
    description:
      "Change a PDF to A4, A3, A5, Letter, Legal or Tabloid. Pages are scaled and centred without stretching so everything prints correctly.",
    keywords:
      "resize pdf page size, change pdf to a4, pdf letter to a4 converter, scale pdf pages online free, a4 to a3 pdf resize",
    faqs: [
      {
        q: "Will my content be stretched?",
        a: "No. The tool scales each page proportionally and centres it on the new sheet, so the aspect ratio is always preserved.",
      },
      {
        q: "Can I mix portrait and landscape pages?",
        a: "Yes. Choose Keep original and each page is placed on a sheet matching its own orientation.",
      },
    ],
  },
  {
    path: "/tools/pdf-header-footer",
    name: "PDF Header & Footer",
    category: PDF,
    title: "Add Header & Footer to PDF — Free Online Tool",
    description:
      "Stamp custom header and footer text on every PDF page with automatic page numbers, totals and dates. Instant, free and browser-based.",
    keywords:
      "add header footer to pdf, pdf header text online, stamp footer on pdf pages, pdf header footer tool free, add page x of y to pdf",
    faqs: [
      {
        q: "Can I add automatic page numbers?",
        a: "Yes. Use the {page} and {total} placeholders — for example Page {page} of {total} — and each sheet is numbered automatically.",
      },
      {
        q: "Does it work on every page?",
        a: "Yes, the header and footer are applied to all pages, with left, centre or right alignment and an adjustable text size.",
      },
    ],
  },
  {
    path: "/tools/n-up-pdf",
    name: "Pages Per Sheet (N-up)",
    category: PDF,
    title: "Multiple PDF Pages Per Sheet — 2, 4, 6 or 9 Up",
    description:
      "Fit 2, 4, 6 or 9 PDF pages onto one A4 sheet to save paper and ink. Pages are scaled, centred and optionally bordered for easy cutting.",
    keywords:
      "multiple pages per sheet pdf, n-up pdf, 4 pages on one pdf page, combine pdf pages onto one sheet, print 2 pdf pages per page",
    faqs: [
      {
        q: "Why put several pages on one sheet?",
        a: "It halves or quarters your printing cost and is ideal for handouts, flashcards and proofreading drafts.",
      },
      {
        q: "Are the pages still readable?",
        a: "At 2-up and 4-up on A4 most documents stay comfortably readable; 6-up and 9-up suit slides and short pages best.",
      },
    ],
  },
  /* ------------------------------------------------------ DAILY LIFE */
  {
    path: "/tools/calorie-calculator",
    name: "Calorie Calculator",
    category: CALC,
    title: "Calorie Calculator — Daily BMR & TDEE Needs",
    description:
      "Calculate your BMR, TDEE and daily calorie target for weight loss, maintenance or muscle gain using the Mifflin-St Jeor formula. Free, instant, no signup.",
    keywords:
      "calorie calculator, tdee calculator, bmr calculator, daily calorie intake calculator, how many calories should i eat to lose weight, maintenance calories calculator, calorie deficit calculator free",
    faqs: [
      {
        q: "Which formula does this calorie calculator use?",
        a: "It uses the Mifflin-St Jeor equation, the formula most dietitians consider the most accurate for healthy adults, then multiplies your BMR by an activity factor from 1.2 to 1.9 to get your TDEE.",
      },
      {
        q: "How big should a calorie deficit be to lose weight?",
        a: "A deficit of roughly 500 kcal a day gives about 0.5 kg of fat loss per week, which is sustainable for most people. Larger deficits cost muscle and are harder to maintain.",
      },
    ],
  },
  {
    path: "/tools/fuel-cost-calculator",
    name: "Fuel Cost Calculator",
    category: CALC,
    title: "Fuel Cost Calculator — Trip Petrol Cost & Split",
    description:
      "Calculate the fuel needed and total petrol or diesel cost of any trip from distance, mileage and fuel price, then split the cost between passengers.",
    keywords:
      "fuel cost calculator, petrol cost calculator, trip fuel calculator, calculate fuel cost per km, diesel cost calculator for journey, road trip gas cost calculator",
    faqs: [
      {
        q: "How is trip fuel cost calculated?",
        a: "Fuel needed = distance ÷ kilometres per litre, and total cost = fuel needed × price per litre. Turn on round trip to double the distance automatically.",
      },
      {
        q: "Where do I find my car's km per litre?",
        a: "Check the odometer trip method: fill the tank, drive, refill and divide the kilometres driven by the litres added. City mileage is usually 15–25% lower than highway mileage.",
      },
    ],
  },
  {
    path: "/tools/electricity-bill-calculator",
    name: "Electricity Bill Calculator",
    category: CALC,
    title: "Electricity Bill Calculator — Units & Monthly Cost",
    description:
      "Estimate your monthly electricity bill appliance by appliance. Enter watts, hours per day and your unit rate to see kWh used and the exact cost.",
    keywords:
      "electricity bill calculator, kwh calculator, appliance power consumption calculator, electricity units calculator, how to calculate electricity bill from meter reading, ac electricity cost per hour",
    faqs: [
      {
        q: "How do I convert watts into units (kWh)?",
        a: "Units per day = watts × hours used per day ÷ 1000. Multiply by 30 for a monthly figure and by your tariff per kWh to get the cost.",
      },
      {
        q: "Which appliances use the most electricity?",
        a: "Air conditioners, water heaters, irons and electric ovens dominate most bills because they combine high wattage with long run times. Add each one separately to see its share.",
      },
    ],
  },
  {
    path: "/tools/pregnancy-due-date-calculator",
    name: "Pregnancy Due Date Calculator",
    category: CALC,
    title: "Pregnancy Due Date Calculator — Week by Week",
    description:
      "Estimate your baby's due date, current pregnancy week and trimester dates from your last period and cycle length. Free and private, nothing is stored.",
    keywords:
      "pregnancy due date calculator, due date calculator by lmp, how many weeks pregnant am i, conception date calculator, trimester calculator, edd calculator online free",
    faqs: [
      {
        q: "How is the due date calculated?",
        a: "It uses Naegele's rule: 280 days from the first day of your last menstrual period, adjusted for cycles that are longer or shorter than 28 days.",
      },
      {
        q: "How accurate is an estimated due date?",
        a: "Only about 4% of babies arrive exactly on the estimated date; most births happen within two weeks either side. An early ultrasound gives the most accurate dating.",
      },
    ],
  },
  {
    path: "/tools/sleep-calculator",
    name: "Sleep Calculator",
    category: CALC,
    title: "Sleep Calculator — Best Bedtime & Wake Up Time",
    description:
      "Work out the best time to sleep or wake up using 90-minute sleep cycles, so you wake between cycles feeling refreshed instead of groggy.",
    keywords:
      "sleep calculator, bedtime calculator, sleep cycle calculator, what time should i go to bed to wake up at 6am, best time to wake up calculator, 90 minute sleep cycle chart",
    faqs: [
      {
        q: "Why does the calculator use 90-minute cycles?",
        a: "A full sleep cycle averages about 90 minutes. Waking at the end of a cycle, rather than in deep sleep, is what makes you feel alert instead of groggy.",
      },
      {
        q: "How many sleep cycles do adults need?",
        a: "Most adults do best on 5–6 cycles, which is roughly 7.5 to 9 hours of sleep, plus about 15 minutes to fall asleep.",
      },
    ],
  },
  {
    path: "/tools/split-bill-calculator",
    name: "Split Bill Calculator",
    category: CALC,
    title: "Split Bill Calculator — Who Owes Whom, Instantly",
    description:
      "Split a shared bill between any number of friends, add a tip and get the smallest set of payments needed to settle up. Works for trips, dinners and rent.",
    keywords:
      "split bill calculator, share expenses calculator, who owes who calculator, split expenses between friends, group trip cost splitter, dinner bill split calculator with tip",
    faqs: [
      {
        q: "Can it handle people who paid different amounts?",
        a: "Yes. Enter what each person actually paid and the tool works out each balance, then lists the minimum transfers needed so everyone ends up even.",
      },
      {
        q: "Does it work for trips and shared rent too?",
        a: "Absolutely — add one row per person with everything they paid for the group, and the settle-up list shows who transfers what to whom.",
      },
    ],
  },
  {
    path: "/tools/typing-speed-test",
    name: "Typing Speed Test",
    category: UTIL,
    title: "Typing Speed Test — Check Your WPM & Accuracy",
    description:
      "Free typing speed test with live WPM, raw speed and accuracy tracking. Choose a 15, 30, 60 or 120 second run and beat your personal best.",
    keywords:
      "typing speed test, wpm test, typing test online free, check typing speed, average typing speed test, 1 minute typing test with accuracy",
    faqs: [
      {
        q: "How is WPM calculated?",
        a: "One word counts as five characters. Net WPM counts only correctly typed characters divided by five, divided by the minutes elapsed — the same standard used by professional typing tests.",
      },
      {
        q: "What is a good typing speed?",
        a: "Around 40 WPM is average, 60–80 WPM is considered fast, and professional typists often exceed 100 WPM. Accuracy above 95% matters more than raw speed.",
      },
    ],
  },
];

export const toolSeoByPath: Record<string, ToolSeoEntry> = toolSeoEntries.reduce(
  (acc, entry) => {
    acc[entry.path.toLowerCase()] = entry;
    return acc;
  },
  {} as Record<string, ToolSeoEntry>,
);

export const getToolSeo = (pathname: string): ToolSeoEntry | undefined =>
  toolSeoByPath[pathname.replace(/\/+$/, "").toLowerCase()];

/** Generic FAQs appended to every tool page, personalised with the tool name. */
export const buildCommonFaqs = (entry: ToolSeoEntry): ToolFaq[] => [
  {
    q: `Is ${entry.name} free to use?`,
    a: `Yes. ${entry.name} on Klipza is completely free with no account, no subscription and no watermark on your files, and there is no daily usage limit.`,
  },
  {
    q: `Are my files safe when using ${entry.name}?`,
    a: `Processing happens locally in your browser wherever technically possible, so your files are not uploaded to a server, stored or shared with third parties.`,
  },
  {
    q: `Does ${entry.name} work on mobile phones?`,
    a: `Yes. It is fully responsive and runs in any modern browser on Android, iPhone, iPad, Windows and macOS — nothing to install.`,
  },
];
