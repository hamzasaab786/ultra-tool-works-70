
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit, Download, Upload, Type, Image } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const EditPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for editing`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const editPdf = async () => {
    if (!file) return;

    setIsEditing(true);
    try {
      // For basic PDF editing, we can use pdf-lib
      const { PDFDocument, rgb } = await import('pdf-lib');
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Example: Add a simple text annotation to the first page
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      firstPage.drawText('Edited with ToolifyConvert', {
        x: 50,
        y: height - 50,
        size: 12,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Basic Edit Complete",
        description: "Sample edit applied. For advanced editing features, a full PDF editor is recommended.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Editing error:', error);
      toast({
        title: "Editing failed",
        description: "There was an error editing the PDF",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Edit PDF"
      description="Comprehensive PDF editor for adding text, images, shapes, and annotations to your documents."
      keywords="edit pdf, pdf editor, add text to pdf, pdf annotation, modify pdf"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-emerald-50 rounded-full">
                <Edit className="h-12 w-12 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF to edit"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF document to modify
                </p>
              </div>
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Select PDF
              </Button>
            </div>
          </label>
        </div>

        {file && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Edit className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-lg p-4 text-center">
                <Type className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Add Text</h4>
                <p className="text-sm text-gray-500">Insert and edit text anywhere</p>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <Image className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Add Images</h4>
                <p className="text-sm text-gray-500">Insert photos and graphics</p>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <Edit className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Annotations</h4>
                <p className="text-sm text-gray-500">Add comments and markup</p>
              </div>
            </div>

            <Button
              onClick={editPdf}
              disabled={isEditing}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isEditing ? (
                "Processing..."
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Apply Sample Edit
                </>
              )}
            </Button>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This tool demonstrates basic PDF editing capabilities. 
                For advanced features like interactive text editing, image insertion, and form filling, 
                consider using dedicated PDF editing software.
              </p>
            </div>
          </div>
        )}

        <div className="bg-emerald-50 p-4 rounded-lg">
          <h3 className="font-medium text-emerald-900 mb-2">Editing Features:</h3>
          <ul className="text-sm text-emerald-800 space-y-1">
            <li>• Add, edit, and format text</li>
            <li>• Insert images and shapes</li>
            <li>• Highlight and annotate content</li>
            <li>• Fill forms and add signatures</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default EditPdf;
