
import React, { useState, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInYears, differenceInMonths, differenceInDays, addYears, isValid, parse } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
}

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date>(new Date());
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  
  // Calculate age whenever dates change
  useEffect(() => {
    if (birthDate) {
      calculateAge();
    }
  }, [birthDate, toDate]);
  
  const calculateAge = () => {
    if (!birthDate || !isValid(birthDate) || !isValid(toDate)) {
      setAgeResult(null);
      return;
    }
    
    // Check if birth date is in the future compared to "to date"
    if (birthDate > toDate) {
      setAgeResult(null);
      return;
    }
    
    // Calculate years, months, and days
    const years = differenceInYears(toDate, birthDate);
    
    // Calculate remaining months after subtracting years
    const dateAfterYears = addYears(birthDate, years);
    const months = differenceInMonths(toDate, dateAfterYears);
    
    // Calculate remaining days
    const dateAfterMonths = new Date(dateAfterYears);
    dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months);
    const days = differenceInDays(toDate, dateAfterMonths);
    
    // Calculate total values
    const totalMonths = differenceInMonths(toDate, birthDate);
    const totalDays = differenceInDays(toDate, birthDate);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    
    setAgeResult({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
    });
  };
  
  const resetCalculator = () => {
    setBirthDate(undefined);
    setToDate(new Date());
    setAgeResult(null);
  };
  
  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date || !isValid(date)) return "";
    return format(date, "MMMM d, yyyy");
  };
  
  return (
    <ToolPageTemplate
      title="Age Calculator"
      description="Calculate exact age in years, months, days, and more from any birth date"
      keywords="age calculator, birthday calculator, date difference calculator, exact age, date calculator, age in days, years calculator"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Dates</h2>
            
            <div>
              <Label htmlFor="birth-date" className="mb-2 block">Birth Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id="birth-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? formatDate(birthDate) : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={(date) => {
                      setBirthDate(date);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="to-date" className="mb-2 block">To Date (Default: Today)</Label>
              <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id="to-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(toDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => {
                      if (date) setToDate(date);
                      setToDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="pt-4">
              <Button onClick={resetCalculator} variant="outline" className="mr-2">
                Reset
              </Button>
              <Button onClick={calculateAge} disabled={!birthDate}>
                Calculate Age
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {ageResult ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Age Results</h2>
                
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 mb-4">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-gray-500 text-sm mb-1">Exact Age</h3>
                      <p className="text-2xl font-bold">
                        {ageResult.years} years, {ageResult.months} months, {ageResult.days} days
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-gray-500 text-xs">Total Years</h3>
                        <p className="text-xl font-semibold">{ageResult.years}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-gray-500 text-xs">Total Months</h3>
                        <p className="text-xl font-semibold">{ageResult.totalMonths}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-gray-500 text-xs">Total Weeks</h3>
                        <p className="text-xl font-semibold">{ageResult.totalWeeks}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-gray-500 text-xs">Total Days</h3>
                        <p className="text-xl font-semibold">{ageResult.totalDays}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <h3 className="text-gray-500 text-xs">Hours</h3>
                          <p className="font-medium">{ageResult.totalHours.toLocaleString()}</p>
                        </div>
                        <div>
                          <h3 className="text-gray-500 text-xs">Minutes</h3>
                          <p className="font-medium">{ageResult.totalMinutes.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {birthDate && toDate && (
                  <div className="text-sm text-gray-500 mt-4">
                    Age calculated from {formatDate(birthDate)} to {formatDate(toDate)}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Clock className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">Age Results Will Appear Here</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Select a birth date to calculate your age or time between two dates
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Age Calculator Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-medium mb-2">Precise Age Calculation</h3>
                <p className="text-sm text-gray-600">
                  Calculate your exact age in years, months, and days with our accurate age calculator.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-medium mb-2">Multiple Time Units</h3>
                <p className="text-sm text-gray-600">
                  View your age in various units including total months, weeks, days, hours, and minutes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-medium mb-2">Date Comparison</h3>
                <p className="text-sm text-gray-600">
                  Compare any two dates to find the precise time duration between them.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default AgeCalculator;
