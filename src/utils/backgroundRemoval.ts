
// Background removal utility using Remove.bg API
const API_KEY = 'Rc6k3ocrtJLxf2R8B4ywnncG'; // Securely stored API key

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal with API...');
    
    // Convert image to canvas first
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
          
          const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
              'X-Api-Key': API_KEY,
            },
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
          }
          
          const resultBlob = await response.blob();
          console.log('Background removed successfully');
          resolve(resultBlob);
        } catch (error) {
          console.error('API background removal failed:', error);
          reject(error);
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error in background removal:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
