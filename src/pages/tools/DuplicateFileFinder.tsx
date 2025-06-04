
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Upload, Trash2, Eye, AlertCircle, Info, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileInfo {
  name: string;
  size: number;
  hash: string;
  lastModified: number;
}

interface DuplicateGroup {
  hash: string;
  files: FileInfo[];
  totalSize: number;
}

const DuplicateFileFinder = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Simple hash function for demonstration
  const generateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    console.log('Files selected:', files.length);

    if (files.length > 1000) {
      toast({
        title: "Too many files",
        description: "Please select fewer than 1000 files for scanning",
        variant: "destructive"
      });
      return;
    }

    setSelectedFiles(files);
    setDuplicates([]);
    setScanComplete(false);
    
    toast({
      title: "Files loaded",
      description: `${files.length} files ready for duplicate scanning`,
    });
  }, []);

  const scanForDuplicates = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsScanning(true);
    
    try {
      console.log('Starting duplicate scan for', selectedFiles.length, 'files');
      
      const fileInfos: FileInfo[] = [];
      
      // Process files and generate hashes
      for (const file of selectedFiles) {
        try {
          const hash = await generateFileHash(file);
          fileInfos.push({
            name: file.name,
            size: file.size,
            hash,
            lastModified: file.lastModified
          });
        } catch (error) {
          console.warn('Could not process file:', file.name, error);
        }
      }
      
      // Group files by hash to find duplicates
      const hashGroups: { [hash: string]: FileInfo[] } = {};
      
      fileInfos.forEach(fileInfo => {
        if (!hashGroups[fileInfo.hash]) {
          hashGroups[fileInfo.hash] = [];
        }
        hashGroups[fileInfo.hash].push(fileInfo);
      });
      
      // Filter only groups with duplicates
      const duplicateGroups: DuplicateGroup[] = Object.entries(hashGroups)
        .filter(([_, files]) => files.length > 1)
        .map(([hash, files]) => ({
          hash,
          files,
          totalSize: files[0].size * files.length
        }));
      
      setDuplicates(duplicateGroups);
      setScanComplete(true);
      
      const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.files.length - 1, 0);
      
      toast({
        title: "Scan Complete",
        description: `Found ${totalDuplicates} duplicate files in ${duplicateGroups.length} groups`,
      });
    } catch (error) {
      console.error('Error scanning for duplicates:', error);
      toast({
        title: "Error",
        description: "Failed to scan for duplicates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  }, [selectedFiles]);

  const calculatePotentialSavings = () => {
    return duplicates.reduce((total, group) => {
      // Savings = (number of duplicates - 1) * file size
      return total + (group.files.length - 1) * group.files[0].size;
    }, 0);
  };

  const resetTool = () => {
    setSelectedFiles([]);
    setDuplicates([]);
    setScanComplete(false);
    setIsScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ToolPageTemplate
      title="Duplicate File Finder"
      description="Find and identify duplicate files to free up storage space and organize your files better"
      keywords="duplicate file finder, find duplicates, file deduplication, storage cleaner"
    >
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Select Files to Scan
          </h3>
          
          {selectedFiles.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Choose files to scan for duplicates
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Select multiple files to compare and find duplicates
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="mr-2 h-5 w-5" /> 
                Select Files
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Search className="h-10 w-10 text-purple-500" />
                  <div>
                    <p className="font-medium text-gray-800">{selectedFiles.length} files selected</p>
                    <p className="text-sm text-gray-600">
                      Total size: {formatFileSize(selectedFiles.reduce((sum, file) => sum + file.size, 0))}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={resetTool}
                  size="sm"
                >
                  Change Files
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Scan Button */}
        {selectedFiles.length > 0 && !isScanning && !scanComplete && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <Button 
              onClick={scanForDuplicates} 
              className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700"
              disabled={isScanning}
            >
              <Search className="mr-2 h-5 w-5" /> 
              Scan for Duplicates
            </Button>
          </div>
        )}

        {/* Processing State */}
        {isScanning && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Scanning for Duplicates...</h3>
              <p className="text-gray-600">Analyzing {selectedFiles.length} files to find duplicates</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {scanComplete && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {duplicates.length > 0 ? (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              Scan Results
            </h3>
            
            {duplicates.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">No Duplicates Found</h4>
                <p className="text-gray-600">All selected files are unique. Your files are well organized!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Duplicate Groups</p>
                      <p className="text-2xl font-bold text-orange-600">{duplicates.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total Duplicates</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {duplicates.reduce((sum, group) => sum + group.files.length - 1, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Potential Savings</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatFileSize(calculatePotentialSavings())}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {duplicates.map((group, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-800">
                          Duplicate Group {index + 1} ({group.files.length} files)
                        </h5>
                        <span className="text-sm text-gray-600">
                          {formatFileSize(group.files[0].size)} each
                        </span>
                      </div>
                      <div className="space-y-2">
                        {group.files.map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-800 truncate">{file.name}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(file.lastModified).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex gap-3">
              <Button 
                onClick={resetTool} 
                variant="outline"
                className="flex-1"
              >
                Scan New Files
              </Button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">How Duplicate Detection Works</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h5 className="font-medium mb-1">✓ Detection Method:</h5>
                  <ul className="space-y-1">
                    <li>• SHA-256 hash comparison</li>
                    <li>• Byte-level file analysis</li>
                    <li>• Size and content verification</li>
                    <li>• Filename independent detection</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">✓ Features:</h5>
                  <ul className="space-y-1">
                    <li>• Secure local processing</li>
                    <li>• Multiple file format support</li>
                    <li>• Storage savings calculation</li>
                    <li>• Detailed duplicate reports</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Privacy & Security</h4>
              <p className="text-sm text-gray-600 mb-3">
                All file analysis happens locally in your browser. Files are never uploaded to our servers, 
                ensuring complete privacy and security of your data.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Files processed locally in browser memory</li>
                <li>• No data transmission to external servers</li>
                <li>• Secure cryptographic hashing (SHA-256)</li>
                <li>• Automatic cleanup after analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default DuplicateFileFinder;
