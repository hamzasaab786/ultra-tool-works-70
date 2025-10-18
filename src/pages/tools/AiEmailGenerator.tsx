import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Mail } from "lucide-react";
import ToolPageTemplate from "./ToolPageTemplate";

const AiEmailGenerator = () => {
  const { toast } = useToast();
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEmail = async () => {
    if (!purpose.trim()) {
      toast({
        title: "Purpose required",
        description: "Please enter the purpose of your email",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-email-generator', {
        body: { purpose, recipient, context, tone }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Generation failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setGeneratedEmail(data.email);
      toast({
        title: "Email generated!",
        description: "Your email has been created successfully",
      });
    } catch (error) {
      console.error('Error generating email:', error);
      toast({
        title: "Error",
        description: "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard",
    });
  };

  return (
    <ToolPageTemplate
      title="AI Email Generator"
      description="Generate professional emails for any purpose using AI"
      keywords="ai email generator, professional email, email writer, business email, ai email tool"
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Email Purpose *</Label>
              <Input
                id="purpose"
                placeholder="e.g., Follow-up after meeting, Job application, Customer inquiry"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient (Optional)</Label>
              <Input
                id="recipient"
                placeholder="e.g., Hiring Manager, Client, Team Lead"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Additional Context (Optional)</Label>
              <Textarea
                id="context"
                placeholder="Any specific details you want to include in the email..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateEmail} 
              disabled={isGenerating}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        {generatedEmail && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <Label>Generated Email</Label>
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={generatedEmail}
                onChange={(e) => setGeneratedEmail(e.target.value)}
                className="min-h-[350px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-purple-900">📧 Professional Email Writing</h3>
            <p className="text-sm text-purple-800">
              Generate well-crafted, professional emails for any situation. Save time and ensure clear communication.
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default AiEmailGenerator;
