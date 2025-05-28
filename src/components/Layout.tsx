
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
      
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-500/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b glassmorphism backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center relative z-10">
          <div className="mr-4 flex items-center">
            <a href="/" className="flex items-center group">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 animate-glow text-3d">
                ToolifyConvert
              </span>
            </a>
          </div>
          <div className="flex-1">
            <Navigation />
          </div>
        </div>
      </header>
      
      <main className="flex-1 relative z-10 gradient-mesh">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
