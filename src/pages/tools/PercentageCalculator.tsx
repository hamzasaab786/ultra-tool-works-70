
import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent, Calculator } from "lucide-react";

const PercentageCalculator = () => {
  // State for "What is X% of Y?" calculation
  const [percentageOf, setPercentageOf] = useState({
    percentage: '',
    value: '',
    result: null as number | null
  });

  // State for "X is what % of Y?" calculation
  const [whatPercent, setWhatPercent] = useState({
    part: '',
    whole: '',
    result: null as number | null
  });

  // State for "Percentage Change" calculation
  const [percentageChange, setPercentageChange] = useState({
    oldValue: '',
    newValue: '',
    result: null as number | null,
    changeType: '' as 'increase' | 'decrease' | ''
  });

  const calculatePercentageOf = () => {
    const percent = parseFloat(percentageOf.percentage);
    const value = parseFloat(percentageOf.value);
    
    if (isNaN(percent) || isNaN(value)) {
      alert('Please enter valid numbers');
      return;
    }
    
    const result = (percent / 100) * value;
    setPercentageOf(prev => ({ ...prev, result }));
  };

  const calculateWhatPercent = () => {
    const part = parseFloat(whatPercent.part);
    const whole = parseFloat(whatPercent.whole);
    
    if (isNaN(part) || isNaN(whole) || whole === 0) {
      alert('Please enter valid numbers (whole cannot be zero)');
      return;
    }
    
    const result = (part / whole) * 100;
    setWhatPercent(prev => ({ ...prev, result }));
  };

  const calculatePercentageChange = () => {
    const oldVal = parseFloat(percentageChange.oldValue);
    const newVal = parseFloat(percentageChange.newValue);
    
    if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) {
      alert('Please enter valid numbers (old value cannot be zero)');
      return;
    }
    
    const result = ((newVal - oldVal) / oldVal) * 100;
    const changeType = result >= 0 ? 'increase' : 'decrease';
    
    setPercentageChange(prev => ({ 
      ...prev, 
      result: Math.abs(result), 
      changeType 
    }));
  };

  const resetCalculation = (type: string) => {
    switch (type) {
      case 'percentage-of':
        setPercentageOf({ percentage: '', value: '', result: null });
        break;
      case 'what-percent':
        setWhatPercent({ part: '', whole: '', result: null });
        break;
      case 'percentage-change':
        setPercentageChange({ oldValue: '', newValue: '', result: null, changeType: '' });
        break;
    }
  };

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5" />
                Calculate X% of Y
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <Label htmlFor="percent">Percentage (%)</Label>
                  <div className="relative mt-2">
                    <Input 
                      id="percent" 
                      type="number"
                      placeholder="Enter percentage" 
                      value={percentageOf.percentage}
                      onChange={(e) => setPercentageOf(prev => ({ ...prev, percentage: e.target.value }))}
                    />
                    <Percent className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input 
                    id="value" 
                    type="number"
                    placeholder="Enter value" 
                    className="mt-2" 
                    value={percentageOf.value}
                    onChange={(e) => setPercentageOf(prev => ({ ...prev, value: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculatePercentageOf} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={() => resetCalculation('percentage-of')}>
                  Reset
                </Button>
              </div>
              {percentageOf.result !== null && (
                <Alert>
                  <AlertDescription className="text-lg font-semibold">
                    {percentageOf.percentage}% of {percentageOf.value} = <span className="text-green-600">{percentageOf.result.toFixed(2)}</span>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="is-what-percent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5" />
                X is what % of Y?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="part">Part (X)</Label>
                  <Input 
                    id="part" 
                    type="number"
                    placeholder="Enter part value" 
                    className="mt-2" 
                    value={whatPercent.part}
                    onChange={(e) => setWhatPercent(prev => ({ ...prev, part: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="whole">Whole (Y)</Label>
                  <Input 
                    id="whole" 
                    type="number"
                    placeholder="Enter whole value" 
                    className="mt-2" 
                    value={whatPercent.whole}
                    onChange={(e) => setWhatPercent(prev => ({ ...prev, whole: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculateWhatPercent} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={() => resetCalculation('what-percent')}>
                  Reset
                </Button>
              </div>
              {whatPercent.result !== null && (
                <Alert>
                  <AlertDescription className="text-lg font-semibold">
                    {whatPercent.part} is <span className="text-green-600">{whatPercent.result.toFixed(2)}%</span> of {whatPercent.whole}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="percentage-change" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5" />
                Percentage Change Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="old">Old Value</Label>
                  <Input 
                    id="old" 
                    type="number"
                    placeholder="Enter old value" 
                    className="mt-2" 
                    value={percentageChange.oldValue}
                    onChange={(e) => setPercentageChange(prev => ({ ...prev, oldValue: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="new">New Value</Label>
                  <Input 
                    id="new" 
                    type="number"
                    placeholder="Enter new value" 
                    className="mt-2" 
                    value={percentageChange.newValue}
                    onChange={(e) => setPercentageChange(prev => ({ ...prev, newValue: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculatePercentageChange} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={() => resetCalculation('percentage-change')}>
                  Reset
                </Button>
              </div>
              {percentageChange.result !== null && (
                <Alert>
                  <AlertDescription className="text-lg font-semibold">
                    Change from {percentageChange.oldValue} to {percentageChange.newValue} is a{' '}
                    <span className={`${percentageChange.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {percentageChange.result.toFixed(2)}% {percentageChange.changeType}
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Alert className="mt-6">
        <Calculator className="h-4 w-4" />
        <AlertDescription>
          This percentage calculator supports all common percentage calculations including finding percentages, 
          calculating what percent one number is of another, and determining percentage changes between values.
        </AlertDescription>
      </Alert>
    </ToolPageTemplate>
  );
};

export default PercentageCalculator;
