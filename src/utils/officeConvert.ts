/**
 * Shared format-preserving conversion helpers for the Office/PDF tools.
 * Everything runs 100% client-side.
 */

/* ---------------------------------- pdfmake --------------------------------- */

let pdfMakeCache: any = null;

export async function loadPdfMake(): Promise<any> {
  if (pdfMakeCache) return pdfMakeCache;
  const mod: any = await import("pdfmake/build/pdfmake");
  const pdfMake = mod.default ?? mod;
  const vfsMod: any = await import("pdfmake/build/vfs_fonts");
  const vfs =
    vfsMod?.pdfMake?.vfs ??
    vfsMod?.default?.pdfMake?.vfs ??
    vfsMod?.default?.vfs ??
    vfsMod?.vfs ??
    vfsMod?.default;
  if (vfs) pdfMake.vfs = vfs;
  pdfMakeCache = pdfMake;
  return pdfMake;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ------------------------------ text normalising ---------------------------- */

const LIGATURES: Record<string, string> = {
  "\uFB00": "ff",
  "\uFB01": "fi",
  "\uFB02": "fl",
  "\uFB03": "ffi",
  "\uFB04": "ffl",
  "\uFB05": "st",
  "\uFB06": "st",
};

/** Fix ligatures, soft hyphens and exotic spaces so text stays 1:1 with the PDF. */
export function normalizePdfText(input: string): string {
  let out = input;
  for (const [k, v] of Object.entries(LIGATURES)) out = out.split(k).join(v);
  return out
    .replace(/\u00AD/g, "") // soft hyphen
    .replace(/[\u00A0\u2007\u202F]/g, " ") // non-breaking spaces
    .replace(/[\u2010\u2011]/g, "-")
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\uFFFD/g, "");
}

/* ------------------------------ PDF text layout ----------------------------- */

export interface PdfTextPart {
  x: number;
  w: number;
  text: string;
  size: number;
  bold: boolean;
  italic: boolean;
  font: string;
  mono: boolean;
  serif: boolean;
}

export interface PdfLine {
  y: number;
  x: number;
  size: number;
  parts: PdfTextPart[];
  text: string;
}

/**
 * Extract visually-ordered lines with font metrics from a pdf.js page.
 * Coordinates are normalised through the page viewport, so rotated pages,
 * flipped text matrices and non-zero crop boxes all come out correct.
 */
export async function extractPageLines(page: any): Promise<PdfLine[]> {
  const content = await page.getTextContent({
    includeMarkedContent: false,
    disableNormalization: false,
  });
  const styles = content.styles || {};
  const viewport = page.getViewport({ scale: 1 });

  const raw: (PdfTextPart & { y: number })[] = [];
  for (const item of content.items as any[]) {
    const str: string = item.str;
    if (!str || !str.trim()) continue;
    const t = item.transform;

    // font size in device space (respects page rotation + text matrix scaling)
    const scale = Math.hypot(viewport.transform[0], viewport.transform[1]) || 1;
    const rawSize = Math.hypot(t[2], t[3]) || Math.hypot(t[0], t[1]) || 11;
    const size = rawSize * scale;

    const [vx, vy] = viewport.convertToViewportPoint(t[4], t[5]);
    const [ex] = viewport.convertToViewportPoint(t[4] + (item.width || 0), t[5]);
    const width =
      Math.abs(ex - vx) > 0.01 ? Math.abs(ex - vx) : str.length * size * 0.5;

    const style = styles[item.fontName] || {};
    const fontName = String(style.fontFamily || item.fontName || "");
    const lower = fontName.toLowerCase();

    raw.push({
      x: Math.min(vx, ex),
      w: width,
      // keep "higher on the page = larger y" so ordering stays intuitive
      y: viewport.height - vy,
      text: normalizePdfText(str),
      size: Math.round(size * 10) / 10,
      bold: /bold|black|heavy|semibold|[-,]b\b/i.test(fontName) || Number(style.fontWeight) >= 600,
      italic: /italic|oblique/i.test(fontName) || Boolean(style.italic),
      font: fontName,
      mono: /mono|courier|consol/i.test(lower),
      serif: /times|serif|georgia|garamond|book|roman|minion/i.test(lower) && !/sans/i.test(lower),
    });
  }

  // group into lines by baseline
  const lines: PdfLine[] = [];
  for (const item of raw) {
    const tol = Math.max(2, item.size * 0.45);
    let line = lines.find((l) => Math.abs(l.y - item.y) <= tol);
    if (!line) {
      line = { y: item.y, x: item.x, size: item.size, parts: [], text: "" };
      lines.push(line);
    }
    line.parts.push(item);
  }

  lines.sort((a, b) => b.y - a.y);
  for (const line of lines) {
    line.parts.sort((a, b) => a.x - b.x);
    line.x = line.parts[0]?.x ?? 0;
    line.size = Math.max(...line.parts.map((p) => p.size));
    let text = "";
    let prev: PdfTextPart | null = null;
    for (const p of line.parts) {
      if (prev) {
        const gap = p.x - (prev.x + prev.w);
        if (gap > prev.size * 0.2 && !/\s$/.test(text) && !/^\s/.test(p.text)) text += " ";
      }
      text += p.text;
      prev = p;
    }
    line.text = text.replace(/\s+/g, " ").trim();
  }

  return lines.filter((l) => l.text.length > 0);
}

