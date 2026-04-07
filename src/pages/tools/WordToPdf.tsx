import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { FileText, Download, Loader2, Upload, CheckCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import mammoth from "mammoth";
import htmlToPdfmake from "html-to-pdfmake";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const WordToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        selectedFile.type === "application/msword"
      ) {
        setFile(selectedFile);
        toast.success("Word file selected successfully!");
      } else {
        toast.error("Please select a valid Word file (.docx or .doc)");
      }
    }
  };

  const convertToPdf = async () => {
    if (!file) {
      toast.error("Please select a Word file first");
      return;
    }

    setIsConverting(true);
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);

      // Convert Word to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;
      setProgress(60);

      // Convert HTML to pdfMake format
      const pdfContent = htmlToPdfmake(html);
      setProgress(80);

      // Create PDF document
      const docDefinition: any = {
        content: [
          {
            text: file.name.replace(/\.(docx?|DOCX?)$/, ""),
            style: "header",
            margin: [0, 0, 0, 20],
          },
          ...pdfContent,
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
            color: "#4f46e5",
          },
        },
        defaultStyle: {
          fontSize: 12,
          lineHeight: 1.5,
        },
      };

      // Generate and download PDF
      pdfMake.createPdf(docDefinition).download(
        file.name.replace(/\.(docx?|DOCX?)$/, ".pdf")
      );

      setProgress(100);
      toast.success("Word file converted to PDF successfully!");
      
      // Show preview
      setPreview(html.substring(0, 500) + "...");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert Word file to PDF. Make sure the file is a valid Word document.");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <ToolPageTemplate
      title="Word to PDF Converter"
      description="Convert Word documents (.docx, .doc) to PDF format instantly. Free and secure online conversion tool."
      keywords="word to pdf, docx to pdf, doc to pdf converter, word converter"
    >
      <div className="space-y-6 animate-fade-in">
        <Card className="p-8 glassmorphism border-indigo-100/50">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50/50 animate-scale-in">
                <FileText className="h-16 w-16 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">Convert Word to PDF</h2>
              <p className="text-muted-foreground">
                Upload your Word document and convert it to professional PDF format
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="word-file"
                  className="block text-sm font-semibold mb-3"
                >
                  Select Word File
                </label>
                <div className="relative">
                  <input
                    id="word-file"
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="w-full p-6 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300"
                    disabled={isConverting}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-indigo-400" />
                      <p className="text-sm text-muted-foreground">
                        Click or drag Word file here
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {file && (
                <Card className="p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 border-indigo-100 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    {!isConverting && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </Card>
              )}

              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Converting...</span>
                    <span className="font-medium text-indigo-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={convertToPdf}
                disabled={!file || isConverting}
                className="w-full btn-modern bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Convert to PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {preview && (
          <Card className="p-6 glassmorphism border-green-100/50 animate-scale-in">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-700">Conversion Successful!</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your Word document has been converted to PDF and downloaded.
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6 glassmorphism border-purple-100/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-lg">✨</span>
            Features
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Real Conversion:</strong> Preserves text and formatting from Word documents
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Supports .doc & .docx:</strong> Works with all Word file formats
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">100% Browser-Based:</strong> Your files never leave your device
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">No File Limits:</strong> Convert documents of any size
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Completely Free:</strong> No sign-up or payment required
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default WordToPdf;
