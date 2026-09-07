
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isPdfFile = (file: File): boolean =>
  file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

export const isImageFile = (file: File): boolean =>
  file.type.startsWith('image/') ||
  /\.(png|jpe?g|webp|bmp|gif|avif|tiff?|heic|svg)$/i.test(file.name);

export const validatePdfFile = (file: File): { isValid: boolean; error?: string } => {
  if (!isPdfFile(file)) {
    return {
      isValid: false,
      error: "Please select a valid PDF file"
    };
  }


  if (file.size > 100 * 1024 * 1024) { // 100MB limit
    return {
      isValid: false,
      error: "File size too large. Please select a file smaller than 100MB"
    };
  }

  return { isValid: true };
};
