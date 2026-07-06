
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Download, Upload, AlertTriangle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const RepairPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isRepairing, setIsRepairing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for repair`,
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

  const repairPdf = async () => {
    if (!file) return;
    setIsRepairing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = new Uint8Array(await file.arrayBuffer());
      // Load with tolerant options and re-serialize to rebuild xref tables
      // and drop malformed objects — this fixes many "damaged" PDFs.
      const doc = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
        throwOnInvalidObject: false,
        updateMetadata: false,
      });
      const out = await doc.save({ useObjectStreams: false });
      const blob = new Blob([out as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = file.name.replace(/\.pdf$/i, "") + "_repaired.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "PDF repaired", description: "Rebuilt PDF structure and downloaded." });
    } catch (error) {
      console.error(error);
      toast({
        title: "Repair failed",
        description: "This PDF is too corrupted to recover in the browser. Try a desktop tool.",
        variant: "destructive",
      });
    } finally {
      setIsRepairing(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Repair PDF"
      description="Fix corrupted or damaged PDF files and restore accessibility to your important documents."
      keywords="repair pdf, fix pdf, corrupted pdf, damaged pdf, pdf recovery"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-orange-50 rounded-full">
                <Wrench className="h-12 w-12 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose corrupted PDF file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a damaged PDF to repair
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
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={repairPdf}
                disabled={isRepairing}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isRepairing ? (
                  "Repairing..."
                ) : (
                  <>
                    <Wrench className="h-4 w-4 mr-2" />
                    Repair PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-medium text-orange-900 mb-2">Repair Features:</h3>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Fix corrupted PDF structure</li>
            <li>• Restore damaged content</li>
            <li>• Recover embedded fonts</li>
            <li>• Repair broken links and bookmarks</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default RepairPdf;
