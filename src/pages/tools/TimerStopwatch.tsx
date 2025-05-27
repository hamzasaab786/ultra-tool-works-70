
import React, { useState, useCallback, useEffect, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Square, RotateCcw, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TimerStopwatch = () => {
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerTime, setTimerTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  
  const stopwatchInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Stopwatch functions
  const startStopwatch = useCallback(() => {
    setStopwatchRunning(true);
    stopwatchInterval.current = setInterval(() => {
      setStopwatchTime(prev => prev + 10);
    }, 10);
  }, []);

  const pauseStopwatch = useCallback(() => {
    setStopwatchRunning(false);
    if (stopwatchInterval.current) {
      clearInterval(stopwatchInterval.current);
    }
  }, []);

  const resetStopwatch = useCallback(() => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
    if (stopwatchInterval.current) {
      clearInterval(stopwatchInterval.current);
    }
  }, []);

  const addLap = useCallback(() => {
    if (stopwatchRunning) {
      setLaps(prev => [...prev, stopwatchTime]);
    }
  }, [stopwatchTime, stopwatchRunning]);

  // Timer functions
  const startTimer = useCallback(() => {
    const totalTime = timerMinutes * 60 + timerSeconds;
    if (totalTime <= 0) {
      toast({
        title: "Error",
        description: "Please set a valid time",
        variant: "destructive"
      });
      return;
    }
    
    setTimerTime(totalTime * 1000);
    setTimerRunning(true);
    
    timerInterval.current = setInterval(() => {
      setTimerTime(prev => {
        if (prev <= 1000) {
          setTimerRunning(false);
          toast({
            title: "Time's Up!",
            description: "Your timer has finished",
          });
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  }, [timerMinutes, timerSeconds]);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerTime(0);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  }, []);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (stopwatchInterval.current) clearInterval(stopwatchInterval.current);
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const formatTimerTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ToolPageTemplate
      title="Timer & Stopwatch"
      description="Professional timer and stopwatch with lap tracking and precise timing"
    >
      <div className="space-y-6">
        <Tabs defaultValue="stopwatch" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
            <TabsTrigger value="timer">Timer</TabsTrigger>
          </TabsList>

          <TabsContent value="stopwatch" className="space-y-6">
            <div className="text-center space-y-6">
              <div className="text-6xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatTime(stopwatchTime)}
              </div>
              
              <div className="flex justify-center space-x-4">
                {!stopwatchRunning ? (
                  <Button onClick={startStopwatch} size="lg" className="px-8">
                    <Play className="mr-2 h-5 w-5" /> Start
                  </Button>
                ) : (
                  <Button onClick={pauseStopwatch} size="lg" variant="secondary" className="px-8">
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </Button>
                )}
                
                <Button onClick={resetStopwatch} size="lg" variant="outline" className="px-8">
                  <RotateCcw className="mr-2 h-5 w-5" /> Reset
                </Button>
                
                <Button 
                  onClick={addLap} 
                  size="lg" 
                  variant="outline" 
                  disabled={!stopwatchRunning}
                  className="px-8"
                >
                  Lap
                </Button>
              </div>

              {laps.length > 0 && (
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">Lap Times</h3>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {laps.map((lap, index) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>Lap {index + 1}</span>
                        <span className="font-mono">{formatTime(lap)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timer" className="space-y-6">
            <div className="text-center space-y-6">
              <div className="text-6xl font-mono font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {timerRunning ? formatTimerTime(timerTime) : `${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`}
              </div>
              
              {!timerRunning && timerTime === 0 && (
                <div className="max-w-xs mx-auto grid grid-cols-2 gap-4">
                  <div>
                    <Label>Minutes</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Seconds</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={timerSeconds}
                      onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-center space-x-4">
                {!timerRunning ? (
                  <Button onClick={startTimer} size="lg" className="px-8">
                    <Clock className="mr-2 h-5 w-5" /> Start Timer
                  </Button>
                ) : (
                  <Button onClick={pauseTimer} size="lg" variant="secondary" className="px-8">
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </Button>
                )}
                
                <Button onClick={resetTimer} size="lg" variant="outline" className="px-8">
                  <Square className="mr-2 h-5 w-5" /> Stop
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolPageTemplate>
  );
};

export default TimerStopwatch;
