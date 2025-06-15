import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";

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
    { name: "Background Remover", path: "/tools/background-remover" },
    { name: "Passport Photo Maker", path: "/tools/passport-photo-maker" },
    { name: "Image Format Converter", path: "/tools/image-format-converter" },
    { name: "Image Metadata Extractor", path: "/tools/image-metadata-extractor" },
    { name: "Remove Watermark", path: "/tools/remove-watermark" },
  ];

  const pdfTools = [
    { name: "Merge PDF", path: "/tools/merge-pdf" },
    { name: "Split PDF", path: "/tools/split-pdf" },
    { name: "PDF to JPG", path: "/tools/pdf-to-jpg" },
    { name: "PDF Compressor", path: "/tools/pdf-compressor" },
    { name: "PDF Password Protector", path: "/tools/pdf-password-protector" },
    { name: "Pdf to Excel", path: "/tools/PdfToExcel" },
    { name: "Unlock Pdf", path: "/tools/UnlockPdf" },
    { name: "PDF Metadata Extractor", path: "/tools/pdf-metadata-extractor" },
    { name: "Add Page Numbers", path: "/tools/add-page-numbers" },
    { name: "Compare PDF", path: "/tools/compare-pdf" },
    { name: "Add Watermark", path: "/tools/add-watermark" },
  ];

  const calculatorTools = [
    { name: "Percentage Calculator", path: "/tools/percentage-calculator" },
    { name: "Unit Converter", path: "/tools/unit-converter" },
    { name: "Currency Converter", path: "/tools/currency-converter" },
    { name: "Age Calculator", path: "/tools/age-calculator" },
    { name: "BMI Calculator", path: "/tools/bmi-calculator" },
    { name: "Loan Calculator", path: "/tools/loan-calculator" },
    { name: "Tip Calculator", path: "/tools/tip-calculator" },
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
    { name: "QR Code Scanner", path: "/tools/qr-code-scanner" },
    { name: "Password Generator", path: "/tools/password-generator" },
    { name: "Hash Generator", path: "/tools/hash-generator" },
    { name: "Timer & Stopwatch", path: "/tools/timer-stopwatch" },
    { name: "Color Picker", path: "/tools/color-picker" },
    { name: "Budget Tracker", path: "/tools/budget-tracker" },
    { name: "Barcode Generator", path: "/tools/barcode-generator" },
    { name: "UUID Generator", path: "/tools/uuid-generator" },
    { name: "URL Shortener", path: "/tools/url-shortener" },
    { name: "Email Validator", path: "/tools/email-validator" },
    { name: "Password Strength", path: "/tools/password-strength" },
    { name: "File Hash Checker", path: "/tools/file-hash-checker" },
    { name: "Whois Lookup", path: "/tools/whois-lookup" },
    { name: "DNS Lookup", path: "/tools/dns-lookup" },
    { name: "IP Geolocation", path: "/tools/ip-geolocation" },
    { name: "Credit Card Validator", path: "/tools/credit-card-validator" },
    { name: "Emoji Picker", path: "/tools/emoji-picker" },
    { name: "Website Screenshot", path: "/tools/website-screenshot" },
  ];

  const ToolSection = ({ title, tools }: { title: string; tools: { name: string; path: string }[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 w-[600px]">
      <div className="col-span-full">
        <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      </div>
      {tools.map((tool) => (
        <Link
          key={tool.path}
          to={tool.path}
          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
        >
          {tool.name}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 border-b border-gray-200/60 shadow-sm">
      <div className="container mx-auto px-4 py-3 lg:py-4 flex items-center relative z-10">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center group">
            <div className="relative transform transition-transform duration-200 group-hover:scale-105">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                ToolifyConvert
              </span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block flex-1">
          <NavigationMenu>
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  🖼️ Image Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Image Processing Tools" tools={imageTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  📄 PDF Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="PDF Management Tools" tools={pdfTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  🧮 Calculators
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Calculator & Converter Tools" tools={calculatorTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  📝 Text Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Text Processing Tools" tools={textTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  🛠️ Utilities
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Utility Tools" tools={utilityTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
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
        <div className="md:hidden py-4 border-t bg-white/95 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🖼️ Image Tools</h3>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {imageTools.slice(0, 5).map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📄 PDF Tools</h3>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {pdfTools.slice(0, 5).map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🧮 Calculators</h3>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {calculatorTools.slice(0, 5).map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📝 Text Tools</h3>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {textTools.slice(0, 5).map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🛠️ Utilities</h3>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {utilityTools.slice(0, 5).map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
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
