
import React from "react";
import SEO from "@/components/SEO";
import ToolSEOContent from "@/components/ToolSEOContent";

interface ToolPageTemplateProps {
  title: string;
  description: string;
  keywords?: string;
  children: React.ReactNode;
}

const ToolPageTemplate = ({ title, description, keywords, children }: ToolPageTemplateProps) => {
  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords || "online tools, free tools, productivity"}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {children}
        </div>
      </div>
    </>
  );
};

export default ToolPageTemplate;
