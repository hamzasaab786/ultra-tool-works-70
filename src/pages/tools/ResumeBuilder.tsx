import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Download, Sparkles, CheckCircle2, Star } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  details: string;
}

interface Project {
  id: string;
  name: string;
  tech: string;
  bullets: string;
  link: string;
}

type TemplateKey = "ats" | "executive" | "signature";

const TEMPLATE_META: Record<TemplateKey, { name: string; tag: string; accent: string; pitch: string }> = {
  ats: {
    name: "ATS Prime",
    tag: "FAANG / product / engineering",
    accent: "hsl(var(--primary))",
    pitch: "Tight hierarchy, recruiter-friendly spacing, high scannability.",
  },
  executive: {
    name: "Boardroom",
    tag: "Leadership / consulting / finance",
    accent: "hsl(214 61% 24%)",
    pitch: "Calm authority, premium structure, strong summary-led layout.",
  },
  signature: {
    name: "Signature Modern",
    tag: "Design / product / growth",
    accent: "hsl(347 77% 50%)",
    pitch: "Modern visual polish without sacrificing professionalism.",
  },
};

const INITIAL_EXPERIENCE: Experience[] = [
  {
    id: crypto.randomUUID(),
    role: "Senior Software Engineer",
    company: "Northstar Cloud",
    location: "San Francisco, CA",
    start: "Jan 2023",
    end: "Present",
    bullets:
      "Led platform modernization across 18 services, cutting release lead time by 68% and improving deployment reliability to 99.95%.\nBuilt an event processing pipeline handling 1.8B monthly events while reducing infrastructure spend by $420K annually.\nMentored 5 engineers and introduced senior-level interview rubrics adopted across the org.",
  },
  {
    id: crypto.randomUUID(),
    role: "Software Engineer",
    company: "Atlas Pay",
    location: "Remote",
    start: "Jun 2020",
    end: "Dec 2022",
    bullets:
      "Owned payment reliability initiatives that improved approval rates by 11% and protected $48M in annual GMV.\nShipped 10+ high-impact customer features, increasing conversion by 19% across web and mobile funnels.\nReduced p95 API latency from 780ms to 140ms through caching and database query redesign.",
  },
];

const INITIAL_EDUCATION: Education[] = [
  {
    id: crypto.randomUUID(),
    degree: "B.S. Computer Science",
    school: "University of California, Berkeley",
    location: "Berkeley, CA",
    start: "2016",
    end: "2020",
    details: "GPA 3.8/4.0 · Coursework: Distributed Systems, Machine Learning, Algorithms",
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: crypto.randomUUID(),
    name: "OpenAPI Mock Server",
    tech: "Go, Docker, Kubernetes",
    link: "github.com/alexj/openapi-mock",
    bullets:
      "Created an open-source developer tool with 3.2k+ GitHub stars and strong adoption in internal platform teams.\nReduced local environment setup time from 2 days to 15 minutes for 200+ engineers.",
  },
];

