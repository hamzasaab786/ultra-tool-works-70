
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Volume2, Play, Pause, Download, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ToolPageTemplate from "./ToolPageTemplate";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !voice) {
        setVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [voice]);

  const playText = () => {
    if (!text.trim()) {
      toast({
        title: "No text",
        description: "Please enter some text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.name === voice);
    
    if (selectedVoice) {
      newUtterance.voice = selectedVoice;
    }
    
    newUtterance.rate = rate[0];
    newUtterance.pitch = pitch[0];

    newUtterance.onstart = () => {
      setIsPlaying(true);
    };

    newUtterance.onend = () => {
      setIsPlaying(false);
      setUtterance(null);
    };

    newUtterance.onerror = () => {
      setIsPlaying(false);
      setUtterance(null);
      toast({
        title: "Error",
        description: "Failed to convert text to speech",
        variant: "destructive",
      });
    };

    setUtterance(newUtterance);
    speechSynthesis.speak(newUtterance);
  };

  const pauseResume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else {
      speechSynthesis.pause();
    }
  };

  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setUtterance(null);
  };

  const downloadAudio = () => {
    toast({
      title: "Info",
      description: "Audio download requires a premium speech synthesis service. Currently playing audio directly.",
    });
  };

  return (
    <ToolPageTemplate
      title="Text-to-Speech Converter"
      description="Convert any text to natural-sounding speech with customizable voice settings"
      keywords="text to speech, TTS, voice synthesis, audio conversion, speech generator"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Text-to-Speech Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="text-input" className="text-sm font-medium">
                Enter text to convert
              </label>
              <Textarea
                id="text-input"
                placeholder="Type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-32"
                maxLength={5000}
              />
              <p className="text-xs text-gray-500">
                {text.length}/5000 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice</label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Speech Rate: {rate[0]}x
                </label>
                <Slider
                  value={rate}
                  onValueChange={setRate}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Pitch: {pitch[0]}x
                </label>
                <Slider
                  value={pitch}
                  onValueChange={setPitch}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button 
                onClick={playText} 
                disabled={!text.trim() || isPlaying}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Play
              </Button>
              
              {isPlaying && (
                <>
                  <Button 
                    onClick={pauseResume}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    {speechSynthesis.paused ? 'Resume' : 'Pause'}
                  </Button>
                  
                  <Button 
                    onClick={stopSpeech}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <StopCircle className="w-4 h-4" />
                    Stop
                  </Button>
                </>
              )}

              <Button 
                onClick={downloadAudio}
                variant="outline"
                className="flex items-center gap-2"
                disabled={!text.trim()}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>

            {isPlaying && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-800 font-medium">🔊 Playing audio...</p>
                <p className="text-sm text-blue-600">Use the controls above to pause or stop</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Support for multiple languages and voices</li>
              <li>• Adjustable speech rate and pitch</li>
              <li>• Real-time playback controls</li>
              <li>• Up to 5000 characters per conversion</li>
              <li>• Works offline in your browser</li>
              <li>• No file uploads required</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default TextToSpeech;
