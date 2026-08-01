import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Image Tools


// PDF Tools

// Calculator Tools

// Text Tools

// Utility Tools

const AboutUs = lazy(() => import("@/pages/AboutUs"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Disclaimer = lazy(() => import("@/pages/Disclaimer"));
const ImageCompressor = lazy(() => import("@/pages/tools/ImageCompressor"));
const ImageResizer = lazy(() => import("@/pages/tools/ImageResizer"));
const ImageEnhancer = lazy(() => import("@/pages/tools/ImageEnhancer"));
const JpgToPdf = lazy(() => import("@/pages/tools/JpgToPdf"));
const SvgToJpg = lazy(() => import("@/pages/tools/SvgToJpg"));
const ImageToUrl = lazy(() => import("@/pages/tools/ImageToUrl"));
const PassportPhotoMaker = lazy(() => import("@/pages/tools/PassportPhotoMaker"));
const ImageFormatConverter = lazy(() => import("@/pages/tools/ImageFormatConverter"));
const ImageMetadataExtractor = lazy(() => import("@/pages/tools/ImageMetadataExtractor"));
const RemoveWatermark = lazy(() => import("@/pages/tools/RemoveWatermark"));
const ImageCropTool = lazy(() => import("@/pages/tools/ImageCropTool"));
const MergePDF = lazy(() => import("@/pages/tools/MergePDF"));
const SplitPdf = lazy(() => import("@/pages/tools/SplitPdf"));
const PdfToJpg = lazy(() => import("@/pages/tools/PdfToJpg"));
const PdfCompressor = lazy(() => import("@/pages/tools/PdfCompressor"));
const PdfToExcel = lazy(() => import("@/pages/tools/PdfToExcel"));
const UnlockPdf = lazy(() => import("@/pages/tools/UnlockPdf"));
const PdfMetadataExtractor = lazy(() => import("@/pages/tools/PdfMetadataExtractor"));
const AddPageNumbers = lazy(() => import("@/pages/tools/AddPageNumbers"));
const ComparePdf = lazy(() => import("@/pages/tools/ComparePdf"));
const AddWatermark = lazy(() => import("@/pages/tools/AddWatermark"));
const WordToPdf = lazy(() => import("@/pages/tools/WordToPdf"));
const PdfToWord = lazy(() => import("@/pages/tools/PdfToWord"));
const ProtectPdf = lazy(() => import("@/pages/tools/ProtectPdf"));
const ExtractTextPdf = lazy(() => import("@/pages/tools/ExtractTextPdf"));
const OrganizePdf = lazy(() => import("@/pages/tools/OrganizePdf"));
const HtmlToPdf = lazy(() => import("@/pages/tools/HtmlToPdf"));
const ExcelToPdf = lazy(() => import("@/pages/tools/ExcelToPdf"));
const PowerPointToPdf = lazy(() => import("@/pages/tools/PowerPointToPdf"));
const PercentageCalculator = lazy(() => import("@/pages/tools/PercentageCalculator"));
const UnitConverter = lazy(() => import("@/pages/tools/UnitConverter"));
const CurrencyConverter = lazy(() => import("@/pages/tools/CurrencyConverter"));
const AgeCalculator = lazy(() => import("@/pages/tools/AgeCalculator"));
const BmiCalculator = lazy(() => import("@/pages/tools/BmiCalculator"));
const LoanCalculator = lazy(() => import("@/pages/tools/LoanCalculator"));
const TipCalculator = lazy(() => import("@/pages/tools/TipCalculator"));
const HexToRgb = lazy(() => import("@/pages/tools/HexToRgb"));
const NumberBaseConverter = lazy(() => import("@/pages/tools/NumberBaseConverter"));
const WordCounter = lazy(() => import("@/pages/tools/WordCounter"));
const CaseConverter = lazy(() => import("@/pages/tools/CaseConverter"));
const Base64Tool = lazy(() => import("@/pages/tools/Base64Tool"));
const MarkdownToHtml = lazy(() => import("@/pages/tools/MarkdownToHtml"));
const TextDiff = lazy(() => import("@/pages/tools/TextDiff"));
const LoremIpsum = lazy(() => import("@/pages/tools/LoremIpsum"));
const UrlDecoder = lazy(() => import("@/pages/tools/UrlDecoder"));
const JsonFormatter = lazy(() => import("@/pages/tools/JsonFormatter"));
const CsvToJson = lazy(() => import("@/pages/tools/CsvToJson"));
const TextEncryption = lazy(() => import("@/pages/tools/TextEncryption"));
const MorseCodeTranslator = lazy(() => import("@/pages/tools/MorseCodeTranslator"));
const RegexTester = lazy(() => import("@/pages/tools/RegexTester"));
const DocumentTranslator = lazy(() => import("@/pages/tools/DocumentTranslator"));
const QRCodeGenerator = lazy(() => import("@/pages/tools/QRCodeGenerator"));
const PasswordGenerator = lazy(() => import("@/pages/tools/PasswordGenerator"));
const HashGenerator = lazy(() => import("@/pages/tools/HashGenerator"));
const TimerStopwatch = lazy(() => import("@/pages/tools/TimerStopwatch"));
const ColorPicker = lazy(() => import("@/pages/tools/ColorPicker"));
const BudgetTracker = lazy(() => import("@/pages/tools/BudgetTracker"));
const BarcodeGenerator = lazy(() => import("@/pages/tools/BarcodeGenerator"));
const UrlShortener = lazy(() => import("@/pages/tools/UrlShortener"));
const EmailValidator = lazy(() => import("@/pages/tools/EmailValidator"));
const PasswordStrength = lazy(() => import("@/pages/tools/PasswordStrength"));
const FileHashChecker = lazy(() => import("@/pages/tools/FileHashChecker"));
const WhoisLookup = lazy(() => import("@/pages/tools/WhoisLookup"));
const DnsLookup = lazy(() => import("@/pages/tools/DnsLookup"));
const IpGeolocation = lazy(() => import("@/pages/tools/IpGeolocation"));
const CreditCardValidator = lazy(() => import("@/pages/tools/CreditCardValidator"));
const EmojiPicker = lazy(() => import("@/pages/tools/EmojiPicker"));
const InvoiceGenerator = lazy(() => import("@/pages/tools/InvoiceGenerator"));
const ReceiptGenerator = lazy(() => import("@/pages/tools/ReceiptGenerator"));
const ResumeBuilder = lazy(() => import("@/pages/tools/ResumeBuilder"));
const BusinessCardGenerator = lazy(() => import("@/pages/tools/BusinessCardGenerator"));
const PdfOcr = lazy(() => import("@/pages/tools/PdfOcr"));
const SignPdfTool = lazy(() => import("@/pages/tools/SignPdfTool"));
const EditPdfText = lazy(() => import("@/pages/tools/EditPdfText"));
const EditPdf = lazy(() => import("@/pages/tools/EditPdf"));
const CropPdf = lazy(() => import("@/pages/tools/CropPdf"));
const RotatePdf = lazy(() => import("@/pages/tools/RotatePdf"));
const RedactPdf = lazy(() => import("@/pages/tools/RedactPdf"));
const RepairPdf = lazy(() => import("@/pages/tools/RepairPdf"));
const PdfToPdfA = lazy(() => import("@/pages/tools/PdfToPdfA"));
const PdfToPowerPoint = lazy(() => import("@/pages/tools/PdfToPowerPoint"));
const TestCardGenerator = lazy(() => import("@/pages/tools/TestCardGenerator"));

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <Analytics />
          <Layout>
            <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            
            {/* Image Tools */}
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/image-enhancer" element={<ImageEnhancer />} />
            <Route path="/tools/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/tools/svg-to-jpg" element={<SvgToJpg />} />
            <Route path="/tools/image-to-url" element={<ImageToUrl />} />
            
            <Route path="/tools/passport-photo-maker" element={<PassportPhotoMaker />} />
            <Route path="/tools/image-format-converter" element={<ImageFormatConverter />} />
            <Route path="/tools/image-metadata-extractor" element={<ImageMetadataExtractor />} />
            <Route path="/tools/remove-watermark" element={<RemoveWatermark />} />
            <Route path="/tools/image-crop-tool" element={<ImageCropTool />} />

            {/* PDF Tools */}
            <Route path="/tools/merge-pdf" element={<MergePDF />} />
            <Route path="/tools/split-pdf" element={<SplitPdf />} />
            <Route path="/tools/pdf-to-jpg" element={<PdfToJpg />} />
            <Route path="/tools/pdf-compressor" element={<PdfCompressor />} />
            <Route path="/tools/PdfToExcel" element={<PdfToExcel />} />
            <Route path="/tools/UnlockPdf" element={<UnlockPdf />} />
            <Route path="/tools/pdf-metadata-extractor" element={<PdfMetadataExtractor />} />
            <Route path="/tools/add-page-numbers" element={<AddPageNumbers />} />
            <Route path="/tools/compare-pdf" element={<ComparePdf />} />
            <Route path="/tools/add-watermark" element={<AddWatermark />} />
            <Route path="/tools/word-to-pdf" element={<WordToPdf />} />
            <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
            <Route path="/tools/protect-pdf" element={<ProtectPdf />} />
            <Route path="/tools/extract-text-pdf" element={<ExtractTextPdf />} />
            <Route path="/tools/organize-pdf" element={<OrganizePdf />} />
            <Route path="/tools/html-to-pdf" element={<HtmlToPdf />} />
            <Route path="/tools/excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="/tools/powerpoint-to-pdf" element={<PowerPointToPdf />} />

            {/* Calculator Tools */}
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/tip-calculator" element={<TipCalculator />} />
            <Route path="/tools/hex-to-rgb" element={<HexToRgb />} />
            <Route path="/tools/number-base-converter" element={<NumberBaseConverter />} />

            {/* Text Tools */}
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/base64-tool" element={<Base64Tool />} />
            <Route path="/tools/markdown-to-html" element={<MarkdownToHtml />} />
            <Route path="/tools/text-diff" element={<TextDiff />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
            <Route path="/tools/url-decoder" element={<UrlDecoder />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/csv-to-json" element={<CsvToJson />} />
            <Route path="/tools/text-encryption" element={<TextEncryption />} />
            <Route path="/tools/morse-code-translator" element={<MorseCodeTranslator />} />
            <Route path="/tools/regex-tester" element={<RegexTester />} />
            <Route path="/tools/document-translator" element={<DocumentTranslator />} />

            {/* Utility Tools */}
            <Route path="/tools/qr-code-generator" element={<QRCodeGenerator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/timer-stopwatch" element={<TimerStopwatch />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/budget-tracker" element={<BudgetTracker />} />
            <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
            <Route path="/tools/url-shortener" element={<UrlShortener />} />
            <Route path="/tools/email-validator" element={<EmailValidator />} />
            <Route path="/tools/password-strength" element={<PasswordStrength />} />
            <Route path="/tools/file-hash-checker" element={<FileHashChecker />} />
            <Route path="/tools/whois-lookup" element={<WhoisLookup />} />
            <Route path="/tools/dns-lookup" element={<DnsLookup />} />
            <Route path="/tools/ip-geolocation" element={<IpGeolocation />} />
            <Route path="/tools/credit-card-validator" element={<CreditCardValidator />} />
            <Route path="/tools/emoji-picker" element={<EmojiPicker />} />
            <Route path="/tools/invoice-generator" element={<InvoiceGenerator />} />
            <Route path="/tools/receipt-generator" element={<ReceiptGenerator />} />
            <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
            <Route path="/tools/business-card-generator" element={<BusinessCardGenerator />} />
            <Route path="/tools/pdf-ocr" element={<PdfOcr />} />
            <Route path="/tools/sign-pdf" element={<SignPdfTool />} />
            <Route path="/tools/edit-pdf-text" element={<EditPdfText />} />
            <Route path="/tools/edit-pdf" element={<EditPdf />} />
            <Route path="/tools/crop-pdf" element={<CropPdf />} />
            <Route path="/tools/rotate-pdf" element={<RotatePdf />} />
            <Route path="/tools/redact-pdf" element={<RedactPdf />} />
            <Route path="/tools/repair-pdf" element={<RepairPdf />} />
            <Route path="/tools/pdf-to-pdfa" element={<PdfToPdfA />} />
            <Route path="/tools/pdf-to-powerpoint" element={<PdfToPowerPoint />} />
            <Route path="/tools/unlock-pdf" element={<UnlockPdf />} />
            <Route path="/tools/pdf-to-excel" element={<PdfToExcel />} />
            <Route path="/tools/test-card-generator" element={<TestCardGenerator />} />

            {/* Redirect removed tools to homepage */}
            <Route path="/tools/website-screenshot" element={<NotFound />} />
            <Route path="/tools/qr-code-scanner" element={<NotFound />} />
            <Route path="/tools/uuid-generator" element={<NotFound />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
            </Suspense>
        </Layout>
        <Toaster />
      </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