const ResumeBuilder = () => {
  const [template, setTemplate] = useState<TemplateKey>("ats");
  const [name, setName] = useState("Alex Johnson");
  const [title, setTitle] = useState("Senior Software Engineer");
  const [email, setEmail] = useState("alex@email.com");
  const [phone, setPhone] = useState("+1 555 0100");
  const [location, setLocation] = useState("San Francisco, CA");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/alexj");
  const [github, setGithub] = useState("github.com/alexj");
  const [website, setWebsite] = useState("alexj.dev");
  const [summary, setSummary] = useState("Senior engineer with 7+ years building high-scale products, performance-critical systems, and cross-functional execution engines. Known for translating complex technical work into measurable business results, elevating engineering quality, and shipping with speed.");
  const [skills, setSkills] = useState("Programming: TypeScript, Python, Go, Java, SQL\nFrontend: React, Next.js, Tailwind, Design Systems\nBackend: Node.js, gRPC, REST APIs, Event-Driven Systems\nInfrastructure: AWS, Docker, Kubernetes, Terraform, CI/CD\nData: PostgreSQL, Redis, Kafka, BigQuery");
  const [awards, setAwards] = useState("AWS Certified Solutions Architect – Professional\nDean's List – UC Berkeley\nTop Performer Award – Northstar Cloud");
  const [experience, setExperience] = useState<Experience[]>(INITIAL_EXPERIENCE);
  const [education, setEducation] = useState<Education[]>(INITIAL_EDUCATION);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const previewRef = useRef<HTMLDivElement>(null);

  const checklist = useMemo(() => {
    const score = [summary.trim(), skills.trim(), experience.some((item) => item.bullets.trim()), education.some((item) => item.degree.trim())].filter(Boolean).length;
    return [
      { ok: !!summary.trim(), label: "Strong professional summary" },
      { ok: experience.some((item) => /\d/.test(item.bullets)), label: "Quantified achievements" },
      { ok: !!skills.trim(), label: "Keyword-rich skills section" },
      { ok: !!email.trim() && !!phone.trim(), label: "Complete contact details" },
      { ok: score >= 3, label: "Recruiter-ready structure" },
    ];
  }, [summary, skills, experience, education, email, phone]);

  const addExperience = () => setExperience((prev) => [...prev, { id: crypto.randomUUID(), role: "", company: "", location: "", start: "", end: "", bullets: "" }]);
  const addEducation = () => setEducation((prev) => [...prev, { id: crypto.randomUUID(), degree: "", school: "", location: "", start: "", end: "", details: "" }]);
  const addProject = () => setProjects((prev) => [...prev, { id: crypto.randomUUID(), name: "", tech: "", bullets: "", link: "" }]);

  const updateExperience = (id: string, key: keyof Experience, value: string) => setExperience((prev) => prev.map((item) => item.id === id ? { ...item, [key]: value } : item));
  const updateEducation = (id: string, key: keyof Education, value: string) => setEducation((prev) => prev.map((item) => item.id === id ? { ...item, [key]: value } : item));
  const updateProject = (id: string, key: keyof Project, value: string) => setProjects((prev) => prev.map((item) => item.id === id ? { ...item, [key]: value } : item));

  const downloadPDF = async () => {
    const target = previewRef.current?.querySelector("[data-resume]") as HTMLElement | null;
    if (!target) return;
    try {
      toast.info("Generating premium resume PDF...");
      const canvas = await html2canvas(target, { scale: 3, backgroundColor: "#ffffff", useCORS: true, logging: false });
      const image = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = 210;
      const pageHeight = 297;
      const imageHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imageHeight;
      let position = 0;

      pdf.addImage(image, "JPEG", 0, position, pageWidth, imageHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imageHeight;
        pdf.addPage();
        pdf.addImage(image, "JPEG", 0, position, pageWidth, imageHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${name.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("Resume PDF downloaded");
    } catch {
      toast.error("Failed to generate resume PDF");
    }
  };

  const resumeData = { name, title, email, phone, location, linkedin, github, website, summary, skills, awards, experience, education, projects };

  return (
    <ToolPageTemplate
      title="Resume Builder Pro"
      description="Create recruiter-ready, high-end resumes with premium layouts, ATS-safe structure, and crisp PDF export."
      keywords="professional resume builder, ATS resume, executive CV, FAANG resume, premium resume maker"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden border-border/70">
            <div className="border-b border-border bg-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground"><Sparkles className="h-4 w-4 text-primary" /> Premium editor</div>
                  <h2 className="text-2xl font-semibold text-foreground">Build a polished, company-ready resume</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Optimized for hiring managers, internal recruiters, and ATS scans — with modern visuals that still feel senior and professional.</p>
                </div>
                <Button onClick={downloadPDF} className="gap-2"><Download className="h-4 w-4" />Download PDF</Button>
              </div>
            </div>

            <div className="grid gap-3 border-b border-border bg-muted/20 p-5 md:grid-cols-3">
              {(Object.keys(TEMPLATE_META) as TemplateKey[]).map((key) => {
                const item = TEMPLATE_META[key];
                const active = template === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTemplate(key)}
                    className={`rounded-lg border p-4 text-left transition-all ${active ? "border-primary bg-card shadow-md" : "border-border bg-background hover:border-primary/40"}`}
                  >
                    <div className="mb-3 h-2 rounded-full" style={{ background: item.accent }} />
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.tag}</div>
                      </div>
                      {active && <Star className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.pitch}</p>
                  </button>
                );
              })}
            </div>

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
                    <Field label="Full name" value={name} onChange={setName} />
                    <Field label="Target role" value={title} onChange={setTitle} />
                    <Field label="Email" value={email} onChange={setEmail} />
                    <Field label="Phone" value={phone} onChange={setPhone} />
                    <Field label="Location" value={location} onChange={setLocation} />
                    <Field label="LinkedIn" value={linkedin} onChange={setLinkedin} />
                    <Field label="GitHub" value={github} onChange={setGithub} />
                    <Field label="Website / Portfolio" value={website} onChange={setWebsite} />
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Professional summary</Label>
                    <Textarea rows={5} value={summary} onChange={(e) => setSummary(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <Textarea rows={6} value={skills} onChange={(e) => setSkills(e.target.value)} />
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  {experience.map((item) => (
                    <EditorCard key={item.id} title={item.role || "Experience entry"} onDelete={() => setExperience((prev) => prev.filter((entry) => entry.id !== item.id))}>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input placeholder="Role" value={item.role} onChange={(e) => updateExperience(item.id, "role", e.target.value)} />
                        <Input placeholder="Company" value={item.company} onChange={(e) => updateExperience(item.id, "company", e.target.value)} />
                        <Input placeholder="Location" value={item.location} onChange={(e) => updateExperience(item.id, "location", e.target.value)} />
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Start" value={item.start} onChange={(e) => updateExperience(item.id, "start", e.target.value)} />
                          <Input placeholder="End" value={item.end} onChange={(e) => updateExperience(item.id, "end", e.target.value)} />
                        </div>
                      </div>
                      <Textarea rows={5} placeholder="One impact bullet per line. Start with action verbs and include metrics." value={item.bullets} onChange={(e) => updateExperience(item.id, "bullets", e.target.value)} />
                    </EditorCard>
                  ))}
                  <Button variant="outline" onClick={addExperience} className="w-full gap-2"><Plus className="h-4 w-4" />Add experience</Button>
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  {education.map((item) => (
                    <EditorCard key={item.id} title={item.degree || "Education entry"} onDelete={() => setEducation((prev) => prev.filter((entry) => entry.id !== item.id))}>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input placeholder="Degree" value={item.degree} onChange={(e) => updateEducation(item.id, "degree", e.target.value)} />
                        <Input placeholder="Institution" value={item.school} onChange={(e) => updateEducation(item.id, "school", e.target.value)} />
                        <Input placeholder="Location" value={item.location} onChange={(e) => updateEducation(item.id, "location", e.target.value)} />
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Start" value={item.start} onChange={(e) => updateEducation(item.id, "start", e.target.value)} />
                          <Input placeholder="End" value={item.end} onChange={(e) => updateEducation(item.id, "end", e.target.value)} />
                        </div>
                      </div>
                      <Input placeholder="GPA, honors, coursework" value={item.details} onChange={(e) => updateEducation(item.id, "details", e.target.value)} />
                    </EditorCard>
                  ))}
                  <Button variant="outline" onClick={addEducation} className="w-full gap-2"><Plus className="h-4 w-4" />Add education</Button>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  {projects.map((item) => (
                    <EditorCard key={item.id} title={item.name || "Project entry"} onDelete={() => setProjects((prev) => prev.filter((entry) => entry.id !== item.id))}>
                      <div className="grid gap-3 md:grid-cols-2">
                        <Input placeholder="Project name" value={item.name} onChange={(e) => updateProject(item.id, "name", e.target.value)} />
                        <Input placeholder="Tech stack" value={item.tech} onChange={(e) => updateProject(item.id, "tech", e.target.value)} />
                      </div>
                      <Input placeholder="Project link" value={item.link} onChange={(e) => updateProject(item.id, "link", e.target.value)} />
                      <Textarea rows={4} placeholder="One project outcome per line" value={item.bullets} onChange={(e) => updateProject(item.id, "bullets", e.target.value)} />
                    </EditorCard>
                  ))}
                  <Button variant="outline" onClick={addProject} className="w-full gap-2"><Plus className="h-4 w-4" />Add project</Button>
                </TabsContent>

                <TabsContent value="extras" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Awards, certifications, honors</Label>
                    <Textarea rows={6} value={awards} onChange={(e) => setAwards(e.target.value)} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground"><CheckCircle2 className="h-4 w-4 text-primary" /> Recruiter readiness</div>
            <div className="grid gap-3 md:grid-cols-2">
              {checklist.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
                  <CheckCircle2 className={`h-4 w-4 ${item.ok ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden border-border/70">
            <div className="flex items-center justify-between border-b border-border bg-muted/20 px-5 py-4">
              <div>
                <div className="text-sm font-medium text-foreground">Live resume preview</div>
                <div className="text-xs text-muted-foreground">A4 output · crisp PDF export</div>
              </div>
              <Badge variant="secondary">{TEMPLATE_META[template].name}</Badge>
            </div>
            <div className="overflow-auto bg-muted/30 p-4">
              <div ref={previewRef} className="flex justify-center">
                <div className="origin-top scale-[0.62] shadow-2xl lg:scale-[0.68]" style={{ marginBottom: "-32%" }}>
                  <div data-resume>
                    {template === "ats" && <ATSPrimeTemplate {...resumeData} />}
                    {template === "executive" && <BoardroomTemplate {...resumeData} />}
                    {template === "signature" && <SignatureModernTemplate {...resumeData} />}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground"><Sparkles className="h-4 w-4 text-primary" /> What makes this stronger</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• Executive-level spacing and hierarchy instead of cluttered builder UI.</li>
              <li>• ATS-safe structure with modern visual polish.</li>
              <li>• Better PDF sharpness for actual applications and recruiter sharing.</li>
              <li>• Templates designed for tech, consulting, finance, and modern product roles.</li>
            </ul>
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

const EditorCard = ({ title, onDelete, children }: { title: string; onDelete: () => void; children: React.ReactNode }) => (
  <Card className="space-y-3 border-border/70 bg-muted/20 p-4">
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <Button size="icon" variant="ghost" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
    </div>
    {children}
  </Card>
);

const ResumeSection = ({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) => (
  <section className="mb-5">
    <div className="mb-2 flex items-center gap-3">
      <div className="h-[2px] w-8" style={{ background: accent }} />
      <h3 className="text-[10pt] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>{title}</h3>
    </div>
    {children}
  </section>
);

const BulletList = ({ value }: { value: string }) => (
  <ul className="ml-4 list-disc space-y-1 text-[10pt] leading-6">
    {value.split("\n").filter(Boolean).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
  </ul>
);

const ATSPrimeTemplate = (p: any) => {
  const accent = TEMPLATE_META.ats.accent;
  return (
    <div className="min-h-[297mm] w-[210mm] bg-white px-10 py-9 text-black" style={{ fontFamily: "Arial, Helvetica, sans-serif", lineHeight: 1.45 }}>
      <header className="border-b pb-4" style={{ borderColor: "#111" }}>
        <div className="text-[26pt] font-bold leading-none">{p.name}</div>
        <div className="mt-1 text-[12pt] text-neutral-700">{p.title}</div>
        <div className="mt-3 text-[9.5pt] text-neutral-700">{[p.location, p.phone, p.email, p.linkedin, p.github, p.website].filter(Boolean).join(" • ")}</div>
      </header>
      <div className="mt-5">
        <ResumeSection title="Summary" accent={accent}><p className="text-[10.5pt] leading-6">{p.summary}</p></ResumeSection>
        <ResumeSection title="Experience" accent={accent}>
          {p.experience.map((item: Experience) => (
            <div key={item.id} className="mb-4">
              <div className="flex items-baseline justify-between gap-4 text-[11pt] font-bold"><span>{item.role} · {item.company}</span><span className="text-[9.5pt] font-medium text-neutral-600">{item.start} – {item.end}</span></div>
              <div className="mb-1 text-[9.5pt] italic text-neutral-600">{item.location}</div>
              <BulletList value={item.bullets} />
            </div>
          ))}
        </ResumeSection>
        <ResumeSection title="Projects" accent={accent}>
          {p.projects.map((item: Project) => (
            <div key={item.id} className="mb-3">
              <div className="text-[10.5pt] font-bold">{item.name} <span className="font-medium text-neutral-600">— {item.tech}</span></div>
              {item.link && <div className="text-[9pt] text-neutral-600">{item.link}</div>}
              <BulletList value={item.bullets} />
            </div>
          ))}
        </ResumeSection>
        <ResumeSection title="Education" accent={accent}>
          {p.education.map((item: Education) => (
            <div key={item.id} className="mb-3 text-[10pt]">
              <div className="flex items-baseline justify-between gap-4"><span className="font-bold">{item.degree}</span><span className="text-[9pt] text-neutral-600">{item.start} – {item.end}</span></div>
              <div>{item.school} · {item.location}</div>
              {item.details && <div className="text-[9pt] text-neutral-600">{item.details}</div>}
            </div>
          ))}
        </ResumeSection>
        <ResumeSection title="Skills" accent={accent}><div className="whitespace-pre-line text-[10pt] leading-6">{p.skills}</div></ResumeSection>
        {p.awards && <ResumeSection title="Awards & Certifications" accent={accent}><div className="whitespace-pre-line text-[10pt] leading-6">{p.awards}</div></ResumeSection>}
      </div>
    </div>
  );
};

const BoardroomTemplate = (p: any) => {
  const accent = TEMPLATE_META.executive.accent;
  return (
    <div className="min-h-[297mm] w-[210mm] bg-white px-12 py-11 text-black" style={{ fontFamily: "Georgia, 'Times New Roman', serif", lineHeight: 1.5 }}>
      <header className="mb-6 border-b-4 pb-4" style={{ borderColor: accent }}>
        <div className="text-[30pt] font-bold" style={{ color: accent }}>{p.name}</div>
        <div className="mt-2 text-[11pt] uppercase tracking-[0.22em] text-neutral-600">{p.title}</div>
        <div className="mt-4 text-[9pt] text-neutral-600">{[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join("   |   ")}</div>
      </header>
      <ResumeSection title="Executive Summary" accent={accent}><p className="text-[10.5pt] leading-7">{p.summary}</p></ResumeSection>
      <ResumeSection title="Professional Experience" accent={accent}>
        {p.experience.map((item: Experience) => (
          <div key={item.id} className="mb-4">
            <div className="text-[12pt] font-bold" style={{ color: accent }}>{item.role}</div>
            <div className="text-[10pt] italic text-neutral-700">{item.company} · {item.location} · {item.start} – {item.end}</div>
            <BulletList value={item.bullets} />
          </div>
        ))}
      </ResumeSection>
      <div className="grid grid-cols-[1.25fr_0.75fr] gap-8">
        <div>
          <ResumeSection title="Projects" accent={accent}>
            {p.projects.map((item: Project) => (
              <div key={item.id} className="mb-3">
                <div className="text-[10.5pt] font-bold">{item.name}</div>
                <div className="text-[9pt] text-neutral-600">{item.tech}</div>
                <BulletList value={item.bullets} />
              </div>
            ))}
          </ResumeSection>
        </div>
        <div>
          <ResumeSection title="Education" accent={accent}>
            {p.education.map((item: Education) => (
              <div key={item.id} className="mb-3 text-[9.5pt] leading-6">
                <div className="font-bold">{item.degree}</div>
                <div>{item.school}</div>
                <div className="text-neutral-600">{item.location} · {item.start} – {item.end}</div>
                {item.details && <div className="text-neutral-600">{item.details}</div>}
              </div>
            ))}
          </ResumeSection>
          <ResumeSection title="Core Competencies" accent={accent}><div className="whitespace-pre-line text-[9.5pt] leading-6">{p.skills}</div></ResumeSection>
          {p.awards && <ResumeSection title="Honors" accent={accent}><div className="whitespace-pre-line text-[9.5pt] leading-6">{p.awards}</div></ResumeSection>}
        </div>
      </div>
    </div>
  );
};

const SignatureModernTemplate = (p: any) => {
  const accent = TEMPLATE_META.signature.accent;
  return (
    <div className="min-h-[297mm] w-[210mm] bg-white text-black" style={{ fontFamily: "Helvetica, Arial, sans-serif", lineHeight: 1.48 }}>
      <div className="px-10 py-8 text-white" style={{ background: `linear-gradient(135deg, ${accent} 0%, hsl(12 88% 58%) 100%)` }}>
        <div className="text-[30pt] font-bold leading-none">{p.name}</div>
        <div className="mt-2 text-[12pt] opacity-95">{p.title}</div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[9.5pt] opacity-90">
          {[p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean).map((item: string) => <span key={item}>{item}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-[0.64fr_0.36fr] gap-8 px-10 py-8">
        <div>
          <ResumeSection title="Profile" accent={accent}><p className="text-[10.5pt] leading-7">{p.summary}</p></ResumeSection>
          <ResumeSection title="Experience" accent={accent}>
            {p.experience.map((item: Experience) => (
              <div key={item.id} className="mb-4 border-l-2 pl-4" style={{ borderColor: accent }}>
                <div className="text-[11pt] font-bold">{item.role}</div>
                <div className="text-[9.5pt] text-neutral-600">{item.company} · {item.location} · {item.start} – {item.end}</div>
                <BulletList value={item.bullets} />
              </div>
            ))}
          </ResumeSection>
          <ResumeSection title="Projects" accent={accent}>
            {p.projects.map((item: Project) => (
              <div key={item.id} className="mb-3">
                <div className="text-[10.5pt] font-bold">{item.name} <span className="font-medium text-neutral-600">— {item.tech}</span></div>
                <BulletList value={item.bullets} />
              </div>
            ))}
          </ResumeSection>
        </div>
        <div>
          <ResumeSection title="Skills" accent={accent}><div className="whitespace-pre-line text-[9.5pt] leading-6">{p.skills}</div></ResumeSection>
          <ResumeSection title="Education" accent={accent}>
            {p.education.map((item: Education) => (
              <div key={item.id} className="mb-3 text-[9.5pt] leading-6">
                <div className="font-bold">{item.degree}</div>
                <div>{item.school}</div>
                <div className="text-neutral-600">{item.start} – {item.end}</div>
                {item.details && <div className="text-neutral-600">{item.details}</div>}
              </div>
            ))}
          </ResumeSection>
          {p.awards && <ResumeSection title="Recognition" accent={accent}><div className="whitespace-pre-line text-[9.5pt] leading-6">{p.awards}</div></ResumeSection>}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;