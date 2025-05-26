
import React, { useState, useCallback } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CaseSensitive, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CaseConverter = () => {
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState({
    lowercase: '',
    uppercase: '',
    titleCase: '',
    sentenceCase: '',
    camelCase: '',
    pascalCase: '',
    snakeCase: '',
    kebabCase: ''
  });

  const convertCases = useCallback((text: string) => {
    const lowercase = text.toLowerCase();
    const uppercase = text.toUpperCase();
    
    // Title Case: First letter of each word capitalized
    const titleCase = text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    
    // Sentence Case: First letter of each sentence capitalized
    const sentenceCase = text.toLowerCase().replace(/(^\w|[.!?]\s*\w)/g, char => char.toUpperCase());
    
    // camelCase: First word lowercase, subsequent words capitalized, no spaces
    const camelCase = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase())
      .replace(/^[A-Z]/, char => char.toLowerCase());
    
    // PascalCase: Like camelCase but first letter is capitalized
    const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    
    // snake_case: All lowercase with underscores
    const snakeCase = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    
    // kebab-case: All lowercase with hyphens
    const kebabCase = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return {
      lowercase,
      uppercase,
      titleCase,
      sentenceCase,
      camelCase,
      pascalCase,
      snakeCase,
      kebabCase
    };
  }, []);

  React.useEffect(() => {
    setResults(convertCases(inputText));
  }, [inputText, convertCases]);

  const copyToClipboard = useCallback(async (text: string, caseName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${caseName} text copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        variant: "destructive"
      });
    }
  }, []);

  const caseOptions = [
    { key: 'lowercase', name: 'lowercase', description: 'all letters in lowercase' },
    { key: 'uppercase', name: 'UPPERCASE', description: 'ALL LETTERS IN UPPERCASE' },
    { key: 'titleCase', name: 'Title Case', description: 'First Letter Of Each Word Capitalized' },
    { key: 'sentenceCase', name: 'Sentence case', description: 'First letter of each sentence capitalized' },
    { key: 'camelCase', name: 'camelCase', description: 'firstWordLowercaseOthersCapitalized' },
    { key: 'pascalCase', name: 'PascalCase', description: 'FirstLetterOfEachWordCapitalized' },
    { key: 'snakeCase', name: 'snake_case', description: 'words_separated_by_underscores' },
    { key: 'kebabCase', name: 'kebab-case', description: 'words-separated-by-hyphens' }
  ];

  return (
    <ToolPageTemplate
      title="Case Converter"
      description="Convert text between different case formats (uppercase, lowercase, title case, etc.)"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="text-input" className="mb-2 block">
            Enter your text
          </Label>
          <textarea
            id="text-input"
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        {inputText && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <CaseSensitive className="h-5 w-5 mr-2" />
              Converted Text
            </h3>
            
            <div className="grid gap-4">
              {caseOptions.map((option) => (
                <div key={option.key} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{option.name}</h4>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(results[option.key as keyof typeof results], option.name)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3 bg-muted rounded border min-h-[2.5rem] font-mono text-sm">
                    {results[option.key as keyof typeof results] || 'No text entered'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-primary/5 rounded-md">
          <h4 className="font-medium mb-2">Case Conversion Guide</h4>
          <div className="text-sm space-y-1">
            <p><strong>Title Case:</strong> Capitalizes the first letter of each word</p>
            <p><strong>Sentence Case:</strong> Capitalizes the first letter of each sentence</p>
            <p><strong>camelCase:</strong> Used in programming, first word lowercase, others capitalized</p>
            <p><strong>PascalCase:</strong> Like camelCase but first letter is capitalized</p>
            <p><strong>snake_case:</strong> Words separated by underscores, all lowercase</p>
            <p><strong>kebab-case:</strong> Words separated by hyphens, all lowercase</p>
          </div>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default CaseConverter;
