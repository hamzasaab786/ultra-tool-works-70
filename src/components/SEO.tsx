
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "ToolifyConvert - Free Online Tools for Everyone",
  description = "Discover powerful free online tools including QR generator, image compressor, PDF merger, currency converter, and more. No registration required.",
  keywords = "online tools, free tools, QR generator, image compressor, PDF tools, currency converter, background remover, password generator",
  canonicalUrl = "https://toolifyconvert.com",
  ogImage = "/og-image.png",
  structuredData
}) => {
  const jsonLd = structuredData || {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ToolifyConvert",
    "description": description,
    "url": canonicalUrl,
    "applicationCategory": "Utility",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "QR Code Generator",
      "Image Compression",
      "PDF Tools",
      "Currency Converter",
      "Background Remover",
      "Passport Photo Maker",
      "Unit Converter",
      "Password Generator"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
