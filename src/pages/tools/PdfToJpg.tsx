
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { FileText, Download, Settings, Zap, Image, AlertCircle } from 'lucide-react';
import ToolPageTemplate from './ToolPageTemplate';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker with correct version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ConversionSettings {
  format: 'jpg' | 'png';
  quality: number;
  dpi: number;
  pageRange: 'all' | 'specific';
  specificPages: string;
  zipOutput: boolean;
}

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  filename: string;
}

const PdfToJpg = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'jpg',
    quality: 85,
    dpi: 150,
    pageRange: 'all',
    specificPages: '',
    zipOutput: false
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please select a PDF file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: 'File too large',
        description: 'Please select a PDF file smaller than 50MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setConvertedPages([]);
    setPreviewPages([]);
    setIsLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      setPdfDocument(pdf);
      setTotalPages(pdf.numPages);

      // Generate previews for first 3 pages
      const previews: string[] = [];
      const maxPreviews = Math.min(3, pdf.numPages);
      
      for (let i = 1; i <= maxPreviews; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.8 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        previews.push(canvas.toDataURL('image/jpeg', 0.8));
      }
      
      setPreviewPages(previews);
      
      toast({
        title: 'PDF loaded successfully',
        description: `Found ${pdf.numPages} pages`,
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: 'Error loading PDF',
        description: 'The PDF file appears to be corrupted, password-protected, or in an unsupported format',
        variant: 'destructive',
      });
      setSelectedFile(null);
      setPdfDocument(null);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
  });

  const convertPdfToImages = async () => {
    if (!pdfDocument || !selectedFile) return;

    setIsConverting(true);
    setConversionProgress(0);
    setConvertedPages([]);

    try {
      const pagesToConvert = getPageNumbers();
      const converted: ConvertedPage[] = [];

      for (let i = 0; i < pagesToConvert.length; i++) {
        const pageNum = pagesToConvert[i];
        const page = await pdfDocument.getPage(pageNum);
        
        // Calculate scale based on DPI
        const scale = settings.dpi / 72; // 72 is the default DPI
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convert to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob!);
          }, `image/${settings.format}`, settings.format === 'jpg' ? settings.quality / 100 : 1);
        });

        const dataUrl = canvas.toDataURL(`image/${settings.format}`, settings.format === 'jpg' ? settings.quality / 100 : 1);
        const filename = `${selectedFile.name.replace('.pdf', '')}_page_${pageNum}.${settings.format}`;

        converted.push({
          pageNumber: pageNum,
          dataUrl,
          blob,
          filename
        });

        setConversionProgress(((i + 1) / pagesToConvert.length) * 100);
      }

      setConvertedPages(converted);
      
      toast({
        title: 'Conversion completed',
        description: `Successfully converted ${converted.length} pages`,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: 'Conversion failed',
        description: 'An error occurred during conversion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConverting(false);
    }
  };

  const getPageNumbers = (): number[] => {
    if (settings.pageRange === 'all') {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Parse specific pages (e.g., "1,3,5-8")
    const pages: number[] = [];
    const parts = settings.specificPages.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (start && end && start <= end && start >= 1 && end <= totalPages) {
          for (let i = start; i <= end; i++) {
            pages.push(i);
          }
        }
      } else {
        const pageNum = parseInt(trimmed);
        if (pageNum >= 1 && pageNum <= totalPages) {
          pages.push(pageNum);
        }
      }
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const downloadSingle = (page: ConvertedPage) => {
    const url = URL.createObjectURL(page.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = page.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    if (convertedPages.length === 1) {
      downloadSingle(convertedPages[0]);
      return;
    }

    for (const page of convertedPages) {
      downloadSingle(page);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    toast({
      title: 'Download completed',
      description: `Downloaded ${convertedPages.length} images`,
    });
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPdfDocument(null);
    setTotalPages(0);
    setConvertedPages([]);
    setPreviewPages([]);
    setConversionProgress(0);
    setIsConverting(false);
    setIsLoading(false);
  };

  return (
    <ToolPageTemplate
      title="PDF to JPG Converter"
      description="Convert PDF pages to high-quality JPG or PNG images with customizable settings. Perfect for extracting images from documents, creating thumbnails, or converting presentations."
      keywords="PDF to JPG, PDF to PNG, PDF converter, extract images from PDF, PDF to image converter"
    >
      <div className="space-y-6">
        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FileText className="h-5 w-5" />
              Upload PDF File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 md:p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <FileText className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-4" />
              {isDragActive ? (
                <p className="text-base md:text-lg text-blue-600">Drop the PDF file here...</p>
              ) : (
                <div>
                  <p className="text-base md:text-lg mb-2">
                    Drag & drop a PDF file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF files up to 50MB
                  </p>
                </div>
              )}
            </div>

            {isLoading && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800">Loading PDF...</span>
                </div>
              </div>
            )}

            {selectedFile && !isLoading && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-green-800 break-all">{selectedFile.name}</p>
                    <p className="text-sm text-green-600">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {totalPages} pages
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetTool} className="shrink-0">
                    Change File
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        {previewPages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">PDF Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {previewPages.map((preview, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Page ${index + 1}`}
                      className="w-full h-auto max-h-64 object-contain"
                    />
                    <div className="p-2 bg-gray-50 text-center text-sm">
                      Page {index + 1}
                    </div>
                  </div>
                ))}
                {totalPages > 3 && (
                  <div className="border rounded-lg p-4 md:p-8 flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-500">
                      <p className="font-medium">+{totalPages - 3} more pages</p>
                      <p className="text-sm">Will be included in conversion</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Section */}
        {selectedFile && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Settings className="h-5 w-5" />
                Conversion Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic" className="text-sm">Basic Settings</TabsTrigger>
                  <TabsTrigger value="advanced" className="text-sm">Advanced Options</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format">Output Format</Label>
                      <Select
                        value={settings.format}
                        onValueChange={(value: 'jpg' | 'png') =>
                          setSettings({ ...settings, format: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpg">JPG (Smaller file size)</SelectItem>
                          <SelectItem value="png">PNG (Better quality)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {settings.format === 'jpg' && (
                      <div className="space-y-2">
                        <Label>Quality: {settings.quality}%</Label>
                        <Slider
                          value={[settings.quality]}
                          onValueChange={(value) =>
                            setSettings({ ...settings, quality: value[0] })
                          }
                          max={100}
                          min={50}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Resolution (DPI): {settings.dpi}</Label>
                    <Slider
                      value={[settings.dpi]}
                      onValueChange={(value) =>
                        setSettings({ ...settings, dpi: value[0] })
                      }
                      max={300}
                      min={72}
                      step={25}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>72 DPI (Web)</span>
                      <span>150 DPI (Print)</span>
                      <span>300 DPI (High Quality)</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Page Range</Label>
                      <Select
                        value={settings.pageRange}
                        onValueChange={(value: 'all' | 'specific') =>
                          setSettings({ ...settings, pageRange: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Pages</SelectItem>
                          <SelectItem value="specific">Specific Pages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {settings.pageRange === 'specific' && (
                      <div className="space-y-2">
                        <Label htmlFor="specificPages">
                          Specific Pages (e.g., 1,3,5-8)
                        </Label>
                        <input
                          id="specificPages"
                          type="text"
                          value={settings.specificPages}
                          onChange={(e) =>
                            setSettings({ ...settings, specificPages: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="1,3,5-8"
                        />
                        <p className="text-xs text-gray-500">
                          Use commas for individual pages and hyphens for ranges
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Convert Button */}
        {selectedFile && !isConverting && !isLoading && (
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={convertPdfToImages}
                className="w-full h-12 text-base md:text-lg"
                disabled={!selectedFile || isConverting || isLoading}
              >
                <Zap className="mr-2 h-5 w-5" />
                Convert to {settings.format.toUpperCase()}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Section */}
        {isConverting && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Converting PDF pages...</span>
                  <span>{Math.round(conversionProgress)}%</span>
                </div>
                <Progress value={conversionProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {convertedPages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Image className="h-5 w-5" />
                Converted Images ({convertedPages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <p className="text-sm text-gray-600">
                    Conversion completed successfully
                  </p>
                  <Button onClick={downloadAll} className="flex items-center gap-2 w-full sm:w-auto">
                    <Download className="h-4 w-4" />
                    Download All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {convertedPages.map((page) => (
                    <div key={page.pageNumber} className="border rounded-lg overflow-hidden">
                      <img
                        src={page.dataUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3 bg-gray-50">
                        <p className="text-sm font-medium mb-2">Page {page.pageNumber}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadSingle(page)}
                          className="w-full"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Privacy & Security</p>
                <p>
                  All PDF processing happens locally in your browser. Your files are never uploaded to our servers, 
                  ensuring complete privacy and security of your documents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfToJpg;
