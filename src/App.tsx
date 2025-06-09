
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ImageCompressor from "./pages/tools/ImageCompressor";
import ImageResizer from "./pages/tools/ImageResizer";
import ImageEnhancer from "./pages/tools/ImageEnhancer";
import JpgToPdf from "./pages/tools/JpgToPdf";
import SvgToJpg from "./pages/tools/SvgToJpg";
import VideoToGif from "./pages/tools/VideoToGif";
import ImageToUrl from "./pages/tools/ImageToUrl";
import BackgroundRemover from "./pages/tools/BackgroundRemover";
import PassportPhotoMaker from "./pages/tools/PassportPhotoMaker";
import ImageFormatConverter from "./pages/tools/ImageFormatConverter";
import MergePDF from "./pages/tools/MergePDF";
import SplitPdf from "./pages/tools/SplitPdf";
import CompressPdf from "./pages/tools/CompressPdf";
import PdfToJpg from "./pages/tools/PdfToJpg";
import EditPdf from "./pages/tools/EditPdf";
import CropPdf from "./pages/tools/CropPdf";
import PercentageCalculator from "./pages/tools/PercentageCalculator";
import UnitConverter from "./pages/tools/UnitConverter";
import CurrencyConverter from "./pages/tools/CurrencyConverter";
import AgeCalculator from "./pages/tools/AgeCalculator";
import BmiCalculator from "./pages/tools/BmiCalculator";
import LoanCalculator from "./pages/tools/LoanCalculator";
import TipCalculator from "./pages/tools/TipCalculator";
import WordCounter from "./pages/tools/WordCounter";
import CaseConverter from "./pages/tools/CaseConverter";
import Base64Tool from "./pages/tools/Base64Tool";
import MarkdownToHtml from "./pages/tools/MarkdownToHtml";
import TextDiff from "./pages/tools/TextDiff";
import LoremIpsum from "./pages/tools/LoremIpsum";
import QRCodeGenerator from "./pages/tools/QRCodeGenerator";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import UrlShortener from "./pages/tools/UrlShortener";
import HashGenerator from "./pages/tools/HashGenerator";
import TimerStopwatch from "./pages/tools/TimerStopwatch";
import ColorPicker from "./pages/tools/ColorPicker";
import BudgetTracker from "./pages/tools/BudgetTracker";
import BarcodeGenerator from "./pages/tools/BarcodeGenerator";
import UuidGenerator from "./pages/tools/UuidGenerator";
import FileConverter from "./pages/tools/FileConverter";
import ZipExtractor from "./pages/tools/ZipExtractor";
import FileSizeConverter from "./pages/tools/FileSizeConverter";
import DuplicateFileFinder from "./pages/tools/DuplicateFileFinder";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <HelmetProvider>
      <Router>
        {/* Layout component already includes header and footer */}
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Image Tools */}
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/image-enhancer" element={<ImageEnhancer />} />
            <Route path="/tools/jpg-to-pdf" element={<JpgToPdf />} />
            <Route path="/tools/svg-to-jpg" element={<SvgToJpg />} />
            <Route path="/tools/video-to-gif" element={<VideoToGif />} />
            <Route path="/tools/image-to-url" element={<ImageToUrl />} />
            <Route path="/tools/background-remover" element={<BackgroundRemover />} />
            <Route path="/tools/passport-photo-maker" element={<PassportPhotoMaker />} />
            <Route path="/tools/image-format-converter" element={<ImageFormatConverter />} />
            
            {/* PDF Tools */}
            <Route path="/tools/merge-pdf" element={<MergePDF />} />
            <Route path="/tools/split-pdf" element={<SplitPdf />} />
            <Route path="/tools/compress-pdf" element={<CompressPdf />} />
            <Route path="/tools/pdf-to-jpg" element={<PdfToJpg />} />
            <Route path="/tools/edit-pdf" element={<EditPdf />} />
            <Route path="/tools/crop-pdf" element={<CropPdf />} />
            
            {/* Calculators & Converters */}
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/tip-calculator" element={<TipCalculator />} />
            
            {/* Text Tools */}
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/base64-tool" element={<Base64Tool />} />
            <Route path="/tools/markdown-to-html" element={<MarkdownToHtml />} />
            <Route path="/tools/text-diff" element={<TextDiff />} />
            <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
            
            {/* Utilities */}
            <Route path="/tools/qr-code-generator" element={<QRCodeGenerator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/url-shortener" element={<UrlShortener />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/timer-stopwatch" element={<TimerStopwatch />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/budget-tracker" element={<BudgetTracker />} />
            <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            
            {/* File Tools */}
            <Route path="/tools/file-converter" element={<FileConverter />} />
            <Route path="/tools/zip-extractor" element={<ZipExtractor />} />
            <Route path="/tools/file-size-converter" element={<FileSizeConverter />} />
            <Route path="/tools/duplicate-file-finder" element={<DuplicateFileFinder />} />
          </Routes>
        </Layout>
        {/* Toaster is outside Layout to avoid duplication */}
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;
