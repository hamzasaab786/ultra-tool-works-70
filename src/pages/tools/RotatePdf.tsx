
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RotateCw, RotateCcw, Download, Upload } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const RotatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for rotation`,
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

  const rotatePdf = async () => {
    if (!file) return;
    setIsRotating(true);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      for (const page of doc.getPages()) {
        const current = page.getRotation().angle || 0;
        page.setRotation(degrees((current + rotation) % 360));
      }
      const out = await doc.save();
      const blob = new Blob([out as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = file.name.replace(/\.pdf$/i, "") + `_rotated.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Success", description: `PDF rotated by ${rotation}° and downloaded.` });
    } catch (error) {
      console.error("Rotation error:", error);
      toast({ title: "Rotation failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsRotating(false);
    }
  };

  const adjustRotation = (degrees: number) => {
    const newRotation = (rotation + degrees) % 360;
    setRotation(newRotation < 0 ? newRotation + 360 : newRotation);
  };

  return (
    <ToolPageTemplate
      title="Rotate PDF"
      description="Rotate PDF pages clockwise or counterclockwise to fix orientation and improve readability."
      keywords="rotate pdf, pdf orientation, fix pdf rotation, pdf page rotation"
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
              <div className="p-4 bg-indigo-50 rounded-full">
                <RotateCw className="h-12 w-12 text-indigo-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF to rotate"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF with pages to rotate
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
              <div className="flex items-center space-x-3 mb-4">
                <RotateCw className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">Rotation Controls</h3>
              <div className="flex items-center justify-center space-x-6">
                <Button
                  variant="outline"
                  onClick={() => adjustRotation(-90)}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <RotateCcw className="h-6 w-6 mb-2" />
                  <span className="text-sm">90° Left</span>
                </Button>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    {rotation}°
                  </div>
                  <div className="text-sm text-gray-500">Current Rotation</div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => adjustRotation(90)}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <RotateCw className="h-6 w-6 mb-2" />
                  <span className="text-sm">90° Right</span>
                </Button>
              </div>
            </div>

            <Button
              onClick={rotatePdf}
              disabled={isRotating || rotation === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isRotating ? (
                "Rotating PDF..."
              ) : (
                <>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Apply Rotation
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-medium text-indigo-900 mb-2">Rotation Options:</h3>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• Rotate all pages or specific pages</li>
            <li>• 90°, 180°, and 270° rotation angles</li>
            <li>• Preserves original document quality</li>
            <li>• Fixes scanned document orientation</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default RotatePdf;
