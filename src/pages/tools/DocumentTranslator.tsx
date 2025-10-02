
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Languages, Copy, RotateCcw } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const DocumentTranslator = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: "auto", name: "Auto Detect" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "ur", name: "Urdu" }
  ];

  const translateText = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "No text to translate",
        description: "Please enter some text to translate.",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLang,
          targetLang
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);
      
      toast({
        title: "Translation completed",
        description: "Your text has been translated successfully.",
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: "There was an error translating your text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const copyTranslation = () => {
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Copied to clipboard",
      description: "The translated text has been copied.",
    });
  };

  const clearAll = () => {
    setSourceText("");
    setTranslatedText("");
  };

  return (
    <ToolPageTemplate
      title="Document Translator"
      description="Translate text and documents between multiple languages with high accuracy."
      keywords="document translator, text translation, language converter, multi-language"
    >
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Language
            </label>
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Language
            </label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.filter(lang => lang.code !== "auto").map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Source Text
            </label>
            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-[300px]"
            />
            <div className="text-sm text-gray-500">
              Characters: {sourceText.length}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Translated Text
              </label>
              {translatedText && (
                <Button variant="outline" size="sm" onClick={copyTranslation}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              value={translatedText}
              readOnly
              placeholder="Translation will appear here..."
              className="min-h-[300px] bg-gray-50"
            />
            {translatedText && (
              <div className="text-sm text-gray-500">
                Characters: {translatedText.length}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={translateText} disabled={isTranslating || !sourceText.trim()}>
            <Languages className="h-4 w-4 mr-2" />
            {isTranslating ? "Translating..." : "Translate"}
          </Button>
          <Button variant="outline" onClick={clearAll}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Support for 14+ languages</li>
            <li>• Auto-detect source language</li>
            <li>• High-accuracy translation</li>
            <li>• Real-time character count</li>
          </ul>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default DocumentTranslator;
