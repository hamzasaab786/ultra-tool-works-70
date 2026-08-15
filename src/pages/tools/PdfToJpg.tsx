import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { FileText, Download, Settings, Zap, Image, AlertCircle } from 'lucide-react';
import ToolPageTemplate from './ToolPageTemplate';
import { loadPdfDocument, pdfjsLib, mapConcurrent } from '@/utils/pdfClient';

interface ConversionSettings {
  format: 'jpg' | 'png';
  quality: number;
  dpi: number;
  pageRange: 'all' | 'specific';
  specificPages: string;
}

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  filename: string;
}

interface ProcessedFile {
  id: string;
  file: File;
  pdfDocument: any;
  totalPages: number;
  previewPages: string[];
  convertedPages: ConvertedPage[];
  isConverting: boolean;
  conversionProgress: number;
}

const PdfToJpg = () => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'jpg',
    quality: 85,
    dpi: 150,
    pageRange: 'all',
    specificPages: '',
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a PDF file`,
          variant: 'destructive',
        });
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 50MB limit`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsLoading(true);

    for (const file of validFiles) {
      try {
        const pdf = await loadPdfDocument(file);

        // Generate previews for first 3 pages (in parallel)
        const maxPreviews = Math.min(3, pdf.numPages);
        const previewResults = await mapConcurrent(
          Array.from({ length: maxPreviews }, (_, i) => i + 1),
          async (i) => {
            try {
              const page = await pdf.getPage(i);
              const viewport = page.getViewport({ scale: 0.5 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d', { alpha: false })!;
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              await page.render({ canvasContext: context, viewport }).promise;
              const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, 'image/jpeg', 0.7)
              );
              page.cleanup();
              return blob ? URL.createObjectURL(blob) : null;
            } catch (pageError) {
              console.error('Error generating preview for page', i, pageError);
              return null;
            }
          }
        );
        const previews: string[] = previewResults.filter(Boolean) as string[];


        const processedFile: ProcessedFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          pdfDocument: pdf,
          totalPages: pdf.numPages,
          previewPages: previews,
          convertedPages: [],
          isConverting: false,
          conversionProgress: 0,
        };

        setProcessedFiles(prev => [...prev, processedFile]);
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: 'Error loading PDF',
          description: `Failed to load ${file.name}`,
          variant: 'destructive',
        });
      }
    }

    setIsLoading(false);
    toast({
      title: 'PDFs loaded',
      description: `Successfully loaded ${validFiles.length} PDF file(s)`,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
  });

  const convertPdfToImages = async (fileId: string): Promise<ConvertedPage[]> => {
    const fileIndex = processedFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return [];

    const processedFile = processedFiles[fileIndex];
    
    setProcessedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isConverting: true, conversionProgress: 0, convertedPages: [] } : f
    ));

    try {
      const pagesToConvert = getPageNumbers(processedFile.totalPages);
      const converted: ConvertedPage[] = [];
      let done = 0;
      const mime = settings.format === 'jpg' ? 'image/jpeg' : 'image/png';
      const quality = settings.format === 'jpg' ? settings.quality / 100 : 1;

      const results = await mapConcurrent(pagesToConvert, async (pageNum) => {
        try {
          const page = await processedFile.pdfDocument.getPage(pageNum);

          const scale = settings.dpi / 72;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { alpha: false })!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          // Encode once; the object URL reuses the same bytes as the blob.
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((encodedBlob) => {
              if (encodedBlob) resolve(encodedBlob);
              else reject(new Error(`Page ${pageNum} could not be encoded`));
            }, mime, quality);
          });
          const dataUrl = URL.createObjectURL(blob);
          const pad = String(pageNum).padStart(String(processedFile.totalPages).length, '0');
          const filename = `${processedFile.file.name.replace('.pdf', '')}_page_${pad}.${settings.format}`;

          page.cleanup();
          canvas.width = 0;
          canvas.height = 0;

          return { pageNumber: pageNum, dataUrl, blob, filename } as ConvertedPage;
        } catch (pageError) {
          console.error('Error converting page', pageNum, pageError);
          return null;
        } finally {
          done += 1;
          const pct = (done / pagesToConvert.length) * 100;
          setProcessedFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, conversionProgress: pct } : f
          ));
        }
      });

      converted.push(...(results.filter(Boolean) as ConvertedPage[]));
      converted.sort((a, b) => a.pageNumber - b.pageNumber);



      setProcessedFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, convertedPages: converted, isConverting: false } : f
      ));
      
      toast({
        title: 'Conversion completed',
        description: `Successfully converted ${converted.length} pages from ${processedFile.file.name}`,
      });

      return converted;
    } catch (error) {
      console.error('Conversion error:', error);
      setProcessedFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, isConverting: false } : f
      ));
      toast({
        title: 'Conversion failed',
        description: 'An error occurred during conversion. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
  };

  const convertAllFiles = async () => {
    for (const file of processedFiles) {
      if (file.convertedPages.length === 0) {
        await convertPdfToImages(file.id);
      }
    }
  };



  const getPageNumbers = (totalPages: number): number[] => {
    if (settings.pageRange === 'all') {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

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

  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const downloadSingle = (page: Pick<ConvertedPage, 'blob' | 'filename'>) => {
    triggerBlobDownload(page.blob, page.filename);
  };


  const allConvertedPages = (): ConvertedPage[] =>
    processedFiles
      .filter(f => f.convertedPages.length > 0)
      .flatMap(f => [...f.convertedPages].sort((a, b) => a.pageNumber - b.pageNumber));

  /** Reliable path: every page in one ZIP, named in page order. */
  const downloadAllAsZip = async () => {
    const pages = allConvertedPages();
    if (pages.length === 0) return;

    if (pages.length === 1) {
      downloadSingle(pages[0]);
      return;
    }

    setIsZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      pages.forEach((p) => zip.file(p.filename, p.blob));
      const zipBytes = await zip.generateAsync({
        type: 'uint8array',
        compression: 'STORE',
      });
      const zipBlob = new Blob([zipBytes], { type: 'application/zip' });
      triggerBlobDownload(zipBlob, `converted-${settings.format}-pages.zip`);
      toast({
        title: 'Download ready',
        description: `${pages.length} pages saved in one ZIP, in page order.`,
      });
    } catch (e) {
      console.error(e);
      toast({ title: 'ZIP failed', description: 'Please try downloading pages individually.', variant: 'destructive' });
    } finally {
      setIsZipping(false);
    }
  };

  /** Optional: save each page separately (browser may ask to allow multiple downloads). */
  const downloadEachSeparately = async () => {
    const pages = allConvertedPages();
    if (pages.length === 0) return;
    for (let i = 0; i < pages.length; i++) {
      downloadSingle(pages[i]);
      if (i < pages.length - 1) await new Promise(r => setTimeout(r, 500));
    }
    toast({
      title: 'Downloads started',
      description: `${pages.length} images queued. If only one arrives, allow "multiple downloads" for this site.`,
    });
  };







  const removeFile = (fileId: string) => {
    setProcessedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const resetTool = () => {
    setProcessedFiles([]);
    setIsLoading(false);
  };

  return (
    <ToolPageTemplate
      title="PDF to JPG Converter"
      description="Convert PDF pages to high-quality JPG or PNG images with customizable settings"
      keywords="PDF to JPG, PDF to PNG, PDF converter, extract images from PDF"
    >
      <div className="space-y-6">
        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload PDF File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-lg text-blue-600">Drop the PDF file here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">
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
                  <span className="text-blue-800">Loading PDFs...</span>
                </div>
              </div>
            )}

            {processedFiles.length > 0 && !isLoading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    {processedFiles.length} PDF file(s) loaded
                  </p>
                  <Button variant="outline" size="sm" onClick={resetTool}>
                    Clear All
                  </Button>
                </div>
                {processedFiles.map((file) => (
                  <div key={file.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-green-800 text-sm">{file.file.name}</p>
                        <p className="text-xs text-green-600">
                          {(file.file.size / (1024 * 1024)).toFixed(2)} MB • {file.totalPages} pages
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        {processedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>PDF Previews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {processedFiles.map((file) => (
                <div key={file.id} className="space-y-2">
                  <p className="font-medium text-sm">{file.file.name}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {file.previewPages.map((preview, index) => (
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
                    {file.totalPages > 3 && (
                      <div className="border rounded-lg p-8 flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-500">
                          <p className="font-medium">+{file.totalPages - 3} more pages</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Settings Section */}
        {processedFiles.length > 0 && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Conversion Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <Select
                      value={settings.format}
                      onValueChange={(value: 'jpg' | 'png') =>
                        setSettings({ ...settings, format: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpg">JPG (Smaller size)</SelectItem>
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
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>72 DPI</span>
                    <span>150 DPI</span>
                    <span>300 DPI</span>
                  </div>
                </div>

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
                    <Label>Specific Pages (e.g., 1,3,5-8)</Label>
                    <input
                      type="text"
                      value={settings.specificPages}
                      onChange={(e) =>
                        setSettings({ ...settings, specificPages: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="1,3,5-8"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Convert Button */}
        {processedFiles.length > 0 && !isLoading && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              {processedFiles.map((file) => (
                <div key={file.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{file.file.name}</p>
                    {file.isConverting && (
                      <span className="text-sm text-blue-600">Converting...</span>
                    )}
                    {file.convertedPages.length > 0 && !file.isConverting && (
                      <span className="text-sm text-green-600">✓ Converted</span>
                    )}
                  </div>
                  {file.isConverting && (
                    <Progress value={file.conversionProgress} className="h-2" />
                  )}
                  {!file.isConverting && file.convertedPages.length === 0 && (
                    <Button
                      onClick={() => convertPdfToImages(file.id)}
                      className="w-full"
                      size="sm"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Convert This File
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={convertAllFiles}
                className="w-full h-12 text-lg"
                disabled={processedFiles.length === 0 || isLoading}
              >
                <Zap className="mr-2 h-5 w-5" />
                Convert All to {settings.format.toUpperCase()}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {processedFiles.some(f => f.convertedPages.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Converted Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <p className="text-sm text-gray-600">
                  {processedFiles.filter(f => f.convertedPages.length > 0).length} file(s) converted successfully
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={downloadAllAsZip}
                    disabled={isZipping}
                    className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Download className="h-4 w-4" />
                    {isZipping ? 'Preparing ZIP…' : `Download All Pages (ZIP)`}
                  </Button>
                  <Button variant="outline" onClick={downloadEachSeparately} disabled={isZipping}>
                    <Download className="h-4 w-4 mr-2" />
                    Save pages one by one
                  </Button>
                </div>
              </div>


              {processedFiles.filter(f => f.convertedPages.length > 0).map((file) => (
                <div key={file.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.convertedPages.length} pages</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {file.convertedPages.map((page) => (
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
              ))}
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
                  All PDF processing happens locally in your browser. Your files are never uploaded to our servers.
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
