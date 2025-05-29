
import React from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import ThreeDEffects from "@/components/ThreeDEffects";

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
        <meta name="theme-color" content="#3b82f6" />
        {keywords && <meta name="keywords" content={keywords} />}
        
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        <meta property="og:title" content={`${title} | ToolifyConvert`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | ToolifyConvert`} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
          <div className="mb-12 text-center animate-fade-in">
            <ThreeDEffects type="card" intensity="medium">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                {description}
              </p>
            </ThreeDEffects>
          </div>
          
          <ThreeDEffects type="card" intensity="low" className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 overflow-hidden">
              <div className="w-full">
                {children}
              </div>
            </div>
          </ThreeDEffects>
          
          <div className="h-16 sm:h-8"></div>
        </div>
      </Layout>
    </>
  );
};

export default ToolPageTemplate;
