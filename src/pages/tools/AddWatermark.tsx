
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Droplets, Download, Upload } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const AddWatermark = () => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState([50]);
  const [position, setPosition] = useState("center");
  const [rotation, setRotation] = useState([45]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for watermarking`,
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

  const addWatermark = async () => {
    if (!file || !watermarkText.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter watermark text",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { PDFDocument, rgb, degrees } = await import('pdf-lib');
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Add watermark to each page
      for (const page of pages) {
        const { width, height } = page.getSize();
        
        // Calculate position
        let x = width / 2;
        let y = height / 2;
        
        if (position === 'top-left') {
          x = 50;
          y = height - 50;
        } else if (position === 'top-right') {
          x = width - 50;
          y = height - 50;
        } else if (position === 'bottom-left') {
          x = 50;
          y = 50;
        } else if (position === 'bottom-right') {
          x = width - 50;
          y = 50;
        }
        
        page.drawText(watermarkText, {
          x,
          y,
          size: 48,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity[0] / 100,
          rotate: degrees(rotation[0]),
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `watermarked_${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Watermark added successfully!",
      });
    } catch (error) {
      console.error('Watermarking error:', error);
      toast({
        title: "Process failed",
        description: "There was an error adding the watermark",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Add Watermark to PDF"
      description="Add text watermarks to your PDF documents for branding, copyright protection, or confidentiality marking."
      keywords="add watermark, pdf watermark, text watermark, brand pdf, protect pdf"
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
              <div className="p-4 bg-cyan-50 rounded-full">
                <Droplets className="h-12 w-12 text-cyan-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF to add watermark
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
                <Droplets className="h-8 w-8 text-cyan-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Watermark Text
                </label>
                <Input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter watermark text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opacity: {opacity[0]}%
                </label>
                <Slider
                  value={opacity}
                  onValueChange={setOpacity}
                  max={100}
                  min={10}
                  step={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation: {rotation[0]}°
                </label>
                <Slider
                  value={rotation}
                  onValueChange={setRotation}
                  max={360}
                  min={0}
                  step={15}
                />
              </div>
            </div>

            <Button
              onClick={addWatermark}
              disabled={isProcessing || !watermarkText.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              {isProcessing ? (
                "Adding Watermark..."
              ) : (
                <>
                  <Droplets className="h-4 w-4 mr-2" />
                  Add Watermark
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-cyan-50 p-4 rounded-lg">
          <h3 className="font-medium text-cyan-900 mb-2">Features:</h3>
          <ul className="text-sm text-cyan-800 space-y-1">
            <li>• Customizable text and positioning</li>
            <li>• Adjustable opacity and rotation</li>
            <li>• Professional appearance</li>
            <li>• Preserve original document quality</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default AddWatermark;
