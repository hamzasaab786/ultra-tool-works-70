import * as pdfjsLib from "pdfjs-dist";
// Bundle the worker with the app (Vite resolves this to a hashed asset URL).
// This removes the hard runtime dependency on a third-party CDN.
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";

if (typeof window !== "undefined") {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    // Warm the worker as soon as the module loads so the first PDF a user opens
    // doesn't pay the worker boot cost (usually 300-800ms).
    if (!(window as any).__pdfWorkerWarmed) {
      (window as any).__pdfWorkerWarmed = true;
      const warm = () => {
        try {
          const link = document.createElement("link");
          link.rel = "preload";
          link.as = "script";
          link.href = pdfWorkerUrl;
          document.head.appendChild(link);
        } catch {
          /* noop */
        }
      };
      if ("requestIdleCallback" in window) (window as any).requestIdleCallback(warm);
      else setTimeout(warm, 0);
    }
  } catch {
    // Fallback to a CDN copy that matches the installed version exactly.
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
}

export { pdfjsLib };

/** How many pages we render at the same time. Tuned to the device's cores. */
export const RENDER_CONCURRENCY = Math.min(
  6,
  Math.max(2, (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4)
);

export async function loadPdfDocument(file: File | ArrayBuffer | Uint8Array) {
  const data =
    file instanceof File
      ? new Uint8Array(await file.arrayBuffer())
      : file instanceof ArrayBuffer
        ? new Uint8Array(file)
        : file;
  return pdfjsLib.getDocument({
    data,
    // Speed-focused flags: local data is already in memory, so skip streaming
    // machinery, and avoid expensive system-font matching / eval.
    disableAutoFetch: true,
    disableStream: true,
    isEvalSupported: false,
    useSystemFonts: false,
  }).promise;
}

export async function renderPdfPageToCanvas(page: any, scale = 1.5) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true, alpha: false });

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

/** Canvas -> object URL. Far faster and lighter than toDataURL for big pages. */
export function canvasToUrl(canvas: HTMLCanvasElement, type = "image/png", quality?: number) {
  return new Promise<string>((resolve) => {
    if (canvas.toBlob) {
      canvas.toBlob(
        (blob) => resolve(blob ? URL.createObjectURL(blob) : canvas.toDataURL(type, quality)),
        type,
        quality
      );
    } else {
      resolve(canvas.toDataURL(type, quality));
    }
  });
}

/** Run an async mapper over items with a bounded number of parallel workers. */
export async function mapConcurrent<T, R>(
  items: T[],
  mapper: (item: T, index: number) => Promise<R>,
  concurrency = RENDER_CONCURRENCY
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
    }
  });

  await Promise.all(workers);
  return results;
}

export async function renderPdfPreviewPages(file: File, scale = 1.35) {
  const pdf = await loadPdfDocument(file);
  const numbers = Array.from({ length: pdf.numPages }, (_, i) => i + 1);

  // Pages render in parallel, but results stay in document order.
  return mapConcurrent(numbers, async (pageNumber) => {
    const page = await pdf.getPage(pageNumber);
    const { canvas, viewport } = await renderPdfPageToCanvas(page, scale);
    const url = await canvasToUrl(canvas, "image/jpeg", 0.85);
    page.cleanup();
    canvas.width = 0;
    canvas.height = 0;
    return { url, w: viewport.width, h: viewport.height };
  });
}
