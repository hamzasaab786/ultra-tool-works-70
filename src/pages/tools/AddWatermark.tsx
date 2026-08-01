
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Droplets, Upload, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { renderPdfPreviewPages } from "@/utils/pdfClient";

type PreviewPage = { url: string; w: number; h: number };

const PREVIEW_SCALE = 1.35; // must match renderPdfPreviewPages default
const FONT_SIZE = 48; // PDF points

interface WatermarkPreviewProps {
  page: PreviewPage;
  index: number;
  text: string;
  opacity: number;
  rotation: number;
  position: string;
}

const WatermarkPreview = ({ page, index, text, opacity, rotation, position }: WatermarkPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setDisplayWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // PDF page size in points
  const pdfWidth = page.w / PREVIEW_SCALE;
  const pdfHeight = page.h / PREVIEW_SCALE;
  const ratio = displayWidth ? displayWidth / pdfWidth : 0;

  const fontPx = FONT_SIZE * ratio;

  // Approximate text metrics for corner anchoring
  const measure = useCallback(
    (size: number) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return { w: size * text.length * 0.55, h: size * 0.72 };
      ctx.font = `bold ${size}px Helvetica, Arial, sans-serif`;
      return { w: ctx.measureText(text).width, h: size * 0.72 };
    },
    [text]
  );

  const { w: textW, h: textH } = measure(FONT_SIZE);
  const margin = 40;

  let cx = pdfWidth / 2;
  let cy = pdfHeight / 2;
  if (position === "top-left") {
    cx = margin + textW / 2;
    cy = pdfHeight - margin - textH / 2;
  } else if (position === "top-right") {
    cx = pdfWidth - margin - textW / 2;
    cy = pdfHeight - margin - textH / 2;
  } else if (position === "bottom-left") {
    cx = margin + textW / 2;
    cy = margin + textH / 2;
  } else if (position === "bottom-right") {
    cx = pdfWidth - margin - textW / 2;
    cy = margin + textH / 2;
  }

  const leftPct = (cx / pdfWidth) * 100;
  const topPct = ((pdfHeight - cy) / pdfHeight) * 100;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground text-center">Page {index + 1}</p>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-md border border-border bg-white shadow-sm"
        style={{ aspectRatio: `${pdfWidth} / ${pdfHeight}` }}
      >
        <img src={page.url} alt={`PDF page ${index + 1} preview`} className="absolute inset-0 h-full w-full" />
        {text.trim() && ratio > 0 && (
          <span
            className="pointer-events-none absolute whitespace-pre font-bold"
            style={{
              left: `${leftPct}%`,
              top: `${topPct}%`,
              fontSize: `${fontPx}px`,
              lineHeight: 1,
              color: "rgb(128,128,128)",
              opacity: opacity / 100,
              fontFamily: "Helvetica, Arial, sans-serif",
              transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
              transformOrigin: "center center",
            }}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

const AddWatermark = () => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState([50]);
  const [position, setPosition] = useState("center");
  const [rotation, setRotation] = useState([45]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
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

  // Render every page of the uploaded PDF for live watermark preview
  useEffect(() => {
    let cancelled = false;
    if (!file) {
      setPages([]);
      return;
    }
    setIsLoadingPreview(true);
    setPages([]);
    renderPdfPreviewPages(file)
      .then((rendered) => {
        if (!cancelled) setPages(rendered);
      })
      .catch((error) => {
        console.error("Preview error:", error);
        if (!cancelled) {
          toast({
            title: "Preview unavailable",
            description: "Could not render this PDF, but you can still add the watermark.",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPreview(false);
      });
    return () => {
      cancelled = true;
    };
  }, [file, toast]);

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
      const { PDFDocument, rgb, degrees, StandardFonts } = await import('pdf-lib');
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pdfPages = pdfDoc.getPages();
      const fontSize = FONT_SIZE;
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
      const textHeight = font.heightAtSize(fontSize);
      const angle = ((rotation[0] % 360) * Math.PI) / 180;

      // Add watermark to each page
      for (const page of pdfPages) {
        const { width, height } = page.getSize();
        const margin = 40;

        // Anchor point (where the text block should be centered)
        let cx = width / 2;
        let cy = height / 2;

        if (position === 'top-left') {
          cx = margin + textWidth / 2;
          cy = height - margin - textHeight / 2;
        } else if (position === 'top-right') {
          cx = width - margin - textWidth / 2;
          cy = height - margin - textHeight / 2;
        } else if (position === 'bottom-left') {
          cx = margin + textWidth / 2;
          cy = margin + textHeight / 2;
        } else if (position === 'bottom-right') {
          cx = width - margin - textWidth / 2;
          cy = margin + textHeight / 2;
        }

        // pdf-lib rotates around the (x, y) draw origin, so offset the origin
        // by the rotated half-extents to keep the text visually centered.
        const dx = (textWidth / 2) * Math.cos(angle) - (textHeight / 2) * Math.sin(angle);
        const dy = (textWidth / 2) * Math.sin(angle) + (textHeight / 2) * Math.cos(angle);

        page.drawText(watermarkText, {
          x: cx - dx,
          y: cy - dy,
          size: fontSize,
          font,
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
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <Droplets className="h-12 w-12 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {file ? file.name : "Choose PDF file"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a PDF to add watermark
                </p>
              </div>
              <Button variant="outline" className="mt-2" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Select PDF
                </span>
              </Button>
            </div>
          </label>
        </div>

        {file && (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* Controls */}
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Droplets className="h-8 w-8 text-primary" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                      {pages.length > 0 && ` • ${pages.length} page${pages.length > 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Watermark Text
                </label>
                <Input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter watermark text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
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
                <label className="block text-sm font-medium text-foreground mb-2">
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
                <label className="block text-sm font-medium text-foreground mb-2">
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

              <Button
                onClick={addWatermark}
                disabled={isProcessing || !watermarkText.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  "Adding Watermark..."
                ) : (
                  <>
                    <Droplets className="h-4 w-4 mr-2" />
                    Add Watermark & Download
                  </>
                )}
              </Button>
            </div>

            {/* Live preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Live Preview</h3>
                <span className="text-xs text-muted-foreground">
                  Exactly how your watermark will look
                </span>
              </div>
              <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-muted/40 p-4">
                {isLoadingPreview ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-3" />
                    <p className="text-sm">Rendering your PDF…</p>
                  </div>
                ) : pages.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {pages.map((page, i) => (
                      <WatermarkPreview
                        key={i}
                        page={page}
                        index={i}
                        text={watermarkText}
                        opacity={opacity[0]}
                        rotation={rotation[0]}
                        position={position}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="py-16 text-center text-sm text-muted-foreground">
                    Preview not available for this PDF.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium text-foreground mb-2">Features:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Full-document live preview before download</li>
            <li>• Customizable text and positioning</li>
            <li>• Adjustable opacity and rotation</li>
            <li>• Preserve original document quality</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default AddWatermark;
