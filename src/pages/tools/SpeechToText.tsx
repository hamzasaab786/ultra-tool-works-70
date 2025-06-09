
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mic, Square } from "lucide-react";
import SEO from "@/components/SEO";

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      toast({
        title: "Feature coming soon",
        description: "Speech recognition will be available in the next update.",
      });
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEO
        title="Speech to Text - Convert Audio to Text Online Free"
        description="Convert speech to text online using voice recognition. Transcribe audio to text with real-time speech recognition."
        keywords="speech to text, voice to text, audio transcription, speech recognition, voice typing"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Speech to Text
            </h1>
            <p className="text-lg text-gray-600">
              Convert your speech to text using voice recognition technology
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voice Recording</CardTitle>
                <CardDescription>
                  Click the microphone to start recording your voice
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  size="lg"
                  onClick={startRecording}
                  disabled={isRecording}
                  className="h-20 w-20 rounded-full"
                >
                  {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </Button>
                <p className="mt-4 text-sm text-gray-600">
                  {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
                <CardDescription>
                  Your speech will be converted to text here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={transcript}
                  readOnly
                  placeholder="Speech transcript will appear here..."
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpeechToText;
