
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, Download, Upload, Lock } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const ProtectPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [permissions, setPermissions] = useState({
    printing: true,
    copying: true,
    editing: true,
    commenting: true,
  });
  const [isProtecting, setIsProtecting] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} is ready for protection`,
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

  const protectPdf = async () => {
    if (!file) return;
    
    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter a password to protect the PDF",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both password fields match",
        variant: "destructive",
      });
      return;
    }

    setIsProtecting(true);
    try {
      toast({
        title: "Protection in progress",
        description: "PDF protection requires backend processing with encryption capabilities.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feature coming soon",
        description: "PDF protection will be available with backend integration",
      });
    } catch (error) {
      console.error('Protection error:', error);
      toast({
        title: "Protection failed",
        description: "There was an error protecting your PDF",
        variant: "destructive",
      });
    } finally {
      setIsProtecting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Protect PDF"
      description="Add password protection and permission restrictions to your PDF documents for enhanced security and control."
      keywords="protect pdf, pdf password, pdf security, encrypt pdf, pdf permissions"
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
              <div className="p-4 bg-green-50 rounded-full">
                <Shield className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose PDF to protect"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a PDF file to add security
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
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Password Protection
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setPermissions(prev => ({ ...prev, [key]: !!checked }))
                      }
                    />
                    <label htmlFor={key} className="text-sm text-gray-700 capitalize">
                      Allow {key}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={protectPdf}
              disabled={isProtecting || !password}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProtecting ? (
                "Protecting PDF..."
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Protect PDF
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">Security Features:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Password protection for opening</li>
            <li>• Customizable user permissions</li>
            <li>• 128-bit encryption security</li>
            <li>• Prevent unauthorized access</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default ProtectPdf;
