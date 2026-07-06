import * as pdfjsLib from "pdfjs-dist";

// Load worker from CDN matching the exact installed version. This avoids
// Vite ?url / MIME-type edge cases where the dev/prod server returns HTML
// instead of the worker script.
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}


export { pdfjsLib };

export async function loadPdfDocument(file: File | ArrayBuffer | Uint8Array) {
  const data = file instanceof File ? new Uint8Array(await file.arrayBuffer()) : file instanceof ArrayBuffer ? new Uint8Array(file) : file;
  return pdfjsLib.getDocument({ data }).promise;
}

export async function renderPdfPageToCanvas(page: any, scale = 1.5) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas context could not be created");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return { canvas, viewport };
}

export async function renderPdfPreviewPages(file: File, scale = 1.35) {
  const pdf = await loadPdfDocument(file);
  const pages: { url: string; w: number; h: number }[] = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const { canvas, viewport } = await renderPdfPageToCanvas(page, scale);
    pages.push({
      url: canvas.toDataURL("image/png"),
      w: viewport.width,
      h: viewport.height,
    });
  }

  return pages;
}