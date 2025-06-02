import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import NotFound from "./pages/NotFound";

// Tool pages
import QRCodeGenerator from "./pages/tools/QRCodeGenerator";
import ImageCompressor from "./pages/tools/ImageCompressor";
import MergePDF from "./pages/tools/MergePDF";
import PercentageCalculator from "./pages/tools/PercentageCalculator";

// New Image Tools
import ImageEnhancer from "./pages/tools/ImageEnhancer";
import ImageResizer from "./pages/tools/ImageResizer";
import JpgToPdf from "./pages/tools/JpgToPdf";
import ImageToUrl from "./pages/tools/ImageToUrl";
import BackgroundRemover from "./pages/tools/BackgroundRemover";
import PassportPhotoMaker from "./pages/tools/PassportPhotoMaker";
import SvgToJpg from "./pages/tools/SvgToJpg";

// New PDF Tools
import SplitPdf from "./pages/tools/SplitPdf";
import CompressPdf from "./pages/tools/CompressPdf";
import PdfToJpg from "./pages/tools/PdfToJpg";

// Convert to PDF Tools
import WordToPdf from "./pages/tools/WordToPdf";
import PowerPointToPdf from "./pages/tools/PowerPointToPdf";
import ExcelToPdf from "./pages/tools/ExcelToPdf";
import HtmlToPdf from "./pages/tools/HtmlToPdf";

// Convert from PDF Tools
import PdfToWord from "./pages/tools/PdfToWord";

// PDF Security Tools
import ProtectPdf from "./pages/tools/ProtectPdf";

// New Calculator/Converter Tools
import UnitConverter from "./pages/tools/UnitConverter";
import CurrencyConverter from "./pages/tools/CurrencyConverter";

// New Text Tools
import WordCounter from "./pages/tools/WordCounter";
import CaseConverter from "./pages/tools/CaseConverter";
import Base64Tool from "./pages/tools/Base64Tool";
import SpeechConverter from "./pages/tools/SpeechConverter";

// New Utility Tools
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import TimerStopwatch from "./pages/tools/TimerStopwatch";
import ColorPicker from "./pages/tools/ColorPicker";
import BudgetTracker from "./pages/tools/BudgetTracker";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const AppContent = () => {
  useEffect(() => {
    console.log("App initialized, document ready state:", document.readyState);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      
      {/* Image Tool Routes */}
      <Route path="/tools/image-compressor" element={<ImageCompressor />} />
      <Route path="/tools/image-enhancer" element={<ImageEnhancer />} />
      <Route path="/tools/image-resizer" element={<ImageResizer />} />
      <Route path="/tools/jpg-to-pdf" element={<JpgToPdf />} />
      <Route path="/tools/image-to-url" element={<ImageToUrl />} />
      <Route path="/tools/background-remover" element={<BackgroundRemover />} />
      <Route path="/tools/passport-photo-maker" element={<PassportPhotoMaker />} />
      <Route path="/tools/svg-to-jpg" element={<SvgToJpg />} />
      
      {/* PDF Tool Routes */}
      <Route path="/tools/merge-pdf" element={<MergePDF />} />
      <Route path="/tools/split-pdf" element={<SplitPdf />} />
      <Route path="/tools/compress-pdf" element={<CompressPdf />} />
      <Route path="/tools/pdf-to-jpg" element={<PdfToJpg />} />
      
      {/* Convert to PDF Routes */}
      <Route path="/tools/word-to-pdf" element={<WordToPdf />} />
      <Route path="/tools/powerpoint-to-pdf" element={<PowerPointToPdf />} />
      <Route path="/tools/excel-to-pdf" element={<ExcelToPdf />} />
      <Route path="/tools/html-to-pdf" element={<HtmlToPdf />} />
      
      {/* Convert from PDF Routes */}
      <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
      
      {/* PDF Security Routes */}
      <Route path="/tools/protect-pdf" element={<ProtectPdf />} />
      
      {/* Calculator/Converter Tool Routes */}
      <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
      <Route path="/tools/unit-converter" element={<UnitConverter />} />
      <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
      
      {/* Text Tool Routes */}
      <Route path="/tools/word-counter" element={<WordCounter />} />
      <Route path="/tools/case-converter" element={<CaseConverter />} />
      <Route path="/tools/base64-tool" element={<Base64Tool />} />
      <Route path="/tools/speech-converter" element={<SpeechConverter />} />
      
      {/* Utility Tool Routes */}
      <Route path="/tools/qr-code-generator" element={<QRCodeGenerator />} />
      <Route path="/tools/password-generator" element={<PasswordGenerator />} />
      <Route path="/tools/timer-stopwatch" element={<TimerStopwatch />} />
      <Route path="/tools/color-picker" element={<ColorPicker />} />
      <Route path="/tools/budget-tracker" element={<BudgetTracker />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
