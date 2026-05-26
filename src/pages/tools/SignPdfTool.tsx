import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Upload, Download, PenLine, Trash2, Move } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument } from "pdf-lib";
import { renderPdfPreviewPages } from "@/utils/pdfClient";

interface Placement { page: number; x: number; y: number; w: number; h: number; }

const SignPdfTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ url: string; w: number; h: number }[]>([]);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [typedSig, setTypedSig] = useState("");
  const [sigSize, setSigSize] = useState([150]);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const sigRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      try {
        const out = await renderPdfPreviewPages(file, 1.25);
        setPages(out);
      } catch (error: any) {
        toast.error(error?.message || "Unable to render PDF preview");
      }
    })();
  }, [file]);

  const captureDrawn = () => {
    if (sigRef.current?.isEmpty()) { toast.error("Draw a signature first"); return; }
    const data = sigRef.current!.getCanvas().toDataURL("image/png");
    setSignatureData(data);
    toast.success("Signature ready — click on PDF to place");
  };

  const captureTyped = () => {
    if (!typedSig.trim()) { toast.error("Type your name"); return; }
    const canvas = document.createElement("canvas");
    canvas.width = 600; canvas.height = 150;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 600, 150);
    ctx.fillStyle = "#000"; ctx.font = "italic 60px 'Brush Script MT', cursive";
    ctx.fillText(typedSig, 20, 100);
    setSignatureData(canvas.toDataURL("image/png"));
    toast.success("Signature ready — click on PDF to place");
  };

  const onPageClick = (e: React.MouseEvent<HTMLDivElement>, pageIdx: number) => {
    if (!signatureData) { toast.error("Create a signature first"); return; }
    const rect = (e.currentTarget.querySelector("img") as HTMLImageElement | null)?.getBoundingClientRect() || e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlacement({ page: pageIdx, x, y, w: sigSize[0], h: sigSize[0] / 3 });
  };

  const exportPdf = async () => {
    if (!file || !signatureData || !placement) { toast.error("Place signature first"); return; }
    try {
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf);
      const page = pdfDoc.getPages()[placement.page];
      const { width: pw, height: ph } = page.getSize();
      const previewW = pages[placement.page].w;
      const previewH = pages[placement.page].h;
      const scaleX = pw / previewW;
      const scaleY = ph / previewH;
      const pngBytes = await fetch(signatureData).then(r => r.arrayBuffer());
      const png = await pdfDoc.embedPng(pngBytes);
      const w = placement.w * scaleX;
      const h = placement.h * scaleY;
      const x = placement.x * scaleX;
      const y = ph - (placement.y * scaleY) - h;
      page.drawImage(png, { x, y, width: w, height: h });
      const out = await pdfDoc.save();
      const blob = new Blob([out as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `signed_${file.name}`; a.click();
      URL.revokeObjectURL(url);
      toast.success("Signed PDF downloaded");
    } catch (e: any) { toast.error(e.message || "Failed"); }
  };

  return (
    <ToolPageTemplate title="Sign PDF" description="Add handwritten or typed signatures to PDF documents. Draw, type, and place anywhere." keywords="sign PDF online, electronic signature, eSign PDF">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 space-y-4 lg:col-span-1">
          <Label>Upload PDF</Label>
          <label className="block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40">
            <Upload className="w-6 h-6 mx-auto" />
            <div className="text-xs mt-1">{file ? file.name : "Click to upload"}</div>
            <input type="file" accept="application/pdf" hidden onChange={e => { setFile(e.target.files?.[0] || null); setPlacement(null); }} />
          </label>

          <div>
            <Label>Create Signature</Label>
            <Tabs defaultValue="draw" className="mt-2">
              <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="draw">Draw</TabsTrigger><TabsTrigger value="type">Type</TabsTrigger></TabsList>
              <TabsContent value="draw" className="space-y-2">
                <div className="border rounded bg-white">
                  <SignatureCanvas ref={sigRef} canvasProps={{ width: 320, height: 130, className: "rounded" }} penColor="black" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => sigRef.current?.clear()}><Trash2 className="w-4 h-4" /></Button>
                  <Button size="sm" onClick={captureDrawn} className="flex-1"><PenLine className="w-4 h-4 mr-1" />Use Signature</Button>
                </div>
              </TabsContent>
              <TabsContent value="type" className="space-y-2">
                <Input placeholder="Type your full name" value={typedSig} onChange={e => setTypedSig(e.target.value)} />
                {typedSig && <div className="border rounded p-2 bg-white text-3xl text-center" style={{ fontFamily: "'Brush Script MT', cursive", fontStyle: "italic" }}>{typedSig}</div>}
                <Button size="sm" onClick={captureTyped} className="w-full"><PenLine className="w-4 h-4 mr-1" />Use Signature</Button>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label>Signature Width: {sigSize[0]}px</Label>
            <Slider value={sigSize} onValueChange={setSigSize} min={60} max={300} step={10} />
          </div>

          {signatureData && (
            <div>
              <Label>Preview</Label>
              <img src={signatureData} alt="sig" className="border rounded bg-white p-2 max-h-20" />
              <p className="text-xs text-muted-foreground mt-2">Now click on the PDF page where you want to place it.</p>
              {placement && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Move className="h-3.5 w-3.5" />Click again anywhere to reposition instantly.</p>}
            </div>
          )}

          <Button onClick={exportPdf} disabled={!placement} size="lg" className="w-full"><Download className="w-4 h-4 mr-2" />Download Signed PDF</Button>
        </Card>

        <Card className="p-4 lg:col-span-2 max-h-[80vh] overflow-y-auto bg-gray-200 space-y-4">
          {pages.length === 0 && <div className="text-center text-muted-foreground py-12">Upload a PDF to begin</div>}
          {pages.map((p, idx) => (
            <div key={idx} className="relative inline-block w-full flex justify-center">
              <div className="relative cursor-crosshair shadow-lg" onClick={e => onPageClick(e, idx)}>
                <img src={p.url} alt={`p${idx + 1}`} className="block h-auto max-w-full" style={{ width: p.w, maxWidth: "100%" }} />
                {placement?.page === idx && signatureData && (
                  <img src={signatureData} alt="placed" className="absolute pointer-events-none border border-blue-500"
                    style={{ left: placement.x, top: placement.y, width: placement.w, height: placement.h }} />
                )}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Page {idx + 1}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default SignPdfTool;
