
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
      
      {/* Enhanced Modern Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(156,163,175,0.1),transparent_50%)]" />
        </div>
        
        {/* Floating 3D elements with enhanced animations */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-mesh-1 floating-element"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-mesh-2 floating-element"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-r from-pink-400/15 to-orange-500/15 rounded-full blur-3xl animate-float floating-element"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-r from-green-400/15 to-teal-500/15 rounded-full blur-3xl animate-bounce-gentle floating-element"></div>
        
        {/* Enhanced Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px] mouse-parallax"></div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgICAgPGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjIiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjAzIi8+Cjwvc3ZnPg==')]"></div>
      </div>

      {/* Enhanced Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-blue-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/90" />
        <div className="container mx-auto px-4 py-4 flex items-center relative z-10">
          <div className="mr-4 flex items-center">
            <a href="/" className="flex items-center group">
              <div className="relative transform transition-transform duration-300 group-hover:scale-105">
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 drop-shadow-sm">
                  ToolifyConvert
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
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
