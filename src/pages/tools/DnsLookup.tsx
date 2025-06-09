
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Server, Search } from "lucide-react";
import SEO from "@/components/SEO";

const DnsLookup = () => {
  const [domain, setDomain] = useState("");
  const [records, setRecords] = useState<any>(null);
  const { toast } = useToast();

  const performLookup = () => {
    if (!domain.trim()) {
      toast({
        title: "Domain required",
        description: "Please enter a domain name for DNS lookup.",
        variant: "destructive",
      });
      return;
    }

    // Mock DNS records for demo
    setRecords({
      A: ["192.168.1.1", "192.168.1.2"],
      AAAA: ["2001:db8::1"],
      MX: ["10 mail.example.com"],
      TXT: ["v=spf1 include:_spf.google.com ~all"],
      NS: ["ns1.example.com", "ns2.example.com"],
    });

    toast({
      title: "DNS lookup complete",
      description: "DNS records retrieved. (Demo data)",
    });
  };

  return (
    <>
      <SEO
        title="DNS Lookup - Check DNS Records Online Free"
        description="Perform DNS lookup to check A, AAAA, MX, TXT, NS, and other DNS records for any domain name."
        keywords="DNS lookup, DNS records, domain lookup, DNS checker, DNS resolver, nameserver lookup"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              DNS Lookup
            </h1>
            <p className="text-lg text-gray-600">
              Check DNS records and nameserver information for any domain
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  DNS Lookup
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
                  Lookup DNS Records
                </Button>
              </CardContent>
            </Card>

            {records && (
              <Card>
                <CardHeader>
                  <CardTitle>DNS Records</CardTitle>
                  <CardDescription>DNS information for {domain}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(records).map(([type, values]: [string, any]) => (
                      <div key={type} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold">{type} Records</h4>
                        <div className="text-sm text-gray-600 font-mono">
                          {Array.isArray(values) ? values.join('\n') : values}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    This is demo data. Real DNS lookup coming soon...
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

export default DnsLookup;
