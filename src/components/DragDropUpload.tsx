
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DragDropUploadProps {
  onFilesSelected: (files: FileList) => void;
  isProcessing?: boolean;
  progress?: number;
  maxFiles?: number;
  className?: string;
  acceptedFileTypes?: 'images' | 'pdf' | 'all';
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFilesSelected,
  isProcessing = false,
  progress = 0,
  maxFiles = 10,
  className,
  acceptedFileTypes = 'images'
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const isMobile = useIsMobile();

  const getAcceptedFiles = () => {
    switch (acceptedFileTypes) {
      case 'pdf':
        return {
          'application/pdf': ['.pdf'],
          'application/octet-stream': ['.pdf'],
        };
      case 'images':
        return { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif'] };
      case 'all':
        return {
          'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif'],
          'application/pdf': ['.pdf'],
          'application/octet-stream': ['.pdf'],
        };
      default:
        return { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif'] };
    }
  };

  const filterFiles = (files: File[]) => {
    switch (acceptedFileTypes) {
      case 'pdf':
        return files.filter(isPdfFile);
      case 'images':
        return files.filter(isImageFile);
      case 'all':
        return files.filter(file => isImageFile(file) || isPdfFile(file));
      default:
        return files.filter(isImageFile);
    }
  };


  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filteredFiles = filterFiles(acceptedFiles);
    const limitedFiles = filteredFiles.slice(0, maxFiles);
    
    setSelectedFiles(limitedFiles);
    
    // Create proper FileList from File array
    const dt = new DataTransfer();
    limitedFiles.forEach(file => dt.items.add(file));
    const fileList = dt.files;
    
    onFilesSelected(fileList);
  }, [onFilesSelected, maxFiles, acceptedFileTypes]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: getAcceptedFiles(),
    maxFiles,
    disabled: isProcessing
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    if (newFiles.length === 0) {
      const dt = new DataTransfer();
      const emptyFileList = dt.files;
      onFilesSelected(emptyFileList);
    } else {
      const dt = new DataTransfer();
      newFiles.forEach(file => dt.items.add(file));
      const fileList = dt.files;
      onFilesSelected(fileList);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-600 flex-shrink-0" />;
    }
    return <FileImage className="h-5 w-5 text-blue-600 flex-shrink-0" />;
  };

  const getUploadText = () => {
    if (isDragActive) {
      return isDragReject ? "Some files are not supported" : `Drop your ${acceptedFileTypes === 'pdf' ? 'PDF files' : acceptedFileTypes === 'images' ? 'images' : 'files'} here`;
    }
    
    if (acceptedFileTypes === 'pdf') {
      return isMobile ? "Tap to select PDF files" : "Drag & drop PDF files here, or click to browse";
    } else if (acceptedFileTypes === 'images') {
      return isMobile ? "Tap to select images" : "Drag & drop images here, or click to browse";
    }
    return isMobile ? "Tap to select files" : "Drag & drop files here, or click to browse";
  };

  const getFileTypeText = () => {
    if (acceptedFileTypes === 'pdf') {
      return isMobile ? `Up to ${maxFiles} PDF files` : `Supports PDF • Up to ${maxFiles} files`;
    } else if (acceptedFileTypes === 'images') {
      return isMobile ? `Up to ${maxFiles} images` : `Supports PNG, JPG, WebP • Up to ${maxFiles} images`;
    }
    return isMobile ? `Up to ${maxFiles} files` : `Supports PDF, PNG, JPG, WebP • Up to ${maxFiles} files`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer",
          "min-h-[200px] flex flex-col items-center justify-center",
          isDragActive && !isDragReject && "border-blue-500 bg-blue-50/50",
          isDragReject && "border-red-500 bg-red-50/50",
          !isDragActive && "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30",
          isProcessing && "pointer-events-none opacity-60",
          isMobile && "min-h-[150px] p-4"
        )}
      >
        <input {...getInputProps()} />
        
        <div className={cn(
          "flex flex-col items-center space-y-3",
          isMobile && "space-y-2"
        )}>
          <div className={cn(
            "p-3 rounded-full bg-blue-100",
            isMobile && "p-2"
          )}>
            <Upload className={cn(
              "text-blue-600",
              isMobile ? "h-6 w-6" : "h-8 w-8"
            )} />
          </div>
          
          <div className="space-y-1">
            <p className={cn(
              "font-medium text-gray-700",
              isMobile ? "text-sm" : "text-base"
            )}>
              {getUploadText()}
            </p>
            <p className={cn(
              "text-gray-500",
              isMobile ? "text-xs" : "text-sm"
            )}>
              {getFileTypeText()}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className={cn(
            "font-medium text-gray-700",
            isMobile ? "text-sm" : "text-base"
          )}>
            Selected {acceptedFileTypes === 'pdf' ? 'PDF Files' : acceptedFileTypes === 'images' ? 'Images' : 'Files'} ({selectedFiles.length})
          </h4>
          
          <div className={cn(
            "grid gap-2",
            isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
          )}>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0 hover:bg-red-100"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Progress */}
      {isProcessing && selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Processing {acceptedFileTypes === 'pdf' ? 'PDF files' : acceptedFileTypes === 'images' ? 'images' : 'files'}...</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
