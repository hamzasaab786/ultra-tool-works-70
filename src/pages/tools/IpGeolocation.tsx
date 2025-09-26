
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const lookupLocation = async () => {
    if (!ipAddress.trim()) {
      toast({
        title: "IP address required",
        description: "Please enter an IP address to lookup its location.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const cleanIP = ipAddress.trim();
      
      // Use ipapi.co free API for IP geolocation
      const response = await fetch(`https://ipapi.co/${cleanIP}/json/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address');
      }
      
      setLocation({
        ip: data.ip,
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        latitude: data.latitude || 'Unknown',
        longitude: data.longitude || 'Unknown',
        timezone: data.timezone || 'Unknown',
        isp: data.org || 'Unknown',
        postalCode: data.postal || 'Unknown',
        countryCode: data.country_code || 'Unknown'
      });

      toast({
        title: "Success",
        description: "IP geolocation lookup completed successfully!",
      });
    } catch (error) {
      console.error('IP geolocation error:', error);
      toast({
        title: "Error",
        description: "Failed to lookup IP location. Please check the IP address.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMyLocation = async () => {
    setIsLoading(true);
    
    try {
      // Get user's IP automatically
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch your location');
      }
      
      const data = await response.json();
      
      setIpAddress(data.ip);
      setLocation({
        ip: data.ip,
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        latitude: data.latitude || 'Unknown',
        longitude: data.longitude || 'Unknown',
        timezone: data.timezone || 'Unknown',
        isp: data.org || 'Unknown',
        postalCode: data.postal || 'Unknown',
        countryCode: data.country_code || 'Unknown'
      });
      
      toast({
        title: "Success",
        description: "Your location has been detected!",
      });
    } catch (error) {
      console.error('Error getting user location:', error);
      toast({
        title: "Error",
        description: "Failed to detect your location.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                  <Button onClick={lookupLocation} disabled={!ipAddress.trim() || isLoading}>
                    <Search className="mr-2 h-4 w-4" />
                    {isLoading ? "Looking up..." : "Lookup Location"}
                  </Button>
                  <Button variant="outline" onClick={getMyLocation} disabled={isLoading}>
                    {isLoading ? "Detecting..." : "My Location"}
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
                      <span>{location.country} ({location.countryCode})</span>
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
                      <span>Postal Code:</span>
                      <span>{location.postalCode}</span>
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
                  <p className="text-sm text-blue-600 mt-4">
                    ℹ️ Real IP geolocation data provided by ipapi.co service.
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
