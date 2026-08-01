import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Search, Printer, FileText, RotateCw } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { loadPdfDocument, renderPdfPageToCanvas } from "@/utils/pdfClient";

const PdfViewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1.3);
  const [rotation, setRotation] = useState(0);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const canvasHost = useRef<HTMLDivElement>(null);

  const open = async (f: File | null) => {
    if (!f) return;
    setFile(f);
    setLoading(true);
    setThumbs([]);
    setMatches([]);
    try {
      const doc = await loadPdfDocument(f);
      setPdf(doc);
      setPage(1);
      // Build small thumbnails lazily after the first page is on screen.
      const list: string[] = [];
      for (let p = 1; p <= Math.min(doc.numPages, 40); p++) {
        const pg = await doc.getPage(p);
        const { canvas } = await renderPdfPageToCanvas(pg, 0.25);
        list.push(canvas.toDataURL("image/jpeg", 0.6));
      }
      setThumbs(list);
    } catch (e) {
      toast.error((e as Error).message || "Could not open this PDF");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pdf || !canvasHost.current) return;
    let cancelled = false;
    (async () => {
      const pg = await pdf.getPage(page);
      const viewport = pg.getViewport({ scale: zoom, rotation });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      canvas.className = "mx-auto shadow-lg rounded max-w-full h-auto";
      await pg.render({ canvasContext: ctx, viewport }).promise;
      if (cancelled || !canvasHost.current) return;
      canvasHost.current.replaceChildren(canvas);
    })();
    return () => { cancelled = true; };
  }, [pdf, page, zoom, rotation]);

  const search = async () => {
    if (!pdf || !query.trim()) return;
    const needle = query.toLowerCase();
    const hits: number[] = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const pg = await pdf.getPage(p);
      const content = await pg.getTextContent();
      const text = content.items.map((i: any) => i.str).join(" ").toLowerCase();
      if (text.includes(needle)) hits.push(p);
    }
    setMatches(hits);
    if (hits.length) {
      setPage(hits[0]);
      toast.success(`Found on ${hits.length} page${hits.length > 1 ? "s" : ""}`);
    } else {
      toast.error("No matches found");
    }
  };

  return (
    <ToolPageTemplate
      title="PDF Viewer & Reader"
      description="Open, read and search any PDF right in your browser with zoom, rotation, page thumbnails and full-text search. Nothing is uploaded to a server."
      keywords="pdf viewer online, read pdf in browser, pdf reader free, search text in pdf online, open pdf without adobe"
    >
      <div className="space-y-6">
        {!pdf && (
          <Card className="p-6">
            <label className="block border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/40 transition-colors">
              <FileText className="h-12 w-12 mx-auto text-primary" />
              <p className="mt-3 font-medium">{loading ? "Opening..." : "Click to open a PDF"}</p>
              <p className="text-sm text-muted-foreground">Your file never leaves this device</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
              </Button>
              <input type="file" accept="application/pdf" hidden onChange={(e) => open(e.target.files?.[0] || null)} />
            </label>
          </Card>
        )}

        {pdf && (
          <>
            <Card className="p-3 flex flex-wrap items-center gap-2">
              <Button size="icon" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-1">Page {page} / {pdf.numPages}</span>
              <Button size="icon" variant="outline" onClick={() => setPage((p) => Math.min(pdf.numPages, p + 1))} disabled={page >= pdf.numPages} aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} aria-label="Zoom out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-14 text-center">{Math.round(zoom * 100)}%</span>
              <Button size="icon" variant="outline" onClick={() => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))} aria-label="Zoom in">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => setRotation((r) => (r + 90) % 360)} aria-label="Rotate view">
                <RotateCw className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 ml-auto">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} placeholder="Search text..." className="h-9 w-40" />
                <Button size="sm" variant="outline" onClick={search}><Search className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => window.open(URL.createObjectURL(file!), "_blank")}>
                  <Printer className="h-4 w-4 mr-1" />Print
                </Button>
              </div>
            </Card>

            {matches.length > 0 && (
              <Card className="p-3 text-sm flex flex-wrap gap-2 items-center">
                <span className="text-muted-foreground">Matches on pages:</span>
                {matches.map((m) => (
                  <Button key={m} size="sm" variant={m === page ? "default" : "outline"} onClick={() => setPage(m)}>{m}</Button>
                ))}
              </Card>
            )}

            <div className="grid md:grid-cols-[140px_1fr] gap-4">
              <Card className="p-2 max-h-[75vh] overflow-y-auto hidden md:block">
                {thumbs.map((t, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`block w-full mb-2 rounded border-2 ${page === i + 1 ? "border-primary" : "border-transparent"}`}>
                    <img src={t} alt={`Page ${i + 1} thumbnail`} className="w-full rounded" loading="lazy" />
                    <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                  </button>
                ))}
              </Card>
              <Card className="p-4 overflow-auto max-h-[75vh] bg-muted/30">
                <div ref={canvasHost} />
              </Card>
            </div>

            <Button variant="outline" onClick={() => { setPdf(null); setFile(null); }}>Open another PDF</Button>
          </>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default PdfViewer;
