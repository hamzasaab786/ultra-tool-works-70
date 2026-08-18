/**
 * Shared client-side image engine.
 * Handles accurate decoding (EXIF-aware), high-quality resampling and
 * real encoders for formats the canvas cannot natively export (BMP, TIFF, GIF, ICO, SVG).
 * Everything runs in the browser — no uploads.
 */

export type ImageFormat =
  | "jpeg"
  | "png"
  | "webp"
  | "avif"
  | "bmp"
  | "gif"
  | "tiff"
  | "ico"
  | "svg";

export interface FormatInfo {
  value: ImageFormat;
  label: string;
  mimeType: string;
  extension: string;
  lossy: boolean;
  alpha: boolean;
}

export const FORMATS: FormatInfo[] = [
  { value: "jpeg", label: "JPG / JPEG", mimeType: "image/jpeg", extension: "jpg", lossy: true, alpha: false },
  { value: "png", label: "PNG", mimeType: "image/png", extension: "png", lossy: false, alpha: true },
  { value: "webp", label: "WebP", mimeType: "image/webp", extension: "webp", lossy: true, alpha: true },
  { value: "avif", label: "AVIF", mimeType: "image/avif", extension: "avif", lossy: true, alpha: true },
  { value: "bmp", label: "BMP", mimeType: "image/bmp", extension: "bmp", lossy: false, alpha: false },
  { value: "gif", label: "GIF", mimeType: "image/gif", extension: "gif", lossy: false, alpha: true },
  { value: "tiff", label: "TIFF", mimeType: "image/tiff", extension: "tiff", lossy: false, alpha: true },
  { value: "ico", label: "ICO (icon)", mimeType: "image/x-icon", extension: "ico", lossy: false, alpha: true },
  { value: "svg", label: "SVG (embedded raster)", mimeType: "image/svg+xml", extension: "svg", lossy: false, alpha: true },
];

export const getFormat = (value: string) => FORMATS.find((f) => f.value === value);

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const baseFileName = (name: string) =>
  name.replace(/\.[^./\\]+$/, "") || "image";

/* ------------------------------------------------------------------ *
 * Capability detection
 * ------------------------------------------------------------------ */

const encodeSupportCache = new Map<string, Promise<boolean>>();

export const canEncode = (mime: string): Promise<boolean> => {
  const cached = encodeSupportCache.get(mime);
  if (cached) return cached;
  const probe = (async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 4;
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      ctx.fillStyle = "#123456";
      ctx.fillRect(0, 0, 4, 4);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, mime, 0.8));
      return !!blob && blob.type === mime;
    } catch {
      return false;
    }
  })();
  encodeSupportCache.set(mime, probe);
  return probe;
};

/* ------------------------------------------------------------------ *
 * Decoding
 * ------------------------------------------------------------------ */

export interface DecodedImage {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  hasAlpha: boolean;
}

const drawToCanvas = (source: CanvasImageSource, width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
};

const loadViaImgElement = (file: File | Blob): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.decoding = "sync";
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file could not be decoded by your browser (unsupported or corrupted image)."));
    };
    img.src = url;
  });

/** Reads intrinsic size of an SVG so it rasterises sharply instead of at 150×150. */
const svgIntrinsicSize = async (file: File | Blob) => {
  try {
    const text = await file.text();
    const doc = new DOMParser().parseFromString(text, "image/svg+xml");
    const svg = doc.documentElement;
    const num = (v: string | null) => {
      if (!v) return 0;
      const m = parseFloat(v);
      return Number.isFinite(m) ? m : 0;
    };
    let w = num(svg.getAttribute("width"));
    let h = num(svg.getAttribute("height"));
    if (!w || !h) {
      const vb = (svg.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
      if (vb.length === 4 && vb[2] && vb[3]) {
        w = w || vb[2];
        h = h || vb[3];
      }
    }
    return w && h ? { width: w, height: h } : null;
  } catch {
    return null;
  }
};

const hasTransparency = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return false;
  // Sample a grid instead of every pixel to stay fast on huge images.
  const step = Math.max(1, Math.floor(Math.min(canvas.width, canvas.height) / 64));
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4 + 3] < 255) return true;
    }
  }
  return false;
};

