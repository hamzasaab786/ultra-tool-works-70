
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ToolPageProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolPageTemplate = ({ title, description, children }: ToolPageProps) => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>
        
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle>Use this tool</CardTitle>
            <CardDescription>Free, no sign-up required</CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>How to use {title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Upload or enter your content</li>
                <li>Configure the settings if needed</li>
                <li>Process and download the result</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About this tool</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This free online tool allows you to {description.toLowerCase()} 
                with ease. No registration or sign-up required - just upload and convert.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ToolPageTemplate;
