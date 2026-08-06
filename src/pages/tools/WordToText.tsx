import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Copy, Download, Loader2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import mammoth from "mammoth";

const WordToText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const convert = async () => {
    if (!file) return toast.error("Please select a Word file first");
    setBusy(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const clean = result.value.replace(/\n{3,}/g, "\n\n").trim();
      setText(clean);
      if (!clean) toast.warning("This document has no extractable text");
      else toast.success("Text extracted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to read this document. Only .docx is supported.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(/\.docx?$/i, "") || "document") + ".txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <ToolPageTemplate
      title="Word to Text"
      description="Extract plain text from Word (.docx) documents and download it as a .txt file — fast and fully private."
      keywords="word to text, docx to txt, extract text from word"
    >
      <Card className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-3">
          <FileText className="h-14 w-14 mx-auto text-primary" />
          <p className="text-muted-foreground">Convert .docx documents to clean plain text in seconds.</p>
        </div>

        <input
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-label="Select Word file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setText("");
            }
          }}
          className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        />

        {file && <p className="text-sm text-muted-foreground">{file.name} — {(file.size / 1024).toFixed(1)} KB</p>}

        <Button onClick={convert} disabled={!file || busy} className="w-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
          {busy ? "Extracting…" : "Convert to Text"}
        </Button>

        {text && (
          <div className="space-y-3">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={14} className="font-mono text-sm" />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button className="flex-1" onClick={download}>
                <Download className="mr-2 h-4 w-4" /> Download .txt
              </Button>
            </div>
          </div>
        )}
      </Card>
    </ToolPageTemplate>
  );
};

export default WordToText;