/** Merge lines into paragraphs, preserving blank-line spacing. */
export interface PdfBlock {
  lines: PdfLine[];
  spaceBefore: number;
}

export function groupLinesIntoBlocks(lines: PdfLine[]): PdfBlock[] {
  const blocks: PdfBlock[] = [];
  let prev: PdfLine | null = null;
  for (const line of lines) {
    const gap = prev ? prev.y - line.y : 0;
    const sameParagraph =
      prev !== null &&
      gap > 0 &&
      gap < prev.size * 1.75 &&
      Math.abs(line.size - prev.size) < 1.2 &&
      // a new bullet / numbered item always starts a new block
      !/^([•▪◦‣·–-]|\d{1,2}[.)]|[a-z][.)])\s+/i.test(line.text);

    if (prev && sameParagraph) {
      blocks[blocks.length - 1].lines.push(line);
    } else {
      blocks.push({ lines: [line], spaceBefore: prev ? Math.max(0, gap - prev.size * 1.2) : 0 });
    }
    prev = line;
  }
  return blocks;
}

/** Join two wrapped line texts, healing hyphenated word breaks. */
export function joinWrapped(prevText: string, nextText: string): string {
  if (/[a-z]-$/.test(prevText) && /^[a-z]/.test(nextText)) {
    return prevText.slice(0, -1) + nextText;
  }
  return prevText + " " + nextText;
}

/* --------------------------- PDF table/grid detection ------------------------ */

export interface PdfCell {
  x: number;
  end: number;
  text: string;
}

/** Split a line into logical cells using significant horizontal gaps. */
export function lineToCells(line: PdfLine): PdfCell[] {
  const cells: PdfCell[] = [];
  let prev: PdfTextPart | null = null;
  for (const p of line.parts) {
    const gap = prev ? p.x - (prev.x + prev.w) : Infinity;
    if (!prev || gap > Math.max(p.size * 0.5, 3.5)) {
      cells.push({ x: p.x, end: p.x + p.w, text: p.text.trim() });
    } else {
      const cell = cells[cells.length - 1];
      cell.text = (cell.text + (gap > p.size * 0.2 ? " " : "") + p.text).replace(/\s+/g, " ");
      cell.end = p.x + p.w;
    }
    prev = p;
  }
  return cells.filter((c) => c.text !== "");
}

function buildBands(rows: PdfCell[][]) {
  const spans = rows
    .flat()
    .map((c) => ({ start: c.x, end: Math.max(c.end, c.x + 1) }))
    .sort((a, b) => a.start - b.start);

  const bands: { start: number; end: number }[] = [];
  for (const span of spans) {
    const last = bands[bands.length - 1];
    if (last && span.start < last.end - 1) {
      last.end = Math.max(last.end, span.end);
    } else {
      bands.push({ ...span });
    }
  }
  return bands;
}

