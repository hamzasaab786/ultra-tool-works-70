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
  w: number;
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
      w: typeof item.width === "number" && item.width > 0 ? item.width : str.length * size * 0.5,
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
        const gap = p.x - (prev.x + prev.w);
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
  return part.w;
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
    const cells: { x: number; end: number; text: string }[] = [];
    let prev: PdfTextPart | null = null;
    for (const p of line.parts) {
      const gap = prev ? p.x - (prev.x + prev.w) : Infinity;
      if (!prev || gap > Math.max(p.size * 0.8, 5)) {
        cells.push({ x: p.x, end: p.x + p.w, text: p.text.trim() });
      } else {
        const cell = cells[cells.length - 1];
        cell.text = (cell.text + (gap > p.size * 0.22 ? " " : "") + p.text).replace(/\s+/g, " ");
        cell.end = p.x + p.w;
      }
      prev = p;
    }
    return cells.filter((c) => c.text !== "");
  });

  // 2) build column bands from table-like rows only (lines with 2+ cells)
  const tableRows = lineCells.filter((c) => c.length > 1);
  const source = (tableRows.length ? tableRows : lineCells).flat();
  const spans = source
    .map((c) => ({ start: c.x, end: Math.max(c.end, c.x + 1) }))
    .sort((a, b) => a.start - b.start);
  if (!spans.length) return [];

  const bands: { start: number; end: number }[] = [];
  for (const span of spans) {
    const last = bands[bands.length - 1];
    // merge when spans overlap or are separated by less than a typical column gutter
    if (last && span.start < last.end - 1) {
      last.end = Math.max(last.end, span.end);
    } else {
      bands.push({ ...span });
    }
  }

  const bandIndex = (cell: { x: number; end: number }) => {
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

  // 3) merge neighbouring columns that never hold data on the same row
  //    (fixes left-aligned headers sitting above right-aligned numbers)
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
