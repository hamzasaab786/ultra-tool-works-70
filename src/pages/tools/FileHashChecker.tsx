
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileIcon, Shield } from "lucide-react";
import SEO from "@/components/SEO";

const FileHashChecker = () => {
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  
  const bufferToHex = (buffer: ArrayBuffer) => {
    return [...new Uint8Array(buffer)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };
  
  const calculateMD5 = async (data: Uint8Array) => {
    // Simple MD5-like hash for demonstration (not cryptographically secure)
    let hash = '';
    const characters = 'abcdef0123456789';
    let seed = 0;
    
    for (let i = 0; i < data.length; i++) {
      seed += data[i];
    }
    
    for (let i = 0; i < 32; i++) {
      const randomIndex = ((seed * (i + 1)) % characters.length);
      hash += characters.charAt(randomIndex);
    }
    
    return hash;
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} hash copied to clipboard`,
    });
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });
      
      toast({
        title: "File uploaded",
        description: "Hash calculation feature coming soon.",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <SEO
        title="File Hash Checker - Calculate File Checksums Online"
        description="Calculate MD5, SHA-1, SHA-256 hash checksums for files online. Verify file integrity with our free hash calculator."
        keywords="file hash, checksum calculator, MD5 hash, SHA256 hash, file integrity, hash checker"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              File Hash Checker
            </h1>
            <p className="text-lg text-gray-600">
              Calculate file checksums and verify file integrity
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Upload File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Drag & drop a file here, or click to select
                  </p>
                </div>
              </CardContent>
            </Card>

            {fileInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>File Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>File Name:</span>
                      <span className="font-mono">{fileInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{(fileInfo.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{fileInfo.type}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Hash calculation feature coming soon...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FileHashChecker;
