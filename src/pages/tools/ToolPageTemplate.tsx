
import React from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import ToolSEOContent from "@/components/ToolSEOContent";
import { getToolSeo } from "@/data/toolSeo";

interface ToolPageTemplateProps {
  title: string;
  description: string;
  keywords?: string;
  children: React.ReactNode;
}

const ToolPageTemplate = ({ title, description, keywords, children }: ToolPageTemplateProps) => {
  const { pathname } = useLocation();
  // When the route has a curated entry in the SEO catalog, ToolSeoHead owns the
  // <head> (unique title, description, canonical + JSON-LD). Rendering a second
  // SEO block here would override it with the generic page heading.
  const hasCuratedSeo = Boolean(getToolSeo(pathname));

  return (
    <>
      {!hasCuratedSeo && (
        <SEO
          title={title}
          description={description}
          keywords={keywords || "online tools, free tools, productivity"}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