/** Decodes any browser-supported image, honouring EXIF orientation. */
export const decodeImageFile = async (file: File | Blob): Promise<DecodedImage> => {
  const isSvg = file.type === "image/svg+xml" || (file as File).name?.toLowerCase().endsWith(".svg");

  let canvas: HTMLCanvasElement;
  if (isSvg) {
    const size = await svgIntrinsicSize(file);
    const img = await loadViaImgElement(file);
    const w = size?.width || img.naturalWidth || 1024;
    const h = size?.height || img.naturalHeight || 1024;
    // Rasterise SVG at a minimum of 1024px on the long edge for crisp output.
    const scale = Math.max(1, Math.min(4, 1024 / Math.max(w, h)));
    canvas = drawToCanvas(img, w * scale, h * scale);
  } else if (typeof createImageBitmap === "function") {
    try {
      // imageOrientation:'from-image' applies EXIF rotation so portrait photos stay upright.
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      canvas = drawToCanvas(bitmap, bitmap.width, bitmap.height);
      bitmap.close?.();
    } catch {
      const img = await loadViaImgElement(file);
      canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
    }
  } else {
    const img = await loadViaImgElement(file);
    canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
  }

  return {
    canvas,
    width: canvas.width,
    height: canvas.height,
    hasAlpha: hasTransparency(canvas),
  };
};

/* ------------------------------------------------------------------ *
 * Resampling
 * ------------------------------------------------------------------ */

export type FitMode = "stretch" | "contain" | "cover";

export interface ResizeOptions {
  width: number;
  height: number;
  fit?: FitMode;
  background?: string; // used by "contain" padding and when flattening alpha
  highQuality?: boolean;
}

const stepResize = (source: HTMLCanvasElement, width: number, height: number) => {
  let current = source;
  // Progressive halving keeps detail on large downscales (browser bilinear alone aliases).
  while (current.width / 2 >= width && current.height / 2 >= height && current.width > 2 && current.height > 2) {
    current = drawSmooth(current, Math.max(width, Math.floor(current.width / 2)), Math.max(height, Math.floor(current.height / 2)));
  }
  return drawSmooth(current, width, height);
};

const drawSmooth = (source: HTMLCanvasElement, width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
};

const lanczosKernel = (x: number, a = 3) => {
  if (x === 0) return 1;
  const ax = Math.abs(x);
  if (ax >= a) return 0;
  const px = Math.PI * ax;
  return (a * Math.sin(px) * Math.sin(px / a)) / (px * px);
};

/** Separable Lanczos3 resample — used when upscaling or for the final precision pass. */
const resampleHorizontal = (
  input: Uint8ClampedArray,
  inW: number,
  inH: number,
  outW: number,
) => {
  const ratio = inW / outW;
  const scale = Math.max(1, ratio);
  const support = scale * 3;
  const out = new Uint8ClampedArray(outW * inH * 4);

  // Precompute weights per output column (separable filter).
  const taps: { start: number; weights: Float32Array }[] = [];
  for (let o = 0; o < outW; o++) {
    const center = (o + 0.5) * ratio - 0.5;
    const start = Math.max(0, Math.ceil(center - support));
    const end = Math.min(inW - 1, Math.floor(center + support));
    const weights = new Float32Array(Math.max(0, end - start + 1));
    let total = 0;
    for (let i = start; i <= end; i++) {
      const w = lanczosKernel((i - center) / scale);
      weights[i - start] = w;
      total += w;
    }
    if (total) for (let i = 0; i < weights.length; i++) weights[i] /= total;
    taps.push({ start, weights });
  }

  for (let row = 0; row < inH; row++) {
    const rowOffset = row * inW * 4;
    const outOffset = row * outW * 4;
    for (let o = 0; o < outW; o++) {
      const { start, weights } = taps[o];
      let r = 0, g = 0, b = 0, a = 0;
      for (let k = 0; k < weights.length; k++) {
        const idx = rowOffset + (start + k) * 4;
        const w = weights[k];
        const alpha = input[idx + 3];
        // Premultiply so transparent pixels don't bleed colour.
        r += input[idx] * alpha * w;
        g += input[idx + 1] * alpha * w;
        b += input[idx + 2] * alpha * w;
        a += alpha * w;
      }
      const oIdx = outOffset + o * 4;
      const safeA = a || 1;
      out[oIdx] = r / safeA;
      out[oIdx + 1] = g / safeA;
      out[oIdx + 2] = b / safeA;
      out[oIdx + 3] = a;
    }
  }
  return out;
};

