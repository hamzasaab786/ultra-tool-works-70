import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Copy, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ExtractTextPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setExtractedText("");
      toast.success("PDF file selected successfully!");
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const extractText = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    setIsExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += `\n\n=== Page ${i} ===\n\n${pageText}`;
      }

      setExtractedText(fullText.trim());
      toast.success(`Successfully extracted text from ${pdf.numPages} pages!`);
    } catch (error) {
      console.error("Extraction error:", error);
      toast.error("Failed to extract text from PDF");
    } finally {
      setIsExtracting(false);
    }
  };

  const copyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      toast.success("Text copied to clipboard!");
    }
  };

  const downloadAsText = () => {
    if (extractedText) {
      const blob = new Blob([extractedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file?.name.replace(".pdf", ".txt") || "extracted-text.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Text file downloaded!");
    }
  };

  return (
    <ToolPageTemplate
      title="Extract Text from PDF"
      description="Extract all text content from PDF files easily. Free online PDF text extraction tool."
      keywords="extract text pdf, pdf to text, pdf text extractor, pdf parser"
    >
      <div className="space-y-6">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Extract Text from PDF</h2>
              <p className="text-muted-foreground">
                Extract all text content from your PDF documents
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pdf-file"
                  className="block text-sm font-medium mb-2"
                >
                  Select PDF File
                </label>
                <input
                  id="pdf-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                />
              </div>

              {file && (
                <Card className="p-4 bg-muted/50">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </Card>
              )}

              <Button
                onClick={extractText}
                disabled={!file || isExtracting}
                className="w-full"
                size="lg"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Extracting Text...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Extract Text
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {extractedText && (
          <Card className="p-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Extracted Text</h3>
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button onClick={downloadAsText} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={extractedText}
                readOnly
                className="min-h-[400px] font-mono text-sm"
              />
              
              <p className="text-sm text-muted-foreground">
                Characters: {extractedText.length} | Words:{" "}
                {extractedText.split(/\s+/).filter(Boolean).length}
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <h3 className="font-semibold mb-3">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Extract text from all pages</li>
            <li>✓ Preserve text structure and formatting</li>
            <li>✓ Copy extracted text to clipboard</li>
            <li>✓ Download as text file</li>
            <li>✓ All processing done in your browser</li>
          </ul>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default ExtractTextPdf;
