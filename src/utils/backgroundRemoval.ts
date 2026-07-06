
export const removeBackground = async (
  imageElement: HTMLImageElement, 
  onProgress?: (progress: number) => void,
  backgroundColor?: string,
  gradientStart?: string,
  gradientEnd?: string,
  isGradient?: boolean
): Promise<Blob> => {
  try {
    console.log('Starting background removal...');
    onProgress?.(10);
    
    // Convert image to base64
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);
    
    onProgress?.(20);
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 0.9);
    });
    
    onProgress?.(30);
    
    // Prepare form data
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    
    // Set background color
    let bgColor = '(255,255,255,0)'; // transparent by default
    if (backgroundColor && backgroundColor !== 'transparent') {
      const source = (isGradient && gradientStart) ? gradientStart : backgroundColor;
      const hex = source.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      bgColor = `(${r},${g},${b},255)`;
    }

    formData.append('bgcolor', bgColor);

    onProgress?.(50);

    // Route through secure edge function (no API key in client bundle)
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: fnData, error: fnError } = await supabase.functions.invoke('remove-background', {
      body: formData,
    });

    onProgress?.(80);

    if (fnError) throw new Error(fnError.message || 'Background removal failed');

    // supabase.functions.invoke returns Blob for binary responses
    const resultBlob: Blob = fnData instanceof Blob
      ? fnData
      : new Blob([fnData as ArrayBuffer], { type: 'image/png' });
    
    onProgress?.(95);
    
    // If gradient is needed and we have a transparent background, apply gradient
    if (isGradient && backgroundColor === 'transparent' && gradientStart && gradientEnd) {
      const finalBlob = await applyGradientBackground(resultBlob, gradientStart, gradientEnd);
      onProgress?.(100);
      return finalBlob;
    }
    
    console.log('Background removal complete');
    onProgress?.(100);
    return resultBlob;
    
  } catch (error) {
    console.error('Error removing background:', error);
    throw new Error(`Failed to remove background: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const applyGradientBackground = async (
  imageBlob: Blob, 
  gradientStart: string, 
  gradientEnd: string
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, gradientStart);
      gradient.addColorStop(1, gradientEnd);
      
      // Fill background with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the processed image on top
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load processed image'));
    img.src = URL.createObjectURL(imageBlob);
  });
};

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
  isGradient?: boolean
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
        isGradient
      );
      
      results.push(result);
      onFileComplete?.(file.name, result);
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
    }
  }
  
  return results;
};
