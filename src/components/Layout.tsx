
import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import ScrollAnimation from "./ScrollAnimation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <ScrollAnimation />
      
      {/* Enhanced Modern Background with consistent color scheme */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)]" />
        </div>
        
        {/* Floating 3D elements with cohesive purple-indigo scheme */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-indigo-400/12 to-purple-500/12 rounded-full blur-3xl animate-mesh-1 floating-element"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/12 to-violet-500/12 rounded-full blur-3xl animate-mesh-2 floating-element"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-r from-violet-400/10 to-indigo-500/10 rounded-full blur-3xl animate-float floating-element"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-bounce-gentle floating-element"></div>
        
        {/* Enhanced Grid Pattern Overlay with consistent colors */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.015)_1px,transparent_1px)] bg-[size:64px_64px] mouse-parallax"></div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgICAgPGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjIiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjAzIi8+Cjwvc3ZnPg==')]"></div>
      </div>

      {/* Enhanced Header with improved glassmorphism */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/85 border-b border-indigo-100/30 shadow-lg shadow-indigo-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-indigo-50/20 to-white/95" />
        <div className="container mx-auto px-4 py-4 flex items-center relative z-10">
          <div className="mr-4 flex items-center">
            <a href="/" className="flex items-center group">
              <div className="relative transform transition-transform duration-300 group-hover:scale-105">
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 drop-shadow-sm">
                  ToolifyConvert
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-violet-600/15 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
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
