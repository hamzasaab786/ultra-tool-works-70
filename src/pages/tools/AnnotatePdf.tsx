import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Upload, Highlighter, Pencil, Square, Type, Undo2, Download, ChevronLeft, ChevronRight, Eraser } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { loadPdfDocument } from "@/utils/pdfClient";
import { downloadBlob, baseName } from "@/utils/pdfPages";

type Tool = "pen" | "highlight" | "box" | "text";

interface Shape {
  page: number;
  tool: Tool;
  color: string;
  size: number;
  points?: { x: number; y: number }[]; // PDF space (bottom-left origin)
  rect?: { x: number; y: number; w: number; h: number };
  text?: string;
}

const COLORS = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#111827"];

const hexToRgb01 = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
};

const AnnotatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(3);
  const [textValue, setTextValue] = useState("");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [busy, setBusy] = useState(false);

  const baseCanvas = useRef<HTMLCanvasElement>(null);
  const overlay = useRef<HTMLCanvasElement>(null);
  const scaleRef = useRef(1);
  const pageHeightRef = useRef(0);
  const drawing = useRef<Shape | null>(null);

  const open = async (f: File | null) => {
    if (!f) return;
    setFile(f);
    setShapes([]);
    setPage(1);
    try {
      setPdf(await loadPdfDocument(f));
    } catch (e) {
      toast.error((e as Error).message || "Could not open this PDF");
    }
  };

  // Render the current page and size both canvases to match.
  useEffect(() => {
    if (!pdf || !baseCanvas.current) return;
    let cancelled = false;
    (async () => {
      const pg = await pdf.getPage(page);
      const unscaled = pg.getViewport({ scale: 1 });
      const maxWidth = Math.min(880, window.innerWidth - 80);
      const scale = maxWidth / unscaled.width;
      scaleRef.current = scale;
      pageHeightRef.current = unscaled.height;
      const viewport = pg.getViewport({ scale });
      const canvas = baseCanvas.current!;
      const ctx = canvas.getContext("2d")!;
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      if (overlay.current) {
        overlay.current.width = canvas.width;
        overlay.current.height = canvas.height;
      }
      await pg.render({ canvasContext: ctx, viewport }).promise;
      if (!cancelled) redraw();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdf, page]);

  // Repaint overlay whenever shapes change.
  useEffect(redraw, [shapes, page]);

  function redraw() {
    const canvas = overlay.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const s = scaleRef.current;
    const ph = pageHeightRef.current;
    const toScreen = (x: number, y: number) => ({ x: x * s, y: (ph - y) * s });

    const all = drawing.current ? [...shapes, drawing.current] : shapes;
    for (const shape of all) {
      if (shape.page !== page) continue;
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color;
      ctx.lineWidth = shape.size * s;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = shape.tool === "highlight" ? 0.35 : 1;

      if (shape.tool === "pen" && shape.points?.length) {
        ctx.beginPath();
        shape.points.forEach((p, i) => {
          const pt = toScreen(p.x, p.y);
          i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y);
        });
        ctx.stroke();
      } else if (shape.rect && (shape.tool === "highlight" || shape.tool === "box")) {
        const a = toScreen(shape.rect.x, shape.rect.y + shape.rect.h);
        const w = shape.rect.w * s;
        const h = shape.rect.h * s;
        if (shape.tool === "highlight") ctx.fillRect(a.x, a.y, w, h);
        else ctx.strokeRect(a.x, a.y, w, h);
      } else if (shape.tool === "text" && shape.rect && shape.text) {
        const a = toScreen(shape.rect.x, shape.rect.y);
        ctx.globalAlpha = 1;
        ctx.font = `${shape.size * 4 * s}px Helvetica, Arial, sans-serif`;
        ctx.fillText(shape.text, a.x, a.y);
      }
      ctx.globalAlpha = 1;
    }
  }

  const toPdfPoint = (e: React.MouseEvent) => {
    const rect = overlay.current!.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (overlay.current!.width / rect.width);
    const sy = (e.clientY - rect.top) * (overlay.current!.height / rect.height);
    const s = scaleRef.current;
    return { x: sx / s, y: pageHeightRef.current - sy / s };
  };

  const onDown = (e: React.MouseEvent) => {
    if (!pdf) return;
    const p = toPdfPoint(e);
    if (tool === "text") {
      if (!textValue.trim()) return toast.error("Type your note text first");
      setShapes((prev) => [...prev, { page, tool, color, size, rect: { x: p.x, y: p.y, w: 0, h: 0 }, text: textValue }]);
      return;
    }
    drawing.current =
      tool === "pen"
        ? { page, tool, color, size, points: [p] }
        : { page, tool, color, size, rect: { x: p.x, y: p.y, w: 0, h: 0 } };
    redraw();
  };

  const onMove = (e: React.MouseEvent) => {
    if (!drawing.current) return;
    const p = toPdfPoint(e);
    const d = drawing.current;
    if (d.tool === "pen") d.points!.push(p);
    else {
      const start = d.rect!;
      d.rect = { x: Math.min(start.x, p.x), y: Math.min(start.y, p.y), w: Math.abs(p.x - start.x), h: Math.abs(p.y - start.y), ...{} };
      // keep the anchor so dragging in any direction works
      d.rect.x = Math.min(start.x, p.x);
    }
    redraw();
  };

  const onUp = () => {
    if (!drawing.current) return;
    const d = drawing.current;
    drawing.current = null;
    const meaningful = d.tool === "pen" ? (d.points?.length || 0) > 1 : (d.rect!.w > 2 && d.rect!.h > 2);
    if (meaningful) setShapes((prev) => [...prev, d]);
    else redraw();
  };

  const exportPdf = async () => {
    if (!file) return;
    if (!shapes.length) return toast.error("Add at least one annotation");
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();

      for (const shape of shapes) {
        const target = pages[shape.page - 1];
        if (!target) continue;
        const c = hexToRgb01(shape.color);
        const col = rgb(c.r, c.g, c.b);

        if (shape.tool === "pen" && shape.points) {
          for (let i = 1; i < shape.points.length; i++) {
            target.drawLine({
              start: shape.points[i - 1],
              end: shape.points[i],
              thickness: shape.size,
              color: col,
            });
          }
        } else if (shape.tool === "highlight" && shape.rect) {
          target.drawRectangle({ x: shape.rect.x, y: shape.rect.y, width: shape.rect.w, height: shape.rect.h, color: col, opacity: 0.35 });
        } else if (shape.tool === "box" && shape.rect) {
          target.drawRectangle({ x: shape.rect.x, y: shape.rect.y, width: shape.rect.w, height: shape.rect.h, borderColor: col, borderWidth: shape.size });
        } else if (shape.tool === "text" && shape.rect && shape.text) {
          target.drawText(shape.text, { x: shape.rect.x, y: shape.rect.y, size: shape.size * 4, font, color: col });
        }
      }

      const bytes = await doc.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file.name)}_annotated.pdf`);
      toast.success("Annotated PDF downloaded");
    } catch (e) {
      toast.error((e as Error).message || "Export failed");
    } finally {
      setBusy(false);
    }
  };

  const tools: { id: Tool; icon: typeof Pencil; label: string }[] = [
    { id: "pen", icon: Pencil, label: "Draw" },
    { id: "highlight", icon: Highlighter, label: "Highlight" },
    { id: "box", icon: Square, label: "Box" },
    { id: "text", icon: Type, label: "Note" },
  ];

  return (
    <ToolPageTemplate
      title="Annotate PDF — Highlight, Draw & Comment"
      description="Highlight text, draw freehand, add boxes and sticky notes on any PDF page, then export a real annotated PDF. Free and processed in your browser."
      keywords="annotate pdf online, highlight pdf free, draw on pdf, add comments to pdf, markup pdf in browser"
    >
      <div className="space-y-6">
        {!pdf && (
          <Card className="p-6">
            <label className="block border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/40 transition-colors">
              <Highlighter className="h-12 w-12 mx-auto text-primary" />
              <p className="mt-3 font-medium">Click to upload a PDF</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
              </Button>
              <input type="file" accept="application/pdf" hidden onChange={(e) => open(e.target.files?.[0] || null)} />
            </label>
          </Card>
        )}

        {pdf && (
          <>
            <Card className="p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {tools.map((t) => (
                  <Button key={t.id} size="sm" variant={tool === t.id ? "default" : "outline"} onClick={() => setTool(t.id)}>
                    <t.icon className="h-4 w-4 mr-1" />{t.label}
                  </Button>
                ))}
                <div className="flex gap-1 ml-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setColor(c)} aria-label={`Colour ${c}`}
                      className={`h-7 w-7 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex items-center gap-2 min-w-[160px]">
                  <span className="text-xs text-muted-foreground">Size</span>
                  <Slider value={[size]} min={1} max={12} step={1} onValueChange={(v) => setSize(v[0])} />
                </div>
                <Button size="sm" variant="outline" onClick={() => setShapes((p) => p.slice(0, -1))} disabled={!shapes.length}>
                  <Undo2 className="h-4 w-4 mr-1" />Undo
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShapes([])} disabled={!shapes.length}>
                  <Eraser className="h-4 w-4 mr-1" />Clear
                </Button>
              </div>

              {tool === "text" && (
                <div>
                  <Label htmlFor="note">Note text (then click on the page to place it)</Label>
                  <Input id="note" value={textValue} onChange={(e) => setTextValue(e.target.value)} placeholder="Approved — please review section 3" className="mt-2" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous page">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Page {page} / {pdf.numPages}</span>
                <Button size="icon" variant="outline" onClick={() => setPage((p) => Math.min(pdf.numPages, p + 1))} disabled={page >= pdf.numPages} aria-label="Next page">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button className="ml-auto" onClick={exportPdf} disabled={busy}>
                  <Download className="h-4 w-4 mr-2" />{busy ? "Exporting..." : "Download Annotated PDF"}
                </Button>
              </div>
            </Card>

            <Card className="p-4 overflow-auto bg-muted/30">
              <div className="relative inline-block mx-auto">
                <canvas ref={baseCanvas} className="block rounded shadow" />
                <canvas
                  ref={overlay}
                  className="absolute inset-0 cursor-crosshair"
                  onMouseDown={onDown}
                  onMouseMove={onMove}
                  onMouseUp={onUp}
                  onMouseLeave={onUp}
                />
              </div>
            </Card>
          </>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default AnnotatePdf;
