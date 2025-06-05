
import React, { useState, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, RotateCcw, Users, DollarSign } from "lucide-react";
import SEO from "@/components/SEO";

interface TipResult {
  billAmount: number;
  tipPercentage: number;
  tipAmount: number;
  totalAmount: number;
  perPersonAmount: number;
  perPersonTip: number;
}

const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState<string>("");
  const [tipPercentage, setTipPercentage] = useState<number>(18);
  const [numberOfPeople, setNumberOfPeople] = useState<string>("1");
  const [result, setResult] = useState<TipResult | null>(null);
  
  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const people = parseInt(numberOfPeople) || 1;
    
    if (!bill || bill <= 0) {
      return;
    }
    
    const tipAmount = (bill * tipPercentage) / 100;
    const totalAmount = bill + tipAmount;
    const perPersonAmount = totalAmount / people;
    const perPersonTip = tipAmount / people;
    
    setResult({
      billAmount: bill,
      tipPercentage,
      tipAmount,
      totalAmount,
      perPersonAmount,
      perPersonTip
    });
  };
  
  const reset = () => {
    setBillAmount("");
    setTipPercentage(18);
    setNumberOfPeople("1");
    setResult(null);
  };
  
  const quickTipOptions = [10, 15, 18, 20, 25];
  
  // Auto-calculate when values change
  useEffect(() => {
    if (billAmount && parseFloat(billAmount) > 0) {
      calculateTip();
    }
  }, [billAmount, tipPercentage, numberOfPeople]);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <>
      <SEO
        title="Tip Calculator - Calculate Tips and Split Bills Online Free | ToolifyConvert"
        description="Calculate tips and split restaurant bills easily. Perfect for dining out with friends and family."
        keywords="tip calculator, bill splitter, restaurant calculator, tip percentage"
        canonicalUrl="https://toolifyconvert.com/tools/tip-calculator"
      />
      
      <ToolPageTemplate
        title="Tip Calculator"
        description="Calculate tips and split bills easily for dining out"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Bill Information
              </CardTitle>
              <CardDescription>
                Enter your bill details to calculate tip and split amounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="billAmount">Bill Amount ($)</Label>
                <Input
                  id="billAmount"
                  type="number"
                  placeholder="0.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tip Percentage: {tipPercentage}%</Label>
                <div className="flex gap-2 mb-3">
                  {quickTipOptions.map((percentage) => (
                    <Button
                      key={percentage}
                      variant={tipPercentage === percentage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTipPercentage(percentage)}
                    >
                      {percentage}%
                    </Button>
                  ))}
                </div>
                <Input
                  type="range"
                  min="0"
                  max="30"
                  value={tipPercentage}
                  onChange={(e) => setTipPercentage(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>15%</span>
                  <span>30%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numberOfPeople" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Number of People
                </Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                />
              </div>
              
              <Button variant="outline" onClick={reset} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </CardContent>
          </Card>
          
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Bill</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bill Amount:</span>
                      <span className="font-medium">{formatCurrency(result.billAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tip ({result.tipPercentage}%):</span>
                      <span className="font-medium text-green-600">{formatCurrency(result.tipAmount)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(result.totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Per Person ({numberOfPeople} {parseInt(numberOfPeople) === 1 ? 'person' : 'people'})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount per person:</span>
                      <span className="font-medium">{formatCurrency(result.perPersonAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tip per person:</span>
                      <span className="font-medium text-green-600">{formatCurrency(result.perPersonTip)}</span>
                    </div>
                    <hr />
                    <div className="text-center">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {formatCurrency(result.perPersonAmount)} each
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Tip Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Restaurant Service</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Poor service:</span>
                      <Badge variant="outline">10-12%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Average service:</span>
                      <Badge variant="secondary">15-18%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Good service:</span>
                      <Badge variant="default">18-20%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Excellent service:</span>
                      <Badge variant="default">20-25%</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Other Services</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <Badge variant="outline">10-15%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxi/Rideshare:</span>
                      <Badge variant="outline">10-15%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Hairdresser:</span>
                      <Badge variant="secondary">15-20%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Hotel housekeeping:</span>
                      <Badge variant="outline">$2-5/day</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default TipCalculator;
