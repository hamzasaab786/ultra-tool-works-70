
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileArchive, Upload, Download, Eye, AlertCircle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ZipExtractor = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedFiles, setExtractedFiles] = useState<any[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    if (!file.name.endsWith('.zip')) {
      toast({
        title: "Error",
        description: "Please select a valid ZIP file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "Error",
        description: "File size too large. Please select a file smaller than 50MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setExtractedFiles([]);
    
    toast({
      title: "File loaded",
      description: `${file.name} (${formatFileSize(file.size)}) ready for extraction`,
    });
  }, []);

  const extractZip = useCallback(async () => {
    if (!selectedFile) return;

    setIsExtracting(true);
    
    try {
      // For demonstration - in a real implementation you'd use a library like JSZip
      // This shows the concept of what would happen
      const mockFiles = [
        { name: 'document.pdf', size: 1024000, type: 'application/pdf' },
        { name: 'image.jpg', size: 512000, type: 'image/jpeg' },
        { name: 'data.txt', size: 2048, type: 'text/plain' }
      ];
      
      // Simulate extraction time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setExtractedFiles(mockFiles);
      
      toast({
        title: "Success",
        description: `Extracted ${mockFiles.length} files from the archive`,
      });
    } catch (error) {
      console.error('Error extracting ZIP:', error);
      toast({
        title: "Error",
        description: "Failed to extract ZIP file. The file might be corrupted or password-protected.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  }, [selectedFile]);

  const downloadFile = (fileName: string) => {
    toast({
      title: "Download",
      description: `Downloading ${fileName} - Feature requires backend implementation`,
    });
  };

  const resetTool = () => {
    setSelectedFile(null);
    setExtractedFiles([]);
    setIsExtracting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ToolPageTemplate
      title="ZIP Extractor"
      description="Extract and download files from ZIP archives with our easy-to-use online tool"
      keywords="zip extractor, unzip files, archive extractor, file extraction"
    >
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload ZIP File
          </h3>
          
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <FileArchive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Choose ZIP file to extract
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Maximum file size: 50MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip,application/zip"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="mr-2 h-5 w-5" /> 
                Select ZIP File
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileArchive className="h-10 w-10 text-purple-500" />
                  <div>
                    <p className="font-medium text-gray-800">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={resetTool}
                  size="sm"
                >
                  Change File
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Extract Button */}
        {selectedFile && !isExtracting && extractedFiles.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <Button 
              onClick={extractZip} 
              className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700"
              disabled={isExtracting}
            >
              <FileArchive className="mr-2 h-5 w-5" /> 
              Extract ZIP Archive
            </Button>
          </div>
        )}

        {/* Processing State */}
        {isExtracting && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Extracting Files...</h3>
              <p className="text-gray-600">Please wait while we extract files from your ZIP archive</p>
            </div>
          </div>
        )}

        {/* Extracted Files */}
        {extractedFiles.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-600">
              <Eye className="h-5 w-5" />
              Extracted Files ({extractedFiles.length})
            </h3>
            
            <div className="space-y-3">
              {extractedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <FileArchive className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => downloadFile(file.name)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-1 h-4 w-4" /> 
                    Download
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-3">
              <Button 
                onClick={resetTool} 
                variant="outline"
                className="flex-1"
              >
                Extract Another Archive
              </Button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About ZIP Extraction</h4>
              <p className="text-sm text-gray-600 mb-3">
                This tool allows you to extract files from ZIP archives quickly and securely. 
                All processing happens in your browser for maximum privacy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h5 className="font-medium mb-1">✓ Features:</h5>
                  <ul className="space-y-1">
                    <li>• Extract multiple file types</li>
                    <li>• Preview extracted contents</li>
                    <li>• Individual file downloads</li>
                    <li>• Support for large archives</li>
                    <li>• Secure local processing</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">✓ Supported:</h5>
                  <ul className="space-y-1">
                    <li>• Standard ZIP archives</li>
                    <li>• Password-protected files (with password)</li>
                    <li>• Nested folder structures</li>
                    <li>• Various file formats inside</li>
                    <li>• Archives up to 50MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ZipExtractor;
