
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
      // rdap.org proxies to the authoritative RDAP server for each TLD.
      // It's free, no API key, and returns real registration data.
      const cleanDomain = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
      const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(cleanDomain)}`);
      if (response.status === 404) throw new Error("Domain not found in RDAP registry.");
      if (!response.ok) throw new Error(`RDAP returned ${response.status}`);
      const data = await response.json();

      const events: any[] = data.events || [];
      const findEvent = (action: string) => events.find((e) => e.eventAction === action)?.eventDate || "N/A";
      const registrarEntity = (data.entities || []).find((e: any) => (e.roles || []).includes("registrar"));
      const registrarName =
        registrarEntity?.vcardArray?.[1]?.find((f: any) => f[0] === "fn")?.[3] || "N/A";
      const registrantEntity = (data.entities || []).find((e: any) => (e.roles || []).includes("registrant"));
      const registrantVcard = registrantEntity?.vcardArray?.[1] || [];
      const getV = (key: string) => registrantVcard.find((f: any) => f[0] === key)?.[3] || "N/A";
      const adr = registrantVcard.find((f: any) => f[0] === "adr")?.[3] || [];

      setResult({
        domain: cleanDomain,
        registrar: registrarName,
        registrationDate: findEvent("registration"),
        expirationDate: findEvent("expiration"),
        updatedDate: findEvent("last changed"),
        nameservers: (data.nameservers || []).map((n: any) => n.ldhName),
        status: (data.status || []).join(", ") || "N/A",
        owner: getV("fn"),
        organization: getV("org"),
        country: Array.isArray(adr) ? adr[adr.length - 1] || "N/A" : "N/A",
      });
      toast({ title: "Success", description: "WHOIS/RDAP lookup completed." });
    } catch (error) {
      console.error("WHOIS lookup error:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to perform WHOIS lookup.",
        variant: "destructive",
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
