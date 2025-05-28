
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
  author?: string;
  robots?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "ToolifyConvert - Free Online Tools for Digital Productivity | Image, PDF, Text & More",
  description = "Discover 20+ powerful free online tools including image compressor, PDF merger, QR generator, currency converter, background remover, and more. No registration required, instant results.",
  keywords = "free online tools, image compressor, PDF merger, QR code generator, currency converter, password generator, unit converter, background remover, text tools, productivity tools, SVG to JPG converter, passport photo maker, timer stopwatch",
  canonicalUrl = "https://toolifyconvert.com",
  ogImage = "/og-image.png",
  author = "ToolifyConvert Team",
  robots = "index, follow",
  structuredData
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure document is loaded before initializing helmet
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setIsReady(true));
    } else {
      setIsReady(true);
    }
    
    return () => {
      document.removeEventListener('DOMContentLoaded', () => setIsReady(true));
    };
  }, []);

  const jsonLd = structuredData || {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ToolifyConvert",
    "description": description,
    "url": canonicalUrl,
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Image Compression and Processing Tools",
      "PDF Management and Conversion",
      "QR Code Generation with Customization",
      "Currency and Unit Conversion",
      "Text Processing and Manipulation",
      "Password Generation and Security Tools",
      "Timer, Stopwatch and Productivity Tools",
      "Background Removal with AI",
      "SVG to JPG Conversion",
      "Passport Photo Creation"
    ],
    "author": {
      "@type": "Organization",
      "name": "ToolifyConvert"
    },
    "dateModified": new Date().toISOString(),
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  };

  // Don't render until DOM is ready
  if (!isReady) {
    return null;
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="ToolifyConvert" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@ToolifyConvert" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="application-name" content="ToolifyConvert" />
      <meta name="apple-mobile-web-app-title" content="ToolifyConvert" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      
      {/* Additional Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ToolifyConvert",
          "url": "https://toolifyconvert.com",
          "logo": "https://toolifyconvert.com/logo.png",
          "description": "Free online tools for digital productivity including image processing, PDF management, text tools, and calculators",
          "sameAs": [
            "https://twitter.com/toolifyconvert",
            "https://facebook.com/toolifyconvert"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
