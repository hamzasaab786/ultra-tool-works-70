
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, FileSpreadsheet, FileCode } from "lucide-react";
import SEO from "@/components/SEO";

const CsvToJson = () => {
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [prettyPrint, setPrettyPrint] = useState(true);
  const { toast } = useToast();

  const parseCSV = (csv: string, delimiter: string = ","): string[][] => {
    const lines = csv.trim().split('\n');
    return lines.map(line => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    });
  };

  const convertToJson = () => {
    try {
      if (!csvInput.trim()) {
        toast({
          title: "No CSV data",
          description: "Please enter CSV data to convert.",
          variant: "destructive",
        });
        return;
      }

      const rows = parseCSV(csvInput, delimiter);
      
      if (rows.length === 0) {
        toast({
          title: "Empty CSV",
          description: "The CSV data appears to be empty.",
          variant: "destructive",
        });
        return;
      }

      let jsonData;

      if (hasHeaders && rows.length > 1) {
        const headers = rows[0];
        const dataRows = rows.slice(1);
        
        jsonData = dataRows.map(row => {
          const obj: { [key: string]: any } = {};
          headers.forEach((header, index) => {
            const value = row[index] || '';
            // Try to parse numbers
            if (!isNaN(Number(value)) && value !== '') {
              obj[header] = Number(value);
            } else if (value.toLowerCase() === 'true') {
              obj[header] = true;
            } else if (value.toLowerCase() === 'false') {
              obj[header] = false;
            } else {
              obj[header] = value;
            }
          });
          return obj;
        });
      } else {
        jsonData = rows.map(row => 
          row.map(cell => {
            // Try to parse numbers
            if (!isNaN(Number(cell)) && cell !== '') {
              return Number(cell);
            } else if (cell.toLowerCase() === 'true') {
              return true;
            } else if (cell.toLowerCase() === 'false') {
              return false;
            } else {
              return cell;
            }
          })
        );
      }

      const jsonString = prettyPrint 
        ? JSON.stringify(jsonData, null, 2)
        : JSON.stringify(jsonData);

      setJsonOutput(jsonString);

      toast({
        title: "Conversion successful",
        description: "CSV data has been converted to JSON format.",
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "There was an error converting your CSV data. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast({
      title: "Copied to clipboard",
      description: "The JSON data has been copied to your clipboard.",
    });
  };

  const clearAll = () => {
    setCsvInput("");
    setJsonOutput("");
  };

  const loadSample = () => {
    const sample = `name,age,city,active
John Doe,30,New York,true
Jane Smith,25,Los Angeles,false
Bob Johnson,35,Chicago,true`;
    setCsvInput(sample);
  };

  return (
    <>
      <SEO
        title="CSV to JSON Converter - Convert CSV Data to JSON Online"
        description="Convert CSV data to JSON format online for free. Support for custom delimiters, headers, and formatted output."
        keywords="CSV to JSON, convert CSV, CSV converter, JSON converter, data conversion, file format converter"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              CSV to JSON Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert CSV data to JSON format with support for custom delimiters and formatting options
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  CSV Input
                </CardTitle>
                <CardDescription>
                  Paste your CSV data here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="name,age,city
John,30,New York
Jane,25,Los Angeles"
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={loadSample} variant="outline">
                    Sample Data
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    JSON Output
                  </div>
                  {jsonOutput && (
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Converted JSON data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jsonOutput}
                  readOnly
                  placeholder="JSON output will appear here..."
                  className="min-h-[300px] font-mono text-sm bg-gray-50"
                />
                
                {jsonOutput && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Characters: {jsonOutput.length}</p>
                    <p>Lines: {jsonOutput.split('\n').length}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Conversion Settings</CardTitle>
              <CardDescription>
                Customize how your CSV data is converted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delimiter">Delimiter</Label>
                  <Input
                    id="delimiter"
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    placeholder=","
                    className="w-20"
                  />
                  <p className="text-xs text-gray-500">Character that separates values</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="headers" 
                      checked={hasHeaders}
                      onCheckedChange={setHasHeaders}
                    />
                    <Label htmlFor="headers">First row is headers</Label>
                  </div>
                  <p className="text-xs text-gray-500">Use first row as object keys</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pretty" 
                      checked={prettyPrint}
                      onCheckedChange={setPrettyPrint}
                    />
                    <Label htmlFor="pretty">Pretty print JSON</Label>
                  </div>
                  <p className="text-xs text-gray-500">Format with indentation</p>
                </div>

                <div className="space-y-2">
                  <Button onClick={convertToJson} disabled={!csvInput.trim()} className="w-full">
                    Convert to JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>CSV Format Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">With Headers</h4>
                  <pre className="text-xs bg-gray-100 p-3 rounded">
{`name,age,city
John Doe,30,New York
Jane Smith,25,Los Angeles`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Without Headers</h4>
                  <pre className="text-xs bg-gray-100 p-3 rounded">
{`John Doe,30,New York
Jane Smith,25,Los Angeles
Bob Johnson,35,Chicago`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CsvToJson;
