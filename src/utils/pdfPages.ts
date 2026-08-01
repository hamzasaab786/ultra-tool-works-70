/** Shared helpers for the page-level PDF tools. */

/**
 * Parses a human page selection like "1-3, 5, 8-10" into a sorted list of
 * 1-based page numbers, clamped to `total`.
 */
export function parsePageRanges(input: string, total: number): number[] {
  const out = new Set<number>();
  for (const chunk of input.split(",")) {
    const part = chunk.trim();
    if (!part) continue;
    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      let a = parseInt(range[1], 10);
      let b = parseInt(range[2], 10);
      if (a > b) [a, b] = [b, a];
      for (let i = a; i <= b; i++) if (i >= 1 && i <= total) out.add(i);
      continue;
    }
    const single = parseInt(part, 10);
    if (!Number.isNaN(single) && single >= 1 && single <= total) out.add(single);
  }
  return [...out].sort((a, b) => a - b);
}

export function downloadBlob(data: BlobPart, filename: string, type = "application/pdf") {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "");
}
