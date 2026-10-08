// Shared catalog of every tool, used by the navigation menu and the global tool search.

export interface ToolLink {
  name: string;
  path: string;
}

export const imageTools: ToolLink[] = [
    { name: "Image Compressor", path: "/tools/image-compressor" },
    { name: "Image Resizer", path: "/tools/image-resizer" },
    { name: "Image Enhancer", path: "/tools/image-enhancer" },
    { name: "Image Crop Tool", path: "/tools/image-crop-tool" },
    { name: "JPG to PDF", path: "/tools/jpg-to-pdf" },
    { name: "SVG to JPG", path: "/tools/svg-to-jpg" },
    { name: "Image to URL", path: "/tools/image-to-url" },
    
    { name: "Image Format Converter", path: "/tools/image-format-converter" },
    { name: "Image to Text (OCR)", path: "/tools/image-to-text" },
    { name: "JPG to Word", path: "/tools/jpg-to-word" },
    { name: "Image Metadata Extractor", path: "/tools/image-metadata-extractor" },
    { name: "Image Watermark", path: "/tools/image-watermark" },
];

export const pdfTools: ToolLink[] = [
    { name: "Merge PDF", path: "/tools/merge-pdf" },
    { name: "Split PDF", path: "/tools/split-pdf" },
    { name: "PDF to JPG", path: "/tools/pdf-to-jpg" },
    { name: "PDF Compressor", path: "/tools/pdf-compressor" },
    { name: "Pdf to Excel", path: "/tools/PdfToExcel" },
    { name: "Unlock Pdf", path: "/tools/UnlockPdf" },
    { name: "PDF Metadata Extractor", path: "/tools/pdf-metadata-extractor" },
    { name: "Add Page Numbers", path: "/tools/add-page-numbers" },
    { name: "Compare PDF", path: "/tools/compare-pdf" },
    { name: "Add Watermark", path: "/tools/add-watermark" },
    { name: "Delete PDF Pages", path: "/tools/delete-pdf-pages" },
    { name: "Extract PDF Pages", path: "/tools/extract-pdf-pages" },
    { name: "Extract Images from PDF", path: "/tools/extract-pdf-images" },
    { name: "Flatten PDF", path: "/tools/flatten-pdf" },
    { name: "Text to PDF", path: "/tools/text-to-pdf" },
    { name: "Resize PDF Page Size", path: "/tools/pdf-page-resizer" },
    { name: "Header & Footer", path: "/tools/pdf-header-footer" },
    { name: "Pages Per Sheet (N-up)", path: "/tools/n-up-pdf" },
    { name: "PDF Viewer & Reader", path: "/tools/pdf-viewer" },
    { name: "PDF Form Filler", path: "/tools/pdf-form-filler" },
    { name: "Annotate PDF", path: "/tools/annotate-pdf" },
    { name: "Grayscale / B&W PDF", path: "/tools/grayscale-pdf" },
    { name: "Bates Numbering", path: "/tools/bates-numbering" },
    { name: "Insert Pages into PDF", path: "/tools/insert-pdf-pages" },
    { name: "Scan to PDF (Camera)", path: "/tools/scan-to-pdf" },
    { name: "Word to PDF", path: "/tools/word-to-pdf" },
    { name: "PDF to Word", path: "/tools/pdf-to-word" },
    { name: "PDF to Text", path: "/tools/pdf-to-text" },
    { name: "PDF to CSV", path: "/tools/pdf-to-csv" },
    { name: "Text to Word", path: "/tools/text-to-word" },
    { name: "Word to Text", path: "/tools/word-to-text" },
    { name: "Word to Excel", path: "/tools/word-to-excel" },
    { name: "Word to JPG", path: "/tools/word-to-jpg" },
    { name: "Excel to PDF", path: "/tools/excel-to-pdf" },
    { name: "Excel to Word", path: "/tools/excel-to-word" },
    { name: "PowerPoint to PDF", path: "/tools/powerpoint-to-pdf" },
    { name: "PDF to PowerPoint", path: "/tools/pdf-to-powerpoint" },
    { name: "HTML to PDF", path: "/tools/html-to-pdf" },
    { name: "Protect PDF", path: "/tools/protect-pdf" },
    { name: "Organize PDF", path: "/tools/organize-pdf" },
    { name: "Extract Text from PDF", path: "/tools/extract-text-pdf" },
    { name: "Edit PDF", path: "/tools/edit-pdf" },
    { name: "Edit PDF Text", path: "/tools/edit-pdf-text" },
    { name: "Crop PDF", path: "/tools/crop-pdf" },
    { name: "Rotate PDF", path: "/tools/rotate-pdf" },
    { name: "Redact PDF", path: "/tools/redact-pdf" },
    { name: "Repair PDF", path: "/tools/repair-pdf" },
    { name: "PDF to PDF/A", path: "/tools/pdf-to-pdfa" },
    { name: "PDF OCR (Scanned to Text)", path: "/tools/pdf-ocr" },
    { name: "Sign PDF", path: "/tools/sign-pdf" },
];

