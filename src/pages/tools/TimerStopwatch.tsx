
import React, { useState, useEffect, useCallback, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Square, RotateCcw, Clock, Timer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TimerStopwatch = () => {
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTime, setTimerTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer functions
  const startTimer = useCallback(() => {
    if (timerTime === 0) {
      const totalSeconds = timerMinutes * 60 + timerSeconds;
      setTimerTime(totalSeconds);
    }
    setTimerRunning(true);
  }, [timerMinutes, timerSeconds, timerTime]);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerTime(0);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerTime(0);
  }, []);

  // Stopwatch functions
  const startStopwatch = useCallback(() => {
    setStopwatchRunning(true);
  }, []);

  const pauseStopwatch = useCallback(() => {
    setStopwatchRunning(false);
  }, []);

  const resetStopwatch = useCallback(() => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  }, []);

  const addLap = useCallback(() => {
    setLaps(prev => [...prev, stopwatchTime]);
  }, [stopwatchTime]);

  // Timer effect
  useEffect(() => {
    if (timerRunning && timerTime > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerTime(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            toast({
              title: "Time's Up!",
              description: "Your timer has finished",
            });
            // Play notification sound (if available)
            if ('Notification' in window) {
              new Notification('Timer Finished!', {
                body: 'Your countdown timer has reached zero.',
                icon: '/favicon.ico'
              });
            }
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
  }, [timerRunning, timerTime]);

  // Stopwatch effect
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

  const formatTime = (time: number, includeMs = false) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);

    if (includeMs) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatStopwatchTime = (centiseconds: number) => {
    const totalSeconds = Math.floor(centiseconds / 100);
    const cs = centiseconds % 100;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  return (
    <ToolPageTemplate
      title="Timer & Stopwatch"
      description="Professional timer and stopwatch tool with lap tracking - Perfect for workouts, cooking, productivity sessions, and time management. Free online timer with audio alerts."
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-sm text-muted-foreground">
            ⏱️ Professional timer and stopwatch with precision timing, lap tracking, and audio notifications. Perfect for workouts, cooking, and productivity sessions.
          </p>
        </div>

        <Tabs defaultValue="timer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timer">
              <Timer className="mr-2 h-4 w-4" /> Timer
            </TabsTrigger>
            <TabsTrigger value="stopwatch">
              <Clock className="mr-2 h-4 w-4" /> Stopwatch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6">
            <div className="text-center space-y-6">
              <div className="text-6xl font-mono font-bold text-primary">
                {formatTime(timerTime)}
              </div>
              
              <div className="flex justify-center space-x-4">
                <div className="space-y-2">
                  <Label>Minutes</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                    disabled={timerRunning}
                    className="w-20 text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Seconds</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                    disabled={timerRunning}
                    className="w-20 text-center"
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                {!timerRunning ? (
                  <Button onClick={startTimer} disabled={timerMinutes === 0 && timerSeconds === 0}>
                    <Play className="mr-2 h-4 w-4" /> Start
                  </Button>
                ) : (
                  <Button onClick={pauseTimer}>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </Button>
                )}
                <Button onClick={resetTimer} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button onClick={stopTimer} variant="destructive">
                  <Square className="mr-2 h-4 w-4" /> Stop
                </Button>
              </div>

              {timerTime > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${((timerMinutes * 60 + timerSeconds - timerTime) / (timerMinutes * 60 + timerSeconds)) * 100}%` 
                    }}
                  ></div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stopwatch" className="space-y-6">
            <div className="text-center space-y-6">
              <div className="text-6xl font-mono font-bold text-primary">
                {formatStopwatchTime(stopwatchTime)}
              </div>

              <div className="flex justify-center space-x-2">
                {!stopwatchRunning ? (
                  <Button onClick={startStopwatch}>
                    <Play className="mr-2 h-4 w-4" /> Start
                  </Button>
                ) : (
                  <Button onClick={pauseStopwatch}>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </Button>
                )}
                <Button onClick={addLap} disabled={!stopwatchRunning} variant="outline">
                  Lap
                </Button>
                <Button onClick={resetStopwatch} variant="destructive">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>

              {laps.length > 0 && (
                <div className="max-w-md mx-auto">
                  <h3 className="font-semibold mb-4">Lap Times</h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {laps.map((lap, index) => (
                      <div key={index} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                        <span>Lap {index + 1}</span>
                        <span className="font-mono">{formatStopwatchTime(lap)}</span>
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
