
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
        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
          <div className="mb-8 lg:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 gradient-text">
              {title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="glassmorphism rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/50 p-6 sm:p-8 lg:p-10">
            <div className="w-full overflow-hidden">
              {children}
            </div>
          </div>
          
          {/* Mobile-friendly spacing */}
          <div className="h-8 sm:h-4"></div>
        </div>
      </Layout>
    </>
  );
};

export default ToolPageTemplate;