export const calculatorTools: ToolLink[] = [
    { name: "Zakat Calculator", path: "/tools/zakat-calculator" },
    { name: "Percentage Calculator", path: "/tools/percentage-calculator" },
    { name: "Unit Converter", path: "/tools/unit-converter" },
    { name: "Currency Converter", path: "/tools/currency-converter" },
    { name: "Age Calculator", path: "/tools/age-calculator" },
    { name: "BMI Calculator", path: "/tools/bmi-calculator" },
    { name: "Loan Calculator", path: "/tools/loan-calculator" },
    { name: "Tip Calculator", path: "/tools/tip-calculator" },
    { name: "GPA & CGPA Calculator", path: "/tools/gpa-calculator" },
    { name: "Date Difference Calculator", path: "/tools/date-difference-calculator" },
    { name: "Discount Calculator", path: "/tools/discount-calculator" },
    { name: "Compound Interest Calculator", path: "/tools/compound-interest-calculator" },
    { name: "Salary Calculator", path: "/tools/salary-calculator" },
    { name: "Roman Numeral Converter", path: "/tools/roman-numeral-converter" },
    { name: "Hex to RGB", path: "/tools/hex-to-rgb" },
    { name: "Number Base Converter", path: "/tools/number-base-converter" },
    { name: "Calorie Calculator", path: "/tools/calorie-calculator" },
    { name: "Fuel Cost Calculator", path: "/tools/fuel-cost-calculator" },
    { name: "Electricity Bill Calculator", path: "/tools/electricity-bill-calculator" },
    { name: "Pregnancy Due Date Calculator", path: "/tools/pregnancy-due-date-calculator" },
    { name: "Sleep Calculator", path: "/tools/sleep-calculator" },
    { name: "Split Bill Calculator", path: "/tools/split-bill-calculator" },
    { name: "Typing Speed Test", path: "/tools/typing-speed-test" },
    { name: "Time Zone Converter", path: "/tools/time-zone-converter" },
    { name: "Random Name Picker", path: "/tools/random-picker" },
    { name: "Random Number Generator", path: "/tools/random-number-generator" },
    { name: "Ovulation Calculator", path: "/tools/ovulation-calculator" },
];

export const textTools: ToolLink[] = [
    { name: "Word Frequency Counter", path: "/tools/word-frequency-counter" },
    { name: "Remove Duplicate Lines", path: "/tools/remove-duplicate-lines" },
    { name: "URL Slug Generator", path: "/tools/slug-generator" },
    { name: "YAML to JSON Converter", path: "/tools/yaml-to-json" },
    { name: "Word Counter", path: "/tools/word-counter" },
    { name: "Case Converter", path: "/tools/case-converter" },
    { name: "Base64 Tool", path: "/tools/base64-tool" },
    { name: "Markdown to HTML", path: "/tools/markdown-to-html" },
    { name: "Text Diff", path: "/tools/text-diff" },
    { name: "Lorem Ipsum", path: "/tools/lorem-ipsum" },
    { name: "URL Decoder", path: "/tools/url-decoder" },
    { name: "JSON Formatter", path: "/tools/json-formatter" },
    { name: "CSV to JSON", path: "/tools/csv-to-json" },
    { name: "Text Encryption", path: "/tools/text-encryption" },
    { name: "Morse Code Translator", path: "/tools/morse-code-translator" },
    { name: "Regex Tester", path: "/tools/regex-tester" },
    { name: "Document Translator", path: "/tools/document-translator" },
];

