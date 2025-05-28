
// Simple background removal utility using canvas manipulation
// This is a basic implementation that can be enhanced with API integration

export const removeBackground = async (imageElement: HTMLImageElement, apiKey?: string): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');
    
    if (apiKey) {
      // Use API-based background removal (placeholder for actual API)
      return await removeBackgroundWithAPI(imageElement, apiKey);
    } else {
      // Use basic canvas-based background removal as fallback
      return await removeBackgroundBasic(imageElement);
    }
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

const removeBackgroundWithAPI = async (imageElement: HTMLImageElement, apiKey: string): Promise<Blob> => {
  try {
    // Convert image to blob first
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to convert image to blob'));
          return;
        }
        
        try {
          const formData = new FormData();
          formData.append('image_file', blob);
          
          // Example API call - replace with your actual API endpoint
          const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
              'X-Api-Key': apiKey,
            },
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
          }
          
          const resultBlob = await response.blob();
          resolve(resultBlob);
        } catch (error) {
          console.error('API background removal failed:', error);
          // Fallback to basic method
          const fallbackResult = await removeBackgroundBasic(imageElement);
          resolve(fallbackResult);
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error in API background removal:', error);
    throw error;
  }
};

const removeBackgroundBasic = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Using basic background removal method');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    ctx.drawImage(imageElement, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simple background removal based on edge detection and color similarity
    // This is a basic algorithm - you can enhance it based on your needs
    const backgroundColor = getBackgroundColor(data, canvas.width, canvas.height);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate color difference from background
      const colorDiff = Math.sqrt(
        Math.pow(r - backgroundColor.r, 2) +
        Math.pow(g - backgroundColor.g, 2) +
        Math.pow(b - backgroundColor.b, 2)
      );
      
      // If color is similar to background, make it transparent
      if (colorDiff < 50) { // Threshold can be adjusted
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
    
    // Put the modified image data back
    ctx.putImageData(imageData, 0, 0);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error in basic background removal:', error);
    throw error;
  }
};

const getBackgroundColor = (data: Uint8ClampedArray, width: number, height: number) => {
  // Sample corners to determine background color
  const corners = [
    { x: 0, y: 0 }, // Top-left
    { x: width - 1, y: 0 }, // Top-right
    { x: 0, y: height - 1 }, // Bottom-left
    { x: width - 1, y: height - 1 }, // Bottom-right
  ];
  
  let totalR = 0, totalG = 0, totalB = 0;
  
  corners.forEach(corner => {
    const index = (corner.y * width + corner.x) * 4;
    totalR += data[index];
    totalG += data[index + 1];
    totalB += data[index + 2];
  });
  
  return {
    r: Math.round(totalR / corners.length),
    g: Math.round(totalG / corners.length),
    b: Math.round(totalB / corners.length),
  };
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
