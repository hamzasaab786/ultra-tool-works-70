
import React, { useState, useRef, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Play, Pause, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("default");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();
  
  // Check if browser supports speech synthesis
  const speechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  // Built-in voice options
  const [voiceOptions, setVoiceOptions] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!speechSynthesisSupported) return;
    
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        // Filter and categorize voices
        const femaleVoices = voices.filter(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('alice') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('samantha')
        );
        const maleVoices = voices.filter(voice => 
          voice.name.toLowerCase().includes('male') || 
          voice.name.toLowerCase().includes('man') ||
          voice.name.toLowerCase().includes('alex') ||
          voice.name.toLowerCase().includes('david')
        );
        const allVoices = [...femaleVoices, ...maleVoices, ...voices.filter(v => 
          !femaleVoices.includes(v) && !maleVoices.includes(v)
        )];
        setVoiceOptions(allVoices);
      }
    };
    
    getVoices();
    window.speechSynthesis.onvoiceschanged = getVoices;
    
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const generateSpeech = () => {
    if (!text.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to convert to speech.",
        variant: "destructive"
      });
      return;
    }

    if (!speechSynthesisSupported) {
      toast({
        title: "Not Supported",
        description: "Speech synthesis is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }
    
    // Stop any existing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Set voice if available
    if (selectedVoice !== "default" && voiceOptions.length) {
      const voice = voiceOptions.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }
    
    // Set properties
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    // Event listeners
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "An error occurred during speech synthesis.",
        variant: "destructive"
      });
    };
    
    // Play speech
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };
  
  const handlePlayPause = () => {
    if (!speechSynthesisSupported) return;
    
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        generateSpeech();
      }
    }
  };
  
  const stopSpeech = () => {
    if (speechSynthesisSupported) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const clearText = () => {
    setText("");
    stopSpeech();
  };

  return (
    <ToolPageTemplate
      title="Text-to-Speech Converter"
      description="Convert text to natural-sounding speech with customizable voice settings"
      keywords="text to speech, TTS, voice generator, speech synthesis, browser voices"
    >
      <div className="space-y-6">
        {/* Text Input Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Enter Your Text</h2>
            <Button variant="outline" size="sm" onClick={clearText}>
              Clear All
            </Button>
          </div>
          <Textarea 
            placeholder="Type or paste text to convert to speech (maximum 2000 characters)..."
            className="min-h-[200px] text-base leading-relaxed"
            value={text}
            onChange={handleTextChange}
            maxLength={2000}
          />
          <div className="text-sm text-gray-500 mt-1 text-right">
            {text.length}/2000 characters
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Settings */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Voice Settings</h2>
            
            {/* Voice Selection */}
            <div>
              <Label className="mb-2 block">Select Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Voice</SelectItem>
                  {voiceOptions.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Speech Rate: {rate.toFixed(1)}x</Label>
              <Slider
                value={[rate]}
                min={0.1}
                max={2}
                step={0.1}
                onValueChange={(value) => setRate(value[0])}
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Pitch: {pitch.toFixed(1)}</Label>
              <Slider
                value={[pitch]}
                min={0.1}
                max={2}
                step={0.1}
                onValueChange={(value) => setPitch(value[0])}
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Volume: {Math.round(volume * 100)}%</Label>
              <Slider
                value={[volume]}
                min={0.1}
                max={1}
                step={0.1}
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
          </div>
          
          {/* Audio Controls */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Audio Controls</h2>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handlePlayPause} 
                className="flex items-center gap-2" 
                size="lg"
                disabled={!text.trim()}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-5 w-5" />
                    Pause Speech
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Play Speech
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={stopSpeech} 
                disabled={!isPlaying}
                className="flex items-center gap-2"
              >
                <StopCircle className="h-4 w-4" />
                Stop
              </Button>
            </div>
            
            {/* Info Cards */}
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <span>Uses your browser's built-in text-to-speech engine</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {!speechSynthesisSupported && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              Your browser doesn't support speech synthesis. Please try a modern browser like Chrome, Edge, or Safari.
            </p>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default TextToSpeech;
