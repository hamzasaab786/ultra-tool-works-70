
import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Calculator } from "lucide-react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
}

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const { toast } = useToast();

  const calculateAge = () => {
    if (!birthDate) {
      toast({
        title: "Error",
        description: "Please enter your birth date",
        variant: "destructive"
      });
      return;
    }

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) {
      toast({
        title: "Error",
        description: "Birth date cannot be after the target date",
        variant: "destructive"
      });
      return;
    }

    // Calculate age
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate totals
    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    setAgeResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths
    });

    toast({
      title: "Success",
      description: "Age calculated successfully!",
    });
  };

  const resetCalculator = () => {
    setBirthDate("");
    setTargetDate(new Date().toISOString().split('T')[0]);
    setAgeResult(null);
  };

  return (
    <ToolPageTemplate
      title="Age Calculator"
      description="Calculate exact age between any two dates with detailed breakdown"
      keywords="age calculator, calculate age, date difference, age in years months days"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="birth-date" className="text-lg font-medium">
              Birth Date
            </Label>
            <Input
              id="birth-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-date" className="text-lg font-medium">
              Calculate Age On
            </Label>
            <Input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={calculateAge}
            disabled={!birthDate}
            className="flex-1 h-12 text-base"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculate Age
          </Button>
          
          <Button
            variant="outline"
            onClick={resetCalculator}
            className="h-12"
          >
            Reset
          </Button>
        </div>

        {ageResult && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="mr-2 h-6 w-6" />
                  Age Calculation Result
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">{ageResult.years}</div>
                    <div className="text-sm text-gray-600">Years</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-green-600">{ageResult.months}</div>
                    <div className="text-sm text-gray-600">Months</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">{ageResult.days}</div>
                    <div className="text-sm text-gray-600">Days</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Detailed Breakdown:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Total Days:</span>
                      <div className="text-lg font-bold text-gray-700">{ageResult.totalDays.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="font-medium">Total Weeks:</span>
                      <div className="text-lg font-bold text-gray-700">{ageResult.totalWeeks.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="font-medium">Total Months:</span>
                      <div className="text-lg font-bold text-gray-700">{ageResult.totalMonths}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Calculator Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Precise age calculation in years, months, and days</li>
            <li>• Total counts in days, weeks, and months</li>
            <li>• Calculate age on any specific date</li>
            <li>• Perfect for official documents and applications</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default AgeCalculator;
