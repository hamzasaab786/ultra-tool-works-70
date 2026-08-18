/**
 * Build-time prerendering for the Klipza SPA.
 *
 * Runs after `vite build`. For every URL in public/sitemap.xml it writes a
 * static HTML file into dist/<route>/index.html with:
 *   - the real <title>, <meta name="description">, keywords and canonical link
 *   - Open Graph / Twitter tags for that exact route
 *   - the FAQPage / WebPage / BreadcrumbList / HowTo JSON-LD that
 *     ToolSeoHead.tsx renders client-side (same source of truth:
 *     src/data/toolSeo.ts + src/data/toolContent)
 *   - crawler-visible body copy (headings, steps, FAQs) inside #root
 *
 * The app still boots as a normal SPA: React replaces the #root placeholder on
 * hydration, so client navigation and every tool keeps working unchanged.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import { getToolSeo, buildCommonFaqs, type ToolSeoEntry } from "../src/data/toolSeo";
import { pathChunk } from "../src/data/toolContent/pathChunk";
import type { ToolContent, ToolContentMap } from "../src/data/toolContent/types";
import { chunk1 } from "../src/data/toolContent/chunk1";
import { chunk2 } from "../src/data/toolContent/chunk2";
import { chunk3 } from "../src/data/toolContent/chunk3";
import { chunk4 } from "../src/data/toolContent/chunk4";
import { chunk5 } from "../src/data/toolContent/chunk5";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE_URL = "https://klipza.live";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const chunks: Record<number, ToolContentMap> = { 1: chunk1, 2: chunk2, 3: chunk3, 4: chunk4, 5: chunk5 };

const getContent = (path: string): ToolContent | undefined => {
  const key = path.replace(/\/+$/, "") || "/";
  const c = pathChunk[key];
  return c ? chunks[c]?.[key] : undefined;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const jsonLd = (obj: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

interface PageMeta {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  /** extra JSON-LD blocks */
  schemas: unknown[];
  /** crawler-visible HTML injected into #root */
  body: string;
}

/* ------------------------------------------------------------ static pages */

const staticPages: Record<string, { title: string; description: string; keywords: string; h1: string }> = {
  "/": {
    title: "Klipza — Free Online Tools: PDF, Image, QR & Calculators",
    description:
      "Free browser-based tools for PDFs, images, QR codes, text and calculators. No signup — your files never leave your device.",
    keywords:
      "free online tools, pdf tools, image converter, qr code generator, resume builder, pdf ocr, unit converter, word counter, klipza",
    h1: "Free Online Tools — PDF, Image, Text & Calculators",
  },
  "/about": {
    title: "About Klipza — Free Privacy-First Online Tools",
    description:
      "Learn who builds Klipza, why our 130+ PDF, image, text and calculator tools are free, and how browser-based processing keeps your files private.",
    keywords: "about klipza, free online tools company, privacy first web tools",
    h1: "About Klipza",
  },
  "/privacy": {
    title: "Privacy Policy — How Klipza Handles Your Data",
    description:
      "Klipza processes files in your browser and never stores them. Read how we use cookies, analytics and advertising partners, and what rights you have.",
    keywords:
      "klipza privacy policy, online tools privacy, browser based file processing privacy, cookie policy, gdpr online tools",
    h1: "Privacy Policy",
  },
  "/terms": {
    title: "Terms and Conditions — Using Klipza's Free Tools",
    description:
      "Read the terms and conditions for using Klipza: acceptable use, your content and ownership, accuracy of results, advertising, liability limits and governing law.",
    keywords: "klipza terms and conditions, terms of service online tools, acceptable use policy, free tools terms",
    h1: "Terms and Conditions",
  },
  "/disclaimer": {
    title: "Disclaimer — Accuracy & Use of Klipza Tools",
    description:
      "Klipza's disclaimer: tool results, calculators and conversions are provided as-is for general use, with no professional, legal, medical or financial advice.",
    keywords: "klipza disclaimer, online tools disclaimer, no warranty online calculator",
    h1: "Disclaimer",
  },
};

/* --------------------------------------------------------------- page meta */

