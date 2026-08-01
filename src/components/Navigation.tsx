import React, { useState } from "react";
import { Link } from "react-router-dom";
import klipzaLogo from "@/assets/klipza-logo.png";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const imageTools = [
    { name: "Image Compressor", path: "/tools/image-compressor" },
    { name: "Image Resizer", path: "/tools/image-resizer" },
    { name: "Image Enhancer", path: "/tools/image-enhancer" },
    { name: "Image Crop Tool", path: "/tools/image-crop-tool" },
    { name: "JPG to PDF", path: "/tools/jpg-to-pdf" },
    { name: "SVG to JPG", path: "/tools/svg-to-jpg" },
    { name: "Image to URL", path: "/tools/image-to-url" },
    
    { name: "Passport Photo Maker", path: "/tools/passport-photo-maker" },
    { name: "Image Format Converter", path: "/tools/image-format-converter" },
    { name: "Image to Text (OCR)", path: "/tools/image-to-text" },
    { name: "Image Metadata Extractor", path: "/tools/image-metadata-extractor" },
    { name: "Remove Watermark", path: "/tools/remove-watermark" },
  ];

  const pdfTools = [
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
  ];

  const calculatorTools = [
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
  ];

  const textTools = [
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

  const utilityTools = [
    { name: "QR Code Generator", path: "/tools/qr-code-generator" },
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
  ];

  const ToolSection = ({ title, tools }: { title: string; tools: { name: string; path: string }[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 w-[600px] bg-popover text-popover-foreground">
      <div className="col-span-full">
        <h3 className="font-semibold text-foreground mb-3">{title}</h3>
      </div>
      {tools.map((tool) => (
        <Link
          key={tool.path}
          to={tool.path}
          className="block px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
        >
          {tool.name}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/95 border-b border-border/60 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 lg:py-4 flex items-center relative z-10">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={klipzaLogo}
              alt="Klipza logo"
              width={40}
              height={40}
              className="h-8 w-8 sm:h-9 sm:w-9 transform transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Klipza
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  🖼️ Image Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Image Processing Tools" tools={imageTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  📄 PDF Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="PDF Management Tools" tools={pdfTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  🧮 Calculators
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Calculator & Converter Tools" tools={calculatorTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  📝 Text Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Text Processing Tools" tools={textTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  🛠️ Utilities
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Utility Tools" tools={utilityTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 border-t bg-background/95 backdrop-blur-xl transition-colors duration-300 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
          <div className="container mx-auto px-4">
            <div className="space-y-4">
              <div>
                <Link
                  to="/#category-0"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-0')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  🖼️ Image Tools
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {imageTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to="/#category-1"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-1')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  📄 PDF Tools
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {pdfTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to="/#category-2"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-2')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  🧮 Calculators
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {calculatorTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to="/#category-3"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-3')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  📝 Text Tools
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {textTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to="/#category-4"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-4')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  🛠️ Utilities
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {utilityTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
