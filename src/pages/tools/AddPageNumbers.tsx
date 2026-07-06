
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Download, Hash } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const AddPageNumbers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<string>("bottom-center");
  const [startNumber, setStartNumber] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for page numbering`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const addPageNumbers = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a PDF file first", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const margin = 24;
      const size = 11;
      pages.forEach((page, idx) => {
        const text = `${startNumber + idx}`;
        const { width, height } = page.getSize();
        const tw = font.widthOfTextAtSize(text, size);
        let x = margin, y = margin;
        if (position.startsWith("top")) y = height - margin - size;
        if (position.endsWith("center")) x = (width - tw) / 2;
        if (position.endsWith("right")) x = width - margin - tw;
        page.drawText(text, { x, y, size, font, color: rgb(0.15, 0.15, 0.15) });
      });
      const out = await doc.save();
      const blob = new Blob([out as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = file.name.replace(/\.pdf$/i, "") + "_numbered.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Page numbers added", description: "Numbered PDF downloaded." });
    } catch (error) {
      console.error(error);
      toast({ title: "Process failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const positions = [
    { value: "top-left", label: "Top Left" },
    { value: "top-center", label: "Top Center" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-center", label: "Bottom Center" },
    { value: "bottom-right", label: "Bottom Right" },
  ];

  return (
    <ToolPageTemplate
      title="Add Page Numbers to PDF"
      description="Add customizable page numbers to your PDF documents with various positioning options."
      keywords="add page numbers, pdf page numbers, number pages, pdf pagination, document numbering"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <Hash className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF to add page numbers
                </p>
              </div>
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Select PDF
              </Button>
            </div>
          </label>
        </div>

        {file && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="position">Page Number Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-number">Start Number</Label>
                <Input
                  id="start-number"
                  type="number"
                  min="1"
                  value={startNumber}
                  onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                  placeholder="Enter starting number"
                />
              </div>
            </div>

            <Button
              onClick={addPageNumbers}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Adding Page Numbers...
                </>
              ) : (
                <>
                  <Hash className="h-4 w-4 mr-2" />
                  Add Page Numbers
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Customizable page number positions</li>
            <li>• Start numbering from any number</li>
            <li>• Professional formatting</li>
            <li>• Preserves original document quality</li>
            <li>• Works with multi-page documents</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">Position Guide:</h3>
          <div className="grid grid-cols-3 gap-2 text-sm text-green-800">
            <div className="text-center p-2 bg-white rounded border">Top Left</div>
            <div className="text-center p-2 bg-white rounded border">Top Center</div>
            <div className="text-center p-2 bg-white rounded border">Top Right</div>
            <div className="text-center p-2 bg-white rounded border">Bottom Left</div>
            <div className="text-center p-2 bg-white rounded border font-bold bg-green-100">Bottom Center (Default)</div>
            <div className="text-center p-2 bg-white rounded border">Bottom Right</div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default AddPageNumbers;
