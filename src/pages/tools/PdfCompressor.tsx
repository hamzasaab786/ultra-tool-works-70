
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import ToolPageTemplate from './ToolPageTemplate';
import { usePdfCompression } from '@/hooks/usePdfCompression';
import CompressionStats from '@/components/pdf-compressor/CompressionStats';
import CompressionSettings from '@/components/pdf-compressor/CompressionSettings';
import FileUploadSection from '@/components/pdf-compressor/FileUploadSection';
import FileList from '@/components/pdf-compressor/FileList';
import InfoSection from '@/components/pdf-compressor/InfoSection';

const PdfCompressor = () => {
  const {
    files,
    isProcessing,
    progress,
    customCompressionStrength,
    setCustomCompressionStrength,
    handleFilesSelected,
    handleCompress,
    downloadFile,
    downloadAllFiles,
    removeFile,
    clearAllFiles,
    getTotalSavings,
    formatFileSize
  } = usePdfCompression();

  const savings = getTotalSavings();

  return (
    <ToolPageTemplate
      title="Professional PDF Compressor"
      description="Reduce PDF size by rendering pages as compressed images. Text search, links and editable forms are lost in compressed output; keep your original."
      keywords="PDF compressor, reduce PDF size, compress PDF online, PDF optimization, professional PDF tools"
    >
      <div className="space-y-6">
        {/* Compression Statistics */}
        {savings && (
          <CompressionStats 
            savings={savings} 
            formatFileSize={formatFileSize} 
          />
        )}

        {/* Compression Settings */}
        <CompressionSettings
          customCompressionStrength={customCompressionStrength}
          setCustomCompressionStrength={setCustomCompressionStrength}
        />

        {/* File Upload */}
        <FileUploadSection
          onFilesSelected={handleFilesSelected}
          isProcessing={isProcessing}
          progress={progress}
        />

        {/* File List */}
        <FileList
          files={files}
          isProcessing={isProcessing}
          progress={progress}
          formatFileSize={formatFileSize}
          onClearAllFiles={clearAllFiles}
          onDownloadAllFiles={downloadAllFiles}
          onDownloadFile={downloadFile}
          onRemoveFile={removeFile}
        />

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleCompress}
            disabled={files.length === 0 || isProcessing || !files.some(f => f.status === 'pending')}
            size="lg"
            className="min-w-[200px]"
          >
            {isProcessing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Compressing... {Math.round(progress)}%
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Compress PDFs
              </>
            )}
          </Button>
        </div>

        {/* Information Section */}
        <InfoSection />
      </div>
    </ToolPageTemplate>
  );
};

export default PdfCompressor;
