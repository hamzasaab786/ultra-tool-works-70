import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, ClipboardEdit, Download } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { downloadBlob, baseName } from "@/utils/pdfPages";

type FieldKind = "text" | "check" | "radio" | "dropdown" | "option";

interface FormField {
  name: string;
  kind: FieldKind;
  value: string;
  checked: boolean;
  options: string[];
}

const PdfFormFiller = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [flatten, setFlatten] = useState(true);
  const [busy, setBusy] = useState(false);
  const [scanned, setScanned] = useState(false);

  const open = async (f: File | null) => {
    setFile(f);
    setFields([]);
    setScanned(false);
    if (!f) return;
    try {
      const { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup, PDFOptionList } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      const found: FormField[] = doc.getForm().getFields().map((field) => {
        const name = field.getName();
        if (field instanceof PDFTextField) return { name, kind: "text" as const, value: field.getText() || "", checked: false, options: [] };
        if (field instanceof PDFCheckBox) return { name, kind: "check" as const, value: "", checked: field.isChecked(), options: [] };
        if (field instanceof PDFDropdown) return { name, kind: "dropdown" as const, value: field.getSelected()[0] || "", checked: false, options: field.getOptions() };
        if (field instanceof PDFRadioGroup) return { name, kind: "radio" as const, value: field.getSelected() || "", checked: false, options: field.getOptions() };
        if (field instanceof PDFOptionList) return { name, kind: "option" as const, value: field.getSelected()[0] || "", checked: false, options: field.getOptions() };
        return { name, kind: "text" as const, value: "", checked: false, options: [] };
      });
      setFields(found);
      setScanned(true);
      toast[found.length ? "success" : "error"](found.length ? `Found ${found.length} fillable field${found.length > 1 ? "s" : ""}` : "This PDF has no fillable form fields");
    } catch (e) {
      toast.error((e as Error).message || "Could not read this PDF");
    }
  };

  const update = (name: string, patch: Partial<FormField>) =>
    setFields((prev) => prev.map((f) => (f.name === name ? { ...f, ...patch } : f)));

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup, PDFOptionList } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const form = doc.getForm();

      for (const f of fields) {
        const field = form.getFieldMaybe(f.name);
        if (!field) continue;
        try {
          if (field instanceof PDFTextField) field.setText(f.value);
          else if (field instanceof PDFCheckBox) f.checked ? field.check() : field.uncheck();
          else if (field instanceof PDFDropdown && f.value) field.select(f.value);
          else if (field instanceof PDFRadioGroup && f.value) field.select(f.value);
          else if (field instanceof PDFOptionList && f.value) field.select(f.value);
        } catch {
          /* skip fields the PDF rejects */
        }
      }

      if (flatten) form.flatten();
      const bytes = await doc.save();
      downloadBlob(bytes as unknown as ArrayBuffer, `${baseName(file.name)}_filled.pdf`);
      toast.success("Filled PDF downloaded");
    } catch (e) {
      toast.error((e as Error).message || "Could not fill the form");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolPageTemplate
      title="PDF Form Filler"
      description="Fill interactive PDF forms online — text boxes, checkboxes, radio buttons and dropdowns — then flatten and download. Free, no signup, fully private."
      keywords="pdf form filler, fill pdf form online free, fillable pdf editor, complete pdf form in browser, flatten filled pdf"
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <ClipboardEdit className="h-10 w-10 mx-auto text-primary" />
            <p className="mt-2 font-medium">{file ? file.name : "Click to upload a fillable PDF"}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <span><Upload className="h-4 w-4 mr-2" />Select PDF</span>
            </Button>
            <input type="file" accept="application/pdf" hidden onChange={(e) => open(e.target.files?.[0] || null)} />
          </label>

          {scanned && fields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No AcroForm fields detected. Use the Edit PDF Text or Sign PDF tool to add content to a flat PDF.
            </p>
          )}
        </Card>

        {fields.length > 0 && (
          <Card className="p-6 space-y-5">
            <h2 className="font-semibold">Form fields ({fields.length})</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.name} className="space-y-2">
                  <Label className="break-all text-xs">{f.name}</Label>
                  {f.kind === "text" && (
                    <Input value={f.value} onChange={(e) => update(f.name, { value: e.target.value })} placeholder="Enter value" />
                  )}
                  {f.kind === "check" && (
                    <div className="flex items-center gap-2 h-10">
                      <Checkbox id={f.name} checked={f.checked} onCheckedChange={(v) => update(f.name, { checked: Boolean(v) })} />
                      <label htmlFor={f.name} className="text-sm">Checked</label>
                    </div>
                  )}
                  {(f.kind === "dropdown" || f.kind === "radio" || f.kind === "option") && (
                    <Select value={f.value} onValueChange={(v) => update(f.name, { value: v })}>
                      <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
                      <SelectContent>
                        {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <Label htmlFor="flatten">Flatten after filling</Label>
                <p className="text-xs text-muted-foreground">Locks your answers so nobody can change them.</p>
              </div>
              <Switch id="flatten" checked={flatten} onCheckedChange={setFlatten} />
            </div>

            <Button onClick={run} disabled={busy} className="w-full" size="lg">
              <Download className="h-4 w-4 mr-2" />{busy ? "Saving..." : "Fill & Download PDF"}
            </Button>
          </Card>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default PdfFormFiller;
