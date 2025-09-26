
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const performLookup = async () => {
    if (!domain.trim()) {
      toast({
        title: "Domain required",
        description: "Please enter a domain name for DNS lookup.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Real DNS lookup using Google's DNS-over-HTTPS API
      const cleanDomain = domain.trim();
      const dnsResults: any = {};
      
      // Query different record types
      const recordTypes = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME'];
      
      for (const type of recordTypes) {
        try {
          const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${type}`, {
            headers: {
              'Accept': 'application/dns-json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.Answer && data.Answer.length > 0) {
              if (type === 'MX') {
                dnsResults[type] = data.Answer.map((record: any) => 
                  `${record.data.split(' ')[1]} (Priority: ${record.data.split(' ')[0]})`
                ).join(', ');
              } else if (type === 'TXT') {
                dnsResults[type] = data.Answer.map((record: any) => 
                  record.data.replace(/"/g, '')
                ).join('; ');
              } else {
                dnsResults[type] = data.Answer.map((record: any) => record.data).join(', ');
              }
            }
          }
        } catch (err) {
          console.warn(`Failed to lookup ${type} record for ${cleanDomain}`);
        }
      }
      
      if (Object.keys(dnsResults).length === 0) {
        throw new Error('No DNS records found');
      }
      
      setRecords({
        domain: cleanDomain,
        ...dnsResults
      });

      toast({
        title: "Success",
        description: "DNS lookup completed successfully!",
      });
    } catch (error) {
      console.error('DNS lookup error:', error);
      toast({
        title: "Error", 
        description: "Failed to perform DNS lookup. Please check the domain name.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                <Button onClick={performLookup} disabled={!domain.trim() || isLoading}>
                  <Search className="mr-2 h-4 w-4" />
                  {isLoading ? "Looking up..." : "Lookup DNS Records"}
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
                      type !== 'domain' && (
                        <div key={type} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold">{type} Records</h4>
                          <div className="text-sm text-gray-600 font-mono whitespace-pre-wrap">
                            {Array.isArray(values) ? values.join('\n') : values}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                  <p className="text-sm text-blue-600 mt-4">
                    ℹ️ Real DNS records retrieved using Google's DNS service.
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
