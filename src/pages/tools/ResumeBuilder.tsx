import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Download, FileText, Sparkles, Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, Award, Code2 } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Experience { id: string; role: string; company: string; location: string; start: string; end: string; bullets: string; }
interface Education { id: string; degree: string; school: string; location: string; start: string; end: string; details: string; }
interface Project { id: string; name: string; tech: string; bullets: string; link: string; }

type TemplateKey = "faang" | "executive" | "modern" | "creative" | "minimal";

const TEMPLATES: { key: TemplateKey; name: string; tag: string; gradient: string }[] = [
  { key: "faang", name: "FAANG ATS", tag: "Best for Tech / Big Companies", gradient: "from-blue-500 to-cyan-500" },
  { key: "executive", name: "Executive", tag: "Senior Leadership / Finance", gradient: "from-amber-600 to-yellow-500" },
  { key: "modern", name: "Modern Sidebar", tag: "Designer / Product", gradient: "from-slate-700 to-slate-900" },
  { key: "creative", name: "Creative Gradient", tag: "Marketing / Creative", gradient: "from-fuchsia-500 to-orange-500" },
  { key: "minimal", name: "Minimal Elegant", tag: "Editorial / Consulting", gradient: "from-stone-700 to-stone-900" },
];

const ResumeBuilder = () => {
  const [template, setTemplate] = useState<TemplateKey>("faang");
  const [name, setName] = useState("Alex Johnson");
  const [title, setTitle] = useState("Senior Software Engineer");
  const [email, setEmail] = useState("alex@email.com");
  const [phone, setPhone] = useState("+1 555 0100");
  const [location, setLocation] = useState("San Francisco, CA");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/alexj");
  const [github, setGithub] = useState("github.com/alexj");
  const [website, setWebsite] = useState("alexj.dev");
  const [summary, setSummary] = useState("Senior engineer with 7+ years building scalable distributed systems serving 50M+ users. Led platform migrations cutting infra costs by $1.2M/year. Passionate about mentoring and shipping high-quality software fast.");
  const [skills, setSkills] = useState("Languages: Python, TypeScript, Go, Java, SQL\nFrameworks: React, Node.js, Django, gRPC, Next.js\nInfrastructure: AWS, Kubernetes, Docker, Terraform, CI/CD\nDatabases: PostgreSQL, Redis, DynamoDB, Kafka, ElasticSearch");
  const [experience, setExperience] = useState<Experience[]>([{
    id: "1", role: "Senior Software Engineer", company: "Tech Corp", location: "San Francisco, CA",
    start: "Jan 2023", end: "Present",
    bullets: "Led migration of monolith to microservices, reducing deployment time by 70% and enabling 50+ daily releases.\nDesigned real-time data pipeline processing 2B+ events/day, cutting infra costs by $400K/year.\nMentored 4 engineers; 2 promoted to senior within 12 months.\nDrove feature-flag adoption across 30+ services, decreasing rollback incidents by 85%."
  }, {
    id: "2", role: "Software Engineer", company: "Startup Inc", location: "Remote",
    start: "Jun 2020", end: "Dec 2022",
    bullets: "Built core payment infrastructure handling $50M+ annual GMV with 99.99% uptime.\nShipped 12 customer-facing features that increased retention by 28%.\nOwned on-call rotation; reduced p99 latency from 800ms to 120ms."
  }]);
  const [education, setEducation] = useState<Education[]>([{
    id: "1", degree: "B.S. Computer Science", school: "University of California, Berkeley", location: "Berkeley, CA",
    start: "Aug 2016", end: "May 2020", details: "GPA: 3.8/4.0 • Coursework: Distributed Systems, Algorithms, Machine Learning"
  }]);
  const [projects, setProjects] = useState<Project[]>([{
    id: "1", name: "OpenAPI Mock Server", tech: "Go, Docker, Kubernetes", link: "github.com/alexj/openapi-mock",
    bullets: "Open-source tool that auto-generates mock APIs from OpenAPI specs; 3.2k GitHub stars.\nReduced dev environment setup time from 2 days to 15 minutes for 200+ engineers."
  }]);
  const [awards, setAwards] = useState("Hackathon Winner — TechCrunch Disrupt 2023\nDean's List — UC Berkeley (2018, 2019, 2020)\nAWS Certified Solutions Architect — Professional");
  const previewRef = useRef<HTMLDivElement>(null);

  const addExp = () => setExperience([...experience, { id: Date.now().toString(), role: "", company: "", location: "", start: "", end: "", bullets: "" }]);
  const updExp = (id: string, k: keyof Experience, v: string) => setExperience(experience.map(e => e.id === id ? { ...e, [k]: v } : e));
  const delExp = (id: string) => setExperience(experience.filter(e => e.id !== id));

  const addEdu = () => setEducation([...education, { id: Date.now().toString(), degree: "", school: "", location: "", start: "", end: "", details: "" }]);
  const updEdu = (id: string, k: keyof Education, v: string) => setEducation(education.map(e => e.id === id ? { ...e, [k]: v } : e));
  const delEdu = (id: string) => setEducation(education.filter(e => e.id !== id));

  const addProj = () => setProjects([...projects, { id: Date.now().toString(), name: "", tech: "", bullets: "", link: "" }]);
  const updProj = (id: string, k: keyof Project, v: string) => setProjects(projects.map(p => p.id === id ? { ...p, [k]: v } : p));
  const delProj = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    try {
      toast.info("Generating high-quality PDF...");
      const node = previewRef.current.querySelector('[data-resume]') as HTMLElement;
      if (!node) return;
      const canvas = await html2canvas(node, { scale: 3, backgroundColor: "#ffffff", useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW = 210;
      const pageH = 297;
      const imgH = (canvas.height * pageW) / canvas.width;
      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, pageW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pageW, imgH);
        heightLeft -= pageH;
      }
      pdf.save(`${name.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("Resume downloaded!");
    } catch (e) {
      toast.error("Failed to generate PDF");
    }
  };

  const renderResume = () => {
    if (template === "faang") return <FaangTemplate {...{ name, title, email, phone, location, linkedin, github, website, summary, skills, experience, education, projects, awards }} />;
    if (template === "executive") return <ExecutiveTemplate {...{ name, title, email, phone, location, linkedin, summary, skills, experience, education, awards }} />;
    if (template === "modern") return <ModernTemplate {...{ name, title, email, phone, location, linkedin, github, website, summary, skills, experience, education, projects, awards }} />;
    if (template === "creative") return <CreativeTemplate {...{ name, title, email, phone, location, linkedin, github, website, summary, skills, experience, education, projects, awards }} />;
    return <MinimalTemplate {...{ name, title, email, phone, location, linkedin, github, website, summary, skills, experience, education, projects, awards }} />;
  };

  return (
    <ToolPageTemplate title="Resume Builder Pro" description="Build stunning, ATS-optimized resumes with 5 professional templates. Trusted by FAANG, executive and creative professionals." keywords="ATS resume, FAANG resume, resume builder, professional CV, resume maker">
      <div className="grid xl:grid-cols-2 gap-6">
        {/* Editor */}
        <Card className="p-0 overflow-hidden border-2 max-h-[88vh] flex flex-col">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-lg">Resume Editor</h3>
            </div>
            <Button onClick={downloadPDF} variant="secondary" size="sm" className="font-semibold"><Download className="w-4 h-4 mr-2" />Download PDF</Button>
          </div>

          {/* Template picker */}
          <div className="p-4 border-b bg-muted/30">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Choose a Template</Label>
            <div className="grid grid-cols-5 gap-2">
              {TEMPLATES.map(t => (
                <button key={t.key} onClick={() => setTemplate(t.key)} className={`relative rounded-lg p-2 text-left transition-all ${template === t.key ? "ring-2 ring-primary scale-[1.02] shadow-lg" : "ring-1 ring-border hover:ring-primary/50"}`}>
                  <div className={`h-12 rounded bg-gradient-to-br ${t.gradient} mb-1.5`}></div>
                  <div className="text-[10px] font-bold leading-tight">{t.name}</div>
                  <div className="text-[8px] text-muted-foreground leading-tight mt-0.5">{t.tag}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <Tabs defaultValue="header">
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="header">Profile</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="exp"><Briefcase className="w-3.5 h-3.5 mr-1" />Work</TabsTrigger>
                <TabsTrigger value="edu"><GraduationCap className="w-3.5 h-3.5 mr-1" />Edu</TabsTrigger>
                <TabsTrigger value="proj"><Code2 className="w-3.5 h-3.5 mr-1" />Projects</TabsTrigger>
                <TabsTrigger value="more"><Award className="w-3.5 h-3.5 mr-1" />More</TabsTrigger>
              </TabsList>

              <TabsContent value="header" className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
                  <div><Label>Title / Role</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
                  <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
                  <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
                  <div><Label>Location</Label><Input value={location} onChange={e => setLocation(e.target.value)} /></div>
                  <div><Label>LinkedIn</Label><Input value={linkedin} onChange={e => setLinkedin(e.target.value)} /></div>
                  <div><Label>GitHub</Label><Input value={github} onChange={e => setGithub(e.target.value)} /></div>
                  <div><Label>Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} /></div>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-3 pt-4">
                <div><Label>Professional Summary</Label><Textarea rows={5} value={summary} onChange={e => setSummary(e.target.value)} /></div>
                <div><Label>Skills (one category per line)</Label><Textarea rows={6} value={skills} onChange={e => setSkills(e.target.value)} /></div>
              </TabsContent>

              <TabsContent value="exp" className="space-y-3 pt-4">
                {experience.map(e => (
                  <Card key={e.id} className="p-3 space-y-2 bg-muted/30">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Position</span>
                      <Button size="icon" variant="ghost" onClick={() => delExp(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Role" value={e.role} onChange={ev => updExp(e.id, "role", ev.target.value)} />
                      <Input placeholder="Company" value={e.company} onChange={ev => updExp(e.id, "company", ev.target.value)} />
                      <Input placeholder="Location" value={e.location} onChange={ev => updExp(e.id, "location", ev.target.value)} />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Start" value={e.start} onChange={ev => updExp(e.id, "start", ev.target.value)} />
                        <Input placeholder="End" value={e.end} onChange={ev => updExp(e.id, "end", ev.target.value)} />
                      </div>
                    </div>
                    <Textarea rows={5} placeholder="One bullet per line. Use action verbs + quantified impact." value={e.bullets} onChange={ev => updExp(e.id, "bullets", ev.target.value)} />
                  </Card>
                ))}
                <Button variant="outline" onClick={addExp} className="w-full"><Plus className="w-4 h-4 mr-2" />Add Experience</Button>
              </TabsContent>

              <TabsContent value="edu" className="space-y-3 pt-4">
                {education.map(e => (
                  <Card key={e.id} className="p-3 space-y-2 bg-muted/30">
                    <div className="flex justify-end"><Button size="icon" variant="ghost" onClick={() => delEdu(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div>
                    <Input placeholder="Degree" value={e.degree} onChange={ev => updEdu(e.id, "degree", ev.target.value)} />
                    <Input placeholder="School" value={e.school} onChange={ev => updEdu(e.id, "school", ev.target.value)} />
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="Location" value={e.location} onChange={ev => updEdu(e.id, "location", ev.target.value)} />
                      <Input placeholder="Start" value={e.start} onChange={ev => updEdu(e.id, "start", ev.target.value)} />
                      <Input placeholder="End" value={e.end} onChange={ev => updEdu(e.id, "end", ev.target.value)} />
                    </div>
                    <Input placeholder="GPA / Coursework" value={e.details} onChange={ev => updEdu(e.id, "details", ev.target.value)} />
                  </Card>
                ))}
                <Button variant="outline" onClick={addEdu} className="w-full"><Plus className="w-4 h-4 mr-2" />Add Education</Button>
              </TabsContent>

              <TabsContent value="proj" className="space-y-3 pt-4">
                {projects.map(p => (
                  <Card key={p.id} className="p-3 space-y-2 bg-muted/30">
                    <div className="flex justify-end"><Button size="icon" variant="ghost" onClick={() => delProj(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></div>
                    <Input placeholder="Project Name" value={p.name} onChange={ev => updProj(p.id, "name", ev.target.value)} />
                    <Input placeholder="Tech Stack" value={p.tech} onChange={ev => updProj(p.id, "tech", ev.target.value)} />
                    <Input placeholder="Link" value={p.link} onChange={ev => updProj(p.id, "link", ev.target.value)} />
                    <Textarea rows={3} placeholder="Bullets (one per line)" value={p.bullets} onChange={ev => updProj(p.id, "bullets", ev.target.value)} />
                  </Card>
                ))}
                <Button variant="outline" onClick={addProj} className="w-full"><Plus className="w-4 h-4 mr-2" />Add Project</Button>
              </TabsContent>

              <TabsContent value="more" className="space-y-3 pt-4">
                <Label>Awards / Certifications / Honors (one per line)</Label>
                <Textarea rows={6} value={awards} onChange={e => setAwards(e.target.value)} />
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-4 bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900 max-h-[88vh] overflow-auto">
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <FileText className="w-3.5 h-3.5" /> Live Preview · A4
          </div>
          <div ref={previewRef} className="flex justify-center">
            <div className="shadow-2xl" style={{ transform: "scale(0.7)", transformOrigin: "top center", marginBottom: "-30%" }}>
              <div data-resume>{renderResume()}</div>
            </div>
          </div>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

/* ============== TEMPLATES ============== */

const Section = ({ title, children, color = "#111", border = true }: any) => (
  <div className="mb-3">
    <div className={`font-bold text-[10.5pt] uppercase tracking-wider ${border ? "border-b pb-0.5" : ""} mb-1.5`} style={{ color, borderColor: color }}>{title}</div>
    {children}
  </div>
);

const Bullets = ({ text }: { text: string }) => (
  <ul className="list-disc ml-5 space-y-0.5">{text.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>
);

// 1. FAANG ATS
const FaangTemplate = (p: any) => (
  <div className="bg-white text-[#111] p-10 w-[210mm] min-h-[297mm]" style={{ fontFamily: "'Calibri', 'Arial', sans-serif", fontSize: "10.5pt", lineHeight: 1.4 }}>
    <div className="text-center mb-4 pb-3 border-b-2 border-[#111]">
      <div className="text-[24pt] font-bold tracking-tight">{p.name}</div>
      <div className="text-[12pt] mt-0.5 text-gray-700">{p.title}</div>
      <div className="text-[9.5pt] mt-2 text-gray-700">{[p.location, p.phone, p.email, p.linkedin, p.github, p.website].filter(Boolean).join(" • ")}</div>
    </div>
    <Section title="Summary"><p>{p.summary}</p></Section>
    <Section title="Experience">
      {p.experience.map((e: any) => (
        <div key={e.id} className="mb-3">
          <div className="flex justify-between font-bold text-[11pt]"><span>{e.company}</span><span>{e.location}</span></div>
          <div className="flex justify-between italic text-[10pt]"><span>{e.role}</span><span>{e.start} – {e.end}</span></div>
          <Bullets text={e.bullets} />
        </div>
      ))}
    </Section>
    <Section title="Projects">
      {p.projects.map((pr: any) => (
        <div key={pr.id} className="mb-2">
          <div className="font-bold">{pr.name} <span className="font-normal italic text-gray-700">— {pr.tech}</span> {pr.link && <span className="text-blue-700">({pr.link})</span>}</div>
          <Bullets text={pr.bullets} />
        </div>
      ))}
    </Section>
    <Section title="Education">
      {p.education.map((e: any) => (
        <div key={e.id} className="mb-2">
          <div className="flex justify-between font-bold"><span>{e.school}</span><span>{e.location}</span></div>
          <div className="flex justify-between italic"><span>{e.degree}</span><span>{e.start} – {e.end}</span></div>
          {e.details && <div className="text-[9.5pt]">{e.details}</div>}
        </div>
      ))}
    </Section>
    <Section title="Skills"><div className="whitespace-pre-line">{p.skills}</div></Section>
    {p.awards && <Section title="Awards & Certifications"><div className="whitespace-pre-line">{p.awards}</div></Section>}
  </div>
);

// 2. Executive
const ExecutiveTemplate = (p: any) => (
  <div className="bg-white text-[#0a0a0a] p-12 w-[210mm] min-h-[297mm]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "10.5pt", lineHeight: 1.45 }}>
    <div className="border-b-4 border-[#0a2540] pb-3 mb-5">
      <div className="text-[28pt] font-bold text-[#0a2540] tracking-wide">{p.name}</div>
      <div className="text-[12pt] uppercase tracking-[0.25em] text-gray-700 mt-1">{p.title}</div>
      <div className="text-[9pt] mt-3 text-gray-600">{[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join("  |  ")}</div>
    </div>
    <Section title="Executive Summary" color="#0a2540"><p>{p.summary}</p></Section>
    <Section title="Professional Experience" color="#0a2540">
      {p.experience.map((e: any) => (
        <div key={e.id} className="mb-3">
          <div className="text-[12pt] font-bold text-[#0a2540]">{e.role}</div>
          <div className="italic text-gray-700">{e.company} • {e.location} • {e.start} – {e.end}</div>
          <Bullets text={e.bullets} />
        </div>
      ))}
    </Section>
    <Section title="Education" color="#0a2540">
      {p.education.map((e: any) => (<div key={e.id} className="mb-2"><div className="font-bold">{e.degree}, {e.school}</div><div className="italic text-gray-700">{e.location} • {e.start} – {e.end}</div>{e.details && <div>{e.details}</div>}</div>))}
    </Section>
    <Section title="Core Competencies" color="#0a2540"><div className="whitespace-pre-line">{p.skills}</div></Section>
    {p.awards && <Section title="Honors & Recognition" color="#0a2540"><div className="whitespace-pre-line">{p.awards}</div></Section>}
  </div>
);

// 3. Modern Sidebar
const ModernTemplate = (p: any) => (
  <div className="bg-white w-[210mm] min-h-[297mm] flex" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: "10pt", lineHeight: 1.45 }}>
    <div className="w-[35%] bg-gradient-to-b from-slate-800 to-slate-900 text-white p-7">
      <div className="text-[22pt] font-bold leading-tight">{p.name}</div>
      <div className="text-[10pt] text-slate-300 mt-1 mb-6 uppercase tracking-wider">{p.title}</div>
      <SidebarBlock title="Contact">
        <ContactRow icon="✉" text={p.email} /><ContactRow icon="☎" text={p.phone} /><ContactRow icon="◉" text={p.location} />
        {p.linkedin && <ContactRow icon="in" text={p.linkedin} />}{p.github && <ContactRow icon="◎" text={p.github} />}{p.website && <ContactRow icon="⌘" text={p.website} />}
      </SidebarBlock>
      <SidebarBlock title="Skills"><div className="whitespace-pre-line text-[9pt] text-slate-200">{p.skills}</div></SidebarBlock>
      <SidebarBlock title="Education">
        {p.education.map((e: any) => (<div key={e.id} className="mb-3 text-[9pt]"><div className="font-bold">{e.degree}</div><div className="text-slate-300">{e.school}</div><div className="text-slate-400 text-[8.5pt]">{e.start} – {e.end}</div></div>))}
      </SidebarBlock>
      {p.awards && <SidebarBlock title="Awards"><div className="whitespace-pre-line text-[9pt] text-slate-200">{p.awards}</div></SidebarBlock>}
    </div>
    <div className="w-[65%] p-8 text-[#1e293b]">
      <Section title="Profile" color="#1e293b"><p>{p.summary}</p></Section>
      <Section title="Experience" color="#1e293b">
        {p.experience.map((e: any) => (
          <div key={e.id} className="mb-3">
            <div className="font-bold text-[11pt]">{e.role}</div>
            <div className="italic text-gray-700">{e.company} • {e.location}</div>
            <div className="text-[9pt] text-gray-600 mb-1">{e.start} – {e.end}</div>
            <Bullets text={e.bullets} />
          </div>
        ))}
      </Section>
      <Section title="Projects" color="#1e293b">
        {p.projects.map((pr: any) => (<div key={pr.id} className="mb-2"><div className="font-bold">{pr.name} <span className="font-normal italic">— {pr.tech}</span></div><Bullets text={pr.bullets} /></div>))}
      </Section>
    </div>
  </div>
);

// 4. Creative Gradient
const CreativeTemplate = (p: any) => (
  <div className="bg-white w-[210mm] min-h-[297mm]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: "10pt", lineHeight: 1.45 }}>
    <div className="p-10" style={{ background: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)", color: "#fff" }}>
      <div className="text-[30pt] font-extrabold leading-none tracking-tight">{p.name}</div>
      <div className="text-[13pt] mt-1 font-medium opacity-95">{p.title}</div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[9.5pt] opacity-95">
        <span>✉ {p.email}</span><span>☎ {p.phone}</span><span>◉ {p.location}</span>
        {p.linkedin && <span>in {p.linkedin}</span>}{p.website && <span>⌘ {p.website}</span>}
      </div>
    </div>
    <div className="p-10 text-[#222]">
      <Section title="About Me" color="#ec4899"><p>{p.summary}</p></Section>
      <Section title="Experience" color="#ec4899">
        {p.experience.map((e: any) => (
          <div key={e.id} className="mb-3 pl-4 border-l-2 border-orange-400">
            <div className="font-bold text-[11.5pt]">{e.role} <span className="text-orange-600">@ {e.company}</span></div>
            <div className="italic text-gray-600 text-[9.5pt]">{e.location} • {e.start} – {e.end}</div>
            <Bullets text={e.bullets} />
          </div>
        ))}
      </Section>
      <div className="grid grid-cols-2 gap-6">
        <Section title="Skills" color="#ec4899"><div className="whitespace-pre-line">{p.skills}</div></Section>
        <Section title="Education" color="#ec4899">
          {p.education.map((e: any) => (<div key={e.id} className="mb-2"><div className="font-bold">{e.degree}</div><div className="italic text-gray-700">{e.school}</div><div className="text-[9pt] text-gray-600">{e.start} – {e.end}</div></div>))}
        </Section>
      </div>
      <Section title="Projects" color="#ec4899">
        {p.projects.map((pr: any) => (<div key={pr.id} className="mb-2"><div className="font-bold">{pr.name} <span className="font-normal italic text-gray-600">— {pr.tech}</span></div><Bullets text={pr.bullets} /></div>))}
      </Section>
      {p.awards && <Section title="Achievements" color="#ec4899"><div className="whitespace-pre-line">{p.awards}</div></Section>}
    </div>
  </div>
);

// 5. Minimal Elegant
const MinimalTemplate = (p: any) => (
  <div className="bg-white text-[#1a1a1a] p-14 w-[210mm] min-h-[297mm]" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", fontSize: "10pt", lineHeight: 1.55 }}>
    <div className="mb-8">
      <div className="text-[34pt] font-light tracking-tight">{p.name}</div>
      <div className="text-[11pt] text-gray-500 mt-1 uppercase tracking-[0.3em]">{p.title}</div>
      <div className="h-px bg-gray-300 my-4"></div>
      <div className="text-[9pt] text-gray-600 flex flex-wrap gap-x-4">
        {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}{p.linkedin && <span>{p.linkedin}</span>}{p.github && <span>{p.github}</span>}{p.website && <span>{p.website}</span>}
      </div>
    </div>
    {[
      { t: "Profile", c: <p>{p.summary}</p> },
      { t: "Experience", c: p.experience.map((e: any) => (
        <div key={e.id} className="mb-4 grid grid-cols-[120px_1fr] gap-4">
          <div className="text-[9pt] text-gray-500">{e.start}<br />{e.end}</div>
          <div>
            <div className="font-semibold">{e.role}</div>
            <div className="text-gray-600 text-[9.5pt]">{e.company} · {e.location}</div>
            <Bullets text={e.bullets} />
          </div>
        </div>
      )) },
      { t: "Projects", c: p.projects.map((pr: any) => (
        <div key={pr.id} className="mb-2">
          <div className="font-semibold">{pr.name} <span className="font-normal text-gray-500">— {pr.tech}</span></div>
          <Bullets text={pr.bullets} />
        </div>
      )) },
      { t: "Education", c: p.education.map((e: any) => (
        <div key={e.id} className="mb-2 grid grid-cols-[120px_1fr] gap-4">
          <div className="text-[9pt] text-gray-500">{e.start} – {e.end}</div>
          <div><div className="font-semibold">{e.degree}</div><div className="text-gray-600">{e.school} · {e.location}</div>{e.details && <div className="text-[9pt] text-gray-500">{e.details}</div>}</div>
        </div>
      )) },
      { t: "Skills", c: <div className="whitespace-pre-line">{p.skills}</div> },
      ...(p.awards ? [{ t: "Awards", c: <div className="whitespace-pre-line">{p.awards}</div> }] : []),
    ].map((s, i) => (
      <div key={i} className="mb-6">
        <div className="text-[9pt] uppercase tracking-[0.25em] text-gray-400 mb-2">{s.t}</div>
        {s.c}
      </div>
    ))}
  </div>
);

const SidebarBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <div className="text-[9pt] font-bold tracking-[0.2em] text-slate-400 uppercase mb-2 border-b border-slate-600 pb-1">{title}</div>
    <div className="text-[9.5pt] space-y-1">{children}</div>
  </div>
);

const ContactRow = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-start gap-2 text-[9pt] break-all"><span className="text-slate-400 w-3 shrink-0">{icon}</span><span>{text}</span></div>
);

export default ResumeBuilder;
