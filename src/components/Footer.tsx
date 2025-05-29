
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gray-900 text-white py-12 mt-16 z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-white">ToolifyConvert</h3>
            <p className="text-gray-300 leading-relaxed">
              Free online tools to make your digital tasks easier.
              No sign-up required. Always free.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Popular Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/tools/image-compressor" className="text-gray-300 hover:text-white transition-colors">Image Compressor</Link></li>
              <li><Link to="/tools/merge-pdf" className="text-gray-300 hover:text-white transition-colors">Merge PDF</Link></li>
              <li><Link to="/tools/percentage-calculator" className="text-gray-300 hover:text-white transition-colors">Percentage Calculator</Link></li>
              <li><Link to="/tools/word-counter" className="text-gray-300 hover:text-white transition-colors">Word Counter</Link></li>
              <li><Link to="/tools/qr-code-generator" className="text-gray-300 hover:text-white transition-colors">QR Code Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-gray-300 hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Connect</h3>
            <div className="flex space-x-4">
              <p className="text-gray-300">Follow us on social media for updates and tips</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-300">© {currentYear} ToolifyConvert. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