export const utilityTools: ToolLink[] = [
    { name: "Meta Tag Generator", path: "/tools/meta-tag-generator" },
    { name: "CSS Box Shadow Generator", path: "/tools/box-shadow-generator" },
    { name: "Cron Expression Generator", path: "/tools/cron-expression-generator" },
    { name: "QR Code Generator", path: "/tools/qr-code-generator" },
    { name: "Signature Generator", path: "/tools/signature-generator" },
    { name: "Password Generator", path: "/tools/password-generator" },
    { name: "Hash Generator", path: "/tools/hash-generator" },
    { name: "Timer & Stopwatch", path: "/tools/timer-stopwatch" },
    { name: "Color Picker", path: "/tools/color-picker" },
    { name: "Budget Tracker", path: "/tools/budget-tracker" },
    { name: "Barcode Generator", path: "/tools/barcode-generator" },
    { name: "URL Shortener", path: "/tools/url-shortener" },
    { name: "Email Validator", path: "/tools/email-validator" },
    { name: "Password Strength", path: "/tools/password-strength" },
    { name: "File Hash Checker", path: "/tools/file-hash-checker" },
    { name: "Whois Lookup", path: "/tools/whois-lookup" },
    { name: "DNS Lookup", path: "/tools/dns-lookup" },
    { name: "IP Geolocation", path: "/tools/ip-geolocation" },
    { name: "Credit Card Validator", path: "/tools/credit-card-validator" },
    { name: "Emoji Picker", path: "/tools/emoji-picker" },
    { name: "Invoice Generator", path: "/tools/invoice-generator" },
    { name: "Receipt Generator", path: "/tools/receipt-generator" },
    { name: "Resume Builder Pro", path: "/tools/resume-builder" },
    { name: "Business Card Generator", path: "/tools/business-card-generator" },
    { name: "Test Card Generator (Dev)", path: "/tools/test-card-generator" },
];

export interface ToolCategory {
  id: string;
  label: string;
  emoji: string;
  tools: ToolLink[];
}

export const toolCatalog: ToolCategory[] = [
  { id: "imageTools", label: "Image Tools", emoji: "🖼️", tools: imageTools },
  { id: "pdfTools", label: "PDF Tools", emoji: "📄", tools: pdfTools },
  { id: "calculatorTools", label: "Calculators & Converters", emoji: "🧮", tools: calculatorTools },
  { id: "textTools", label: "Text Tools", emoji: "📝", tools: textTools },
  { id: "utilityTools", label: "Utility Tools", emoji: "🛠️", tools: utilityTools },
];

export const allToolLinks: (ToolLink & { category: string })[] = toolCatalog.flatMap(
  (c) => c.tools.map((t) => ({ ...t, category: c.label })),
);

// Extra search keywords per tool path, so common alternate names still find the tool.
export const toolAliases: Record<string, string> = {
  "/tools/case-converter":
    "change case title case uppercase lowercase sentence case camelcase capitalize text case",
  "/tools/word-counter": "character counter letter count text statistics",
  "/tools/image-format-converter": "png to jpg webp converter change image format",
  "/tools/image-resizer": "scale image change dimensions resize photo",
  "/tools/image-compressor": "reduce image size shrink photo",
  "/tools/image-to-text": "ocr read text from picture",
  "/tools/pdf-to-word": "pdf to docx",
  "/tools/word-to-pdf": "docx to pdf",
  "/tools/merge-pdf": "combine pdf join pdf",
  "/tools/split-pdf": "separate pdf pages divide pdf",
  "/tools/pdf-compressor": "reduce pdf size shrink pdf",
  "/tools/qr-code-generator": "qr maker barcode qr with logo",
  "/tools/password-generator": "random password strong password",
  "/tools/json-formatter": "json beautifier prettify json",
  "/tools/url-decoder": "url encoder percent encoding",
  "/tools/text-diff": "compare text difference checker",
};

export const getToolAliases = (path: string): string => toolAliases[path] ?? "";
