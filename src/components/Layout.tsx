
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
      
      {/* Optimized Modern Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle gradient background with better performance */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.04),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.02),transparent_60%)]" />
        </div>
        
        {/* Optimized floating elements with reduced animation load */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-indigo-400/6 to-purple-500/6 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-purple-400/4 to-violet-500/4 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
        
        {/* Subtle grid pattern with better performance */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.006)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
      </div>

      {/* Header with Navigation - Only rendered once here */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 border-b border-gray-200/60 shadow-sm">
        <div className="container mx-auto px-4 py-3 lg:py-4 flex items-center relative z-10">
          <div className="mr-4 flex items-center">
            <a href="/" className="flex items-center group">
              <div className="relative transform transition-transform duration-200 group-hover:scale-105">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ToolifyConvert
                </span>
              </div>
            </a>
          </div>
          <div className="flex-1 overflow-hidden">
            <Navigation />
          </div>
        </div>
      </header>
      
      {/* Main content with optimized spacing */}
      <main className="flex-1 relative z-10 w-full overflow-hidden">
        {children}
      </main>
      
      {/* Footer - Only rendered once here */}
      <Footer />
    </div>
  );
};

export default Layout;
