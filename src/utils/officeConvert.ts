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

/* ------------------------------ PDF text layout ----------------------------- */

export interface PdfTextPart {
  x: number;
  text: string;
  size: number;
  bold: boolean;
  italic: boolean;
}

export interface PdfLine {
  y: number;
  x: number;
  size: number;
  parts: PdfTextPart[];
  text: string;
}

/** Extract visually-ordered lines with font metrics from a pdf.js page. */
export async function extractPageLines(page: any): Promise<PdfLine[]> {
  const content = await page.getTextContent();
  const styles = content.styles || {};

  const raw: (PdfTextPart & { y: number })[] = [];
  for (const item of content.items as any[]) {
    const str = item.str;
    if (!str || !str.trim()) continue;
    const t = item.transform;
    const size = Math.hypot(t[2], t[3]) || Math.hypot(t[0], t[1]) || 11;
    const style = styles[item.fontName] || {};
    const fontName: string = String(style.fontFamily || item.fontName || "");
    raw.push({
      x: t[4],
      y: t[5],
      text: str,
      size: Math.round(size * 10) / 10,
      bold: /bold|black|heavy|semibold/i.test(fontName),
      italic: /italic|oblique/i.test(fontName),
    });
  }

  // group into lines by baseline
  const lines: PdfLine[] = [];
  for (const item of raw) {
    const tol = Math.max(2, item.size * 0.5);
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
        const gap = p.x - (prev.x + estimateWidth(prev));
        if (gap > prev.size * 0.22 && !/\s$/.test(text) && !/^\s/.test(p.text)) text += " ";
      }
      text += p.text;
      prev = p;
    }
    line.text = text.replace(/\s+/g, " ").trim();
  }

  return lines.filter((l) => l.text.length > 0);
}

function estimateWidth(part: PdfTextPart) {
  return part.text.length * part.size * 0.5;
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
      prev !== null && gap > 0 && gap < prev.size * 1.75 && Math.abs(line.size - prev.size) < 1.2;

    if (prev && sameParagraph) {
      blocks[blocks.length - 1].lines.push(line);
    } else {
      blocks.push({ lines: [line], spaceBefore: prev ? Math.max(0, gap - prev.size * 1.2) : 0 });
    }
    prev = line;
  }
  return blocks;
}

/* --------------------------- PDF table/grid detection ------------------------ */

/**
 * Detect column boundaries from all line parts on a page and snap every line
 * into a fixed grid so spreadsheets keep their original column structure.
 */
export function linesToGrid(lines: PdfLine[]): string[][] {
  // 1) merge each line's text parts into logical cells (big horizontal gap = new cell)
  const lineCells = lines.map((line) => {
    const cells: { x: number; text: string }[] = [];
    let prev: PdfTextPart | null = null;
    for (const p of line.parts) {
      const gap = prev ? p.x - (prev.x + estimateWidth(prev)) : Infinity;
      if (!prev || gap > Math.max(p.size * 1.2, 9)) {
        cells.push({ x: p.x, text: p.text.trim() });
      } else {
        const cell = cells[cells.length - 1];
        cell.text = (cell.text + (gap > p.size * 0.22 ? " " : "") + p.text).replace(/\s+/g, " ");
      }
      prev = p;
    }
    return cells.filter((c) => c.text !== "");
  });

  // 2) cluster the cell start positions into shared columns
  const xs: number[] = [];
  for (const cells of lineCells) for (const c of cells) xs.push(Math.round(c.x));
  if (!xs.length) return [];
  xs.sort((a, b) => a - b);
  const clusters: number[][] = [];
  for (const x of xs) {
    const last = clusters[clusters.length - 1];
    if (last && x - last[last.length - 1] <= 12) last.push(x);
    else clusters.push([x]);
  }
  const columns = clusters.map((c) => c.reduce((a, b) => a + b, 0) / c.length);

  const colIndex = (x: number) => {
    let best = 0;
    let bestD = Infinity;
    columns.forEach((c, i) => {
      const d = Math.abs(c - x);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  };

  return lineCells
    .map((cells) => {
      const row: string[] = new Array(columns.length).fill("");
      for (const c of cells) {
        const i = colIndex(c.x);
        row[i] = row[i] ? `${row[i]} ${c.text}` : c.text;
      }
      while (row.length && row[row.length - 1] === "") row.pop();
      return row;
    })
    .filter((r) => r.some((c) => c !== ""));
}

/** Convert a raw string to a number when it clearly is one (keeps Excel typing). */
export function coerceCell(value: string): string | number {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const cleaned = trimmed.replace(/[,\s]/g, "");
  if (/^-?\d+(\.\d+)?$/.test(cleaned) && cleaned.length < 16) {
    const n = Number(cleaned);
    if (!Number.isNaN(n)) return n;
  }
  return trimmed;
}
