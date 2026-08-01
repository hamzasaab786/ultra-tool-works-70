import * as pdfjsLib from "pdfjs-dist";
// Bundle the worker with the app (Vite resolves this to a hashed asset URL).
// This removes the hard runtime dependency on a third-party CDN.
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";

if (typeof window !== "undefined") {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  } catch {
    // Fallback to a CDN copy that matches the installed version exactly.
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
}

export { pdfjsLib };

export async function loadPdfDocument(file: File | ArrayBuffer | Uint8Array) {
  const data = file instanceof File ? new Uint8Array(await file.arrayBuffer()) : file instanceof ArrayBuffer ? new Uint8Array(file) : file;
  return pdfjsLib.getDocument({ data }).promise;
}

export async function renderPdfPageToCanvas(page: any, scale = 1.5) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

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
