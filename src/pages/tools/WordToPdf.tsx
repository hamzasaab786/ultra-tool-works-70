import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { FileText, Download, Loader2, Upload, CheckCircle } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import mammoth from "mammoth";
import htmlToPdfmake from "html-to-pdfmake";
import { loadPdfMake } from "@/utils/officeConvert";

type Mode = "exact" | "text";

const WordToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string>("");
  const [mode, setMode] = useState<Mode>("exact");
  const stageRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        selectedFile.type === "application/msword" ||
        /\.docx?$/i.test(selectedFile.name)
      ) {
        setFile(selectedFile);
        toast.success("Word file selected successfully!");
      } else {
        toast.error("Please select a valid Word file (.docx or .doc)");
      }
    }
  };

/**
 * Word stores "page break before" as a paragraph property that the renderer ignores.
 * Rewrite it into an explicit page-break run so pagination matches Word exactly.
 */
const normalizeDocxPageBreaks = async (docFile: File): Promise<ArrayBuffer> => {
  try {
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(await docFile.arrayBuffer());
    const entry = zip.file("word/document.xml");
    if (!entry) return await docFile.arrayBuffer();
    const xml = await entry.async("string");
    if (!/<w:pageBreakBefore(\s[^>]*)?\/?>/.test(xml)) return await docFile.arrayBuffer();

    let first = true;
    const patched = xml.replace(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g, (para) => {
      if (!/<w:pageBreakBefore(?![^>]*w:val="(?:0|false)")/.test(para)) return para;
      if (first) {
        first = false; // Word ignores a break before the very first paragraph of the body
        return para;
      }
      return para.replace(/<\/w:pPr>/, '</w:pPr><w:r><w:br w:type="page"/></w:r>');
    });

    zip.file("word/document.xml", patched);
    return await zip.generateAsync({ type: "arraybuffer" });
  } catch {
    return await docFile.arrayBuffer();
  }
};

  /** Pixel-perfect: render the real DOCX layout (page size, margins, fonts, tables) then snapshot each page. */
  const convertExact = async (docFile: File) => {
    const [{ renderAsync }, html2canvas, jsPDFmod, buffer] = await Promise.all([
      import("docx-preview"),
      import("html2canvas").then((m) => m.default),
      import("jspdf"),
      normalizeDocxPageBreaks(docFile),
    ]);
    const jsPDF = (jsPDFmod as any).jsPDF ?? (jsPDFmod as any).default;

    const stage = stageRef.current!;
    stage.innerHTML = "";
    const styleHost = document.createElement("div");
    const target = document.createElement("div");
    stage.appendChild(styleHost);
    stage.appendChild(target);

    setProgress(25);
    await renderAsync(buffer, target, styleHost, {
      className: "docx",
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
      useBase64URL: true,
      experimental: true,
    } as any);

    // wait for fonts + images so nothing renders blank
    await (document as any).fonts?.ready?.catch?.(() => {});
    const imgs = Array.from(target.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = img.onerror = () => res(null);
            })
      )
    );
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));

    const sections = Array.from(target.querySelectorAll<HTMLElement>("section.docx"));
    if (!sections.length) throw new Error("no-pages");

    setProgress(40);
    const PX_TO_PT = 72 / 96;
    let pdf: any = null;
    let pageCount = 0;

    const addPage = (dataUrl: string, wPt: number, hPt: number) => {
      if (!pdf) {
        pdf = new jsPDF({
          unit: "pt",
          format: [wPt, hPt],
          orientation: wPt > hPt ? "landscape" : "portrait",
          compress: true,
        });
      } else {
        pdf.addPage([wPt, hPt], wPt > hPt ? "landscape" : "portrait");
      }
      pdf.addImage(dataUrl, "JPEG", 0, 0, wPt, hPt, undefined, "FAST");
      pageCount++;
    };

    for (let i = 0; i < sections.length; i++) {
      const el = sections[i];
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      // docx-preview sets the real Word page height as min-height on the section
      const declaredH = parseFloat(cs.minHeight) || parseFloat(cs.height) || rect.height;
      const pageH = declaredH > 20 ? declaredH : rect.height;

      const canvas = await html2canvas(el, {
        scale: Math.min(3, Math.max(2, 1600 / rect.width)),
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: Math.ceil(rect.width),
        windowHeight: Math.ceil(rect.height),
      });

      const wPt = rect.width * PX_TO_PT;
      const ratio = canvas.width / rect.width; // device px per CSS px
      // Content taller than one Word page (long flowing docs) is split into real pages.
      const slices = Math.max(1, Math.round(rect.height / pageH));

      if (slices === 1) {
        addPage(canvas.toDataURL("image/jpeg", 0.95), wPt, rect.height * PX_TO_PT);
      } else {
        const sliceH = Math.floor(canvas.height / slices);
        for (let s = 0; s < slices; s++) {
          const part = document.createElement("canvas");
          part.width = canvas.width;
          part.height = s === slices - 1 ? canvas.height - sliceH * s : sliceH;
          const ctx = part.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, part.width, part.height);
          ctx.drawImage(canvas, 0, -sliceH * s);
          addPage(part.toDataURL("image/jpeg", 0.95), wPt, (part.height / ratio) * PX_TO_PT);
        }
      }
      setProgress(40 + Math.round(((i + 1) / sections.length) * 50));
    }


    pdf.save(docFile.name.replace(/\.(docx?|DOCX?)$/, "") + ".pdf");
    stage.innerHTML = "";
    return `${pageCount} page(s) rendered with exact Word layout.`;
  };

  /** Selectable-text mode (vector) using mammoth + pdfmake. */
  const convertText = async (docFile: File) => {
    const arrayBuffer = await docFile.arrayBuffer();
    setProgress(25);

    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        styleMap: [
          "p[style-name='Title'] => h1.title:fresh",
          "p[style-name='Subtitle'] => h2.subtitle:fresh",
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Heading 4'] => h4:fresh",
          "p[style-name='Quote'] => blockquote:fresh",
          "r[style-name='Strong'] => strong",
          "r[style-name='Emphasis'] => em",
        ],
        convertImage: mammoth.images.imgElement(async (image) => {
          const base64 = await image.read("base64");
          return { src: `data:${image.contentType};base64,${base64}` };
        }),
      }
    );
    const html = result.value || "<p></p>";
    setProgress(55);

    const pdfMake = await loadPdfMake();
    const converted: any = htmlToPdfmake(html, {
      window,
      imagesByReference: true,
      removeExtraBlanks: true,
      tableAutoSize: true,
      defaultStyles: {
        p: { margin: [0, 0, 0, 8], lineHeight: 1.35 },
        h1: { fontSize: 22, bold: true, margin: [0, 10, 0, 8] },
        h2: { fontSize: 18, bold: true, margin: [0, 10, 0, 6] },
        h3: { fontSize: 15, bold: true, margin: [0, 8, 0, 6] },
        h4: { fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
        li: { margin: [0, 0, 0, 4] },
        a: { color: "#1a56db", decoration: "underline" },
        blockquote: { italics: true, margin: [16, 6, 0, 8] },
        table: { margin: [0, 6, 0, 10] },
        th: { bold: true, fillColor: "#f1f5f9" },
      },
    });
    setProgress(80);

    const docDefinition: any = {
      pageSize: "A4",
      pageMargins: [56, 56, 56, 56],
      content: converted.content ?? converted,
      images: converted.images ?? {},
      defaultStyle: { fontSize: 11, lineHeight: 1.3, font: "Roboto" },
    };

    await new Promise<void>((resolve, reject) => {
      try {
        pdfMake
          .createPdf(docDefinition)
          .download(docFile.name.replace(/\.(docx?|DOCX?)$/, "") + ".pdf", () => resolve());
      } catch (e) {
        reject(e);
      }
    });
    return "Converted with selectable text.";
  };

  const convertToPdf = async () => {
    if (!file) {
      toast.error("Please select a Word file first");
      return;
    }

    setIsConverting(true);
    setProgress(10);

    try {
      let message: string;
      if (mode === "exact") {
        try {
          message = await convertExact(file);
        } catch (err) {
          console.warn("Exact mode failed, falling back to text mode:", err);
          message = await convertText(file);
        }
      } else {
        message = await convertText(file);
      }

      setProgress(100);
      toast.success(
        mode === "exact"
          ? "Converted — layout matches your Word file exactly!"
          : "Converted with original formatting — text stays selectable!"
      );
      setPreview(message);
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert Word file to PDF. Make sure the file is a valid .docx document.");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
        setProgress(0);
      }, 1000);
    }
  };


  return (
    <ToolPageTemplate
      title="Word to PDF Converter"
      description="Convert Word documents (.docx, .doc) to PDF format instantly. Free and secure online conversion tool."
      keywords="word to pdf, docx to pdf, doc to pdf converter, word converter"
    >
      <div className="space-y-6 animate-fade-in">
        <Card className="p-8 glassmorphism border-indigo-100/50">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50/50 animate-scale-in">
                <FileText className="h-16 w-16 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold gradient-text">Convert Word to PDF</h2>
              <p className="text-muted-foreground">
                Upload your Word document and convert it to professional PDF format
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("exact")}
                disabled={isConverting}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  mode === "exact"
                    ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30"
                    : "border-border hover:border-indigo-300"
                }`}
              >
                <p className="font-semibold text-sm">Exact Layout (recommended)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pixel-perfect copy of your Word file — page size, margins, fonts, tables and images stay identical.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setMode("text")}
                disabled={isConverting}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  mode === "text"
                    ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30"
                    : "border-border hover:border-indigo-300"
                }`}
              >
                <p className="font-semibold text-sm">Selectable Text</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Smaller file with copyable, searchable text. Layout may shift slightly.
                </p>
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label
                  htmlFor="word-file"
                  className="block text-sm font-semibold mb-3"
                >
                  Select Word File
                </label>
                <div className="relative">
                  <input
                    id="word-file"
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="w-full p-6 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300"
                    disabled={isConverting}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-indigo-400" />
                      <p className="text-sm text-muted-foreground">
                        Click or drag Word file here
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {file && (
                <Card className="p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 border-indigo-100 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    {!isConverting && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </Card>
              )}

              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Converting...</span>
                    <span className="font-medium text-indigo-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={convertToPdf}
                disabled={!file || isConverting}
                className="w-full btn-modern bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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

        {preview && (
          <Card className="p-6 glassmorphism border-green-100/50 animate-scale-in">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-700">Conversion Successful!</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your Word document has been converted to PDF and downloaded.
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6 glassmorphism border-purple-100/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-lg">✨</span>
            Features
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Real Conversion:</strong> Preserves text and formatting from Word documents
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Supports .doc & .docx:</strong> Works with all Word file formats
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">100% Browser-Based:</strong> Your files never leave your device
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">No File Limits:</strong> Convert documents of any size
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Completely Free:</strong> No sign-up or payment required
              </span>
            </li>
          </ul>
        </Card>

        {/* Offscreen high-fidelity DOCX render stage */}
        <div
          ref={stageRef}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-10000px",
            top: 0,
            width: "1400px",
            background: "#ffffff",
            zIndex: -1,
            pointerEvents: "none",
          }}
        />
      </div>

    </ToolPageTemplate>
  );
};

export default WordToPdf;
