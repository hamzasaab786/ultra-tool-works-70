import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ToolCard from "@/components/ToolCard";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRecentTools, type RecentTool } from "@/lib/recentTools";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, Zap, Shield, Clock } from "lucide-react";

// Import tool icons
import { 
  ImageIcon, FileIcon, Calculator, Type, QrCode, Fingerprint, FilePlus, 
  Scissors, FileDown, Percent, Ruler, Coins, AlignLeft, CaseSensitive, 
  Camera, Timer, Palette, DollarSign, Link2, Eraser, FileImage, MessageSquare, 
  Volume2, Film, FileCode, Hash, CalendarRange, Zap as ZapIcon, Heart, 
  CreditCard, Archive, Search, Copy, Target, BarChart, Users, Repeat, 
  Shield as ShieldIcon, Mic, Wifi, Scan, Crop, FileText
} from "lucide-react";

const Index = () => {
  const scrollToTools = () => {
    document.getElementById('popular-tools')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const toolCategories = [{
    title: "🖼️ Image Tools",
    description: "Professional image processing tools for compression, resizing, format conversion, and enhancement. Perfect for photographers, designers, and content creators.",
    tools: [{
      title: "Image Compressor",
      description: "Reduce image file size with minimal quality loss using advanced compression algorithms",
      icon: <ImageIcon />,
      path: "/tools/image-compressor"
    }, {
      title: "Image Resizer",
      description: "Change dimensions of your images easily with professional quality preservation",
      icon: <ImageIcon />,
      path: "/tools/image-resizer"
    }, {
      title: "Image Enhancer",
      description: "Adjust brightness, contrast, saturation and more with professional image enhancement tools",
      icon: <ImageIcon />,
      path: "/tools/image-enhancer"
    }, {
      title: "Image Crop Tool",
      description: "Crop your images with precision using an intuitive click-and-drag interface",
      icon: <Crop />,
      path: "/tools/image-crop-tool"
    }, {
      title: "JPG to PDF",
      description: "Convert images to PDF documents with custom layouts and compression settings",
      icon: <FileIcon />,
      path: "/tools/jpg-to-pdf"
    }, {
      title: "SVG to JPG",
      description: "Convert SVG vector graphics to high-quality JPG images with optimized settings",
      icon: <ImageIcon />,
      path: "/tools/svg-to-jpg"
    }, {
      title: "Passport Photo Maker",
      description: "Create professional passport photos with correct dimensions and quality standards",
      icon: <Camera />,
      path: "/tools/passport-photo-maker"
    }, {
      title: "Image to URL",
      description: "Upload images and get shareable URLs for web hosting and sharing",
      icon: <Link2 />,
      path: "/tools/image-to-url"
    }, {
      title: "Image Format Converter",
      description: "Convert between PNG, JPG, WebP, and other image formats",
      icon: <Repeat />,
      path: "/tools/image-format-converter"
    }, {
      title: "Image to Text (OCR)",
      description: "Extract editable text from photos, screenshots and scanned pages in 12+ languages",
      icon: <Scan />,
      path: "/tools/image-to-text"
    }, {
      title: "Image Metadata Extractor",
      description: "View EXIF data, camera details, GPS location and dimensions of any photo",
      icon: <Search />,
      path: "/tools/image-metadata-extractor"
    }, {
      title: "Remove Watermark",
      description: "Erase watermarks and unwanted objects from images with AI-assisted cleanup",
      icon: <FileImage />,
      path: "/tools/remove-watermark"
    }]
  }, {
    title: "📄 PDF Tools",
    description: "Complete PDF management suite for merging, splitting, converting, and securing PDF documents. Essential tools for document workflow automation.",
    tools: [{
      title: "Merge PDF",
      description: "Combine multiple PDF files into one document with custom page ordering",
      icon: <FilePlus />,
      path: "/tools/merge-pdf"
    }, {
      title: "Split PDF",
      description: "Extract specific pages from PDF documents with precision control",
      icon: <Scissors />,
      path: "/tools/split-pdf"
    }, {
      title: "PDF to JPG",
      description: "Convert PDF pages to high-quality JPG or PNG images with customizable settings",
      icon: <FileImage />,
      path: "/tools/pdf-to-jpg"
    }, {
      title: "PDF Compressor",
      description: "Compress PDF files to reduce size while maintaining quality with advanced algorithms",
      icon: <Archive />,
      path: "/tools/pdf-compressor"
    }, {
      title: "Word to PDF",
      description: "Convert Word documents to PDF format instantly",
      icon: <FileText />,
      path: "/tools/word-to-pdf"
    }, {
      title: "PDF to Word",
      description: "Convert PDF to editable Word documents",
      icon: <FileText />,
      path: "/tools/pdf-to-word"
    }, {
      title: "Protect PDF",
      description: "Add password protection to secure your PDF files",
      icon: <ShieldIcon />,
      path: "/tools/protect-pdf"
    }, {
      title: "Extract Text from PDF",
      description: "Extract all text content from PDF documents",
      icon: <Type />,
      path: "/tools/extract-text-pdf"
    }, {
      title: "Organize PDF",
      description: "Reorder and organize PDF pages by drag and drop",
      icon: <Repeat />,
      path: "/tools/organize-pdf"
    }, {
      title: "HTML to PDF",
      description: "Convert HTML code to PDF documents",
      icon: <FileCode />,
      path: "/tools/html-to-pdf"
    }, {
      title: "Excel to PDF",
      description: "Convert Excel spreadsheets to PDF format",
      icon: <FileText />,
      path: "/tools/excel-to-pdf"
    }, {
      title: "PowerPoint to PDF",
      description: "Convert PowerPoint presentations to PDF",
      icon: <FileText />,
      path: "/tools/powerpoint-to-pdf"
    }, {
      title: "Add Watermark",
      description: "Add text or image watermarks to PDF documents for protection",
      icon: <ShieldIcon />,
      path: "/tools/add-watermark"
    }, {
      title: "Compare PDF",
      description: "Compare two PDF documents and highlight differences",
      icon: <Search />,
      path: "/tools/compare-pdf"
    }, {
      title: "PDF to Excel",
      description: "Extract tables from PDF files into editable Excel spreadsheets",
      icon: <FileText />,
      path: "/tools/PdfToExcel"
    }, {
      title: "Unlock PDF",
      description: "Remove passwords and restrictions from PDF files you own",
      icon: <ShieldIcon />,
      path: "/tools/UnlockPdf"
    }, {
      title: "PDF Metadata Extractor",
      description: "Read title, author, producer and creation dates from any PDF",
      icon: <Search />,
      path: "/tools/pdf-metadata-extractor"
    }, {
      title: "Add Page Numbers",
      description: "Insert page numbers anywhere on your PDF with custom format and style",
      icon: <FileText />,
      path: "/tools/add-page-numbers"
    }, {
      title: "Delete PDF Pages",
      description: "Remove unwanted pages from a PDF and download the clean document",
      icon: <Scissors />,
      path: "/tools/delete-pdf-pages"
    }, {
      title: "Extract PDF Pages",
      description: "Save selected pages from a PDF as a brand new document",
      icon: <FilePlus />,
      path: "/tools/extract-pdf-pages"
    }, {
      title: "Extract Images from PDF",
      description: "Pull every embedded image out of a PDF in original quality",
      icon: <FileImage />,
      path: "/tools/extract-pdf-images"
    }, {
      title: "Flatten PDF",
      description: "Flatten form fields and annotations into a non-editable PDF",
      icon: <Archive />,
      path: "/tools/flatten-pdf"
    }, {
      title: "Text to PDF",
      description: "Turn plain text or notes into a formatted, printable PDF document",
      icon: <Type />,
      path: "/tools/text-to-pdf"
    }, {
      title: "PDF Page Resizer",
      description: "Change page size to A4, Letter or custom dimensions with scaling",
      icon: <Ruler />,
      path: "/tools/pdf-page-resizer"
    }, {
      title: "PDF Header & Footer",
      description: "Add running headers and footers with dates, titles and page numbers",
      icon: <FileText />,
      path: "/tools/pdf-header-footer"
    }, {
      title: "Pages Per Sheet (N-up)",
      description: "Print 2, 4 or more PDF pages on a single sheet to save paper",
      icon: <Repeat />,
      path: "/tools/n-up-pdf"
    }, {
      title: "PDF Viewer & Reader",
      description: "Open and read PDF files online with zoom, search and page navigation",
      icon: <Search />,
      path: "/tools/pdf-viewer"
    }, {
      title: "PDF Form Filler",
      description: "Fill in interactive PDF forms and save the completed document",
      icon: <FileText />,
      path: "/tools/pdf-form-filler"
    }, {
      title: "Annotate PDF",
      description: "Highlight, draw and add sticky notes to any PDF page",
      icon: <FileText />,
      path: "/tools/annotate-pdf"
    }, {
      title: "Grayscale PDF",
      description: "Convert colour PDFs to black and white for cheaper printing",
      icon: <FileImage />,
      path: "/tools/grayscale-pdf"
    }, {
      title: "Bates Numbering",
      description: "Apply legal Bates numbering with prefixes across PDF documents",
      icon: <FileText />,
      path: "/tools/bates-numbering"
    }, {
      title: "Insert Pages into PDF",
      description: "Merge extra pages into an existing PDF at any position",
      icon: <FilePlus />,
      path: "/tools/insert-pdf-pages"
    }, {
      title: "Scan to PDF",
      description: "Use your camera to scan documents and save them as a clean PDF",
      icon: <Scan />,
      path: "/tools/scan-to-pdf"
    }]
  }, {
    title: "🧮 Calculators & Converters",
    description: "Mathematical calculators and unit converters for everyday calculations. From percentage calculations to currency conversion with real-time rates.",
    tools: [{
      title: "Percentage Calculator",
      description: "Calculate percentages, percentage increase, decrease, and percentage of numbers easily",
      icon: <Percent />,
      path: "/tools/percentage-calculator"
    }, {
      title: "Unit Converter",
      description: "Convert between different units of measurement including length, weight, temperature, and volume",
      icon: <Ruler />,
      path: "/tools/unit-converter"
    }, {
      title: "Currency Converter",
      description: "Convert between major world currencies with up-to-date exchange rates",
      icon: <Coins />,
      path: "/tools/currency-converter"
    }, {
      title: "Age Calculator",
      description: "Calculate exact age in years, months, days, and more from any birth date",
      icon: <CalendarRange />,
      path: "/tools/age-calculator"
    }, {
      title: "BMI Calculator",
      description: "Calculate your Body Mass Index and get health recommendations",
      icon: <Heart />,
      path: "/tools/bmi-calculator"
    }, {
      title: "Loan Calculator",
      description: "Calculate monthly payments, interest rates, and loan terms",
      icon: <CreditCard />,
      path: "/tools/loan-calculator"
    }, {
      title: "Tip Calculator",
      description: "Calculate tips and split bills among multiple people easily",
      icon: <Calculator />,
      path: "/tools/tip-calculator"
    }]
  }, {
    title: "📝 Text Tools", 
    description: "Text processing and manipulation tools for writers, editors, and content creators. Count words, convert case, and encode/decode text.",
    tools: [{
      title: "Word & Character Counter",
      description: "Count words, characters, paragraphs, and reading time in your text content",
      icon: <AlignLeft />,
      path: "/tools/word-counter"
    }, {
      title: "Case Converter",
      description: "Convert text case between uppercase, lowercase, title case, and sentence case",
      icon: <CaseSensitive />,
      path: "/tools/case-converter"
    }, {
      title: "Base64 Encoder/Decoder",
      description: "Encode and decode Base64 strings for data transmission and storage",
      icon: <Type />,
      path: "/tools/base64-tool"
    }, {
      title: "Markdown to HTML",
      description: "Convert Markdown text to formatted HTML with preview and custom styling",
      icon: <FileCode />,
      path: "/tools/markdown-to-html"
    }, {
      title: "Text Diff Checker",
      description: "Compare two texts and highlight differences side by side",
      icon: <Search />,
      path: "/tools/text-diff"
    }, {
      title: "Lorem Ipsum Generator",
      description: "Generate placeholder text for design and development projects",
      icon: <Type />,
      path: "/tools/lorem-ipsum"
    }, {
      title: "JSON Formatter",
      description: "Beautify, minify and validate JSON data with instant error highlighting",
      icon: <FileCode />,
      path: "/tools/json-formatter"
    }, {
      title: "CSV to JSON",
      description: "Convert CSV spreadsheets into clean JSON arrays for developers",
      icon: <FileCode />,
      path: "/tools/csv-to-json"
    }, {
      title: "URL Encoder / Decoder",
      description: "Encode and decode URLs and query strings safely",
      icon: <Type />,
      path: "/tools/url-decoder"
    }, {
      title: "Text Encryption",
      description: "Encrypt and decrypt text with a passphrase before sharing it",
      icon: <ShieldIcon />,
      path: "/tools/text-encryption"
    }, {
      title: "Morse Code Translator",
      description: "Translate text to Morse code and back with audio playback",
      icon: <Type />,
      path: "/tools/morse-code-translator"
    }, {
      title: "Regex Tester",
      description: "Test regular expressions live with match highlighting and groups",
      icon: <Search />,
      path: "/tools/regex-tester"
    }, {
      title: "Document Translator",
      description: "Translate documents and text between dozens of languages",
      icon: <Type />,
      path: "/tools/document-translator"
    }]
  }, {
    title: "🛠️ Utility Tools",
    description: "Essential utility tools for productivity and daily tasks. Generate QR codes, create secure passwords, track budget, and test internet speed.",
    tools: [{
      title: "QR Code Generator",
      description: "Create custom QR codes for URLs, text, contact info, and more with color customization",
      icon: <QrCode />,
      path: "/tools/qr-code-generator"
    }, {
      title: "Password Generator",
      description: "Generate strong, secure passwords with customizable length and character sets",
      icon: <Fingerprint />,
      path: "/tools/password-generator"
    }, {
      title: "Timer & Stopwatch",
      description: "Professional timer and stopwatch with lap tracking and notification features",
      icon: <Timer />,
      path: "/tools/timer-stopwatch"
    }, {
      title: "Color Picker",
      description: "Pick colors and get HEX, RGB, HSL values with gradient and palette tools",
      icon: <Palette />,
      path: "/tools/color-picker"
    }, {
      title: "Budget Tracker",
      description: "Track your monthly income and expenses with category management and currency support",
      icon: <DollarSign />,
      path: "/tools/budget-tracker"
    }, {
      title: "Hash Generator",
      description: "Generate MD5, SHA-1, and SHA-256 hash values from text or files",
      icon: <Hash />,
      path: "/tools/hash-generator"
    }, {
      title: "Barcode Generator",
      description: "Generate various types of barcodes for products and inventory",
      icon: <Target />,
      path: "/tools/barcode-generator"
    }, {
      title: "Invoice Generator",
      description: "Create professional invoices with AI-powered features and automatic calculations",
      icon: <FileText />,
      path: "/tools/invoice-generator"
    }, {
      title: "Receipt Generator",
      description: "Create professional thermal-style POS receipts with tax & multi-currency, download as PDF",
      icon: <FileText />,
      path: "/tools/receipt-generator"
    }, {
      title: "Resume Builder Pro",
      description: "Build ATS-optimized FAANG-grade resumes with multiple templates, accepted by top companies",
      icon: <FileText />,
      path: "/tools/resume-builder"
    }, {
      title: "Business Card Generator",
      description: "Design professional business cards with 4 templates, export as standard 3.5×2 in PDF or PNG",
      icon: <CreditCard />,
      path: "/tools/business-card-generator"
    }, {
      title: "PDF OCR (Scanned to Text)",
      description: "Extract text from scanned PDFs using AI-powered OCR. Supports 12+ languages including Urdu, Arabic, Hindi",
      icon: <Scan />,
      path: "/tools/pdf-ocr"
    }, {
      title: "Sign PDF",
      description: "Add handwritten or typed signatures to PDFs. Draw, type, place, and download signed PDF",
      icon: <FileText />,
      path: "/tools/sign-pdf"
    }, {
      title: "Edit PDF Text",
      description: "Add and edit text on existing PDFs. Cover original text with white background overlay",
      icon: <FileText />,
      path: "/tools/edit-pdf-text"
    }, {
      title: "Edit PDF",
      description: "Add text, images and shapes anywhere on a PDF page with a visual click-to-place editor",
      icon: <FileText />,
      path: "/tools/edit-pdf"
    }, {
      title: "Crop PDF",
      description: "Trim margins and unwanted areas from every PDF page with precise millimetre control",
      icon: <FileText />,
      path: "/tools/crop-pdf"
    }, {
      title: "Rotate PDF",
      description: "Rotate PDF pages 90, 180 or 270 degrees and save the corrected document",
      icon: <FileText />,
      path: "/tools/rotate-pdf"
    }, {
      title: "Redact PDF",
      description: "Black out sensitive words and phrases in your PDF before sharing it",
      icon: <FileText />,
      path: "/tools/redact-pdf"
    }, {
      title: "Repair PDF",
      description: "Rebuild damaged or corrupted PDF files and recover readable documents",
      icon: <FileText />,
      path: "/tools/repair-pdf"
    }, {
      title: "PDF to PDF/A",
      description: "Convert PDFs to archival PDF/A-2b format with proper metadata for long-term storage",
      icon: <FileText />,
      path: "/tools/pdf-to-pdfa"
    }, {
      title: "PDF to PowerPoint",
      description: "Convert PDF pages into an editable .pptx presentation with real text boxes",
      icon: <FileText />,
      path: "/tools/pdf-to-powerpoint"
    }, {
      title: "Test Card Generator (Dev Only)",
      description: "Luhn-valid sandbox test cards for Stripe/PayPal developer testing. Not for real payments",
      icon: <CreditCard />,
      path: "/tools/test-card-generator"
    }, {
      title: "Email Validator",
      description: "Check if an email address is valid, disposable or has a working domain",
      icon: <MessageSquare />,
      path: "/tools/email-validator"
    }, {
      title: "Password Strength Checker",
      description: "Test how strong your password is and how long it takes to crack",
      icon: <ShieldIcon />,
      path: "/tools/password-strength"
    }, {
      title: "File Hash Checker",
      description: "Verify downloads by comparing MD5, SHA-1 and SHA-256 checksums",
      icon: <Fingerprint />,
      path: "/tools/file-hash-checker"
    }, {
      title: "Whois Lookup",
      description: "Look up domain owner, registrar and expiry details instantly",
      icon: <Search />,
      path: "/tools/whois-lookup"
    }, {
      title: "DNS Lookup",
      description: "Check A, AAAA, MX, TXT and CNAME records for any domain",
      icon: <Wifi />,
      path: "/tools/dns-lookup"
    }, {
      title: "IP Geolocation",
      description: "Find the country, city, ISP and timezone behind any IP address",
      icon: <Target />,
      path: "/tools/ip-geolocation"
    }, {
      title: "Credit Card Validator",
      description: "Validate card numbers with the Luhn algorithm and detect the card brand",
      icon: <CreditCard />,
      path: "/tools/credit-card-validator"
    }, {
      title: "Emoji Picker",
      description: "Search and copy thousands of emojis for posts, chats and documents",
      icon: <MessageSquare />,
      path: "/tools/emoji-picker"
    }, {
      title: "URL Shortener",
      description: "Shorten long links into clean, shareable short URLs",
      icon: <Link2 />,
      path: "/tools/url-shortener"
    }, {
      title: "GPA & CGPA Calculator",
      description: "Calculate semester GPA and cumulative CGPA on the 4.0 scale from credits and grades",
      icon: <Calculator />,
      path: "/tools/gpa-calculator"
    }, {
      title: "Date Difference Calculator",
      description: "Days, weeks, months and working days between two dates, plus add days to a deadline",
      icon: <CalendarRange />,
      path: "/tools/date-difference-calculator"
    }, {
      title: "Discount Calculator",
      description: "Sale price, savings and final total after VAT, GST or sales tax in any currency",
      icon: <Percent />,
      path: "/tools/discount-calculator"
    }, {
      title: "Compound Interest Calculator",
      description: "Project savings growth with monthly deposits and a year-by-year balance table",
      icon: <BarChart />,
      path: "/tools/compound-interest-calculator"
    }, {
      title: "Salary Calculator",
      description: "Convert hourly, monthly and yearly pay with custom hours and tax deductions",
      icon: <DollarSign />,
      path: "/tools/salary-calculator"
    }, {
      title: "Roman Numeral Converter",
      description: "Convert numbers and dates to Roman numerals and back for tattoos and designs",
      icon: <Type />,
      path: "/tools/roman-numeral-converter"
    }, {
      title: "Time Zone Converter",
      description: "Compare world time zones side by side and plan meetings across countries",
      icon: <Clock />,
      path: "/tools/time-zone-converter"
    }, {
      title: "Random Name Picker",
      description: "Pick giveaway winners, shuffle lists and generate secure random numbers",
      icon: <Target />,
      path: "/tools/random-picker"
    }, {
      title: "Calorie Calculator",
      description: "Daily BMR, TDEE and calorie targets for weight loss, maintenance or muscle gain",
      icon: <Calculator />,
      path: "/tools/calorie-calculator"
    }, {
      title: "Fuel Cost Calculator",
      description: "Trip petrol or diesel cost from distance, mileage and fuel price, split per person",
      icon: <Calculator />,
      path: "/tools/fuel-cost-calculator"
    }, {
      title: "Electricity Bill Calculator",
      description: "Estimate monthly units and bill appliance by appliance from watts and hours used",
      icon: <Calculator />,
      path: "/tools/electricity-bill-calculator"
    }, {
      title: "Pregnancy Due Date Calculator",
      description: "Baby due date, current pregnancy week and trimester dates from your last period",
      icon: <CalendarRange />,
      path: "/tools/pregnancy-due-date-calculator"
    }, {
      title: "Sleep Calculator",
      description: "Best bedtime and wake-up times based on 90-minute sleep cycles",
      icon: <Clock />,
      path: "/tools/sleep-calculator"
    }, {
      title: "Split Bill Calculator",
      description: "Split shared bills between friends and see the fewest payments to settle up",
      icon: <DollarSign />,
      path: "/tools/split-bill-calculator"
    }, {
      title: "Typing Speed Test",
      description: "Measure your WPM and accuracy with 15, 30, 60 or 120 second typing tests",
      icon: <Type />,
      path: "/tools/typing-speed-test"
    }, {
      title: "Hex to RGB Converter",
      description: "Convert HEX, RGB and HSL colour codes for design and CSS",
      icon: <Palette />,
      path: "/tools/hex-to-rgb"
    }, {
      title: "Number Base Converter",
      description: "Convert numbers between binary, octal, decimal and hexadecimal",
      icon: <Hash />,
      path: "/tools/number-base-converter"
    }]
  }];

  const popularToolPaths = [
    "/tools/image-compressor",
    "/tools/merge-pdf",
    "/tools/percentage-calculator",
    "/tools/qr-code-generator",
    "/tools/image-crop-tool",
    "/tools/markdown-to-html",
    "/tools/age-calculator",
    "/tools/bmi-calculator",
    "/tools/image-format-converter",
    "/tools/password-generator",
    "/tools/timer-stopwatch",
    "/tools/gpa-calculator",
    "/tools/image-to-text",
    "/tools/discount-calculator",
    "/tools/date-difference-calculator",
    "/tools/calorie-calculator",
    "/tools/sleep-calculator",
  ];

  const allTools = toolCategories.flatMap(category => category.tools);
  const popularTools = popularToolPaths.map(path => allTools.find(tool => tool && tool.path === path)).filter(Boolean);

  // Newest additions first — drives the "Newest" sort option.
  const newToolPaths = [
    "/tools/typing-speed-test",
    "/tools/split-bill-calculator",
    "/tools/sleep-calculator",
    "/tools/pregnancy-due-date-calculator",
    "/tools/electricity-bill-calculator",
    "/tools/fuel-cost-calculator",
    "/tools/calorie-calculator",
    "/tools/scan-to-pdf",
    "/tools/insert-pdf-pages",
    "/tools/bates-numbering",
    "/tools/grayscale-pdf",
    "/tools/annotate-pdf",
    "/tools/pdf-form-filler",
    "/tools/pdf-viewer",
  ];

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "az" | "newest">("popular");
  const [recentTools, setRecentTools] = useState<RecentTool[]>([]);

  useEffect(() => {
    const sync = () => setRecentTools(getRecentTools());
    sync();
    window.addEventListener("klipza:recent-tools-changed", sync);
    return () => window.removeEventListener("klipza:recent-tools-changed", sync);
  }, []);

  const flatTools = useMemo(
    () => toolCategories.flatMap((category, categoryIndex) =>
      category.tools.map(tool => ({ ...tool, categoryIndex, categoryTitle: category.title })),
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const recentToolCards = recentTools
    .map(recent => flatTools.find(tool => tool.path === recent.path))
    .filter(Boolean)
    .slice(0, 8);

  const isFiltering = query.trim().length > 0 || activeCategory !== "all" || sortBy !== "popular";

  const filteredTools = useMemo(() => {
    // Every whitespace-separated word must appear somewhere in the tool entry,
    // so "pdf compress" also finds "Compress PDF"-style tools.
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let list = flatTools.filter(tool => {
      const matchesCategory =
        activeCategory === "all" || String(tool.categoryIndex) === activeCategory;
      const haystack = `${tool.title} ${tool.description} ${tool.path} ${tool.categoryTitle}`.toLowerCase();
      const matchesQuery = terms.every(term => haystack.includes(term));
      return matchesCategory && matchesQuery;
    });

    if (sortBy === "az") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "newest") {
      const rank = (path: string) => {
        const index = newToolPaths.indexOf(path);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
      };
      list = [...list].sort((a, b) => rank(a.path) - rank(b.path));
    } else {
      const rank = (path: string) => {
        const index = popularToolPaths.indexOf(path);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
      };
      list = [...list].sort((a, b) => rank(a.path) - rank(b.path));
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeCategory, sortBy, flatTools]);

  const faqs = [{
    question: "Are all tools completely free to use?",
    answer: "Yes! All our tools are 100% free with no hidden costs, premium features, or subscription fees. We believe everyone should have access to essential digital tools."
  }, {
    question: "Do I need to create an account to use the tools?",
    answer: "No account required! You can use all our tools instantly without signing up, providing personal information, or creating passwords."
  }, {
    question: "Is my data safe and private?",
    answer: "Absolutely. Most tools process your files locally in your browser, meaning your data never leaves your device. For tools that require server processing, we don't store any of your files or personal information."
  }, {
    question: "What file formats do you support?",
    answer: "We support all major file formats including JPG, PNG, GIF, WebP for images; PDF for documents; and various text formats. Each tool clearly indicates which formats are supported."
  }, {
    question: "Are there any file size limitations?",
    answer: "We have reasonable limits to ensure good performance for all users. Most tools support files up to 10MB, which covers the vast majority of use cases."
  }];

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://klipza.live/#faq",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };

  return <>
      <SEO title="Klipza — 80+ Free Online Tools: PDF, Image, QR & Text" description="Use 80+ free online tools in one place: merge and compress PDFs, OCR scans, convert and compress images, generate QR codes, build an ATS resume and more. No signup — files stay on your device." keywords="free online tools, pdf tools online, image compressor, qr code generator with logo, ats resume builder, pdf ocr, word counter, unit converter, klipza" canonicalUrl="https://klipza.live/" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(homeFaqSchema)}</script>
      </Helmet>
      
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="container mx-auto px-4 py-24 md:py-28 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 glassmorphism rounded-full border border-indigo-200/50 dark:border-indigo-400/30 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-indigo-700 dark:text-indigo-300 font-medium">✨ All Tools Are 100% Free Forever</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text animate-slide-up">
              Klipza
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-foreground/90 animate-slide-up delay-200">The Ultimate Collection of 100% Free Online Tools</p>

            <p className="text-lg mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Convert, compress, resize, calculate, and more - all powered by cutting-edge technology.
              No sign-up required, lightning-fast processing, and completely secure.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up delay-400">
              <Button size="lg" className="text-lg px-8 py-3 btn-modern bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" onClick={scrollToTools}>
                <Zap className="mr-2 h-5 w-5" />
                Explore All Tools
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 btn-modern border-2 border-indigo-200 dark:border-indigo-400/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30" onClick={() => document.getElementById('features')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Search, category filters and sorting */}
        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="max-w-4xl mx-auto mb-10 space-y-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    document.getElementById("tool-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                placeholder="Search tools… e.g. merge pdf, compress image, salary"
                aria-label="Search tools"
                className="h-14 pl-12 pr-4 text-base rounded-xl bg-card/90 border-border/70 shadow-sm"
              />
              {query.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-16 z-30 rounded-xl border border-border/70 bg-popover shadow-xl overflow-hidden text-left">
                  {filteredTools.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-muted-foreground">No tool matches “{query}”.</p>
                  ) : (
                    <>
                      {filteredTools.slice(0, 8).map((tool) => (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          className="block px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <span className="text-sm font-medium">{tool.title}</span>
                          <span className="block text-xs text-muted-foreground truncate">{tool.categoryTitle}</span>
                        </Link>
                      ))}
                      {filteredTools.length > 8 && (
                        <button
                          type="button"
                          onClick={() => document.getElementById("tool-results")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                          className="w-full px-4 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-300 hover:bg-accent"
                        >
                          View all {filteredTools.length} results
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>


            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === "all"
                    ? "bg-indigo-600 text-primary-foreground border-transparent"
                    : "bg-card/80 text-muted-foreground border-border/70 hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                All tools ({flatTools.length})
              </button>
              {toolCategories.map((category, categoryIndex) => (
                <button
                  key={categoryIndex}
                  type="button"
                  onClick={() => setActiveCategory(String(categoryIndex))}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    activeCategory === String(categoryIndex)
                      ? "bg-indigo-600 text-primary-foreground border-transparent"
                      : "bg-card/80 text-muted-foreground border-border/70 hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              {([
                { id: "popular", label: "Most popular" },
                { id: "newest", label: "Newest" },
                { id: "az", label: "A–Z" },
              ] as const).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSortBy(option.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    sortBy === option.id
                      ? "border-indigo-500 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40"
                      : "border-border/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
              {isFiltering && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("all");
                    setSortBy("popular");
                  }}
                  className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Reset
                </button>
              )}
            </div>

            {recentToolCards.length > 0 && !isFiltering && (
              <div className="pt-2">
                <p className="text-sm font-medium text-muted-foreground mb-2 text-center">
                  ⏱️ Recently used
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {recentToolCards.map((tool) => tool && (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="px-3 py-1.5 rounded-full text-sm border border-border/70 bg-card/80 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
      </section>

      {/* Popular Tools Section */}
      <section id="popular-tools" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              🔥 Most Popular Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              These are our most loved and frequently used tools by millions of users worldwide for image processing, document management, and productivity enhancement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularTools.map((tool, index) => tool && (
              <div key={index} className="animate-fade-in" style={{
                animationDelay: `${index * 100}ms`
              }}>
                <ToolCard title={tool.title} description={tool.description} icon={tool.icon} path={tool.path} className="h-full" />
              </div>))}
          </div>
        </div>
      </section>

      {/* All Tools Categories Section */}
      <section id="tool-results" className="py-20 scroll-mt-20 bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              🚀 All Tools by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our complete collection of professional-grade tools, organized by category for easy discovery
            </p>
          </div>

          {isFiltering ? (
            <div className="space-y-8">
              <p className="text-center text-muted-foreground">
                {filteredTools.length} tool{filteredTools.length === 1 ? "" : "s"} found
              </p>
              {filteredTools.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No tool matches “{query}”. Try a different keyword or reset the filters.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredTools.map((tool) => (
                    <ToolCard
                      key={tool.path}
                      title={tool.title}
                      description={tool.description}
                      icon={tool.icon}
                      path={tool.path}
                      className="h-full"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-16">
              {toolCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} id={`category-${categoryIndex}`} className="space-y-8 scroll-mt-20">
                  <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {category.tools.map((tool, toolIndex) => (
                      <div key={toolIndex} className="animate-fade-in" style={{
                        animationDelay: `${toolIndex * 50}ms`
                      }}>
                        <ToolCard 
                          title={tool.title} 
                          description={tool.description} 
                          icon={tool.icon} 
                          path={tool.path} 
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50/50 dark:from-indigo-950 dark:to-purple-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose Klipza?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We've built the most comprehensive suite of online tools with cutting-edge technology and user experience in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glassmorphism p-6 rounded-2xl border border-white/50 dark:border-white/10 card-modern text-center">
              <div className="text-green-600 mb-4 flex justify-center">
                <Zap className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">Advanced algorithms ensure blazing-fast processing, even for large files. No more waiting around!</p>
            </div>
            
            <div className="glassmorphism p-6 rounded-2xl border border-white/50 dark:border-white/10 card-modern text-center">
              <div className="text-blue-600 mb-4 flex justify-center">
                <Shield className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">100% Secure</h3>
              <p className="text-muted-foreground leading-relaxed">Your files are processed securely and never stored on our servers. Complete privacy guaranteed.</p>
            </div>
            
            <div className="glassmorphism p-6 rounded-2xl border border-white/50 dark:border-white/10 card-modern text-center">
              <div className="text-purple-600 mb-4 flex justify-center">
                <Sparkles className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">100% Completely Free</h3>
              <p className="text-muted-foreground leading-relaxed">Every single tool is completely free with no limitations, or hidden costs. Forever.</p>
            </div>
            
            <div className="glassmorphism p-6 rounded-2xl border border-white/50 dark:border-white/10 card-modern text-center">
              <div className="text-indigo-600 mb-4 flex justify-center">
                <Clock className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">No Sign-Up</h3>
              <p className="text-muted-foreground leading-relaxed">Start using any tool instantly. No accounts, no forms, no personal information required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              ❓ Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Got questions? We've got answers! Here are the most common questions about our tools and services.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="glassmorphism rounded-xl border border-border/50 px-6">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-indigo-100 max-w-3xl mx-auto leading-relaxed">
            Join millions of users who trust Klipza for their daily digital tasks
          </p>
          <Button size="lg" className="text-lg px-8 py-3 btn-modern bg-white text-indigo-600 hover:bg-gray-100" onClick={scrollToTools}>
            Start Using Tools Now →
          </Button>
        </div>
      </section>
    </>;
};

export default Index;
