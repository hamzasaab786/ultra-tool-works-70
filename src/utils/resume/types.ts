export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  details: string;
}

export interface Project {
  id: string;
  name: string;
  tech: string;
  bullets: string;
  link: string;
}

export type TemplateKey = "ats" | "executive" | "signature" | "compact";
export type FontKey = "sans" | "serif" | "mono";
export type Density = "compact" | "balanced" | "airy";

export interface ResumeSettings {
  template: TemplateKey;
  accent: string; // hex
  font: FontKey;
  density: Density;
  showPhoto: boolean;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  skills: string;
  awards: string;
  languages: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
}

export const FONT_STACK: Record<FontKey, string> = {
  sans: "Arial, Helvetica, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'Courier New', Courier, monospace",
};

export const PDF_FONT: Record<FontKey, string> = {
  sans: "helvetica",
  serif: "times",
  mono: "courier",
};

export const DENSITY_SCALE: Record<Density, number> = {
  compact: 0.9,
  balanced: 1,
  airy: 1.12,
};

export const TEMPLATE_META: Record<TemplateKey, { name: string; tag: string; pitch: string; defaultAccent: string }> = {
  ats: {
    name: "ATS Prime",
    tag: "Tech / product / engineering",
    pitch: "Single column, maximum parser accuracy, recruiter-friendly hierarchy.",
    defaultAccent: "#1f2937",
  },
  executive: {
    name: "Boardroom",
    tag: "Leadership / consulting / finance",
    pitch: "Serif authority with a summary-led, senior structure.",
    defaultAccent: "#17365d",
  },
  signature: {
    name: "Signature Modern",
    tag: "Design / growth / marketing",
    pitch: "Coloured header band and a confident two-column body.",
    defaultAccent: "#b8123c",
  },
  compact: {
    name: "One-Page Compact",
    tag: "Students / career switchers",
    pitch: "Dense, tightly-tuned layout that keeps everything on one page.",
    defaultAccent: "#0f766e",
  },
};

export const DEFAULT_RESUME: ResumeData = {
  name: "Alex Johnson",
  title: "Senior Software Engineer",
  email: "alex@email.com",
  phone: "+1 555 0100",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexj",
  github: "github.com/alexj",
  website: "alexj.dev",
  summary:
    "Senior engineer with 7+ years building high-scale products and performance-critical systems. Known for translating complex technical work into measurable business results, elevating engineering quality, and shipping fast without breaking reliability.",
  skills:
    "Programming: TypeScript, Python, Go, Java, SQL\nFrontend: React, Next.js, Tailwind, Design Systems\nBackend: Node.js, gRPC, REST APIs, Event-Driven Systems\nInfrastructure: AWS, Docker, Kubernetes, Terraform, CI/CD\nData: PostgreSQL, Redis, Kafka, BigQuery",
  awards:
    "AWS Certified Solutions Architect - Professional (2024)\nTop Performer Award - Northstar Cloud (2023)\nDean's List - UC Berkeley",
  languages: "English (native), Spanish (professional)",
  experience: [
    {
      id: "exp-1",
      role: "Senior Software Engineer",
      company: "Northstar Cloud",
      location: "San Francisco, CA",
      start: "Jan 2023",
      end: "Present",
      bullets:
        "Led platform modernization across 18 services, cutting release lead time by 68% and lifting deployment reliability to 99.95%.\nBuilt an event pipeline handling 1.8B monthly events while reducing infrastructure spend by $420K annually.\nMentored 5 engineers and introduced senior interview rubrics later adopted org-wide.",
    },
    {
      id: "exp-2",
      role: "Software Engineer",
      company: "Atlas Pay",
      location: "Remote",
      start: "Jun 2020",
      end: "Dec 2022",
      bullets:
        "Owned payment reliability work that improved approval rates by 11% and protected $48M in annual GMV.\nShipped 10+ customer features, increasing conversion by 19% across web and mobile funnels.\nReduced p95 API latency from 780ms to 140ms through caching and query redesign.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. Computer Science",
      school: "University of California, Berkeley",
      location: "Berkeley, CA",
      start: "2016",
      end: "2020",
      details: "GPA 3.8/4.0 - Coursework: Distributed Systems, Machine Learning, Algorithms",
    },
  ],
  projects: [
    {
      id: "prj-1",
      name: "OpenAPI Mock Server",
      tech: "Go, Docker, Kubernetes",
      link: "github.com/alexj/openapi-mock",
      bullets:
        "Open-source developer tool with 3.2k+ GitHub stars and adoption across internal platform teams.\nCut local environment setup from 2 days to 15 minutes for 200+ engineers.",
    },
  ],
};

export const DEFAULT_SETTINGS: ResumeSettings = {
  template: "ats",
  accent: TEMPLATE_META.ats.defaultAccent,
  font: "sans",
  density: "balanced",
  showPhoto: false,
};

export const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`;
