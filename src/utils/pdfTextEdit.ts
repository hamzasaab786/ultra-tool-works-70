/**
 * Real PDF text extraction helpers for the "Edit PDF Text" tool.
 *
 * Unlike a simple overlay editor, these helpers pull every text run out of the
 * document with its exact baseline position, font size, glyph width, font
 * family and sampled colors so an edited run can be re-drawn in the very same
 * spot without disturbing the surrounding layout.
 */
import { loadPdfDocument, renderPdfPageToCanvas } from "./pdfClient";

export interface PdfTextRun {
  id: string;
  page: number;
  /** Original string as stored in the PDF. */
  original: string;
  /** Current (possibly edited) string. */
  text: string;
  /** Baseline origin in PDF points (origin bottom-left). */
  x: number;
  y: number;
  /** Advance width of the original run in PDF points. */
  width: number;
  /** Font size in PDF points. */
  size: number;
  /** Rotation of the run in degrees (0 for normal horizontal text). */
  angle: number;
  family: "Helvetica" | "Times" | "Courier";
  bold: boolean;
  italic: boolean;
  /** Sampled ink color (#rrggbb). */
  color: string;
  /** Sampled background color behind the run (#rrggbb). */
  bg: string;
}

export interface PdfPageData {
  url: string;
  /** Page size in PDF points. */
  width: number;
  height: number;
}

const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;

function classifyFont(rawName: string, fontFamily: string) {
  const name = `${rawName} ${fontFamily}`.toLowerCase();
  const bold = /bold|black|heavy|semibold|600|700|800|900/.test(name);
  const italic = /italic|oblique/.test(name);
  let family: PdfTextRun["family"] = "Helvetica";
  if (/times|serif|georgia|garamond|book|roman|minion|cambria/.test(name) && !/sans/.test(name)) family = "Times";
  if (/courier|mono|consol/.test(name)) family = "Courier";
  return { family, bold, italic };
}

/** Samples ink + background colors for a run from the rendered page bitmap. */
function sampleColors(
  ctx: CanvasRenderingContext2D,
  scale: number,
  pageHeight: number,
  run: { x: number; y: number; width: number; size: number }
) {
  const fallback = { color: "#000000", bg: "#ffffff" };
  const sx = Math.floor(run.x * scale);
  const sy = Math.floor((pageHeight - run.y - run.size * 0.82) * scale);
  const sw = Math.ceil(Math.max(run.width, run.size * 0.4) * scale);
  const sh = Math.ceil(run.size * 1.1 * scale);
  if (sw <= 0 || sh <= 0) return fallback;

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(
      Math.max(0, sx),
      Math.max(0, sy),
      Math.min(sw, ctx.canvas.width - Math.max(0, sx)),
      Math.min(sh, ctx.canvas.height - Math.max(0, sy))
    ).data;
  } catch {
    return fallback;
  }
  if (!data.length) return fallback;

  let darkest = { l: Infinity, r: 0, g: 0, b: 0 };
  const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    if (l < darkest.l) darkest = { l, r, g, b };
    // Quantize to 16 levels per channel so anti-aliased noise collapses.
    const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.n += 1;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
    } else {
      buckets.set(key, { n: 1, r, g, b });
    }
  }

  let top = { n: 0, r: 255, g: 255, b: 255 };
  buckets.forEach((v) => {
    if (v.n > top.n) top = v;
  });

  return {
    color: toHex(darkest.r, darkest.g, darkest.b),
    bg: toHex(top.r / top.n, top.g / top.n, top.b / top.n),
  };
}

/**
 * Renders every page and extracts its editable text runs.
 */
export async function extractPdfTextRuns(
  file: File,
  scale = 1.5
): Promise<{ pages: PdfPageData[]; runs: PdfTextRun[] }> {
  const pdf = await loadPdfDocument(file);
  const pages: PdfPageData[] = [];
  const runs: PdfTextRun[] = [];

  for (let p = 1; p <= pdf.numPages; p += 1) {
    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const { canvas } = await renderPdfPageToCanvas(page, scale);
    const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;

    pages.push({ url: canvas.toDataURL("image/png"), width: viewport.width, height: viewport.height });

    const content = await page.getTextContent();
    const styles: Record<string, any> = (content as any).styles || {};

    (content.items as any[]).forEach((item, i) => {
      const str: string = item.str ?? "";
      if (!str.trim()) return;

      const [a, b, c, d, e, f] = item.transform as number[];
      const size = Math.hypot(c, d) || item.height || 10;
      const angle = Math.round((Math.atan2(b, a) * 180) / Math.PI);
      const width = item.width || size * 0.5 * str.length;

      const style = styles[item.fontName] || {};
      let rawName: string = item.fontName || "";
      try {
        const common = (page as any).commonObjs;
        if (common?.has?.(item.fontName)) rawName = common.get(item.fontName)?.name || rawName;
      } catch {
        /* font object not ready — heuristics below still apply */
      }
      const { family, bold, italic } = classifyFont(rawName, style.fontFamily || "");
      const { color, bg } = sampleColors(ctx, scale, viewport.height, { x: e, y: f, width, size });

      runs.push({
        id: `${p}-${i}`,
        page: p - 1,
        original: str,
        text: str,
        x: e,
        y: f,
        width,
        size,
        angle: Math.abs(angle) < 0.5 ? 0 : angle,
        family,
        bold,
        italic,
        color,
        bg,
      });
    });
  }

  return { pages, runs };
}

/** Maps Unicode punctuation that the standard PDF fonts cannot encode. */
export function sanitizeForStandardFont(input: string) {
  return input
    .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/[\u2022\u25CF]/g, "-")
    .replace(/\u20AC/g, "EUR")
    .replace(/\u2122/g, "TM")
    // Drop anything still outside the WinAnsi range.
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "");
}

export function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((ch) => ch + ch).join("") : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return [0, 0, 0];
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}
