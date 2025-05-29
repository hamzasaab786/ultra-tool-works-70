
import React from "react";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Navigation = () => {
  return (
    <NavigationMenu className="max-w-screen-2xl mx-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link 
            to="/" 
            className={`${navigationMenuTriggerStyle()} text-white hover:text-cyan-300 transition-all duration-300 hover:bg-white/10`}
          >
            Home
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-cyan-300 transition-all duration-300 hover:bg-white/10">
            Image Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[500px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl">
              <Link 
                to="/tools/image-compressor" 
                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 hover:text-cyan-300"
              >
                <div className="font-medium leading-none text-white">Image Compressor</div>
                <p className="text-sm text-white/70 mt-2">Reduce image file size with minimal quality loss</p>
              </Link>
              <Link 
                to="/tools/image-resizer" 
                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 hover:text-cyan-300"
              >
                <div className="font-medium leading-none text-white">Image Resizer</div>
                <p className="text-sm text-white/70 mt-2">Change dimensions of your images easily</p>
              </Link>
              <Link 
                to="/tools/background-remover" 
                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 hover:text-cyan-300"
              >
                <div className="font-medium leading-none text-white">Background Remover</div>
                <p className="text-sm text-white/70 mt-2">Remove backgrounds from images with AI</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-cyan-300 transition-all duration-300 hover:bg-white/10">
            PDF Tools
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl">
              <Link 
                to="/tools/merge-pdf" 
                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 hover:text-cyan-300"
              >
                <div className="font-medium leading-none text-white">Merge PDF</div>
                <p className="text-sm text-white/70 mt-2">Combine multiple PDF files into one</p>
              </Link>
              <Link 
                to="/tools/split-pdf" 
                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 hover:text-cyan-300"
              >
                <div className="font-medium leading-none text-white">Split PDF</div>
                <p className="text-sm text-white/70 mt-2">Extract specific pages from PDF documents</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-cyan-300 transition-all duration-300 hover:bg-white/10">
            Calculators
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl">
              <Link 
                to="/tools/currency-converter" 
                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 hover:text-cyan-300"
              >
                <div className="font-medium leading-none text-white">Currency Converter</div>
                <p className="text-sm text-white/70 mt-2">Convert between major world currencies</p>
              </Link>
              <Link 
                to="/tools/percentage-calculator" 
                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 hover:text-cyan-300"
              >
                <div className="font-medium leading-none text-white">Percentage Calculator</div>
                <p className="text-sm text-white/70 mt-2">Calculate percentages easily</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-cyan-300 transition-all duration-300 hover:bg-white/10">
            Utilities
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl">
              <Link 
                to="/tools/qr-code-generator" 
                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 hover:text-cyan-300"
              >
                <div className="font-medium leading-none text-white">QR Code Generator</div>
                <p className="text-sm text-white/70 mt-2">Create QR codes for various purposes</p>
              </Link>
              <Link 
                to="/tools/password-generator" 
                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-white/10 hover:text-cyan-300"
              >
                <div className="font-medium leading-none text-white">Password Generator</div>
                <p className="text-sm text-white/70 mt-2">Generate strong, secure passwords</p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
