
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SEO from "@/components/SEO";

interface ToolPageProps {
  title: string;
  description: string;
  children: React.ReactNode;
  keywords?: string;
}

const ToolPageTemplate = ({ title, description, children, keywords }: ToolPageProps) => {
  return (
    <Layout>
      <SEO 
        title={`${title} - Free Online Tool | ToolifyConvert`}
        description={description}
        keywords={keywords || `${title.toLowerCase()}, free online tool, ${description.toLowerCase()}`}
        canonicalUrl={`https://toolifyconvert.com${window.location.pathname}`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12 scroll-reveal">
            <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-200">
              {description}
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 animate-fade-in delay-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow"></div>
                <span className="font-medium">Free Forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse-slow"></div>
                <span className="font-medium">No Sign-Up</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse-slow"></div>
                <span className="font-medium">Secure & Fast</span>
              </div>
            </div>
          </div>
          
          <Card className="w-full mb-12 card-3d bg-white/90 backdrop-blur-sm border-white/30 shadow-2xl animate-scale-in delay-500">
            <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Use {title}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Free, professional-grade tool with instant results
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {children}
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-8 animate-fade-in delay-700">
            <Card className="card-3d bg-white/90 backdrop-blur-sm border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  🚀 How to use {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  <li className="font-medium">Upload or enter your content</li>
                  <li className="font-medium">Configure settings if needed</li>
                  <li className="font-medium">Process and download results instantly</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card className="card-3d bg-white/90 backdrop-blur-sm border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  ⭐ About this tool
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  This professional-grade online tool allows you to {description.toLowerCase()} 
                  with ease. Built for speed, security, and reliability - no registration required.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Fast Processing</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">High Quality</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Secure</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ToolPageTemplate;
