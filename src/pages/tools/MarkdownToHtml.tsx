
import React, { useState, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Upload, FileCode, Clipboard, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MarkdownToHtml = () => {
  const [markdown, setMarkdown] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<"code" | "rendered">("rendered");
  const { toast } = useToast();
  
  // Process markdown to HTML whenever markdown changes
  useEffect(() => {
    convertMarkdownToHtml(markdown);
  }, [markdown]);
  
  // Simple markdown to HTML converter
  // For a real application, you would use a proper library like marked or showdown
  const convertMarkdownToHtml = (md: string) => {
    if (!md) {
      setHtml("");
      return;
    }
    
    try {
      // This is a very basic markdown parser for demonstration
      // In a real app, you would use a proper library
      let convertedHtml = md;
      
      // Handle headings
      convertedHtml = convertedHtml.replace(/^# (.*$)/gm, '<h1>$1</h1>');
      convertedHtml = convertedHtml.replace(/^## (.*$)/gm, '<h2>$1</h2>');
      convertedHtml = convertedHtml.replace(/^### (.*$)/gm, '<h3>$1</h3>');
      convertedHtml = convertedHtml.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
      
      // Handle bold
      convertedHtml = convertedHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      convertedHtml = convertedHtml.replace(/__(.*?)__/g, '<strong>$1</strong>');
      
      // Handle italic
      convertedHtml = convertedHtml.replace(/\*(.*?)\*/g, '<em>$1</em>');
      convertedHtml = convertedHtml.replace(/_(.*?)_/g, '<em>$1</em>');
      
      // Handle links
      convertedHtml = convertedHtml.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
      
      // Handle unordered lists
      convertedHtml = convertedHtml.replace(/^\* (.*$)/gm, '<li>$1</li>');
      convertedHtml = convertedHtml.replace(/^- (.*$)/gm, '<li>$1</li>');
      
      // Wrap list items with <ul>
      convertedHtml = convertedHtml.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
      
      // Handle code blocks
      convertedHtml = convertedHtml.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
      
      // Handle inline code
      convertedHtml = convertedHtml.replace(/`(.*?)`/g, '<code>$1</code>');
      
      // Handle blockquotes
      convertedHtml = convertedHtml.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
      
      // Handle horizontal rule
      convertedHtml = convertedHtml.replace(/^---$/gm, '<hr>');
      
      // Handle paragraphs
      // Split by double line breaks and wrap content in <p> tags if not already
      // containing block-level HTML
      const paragraphs = convertedHtml.split(/\n\n/);
      convertedHtml = paragraphs
        .map(p => {
          p = p.trim();
          if (
            !p ||
            p.startsWith('<h') ||
            p.startsWith('<ul>') ||
            p.startsWith('<blockquote>') ||
            p.startsWith('<pre>') ||
            p === '<hr>'
          ) {
            return p;
          }
          return `<p>${p}</p>`;
        })
        .join('\n');
      
      setHtml(convertedHtml);
    } catch (error) {
      console.error("Error converting markdown:", error);
      toast({
        title: "Conversion Error",
        description: "An error occurred while converting Markdown to HTML",
        variant: "destructive"
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };
  
  const handleLoadSample = () => {
    const sampleMarkdown = `# Markdown Example

## This is a Heading 2

This is a paragraph with **bold** and *italic* text.

### Links and Lists

Here's a [link to Google](https://www.google.com)

* Item 1
* Item 2
* Item 3

### Code

\`\`\`
function hello() {
  console.log("Hello, world!");
}
\`\`\`

Inline code: \`const x = 10;\`

> This is a blockquote

---

### That's it!`;
    
    setMarkdown(sampleMarkdown);
    
    toast({
      title: "Sample Loaded",
      description: "Sample markdown has been loaded",
    });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "HTML has been copied to clipboard",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const downloadHtml = () => {
    if (!html) {
      toast({
        title: "Nothing to Download",
        description: "Please convert some markdown to HTML first",
        variant: "destructive"
      });
      return;
    }
    
    // Create a full HTML document
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted HTML</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    code {
      background-color: #f4f4f4;
      padding: 2px 4px;
      border-radius: 4px;
    }
    pre {
      background-color: #f4f4f4;
      padding: 10px;
      border-radius: 4px;
      overflow: auto;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 10px;
      color: #666;
      margin-left: 0;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
    
    // Create a download link
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your HTML file is being downloaded",
    });
  };
  
  return (
    <ToolPageTemplate
      title="Markdown to HTML Converter"
      description="Convert Markdown text to HTML with a live preview and downloadable output"
      keywords="markdown to html, markdown converter, md to html, text formatting, markdown parser, html generator"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Markdown Input</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLoadSample}
                className="text-xs"
              >
                Load Sample
              </Button>
            </div>
            <Textarea 
              className="font-mono text-sm h-[500px] resize-none"
              placeholder="# Type your markdown here..."
              value={markdown}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">HTML Output</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPreviewMode(previewMode === "code" ? "rendered" : "code")}
                  className="text-xs"
                >
                  {previewMode === "code" ? "Preview" : "View Code"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-xs"
                  disabled={!html}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" /> Copy HTML
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {previewMode === "code" ? (
              <Textarea 
                className="font-mono text-sm h-[500px] resize-none"
                readOnly
                value={html}
              />
            ) : (
              <Card className="border overflow-auto h-[500px]">
                <CardContent className="p-4">
                  {html ? (
                    <div 
                      className="prose max-w-none" 
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  ) : (
                    <div className="text-gray-400 flex items-center justify-center h-full">
                      <p>HTML preview will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {markdown.length > 0 ? (
              <>
                Characters: {markdown.length} | 
                Words: {markdown.trim() ? markdown.trim().split(/\s+/).length : 0}
              </>
            ) : (
              <span>Enter some markdown to begin</span>
            )}
          </div>
          
          <Button 
            onClick={downloadHtml}
            disabled={!html}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download HTML
          </Button>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default MarkdownToHtml;
