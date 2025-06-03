
import React, { useState, useRef, useEffect } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Volume2, Play, Pause, Download, Mic, StopCircle, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Voice {
  id: string;
  name: string;
  gender: string;
  accent: string;
}

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("default");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState("");
  const [useElevenLabs, setUseElevenLabs] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Check if browser supports speech synthesis
  const speechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  // Built-in voice options with better categorization
  const [voiceOptions, setVoiceOptions] = useState<SpeechSynthesisVoice[]>([]);
  
  // ElevenLabs voice options (popular female and male voices)
  const elevenLabsVoices: Voice[] = [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", gender: "Female", accent: "American" },
    { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", gender: "Female", accent: "English" },
    { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice", gender: "Female", accent: "British" },
    { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", gender: "Female", accent: "American" },
    { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda", gender: "Female", accent: "American" },
    { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", gender: "Female", accent: "American" },
    { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", gender: "Female", accent: "American" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", gender: "Male", accent: "American" },
    { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", gender: "Male", accent: "American" },
    { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", gender: "Male", accent: "British" },
  ];

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

  const generateElevenLabsSpeech = async () => {
    if (!elevenLabsApiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key to use premium voices.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.volume = volume;
        audioRef.current.play();
        setIsPlaying(true);
      }

      toast({
        title: "Speech Generated",
        description: "High-quality speech generated successfully!",
      });
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate speech. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateBrowserSpeech = () => {
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

  const generateSpeech = () => {
    if (!text.trim()) {
      toast({
        title: "Empty Text",
        description: "Please enter some text to convert to speech.",
        variant: "destructive"
      });
      return;
    }

    if (useElevenLabs) {
      generateElevenLabsSpeech();
    } else {
      generateBrowserSpeech();
    }
  };
  
  const handlePlayPause = () => {
    if (useElevenLabs && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioUrl) {
          audioRef.current.play();
          setIsPlaying(true);
        } else {
          generateSpeech();
        }
      }
    } else {
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
    }
  };
  
  const stopSpeech = () => {
    if (useElevenLabs && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else if (speechSynthesisSupported) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) {
      toast({
        title: "No Audio",
        description: "Please generate speech first before downloading.",
        variant: "destructive"
      });
      return;
    }

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `speech-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "Your speech audio is being downloaded.",
    });
  };

  const clearText = () => {
    setText("");
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    stopSpeech();
  };

  return (
    <ToolPageTemplate
      title="Advanced Text-to-Speech Converter"
      description="Convert text to natural-sounding speech with AI-powered voices, customizable settings, and downloadable audio"
      keywords="text to speech, TTS, voice generator, speech synthesis, AI voices, female voices, downloadable audio, ElevenLabs"
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

        {/* Voice Engine Selection */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Key className="h-4 w-4" />
            Voice Engine Selection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="voiceEngine"
                  checked={!useElevenLabs}
                  onChange={() => setUseElevenLabs(false)}
                  className="rounded"
                />
                <span>Browser Voices (Free)</span>
              </Label>
              <p className="text-sm text-gray-600 ml-6">Use built-in browser voices</p>
            </div>
            <div>
              <Label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="voiceEngine"
                  checked={useElevenLabs}
                  onChange={() => setUseElevenLabs(true)}
                  className="rounded"
                />
                <span>ElevenLabs AI Voices (Premium)</span>
              </Label>
              <p className="text-sm text-gray-600 ml-6">High-quality AI voices</p>
            </div>
          </div>
          
          {useElevenLabs && (
            <div className="mt-4">
              <Label htmlFor="api-key" className="block mb-2">
                ElevenLabs API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your ElevenLabs API key..."
                value={elevenLabsApiKey}
                onChange={(e) => setElevenLabsApiKey(e.target.value)}
                className="max-w-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your free API key from{" "}
                <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  elevenlabs.io
                </a>
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Settings */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Voice Settings</h2>
            
            {/* Voice Selection */}
            <div>
              <Label className="mb-2 block">Select Voice</Label>
              {useElevenLabs ? (
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an AI voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {elevenLabsVoices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name} ({voice.gender} - {voice.accent})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
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
              )}
            </div>
            
            {!useElevenLabs && (
              <>
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
              </>
            )}
            
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
                disabled={!text.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Generating...
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="h-5 w-5" />
                    Pause Speech
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Generate & Play Speech
                  </>
                )}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={stopSpeech} 
                  disabled={!isPlaying}
                  className="flex items-center gap-2"
                >
                  <StopCircle className="h-4 w-4" />
                  Stop
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={downloadAudio} 
                  disabled={!audioUrl}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            
            {/* Audio Element for ElevenLabs */}
            <audio
              ref={audioRef}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />
            
            {/* Info Cards */}
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800 text-sm flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <span>Premium AI voices provide superior quality and natural intonation</span>
                </p>
              </div>
              
              {audioUrl && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-blue-800 text-sm flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Audio generated successfully! You can now download it as MP3.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!speechSynthesisSupported && !useElevenLabs && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              Your browser doesn't support speech synthesis. Please use ElevenLabs AI voices or try a modern browser like Chrome, Edge, or Safari.
            </p>
          </div>
        )}
      </div>
    </ToolPageTemplate>
  );
};

export default TextToSpeech;
