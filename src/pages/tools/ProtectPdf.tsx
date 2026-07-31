import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Download, Loader2, Eye, EyeOff } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";
import { PDFDocument } from "@cantoo/pdf-lib";

const ProtectPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProtecting, setIsProtecting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("PDF file selected successfully!");
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const protectPdf = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    if (!password || password.length < 4) {
      toast.error("Password must be at least 4 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsProtecting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Real PDF encryption (AES) — the file cannot be opened without the password.
      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
          printing: "highResolution",
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "_protected.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF encrypted — the password is now required to open it.");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Protection error:", error);
      toast.error("Failed to encrypt PDF. The file may already be password protected.");
    } finally {
      setIsProtecting(false);
    }
  };

  return (
    <ToolPageTemplate
      title="Protect PDF with Password"
      description="Secure your PDF files by adding password protection. Free online PDF encryption tool."
      keywords="protect pdf, password protect pdf, encrypt pdf, secure pdf"
    >
      <Card className="p-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <Lock className="h-16 w-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">Protect PDF with Password</h2>
            <p className="text-muted-foreground">
              Add password protection to your PDF files for enhanced security
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="pdf-file">Select PDF File</Label>
              <input
                id="pdf-file"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors mt-2"
              />
            </div>

            {file && (
              <Card className="p-4 bg-muted/50">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </Card>
            )}

            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (minimum 4 characters)"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              onClick={protectPdf}
              disabled={!file || !password || !confirmPassword || isProtecting}
              className="w-full"
              size="lg"
            >
              {isProtecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  Encrypt PDF with Password
                </>
              )}
            </Button>
          </div>

          <div className="pt-6 border-t space-y-3">
            <h3 className="font-semibold">How it works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Real PDF encryption — the password is required to open the file</li>
              <li>✓ Copying, editing and assembly permissions are restricted</li>
              <li>✓ All processing happens locally in your browser</li>
              <li>✓ Your files never leave your device</li>
              <li>⚠️ Keep your password safe — it cannot be recovered</li>
            </ul>
          </div>


        </div>
      </Card>
    </ToolPageTemplate>
  );
};

export default ProtectPdf;
