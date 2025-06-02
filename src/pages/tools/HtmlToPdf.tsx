
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Upload } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const HtmlToPdf = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [inputMethod, setInputMethod] = useState<"text" | "file">("text");
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/html' || selectedFile.name.endsWith('.html')) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setHtmlContent(content);
        };
        reader.readAsText(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for conversion`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an HTML file (.html)",
          variant: "destructive",
        });
      }
    }
  };

  const convertToPdf = async () => {
    if (!htmlContent.trim()) {
      toast({
        title: "No content",
        description: "Please enter HTML content or upload an HTML file",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    try {
      // Basic HTML to PDF conversion using browser's print functionality
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
        
        toast({
          title: "Conversion initiated",
          description: "Please use your browser's print dialog to save as PDF",
        });
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your HTML",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="HTML to PDF Converter"
      description="Convert HTML content or files to PDF format with preserved styling and layout. Perfect for web developers and content creators."
      keywords="html to pdf, web to pdf, html converter, webpage to pdf"
    >
      <div className="space-y-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setInputMethod("text")}
            className={`pb-2 px-1 ${inputMethod === "text" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"}`}
          >
            Enter HTML
          </button>
          <button
            onClick={() => setInputMethod("file")}
            className={`pb-2 px-1 ${inputMethod === "file" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"}`}
          >
            Upload HTML File
          </button>
        </div>

        {inputMethod === "text" ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              HTML Content
            </label>
            <Textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="Paste your HTML content here..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              accept=".html,text/html"
              onChange={handleFileSelect}
              className="hidden"
              id="html-upload"
            />
            <label htmlFor="html-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {file ? file.name : "Choose HTML file"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports .html files
                  </p>
                </div>
                <Button variant="outline" className="mt-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
              </div>
            </label>
          </div>
        )}

        {htmlContent && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">HTML Preview Ready</p>
                <p className="text-sm text-gray-500">
                  {htmlContent.length} characters
                </p>
              </div>
              <Button
                onClick={convertToPdf}
                disabled={isConverting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isConverting ? (
                  "Converting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Convert to PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Preserves CSS styling and layouts</li>
            <li>• Supports embedded images and media</li>
            <li>• Maintains responsive design elements</li>
            <li>• High-quality PDF output</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default HtmlToPdf;
