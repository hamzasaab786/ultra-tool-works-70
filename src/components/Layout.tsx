
import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import ScrollAnimation from "./ScrollAnimation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ScrollAnimation />
      
      {/* Ultra Modern Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-orange-500/20 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-green-400/20 to-teal-500/20 rounded-full blur-3xl animate-float delay-500"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/20 backdrop-blur-xl bg-white/80 shadow-lg shadow-blue-500/10">
        <div className="container mx-auto px-4 py-4 flex items-center relative z-10">
          <div className="mr-4 flex items-center">
            <a href="/" className="flex items-center group">
              <div className="relative">
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-glow hover:scale-105 transition-transform duration-300">
                  ToolifyConvert
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              </div>
            </a>
          </div>
          <div className="flex-1">
            <Navigation />
          </div>
        </div>
      </header>
      
      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
