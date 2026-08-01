import type { ResumeData } from "./types";

export interface ScoreCheck {
  id: string;
  label: string;
  hint: string;
  weight: number;
  pass: boolean;
}

const ACTION_VERBS = [
  "led", "built", "shipped", "launched", "designed", "owned", "drove", "scaled", "reduced",
  "increased", "improved", "delivered", "created", "architected", "automated", "negotiated",
  "managed", "mentored", "migrated", "optimized", "grew", "cut", "streamlined", "established",
];

const WEAK_PHRASES = [
  "responsible for", "worked on", "helped with", "duties included", "team player",
  "hard worker", "detail oriented", "results driven", "go-getter", "think outside the box",
];

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export function scoreResume(data: ResumeData) {
  const allBullets = [
    ...data.experience.flatMap((e) => e.bullets.split("\n")),
    ...data.projects.flatMap((p) => p.bullets.split("\n")),
  ]
    .map((b) => b.trim())
    .filter(Boolean);

  const quantified = allBullets.filter((b) => /\d/.test(b)).length;
  const verbStarts = allBullets.filter((b) =>
    ACTION_VERBS.includes(b.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "") || "")
  ).length;
  const weakHits = WEAK_PHRASES.filter((p) =>
    [data.summary, ...allBullets].join(" ").toLowerCase().includes(p)
  );
  const longBullets = allBullets.filter((b) => wordCount(b) > 32).length;
  const summaryWords = wordCount(data.summary);
  const totalWords =
    summaryWords + allBullets.reduce((n, b) => n + wordCount(b), 0) + wordCount(data.skills);

  const checks: ScoreCheck[] = [
    {
      id: "contact",
      label: "Complete contact block",
      hint: "Add email, phone and location so recruiters can reach you.",
      weight: 10,
      pass: !!(data.email.trim() && data.phone.trim() && data.location.trim()),
    },
    {
      id: "summary",
      label: "Summary is 30-70 words",
      hint: "Keep the summary punchy: 2-3 lines of positioning, not a paragraph.",
      weight: 12,
      pass: summaryWords >= 30 && summaryWords <= 70,
    },
    {
      id: "bullets",
      label: "At least 5 achievement bullets",
      hint: "Each role needs 2-4 bullets describing outcomes, not duties.",
      weight: 12,
      pass: allBullets.length >= 5,
    },
    {
      id: "metrics",
      label: "60%+ of bullets are quantified",
      hint: "Add numbers: %, $, users, latency, time saved. Metrics beat adjectives.",
      weight: 22,
      pass: allBullets.length > 0 && quantified / allBullets.length >= 0.6,
    },
    {
      id: "verbs",
      label: "Bullets start with strong action verbs",
      hint: "Start with Led, Built, Reduced, Scaled — never 'Responsible for'.",
      weight: 14,
      pass: allBullets.length > 0 && verbStarts / allBullets.length >= 0.5,
    },
    {
      id: "weak",
      label: "No filler or cliché phrases",
      hint: weakHits.length ? `Remove: ${weakHits.slice(0, 3).join(", ")}` : "Avoid clichés like 'team player'.",
      weight: 10,
      pass: weakHits.length === 0,
    },
    {
      id: "concise",
      label: "Bullets stay under 32 words",
      hint: "Long bullets get skimmed. Split them or trim the setup.",
      weight: 8,
      pass: longBullets === 0,
    },
    {
      id: "skills",
      label: "Keyword-rich skills section",
      hint: "Group skills by category and mirror the job description's wording.",
      weight: 12,
      pass: wordCount(data.skills) >= 15,
    },
  ];

  const earned = checks.filter((c) => c.pass).reduce((n, c) => n + c.weight, 0);
  const total = checks.reduce((n, c) => n + c.weight, 0);
  const score = Math.round((earned / total) * 100);

  return {
    score,
    checks,
    stats: {
      bullets: allBullets.length,
      quantified,
      weakHits,
      totalWords,
      estimatedPages: Math.max(1, Math.ceil(totalWords / 420)),
    },
  };
}
