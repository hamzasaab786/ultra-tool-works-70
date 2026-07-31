import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Presentation, Download, Loader2, Upload, CheckCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { jsPDF } from "jspdf";
import JSZip from "jszip";

const PowerPointToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const name = selectedFile.name.toLowerCase();
      if (name.endsWith(".pptx") || name.endsWith(".ppt")) {
        setFile(selectedFile);
        toast.success("PowerPoint file selected!");
      } else {
        toast.error("Please select a valid PowerPoint file (.pptx)");
      }
    }
  };

  // EMU (English Metric Units) -> millimetres
  const emuToMm = (emu: number) => (emu / 914400) * 25.4;

  type Block =
    | { kind: "text"; x?: number; y?: number; w?: number; h?: number; runs: { text: string; size: number; bold: boolean }[] }
    | { kind: "image"; x: number; y: number; w: number; h: number; data: string; fmt: string };

  const getTransform = (el: Element) => {
    const off = el.querySelector("xfrm > off");
    const ext = el.querySelector("xfrm > ext");
    if (!off || !ext) return undefined;
    return {
      x: emuToMm(Number(off.getAttribute("x") || 0)),
      y: emuToMm(Number(off.getAttribute("y") || 0)),
      w: emuToMm(Number(ext.getAttribute("cx") || 0)),
      h: emuToMm(Number(ext.getAttribute("cy") || 0)),
    };
  };

  const parseSlide = async (
    zip: JSZip,
    slidePath: string
  ): Promise<{ blocks: Block[] }> => {
    const xml = await zip.file(slidePath)?.async("string");
    if (!xml) return { blocks: [] };

    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const relsPath = slidePath.replace(/slides\/(slide\d+)\.xml$/, "slides/_rels/$1.xml.rels");
    const relsXml = await zip.file(relsPath)?.async("string");
    const rels = new Map<string, string>();
    if (relsXml) {
      const relDoc = new DOMParser().parseFromString(relsXml, "application/xml");
      relDoc.querySelectorAll("Relationship").forEach((r) => {
        const id = r.getAttribute("Id");
        const target = r.getAttribute("Target");
        if (id && target) rels.set(id, target.replace(/^\.\.\//, "ppt/"));
      });
    }

    const blocks: Block[] = [];

    // Text shapes
    doc.querySelectorAll("sp").forEach((sp) => {
      const runs: { text: string; size: number; bold: boolean }[] = [];
      sp.querySelectorAll("p").forEach((para) => {
        const parts: string[] = [];
        let size = 0;
        let bold = false;
        para.querySelectorAll("r").forEach((r) => {
          const t = r.querySelector("t")?.textContent || "";
          if (!t.trim()) return;
          parts.push(t);
          const rPr = r.querySelector("rPr");
          const sz = Number(rPr?.getAttribute("sz") || 0);
          if (sz) size = Math.max(size, sz / 100);
          if (rPr?.getAttribute("b") === "1") bold = true;
        });
        const text = parts.join("").trim();
        if (text) runs.push({ text, size: size || 0, bold });
      });
      if (runs.length === 0) return;
      const tf = getTransform(sp);
      blocks.push({ kind: "text", ...(tf || {}), runs });
    });

    // Pictures
    const picPromises: Promise<void>[] = [];
    doc.querySelectorAll("pic").forEach((pic) => {
      const embed =
        pic.querySelector("blip")?.getAttribute("r:embed") ||
        pic.querySelector("blip")?.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "embed");
      const tf = getTransform(pic);
      if (!embed || !tf) return;
      const target = rels.get(embed);
      if (!target) return;
      const ext = target.split(".").pop()?.toLowerCase();
      if (!ext || !["png", "jpg", "jpeg"].includes(ext)) return;
      picPromises.push(
        (async () => {
          const b64 = await zip.file(target)?.async("base64");
          if (!b64) return;
          const mime = ext === "png" ? "image/png" : "image/jpeg";
          blocks.push({
            kind: "image",
            ...tf,
            data: `data:${mime};base64,${b64}`,
            fmt: ext === "png" ? "PNG" : "JPEG",
          });
        })()
      );
    });
    await Promise.all(picPromises);

    return { blocks };
  };

  const convertToPdf = async () => {
    if (!file) {
      toast.error("Please select a PowerPoint file first");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pptx")) {
      toast.error("Only .pptx files are supported. Please save your .ppt as .pptx first.");
      return;
    }

    setIsConverting(true);
    setProgress(10);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      setProgress(25);

      // Real slide size from presentation.xml (defaults to 10 x 7.5in)
      let slideWmm = 254;
      let slideHmm = 190.5;
      const presXml = await zip.file("ppt/presentation.xml")?.async("string");
      if (presXml) {
        const sz = new DOMParser()
          .parseFromString(presXml, "application/xml")
          .querySelector("sldSz");
        if (sz) {
          slideWmm = emuToMm(Number(sz.getAttribute("cx") || 0)) || slideWmm;
          slideHmm = emuToMm(Number(sz.getAttribute("cy") || 0)) || slideHmm;
        }
      }

      const slideFiles: string[] = [];
      zip.forEach((path) => {
        if (path.match(/^ppt\/slides\/slide\d+\.xml$/)) slideFiles.push(path);
      });
      slideFiles.sort(
        (a, b) =>
          parseInt(a.match(/slide(\d+)/)?.[1] || "0") - parseInt(b.match(/slide(\d+)/)?.[1] || "0")
      );

      if (slideFiles.length === 0) {
        toast.error("No slides found in the PowerPoint file");
        return;
      }

      const pdf = new jsPDF({
        orientation: slideWmm >= slideHmm ? "landscape" : "portrait",
        unit: "mm",
        format: [slideWmm, slideHmm],
      });

      for (let i = 0; i < slideFiles.length; i++) {
        if (i > 0) pdf.addPage([slideWmm, slideHmm], slideWmm >= slideHmm ? "landscape" : "portrait");

        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, slideWmm, slideHmm, "F");

        const { blocks } = await parseSlide(zip, slideFiles[i]);

        // Images first so text stays on top
        for (const b of blocks) {
          if (b.kind !== "image") continue;
          try {
            pdf.addImage(b.data, b.fmt, b.x, b.y, b.w, b.h);
          } catch (e) {
            console.warn("Skipped slide image", e);
          }
        }

        const textBlocks = blocks.filter((b): b is Extract<Block, { kind: "text" }> => b.kind === "text");
        let flowY = 25;

        textBlocks.forEach((block, idx) => {
          const positioned = block.x !== undefined && block.y !== undefined;
          const boxX = positioned ? block.x! : 20;
          const boxW = positioned ? Math.max(block.w || 0, 20) : slideWmm - 40;
          let y = positioned ? block.y! : flowY;

          block.runs.forEach((run, r) => {
            // Point size -> mm (1pt = 0.3528mm); fall back to title/body defaults
            const ptSize = run.size || (idx === 0 && r === 0 ? 28 : 16);
            pdf.setFontSize(ptSize);
            pdf.setFont("helvetica", run.bold || (idx === 0 && r === 0) ? "bold" : "normal");
            pdf.setTextColor(run.bold ? 20 : 45, run.bold ? 20 : 45, run.bold ? 20 : 45);

            const lineH = ptSize * 0.3528 * 1.25;
            const lines = pdf.splitTextToSize(run.text, boxW);
            if (y + lineH > slideHmm - 8) return;
            pdf.text(lines, boxX, y + lineH * 0.8);
            y += lines.length * lineH + lineH * 0.25;
          });

          if (!positioned) flowY = y + 4;
        });

        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${i + 1}`, slideWmm - 10, slideHmm - 5);

        setProgress(25 + ((i + 1) / slideFiles.length) * 70);
      }

      pdf.save(file.name.replace(/\.(pptx?|PPTX?)$/, ".pdf"));
      setProgress(100);
      toast.success(`Converted ${slideFiles.length} slides to PDF!`);
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert PowerPoint to PDF");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setProgress(0);
      }, 800);
    }
  };


  return (
    <ToolPageTemplate
      title="PowerPoint to PDF Converter"
      description="Convert PowerPoint presentations (.pptx) to PDF format instantly. Free and secure online conversion tool."
      keywords="powerpoint to pdf, pptx to pdf, ppt to pdf, presentation converter"
    >
      <div className="space-y-6 animate-fade-in">
        <Card className="p-8 glassmorphism border-orange-100/50">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50/50">
                <Presentation className="h-16 w-16 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold">Convert PowerPoint to PDF</h2>
              <p className="text-muted-foreground">
                Upload your .pptx presentation and convert it to PDF
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept=".pptx,.ppt"
                  onChange={handleFileChange}
                  className="w-full p-6 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all duration-300"
                  disabled={isConverting}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-orange-400" />
                    <p className="text-sm text-muted-foreground">
                      {file ? file.name : "Click or drag PowerPoint file here"}
                    </p>
                  </div>
                </div>
              </div>

              {file && (
                <Card className="p-4 bg-gradient-to-r from-orange-50/50 to-red-50/30 border-orange-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Presentation className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    {!isConverting && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>
                </Card>
              )}

              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Converting slides...</span>
                    <span className="font-medium text-orange-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={convertToPdf}
                disabled={!file || isConverting}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Convert to PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-3">Features:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Extracts real text content from each slide</li>
            <li>✓ Preserves slide order and structure</li>
            <li>✓ Landscape format matching presentations</li>
            <li>✓ 100% browser-based - files never leave your device</li>
            <li>✓ Completely free, no sign-up required</li>
          </ul>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PowerPointToPdf;
