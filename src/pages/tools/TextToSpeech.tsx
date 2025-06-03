
import React, { useState, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Volume2, Play, Pause, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("default");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();
  
  // Check if browser supports speech synthesis
  const speechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
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
    const voices = window.speechSynthesis.getVoices();
    if (voice !== "default" && voices.length) {
      const selectedVoice = voices.find(v => v.name === voice);
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    // Set rate and pitch
    utterance.rate = rate;
    utterance.pitch = pitch;
    
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
    if (!speechSynthesisSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };
  
  // Voice options - will be populated when the component mounts
  const [voiceOptions, setVoiceOptions] = useState<SpeechSynthesisVoice[]>([]);
  
  React.useEffect(() => {
    if (!speechSynthesisSupported) return;
    
    // Get available voices
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        setVoiceOptions(voices);
      }
    };
    
    // Initial call
    getVoices();
    
    // Set up event listener for when voices are loaded
    window.speechSynthesis.onvoiceschanged = getVoices;
    
    // Cleanup
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  return (
    <ToolPageTemplate
      title="Text-to-Speech Converter"
      description="Convert text to natural-sounding speech with customizable voices and settings"
      keywords="text to speech, TTS, voice generator, speech synthesis, audio from text, voice converter"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Enter Your Text</h2>
          <Textarea 
            placeholder="Type or paste text to convert to speech (maximum 1000 characters)..."
            className="min-h-[200px]"
            value={text}
            onChange={handleTextChange}
            maxLength={1000}
          />
          <div className="text-sm text-gray-500 mt-1 text-right">
            {text.length}/1000 characters
          </div>
        </div>
        
        {speechSynthesisSupported && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Voice Settings</h2>
              
              {voiceOptions.length > 0 && (
                <div>
                  <Label htmlFor="voice-select" className="mb-2 block">Voice</Label>
                  <select 
                    id="voice-select"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                  >
                    <option value="default">Default Voice</option>
                    {voiceOptions.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <Label className="mb-2 block">Speech Rate: {rate.toFixed(1)}x</Label>
                <Slider
                  value={[rate]}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onValueChange={(value) => setRate(value[0])}
                  className="max-w-md"
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
                  className="max-w-md"
                />
              </div>
            </div>
            
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
                      {window.speechSynthesis?.paused ? "Resume Speech" : "Generate & Play Speech"}
                    </>
                  )}
                </Button>
                
                {isPlaying && (
                  <Button 
                    variant="outline"
                    onClick={stopSpeech} 
                    className="flex items-center gap-2" 
                  >
                    Stop Speech
                  </Button>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-800 text-sm flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <span>
                    Make sure your device volume is turned on. Speech quality depends on your browser and operating system.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!speechSynthesisSupported && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              Your browser doesn't support speech synthesis. Please try using a modern browser like Chrome, Edge, or Safari.
            </p>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default TextToSpeech;