function cellsToRows(lineCells: PdfCell[][], bands: { start: number; end: number }[]): string[][] {
  const bandIndex = (cell: PdfCell) => {
    let best = 0;
    let bestOverlap = -Infinity;
    bands.forEach((b, i) => {
      const overlap = Math.min(b.end, cell.end) - Math.max(b.start, cell.x);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        best = i;
      }
    });
    return best;
  };

  let rows = lineCells
    .map((cells) => {
      const row: string[] = new Array(bands.length).fill("");
      for (const c of cells) {
        const i = bandIndex(c);
        row[i] = row[i] ? `${row[i]} ${c.text}` : c.text;
      }
      return row;
    })
    .filter((r) => r.some((c) => c !== ""));

  // merge neighbouring columns that never hold data on the same row
  // (fixes left-aligned headers sitting above right-aligned numbers)
  for (let c = 0; c < (rows[0]?.length ?? 0) - 1; c++) {
    const conflict = rows.some((r) => r[c] !== "" && r[c + 1] !== "");
    if (!conflict) {
      rows = rows.map((r) => {
        const merged = [...r];
        merged[c] = (r[c] || r[c + 1]).trim();
        merged.splice(c + 1, 1);
        return merged;
      });
      c--;
    }
  }

  return rows
    .map((r) => {
      const row = [...r];
      while (row.length && row[row.length - 1] === "") row.pop();
      return row;
    })
    .filter((r) => r.some((c) => c !== ""));
}

/**
 * Detect column boundaries from all line parts on a page and snap every line
 * into a fixed grid so spreadsheets keep their original column structure.
 */
export function linesToGrid(lines: PdfLine[]): string[][] {
  const lineCells = lines.map(lineToCells);
  const tableRows = lineCells.filter((c) => c.length > 1);
  const bands = buildBands(tableRows.length ? tableRows : lineCells);
  if (!bands.length) return [];
  return cellsToRows(lineCells, bands);
}

export type PdfRegion =
  | { type: "text"; lines: PdfLine[] }
  | { type: "table"; rows: string[][]; lines: PdfLine[] };

/**
 * Split a page into paragraph regions and real table regions so converters can
 * emit genuine tables instead of space-padded text.
 */
export function detectRegions(lines: PdfLine[]): PdfRegion[] {
  const flags = lines.map((l) => lineToCells(l).length > 1);
  const regions: PdfRegion[] = [];
  let i = 0;

  while (i < lines.length) {
    if (!flags[i]) {
      const start = i;
      while (i < lines.length && !flags[i]) i++;
      regions.push({ type: "text", lines: lines.slice(start, i) });
      continue;
    }

    const start = i;
    while (i < lines.length && flags[i]) i++;
    const chunk = lines.slice(start, i);

    // need at least two aligned multi-cell rows to call it a table
    if (chunk.length < 2) {
      regions.push({ type: "text", lines: chunk });
      continue;
    }

    const cells = chunk.map(lineToCells);
    const bands = buildBands(cells);
    const rows = cellsToRows(cells, bands);
    const cols = Math.max(...rows.map((r) => r.length));

    if (cols < 2 || rows.length < 2) {
      regions.push({ type: "text", lines: chunk });
    } else {
      regions.push({
        type: "table",
        rows: rows.map((r) => Array.from({ length: cols }, (_, c) => r[c] ?? "")),
        lines: chunk,
      });
    }
  }

  // merge adjacent text regions
  const merged: PdfRegion[] = [];
  for (const r of regions) {
    const last = merged[merged.length - 1];
    if (r.type === "text" && last && last.type === "text") last.lines.push(...r.lines);
    else merged.push(r);
  }
  return merged.filter((r) => (r.type === "text" ? r.lines.length > 0 : r.rows.length > 0));
}

/** Convert a raw string to a number when it clearly is one (keeps Excel typing). */
export function coerceCell(value: string): string | number {
  const trimmed = value.trim();
  if (!trimmed) return "";

  // parenthesised negatives used in finance: (1,250.50)
  const paren = /^\((.+)\)$/.exec(trimmed);
  const core = paren ? paren[1] : trimmed;

  // strip currency symbols, thousands separators and a trailing percent
  const percent = /%$/.test(core);
  const cleaned = core
    .replace(/%$/, "")
    .replace(/^[$€£¥₹]\s?/, "")
    .replace(/[,\s]/g, "");

  if (/^-?\d+(\.\d+)?$/.test(cleaned) && cleaned.length < 16) {
    let n = Number(cleaned);
    if (!Number.isNaN(n)) {
      if (percent) n = n / 100;
      return paren ? -n : n;
    }
  }
  return trimmed;
}

/** Excel number format that mirrors how the value looked in the source document. */
export function inferNumberFormat(original: string): string | undefined {
  const t = original.trim();
  if (/%$/.test(t)) return t.includes(".") ? "0.00%" : "0%";
  const cur = /^([$€£¥₹])/.exec(t);
  if (cur) return `"${cur[1]}"#,##0.00`;
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) return t.includes(".") ? "#,##0.00" : "#,##0";
  return undefined;
}
