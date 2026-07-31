// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs"
import { resolve } from "path"

const BASE_URL = "https://klipza.live"
const TODAY = new Date().toISOString().split("T")[0]

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
  "/tools/passport-photo-maker",
  "/tools/image-format-converter",
  "/tools/image-metadata-extractor",
  "/tools/remove-watermark",
  "/tools/image-crop-tool",
  "/tools/merge-pdf",
  "/tools/split-pdf",
  "/tools/pdf-to-jpg",
  "/tools/pdf-compressor",
  "/tools/PdfToExcel",
  "/tools/UnlockPdf",
  "/tools/pdf-metadata-extractor",
  "/tools/add-page-numbers",
  "/tools/compare-pdf",
  "/tools/add-watermark",
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
]

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0", lastmod: TODAY },
  { path: "/about", changefreq: "yearly", priority: "0.5", lastmod: TODAY },
  { path: "/privacy", changefreq: "yearly", priority: "0.3", lastmod: TODAY },
  { path: "/terms", changefreq: "yearly", priority: "0.3", lastmod: TODAY },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.3", lastmod: TODAY },
  ...toolPaths.map((path): SitemapEntry => ({ path, changefreq: "monthly", priority: "0.8", lastmod: TODAY })),
]

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
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
