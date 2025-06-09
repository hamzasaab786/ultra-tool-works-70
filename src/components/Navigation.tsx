
import React from "react";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Navigation = () => {
  return (
    <NavigationMenu className="max-w-screen-2xl mx-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            Home
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Image Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[500px]">
              <Link to="/tools/image-compressor" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Image Compressor</div>
                <p className="text-sm text-muted-foreground">Reduce image file size with minimal quality loss</p>
              </Link>
              <Link to="/tools/image-resizer" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Image Resizer</div>
                <p className="text-sm text-muted-foreground">Change dimensions of your images easily</p>
              </Link>
              <Link to="/tools/image-enhancer" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Image Enhancer</div>
                <p className="text-sm text-muted-foreground">Adjust brightness, contrast and more</p>
              </Link>
              <Link to="/tools/jpg-to-pdf" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">JPG to PDF</div>
                <p className="text-sm text-muted-foreground">Convert images to PDF documents</p>
              </Link>
              <Link to="/tools/svg-to-jpg" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">SVG to JPG</div>
                <p className="text-sm text-muted-foreground">Convert SVG vector graphics to high-quality JPG images</p>
              </Link>
              <Link to="/tools/image-to-url" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Image to URL</div>
                <p className="text-sm text-muted-foreground">Convert images to shareable URLs</p>
              </Link>
              <Link to="/tools/background-remover" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Background Remover</div>
                <p className="text-sm text-muted-foreground">Remove backgrounds from images with AI</p>
              </Link>
              <Link to="/tools/passport-photo-maker" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Passport Photo Maker</div>
                <p className="text-sm text-muted-foreground">Create professional passport photos</p>
              </Link>
              <Link to="/tools/image-format-converter" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Image Format Converter</div>
                <p className="text-sm text-muted-foreground">Convert between PNG, JPG, WebP, and other formats</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>PDF Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <Link to="/tools/merge-pdf" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Merge PDF</div>
                <p className="text-sm text-muted-foreground">Combine multiple PDF files into one</p>
              </Link>
              <Link to="/tools/split-pdf" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Split PDF</div>
                <p className="text-sm text-muted-foreground">Extract specific pages from PDF documents</p>
              </Link>
              <Link to="/tools/pdf-to-jpg" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">PDF to JPG</div>
                <p className="text-sm text-muted-foreground">Convert PDF pages to high-quality images</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Calculators</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <Link to="/tools/percentage-calculator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Percentage Calculator</div>
                <p className="text-sm text-muted-foreground">Calculate percentages easily</p>
              </Link>
              <Link to="/tools/unit-converter" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Unit Converter</div>
                <p className="text-sm text-muted-foreground">Convert between different units of measurement</p>
              </Link>
              <Link to="/tools/currency-converter" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Currency Converter</div>
                <p className="text-sm text-muted-foreground">Convert between major world currencies</p>
              </Link>
              <Link to="/tools/age-calculator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Age Calculator</div>
                <p className="text-sm text-muted-foreground">Calculate exact age between any two dates</p>
              </Link>
              <Link to="/tools/bmi-calculator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">BMI Calculator</div>
                <p className="text-sm text-muted-foreground">Calculate your Body Mass Index and health status</p>
              </Link>
              <Link to="/tools/loan-calculator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Loan Calculator</div>
                <p className="text-sm text-muted-foreground">Calculate monthly payments and interest</p>
              </Link>
              <Link to="/tools/tip-calculator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Tip Calculator</div>
                <p className="text-sm text-muted-foreground">Calculate tips and split bills easily</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Text Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <Link to="/tools/word-counter" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Word & Character Counter</div>
                <p className="text-sm text-muted-foreground">Count words, characters, and lines in your text</p>
              </Link>
              <Link to="/tools/case-converter" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Case Converter</div>
                <p className="text-sm text-muted-foreground">Convert text case (uppercase, lowercase, etc.)</p>
              </Link>
              <Link to="/tools/base64-tool" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Base64 Encoder/Decoder</div>
                <p className="text-sm text-muted-foreground">Encode and decode Base64 strings</p>
              </Link>
              <Link to="/tools/markdown-to-html" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Markdown to HTML</div>
                <p className="text-sm text-muted-foreground">Convert Markdown text to HTML code</p>
              </Link>
              <Link to="/tools/text-diff" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Text Diff Checker</div>
                <p className="text-sm text-muted-foreground">Compare two texts and highlight differences</p>
              </Link>
              <Link to="/tools/lorem-ipsum" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Lorem Ipsum Generator</div>
                <p className="text-sm text-muted-foreground">Generate placeholder text for design projects</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Utilities</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <Link to="/tools/qr-code-generator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">QR Code Generator</div>
                <p className="text-sm text-muted-foreground">Create QR codes for various purposes</p>
              </Link>
              <Link to="/tools/password-generator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Password Generator</div>
                <p className="text-sm text-muted-foreground">Generate strong, secure passwords</p>
              </Link>
              <Link to="/tools/hash-generator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Hash Generator</div>
                <p className="text-sm text-muted-foreground">Generate MD5, SHA-1, SHA-256 hashes</p>
              </Link>
              <Link to="/tools/timer-stopwatch" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Timer & Stopwatch</div>
                <p className="text-sm text-muted-foreground">Professional timer and stopwatch</p>
              </Link>
              <Link to="/tools/color-picker" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Color Picker</div>
                <p className="text-sm text-muted-foreground">Pick colors and get HEX, RGB, HSL values</p>
              </Link>
              <Link to="/tools/budget-tracker" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Budget Tracker</div>
                <p className="text-sm text-muted-foreground">Track your monthly income and expenses</p>
              </Link>
              <Link to="/tools/barcode-generator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Barcode Generator</div>
                <p className="text-sm text-muted-foreground">Generate various types of barcodes</p>
              </Link>
              <Link to="/tools/uuid-generator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">UUID Generator</div>
                <p className="text-sm text-muted-foreground">Generate unique identifiers for your projects</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
