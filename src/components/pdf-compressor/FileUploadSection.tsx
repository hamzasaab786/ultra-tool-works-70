
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import DragDropUpload from '@/components/DragDropUpload';

interface FileUploadSectionProps {
  onFilesSelected: (files: FileList) => void;
  isProcessing: boolean;
  progress: number;
}

const FileUploadSection = ({ onFilesSelected, isProcessing, progress }: FileUploadSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload PDF Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropUpload
          onFilesSelected={onFilesSelected}
          isProcessing={isProcessing}
          progress={progress}
          maxFiles={20}
          acceptedFileTypes="pdf"
        />
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
