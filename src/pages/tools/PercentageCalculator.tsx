
import React from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Percent } from "lucide-react";

const PercentageCalculator = () => {
  return (
    <ToolPageTemplate
      title="Percentage Calculator"
      description="Calculate percentages easily with this free online tool"
    >
      <Tabs defaultValue="percentage-of">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="percentage-of">What is X% of Y?</TabsTrigger>
          <TabsTrigger value="is-what-percent">X is what % of Y?</TabsTrigger>
          <TabsTrigger value="percentage-change">Percentage Change</TabsTrigger>
        </TabsList>
        
        <TabsContent value="percentage-of" className="space-y-4">
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="percent">Percentage (%)</Label>
              <div className="relative mt-2">
                <Input id="percent" placeholder="Enter percentage" />
                <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input id="value" placeholder="Enter value" className="mt-2" />
            </div>
          </div>
          <Button className="w-full">Calculate</Button>
        </TabsContent>
        
        <TabsContent value="is-what-percent" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="part">Part</Label>
              <Input id="part" placeholder="Enter part value" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="whole">Whole</Label>
              <Input id="whole" placeholder="Enter whole value" className="mt-2" />
            </div>
          </div>
          <Button className="w-full">Calculate</Button>
        </TabsContent>
        
        <TabsContent value="percentage-change" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="old">Old Value</Label>
              <Input id="old" placeholder="Enter old value" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="new">New Value</Label>
              <Input id="new" placeholder="Enter new value" className="mt-2" />
            </div>
          </div>
          <Button className="w-full">Calculate</Button>
        </TabsContent>
      </Tabs>
      
      <Alert className="mt-4">
        <AlertDescription>
          This tool is currently under development. Full functionality coming soon!
        </AlertDescription>
      </Alert>
    </ToolPageTemplate>
  );
};

export default PercentageCalculator;
