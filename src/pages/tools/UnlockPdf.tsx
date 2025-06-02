
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Unlock, Download, Upload, Key } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const UnlockPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for unlocking`,
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

  const unlockPdf = async () => {
    if (!file || !password) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter the password",
        variant: "destructive",
      });
      return;
    }

    setIsUnlocking(true);
    try {
      toast({
        title: "Unlocking PDF",
        description: "PDF unlocking requires backend processing with encryption handling.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feature coming soon",
        description: "PDF unlocking will be available with backend integration",
      });
    } catch (error) {
      console.error('Unlocking error:', error);
      toast({
        title: "Unlock failed",
        description: "There was an error unlocking your PDF",
        variant: "destructive",
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Unlock PDF"
      description="Remove password protection from PDF files to regain full access to your documents."
      keywords="unlock pdf, remove password, pdf security, decrypt pdf, password protected"
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
              <div className="p-4 bg-yellow-50 rounded-full">
                <Unlock className="h-12 w-12 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose protected PDF file"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a password-protected PDF
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
                <Unlock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  PDF Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PDF password"
                />
              </div>
            </div>

            <Button
              onClick={unlockPdf}
              disabled={isUnlocking || !password}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              {isUnlocking ? (
                "Unlocking PDF..."
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock PDF
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-medium text-yellow-900 mb-2">Security Notice:</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Files are processed securely</li>
            <li>• No passwords are stored</li>
            <li>• Original file remains unchanged</li>
            <li>• Only use with files you own</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default UnlockPdf;
