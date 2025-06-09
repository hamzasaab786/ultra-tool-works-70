
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Square, Volume2, Download } from "lucide-react";
import SEO from "@/components/SEO";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [volume, setVolume] = useState([1]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const speak = () => {
    if (!text.trim()) {
      toast({
        title: "No text to speak",
        description: "Please enter some text to convert to speech.",
        variant: "destructive",
      });
      return;
    }

    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = rate[0];
      utterance.pitch = pitch[0];
      utterance.volume = volume[0];

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        toast({
          title: "Speech error",
          description: "There was an error with text-to-speech conversion.",
          variant: "destructive",
        });
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const downloadAudio = () => {
    toast({
      title: "Download not available",
      description: "Audio download is not supported with browser's built-in speech synthesis. Use the play button to listen to your text.",
    });
  };

  const loadSample = () => {
    setText("Hello! This is a sample text for text-to-speech conversion. You can adjust the voice, speed, pitch, and volume settings to customize how this text sounds when spoken aloud.");
  };

  return (
    <>
      <SEO
        title="Text to Speech - Convert Text to Audio Online Free"
        description="Convert text to speech online for free. Generate natural-sounding audio from text with customizable voice, speed, and pitch settings."
        keywords="text to speech, TTS, convert text to audio, speech synthesis, voice generator, text reader"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Text to Speech
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert your text to natural-sounding speech with customizable voice settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Text Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Text Input
                </CardTitle>
                <CardDescription>
                  Enter the text you want to convert to speech
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px]"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={loadSample} variant="outline">
                    Load Sample Text
                  </Button>
                  <Button onClick={() => setText("")} variant="outline">
                    Clear
                  </Button>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Character count: {text.length}
                </div>
              </CardContent>
            </Card>

            {/* Voice Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Voice Settings</CardTitle>
                <CardDescription>
                  Customize the voice and speech parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Voice</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
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
                    <Label>Rate: {rate[0].toFixed(1)}x</Label>
                    <Slider
                      value={rate}
                      onValueChange={setRate}
                      min={0.1}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pitch: {pitch[0].toFixed(1)}</Label>
                    <Slider
                      value={pitch}
                      onValueChange={setPitch}
                      min={0}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Volume: {Math.round(volume[0] * 100)}%</Label>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Playback Controls</CardTitle>
                <CardDescription>
                  Control speech playback and download options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button onClick={speak} disabled={!text.trim() || isPlaying}>
                    <Play className="mr-2 h-4 w-4" />
                    Speak
                  </Button>
                  <Button onClick={pause} disabled={!isPlaying} variant="outline">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause/Resume
                  </Button>
                  <Button onClick={stop} disabled={!isPlaying} variant="outline">
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                  <Button onClick={downloadAudio} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Audio
                  </Button>
                </div>
                
                {isPlaying && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-blue-700 text-sm">Speaking...</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information */}
            <Card>
              <CardHeader>
                <CardTitle>Text-to-Speech Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">🎙️ Multiple Voices</h4>
                    <p className="text-sm text-gray-600">
                      Choose from various voices and languages available in your browser
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">⚡ Adjustable Speed</h4>
                    <p className="text-sm text-gray-600">
                      Control speaking rate from 0.1x to 2x normal speed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">🎵 Pitch Control</h4>
                    <p className="text-sm text-gray-600">
                      Adjust voice pitch to make it higher or lower
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">🔊 Volume Control</h4>
                    <p className="text-sm text-gray-600">
                      Set the audio volume from 0% to 100%
                    </p>
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

export default TextToSpeech;
