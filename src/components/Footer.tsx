
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-8 mt-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">ToolifyConvert</h3>
            <p className="text-gray-600">
              Free online tools to make your digital tasks easier.
              No sign-up required. Always free.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/image-compressor" className="text-gray-600 hover:text-indigo-600 transition-colors">Image Compressor</Link></li>
              <li><Link to="/tools/merge-pdf" className="text-gray-600 hover:text-indigo-600 transition-colors">Merge PDF</Link></li>
              <li><Link to="/tools/percentage-calculator" className="text-gray-600 hover:text-indigo-600 transition-colors">Percentage Calculator</Link></li>
              <li><Link to="/tools/word-counter" className="text-gray-600 hover:text-indigo-600 transition-colors">Word Counter</Link></li>
              <li><Link to="/tools/qr-code-generator" className="text-gray-600 hover:text-indigo-600 transition-colors">QR Code Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-gray-600 hover:text-indigo-600 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">Connect</h3>
            <div className="flex space-x-4">
              {/* Social media links would go here */}
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-gray-600">© {currentYear} ToolifyConvert. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
