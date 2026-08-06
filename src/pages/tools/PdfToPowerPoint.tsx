
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Presentation, Download, Upload, AlertCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const PdfToPowerPoint = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for conversion`,
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

  const convertToPowerPoint = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const { loadPdfDocument, renderPdfPageToCanvas, mapConcurrent } = await import("@/utils/pdfClient");
      const PptxGenJS = (await import("pptxgenjs")).default;
      const pdf = await loadPdfDocument(file);
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_WIDE";
      const slideW = 13.333;
      const slideH = 7.5;

      // Render every page up-front, in parallel, so slide assembly is instant.
      const shots = await mapConcurrent(
        Array.from({ length: pdf.numPages }, (_, i) => i + 1),
        async (n) => {
          const page = await pdf.getPage(n);
          const { canvas } = await renderPdfPageToCanvas(page, 2);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          const cw = canvas.width;
          const ch = canvas.height;
          canvas.width = 0;
          canvas.height = 0;
          return { dataUrl, cw, ch };
        }
      );

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const { dataUrl, cw, ch } = shots[i - 1];
        const slide = pptx.addSlide();

        // Fit the rendered page into the slide
        const ratio = cw / ch;
        let w = slideW;
        let h = slideW / ratio;
        if (h > slideH) {
          h = slideH;
          w = slideH * ratio;
        }
        const offX = (slideW - w) / 2;
        const offY = (slideH - h) / 2;

        slide.addImage({ data: dataUrl, x: offX, y: offY, w, h });

        // Overlay real, editable text boxes on top of the rendered page so the
        // resulting .pptx can actually be edited in PowerPoint.
        const content = await page.getTextContent();
        const scaleX = w / viewport.width;
        const scaleY = h / viewport.height;

        for (const item of content.items as any[]) {
          const text = (item.str || "").trim();
          if (!text) continue;
          const tx = item.transform;
          const fontPx = Math.hypot(tx[2], tx[3]) || 12;
          const xIn = offX + tx[4] * scaleX;
          const yIn = offY + (viewport.height - tx[5] - fontPx) * scaleY;
          const wIn = Math.min((item.width || text.length * fontPx * 0.5) * scaleX * 1.25, slideW - xIn);
          const hIn = Math.max(fontPx * scaleY * 1.6, 0.2);
          if (xIn < 0 || yIn < 0 || wIn <= 0) continue;

          slide.addText(text, {
            x: xIn,
            y: yIn,
            w: wIn,
            h: hIn,
            fontSize: Math.max(6, Math.round(fontPx * scaleY * 72)),
            color: "000000",
            margin: 0,
            fill: { color: "FFFFFF", transparency: 100 },
            valign: "top",
          });
        }
      }

      const out = await pptx.write({ outputType: "blob" });
      const blob = out as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = file.name.replace(/\.pdf$/i, "") + ".pptx";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Converted", description: `Generated editable .pptx with ${pdf.numPages} slide(s).` });
    } catch (error) {
      console.error(error);
      toast({ title: "Conversion failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsConverting(false);
    }
  };


  return (
    <ToolPageTemplate
      title="PDF to PowerPoint Converter"
      description="Convert PDF documents to editable PowerPoint presentations (.pptx) with preserved slides and formatting."
      keywords="pdf to powerpoint, pdf to pptx, pdf converter, presentation converter"
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
                <Presentation className="h-12 w-12 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF to convert to PowerPoint
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
                <Presentation className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={convertToPowerPoint}
                disabled={isConverting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isConverting ? (
                  "Converting..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Convert to PowerPoint
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-medium text-orange-900 mb-2">Features:</h3>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Preserves slide layouts and formatting</li>
            <li>• Maintains images and graphics</li>
            <li>• Editable PowerPoint output</li>
            <li>• Compatible with Microsoft PowerPoint</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3 text-sm text-blue-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Note</p>
              <p>
                Best results with PDFs that contain presentation-style content with clear slide divisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfToPowerPoint;
