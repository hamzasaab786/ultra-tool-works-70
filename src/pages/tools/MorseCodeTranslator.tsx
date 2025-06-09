
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Radio, Volume2 } from "lucide-react";
import SEO from "@/components/SEO";

const MorseCodeTranslator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"toMorse" | "fromMorse">("toMorse");
  const { toast } = useToast();

  const morseCode: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/'
  };

  const reverseMorse = Object.fromEntries(
    Object.entries(morseCode).map(([key, value]) => [value, key])
  );

  const textToMorse = (text: string) => {
    return text.toUpperCase()
      .split('')
      .map(char => morseCode[char] || char)
      .join(' ');
  };

  const morseToText = (morse: string) => {
    return morse.split(' ')
      .map(code => reverseMorse[code] || code)
      .join('');
  };

  const translate = () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter text to translate.",
        variant: "destructive",
      });
      return;
    }

    let result = "";
    if (mode === "toMorse") {
      result = textToMorse(input);
    } else {
      result = morseToText(input);
    }

    setOutput(result);
    toast({
      title: "Translation complete",
      description: "Your text has been translated successfully.",
    });
  };

  return (
    <>
      <SEO
        title="Morse Code Translator - Convert Text to Morse Code Online"
        description="Translate text to Morse code and vice versa online for free. Learn and practice Morse code with our easy-to-use translator."
        keywords="morse code translator, text to morse, morse to text, morse code converter, telegraph code"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Morse Code Translator
            </h1>
            <p className="text-lg text-gray-600">
              Convert text to Morse code and vice versa
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  Translation Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant={mode === "toMorse" ? "default" : "outline"}
                    onClick={() => setMode("toMorse")}
                  >
                    Text to Morse
                  </Button>
                  <Button
                    variant={mode === "fromMorse" ? "default" : "outline"}
                    onClick={() => setMode("fromMorse")}
                  >
                    Morse to Text
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>
                  {mode === "toMorse" 
                    ? "Enter text to convert to Morse code"
                    : "Enter Morse code to convert to text (use spaces between letters, / for word breaks)"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={mode === "toMorse" ? "Hello World" : ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button onClick={translate}>
                  Translate
                </Button>
              </CardContent>
            </Card>

            {output && (
              <Card>
                <CardHeader>
                  <CardTitle>Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={output}
                    readOnly
                    className="min-h-[120px] bg-gray-50 font-mono"
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Morse Code Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {Object.entries(morseCode).slice(0, 26).map(([letter, code]) => (
                    <div key={letter} className="flex justify-between font-mono">
                      <span>{letter}:</span>
                      <span>{code}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default MorseCodeTranslator;
