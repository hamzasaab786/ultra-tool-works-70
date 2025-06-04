
import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hash, Copy, RefreshCw, Info, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UuidGenerator = () => {
  const [uuidType, setUuidType] = useState("v4");
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("1");

  const generateUUID = (version: string = "v4") => {
    switch (version) {
      case "v1":
        // Simplified v1 UUID (timestamp-based)
        const timestamp = Date.now().toString(16);
        const random = Math.random().toString(16).substr(2, 8);
        return `${timestamp.substr(0, 8)}-${timestamp.substr(8, 4)}-1${timestamp.substr(12, 3)}-${random.substr(0, 4)}-${random.substr(4, 12)}`;
      
      case "v4":
      default:
        // Standard v4 UUID (random)
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
  };

  const handleGenerate = () => {
    const count = parseInt(quantity);
    const newUuids = Array.from({ length: count }, () => generateUUID(uuidType));
    setGeneratedUuids(newUuids);
    
    toast({
      title: "UUIDs Generated",
      description: `Generated ${count} ${uuidType.toUpperCase()} UUID${count > 1 ? 's' : ''}`,
    });
  };

  const copyToClipboard = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      toast({
        title: "Copied",
        description: "UUID copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const copyAllToClipboard = async () => {
    try {
      const allUuids = generatedUuids.join('\n');
      await navigator.clipboard.writeText(allUuids);
      toast({
        title: "Copied",
        description: `All ${generatedUuids.length} UUIDs copied to clipboard`,
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <ToolPageTemplate
      title="UUID Generator"
      description="Generate unique identifiers (UUIDs) for your applications, databases, and projects with multiple version support"
      keywords="uuid generator, unique identifier, guid generator, v4 uuid, random id"
    >
      <div className="space-y-6">
        {/* Generator Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Hash className="h-5 w-5 text-blue-600" />
            UUID Generation Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                UUID Version
              </Label>
              <Select value={uuidType} onValueChange={setUuidType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select UUID version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v4">Version 4 (Random)</SelectItem>
                  <SelectItem value="v1">Version 1 (Timestamp)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Quantity
              </Label>
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger>
                  <SelectValue placeholder="Number of UUIDs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 UUID</SelectItem>
                  <SelectItem value="5">5 UUIDs</SelectItem>
                  <SelectItem value="10">10 UUIDs</SelectItem>
                  <SelectItem value="25">25 UUIDs</SelectItem>
                  <SelectItem value="50">50 UUIDs</SelectItem>
                  <SelectItem value="100">100 UUIDs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
          >
            <Hash className="mr-2 h-5 w-5" /> 
            Generate UUID{parseInt(quantity) > 1 ? 's' : ''}
          </Button>
        </div>

        {/* Generated UUIDs */}
        {generatedUuids.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Hash className="h-5 w-5 text-green-600" />
                Generated UUIDs ({generatedUuids.length})
              </h3>
              {generatedUuids.length > 1 && (
                <Button 
                  onClick={copyAllToClipboard} 
                  variant="outline"
                  size="sm"
                >
                  <Copy className="mr-1 h-4 w-4" /> 
                  Copy All
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {generatedUuids.map((uuid, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <code className="text-sm font-mono text-gray-800 flex-1 mr-3">
                    {uuid}
                  </code>
                  <Button 
                    onClick={() => copyToClipboard(uuid)}
                    size="sm"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-3">
              <Button 
                onClick={handleGenerate} 
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> 
                Generate New Set
              </Button>
            </div>
          </div>
        )}

        {/* UUID Info */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">UUID Version Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <h5 className="font-medium mb-1">Version 4 (Random):</h5>
                  <ul className="space-y-1">
                    <li>• Completely random generation</li>
                    <li>• Most commonly used</li>
                    <li>• 122 bits of randomness</li>
                    <li>• Best for general purposes</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Version 1 (Timestamp):</h5>
                  <ul className="space-y-1">
                    <li>• Based on timestamp and MAC</li>
                    <li>• Chronologically sortable</li>
                    <li>• Contains time information</li>
                    <li>• Good for ordered data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Common Use Cases</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h5 className="font-medium mb-1">✓ Development:</h5>
                  <ul className="space-y-1">
                    <li>• Database primary keys</li>
                    <li>• API request tracking</li>
                    <li>• Session identifiers</li>
                    <li>• File naming</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">✓ Applications:</h5>
                  <ul className="space-y-1">
                    <li>• User account IDs</li>
                    <li>• Transaction references</li>
                    <li>• Document versioning</li>
                    <li>• Distributed systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default UuidGenerator;
