
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Trash2, 
  Archive,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  Zap
} from 'lucide-react';
import { ProcessedFile } from '@/types/pdfCompressor';

interface FileListProps {
  files: ProcessedFile[];
  isProcessing: boolean;
  progress: number;
  formatFileSize: (bytes: number) => string;
  onClearAllFiles: () => void;
  onDownloadAllFiles: () => void;
  onDownloadFile: (file: ProcessedFile) => void;
  onRemoveFile: (fileId: string) => void;
}

const FileList = ({ 
  files, 
  isProcessing, 
  progress, 
  formatFileSize,
  onClearAllFiles,
  onDownloadAllFiles,
  onDownloadFile,
  onRemoveFile
}: FileListProps) => {
  const getStatusIcon = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'pending':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'analyzing':
        return <Eye className="h-4 w-4 text-purple-500 animate-pulse" />;
      case 'processing':
        return <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  if (files.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Files ({files.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAllFiles}
              disabled={isProcessing}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            {files.some(f => f.status === 'completed') && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadAllFiles}
              >
                <Archive className="h-4 w-4 mr-2" />
                Download All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(file.status)}
                  <div>
                    <span className="font-medium">{file.name}</span>
                    {file.analysis && (
                      <div className="text-sm text-gray-500">
                        {file.analysis.pageCount} pages • {formatFileSize(file.originalSize)}
                        {file.analysis.estimatedCompression > 0 && (
                          <> • Est. {file.analysis.estimatedCompression}% reduction</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownloadFile(file)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(file.id)}
                    disabled={isProcessing}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Analysis Results */}
              {file.analysis && (
                <div className="flex gap-2 flex-wrap">
                  {file.analysis.hasForms && (
                    <Badge variant="secondary">Has Forms</Badge>
                  )}
                  {file.analysis.hasMetadata && (
                    <Badge variant="secondary">Has Metadata</Badge>
                  )}
                  {file.analysis.hasImages && (
                    <Badge variant="secondary">Has Images</Badge>
                  )}
                </div>
              )}

              {/* Compression Results */}
              {file.result && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-700">
                        {file.result.compressionRatio.toFixed(1)}%
                      </div>
                      <div className="text-green-600">Compressed</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-700">
                        {formatFileSize(file.result.originalSize - file.result.compressedSize)}
                      </div>
                      <div className="text-green-600">Space Saved</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-700">
                        {formatFileSize(file.result.compressedSize)}
                      </div>
                      <div className="text-green-600">New Size</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-700">
                        {file.result.optimizations.length}
                      </div>
                      <div className="text-green-600">Optimizations</div>
                    </div>
                  </div>
                  {file.result.optimizations.length > 0 && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {file.result.optimizations.map((opt, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {file.error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
                  Error: {file.error}
                </div>
              )}

              {file.status === 'processing' && (
                <Progress value={progress} className="h-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileList;
