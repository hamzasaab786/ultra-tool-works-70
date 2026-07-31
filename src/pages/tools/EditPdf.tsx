import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit, Download, Upload, Type, Image as ImageIcon, Trash2, Square } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

type TextItem = {
  id: string;
  kind: "text";
  page: number;
  x: number; // ratio 0..1 of page width
  y: number; // ratio 0..1 of page height, from top
  text: string;
  size: number;
  color: string;
  bold: boolean;
};

type ImageItem = {
  id: string;
  kind: "image";
  page: number;
  x: number;
  y: number;
  width: number; // ratio of page width
  dataUrl: string;
  mime: string;
};

type BoxItem = {
  id: string;
  kind: "box";
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type Item = TextItem | ImageItem | BoxItem;

const uid = () => Math.random().toString(36).slice(2, 10);

const hexToRgb01 = (hex: string) => {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
};

const EditPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ url: string; w: number; h: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<"text" | "image" | "box">("text");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [textValue, setTextValue] = useState("Your text here");
  const [fontSize, setFontSize] = useState(16);
  const [color, setColor] = useState("#111111");
  const [bold, setBold] = useState(false);
  const pendingImage = useRef<{ dataUrl: string; mime: string } | null>(null);
  const { toast } = useToast();

  const loadPdf = useCallback(async (selected: File) => {
    setIsLoading(true);
    try {
      const { renderPdfPreviewPages } = await import("@/utils/pdfClient");
      const rendered = await renderPdfPreviewPages(selected, 1.5);
      setPages(rendered);
      setCurrentPage(0);
      setItems([]);
      toast({ title: "PDF loaded", description: `${rendered.length} page(s) ready to edit.` });
    } catch (e) {
      console.error(e);
      toast({ title: "Could not open PDF", description: (e as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      toast({ title: "Invalid file type", description: "Please select a PDF file", variant: "destructive" });
      return;
    }
    setFile(selectedFile);
    loadPdf(selectedFile);
  };

  const handleImagePick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const img = event.target.files?.[0];
    if (!img) return;
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(img);
    });
    pendingImage.current = { dataUrl, mime: img.type };
    setTool("image");
    toast({ title: "Image ready", description: "Click on the page to place it." });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (tool === "text") {
      if (!textValue.trim()) return;
      const item: TextItem = { id: uid(), kind: "text", page: currentPage, x, y, text: textValue, size: fontSize, color, bold };
      setItems((prev) => [...prev, item]);
      setSelectedId(item.id);
    } else if (tool === "image") {
      if (!pendingImage.current) {
        toast({ title: "No image selected", description: "Upload an image first.", variant: "destructive" });
        return;
      }
      const item: ImageItem = {
        id: uid(), kind: "image", page: currentPage, x, y, width: 0.3,
        dataUrl: pendingImage.current.dataUrl, mime: pendingImage.current.mime,
      };
      setItems((prev) => [...prev, item]);
      setSelectedId(item.id);
    } else {
      const item: BoxItem = { id: uid(), kind: "box", page: currentPage, x, y, width: 0.25, height: 0.04, color };
      setItems((prev) => [...prev, item]);
      setSelectedId(item.id);
    }
  };

  const updateSelected = (patch: Partial<Item>) => {
    setItems((prev) => prev.map((i) => (i.id === selectedId ? ({ ...i, ...patch } as Item) : i)));
  };

  const removeSelected = () => {
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      const step = e.shiftKey ? 0.01 : 0.002;
      const sel = items.find((i) => i.id === selectedId);
      if (!sel) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        if ((e.target as HTMLElement)?.tagName === "INPUT") return;
        e.preventDefault();
        removeSelected();
      } else if (e.key.startsWith("Arrow")) {
        if ((e.target as HTMLElement)?.tagName === "INPUT") return;
        e.preventDefault();
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        updateSelected({ x: Math.min(1, Math.max(0, sel.x + dx)), y: Math.min(1, Math.max(0, sel.y + dy)) } as Partial<Item>);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const exportPdf = async () => {
    if (!file) return;
    if (items.length === 0) {
      toast({ title: "Nothing to apply", description: "Add text, an image or a box first.", variant: "destructive" });
      return;
    }
    setIsExporting(true);
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pdfPages = pdfDoc.getPages();

      for (const item of items) {
        const page = pdfPages[item.page];
        if (!page) continue;
        const { width, height } = page.getSize();

        if (item.kind === "text") {
          const font = item.bold ? boldFont : regular;
          const c = hexToRgb01(item.color);
          page.drawText(item.text, {
            x: item.x * width,
            y: height - item.y * height - item.size,
            size: item.size,
            font,
            color: rgb(c.r, c.g, c.b),
          });
        } else if (item.kind === "image") {
          const bytes = Uint8Array.from(atob(item.dataUrl.split(",")[1]), (ch) => ch.charCodeAt(0));
          const embedded = item.mime.includes("png")
            ? await pdfDoc.embedPng(bytes)
            : await pdfDoc.embedJpg(bytes);
          const w = item.width * width;
          const h = (embedded.height / embedded.width) * w;
          page.drawImage(embedded, { x: item.x * width, y: height - item.y * height - h, width: w, height: h });
        } else {
          const c = hexToRgb01(item.color);
          const w = item.width * width;
          const h = item.height * height;
          page.drawRectangle({
            x: item.x * width,
            y: height - item.y * height - h,
            width: w,
            height: h,
            color: rgb(c.r, c.g, c.b),
          });
        }
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `edited_${file.name}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast({ title: "PDF saved", description: `Applied ${items.length} edit(s).` });
    } catch (error) {
      console.error("Editing error:", error);
      toast({ title: "Editing failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const selected = items.find((i) => i.id === selectedId) || null;
  const pageItems = items.filter((i) => i.page === currentPage);

  return (
    <ToolPageTemplate
      title="Edit PDF"
      description="Add text, images and shapes anywhere on your PDF pages, then download the edited document."
      keywords="edit pdf, pdf editor, add text to pdf, pdf annotation, modify pdf"
    >
      <div className="space-y-6">
        {!file && (
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" id="pdf-upload" />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                  <Edit className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">Choose PDF to edit</p>
                  <p className="text-sm text-muted-foreground mt-1">Add text, images and shapes visually</p>
                </div>
                <Button variant="outline" className="mt-2" asChild>
                  <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
                </Button>
              </div>
            </label>
          </div>
        )}

        {isLoading && <p className="text-center text-muted-foreground">Rendering pages…</p>}

        {file && pages.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Canvas */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant={tool === "text" ? "default" : "outline"} onClick={() => setTool("text")}>
                  <Type className="h-4 w-4 mr-1" /> Text
                </Button>
                <Button size="sm" variant={tool === "box" ? "default" : "outline"} onClick={() => setTool("box")}>
                  <Square className="h-4 w-4 mr-1" /> Box
                </Button>
                <input type="file" accept="image/png,image/jpeg" onChange={handleImagePick} className="hidden" id="img-upload" />
                <Button size="sm" variant={tool === "image" ? "default" : "outline"} asChild>
                  <label htmlFor="img-upload" className="cursor-pointer">
                    <ImageIcon className="h-4 w-4 mr-1" /> Image
                  </label>
                </Button>
                <span className="text-sm text-muted-foreground ml-2">Click the page to place</span>
              </div>

              <div
                className="relative border rounded-lg overflow-hidden bg-muted"
                onClick={handleCanvasClick}
                style={{ cursor: "crosshair" }}
              >
                <img src={pages[currentPage].url} alt={`PDF page ${currentPage + 1}`} className="w-full block" />
                {pageItems.map((i) => (
                  <div
                    key={i.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedId(i.id); }}
                    className={`absolute ${selectedId === i.id ? "ring-2 ring-primary" : ""}`}
                    style={{ left: `${i.x * 100}%`, top: `${i.y * 100}%` }}
                  >
                    {i.kind === "text" && (
                      <span style={{ fontSize: `${i.size}px`, color: i.color, fontWeight: i.bold ? 700 : 400, whiteSpace: "nowrap" }}>
                        {i.text}
                      </span>
                    )}
                    {i.kind === "image" && (
                      <img src={i.dataUrl} alt="overlay" style={{ width: `${i.width * 100}vw`, maxWidth: 400 }} />
                    )}
                    {i.kind === "box" && (
                      <div style={{ width: `${i.width * 600}px`, height: `${i.height * 800}px`, background: i.color }} />
                    )}
                  </div>
                ))}
              </div>

              {pages.length > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <Button size="sm" variant="outline" disabled={currentPage === 0} onClick={() => setCurrentPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <span className="text-sm">Page {currentPage + 1} of {pages.length}</span>
                  <Button size="sm" variant="outline" disabled={currentPage === pages.length - 1} onClick={() => setCurrentPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Text settings</h3>
                <div>
                  <Label htmlFor="text-value">Text</Label>
                  <Input id="text-value" value={textValue} onChange={(e) => setTextValue(e.target.value)} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="font-size">Size</Label>
                    <Input id="font-size" type="number" min={6} max={96} value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value) || 16)} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1 h-10 p-1" />
                  </div>
                </div>
                <Button size="sm" variant={bold ? "default" : "outline"} onClick={() => setBold(!bold)}>Bold</Button>
              </div>

              {selected && (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Selected {selected.kind}</h3>
                    <Button size="icon" variant="ghost" onClick={removeSelected}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {selected.kind === "text" && (
                    <>
                      <Input value={selected.text} onChange={(e) => updateSelected({ text: e.target.value } as Partial<Item>)} />
                      <Input type="number" min={6} max={96} value={selected.size}
                        onChange={(e) => updateSelected({ size: Number(e.target.value) || 12 } as Partial<Item>)} />
                    </>
                  )}
                  {selected.kind !== "text" && (
                    <div>
                      <Label>Width</Label>
                      <Input type="number" step={0.05} min={0.05} max={1} value={selected.width}
                        onChange={(e) => updateSelected({ width: Number(e.target.value) } as Partial<Item>)} className="mt-1" />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Use arrow keys to nudge, Delete to remove.</p>
                </div>
              )}

              <Button onClick={exportPdf} disabled={isExporting} className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Saving…" : "Download Edited PDF"}
              </Button>

              <Button variant="outline" className="w-full" onClick={() => { setFile(null); setPages([]); setItems([]); }}>
                Choose another PDF
              </Button>
            </div>
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Editing Features:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Click anywhere to place text with custom size, color and bold</li>
            <li>• Insert PNG / JPG images and resize them</li>
            <li>• Draw filled boxes to cover or highlight content</li>
            <li>• Multi-page editing — everything runs in your browser</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default EditPdf;
