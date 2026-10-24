
import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import ScrollAnimation from "./ScrollAnimation";
import ToolSeoHead from "./ToolSeoHead";
import ToolFaqSection from "./ToolFaqSection";
import ToolSeoArticle from "./ToolSeoArticle";
import RelatedTools from "./RelatedTools";





interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <ScrollAnimation />

      {/* Optimized Modern Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle gradient background with better performance */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 transition-colors duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.02),transparent_60%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.10),transparent_60%)]" />
        </div>

        {/* Subtle grid pattern with better performance */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.006)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
      </div>

      {/* Navigation component now handles its own header */}
      <Navigation />
      
      {/* Main content with optimized spacing */}
      <main className="flex-1 relative z-10 w-full overflow-hidden">
        {children}

        <ToolSeoArticle />

        <RelatedTools />

        <ToolFaqSection />
      </main>






      {/* Route-aware SEO head; rendered last so it overrides page-level tags */}
      <ToolSeoHead />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Layout;