const transpose = (input: Uint8ClampedArray, w: number, h: number) => {
  const out = new Uint8ClampedArray(input.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const from = (y * w + x) * 4;
      const to = (x * h + y) * 4;
      out[to] = input[from];
      out[to + 1] = input[from + 1];
      out[to + 2] = input[from + 2];
      out[to + 3] = input[from + 3];
    }
  }
  return out;
};

/** Separable Lanczos3 resample — sharper than the browser's bilinear scaler. */
const lanczosResize = (source: HTMLCanvasElement, width: number, height: number) => {
  const sctx = source.getContext("2d", { willReadFrequently: true })!;
  const src = sctx.getImageData(0, 0, source.width, source.height);

  // Horizontal pass -> width × srcH
  const horizontal = resampleHorizontal(src.data, source.width, source.height, width);
  // Transpose -> srcH × width, resample rows (original columns) -> height × width
  const transposed = transpose(horizontal, width, source.height);
  const vertical = resampleHorizontal(transposed, source.height, width, height);
  // Transpose back -> width × height
  const final = transpose(vertical, height, width);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(final.subarray(0, width * height * 4));
  ctx.putImageData(imageData, 0, 0);
  return canvas;

};

export const resizeCanvas = (source: HTMLCanvasElement, options: ResizeOptions): HTMLCanvasElement => {
  const targetW = Math.max(1, Math.round(options.width));
  const targetH = Math.max(1, Math.round(options.height));
  const fit = options.fit || "stretch";

  if (targetW === source.width && targetH === source.height && fit !== "contain") return source;

  const pixels = targetW * targetH;
  const useLanczos = options.highQuality !== false && pixels <= 16_000_000 && source.width * source.height <= 40_000_000;

  const scaleTo = (w: number, h: number) => {
    const downscaling = w < source.width || h < source.height;
    if (!useLanczos) return stepResize(source, w, h);
    if (!downscaling) return lanczosResize(source, w, h);
    // Halve with the GPU scaler until close to target, then Lanczos for the final step.
    let pre = source;
    while (pre.width / 2 >= w && pre.height / 2 >= h && pre.width > 2 && pre.height > 2) {
      pre = drawSmooth(pre, Math.max(w, Math.floor(pre.width / 2)), Math.max(h, Math.floor(pre.height / 2)));
    }
    return pre.width === w && pre.height === h ? pre : lanczosResize(pre, w, h);
  };


  if (fit === "stretch") return scaleTo(targetW, targetH);

  const ratio = fit === "contain"
    ? Math.min(targetW / source.width, targetH / source.height)
    : Math.max(targetW / source.width, targetH / source.height);
  const innerW = Math.max(1, Math.round(source.width * ratio));
  const innerH = Math.max(1, Math.round(source.height * ratio));
  const scaled = scaleTo(innerW, innerH);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;
  if (fit === "contain" && options.background && options.background !== "transparent") {
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.drawImage(scaled, Math.round((targetW - innerW) / 2), Math.round((targetH - innerH) / 2));
  return canvas;
};

/** Flattens transparency onto a solid colour (needed for JPEG/BMP). */
export const flatten = (source: HTMLCanvasElement, background = "#FFFFFF") => {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0);
  return canvas;
};

/* ------------------------------------------------------------------ *
 * Encoders for formats the canvas cannot export
 * ------------------------------------------------------------------ */

const getPixels = (canvas: HTMLCanvasElement) =>
  canvas.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, canvas.width, canvas.height);

/** True 24-bit BMP (BITMAPINFOHEADER, bottom-up, row padded to 4 bytes). */
export const encodeBMP = (canvas: HTMLCanvasElement): Blob => {
  const { width, height, data } = getPixels(canvas);
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint8(0, 0x42); view.setUint8(1, 0x4d); // "BM"
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, pixelArraySize, true);
  view.setInt32(38, 2835, true);
  view.setInt32(42, 2835, true);

  for (let y = 0; y < height; y++) {
    const srcRow = (height - 1 - y) * width * 4;
    let dst = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      const i = srcRow + x * 4;
      bytes[dst++] = data[i + 2];
      bytes[dst++] = data[i + 1];
      bytes[dst++] = data[i];
    }
  }
  return new Blob([buffer], { type: "image/bmp" });
};

