
import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import ScrollAnimation from "./ScrollAnimation";
import ToolSeoHead from "./ToolSeoHead";
import ToolFaqSection from "./ToolFaqSection";
import ToolSeoArticle from "./ToolSeoArticle";
import RelatedTools from "./RelatedTools";
import AdsterraNative from "./ads/AdsterraNative";
import AdsterraResponsiveAd from "./ads/AdsterraResponsiveAd";





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

        {/* Optimized floating elements with reduced animation load */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-indigo-400/6 to-purple-500/6 dark:from-indigo-500/8 dark:to-purple-500/8 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-purple-400/4 to-violet-500/4 dark:from-purple-500/8 dark:to-violet-500/8 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>

        {/* Subtle grid pattern with better performance */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.006)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.006)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
      </div>

      {/* Navigation component now handles its own header */}
      <Navigation />
      
      {/* Main content with optimized spacing */}
      <main className="flex-1 relative z-10 w-full overflow-hidden">
        {children}

        {/* Responsive top banner: 320x50 on mobile, 468x60 on desktop */}
        <AdsterraResponsiveAd
          variants={[
            { maxWidth: 640, adKey: "4d4c58fa4b319e0d3384c6b3841162c6", width: 320, height: 50, label: "Mobile" },
            { maxWidth: 9999, adKey: "a12b748603de2316c41b40c80d031b8e", width: 468, height: 60, label: "Desktop" },
          ]}
        />

        <AdsterraNative />
        <ToolSeoArticle />

        {/* Responsive skyscraper: 320x50 on mobile, 160x300 on desktop */}
        <AdsterraResponsiveAd
          variants={[
            { maxWidth: 640, adKey: "4d4c58fa4b319e0d3384c6b3841162c6", width: 320, height: 50, label: "Mobile" },
            { maxWidth: 9999, adKey: "38fcb1c657b604f630f79cb846ce6e8d", width: 160, height: 300, label: "Desktop" },
          ]}
        />

        <RelatedTools />

        <ToolFaqSection />

        {/* Responsive square: 320x50 on mobile, 300x250 on desktop */}
        <AdsterraResponsiveAd
          variants={[
            { maxWidth: 640, adKey: "4d4c58fa4b319e0d3384c6b3841162c6", width: 320, height: 50, label: "Mobile" },
            { maxWidth: 9999, adKey: "8733cc7cd38bc0b47d60fceda97b070b", width: 300, height: 250, label: "Desktop" },
          ]}
        />
      </main>






      {/* Route-aware SEO head; rendered last so it overrides page-level tags */}
      <ToolSeoHead />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Layout;
