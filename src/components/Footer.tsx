
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ToolifyConvert</h3>
            <p className="text-muted-foreground">
              Free online tools to make your digital tasks easier.
              No sign-up required. Always free.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/image-compressor" className="text-muted-foreground hover:text-primary">Image Compressor</Link></li>
              <li><Link to="/tools/merge-pdf" className="text-muted-foreground hover:text-primary">Merge PDF</Link></li>
              <li><Link to="/tools/percentage-calculator" className="text-muted-foreground hover:text-primary">Percentage Calculator</Link></li>
              <li><Link to="/tools/word-counter" className="text-muted-foreground hover:text-primary">Word Counter</Link></li>
              <li><Link to="/tools/qr-code-generator" className="text-muted-foreground hover:text-primary">QR Code Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-muted-foreground hover:text-primary">Disclaimer</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              {/* Social media links would go here */}
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 text-center text-muted-foreground">
          <p>© {currentYear} ToolifyConvert. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
