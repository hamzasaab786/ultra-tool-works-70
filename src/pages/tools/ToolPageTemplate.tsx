
import React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

interface ToolPageTemplateProps {
  title: string;
  description: string;
  children: React.ReactNode;
  keywords?: string;
}

const ToolPageTemplate: React.FC<ToolPageTemplateProps> = ({
  title,
  description,
  children,
  keywords
}) => {
  return (
    <>
      <Helmet>
        <title>{title} | ToolifyConvert</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#6366f1" />
        {keywords && <meta name="keywords" content={keywords} />}
        
        {/* Mobile-specific meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Open Graph for social sharing */}
        <meta property="og:title" content={`${title} | ToolifyConvert`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | ToolifyConvert`} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl">
          <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl sm:rounded-3xl shadow-xl border border-indigo-100/50 dark:border-slate-700/50 p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
            <div className="w-full overflow-hidden">
              {children}
            </div>
          </div>
          
          {/* Mobile-friendly footer spacing */}
          <div className="h-16 sm:h-8"></div>
        </div>
      </Layout>
    </>
  );
};

export default ToolPageTemplate;
