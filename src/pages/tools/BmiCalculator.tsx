
import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, RotateCcw, Scale } from "lucide-react";
import SEO from "@/components/SEO";

interface BMIResult {
  bmi: number;
  category: string;
  description: string;
  color: string;
  healthyRange: string;
}

const BmiCalculator = () => {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [heightUnit, setHeightUnit] = useState<string>("cm");
  const [result, setResult] = useState<BMIResult | null>(null);
  
  const getBMICategory = (bmi: number): Omit<BMIResult, 'bmi'> => {
    if (bmi < 18.5) {
      return {
        category: "Underweight",
        description: "Below normal weight range",
        color: "blue",
        healthyRange: "18.5 - 24.9"
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        category: "Normal weight",
        description: "Healthy weight range",
        color: "green",
        healthyRange: "18.5 - 24.9"
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        category: "Overweight",
        description: "Above normal weight range",
        color: "yellow",
        healthyRange: "18.5 - 24.9"
      };
    } else {
      return {
        category: "Obese",
        description: "Significantly above normal weight range",
        color: "red",
        healthyRange: "18.5 - 24.9"
      };
    }
  };
  
  const calculateBMI = () => {
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);
    
    if (!weightValue || !heightValue || weightValue <= 0 || heightValue <= 0) {
      return;
    }
    
    // Convert to metric units
    let weightKg = weightValue;
    let heightM = heightValue;
    
    if (weightUnit === "lbs") {
      weightKg = weightValue * 0.453592; // Convert pounds to kg
    }
    
    if (heightUnit === "ft") {
      heightM = heightValue * 0.3048; // Convert feet to meters
    } else if (heightUnit === "in") {
      heightM = heightValue * 0.0254; // Convert inches to meters
    } else if (heightUnit === "cm") {
      heightM = heightValue / 100; // Convert cm to meters
    }
    
    const bmi = weightKg / (heightM * heightM);
    const category = getBMICategory(bmi);
    
    setResult({
      bmi: Math.round(bmi * 10) / 10, // Round to 1 decimal place
      ...category
    });
  };
  
  const reset = () => {
    setWeight("");
    setHeight("");
    setResult(null);
  };
  
  const getBadgeVariant = (color: string) => {
    switch (color) {
      case "green": return "default";
      case "yellow": return "secondary";
      case "red": return "destructive";
      case "blue": return "outline";
      default: return "secondary";
    }
  };
  
  return (
    <>
      <SEO
        title="BMI Calculator - Calculate Body Mass Index Online Free | Klipza"
        description="Calculate your BMI (Body Mass Index) and check if you're in a healthy weight range. Support for metric and imperial units."
        keywords="bmi calculator, body mass index, weight calculator, health calculator"
        canonicalUrl="https://klipza.live/tools/bmi-calculator"
      />
      
      <ToolPageTemplate
        title="BMI Calculator"
        description="Calculate your Body Mass Index and check your health status"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                BMI Calculation
              </CardTitle>
              <CardDescription>
                Enter your weight and height to calculate your Body Mass Index
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <div className="flex gap-2">
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={weightUnit} onValueChange={setWeightUnit}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <div className="flex gap-2">
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={heightUnit} onValueChange={setHeightUnit}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="ft">ft</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={calculateBMI} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate BMI
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Your BMI Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{result.bmi}</div>
                  <Badge variant={getBadgeVariant(result.color)} className="text-sm">
                    {result.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">{result.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-1">Your BMI</div>
                    <div className="text-2xl font-bold">{result.bmi}</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-1">Healthy Range</div>
                    <div className="text-2xl font-bold">{result.healthyRange}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>BMI Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span>Underweight</span>
                  <Badge variant="outline">Below 18.5</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>Normal weight</span>
                  <Badge variant="default">18.5 - 24.9</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <span>Overweight</span>
                  <Badge variant="secondary">25 - 29.9</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span>Obese</span>
                  <Badge variant="destructive">30 and above</Badge>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> BMI is a useful measure of overweight and obesity, but it doesn't directly measure body fat. 
                  Consult with a healthcare provider for a comprehensive health assessment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default BmiCalculator;
