
import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import ScrollAnimation from "./ScrollAnimation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScrollAnimation />
      
      {/* Clean Modern Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.05),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.03),transparent_50%)]" />
        </div>
        
        {/* Minimal floating elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-indigo-400/8 to-purple-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-purple-400/6 to-violet-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.008)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center relative z-10">
          <div className="mr-4 flex items-center">
            <a href="/" className="flex items-center group">
              <div className="relative transform transition-transform duration-200 group-hover:scale-105">
                <span className="text-2xl lg:text-3xl font-bold gradient-text">
                  ToolifyConvert
                </span>
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
