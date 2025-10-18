import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import AboutUs from "@/pages/AboutUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Disclaimer from "@/pages/Disclaimer";

// Image Tools
import ImageCompressor from "@/pages/tools/ImageCompressor";
import ImageResizer from "@/pages/tools/ImageResizer";
import ImageEnhancer from "@/pages/tools/ImageEnhancer";
import JpgToPdf from "@/pages/tools/JpgToPdf";
import SvgToJpg from "@/pages/tools/SvgToJpg";
import ImageToUrl from "@/pages/tools/ImageToUrl";
import BackgroundRemover from "@/pages/tools/BackgroundRemover";
import PassportPhotoMaker from "@/pages/tools/PassportPhotoMaker";
import ImageFormatConverter from "@/pages/tools/ImageFormatConverter";
import ImageMetadataExtractor from "@/pages/tools/ImageMetadataExtractor";
import RemoveWatermark from "@/pages/tools/RemoveWatermark";
import ImageCropTool from "@/pages/tools/ImageCropTool";

// PDF Tools
import MergePDF from "@/pages/tools/MergePDF";
import SplitPdf from "@/pages/tools/SplitPdf";
import PdfToJpg from "@/pages/tools/PdfToJpg";
import PdfCompressor from "@/pages/tools/PdfCompressor";
import PdfToExcel from "@/pages/tools/PdfToExcel";
import UnlockPdf from "@/pages/tools/UnlockPdf";
import PdfMetadataExtractor from "@/pages/tools/PdfMetadataExtractor";
import AddPageNumbers from "@/pages/tools/AddPageNumbers";
import ComparePdf from "@/pages/tools/ComparePdf";
import AddWatermark from "@/pages/tools/AddWatermark";

// Calculator Tools
import PercentageCalculator from "@/pages/tools/PercentageCalculator";
import UnitConverter from "@/pages/tools/UnitConverter";
import CurrencyConverter from "@/pages/tools/CurrencyConverter";
import AgeCalculator from "@/pages/tools/AgeCalculator";
import BmiCalculator from "@/pages/tools/BmiCalculator";
import LoanCalculator from "@/pages/tools/LoanCalculator";
import TipCalculator from "@/pages/tools/TipCalculator";
import HexToRgb from "@/pages/tools/HexToRgb";
import NumberBaseConverter from "@/pages/tools/NumberBaseConverter";

// Text Tools
import WordCounter from "@/pages/tools/WordCounter";
import CaseConverter from "@/pages/tools/CaseConverter";
import Base64Tool from "@/pages/tools/Base64Tool";
import MarkdownToHtml from "@/pages/tools/MarkdownToHtml";
import TextDiff from "@/pages/tools/TextDiff";
import LoremIpsum from "@/pages/tools/LoremIpsum";
import UrlDecoder from "@/pages/tools/UrlDecoder";
import JsonFormatter from "@/pages/tools/JsonFormatter";
import CsvToJson from "@/pages/tools/CsvToJson";
import TextEncryption from "@/pages/tools/TextEncryption";
import MorseCodeTranslator from "@/pages/tools/MorseCodeTranslator";
import RegexTester from "@/pages/tools/RegexTester";
import DocumentTranslator from "@/pages/tools/DocumentTranslator";

// Utility Tools
import QRCodeGenerator from "@/pages/tools/QRCodeGenerator";
import PasswordGenerator from "@/pages/tools/PasswordGenerator";
import HashGenerator from "@/pages/tools/HashGenerator";
import TimerStopwatch from "@/pages/tools/TimerStopwatch";
import ColorPicker from "@/pages/tools/ColorPicker";
import BudgetTracker from "@/pages/tools/BudgetTracker";
import BarcodeGenerator from "@/pages/tools/BarcodeGenerator";
import UrlShortener from "@/pages/tools/UrlShortener";
import EmailValidator from "@/pages/tools/EmailValidator";
import PasswordStrength from "@/pages/tools/PasswordStrength";
import FileHashChecker from "@/pages/tools/FileHashChecker";
import WhoisLookup from "@/pages/tools/WhoisLookup";
import DnsLookup from "@/pages/tools/DnsLookup";
import IpGeolocation from "@/pages/tools/IpGeolocation";
import CreditCardValidator from "@/pages/tools/CreditCardValidator";
import EmojiPicker from "@/pages/tools/EmojiPicker";
import AiContentWriter from "@/pages/tools/AiContentWriter";
import AiEmailGenerator from "@/pages/tools/AiEmailGenerator";
import AiImageAnalyzer from "@/pages/tools/AiImageAnalyzer";

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <Layout>
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
            <Route path="/tools/background-remover" element={<BackgroundRemover />} />
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

            {/* AI Tools */}
            <Route path="/tools/ai-content-writer" element={<AiContentWriter />} />
            <Route path="/tools/ai-email-generator" element={<AiEmailGenerator />} />
            <Route path="/tools/ai-image-analyzer" element={<AiImageAnalyzer />} />

            {/* Redirect removed tools to homepage */}
            <Route path="/tools/website-screenshot" element={<NotFound />} />
            <Route path="/tools/qr-code-scanner" element={<NotFound />} />
            <Route path="/tools/uuid-generator" element={<NotFound />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
};

export default App;
