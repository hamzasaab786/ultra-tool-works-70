
import React from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload } from "lucide-react";

const ImageCompressor = () => {
  return (
    <ToolPageTemplate
      title="Image Compressor"
      description="Reduce image file size with minimal quality loss"
    >
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PNG, JPG or WEBP (MAX. 5MB)
        </p>
        <Button className="mt-4">
          <Upload className="mr-2 h-4 w-4" /> Select Image
        </Button>
      </div>
      
      <Alert className="mt-4">
        <AlertDescription>
          This tool is currently under development. Full functionality coming soon!
        </AlertDescription>
      </Alert>
    </ToolPageTemplate>
  );
};

export default ImageCompressor;
