
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Code, TestTube } from "lucide-react";
import SEO from "@/components/SEO";

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);
  const { toast } = useToast();

  const testRegex = () => {
    try {
      if (!pattern) {
        toast({
          title: "Pattern required",
          description: "Please enter a regex pattern to test.",
          variant: "destructive",
        });
        return;
      }

      const regex = new RegExp(pattern, flags);
      const foundMatches = testString.match(regex) || [];
      
      setMatches(foundMatches);
      setIsValid(true);
      
      toast({
        title: "Regex tested successfully",
        description: `Found ${foundMatches.length} match(es).`,
      });
    } catch (error) {
      setIsValid(false);
      setMatches([]);
      toast({
        title: "Invalid regex pattern",
        description: "Please check your regular expression syntax.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEO
        title="Regex Tester - Test Regular Expressions Online Free"
        description="Test and validate regular expressions online. Check regex patterns against text with real-time matching and detailed results."
        keywords="regex tester, regular expression, regex validator, pattern matching, regex online"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Regex Tester
            </h1>
            <p className="text-lg text-gray-600">
              Test and validate regular expressions with real-time pattern matching
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Regular Expression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <span className="text-lg font-mono">/</span>
                  <Input
                    placeholder="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="flex-1 font-mono"
                  />
                  <span className="text-lg font-mono">/</span>
                  <Input
                    placeholder="g"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    className="w-20 font-mono"
                  />
                </div>
                
                <Button onClick={testRegex} disabled={!pattern}>
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Pattern
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test String</CardTitle>
                <CardDescription>
                  Enter text to test your regex pattern against
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter text to test your regex pattern..."
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            {matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Matches ({matches.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {matches.map((match, index) => (
                      <div key={index} className="p-2 bg-green-50 border border-green-200 rounded font-mono text-sm">
                        Match {index + 1}: "{match}"
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Common Regex Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">📧 Email</h4>
                    <code className="text-sm bg-gray-100 p-2 rounded block">
                      [a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{`{2,}`}
                    </code>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">📱 Phone (US)</h4>
                    <code className="text-sm bg-gray-100 p-2 rounded block">
                      ^\+?1?[-.\s]?\(?[0-9]{`{3}`}\)?[-.\s]?[0-9]{`{3}`}[-.\s]?[0-9]{`{4}`}$
                    </code>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">🌐 URL</h4>
                    <code className="text-sm bg-gray-100 p-2 rounded block">
                      https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{`{1,256}`}\.[a-zA-Z0-9()]{`{1,6}`}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegexTester;
