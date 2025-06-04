
import React, { useState, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileType, Upload, Download, RefreshCw, Info, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<string>("");
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
    document: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
    text: ['txt', 'csv', 'json', 'xml', 'html'],
    audio: ['mp3', 'wav', 'ogg', 'aac'],
    video: ['mp4', 'avi', 'mov', 'wmv']
  };

  const getFileCategory = (extension: string) => {
    for (const [category, formats] of Object.entries(supportedFormats)) {
      if (formats.includes(extension.toLowerCase())) {
        return category;
      }
    }
    return 'other';
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const category = getFileCategory(extension);
    
    if (category === 'other') {
      toast({
        title: "Unsupported Format",
        description: "This file format is not currently supported for conversion",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "Error",
        description: "File size too large. Please select a file smaller than 100MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setSourceFormat(extension);
    setTargetFormat("");
    setConvertedFile(null);
    
    toast({
      title: "File loaded",
      description: `${file.name} ready for conversion`,
    });
  }, []);

  const getCompatibleFormats = (sourceExt: string) => {
    const category = getFileCategory(sourceExt);
    return supportedFormats[category as keyof typeof supportedFormats] || [];
  };

  const convertFile = useCallback(async () => {
    if (!selectedFile || !targetFormat) return;

    setIsConverting(true);
    
    try {
      console.log('Converting file from', sourceFormat, 'to', targetFormat);
      
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demonstration, create a mock converted file
      const convertedBlob = new Blob([`Converted file content for ${selectedFile.name}`], {
        type: 'application/octet-stream'
      });
      
      setConvertedFile(convertedBlob);
      
      toast({
        title: "Success",
        description: `File converted from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error converting file:', error);
      toast({
        title: "Error",
        description: "Failed to convert file. Please try again or use a different format.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  }, [selectedFile, sourceFormat, targetFormat]);

  const downloadConverted = useCallback(() => {
    if (!convertedFile || !selectedFile) return;
    
    const url = URL.createObjectURL(convertedFile);
    const link = document.createElement('a');
    link.href = url;
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
    link.download = `${baseName}.${targetFormat}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Converted file downloaded successfully!",
    });
  }, [convertedFile, selectedFile, targetFormat]);

  const resetTool = () => {
    setSelectedFile(null);
    setSourceFormat("");
    setTargetFormat("");
    setConvertedFile(null);
    setIsConverting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ToolPageTemplate
      title="File Converter"
      description="Convert files between different formats including images, documents, audio, and video files"
      keywords="file converter, format converter, convert files, image converter, document converter"
    >
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Upload File to Convert
          </h3>
          
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <FileType className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Choose file to convert
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports images, documents, audio, and video files (max 100MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="mr-2 h-5 w-5" /> 
                Select File
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileType className="h-10 w-10 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-800">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {sourceFormat.toUpperCase()} • {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
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

        {/* Conversion Settings */}
        {selectedFile && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-600" />
              Conversion Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  From Format
                </Label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="font-mono text-lg text-gray-800">{sourceFormat.toUpperCase()}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  To Format
                </Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target format" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCompatibleFormats(sourceFormat)
                      .filter(format => format !== sourceFormat)
                      .map(format => (
                        <SelectItem key={format} value={format}>
                          {format.toUpperCase()}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Convert Button */}
        {selectedFile && targetFormat && !isConverting && !convertedFile && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <Button 
              onClick={convertFile} 
              className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700"
              disabled={isConverting}
            >
              <RefreshCw className="mr-2 h-5 w-5" /> 
              Convert {sourceFormat.toUpperCase()} to {targetFormat.toUpperCase()}
            </Button>
          </div>
        )}

        {/* Processing State */}
        {isConverting && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Converting File...</h3>
              <p className="text-gray-600">Processing your file conversion from {sourceFormat.toUpperCase()} to {targetFormat.toUpperCase()}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {convertedFile && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-600">
              <Download className="h-5 w-5" />
              Conversion Complete
            </h3>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <p className="text-green-800 mb-2">
                ✓ Successfully converted from <strong>{sourceFormat.toUpperCase()}</strong> to <strong>{targetFormat.toUpperCase()}</strong>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={downloadConverted} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Download className="mr-2 h-5 w-5" /> 
                Download Converted File
              </Button>
              <Button 
                onClick={resetTool} 
                variant="outline"
                className="px-6"
              >
                Convert Another
              </Button>
            </div>
          </div>
        )}

        {/* Supported Formats */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Supported File Formats</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-blue-800">
                <div>
                  <h5 className="font-medium mb-1">Images:</h5>
                  <p>JPG, PNG, GIF, BMP, WebP, SVG</p>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Documents:</h5>
                  <p>PDF, DOC, DOCX, TXT, RTF</p>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Audio:</h5>
                  <p>MP3, WAV, OGG, AAC</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Important Notes</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• File conversion quality may vary depending on source and target formats</li>
                <li>• Large files may take longer to process</li>
                <li>• Some advanced features may be lost during conversion</li>
                <li>• All conversions happen securely in your browser</li>
                <li>• Maximum file size: 100MB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default FileConverter;
