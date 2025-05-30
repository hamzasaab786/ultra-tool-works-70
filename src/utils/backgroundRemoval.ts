
import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 512; // Reduced for faster processing

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

export const removeBackground = async (
  imageElement: HTMLImageElement, 
  onProgress?: (progress: number) => void,
  backgroundColor?: string,
  gradientStart?: string,
  gradientEnd?: string,
  isGradient?: boolean
): Promise<Blob> => {
  try {
    console.log('Starting optimized background removal...');
    onProgress?.(10);
    
    // Use a faster, lighter model
    let segmenter;
    try {
      segmenter = await pipeline('image-segmentation', 'Xenova/detr-resnet-50-panoptic', {
        device: 'wasm', // Use WASM for better compatibility and speed
      });
      console.log('Fast model loaded successfully');
    } catch (error) {
      console.log('Fast model failed, using fallback...');
      segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
        device: 'wasm',
      });
    }
    
    onProgress?.(30);
    
    return await processWithSegmenter(segmenter, imageElement, onProgress, backgroundColor, gradientStart, gradientEnd, isGradient);
  } catch (error) {
    console.error('Error removing background:', error);
    throw new Error(`Failed to remove background: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

async function processWithSegmenter(
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
  onProgress?.(50);
  
  const imageData = canvas.toDataURL('image/jpeg', 0.7); // Lower quality for speed
  console.log('Image converted to base64');
  
  console.log('Processing with fast segmentation model...');
  onProgress?.(70);
  
  const result = await segmenter(imageData);
  
  console.log('Segmentation complete');
  onProgress?.(85);
  
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
  maskCtx.putImageData(maskImageData, 0, 0);
  
  // Create composite image
  outputCtx.drawImage(imageElement, 0, 0);
  outputCtx.globalCompositeOperation = 'destination-in';
  outputCtx.drawImage(maskCanvas, 0, 0, outputCanvas.width, outputCanvas.height);
  
  console.log('Background processing complete');
  onProgress?.(95);
  
  return new Promise((resolve, reject) => {
    outputCanvas.toBlob(
      (blob) => {
        if (blob) {
          console.log('Successfully created final blob');
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
