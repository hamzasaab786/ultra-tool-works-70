
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

// New Calculator/Converter Tools
import UnitConverter from "./pages/tools/UnitConverter";
import CurrencyConverter from "./pages/tools/CurrencyConverter";

// New Text Tools
import WordCounter from "./pages/tools/WordCounter";
import CaseConverter from "./pages/tools/CaseConverter";
import Base64Tool from "./pages/tools/Base64Tool";

// New Utility Tools
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import TimerStopwatch from "./pages/tools/TimerStopwatch";
import ColorPicker from "./pages/tools/ColorPicker";
import BudgetTracker from "./pages/tools/BudgetTracker";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Ensure document is ready for helmet operations
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
      
      {/* Calculator/Converter Tool Routes */}
      <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
      <Route path="/tools/unit-converter" element={<UnitConverter />} />
      <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
      
      {/* Text Tool Routes */}
      <Route path="/tools/word-counter" element={<WordCounter />} />
      <Route path="/tools/case-converter" element={<CaseConverter />} />
      <Route path="/tools/base64-tool" element={<Base64Tool />} />
      
      {/* Utility Tool Routes */}
      <Route path="/tools/qr-code-generator" element={<QRCodeGenerator />} />
      <Route path="/tools/password-generator" element={<PasswordGenerator />} />
      <Route path="/tools/timer-stopwatch" element={<TimerStopwatch />} />
      <Route path="/tools/color-picker" element={<ColorPicker />} />
      <Route path="/tools/budget-tracker" element={<BudgetTracker />} />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
