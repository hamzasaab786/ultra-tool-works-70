
import React, { useState, useEffect, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Clock, Timer, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TimerStopwatch = () => {
  // Timer State
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [lapTimes, setLapTimes] = useState<number[]>([]);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Preset timer options
  const presetTimers = [
    { label: "1 min", minutes: 1, seconds: 0 },
    { label: "5 min", minutes: 5, seconds: 0 },
    { label: "10 min", minutes: 10, seconds: 0 },
    { label: "15 min", minutes: 15, seconds: 0 },
    { label: "30 min", minutes: 30, seconds: 0 },
    { label: "45 min", minutes: 45, seconds: 0 },
    { label: "1 hour", minutes: 60, seconds: 0 }
  ];

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    } catch (error) {
      console.error('Could not play notification sound:', error);
    }
  }, []);

  // Timer Functions
  const startTimer = useCallback(() => {
    const totalSeconds = timerMinutes * 60 + timerSeconds;
    setTimerRemaining(totalSeconds);
    setTimerRunning(true);
  }, [timerMinutes, timerSeconds]);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerRemaining(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, []);

  const setPresetTimer = useCallback((minutes: number, seconds: number) => {
    setTimerMinutes(minutes);
    setTimerSeconds(seconds);
    resetTimer();
  }, [resetTimer]);

  // Stopwatch Functions
  const startStopwatch = useCallback(() => {
    setStopwatchRunning(true);
  }, []);

  const pauseStopwatch = useCallback(() => {
    setStopwatchRunning(false);
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
    }
  }, []);

  const resetStopwatch = useCallback(() => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setLapTimes([]);
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
    }
  }, []);

  const addLap = useCallback(() => {
    setLapTimes(prev => [...prev, stopwatchTime]);
  }, [stopwatchTime]);

  // Timer Effect
  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            playNotificationSound();
            toast({
              title: "⏰ Timer Finished!",
              description: "Your timer has completed.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning, timerRemaining, playNotificationSound]);

  // Stopwatch Effect
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 10);
    } else {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current);
      }
    }

    return () => {
      if (stopwatchIntervalRef.current) {
        clearInterval(stopwatchIntervalRef.current);
      }
    };
  }, [stopwatchRunning]);

  // Format time helpers
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatStopwatchTime = (centiseconds: number): string => {
    const totalSeconds = Math.floor(centiseconds / 100);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const cs = centiseconds % 100;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  return (
    <ToolPageTemplate
      title="Timer & Stopwatch Tool"
      description="Professional online timer and stopwatch with precision timing - Perfect for workouts, cooking, productivity sessions, and time tracking. Free countdown timer with customizable alerts and lap timing."
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            ⏱️ Professional timing tools for all your needs. Set custom timers with audio alerts or use the precision stopwatch with lap timing functionality.
          </p>
        </div>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Stopwatch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold mb-6 text-primary">
                {formatTime(timerRemaining)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                <div>
                  <Label>Minutes</Label>
                  <Input
                    type="number"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    max="999"
                    disabled={timerRunning}
                  />
                </div>
                <div>
                  <Label>Seconds</Label>
                  <Input
                    type="number"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    min="0"
                    max="59"
                    disabled={timerRunning}
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                {!timerRunning ? (
                  <Button onClick={startTimer} size="lg" disabled={timerMinutes === 0 && timerSeconds === 0}>
                    <Play className="mr-2 h-5 w-5" /> Start Timer
                  </Button>
                ) : (
                  <Button onClick={pauseTimer} size="lg" variant="secondary">
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </Button>
                )}
                <Button onClick={resetTimer} size="lg" variant="outline">
                  <RotateCcw className="mr-2 h-5 w-5" /> Reset
                </Button>
              </div>

              <div>
                <Label className="mb-3 block">Quick Presets</Label>
                <div className="grid grid-cols-4 gap-2 max-w-2xl mx-auto">
                  {presetTimers.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setPresetTimer(preset.minutes, preset.seconds)}
                      disabled={timerRunning}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stopwatch" className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold mb-6 text-primary">
                {formatStopwatchTime(stopwatchTime)}
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                {!stopwatchRunning ? (
                  <Button onClick={startStopwatch} size="lg">
                    <Play className="mr-2 h-5 w-5" /> Start
                  </Button>
                ) : (
                  <Button onClick={pauseStopwatch} size="lg" variant="secondary">
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </Button>
                )}
                <Button onClick={addLap} size="lg" variant="outline" disabled={!stopwatchRunning}>
                  <Plus className="mr-2 h-5 w-5" /> Lap
                </Button>
                <Button onClick={resetStopwatch} size="lg" variant="outline">
                  <RotateCcw className="mr-2 h-5 w-5" /> Reset
                </Button>
              </div>

              {lapTimes.length > 0 && (
                <div className="max-w-md mx-auto">
                  <Label className="mb-3 block">Lap Times</Label>
                  <div className="bg-muted rounded-lg p-4 max-h-60 overflow-y-auto">
                    {lapTimes.map((lapTime, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span className="font-medium">Lap {index + 1}</span>
                        <span className="font-mono">{formatStopwatchTime(lapTime)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolPageTemplate>
  );
};

export default TimerStopwatch;
