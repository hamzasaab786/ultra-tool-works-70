
import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024; // Increased for better quality

// Model configurations for different use cases
const MODELS = {
  fast: 'Xenova/modnet', // Fast model for quick processing
  balanced: 'Xenova/u2net', // Balanced speed and quality
  accurate: 'Xenova/rembg-new' // Best quality but slower
};

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

function preprocessImage(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Enhance contrast and reduce noise
  for (let i = 0; i < data.length; i += 4) {
    // Simple contrast enhancement
    data[i] = Math.min(255, data[i] * 1.1);     // Red
    data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
    data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function refineEdges(outputImageData: ImageData) {
  const data = outputImageData.data;
  const width = outputImageData.width;
  const height = outputImageData.height;
  
  // Simple edge refinement
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3];
      
      if (alpha > 0 && alpha < 255) {
        // Smooth semi-transparent edges
        const neighbors = [
          data[((y - 1) * width + x) * 4 + 3],
          data[((y + 1) * width + x) * 4 + 3],
          data[(y * width + (x - 1)) * 4 + 3],
          data[(y * width + (x + 1)) * 4 + 3]
        ];
        
        const avgAlpha = neighbors.reduce((sum, a) => sum + a, 0) / 4;
        data[idx + 3] = Math.round((alpha + avgAlpha) / 2);
      }
    }
  }
}

export const removeBackground = async (
  imageElement: HTMLImageElement, 
  onProgress?: (progress: number) => void,
  backgroundColor?: string,
  gradientStart?: string,
  gradientEnd?: string,
  isGradient?: boolean,
  modelQuality: 'fast' | 'balanced' | 'accurate' = 'balanced'
): Promise<Blob> => {
  try {
    console.log('Starting professional background removal...');
    onProgress?.(5);
    
    // Try WebGPU first, fallback to WASM
    let device = 'webgpu';
    let segmenter;
    
    try {
      segmenter = await pipeline('image-segmentation', MODELS[modelQuality], {
        device: 'webgpu',
      });
      console.log('Using WebGPU acceleration');
    } catch (error) {
      console.log('WebGPU not available, using WASM...');
      device = 'wasm';
      segmenter = await pipeline('image-segmentation', MODELS[modelQuality], {
        device: 'wasm',
      });
    }
    
    onProgress?.(25);
    
    return await processWithAdvancedSegmenter(segmenter, imageElement, onProgress, backgroundColor, gradientStart, gradientEnd, isGradient);
  } catch (error) {
    console.error('Error removing background:', error);
    throw new Error(`Failed to remove background: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

async function processWithAdvancedSegmenter(
  segmenter: any, 
  imageElement: HTMLImageElement, 
  onProgress?: (progress: number) => void,
  backgroundColor?: string,
  gradientStart?: string,
  gradientEnd?: string,
  isGradient?: boolean
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
  console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
  
  // Preprocess image for better results
  preprocessImage(canvas, ctx);
  onProgress?.(40);
  
  const imageData = canvas.toDataURL('image/jpeg', 0.9);
  console.log('Image preprocessed and converted');
  
  console.log('Processing with advanced segmentation...');
  onProgress?.(60);
  
  const result = await segmenter(imageData);
  
  console.log('Advanced segmentation complete');
  onProgress?.(80);
  
  if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
    throw new Error('Invalid segmentation result');
  }
  
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = imageElement.naturalWidth;
  outputCanvas.height = imageElement.naturalHeight;
  const outputCtx = outputCanvas.getContext('2d');
  
  if (!outputCtx) throw new Error('Could not get output canvas context');
  
  // Apply background if specified
  if (backgroundColor && backgroundColor !== 'transparent') {
    if (isGradient && gradientStart && gradientEnd) {
      const gradient = outputCtx.createLinearGradient(0, 0, outputCanvas.width, outputCanvas.height);
      gradient.addColorStop(0, gradientStart);
      gradient.addColorStop(1, gradientEnd);
      outputCtx.fillStyle = gradient;
    } else {
      outputCtx.fillStyle = backgroundColor;
    }
    outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
  }
  
  // Scale mask to original image size
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  const maskCtx = maskCanvas.getContext('2d');
  
  if (!maskCtx) throw new Error('Could not get mask canvas context');
  
  const maskImageData = maskCtx.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < result[0].mask.data.length; i++) {
    const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
    maskImageData.data[i * 4] = 255;
    maskImageData.data[i * 4 + 1] = 255;
    maskImageData.data[i * 4 + 2] = 255;
    maskImageData.data[i * 4 + 3] = alpha;
  }
  
  // Apply edge refinement
  refineEdges(maskImageData);
  maskCtx.putImageData(maskImageData, 0, 0);
  
  // Create composite image
  outputCtx.drawImage(imageElement, 0, 0);
  outputCtx.globalCompositeOperation = 'destination-in';
  outputCtx.drawImage(maskCanvas, 0, 0, outputCanvas.width, outputCanvas.height);
  
  console.log('Professional background processing complete');
  onProgress?.(95);
  
  return new Promise((resolve, reject) => {
    outputCanvas.toBlob(
      (blob) => {
        if (blob) {
          console.log('Successfully created professional result');
          onProgress?.(100);
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => {
      console.error('Failed to load image:', error);
      reject(new Error('Failed to load image. Please ensure the file is a valid image.'));
    };
    img.src = URL.createObjectURL(file);
  });
};

export const processBatch = async (
  files: FileList,
  onProgress?: (progress: number) => void,
  onFileComplete?: (fileName: string, result: Blob) => void,
  backgroundColor?: string,
  gradientStart?: string,
  gradientEnd?: string,
  isGradient?: boolean,
  modelQuality: 'fast' | 'balanced' | 'accurate' = 'balanced'
): Promise<Blob[]> => {
  const results: Blob[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const imageElement = await loadImage(file);
      const result = await removeBackground(
        imageElement,
        (fileProgress) => {
          const totalProgress = ((i / files.length) * 100) + (fileProgress / files.length);
          onProgress?.(totalProgress);
        },
        backgroundColor,
        gradientStart,
        gradientEnd,
        isGradient,
        modelQuality
      );
      
      results.push(result);
      onFileComplete?.(file.name, result);
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
    }
  }
  
  return results;
};