const toolPageMeta = (entry: ToolSeoEntry): PageMeta => {
  const url = `${SITE_URL}${entry.path}`;
  const content = getContent(entry.path);
  const faqs = [...entry.faqs, ...buildCommonFaqs(entry)];

  const schemas: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: `${entry.title} | Klipza`,
      description: entry.description,
      inLanguage: "en",
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      about: { "@type": "Thing", name: entry.name },
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: entry.category, item: `${SITE_URL}/#tools` },
        { "@type": "ListItem", position: 3, name: entry.name, item: url },
      ],
    },
  ];

  if (content) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: `How to use the ${entry.name}`,
      description: entry.description,
      totalTime: "PT1M",
      step: content.steps.map((text, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: `Step ${i + 1}`,
        text,
        url: `${url}#tool-article-heading`,
      })),
    });
  }

  const parts: string[] = [
    `<h1>${esc(entry.name)}</h1>`,
    `<p>${esc(entry.description)}</p>`,
  ];
  if (content) {
    parts.push(...content.intro.map((p) => `<p>${esc(p)}</p>`));
    parts.push(
      `<h2>How to use the ${esc(entry.name)}</h2><ol>${content.steps
        .map((s) => `<li>${esc(s)}</li>`)
        .join("")}</ol>`,
    );
    parts.push(
      `<h2>Why use this tool</h2>${content.benefits
        .map((b) => `<h3>${esc(b.title)}</h3><p>${esc(b.body)}</p>`)
        .join("")}`,
    );
    parts.push(`<h2>Common use cases</h2><ul>${content.useCases.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>`);
    parts.push(content.sections.map((s) => `<h2>${esc(s.heading)}</h2><p>${esc(s.body)}</p>`).join(""));
  }
  parts.push(
    `<h2>Frequently asked questions</h2>${faqs
      .map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`)
      .join("")}`,
  );

  return {
    path: entry.path,
    title: `${entry.title} | Klipza`,
    description: entry.description,
    keywords: entry.keywords,
    schemas,
    body: parts.join(""),
  };
};

const staticPageMeta = (path: string): PageMeta | null => {
  const p = staticPages[path];
  if (!p) return null;
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  return {
    path,
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    schemas: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: p.title,
        description: p.description,
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
        publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
      },
    ],
    body: `<h1>${esc(p.h1)}</h1><p>${esc(p.description)}</p>`,
  };
};

/* ------------------------------------------------------------ HTML rewrite */

const buildHtml = (shell: string, meta: PageMeta) => {
  const url = `${SITE_URL}${meta.path === "/" ? "/" : meta.path}`;
  let html = shell;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`);

  const setMeta = (attr: "name" | "property", key: string, value: string) => {
    const re = new RegExp(`<meta[^>]*${attr}="${key}"[^>]*>`, "i");
    const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
    html = re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
  };

  setMeta("name", "description", meta.description);
  if (meta.keywords) setMeta("name", "keywords", meta.keywords);
  setMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1");
  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", "Klipza");
  setMeta("property", "og:url", url);
  setMeta("property", "og:title", meta.title);
  setMeta("property", "og:description", meta.description);
  setMeta("property", "og:image", OG_IMAGE);
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", meta.title);
  setMeta("name", "twitter:description", meta.description);
  setMeta("name", "twitter:image", OG_IMAGE);

  html = html.replace(
    /<link[^>]*rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${url}" />`,
  );

  html = html.replace("</head>", `    ${meta.schemas.map(jsonLd).join("\n    ")}\n  </head>`);

  // Crawler-visible content; React clears and re-renders #root on boot.
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><div id="prerender-content">${meta.body}</div></div>`,
  );

  return html;
};

/* --------------------------------------------------------------------- run */

const sitemapPath = resolve(DIST, "sitemap.xml");
if (!existsSync(sitemapPath)) {
  console.error("prerender: dist/sitemap.xml not found — run the build first.");
  process.exit(1);
}

const shell = readFileSync(resolve(DIST, "index.html"), "utf8");
const sitemap = readFileSync(sitemapPath, "utf8");
const routes = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
  .map((m) => m[1].replace(SITE_URL, "").replace(/\/+$/, "") || "/");

let written = 0;
const skipped: string[] = [];

for (const route of routes) {
  const meta = route.startsWith("/tools/")
    ? (() => {
        const entry = getToolSeo(route);
        return entry ? toolPageMeta(entry) : null;
      })()
    : staticPageMeta(route);

  if (!meta) {
    skipped.push(route);
    continue;
  }

  const html = buildHtml(shell, meta);
  const outFile = route === "/" ? resolve(DIST, "index.html") : resolve(DIST, `.${route}/index.html`);
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  written++;
}

console.log(`prerender: wrote ${written} static HTML pages`);
if (skipped.length) {
  console.warn(`prerender: no SEO entry for ${skipped.length} route(s):\n  ${skipped.join("\n  ")}`);
}
