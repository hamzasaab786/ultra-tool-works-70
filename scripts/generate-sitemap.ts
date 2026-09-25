// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs"
import { resolve } from "path"

const BASE_URL = "https://klipza.live"

interface SitemapEntry {
  path: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: string
  lastmod?: string
}

const toolPaths = [
  "/tools/image-compressor",
  "/tools/image-resizer",
  "/tools/image-enhancer",
  "/tools/jpg-to-pdf",
  "/tools/svg-to-jpg",
  "/tools/image-to-url",
  "/tools/image-format-converter",
  "/tools/image-metadata-extractor",
  "/tools/image-crop-tool",
  "/tools/merge-pdf",
  "/tools/split-pdf",
  "/tools/pdf-to-jpg",
  "/tools/pdf-compressor",
  "/tools/pdf-to-excel",
  "/tools/unlock-pdf",
  "/tools/pdf-metadata-extractor",
  "/tools/add-page-numbers",
  "/tools/compare-pdf",
  "/tools/add-watermark",
  "/tools/delete-pdf-pages",
  "/tools/extract-pdf-pages",
  "/tools/extract-pdf-images",
  "/tools/flatten-pdf",
  "/tools/text-to-pdf",
  "/tools/pdf-page-resizer",
  "/tools/pdf-header-footer",
  "/tools/n-up-pdf",
  "/tools/pdf-viewer",
  "/tools/pdf-form-filler",
  "/tools/annotate-pdf",
  "/tools/grayscale-pdf",
  "/tools/bates-numbering",
  "/tools/insert-pdf-pages",
  "/tools/scan-to-pdf",
  "/tools/word-to-pdf",
  "/tools/pdf-to-word",
  "/tools/protect-pdf",
  "/tools/extract-text-pdf",
  "/tools/organize-pdf",
  "/tools/html-to-pdf",
  "/tools/excel-to-pdf",
  "/tools/powerpoint-to-pdf",
  "/tools/percentage-calculator",
  "/tools/unit-converter",
  "/tools/currency-converter",
  "/tools/age-calculator",
  "/tools/bmi-calculator",
  "/tools/loan-calculator",
  "/tools/tip-calculator",
  "/tools/hex-to-rgb",
  "/tools/number-base-converter",
  "/tools/word-counter",
  "/tools/case-converter",
  "/tools/base64-tool",
  "/tools/markdown-to-html",
  "/tools/text-diff",
  "/tools/lorem-ipsum",
  "/tools/url-decoder",
  "/tools/json-formatter",
  "/tools/csv-to-json",
  "/tools/text-encryption",
  "/tools/morse-code-translator",
  "/tools/regex-tester",
  "/tools/document-translator",
  "/tools/qr-code-generator",
  "/tools/password-generator",
  "/tools/hash-generator",
  "/tools/timer-stopwatch",
  "/tools/color-picker",
  "/tools/budget-tracker",
  "/tools/barcode-generator",
  "/tools/url-shortener",
  "/tools/email-validator",
  "/tools/password-strength",
  "/tools/file-hash-checker",
  "/tools/whois-lookup",
  "/tools/dns-lookup",
  "/tools/ip-geolocation",
  "/tools/credit-card-validator",
  "/tools/emoji-picker",
  "/tools/invoice-generator",
  "/tools/receipt-generator",
  "/tools/resume-builder",
  "/tools/business-card-generator",
  "/tools/pdf-ocr",
  "/tools/sign-pdf",
  "/tools/edit-pdf-text",
  "/tools/test-card-generator",
  "/tools/gpa-calculator",
  "/tools/date-difference-calculator",
  "/tools/discount-calculator",
  "/tools/compound-interest-calculator",
  "/tools/salary-calculator",
  "/tools/roman-numeral-converter",
  "/tools/time-zone-converter",
  "/tools/random-picker",
  "/tools/image-to-text",
  "/tools/calorie-calculator",
  "/tools/fuel-cost-calculator",
  "/tools/electricity-bill-calculator",
  "/tools/pregnancy-due-date-calculator",
  "/tools/sleep-calculator",
  "/tools/split-bill-calculator",
  "/tools/typing-speed-test",
  "/tools/pdf-to-text",
  "/tools/pdf-to-csv",
  "/tools/pdf-to-powerpoint",
  "/tools/pdf-to-pdfa",
  "/tools/rotate-pdf",
  "/tools/crop-pdf",
  "/tools/redact-pdf",
  "/tools/repair-pdf",
  "/tools/edit-pdf",
  "/tools/text-to-word",
  "/tools/word-to-text",
  "/tools/word-to-excel",
  "/tools/word-to-jpg",
  "/tools/jpg-to-word",
  "/tools/excel-to-word",
  "/tools/signature-generator",
  "/tools/image-watermark",
  "/tools/random-number-generator",
  "/tools/ovulation-calculator",
]

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "yearly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.3" },
  ...toolPaths.map((path): SitemapEntry => ({ path, changefreq: "monthly", priority: "0.8" })),
]

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
      [
        `  <url>`,
        `    <loc>${BASE_URL}${e.path}${e.path === "/" ? "" : "/"}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ]
      .filter(Boolean)
      .join("\n"),
  )

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n")
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries))
console.log(`sitemap.xml written (${entries.length} entries)`)

// llms.txt — machine-readable index so AI assistants (ChatGPT, Perplexity, Claude,
// Gemini) can discover and cite every tool on the site.
const titleCase = (slug: string) =>
  slug
    .replace("/tools/", "")
    .split("-")
    .map((w) => (["pdf", "csv", "jpg", "svg", "url", "qr", "ocr", "dns", "ip", "gpa", "bmi", "html", "n"].includes(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ")

const llms = [
  "# Klipza",
  "",
  "> Klipza is a free suite of 125+ privacy-first online tools for PDF, image, document, text and calculation tasks. Every tool runs entirely in the visitor's browser: files are never uploaded, there is no signup, no watermark and no usage limit.",
  "",
  "## Key facts",
  "- Cost: free, unlimited, no account required",
  "- Privacy: client-side processing, files never leave the device",
  "- Platforms: any modern browser on Windows, macOS, Android, iOS",
  "",
  "## Tools",
  ...entries
    .filter((e) => e.path.startsWith("/tools/"))
    .map((e) => `- [${titleCase(e.path)}](${BASE_URL}${e.path}/)`),
  "",
  "## Pages",
  `- [About](${BASE_URL}/about/)`,
  `- [Privacy Policy](${BASE_URL}/privacy/)`,
  `- [Terms](${BASE_URL}/terms/)`,
  `- [Disclaimer](${BASE_URL}/disclaimer/)`,
  "",
].join("\n")

writeFileSync(resolve("public/llms.txt"), llms)
console.log("llms.txt written")
