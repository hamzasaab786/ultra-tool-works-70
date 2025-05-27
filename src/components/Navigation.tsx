
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
              <Link to="/tools/compress-pdf" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <div className="font-medium leading-none">Compress PDF</div>
                <p className="text-sm text-muted-foreground">Reduce PDF file size</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Calculators & Converters</NavigationMenuTrigger>
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
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
