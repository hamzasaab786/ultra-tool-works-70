
import React from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileIcon, Upload } from "lucide-react";

const MergePDF = () => {
  return (
    <ToolPageTemplate
      title="Merge PDF"
      description="Combine multiple PDF files into one document"
    >
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <FileIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PDF files (MAX. 10MB each)
        </p>
        <Button className="mt-4">
          <Upload className="mr-2 h-4 w-4" /> Select PDF Files
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

export default MergePDF;
