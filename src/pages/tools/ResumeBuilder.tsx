import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus, Trash2, Download, Sparkles, CheckCircle2, AlertCircle, ChevronUp, ChevronDown,
  FileJson, Upload, RotateCcw, ZoomIn, ZoomOut, FileText, Image as ImageIcon, Star,
} from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RESUME_TEMPLATES } from "@/components/resume/templates";
import { generateAtsResumePdf } from "@/utils/resume/atsPdf";
import { scoreResume } from "@/utils/resume/score";
import {
  DEFAULT_RESUME, DEFAULT_SETTINGS, TEMPLATE_META, newId,
  type Density, type Education, type Experience, type FontKey, type Project,
  type ResumeData, type ResumeSettings, type TemplateKey,
} from "@/utils/resume/types";

const STORAGE_KEY = "klipza-resume-draft";

const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME);
  const [settings, setSettings] = useState<ResumeSettings>(DEFAULT_SETTINGS);
  const [zoom, setZoom] = useState(0.62);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const loaded = useRef(false);

  // Restore any previous draft, then autosave on every change.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.data) setData({ ...DEFAULT_RESUME, ...parsed.data });
        if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        toast.success("Restored your saved draft");
      }
    } catch {
      /* corrupted draft — start fresh */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, settings }));
      } catch {
        /* storage full or blocked */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [data, settings]);

  const review = useMemo(() => scoreResume(data), [data]);
  const set = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const updateList = <T extends { id: string }>(key: "experience" | "education" | "projects", id: string, patch: Partial<T>) =>
    setData((prev) => ({
      ...prev,
      [key]: (prev[key] as unknown as T[]).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));

  const removeItem = (key: "experience" | "education" | "projects", id: string) =>
    setData((prev) => ({ ...prev, [key]: (prev[key] as { id: string }[]).filter((i) => i.id !== id) as never }));

  const move = (key: "experience" | "education" | "projects", index: number, dir: -1 | 1) =>
    setData((prev) => {
      const list = [...(prev[key] as { id: string }[])];
      const next = index + dir;
      if (next < 0 || next >= list.length) return prev;
      [list[index], list[next]] = [list[next], list[index]];
      return { ...prev, [key]: list as never };
    });

  const applyTemplate = (key: TemplateKey) =>
    setSettings((prev) => ({ ...prev, template: key, accent: TEMPLATE_META[key].defaultAccent }));

  /* ------------------------------- exports ------------------------------- */
  const downloadAtsPdf = () => {
    try {
      const doc = generateAtsResumePdf(data, settings);
      doc.save(`${(data.name || "resume").replace(/\s+/g, "_")}_ATS_Resume.pdf`);
      toast.success("ATS-ready PDF downloaded (real selectable text)");
    } catch (e: any) {
      toast.error(e?.message || "Could not generate the PDF");
    }
  };

  const downloadDesignPdf = async () => {
    const target = previewRef.current?.querySelector("[data-resume]") as HTMLElement | null;
    if (!target) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(target, { scale: 3, backgroundColor: "#ffffff", useCORS: true, logging: false });
      const image = canvas.toDataURL("image/jpeg", 0.96);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = 210;
      const pageH = 297;
      const imgH = (canvas.height * pageW) / canvas.width;
      let left = imgH;
      let position = 0;
      pdf.addImage(image, "JPEG", 0, position, pageW, imgH);
      left -= pageH;
      while (left > 0) {
        position = left - imgH;
        pdf.addPage();
        pdf.addImage(image, "JPEG", 0, position, pageW, imgH);
        left -= pageH;
      }
      pdf.save(`${(data.name || "resume").replace(/\s+/g, "_")}_Design_Resume.pdf`);
      toast.success("Designer PDF downloaded");
    } catch {
      toast.error("Failed to generate the designer PDF");
    } finally {
      setExporting(false);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ data, settings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.name || "resume").replace(/\s+/g, "_")}_resume.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Resume data exported");
  };

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed.data) setData({ ...DEFAULT_RESUME, ...parsed.data });
      if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      toast.success("Resume data imported");
    } catch {
      toast.error("That file is not a valid resume export");
    }
  };

  const resetAll = () => {
    setData(DEFAULT_RESUME);
    setSettings(DEFAULT_SETTINGS);
    toast.info("Reset to the sample resume");
  };

  const Template = RESUME_TEMPLATES[settings.template];
  const scoreTone = review.score >= 85 ? "text-emerald-600" : review.score >= 60 ? "text-amber-600" : "text-destructive";

  return (
    <ToolPageTemplate
      title="Resume Builder Pro"
      description="Build a recruiter-ready resume with four professional templates, a live ATS score, and a true text-based PDF export that applicant tracking systems can actually read."
      keywords="professional resume builder, ATS resume checker, free cv maker, FAANG resume template, executive cv builder"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* ------------------------------ Editor ------------------------------ */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-border/70">
            <div className="border-b border-border p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" /> Premium editor
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Build a company-ready resume</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Live ATS scoring, four hiring-manager templates and a real text PDF — not a screenshot.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={downloadAtsPdf} className="gap-2">
                    <FileText className="h-4 w-4" />ATS PDF
                  </Button>
                  <Button onClick={downloadDesignPdf} variant="outline" disabled={exporting} className="gap-2">
                    <ImageIcon className="h-4 w-4" />{exporting ? "Rendering…" : "Designer PDF"}
                  </Button>
                </div>
              </div>
              <p className="mt-3 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <strong className="text-foreground">Which one?</strong> Use the <strong>ATS PDF</strong> for online
                applications — every word stays selectable and machine-readable. Use the <strong>Designer PDF</strong>
                {" "}for the exact styled layout when emailing a human or printing.
              </p>
            </div>

            {/* Templates */}
            <div className="grid gap-3 border-b border-border bg-muted/20 p-5 sm:grid-cols-2 lg:grid-cols-4">
              {(Object.keys(TEMPLATE_META) as TemplateKey[]).map((key) => {
                const item = TEMPLATE_META[key];
                const active = settings.template === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyTemplate(key)}
                    className={`rounded-lg border p-4 text-left transition-all ${active ? "border-primary bg-card shadow-md" : "border-border bg-background hover:border-primary/40"}`}
                  >
                    <div className="mb-3 h-2 rounded-full" style={{ background: item.defaultAccent }} />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.tag}</div>
                      </div>
                      {active && <Star className="h-4 w-4 shrink-0 text-primary" />}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.pitch}</p>
                  </button>
                );
              })}
            </div>

            {/* Style controls */}
            <div className="grid gap-4 border-b border-border p-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs">Accent colour</Label>
                <Input
                  type="color"
                  value={settings.accent}
                  onChange={(e) => setSettings((p) => ({ ...p, accent: e.target.value }))}
                  className="h-9 p-1"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Typeface</Label>
                <Select value={settings.font} onValueChange={(v: FontKey) => setSettings((p) => ({ ...p, font: v }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans">Arial / Helvetica (safest)</SelectItem>
                    <SelectItem value="serif">Georgia / Times (classic)</SelectItem>
                    <SelectItem value="mono">Courier (technical)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Density</Label>
                <Select value={settings.density} onValueChange={(v: Density) => setSettings((p) => ({ ...p, density: v }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact (fit more)</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="airy">Airy (more breathing room)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content tabs */}
            <div className="p-5">
              <Tabs defaultValue="profile" className="space-y-5">
                <TabsList className="grid h-auto grid-cols-3 gap-2 rounded-lg bg-muted p-1 md:grid-cols-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="extras">Extras</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Full name" value={data.name} onChange={(v) => set("name", v)} />
                    <Field label="Target role" value={data.title} onChange={(v) => set("title", v)} />
                    <Field label="Email" value={data.email} onChange={(v) => set("email", v)} />
                    <Field label="Phone" value={data.phone} onChange={(v) => set("phone", v)} />
                    <Field label="Location" value={data.location} onChange={(v) => set("location", v)} />
                    <Field label="LinkedIn" value={data.linkedin} onChange={(v) => set("linkedin", v)} />
                    <Field label="GitHub" value={data.github} onChange={(v) => set("github", v)} />
                    <Field label="Website / Portfolio" value={data.website} onChange={(v) => set("website", v)} />
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Professional summary</Label>
                      <span className="text-xs text-muted-foreground">
                        {data.summary.trim().split(/\s+/).filter(Boolean).length} words · aim for 30-70
                      </span>
                    </div>
                    <Textarea rows={5} value={data.summary} onChange={(e) => set("summary", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Skills — one category per line, e.g. "Backend: Node.js, Go"</Label>
                    <Textarea rows={6} value={data.skills} onChange={(e) => set("skills", e.target.value)} />
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  {data.experience.map((item: Experience, index) => (
                    <EditorCard
                      key={item.id}
                      title={item.role || "Experience entry"}
                      onDelete={() => removeItem("experience", item.id)}
                      onUp={() => move("experience", index, -1)}
                      onDown={() => move("experience", index, 1)}
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input placeholder="Role" value={item.role} onChange={(e) => updateList<Experience>("experience", item.id, { role: e.target.value })} />
                        <Input placeholder="Company" value={item.company} onChange={(e) => updateList<Experience>("experience", item.id, { company: e.target.value })} />
                        <Input placeholder="Location" value={item.location} onChange={(e) => updateList<Experience>("experience", item.id, { location: e.target.value })} />
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Start" value={item.start} onChange={(e) => updateList<Experience>("experience", item.id, { start: e.target.value })} />
                          <Input placeholder="End" value={item.end} onChange={(e) => updateList<Experience>("experience", item.id, { end: e.target.value })} />
                        </div>
                      </div>
                      <Textarea
                        rows={5}
                        placeholder="One impact bullet per line. Start with an action verb and include a metric."
                        value={item.bullets}
                        onChange={(e) => updateList<Experience>("experience", item.id, { bullets: e.target.value })}
                      />
                    </EditorCard>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => set("experience", [...data.experience, { id: newId(), role: "", company: "", location: "", start: "", end: "", bullets: "" }])}
                  >
                    <Plus className="h-4 w-4" />Add experience
                  </Button>
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  {data.education.map((item: Education, index) => (
                    <EditorCard
                      key={item.id}
                      title={item.degree || "Education entry"}
                      onDelete={() => removeItem("education", item.id)}
                      onUp={() => move("education", index, -1)}
                      onDown={() => move("education", index, 1)}
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input placeholder="Degree" value={item.degree} onChange={(e) => updateList<Education>("education", item.id, { degree: e.target.value })} />
                        <Input placeholder="Institution" value={item.school} onChange={(e) => updateList<Education>("education", item.id, { school: e.target.value })} />
                        <Input placeholder="Location" value={item.location} onChange={(e) => updateList<Education>("education", item.id, { location: e.target.value })} />
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Start" value={item.start} onChange={(e) => updateList<Education>("education", item.id, { start: e.target.value })} />
                          <Input placeholder="End" value={item.end} onChange={(e) => updateList<Education>("education", item.id, { end: e.target.value })} />
                        </div>
                      </div>
                      <Input placeholder="GPA, honours, relevant coursework" value={item.details} onChange={(e) => updateList<Education>("education", item.id, { details: e.target.value })} />
                    </EditorCard>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => set("education", [...data.education, { id: newId(), degree: "", school: "", location: "", start: "", end: "", details: "" }])}
                  >
                    <Plus className="h-4 w-4" />Add education
                  </Button>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  {data.projects.map((item: Project, index) => (
                    <EditorCard
                      key={item.id}
                      title={item.name || "Project entry"}
                      onDelete={() => removeItem("projects", item.id)}
                      onUp={() => move("projects", index, -1)}
                      onDown={() => move("projects", index, 1)}
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input placeholder="Project name" value={item.name} onChange={(e) => updateList<Project>("projects", item.id, { name: e.target.value })} />
                        <Input placeholder="Tech stack" value={item.tech} onChange={(e) => updateList<Project>("projects", item.id, { tech: e.target.value })} />
                      </div>
                      <Input placeholder="Project link" value={item.link} onChange={(e) => updateList<Project>("projects", item.id, { link: e.target.value })} />
                      <Textarea rows={4} placeholder="One outcome per line" value={item.bullets} onChange={(e) => updateList<Project>("projects", item.id, { bullets: e.target.value })} />
                    </EditorCard>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => set("projects", [...data.projects, { id: newId(), name: "", tech: "", bullets: "", link: "" }])}
                  >
                    <Plus className="h-4 w-4" />Add project
                  </Button>
                </TabsContent>

                <TabsContent value="extras" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Certifications, awards & honours — one per line</Label>
                    <Textarea rows={5} value={data.awards} onChange={(e) => set("awards", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Languages</Label>
                    <Input value={data.languages} onChange={(e) => set("languages", e.target.value)} />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={exportJson}>
                      <FileJson className="h-4 w-4" />Export data
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => fileRef.current?.click()}>
                      <Upload className="h-4 w-4" />Import data
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={resetAll}>
                      <RotateCcw className="h-4 w-4" />Reset
                    </Button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="application/json"
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) importJson(f);
                        e.target.value = "";
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your draft is saved automatically in this browser — nothing is uploaded anywhere.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {/* Score */}
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />Recruiter &amp; ATS score
              </div>
              <div className={`text-2xl font-bold ${scoreTone}`}>{review.score}<span className="text-sm text-muted-foreground">/100</span></div>
            </div>
            <Progress value={review.score} className="mb-4 h-2" />
            <div className="grid gap-2 md:grid-cols-2">
              {review.checks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm"
                  title={check.hint}
                >
                  {check.pass ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  )}
                  <div>
                    <div className="text-foreground">{check.label}</div>
                    {!check.pass && <div className="text-xs text-muted-foreground">{check.hint}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{review.stats.bullets} bullets</Badge>
              <Badge variant="secondary">{review.stats.quantified} quantified</Badge>
              <Badge variant="secondary">~{review.stats.estimatedPages} page{review.stats.estimatedPages > 1 ? "s" : ""}</Badge>
              <Badge variant="secondary">{review.stats.totalWords} words</Badge>
            </div>
          </Card>
        </div>

        {/* ------------------------------ Preview ------------------------------ */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-border/70 xl:sticky xl:top-4">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/20 px-5 py-4">
              <div>
                <div className="text-sm font-medium text-foreground">Live preview</div>
                <div className="text-xs text-muted-foreground">A4 · {TEMPLATE_META[settings.template].name}</div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => setZoom((z) => Math.max(0.35, +(z - 0.08).toFixed(2)))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
                <Button size="icon" variant="ghost" onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.08).toFixed(2)))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-[78vh] overflow-auto bg-muted/30 p-4">
              <div ref={previewRef} className="flex justify-center">
                <div
                  className="origin-top shadow-2xl"
                  style={{ transform: `scale(${zoom})`, marginBottom: `${-(1 - zoom) * 297}mm` }}
                >
                  <div data-resume>
                    <Template data={data} settings={settings} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const EditorCard = ({
  title, onDelete, onUp, onDown, children,
}: {
  title: string;
  onDelete: () => void;
  onUp: () => void;
  onDown: () => void;
  children: React.ReactNode;
}) => (
  <Card className="space-y-3 border-border/70 bg-muted/20 p-4">
    <div className="flex items-center justify-between gap-3">
      <div className="truncate text-sm font-semibold text-foreground">{title}</div>
      <div className="flex shrink-0 items-center gap-1">
        <Button size="icon" variant="ghost" onClick={onUp} title="Move up"><ChevronUp className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={onDown} title="Move down"><ChevronDown className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" onClick={onDelete} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    </div>
    {children}
  </Card>
);

export default ResumeBuilder;
