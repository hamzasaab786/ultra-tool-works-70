
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Globe, Search } from "lucide-react";
import SEO from "@/components/SEO";

const WhoisLookup = () => {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const performLookup = () => {
    if (!domain.trim()) {
      toast({
        title: "Domain required",
        description: "Please enter a domain name to lookup.",
        variant: "destructive",
      });
      return;
    }

    // Mock result for demo
    setResult({
      domain: domain,
      registrar: "Demo Registrar",
      status: "Active",
      created: "2020-01-01",
      expires: "2025-01-01",
    });

    toast({
      title: "Lookup complete",
      description: "WHOIS information retrieved. (Demo data)",
    });
  };

  return (
    <>
      <SEO
        title="WHOIS Lookup - Domain Information Checker Online"
        description="Lookup WHOIS information for any domain. Check domain registration details, expiration dates, and ownership information."
        keywords="whois lookup, domain checker, domain information, domain registration, whois search"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              WHOIS Lookup
            </h1>
            <p className="text-lg text-gray-600">
              Get domain registration information and ownership details
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Domain Lookup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performLookup()}
                />
                <Button onClick={performLookup} disabled={!domain.trim()}>
                  <Search className="mr-2 h-4 w-4" />
                  Lookup Domain
                </Button>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>WHOIS Information</CardTitle>
                  <CardDescription>Domain registration details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Domain:</span>
                      <span className="font-mono">{result.domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registrar:</span>
                      <span>{result.registrar}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span>{result.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{result.created}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{result.expires}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    This is demo data. Real WHOIS lookup coming soon...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WhoisLookup;
