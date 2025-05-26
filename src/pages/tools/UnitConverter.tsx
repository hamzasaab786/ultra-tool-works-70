
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, ArrowUpDown } from "lucide-react";

const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState<'length' | 'weight' | 'temperature'>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const units = {
    length: {
      m: { name: 'Meters', factor: 1 },
      km: { name: 'Kilometers', factor: 1000 },
      cm: { name: 'Centimeters', factor: 0.01 },
      mm: { name: 'Millimeters', factor: 0.001 },
      ft: { name: 'Feet', factor: 0.3048 },
      in: { name: 'Inches', factor: 0.0254 },
      yd: { name: 'Yards', factor: 0.9144 },
      mi: { name: 'Miles', factor: 1609.34 }
    },
    weight: {
      kg: { name: 'Kilograms', factor: 1 },
      g: { name: 'Grams', factor: 0.001 },
      lb: { name: 'Pounds', factor: 0.453592 },
      oz: { name: 'Ounces', factor: 0.0283495 },
      ton: { name: 'Metric Tons', factor: 1000 },
      st: { name: 'Stones', factor: 6.35029 }
    },
    temperature: {
      c: { name: 'Celsius', factor: 1 },
      f: { name: 'Fahrenheit', factor: 1 },
      k: { name: 'Kelvin', factor: 1 }
    }
  };

  React.useEffect(() => {
    const categoryUnits = Object.keys(units[selectedCategory]);
    setFromUnit(categoryUnits[0] || '');
    setToUnit(categoryUnits[1] || categoryUnits[0] || '');
    setInputValue('');
    setResult('');
  }, [selectedCategory]);

  const convertTemperature = useCallback((value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius = value;
    if (from === 'f') celsius = (value - 32) * 5/9;
    if (from === 'k') celsius = value - 273.15;

    // Convert from Celsius to target
    if (to === 'f') return celsius * 9/5 + 32;
    if (to === 'k') return celsius + 273.15;
    return celsius;
  }, []);

  const convert = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('');
      return;
    }

    if (selectedCategory === 'temperature') {
      const converted = convertTemperature(value, fromUnit, toUnit);
      setResult(converted.toFixed(4));
    } else {
      const categoryUnits = units[selectedCategory] as any;
      const fromFactor = categoryUnits[fromUnit]?.factor || 1;
      const toFactor = categoryUnits[toUnit]?.factor || 1;
      
      // Convert to base unit, then to target unit
      const baseValue = value * fromFactor;
      const converted = baseValue / toFactor;
      setResult(converted.toFixed(6));
    }
  }, [inputValue, fromUnit, toUnit, selectedCategory, convertTemperature]);

  React.useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      convert();
    }
  }, [inputValue, fromUnit, toUnit, convert]);

  const swapUnits = useCallback(() => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  }, [fromUnit, toUnit]);

  return (
    <ToolPageTemplate
      title="Unit Converter"
      description="Convert between different units of measurement"
    >
      <div className="space-y-6">
        <div>
          <Label className="mb-2 block">Category</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={selectedCategory === 'length' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('length')}
            >
              Length
            </Button>
            <Button
              variant={selectedCategory === 'weight' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('weight')}
            >
              Weight
            </Button>
            <Button
              variant={selectedCategory === 'temperature' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('temperature')}
            >
              Temperature
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="from-unit" className="mb-2 block">From</Label>
            <select
              id="from-unit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              {Object.entries(units[selectedCategory]).map(([key, unit]) => (
                <option key={key} value={key}>{unit.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="to-unit" className="mb-2 block">To</Label>
            <select
              id="to-unit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              {Object.entries(units[selectedCategory]).map(([key, unit]) => (
                <option key={key} value={key}>{unit.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Button variant="outline" size="sm" onClick={swapUnits}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="input-value" className="mb-2 block">Enter Value</Label>
            <Input
              id="input-value"
              type="number"
              placeholder="Enter value to convert"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-2 block">Result</Label>
            <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md flex items-center">
              {result || '0'}
            </div>
          </div>
        </div>

        {result && (
          <div className="p-4 bg-primary/5 rounded-md">
            <p className="text-center">
              <span className="font-semibold">{inputValue} {units[selectedCategory][fromUnit as keyof typeof units[typeof selectedCategory]]?.name}</span>
              {' = '}
              <span className="font-semibold">{result} {units[selectedCategory][toUnit as keyof typeof units[typeof selectedCategory]]?.name}</span>
            </p>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default UnitConverter;
