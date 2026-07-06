
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Unlock, Upload, Download, AlertCircle } from "lucide-react";
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
      toast({ title: "Missing information", description: "Select a PDF and enter the password", variant: "destructive" });
      return;
    }
    setIsUnlocking(true);
    try {
      // Use pdfjs to open the encrypted PDF with the password, then re-pack
      // pages as images into a fresh unencrypted PDF via pdf-lib.
      const { pdfjsLib, renderPdfPageToCanvas } = await import("@/utils/pdfClient");
      const { PDFDocument } = await import("pdf-lib");
      const data = new Uint8Array(await file.arrayBuffer());
      const src = await pdfjsLib.getDocument({ data, password }).promise;

      const out = await PDFDocument.create();
      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const { canvas } = await renderPdfPageToCanvas(page, 2);
        const png = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/png"));
        const embed = await out.embedPng(new Uint8Array(await png.arrayBuffer()));
        const p = out.addPage([embed.width, embed.height]);
        p.drawImage(embed, { x: 0, y: 0, width: embed.width, height: embed.height });
      }
      const bytes = await out.save();
      const blob = new Blob([bytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = file.name.replace(/\.pdf$/i, "") + "_unlocked.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "PDF unlocked", description: "Downloaded the password-free copy." });
    } catch (error: any) {
      console.error(error);
      const msg = String(error?.message || error);
      toast({
        title: "Unlock failed",
        description: msg.toLowerCase().includes("password") ? "Incorrect password." : msg,
        variant: "destructive",
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Unlock PDF"
      description="Remove password protection from PDF files to make them accessible and editable."
      keywords="unlock pdf, remove pdf password, pdf security, password protected pdf"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-red-50 rounded-full">
                <Unlock className="h-12 w-12 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Choose password-protected PDF"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Select a locked PDF to unlock
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
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3">
                <Unlock className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                PDF Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter PDF password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <Button
              onClick={unlockPdf}
              disabled={isUnlocking || !password}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isUnlocking ? (
                "Unlocking..."
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock PDF
                </>
              )}
            </Button>
          </div>
        )}

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-medium text-red-900 mb-2">Security & Privacy:</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Files are processed locally in your browser</li>
            <li>• No data is sent to external servers</li>
            <li>• Original password protection is removed</li>
            <li>• Download unlocked PDF immediately</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3 text-sm text-blue-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Important Note</p>
              <p>
                Only use this tool with PDFs you own or have permission to unlock. 
                Unlocking copyrighted or protected documents without authorization may violate terms of use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default UnlockPdf;
