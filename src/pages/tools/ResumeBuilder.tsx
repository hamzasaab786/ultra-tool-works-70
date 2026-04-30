import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Experience { id: string; role: string; company: string; location: string; start: string; end: string; bullets: string; }
interface Education { id: string; degree: string; school: string; location: string; start: string; end: string; details: string; }
interface Project { id: string; name: string; tech: string; bullets: string; link: string; }

const ResumeBuilder = () => {
  const [template, setTemplate] = useState<"faang" | "executive" | "modern">("faang");
  const [name, setName] = useState("Your Name");
  const [title, setTitle] = useState("Software Engineer");
  const [email, setEmail] = useState("you@email.com");
  const [phone, setPhone] = useState("+1 555 0100");
  const [location, setLocation] = useState("San Francisco, CA");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/you");
  const [github, setGithub] = useState("github.com/you");
  const [website, setWebsite] = useState("");
  const [summary, setSummary] = useState("Software engineer with 5+ years building scalable distributed systems. Shipped products used by millions; reduced p99 latency by 40%; led cross-functional teams of 6+.");
  const [skills, setSkills] = useState("Languages: Python, TypeScript, Go, Java\nFrameworks: React, Node.js, Django, gRPC\nInfrastructure: AWS, Kubernetes, Docker, Terraform\nDatabases: PostgreSQL, Redis, DynamoDB, Kafka");
  const [experience, setExperience] = useState<Experience[]>([{
    id: "1", role: "Senior Software Engineer", company: "Tech Corp", location: "San Francisco, CA",
    start: "Jan 2023", end: "Present",
    bullets: "Led migration of monolith to microservices, reducing deployment time by 70% and enabling 50+ daily releases.\nDesigned and built real-time data pipeline processing 2B+ events/day, cutting infra costs by $400K/year.\nMentored 4 engineers; 2 promoted to senior within 12 months.\nDrove adoption of feature-flag system across 30+ services, decreasing rollback incidents by 85%."
  }]);
  const [education, setEducation] = useState<Education[]>([{
    id: "1", degree: "B.S. Computer Science", school: "University of California, Berkeley", location: "Berkeley, CA",
    start: "Aug 2016", end: "May 2020", details: "GPA: 3.8/4.0 • Relevant Coursework: Distributed Systems, Algorithms, Operating Systems, Machine Learning"
  }]);
  const [projects, setProjects] = useState<Project[]>([{
    id: "1", name: "OpenAPI Mock Server", tech: "Go, Docker, Kubernetes", link: "github.com/you/openapi-mock",
    bullets: "Built open-source tool that auto-generates mock APIs from OpenAPI specs; 3.2k GitHub stars.\nReduced dev environment setup time from 2 days to 15 minutes for 200+ engineers."
  }]);
  const [awards, setAwards] = useState("Hackathon Winner — TechCrunch Disrupt 2023\nDean's List — UC Berkeley (2018, 2019, 2020)");
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
      toast.info("Generating ATS-friendly PDF...");
      const canvas = await html2canvas(previewRef.current, { scale: 3, backgroundColor: "#fff", useCORS: true });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const w = 210;
      const h = (canvas.height * w) / canvas.width;
      let pos = 0;
      let remaining = h;
      while (remaining > 0) {
        pdf.addImage(img, "PNG", 0, pos === 0 ? 0 : -pos, w, h);
        remaining -= 297;
        pos += 297;
        if (remaining > 0) pdf.addPage();
      }
      pdf.save(`${name.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("Resume downloaded");
    } catch (e) {
      toast.error("Failed to generate PDF");
    }
  };

  // Render helpers per template
  const renderResume = () => {
    if (template === "faang") {
      return (
        <div className="bg-white text-[#111] p-10 w-[210mm] min-h-[297mm]" style={{ fontFamily: "'Calibri', 'Arial', sans-serif", fontSize: "10.5pt", lineHeight: 1.35 }}>
          <div className="text-center mb-3">
            <div className="text-[22pt] font-bold tracking-tight">{name}</div>
            <div className="text-[11pt] mt-0.5">{title}</div>
            <div className="text-[9.5pt] mt-1 text-gray-700">
              {[location, phone, email, linkedin, github, website].filter(Boolean).join(" • ")}
            </div>
          </div>
          <Section title="SUMMARY"><p>{summary}</p></Section>
          <Section title="EXPERIENCE">
            {experience.map(e => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between font-bold text-[11pt]"><span>{e.company}</span><span>{e.location}</span></div>
                <div className="flex justify-between italic text-[10pt]"><span>{e.role}</span><span>{e.start} – {e.end}</span></div>
                <ul className="list-disc ml-5 mt-1">{e.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            ))}
          </Section>
          <Section title="PROJECTS">
            {projects.map(p => (
              <div key={p.id} className="mb-2">
                <div className="font-bold">{p.name} <span className="font-normal italic text-gray-700">— {p.tech}</span> {p.link && <span className="text-blue-700">({p.link})</span>}</div>
                <ul className="list-disc ml-5">{p.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            ))}
          </Section>
          <Section title="EDUCATION">
            {education.map(e => (
              <div key={e.id} className="mb-2">
                <div className="flex justify-between font-bold"><span>{e.school}</span><span>{e.location}</span></div>
                <div className="flex justify-between italic"><span>{e.degree}</span><span>{e.start} – {e.end}</span></div>
                {e.details && <div className="text-[9.5pt]">{e.details}</div>}
              </div>
            ))}
          </Section>
          <Section title="SKILLS">
            <div className="whitespace-pre-line">{skills}</div>
          </Section>
          {awards && <Section title="AWARDS & HONORS"><div className="whitespace-pre-line">{awards}</div></Section>}
        </div>
      );
    }
    if (template === "executive") {
      return (
        <div className="bg-white text-[#0a0a0a] p-12 w-[210mm] min-h-[297mm]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "10.5pt", lineHeight: 1.4 }}>
          <div className="border-b-4 border-[#0a2540] pb-3 mb-4">
            <div className="text-[26pt] font-bold text-[#0a2540] tracking-wide">{name}</div>
            <div className="text-[12pt] uppercase tracking-[0.2em] text-gray-700 mt-1">{title}</div>
            <div className="text-[9pt] mt-2 text-gray-600">{[email, phone, location, linkedin].filter(Boolean).join(" | ")}</div>
          </div>
          <Section title="EXECUTIVE SUMMARY" serif><p>{summary}</p></Section>
          <Section title="PROFESSIONAL EXPERIENCE" serif>
            {experience.map(e => (
              <div key={e.id} className="mb-3">
                <div className="text-[12pt] font-bold text-[#0a2540]">{e.role}</div>
                <div className="italic text-gray-700">{e.company} • {e.location} • {e.start} – {e.end}</div>
                <ul className="list-disc ml-5 mt-1">{e.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            ))}
          </Section>
          <Section title="EDUCATION" serif>
            {education.map(e => (<div key={e.id} className="mb-2"><div className="font-bold">{e.degree}, {e.school}</div><div className="italic text-gray-700">{e.location} • {e.start} – {e.end}</div>{e.details && <div>{e.details}</div>}</div>))}
          </Section>
          <Section title="CORE COMPETENCIES" serif><div className="whitespace-pre-line">{skills}</div></Section>
          {awards && <Section title="HONORS & RECOGNITION" serif><div className="whitespace-pre-line">{awards}</div></Section>}
        </div>
      );
    }
    // modern
    return (
      <div className="bg-white w-[210mm] min-h-[297mm] flex" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: "10pt", lineHeight: 1.4 }}>
        <div className="w-[35%] bg-[#1e293b] text-white p-6">
          <div className="text-[20pt] font-bold leading-tight">{name}</div>
          <div className="text-[10pt] text-slate-300 mt-1 mb-5">{title}</div>
          <SidebarBlock title="CONTACT">
            <div>{email}</div><div>{phone}</div><div>{location}</div>
            {linkedin && <div>{linkedin}</div>}{github && <div>{github}</div>}{website && <div>{website}</div>}
          </SidebarBlock>
          <SidebarBlock title="SKILLS"><div className="whitespace-pre-line text-[9pt]">{skills}</div></SidebarBlock>
          <SidebarBlock title="EDUCATION">
            {education.map(e => (<div key={e.id} className="mb-2 text-[9pt]"><div className="font-bold">{e.degree}</div><div>{e.school}</div><div className="text-slate-300">{e.start} – {e.end}</div></div>))}
          </SidebarBlock>
          {awards && <SidebarBlock title="AWARDS"><div className="whitespace-pre-line text-[9pt]">{awards}</div></SidebarBlock>}
        </div>
        <div className="w-[65%] p-7 text-[#1e293b]">
          <Section title="PROFILE" accent="#1e293b"><p>{summary}</p></Section>
          <Section title="EXPERIENCE" accent="#1e293b">
            {experience.map(e => (
              <div key={e.id} className="mb-3">
                <div className="font-bold text-[11pt]">{e.role}</div>
                <div className="italic text-gray-700">{e.company} • {e.location}</div>
                <div className="text-[9pt] text-gray-600">{e.start} – {e.end}</div>
                <ul className="list-disc ml-5 mt-1">{e.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            ))}
          </Section>
          <Section title="PROJECTS" accent="#1e293b">
            {projects.map(p => (<div key={p.id} className="mb-2"><div className="font-bold">{p.name} <span className="font-normal italic">— {p.tech}</span></div><ul className="list-disc ml-5">{p.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}</ul></div>))}
          </Section>
        </div>
      </div>
    );
  };

  return (
    <ToolPageTemplate title="Resume Builder Pro" description="Build ATS-optimized, FAANG-grade resumes accepted by top companies. Multiple templates, PDF export." keywords="ATS resume, FAANG resume, resume builder, professional CV">
      <div className="grid xl:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2"><FileText className="w-5 h-5" />Resume Editor</h3>
            <Select value={template} onValueChange={(v: any) => setTemplate(v)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="faang">FAANG / ATS Classic</SelectItem>
                <SelectItem value="executive">Executive Serif</SelectItem>
                <SelectItem value="modern">Modern Sidebar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="header">
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="exp">Experience</TabsTrigger>
              <TabsTrigger value="edu">Education</TabsTrigger>
              <TabsTrigger value="proj">Projects</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            <TabsContent value="header" className="space-y-3 pt-3">
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

            <TabsContent value="summary" className="space-y-3 pt-3">
              <Label>Professional Summary (3–4 lines, impact-driven)</Label>
              <Textarea rows={5} value={summary} onChange={e => setSummary(e.target.value)} />
              <Label>Skills (use category prefix for ATS, e.g. "Languages: ...")</Label>
              <Textarea rows={6} value={skills} onChange={e => setSkills(e.target.value)} />
            </TabsContent>

            <TabsContent value="exp" className="space-y-3 pt-3">
              {experience.map(e => (
                <Card key={e.id} className="p-3 space-y-2 bg-muted/30">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Position</span>
                    <Button size="icon" variant="ghost" onClick={() => delExp(e.id)}><Trash2 className="w-4 h-4" /></Button>
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

            <TabsContent value="edu" className="space-y-3 pt-3">
              {education.map(e => (
                <Card key={e.id} className="p-3 space-y-2 bg-muted/30">
                  <div className="flex justify-end"><Button size="icon" variant="ghost" onClick={() => delEdu(e.id)}><Trash2 className="w-4 h-4" /></Button></div>
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

            <TabsContent value="proj" className="space-y-3 pt-3">
              {projects.map(p => (
                <Card key={p.id} className="p-3 space-y-2 bg-muted/30">
                  <div className="flex justify-end"><Button size="icon" variant="ghost" onClick={() => delProj(p.id)}><Trash2 className="w-4 h-4" /></Button></div>
                  <Input placeholder="Project Name" value={p.name} onChange={ev => updProj(p.id, "name", ev.target.value)} />
                  <Input placeholder="Tech Stack" value={p.tech} onChange={ev => updProj(p.id, "tech", ev.target.value)} />
                  <Input placeholder="Link" value={p.link} onChange={ev => updProj(p.id, "link", ev.target.value)} />
                  <Textarea rows={3} placeholder="Bullets (one per line)" value={p.bullets} onChange={ev => updProj(p.id, "bullets", ev.target.value)} />
                </Card>
              ))}
              <Button variant="outline" onClick={addProj} className="w-full"><Plus className="w-4 h-4 mr-2" />Add Project</Button>
            </TabsContent>

            <TabsContent value="more" className="space-y-3 pt-3">
              <Label>Awards / Honors / Certifications (one per line)</Label>
              <Textarea rows={6} value={awards} onChange={e => setAwards(e.target.value)} />
            </TabsContent>
          </Tabs>

          <Button onClick={downloadPDF} size="lg" className="w-full"><Download className="w-4 h-4 mr-2" />Download Resume PDF</Button>
        </Card>

        <Card className="p-3 bg-gray-200 max-h-[85vh] overflow-auto flex justify-center">
          <div ref={previewRef} className="shadow-2xl" style={{ transform: "scale(0.72)", transformOrigin: "top center" }}>
            {renderResume()}
          </div>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

const Section = ({ title, children, serif, accent }: { title: string; children: React.ReactNode; serif?: boolean; accent?: string }) => (
  <div className="mb-3">
    <div className={`font-bold text-[11pt] uppercase tracking-wider border-b ${serif ? "border-[#0a2540]" : "border-gray-800"} pb-0.5 mb-1.5`} style={accent ? { color: accent, borderColor: accent } : {}}>{title}</div>
    {children}
  </div>
);

const SidebarBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <div className="text-[9pt] font-bold tracking-widest text-slate-400 uppercase mb-1.5 border-b border-slate-600 pb-1">{title}</div>
    <div className="text-[9.5pt] space-y-0.5">{children}</div>
  </div>
);

export default ResumeBuilder;
