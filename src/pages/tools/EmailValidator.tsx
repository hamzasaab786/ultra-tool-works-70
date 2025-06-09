
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";

interface ValidationResult {
  isValid: boolean;
  email: string;
  domain: string;
  local: string;
  suggestions?: string[];
  issues?: string[];
}

const EmailValidator = () => {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateEmail = (emailAddress: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(emailAddress);
    
    const [local, domain] = emailAddress.split('@');
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (!isValid) {
      if (!emailAddress.includes('@')) {
        issues.push('Missing @ symbol');
      } else if (!domain || !domain.includes('.')) {
        issues.push('Invalid domain format');
      } else if (!local) {
        issues.push('Missing local part (before @)');
      }
    }

    // Common domain typos
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domainLower = domain?.toLowerCase();
    
    if (domainLower && !commonDomains.includes(domainLower)) {
      const suggestion = commonDomains.find(d => 
        d.includes(domainLower.replace(/[^a-z]/g, '')) ||
        domainLower.includes(d.replace(/[^a-z]/g, ''))
      );
      if (suggestion) {
        suggestions.push(`Did you mean: ${local}@${suggestion}?`);
      }
    }

    return {
      isValid,
      email: emailAddress,
      domain: domain || '',
      local: local || '',
      suggestions,
      issues
    };
  };

  const handleValidation = () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to validate.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    setTimeout(() => {
      const result = validateEmail(email.trim());
      setResults([result, ...results.slice(0, 9)]); // Keep last 10 results
      setEmail("");
      setIsValidating(false);

      toast({
        title: result.isValid ? "Valid email" : "Invalid email",
        description: result.isValid 
          ? "The email address is properly formatted."
          : "The email address has formatting issues.",
        variant: result.isValid ? "default" : "destructive",
      });
    }, 500);
  };

  const validateBulk = () => {
    const emails = email.split(/[,\n\r\t;]+/).map(e => e.trim()).filter(e => e);
    
    if (emails.length === 0) {
      toast({
        title: "No emails found",
        description: "Please enter email addresses separated by commas or new lines.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    setTimeout(() => {
      const newResults = emails.map(validateEmail);
      setResults([...newResults, ...results.slice(0, 10 - newResults.length)]);
      setEmail("");
      setIsValidating(false);

      const validCount = newResults.filter(r => r.isValid).length;
      toast({
        title: "Bulk validation complete",
        description: `${validCount} out of ${newResults.length} emails are valid.`,
      });
    }, 1000);
  };

  return (
    <>
      <SEO
        title="Email Validator - Validate Email Addresses Online Free"
        description="Validate email addresses online for free. Check email format, detect typos, and get suggestions for common email providers."
        keywords="email validator, validate email, email checker, email verification, email format check"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Email Validator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Validate email addresses, check formatting, and get suggestions for common typos
            </p>
          </div>

          <div className="space-y-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Validation
                </CardTitle>
                <CardDescription>
                  Enter one email address or multiple emails separated by commas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="example@domain.com or multiple emails separated by commas"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleValidation()}
                  />
                  
                  <div className="flex gap-2">
                    <Button onClick={handleValidation} disabled={isValidating || !email.trim()}>
                      {isValidating ? 'Validating...' : 'Validate Email'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={validateBulk} 
                      disabled={isValidating || !email.trim()}
                    >
                      Bulk Validate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Validation Results</CardTitle>
                  <CardDescription>
                    Recent email validation results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {result.isValid ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium font-mono text-sm">
                                {result.email}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.isValid 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {result.isValid ? 'Valid' : 'Invalid'}
                              </span>
                            </div>
                            
                            {result.isValid && (
                              <div className="text-sm text-gray-600">
                                <span>Local: {result.local}</span>
                                <span className="mx-2">•</span>
                                <span>Domain: {result.domain}</span>
                              </div>
                            )}
                            
                            {result.issues && result.issues.length > 0 && (
                              <div className="mt-2">
                                {result.issues.map((issue, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4" />
                                    {issue}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {result.suggestions && result.suggestions.length > 0 && (
                              <div className="mt-2">
                                {result.suggestions.map((suggestion, i) => (
                                  <div key={i} className="text-sm text-blue-600">
                                    💡 {suggestion}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Information */}
            <Card>
              <CardHeader>
                <CardTitle>Email Validation Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">✅ Format Validation</h4>
                    <p className="text-sm text-gray-600">
                      Checks for proper email format including @ symbol and domain structure
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">🔍 Typo Detection</h4>
                    <p className="text-sm text-gray-600">
                      Identifies common typos in popular email providers
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">📊 Bulk Processing</h4>
                    <p className="text-sm text-gray-600">
                      Validate multiple email addresses at once
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">💡 Smart Suggestions</h4>
                    <p className="text-sm text-gray-600">
                      Get correction suggestions for common domain typos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailValidator;
