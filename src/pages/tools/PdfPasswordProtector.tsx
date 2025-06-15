
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const PdfPasswordProtector = () => {
  return (
    <ToolPageTemplate
      title="PDF Password Protector"
      description="Add password protection to your PDF files for enhanced security"
      keywords="PDF password, protect PDF, secure PDF, encrypt PDF, PDF security"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              PDF Password Protector: Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Feature Under Review</h3>
              <p className="mt-2 text-sm text-yellow-700">
                Adding strong, reliable password protection to PDF files directly in the browser is technically challenging and carries security risks. For this reason, the library we were using (`pdf-lib`) has discontinued this feature.
              </p>
              <p className="mt-2 text-sm text-yellow-700">
                We are currently exploring alternative, secure methods to bring this functionality back. We prioritize your data's security and will only implement a solution that meets high security standards.
              </p>
              <p className="mt-2 text-sm text-yellow-700">
                For now, we recommend using dedicated desktop software for password-protecting sensitive PDF documents. Thank you for your understanding.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why is Browser-Based PDF Encryption Difficult?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li><strong>Security Standards:</strong> Implementing industry-standard encryption (like AES-256) correctly in JavaScript is complex and can be prone to vulnerabilities if not done perfectly.</li>
              <li><strong>Performance:</strong> Encrypting large files can be slow and memory-intensive, leading to a poor user experience in the browser.</li>
              <li><strong>Library Support:</strong> Major open-source libraries have moved away from this feature due to the maintenance and security burden.</li>
              <li><strong>User Trust:</strong> We believe that for a security-critical feature like password protection, users are better served by established, audited desktop applications.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default PdfPasswordProtector;
