
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Search } from "lucide-react";
import SEO from "@/components/SEO";

const IpGeolocation = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = useState<any>(null);
  const { toast } = useToast();

  const lookupLocation = () => {
    if (!ipAddress.trim()) {
      toast({
        title: "IP address required",
        description: "Please enter an IP address to lookup its location.",
        variant: "destructive",
      });
      return;
    }

    // Mock geolocation data for demo
    setLocation({
      ip: ipAddress,
      country: "United States",
      region: "California",
      city: "San Francisco",
      latitude: "37.7749",
      longitude: "-122.4194",
      timezone: "America/Los_Angeles",
      isp: "Demo ISP",
    });

    toast({
      title: "Location found",
      description: "IP geolocation data retrieved. (Demo data)",
    });
  };

  const getMyLocation = () => {
    setIpAddress("Your IP");
    setLocation({
      ip: "Your IP Address",
      country: "Your Country",
      region: "Your Region",
      city: "Your City",
      latitude: "Your Latitude",
      longitude: "Your Longitude",
      timezone: "Your Timezone",
      isp: "Your ISP",
    });

    toast({
      title: "Your location",
      description: "Showing your approximate location. (Demo data)",
    });
  };

  return (
    <>
      <SEO
        title="IP Geolocation - Find IP Address Location Online Free"
        description="Find the geographic location of any IP address. Get country, region, city, and ISP information for IP addresses."
        keywords="IP geolocation, IP location, IP address lookup, IP tracker, find IP location, IP to location"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              IP Geolocation
            </h1>
            <p className="text-lg text-gray-600">
              Find the geographic location of any IP address
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  IP Address Lookup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="192.168.1.1"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && lookupLocation()}
                />
                <div className="flex gap-2">
                  <Button onClick={lookupLocation} disabled={!ipAddress.trim()}>
                    <Search className="mr-2 h-4 w-4" />
                    Lookup Location
                  </Button>
                  <Button variant="outline" onClick={getMyLocation}>
                    My Location
                  </Button>
                </div>
              </CardContent>
            </Card>

            {location && (
              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                  <CardDescription>Geographic details for {location.ip}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>IP Address:</span>
                      <span className="font-mono">{location.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Country:</span>
                      <span>{location.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Region:</span>
                      <span>{location.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>City:</span>
                      <span>{location.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coordinates:</span>
                      <span>{location.latitude}, {location.longitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timezone:</span>
                      <span>{location.timezone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ISP:</span>
                      <span>{location.isp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    This is demo data. Real IP geolocation coming soon...
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

export default IpGeolocation;
