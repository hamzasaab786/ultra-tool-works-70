
import React, { useState, useRef, useEffect } from 'react';
import ToolPageTemplate from './ToolPageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Square, Play, Trash2, Download, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Recording {
  id: string;
  name: string;
  blob: Blob;
  duration: number;
  timestamp: Date;
}

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const duration = (Date.now() - startTimeRef.current) / 1000;
        
        const newRecording: Recording = {
          id: Date.now().toString(),
          name: `Recording ${recordings.length + 1}`,
          blob: audioBlob,
          duration: duration,
          timestamp: new Date()
        };
        
        setRecordings(prev => [...prev, newRecording]);
        
        toast({
          title: "Recording Saved",
          description: `Recording saved successfully (${duration.toFixed(1)}s)`
        });
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      startTimeRef.current = Date.now();
      setCurrentTime(0);
      setIsRecording(true);
      
      intervalRef.current = setInterval(() => {
        setCurrentTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
      
      mediaRecorderRef.current.start();
      
      toast({
        title: "Recording Started",
        description: "Voice recording is now active"
      });
      
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const playRecording = (recording: Recording) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(recording.blob);
    audio.play();
    
    setPlayingId(recording.id);
    
    audio.onended = () => {
      setPlayingId(null);
      URL.revokeObjectURL(audio.src);
    };
  };

  const downloadRecording = (recording: Recording) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Recording download has started"
    });
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Recording Deleted",
      description: "Recording has been removed"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ToolPageTemplate
      title="Voice Recorder"
      description="Record, save, and manage your voice recordings with a simple and intuitive interface"
      keywords="voice recorder, audio recorder, record voice, save audio"
    >
      <div className="space-y-6">
        {/* Recording Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono mb-4">
                {formatTime(currentTime)}
              </div>
              
              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button onClick={startRecording} size="lg" className="bg-red-500 hover:bg-red-600">
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} size="lg" variant="outline">
                    <Square className="h-5 w-5 mr-2" />
                    Stop Recording
                  </Button>
                )}
              </div>
              
              {isRecording && (
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 text-red-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    Recording in progress...
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recordings List */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Recordings ({recordings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {recordings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No recordings yet. Start recording to create your first audio file.
              </p>
            ) : (
              <div className="space-y-3">
                {recordings.map((recording) => (
                  <div key={recording.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{recording.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(recording.duration)}
                        </span>
                        <span>{recording.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => playRecording(recording)}
                        size="sm"
                        variant="outline"
                        disabled={playingId === recording.id}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => downloadRecording(recording)}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => deleteRecording(recording.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Click "Start Recording" to begin capturing audio</li>
              <li>Allow microphone access when prompted</li>
              <li>Click "Stop Recording" when finished</li>
              <li>Your recordings will appear in the list below</li>
              <li>Play, download, or delete recordings as needed</li>
              <li>Recordings are saved locally in your browser</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default VoiceRecorder;
