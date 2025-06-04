
import React from "react";
import { Helmet } from "react-helmet-async";
import ToolSEOContent from "@/components/ToolSEOContent";

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
        <title>{title} | ToolifyConvert - Free Online Tools</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="theme-color" content="#6366f1" />
        {keywords && <meta name="keywords" content={keywords} />}
        
        {/* Enhanced mobile optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ToolifyConvert" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="true" />
        
        {/* Performance optimization */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Enhanced Open Graph for social sharing */}
        <meta property="og:title" content={`${title} | ToolifyConvert`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ToolifyConvert" />
        <meta property="og:locale" content="en_US" />
        
        {/* Enhanced Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ToolifyConvert" />
        <meta name="twitter:title" content={`${title} | ToolifyConvert`} />
        <meta name="twitter:description" content={description} />
        
        {/* Enhanced SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Structured data for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": title,
            "description": description,
            "applicationCategory": "Utility",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "provider": {
              "@type": "Organization",
              "name": "ToolifyConvert"
            }
          })}
        </script>
      </Helmet>
      
      <div className="w-full min-h-screen">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-6xl">
          {/* Enhanced header with better typography */}
          <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              {description}
            </p>
          </div>
          
          {/* Enhanced main content area with better responsive design */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-gray-200/50 p-4 sm:p-6 lg:p-8 xl:p-10 overflow-hidden">
              <div className="w-full">
                {children}
              </div>
            </div>
          </div>
          
          {/* Enhanced SEO Content Section */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <ToolSEOContent toolName={title} />
          </div>
          
          {/* Mobile-friendly spacing */}
          <div className="h-6 sm:h-8 lg:h-12"></div>
        </div>
      </div>
    </>
  );
};

export default ToolPageTemplate;
