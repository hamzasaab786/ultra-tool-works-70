
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const performLookup = async () => {
    if (!domain.trim()) {
      toast({
        title: "Domain required",
        description: "Please enter a domain name to lookup.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Real WHOIS lookup using a free API
      const cleanDomain = domain.trim();
      const response = await fetch(`https://api.whoisfreaks.com/v1.0/whois?apiKey=demo&whois=live&domainName=${cleanDomain}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch WHOIS data');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResult({
        domain: cleanDomain,
        registrar: data.registrar_info?.registrar_name || 'N/A',
        registrationDate: data.create_date || 'N/A',
        expirationDate: data.expire_date || 'N/A',
        nameservers: data.name_servers || [],
        status: data.domain_status?.[0] || 'N/A',
        owner: data.registrant_info?.name || 'Private/Protected',
        organization: data.registrant_info?.organization || 'N/A',
        country: data.registrant_info?.country || 'N/A',
        updatedDate: data.update_date || 'N/A'
      });

      toast({
        title: "Success",
        description: "WHOIS lookup completed successfully!",
      });
    } catch (error) {
      console.error('WHOIS lookup error:', error);
      toast({
        title: "Error",
        description: "Failed to perform WHOIS lookup. The domain may not exist or WHOIS data is not available.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                <Button onClick={performLookup} disabled={!domain.trim() || isLoading}>
                  <Search className="mr-2 h-4 w-4" />
                  {isLoading ? "Looking up..." : "Lookup Domain"}
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
                      <span>{result.registrationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated:</span>
                      <span>{result.updatedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{result.expirationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Owner:</span>
                      <span>{result.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Organization:</span>
                      <span>{result.organization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Country:</span>
                      <span>{result.country}</span>
                    </div>
                    {result.nameservers && result.nameservers.length > 0 && (
                      <div className="flex justify-between">
                        <span>Name Servers:</span>
                        <span className="text-right">{Array.isArray(result.nameservers) ? result.nameservers.join(', ') : result.nameservers}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-blue-600 mt-4">
                    ℹ️ Real WHOIS data retrieved from registry databases.
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
