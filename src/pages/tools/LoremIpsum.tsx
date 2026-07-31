
import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, RotateCcw, Type } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const LoremIpsum = () => {
  const [type, setType] = useState<string>("paragraphs");
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [generatedText, setGeneratedText] = useState<string>("");
  
  const loremWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
    "accusamus", "accusantium", "doloremque", "laudantium", "totam", "rem",
    "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis",
    "et", "quasi", "architecto", "beatae", "vitae", "dicta", "sunt", "explicabo"
  ];
  
  const generateWords = (wordCount: number): string => {
    const words: string[] = [];
    
    if (startWithLorem && wordCount > 0) {
      words.push("Lorem", "ipsum", "dolor", "sit", "amet");
      wordCount -= 5;
    }
    
    for (let i = 0; i < wordCount; i++) {
      const randomWord = loremWords[Math.floor(Math.random() * loremWords.length)];
      words.push(randomWord);
    }
    
    return words.join(" ");
  };
  
  const generateSentences = (sentenceCount: number): string => {
    const sentences: string[] = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      const wordCount = Math.floor(Math.random() * 10) + 5; // 5-14 words per sentence
      let sentence = generateWords(wordCount);
      
      // Capitalize first letter and add period
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
      sentences.push(sentence);
    }
    
    return sentences.join(" ");
  };
  
  const generateParagraphs = (paragraphCount: number): string => {
    const paragraphs: string[] = [];
    
    for (let i = 0; i < paragraphCount; i++) {
      const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-7 sentences per paragraph
      const paragraph = generateSentences(sentenceCount);
      paragraphs.push(paragraph);
    }
    
    return paragraphs.join("\n\n");
  };
  
  const generateText = () => {
    let result = "";
    
    switch (type) {
      case "words":
        result = generateWords(count);
        break;
      case "sentences":
        result = generateSentences(count);
        break;
      case "paragraphs":
        result = generateParagraphs(count);
        break;
      default:
        result = generateParagraphs(count);
    }
    
    setGeneratedText(result);
  };
  
  const copyToClipboard = async () => {
    if (!generatedText) return;
    
    try {
      await navigator.clipboard.writeText(generatedText);
      toast({
        title: "Success",
        description: "Text copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };
  
  const reset = () => {
    setGeneratedText("");
    setCount(3);
    setType("paragraphs");
    setStartWithLorem(true);
  };
  
  return (
    <>
      <SEO
        title="Lorem Ipsum Generator - Generate Placeholder Text Online Free | Klipza"
        description="Generate Lorem Ipsum placeholder text for your design projects. Create words, sentences, or paragraphs instantly."
        keywords="lorem ipsum generator, placeholder text, dummy text, filler text"
        canonicalUrl="https://klipza.live/tools/lorem-ipsum"
      />
      
      <ToolPageTemplate
        title="Lorem Ipsum Generator"
        description="Generate placeholder text for your design and development projects"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Text Settings
              </CardTitle>
              <CardDescription>
                Configure the type and amount of Lorem Ipsum text to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Text Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select text type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="words">Words</SelectItem>
                      <SelectItem value="sentences">Sentences</SelectItem>
                      <SelectItem value="paragraphs">Paragraphs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="count">Count</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    placeholder="Enter count"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="startWithLorem"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="startWithLorem" className="text-sm">
                  Start with "Lorem ipsum dolor sit amet..."
                </Label>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={generateText} className="flex-1">
                  <Type className="mr-2 h-4 w-4" />
                  Generate Text
                </Button>
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {generatedText && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Text</CardTitle>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <CardDescription>
                  Generated {count} {type} ({generatedText.split(' ').length} words, {generatedText.length} characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedText}
                  readOnly
                  className="min-h-[300px] font-serif text-sm leading-relaxed"
                  placeholder="Generated text will appear here..."
                />
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>About Lorem Ipsum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                It has been the industry's standard dummy text ever since the 1500s.
              </p>
              <p>
                It is a long established fact that a reader will be distracted by the readable 
                content of a page when looking at its layout. The point of using Lorem Ipsum is 
                that it has a more-or-less normal distribution of letters.
              </p>
            </CardContent>
          </Card>
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default LoremIpsum;
