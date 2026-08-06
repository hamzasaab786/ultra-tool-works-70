import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileType, Download, Loader2, Upload } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const TextToWord = () => {
  const [text, setText] = useState("");
  const [name, setName] = useState("document");
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    if (!text.trim()) return toast.error("Please enter or upload some text");
    setBusy(true);
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const paragraphs = text.split(/\r?\n/).map(
        (line) =>
          new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: line, font: "Arial", size: 24 })],
          })
      );
      const doc = new Document({
        styles: { default: { document: { run: { font: "Arial", size: 24 } } } },
        sections: [
          {
            properties: {
              page: {
                size: { width: 12240, height: 15840 },
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
              },
            },
            children: paragraphs,
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.trim() || "document"}.docx`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast.success("Word document downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create the Word file");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Text to Word"
      description="Convert plain text into a formatted Microsoft Word (.docx) document instantly, free and private."
      keywords="text to word, txt to docx, convert text to word document"
    >
      <Card className="p-6 md:p-8 space-y-6">
        <div className="text-center space-y-3">
          <FileType className="h-14 w-14 mx-auto text-primary" />
          <p className="text-muted-foreground">Paste your text or load a .txt file, then export a real .docx.</p>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer w-fit">
          <Upload className="h-4 w-4" />
          <span>Load a .txt file</span>
          <input
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setText(await f.text());
              setName(f.name.replace(/\.txt$/i, ""));
              toast.success("Text loaded");
            }}
          />
        </label>

        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={14} placeholder="Type or paste your content here…" />

        <div className="space-y-2">
          <label htmlFor="docname" className="text-sm font-medium">File name</label>
          <Input id="docname" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <Button onClick={generate} disabled={busy || !text.trim()} className="w-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {busy ? "Building…" : "Download .docx"}
        </Button>
      </Card>
    </ToolPageTemplate>
  );
};

export default TextToWord;
