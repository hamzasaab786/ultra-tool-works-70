import React, { useMemo, useState } from "react";
import yaml from "js-yaml";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeftRight, Copy, Download } from "lucide-react";

const SAMPLE = `name: klipza
version: 1.2.0
features:
  - pdf
  - image
server:
  port: 8080
  secure: true`;

const YamlJsonConverter = () => {
  const [mode, setMode] = useState<"y2j" | "j2y">("y2j");
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState(2);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "y2j") {
        const docs = yaml.loadAll(input);
        const data = docs.length === 1 ? docs[0] : docs;
        return { output: JSON.stringify(data, null, indent), error: "" };
      }
      return { output: yaml.dump(JSON.parse(input), { indent, lineWidth: -1 }), error: "" };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, mode, indent]);

  const swap = () => {
    if (output) setInput(output);
    setMode(mode === "y2j" ? "j2y" : "y2j");
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = mode === "y2j" ? "converted.json" : "converted.yaml";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolPageTemplate
      title="YAML to JSON Converter"
      description="Convert YAML to JSON or JSON to YAML instantly with live validation and exact error line numbers — private, in your browser."
    >
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={mode === "y2j" ? "default" : "outline"} onClick={() => setMode("y2j")}>YAML → JSON</Button>
            <Button variant={mode === "j2y" ? "default" : "outline"} onClick={() => setMode("j2y")}>JSON → YAML</Button>
            <Button variant="outline" onClick={swap}><ArrowLeftRight className="h-4 w-4 mr-1" /> Swap</Button>
            <label className="text-sm text-muted-foreground ml-auto">Indent
              <select className="ml-2 rounded border bg-background px-2 py-1" value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
                <option value={2}>2 spaces</option><option value={4}>4 spaces</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium">{mode === "y2j" ? "YAML input" : "JSON input"}</p>
              <Textarea aria-label="Input" className="min-h-[320px] font-mono text-sm" value={input} onChange={(e) => setInput(e.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">{mode === "y2j" ? "JSON output" : "YAML output"}</p>
              <Textarea aria-label="Output" readOnly className="min-h-[320px] font-mono text-sm" value={error ? "" : output} />
            </div>
          </div>
          {error && <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive whitespace-pre-wrap">{error}</p>}
          <div className="flex gap-2">
            <Button disabled={!output || !!error} onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
            <Button variant="outline" disabled={!output || !!error} onClick={download}><Download className="h-4 w-4 mr-1" /> Download</Button>
          </div>
        </CardContent>
      </Card>
    </ToolPageTemplate>
  );
};

export default YamlJsonConverter;