/** Baseline uncompressed RGBA TIFF (little-endian, single strip). */
export const encodeTIFF = (canvas: HTMLCanvasElement): Blob => {
  const { width, height, data } = getPixels(canvas);
  const entries = 12;
  const headerSize = 8;
  const ifdSize = 2 + entries * 12 + 4;
  const extraSize = 4 * 2 /* bitsPerSample */ + 8 /* xres */ + 8 /* yres */;
  const pixelOffset = headerSize + ifdSize + extraSize;
  const pixelSize = width * height * 4;
  const buffer = new ArrayBuffer(pixelOffset + pixelSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint16(0, 0x4949, true); // little-endian
  view.setUint16(2, 42, true);
  view.setUint32(4, headerSize, true);

  let off = headerSize;
  view.setUint16(off, entries, true);
  off += 2;
  const bitsOffset = headerSize + ifdSize;
  const xresOffset = bitsOffset + 8;
  const yresOffset = xresOffset + 8;

  const entry = (tag: number, type: number, count: number, value: number) => {
    view.setUint16(off, tag, true);
    view.setUint16(off + 2, type, true);
    view.setUint32(off + 4, count, true);
    if (type === 3 && count === 1) {
      view.setUint16(off + 8, value, true);
      view.setUint16(off + 10, 0, true);
    } else {
      view.setUint32(off + 8, value, true);
    }
    off += 12;
  };

  entry(256, 3, 1, width);            // ImageWidth
  entry(257, 3, 1, height);           // ImageLength
  entry(258, 3, 4, bitsOffset);       // BitsPerSample 8,8,8,8
  entry(259, 3, 1, 1);                // Compression: none
  entry(262, 3, 1, 2);                // PhotometricInterpretation: RGB
  entry(273, 4, 1, pixelOffset);      // StripOffsets
  entry(277, 3, 1, 4);                // SamplesPerPixel
  entry(278, 4, 1, height);           // RowsPerStrip
  entry(279, 4, 1, pixelSize);        // StripByteCounts
  entry(282, 5, 1, xresOffset);       // XResolution
  entry(283, 5, 1, yresOffset);       // YResolution
  entry(338, 3, 1, 2);                // ExtraSamples: unassociated alpha
  view.setUint32(off, 0, true);       // next IFD

  for (let i = 0; i < 4; i++) view.setUint16(bitsOffset + i * 2, 8, true);
  view.setUint32(xresOffset, 72, true); view.setUint32(xresOffset + 4, 1, true);
  view.setUint32(yresOffset, 72, true); view.setUint32(yresOffset + 4, 1, true);

  bytes.set(data, pixelOffset);
  return new Blob([buffer], { type: "image/tiff" });
};

/* ---------- GIF ---------- */

/** Single-frame GIF with a 256-colour quantised palette and alpha support. */
export const encodeGIF = async (canvas: HTMLCanvasElement): Promise<Blob> => {
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
  const { width, height, data } = getPixels(canvas);
  const rgba = new Uint8Array(data.buffer.slice(0));
  const palette = quantize(rgba, 256, { format: "rgba4444" });
  const index = applyPalette(rgba, palette, "rgba4444");
  const encoder = GIFEncoder();
  // Transparency: gifenc marks fully transparent palette entries when told the index.
  const transparentIndex = palette.findIndex((c: number[]) => (c[3] ?? 255) < 128);
  encoder.writeFrame(index, width, height, {
    palette,
    transparent: transparentIndex >= 0,
    transparentIndex: transparentIndex >= 0 ? transparentIndex : 0,
  });
  encoder.finish();
  return new Blob([encoder.bytes()], { type: "image/gif" });
};


/** Multi-resolution ICO with 32-bit BGRA entries (Windows compatible). */
export const encodeICO = (source: HTMLCanvasElement, sizes: number[]): Blob => {
  const unique = Array.from(new Set(sizes.filter((s) => s > 0 && s <= 256))).sort((a, b) => a - b);
  const images = unique.map((size) => {
    const c = resizeCanvas(source, { width: size, height: size, fit: "contain", background: "transparent" });
    const { data } = getPixels(c);
    const rowMask = Math.ceil(size / 32) * 4;
    const maskSize = rowMask * size;
    const pixelSize = size * size * 4;
    const body = new Uint8Array(40 + pixelSize + maskSize);
    const view = new DataView(body.buffer);
    view.setUint32(0, 40, true);
    view.setInt32(4, size, true);
    view.setInt32(8, size * 2, true);
    view.setUint16(12, 1, true);
    view.setUint16(14, 32, true);
    view.setUint32(16, 0, true);
    view.setUint32(20, pixelSize + maskSize, true);
    for (let y = 0; y < size; y++) {
      const src = (size - 1 - y) * size * 4;
      let dst = 40 + y * size * 4;
      for (let x = 0; x < size; x++) {
        const i = src + x * 4;
        body[dst++] = data[i + 2];
        body[dst++] = data[i + 1];
        body[dst++] = data[i];
        body[dst++] = data[i + 3];
      }
    }
    return { size, body };
  });

  const headerSize = 6 + images.length * 16;
  const totalSize = headerSize + images.reduce((s, i) => s + i.body.length, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);

  let offset = headerSize;
  images.forEach((img, index) => {
    const e = 6 + index * 16;
    view.setUint8(e, img.size >= 256 ? 0 : img.size);
    view.setUint8(e + 1, img.size >= 256 ? 0 : img.size);
    view.setUint8(e + 2, 0);
    view.setUint8(e + 3, 0);
    view.setUint16(e + 4, 1, true);
    view.setUint16(e + 6, 32, true);
    view.setUint32(e + 8, img.body.length, true);
    view.setUint32(e + 12, offset, true);
    bytes.set(img.body, offset);
    offset += img.body.length;
  });

  return new Blob([buffer], { type: "image/x-icon" });
};

export const encodeSVG = (canvas: HTMLCanvasElement): Blob => {
  const dataUrl = canvas.toDataURL("image/png");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" xlink:href="${dataUrl}"/>
</svg>`;
  return new Blob([svg], { type: "image/svg+xml" });
};

/* ------------------------------------------------------------------ *
 * Unified encode
 * ------------------------------------------------------------------ */

export interface EncodeOptions {
  format: ImageFormat;
  quality?: number;        // 1-100, lossy formats only
  background?: string;     // flatten colour for JPEG/BMP
  icoSizes?: number[];
}

export interface EncodeResult {
  blob: Blob;
  format: ImageFormat;
  note?: string;
}

export const encodeCanvas = async (
  input: HTMLCanvasElement,
  options: EncodeOptions,
): Promise<EncodeResult> => {
  const info = getFormat(options.format);
  if (!info) throw new Error("Unsupported target format.");
  const quality = Math.min(1, Math.max(0.05, (options.quality ?? 90) / 100));
  const canvas = info.alpha ? input : flatten(input, options.background || "#FFFFFF");

  switch (options.format) {
    case "bmp":
      return { blob: encodeBMP(canvas), format: "bmp" };
    case "tiff":
      return { blob: encodeTIFF(canvas), format: "tiff" };
    case "gif":
      return { blob: await encodeGIF(canvas), format: "gif" };
    case "ico":
      return { blob: encodeICO(canvas, options.icoSizes?.length ? options.icoSizes : [256, 128, 64, 48, 32, 16]), format: "ico" };
    case "svg":
      return { blob: encodeSVG(canvas), format: "svg" };
    default: {
      const supported = await canEncode(info.mimeType);
      if (!supported) {
        // Never silently mislabel: fall back to PNG and say so.
        const png = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
        if (!png) throw new Error("Encoding failed in this browser.");
        return {
          blob: png,
          format: "png",
          note: `${info.label} encoding isn't supported by this browser — saved as PNG instead.`,
        };
      }
      const blob = await new Promise<Blob | null>((r) =>
        canvas.toBlob(r, info.mimeType, info.lossy ? quality : undefined),
      );
      if (!blob) throw new Error("Encoding failed in this browser.");
      return { blob, format: options.format };
    }
  }
};

/** Binary-searches encoder quality to land under a target file size. */
export const encodeToTargetSize = async (
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  targetBytes: number,
  background?: string,
): Promise<EncodeResult> => {
  let low = 5;
  let high = 100;
  let best: EncodeResult | null = null;
  for (let i = 0; i < 8 && low <= high; i++) {
    const mid = Math.round((low + high) / 2);
    const result = await encodeCanvas(canvas, { format, quality: mid, background });
    if (result.blob.size <= targetBytes) {
      best = result;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best || encodeCanvas(canvas, { format, quality: 5, background });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};

export const downloadAsZip = async (
  files: { name: string; blob: Blob }[],
  zipName: string,
) => {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const used = new Set<string>();
  files.forEach(({ name, blob }) => {
    let unique = name;
    let n = 1;
    while (used.has(unique)) {
      const dot = name.lastIndexOf(".");
      unique = `${name.slice(0, dot)}_${n++}${name.slice(dot)}`;
    }
    used.add(unique);
    zip.file(unique, blob);
  });
  const content = await zip.generateAsync({ type: "blob" });
  downloadBlob(content, zipName);
};
