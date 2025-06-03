
import React, { useState, useEffect, useRef } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw, Clock, Timer } from "lucide-react";

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
  const [timerFinished, setTimerFinished] = useState(false);

  const stopwatchRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Stopwatch effects
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(stopwatchRef.current);
    }

    return () => clearInterval(stopwatchRef.current);
  }, [stopwatchRunning]);

  // Timer effects
  useEffect(() => {
    if (timerRunning && timerTime > 0) {
      timerRef.current = setInterval(() => {
        setTimerTime(prev => {
          if (prev <= 100) {
            setTimerRunning(false);
            setTimerFinished(true);
            toast({
              title: "Timer Finished!",
              description: "Your timer has completed.",
            });
            // Play notification sound (if available)
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgAz2a3/LJJQMKZ');
              audio.play().catch(() => {});
            } catch (e) {}
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerTime, toast]);

  // Format time function
  const formatTime = (time: number, showMilliseconds = false) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    if (showMilliseconds) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Stopwatch functions
  const startStopwatch = () => {
    setStopwatchRunning(!stopwatchRunning);
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const recordLap = () => {
    if (stopwatchRunning) {
      setLaps(prev => [...prev, stopwatchTime]);
    }
  };

  // Timer functions
  const startTimer = () => {
    if (timerTime === 0) {
      const totalTime = (timerMinutes * 60 + timerSeconds) * 1000;
      if (totalTime === 0) {
        toast({
          title: "Error",
          description: "Please set a timer duration",
          variant: "destructive"
        });
        return;
      }
      setTimerTime(totalTime);
    }
    setTimerRunning(!timerRunning);
    setTimerFinished(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerTime(0);
    setTimerFinished(false);
  };

  return (
    <ToolPageTemplate
      title="Timer & Stopwatch"
      description="Professional timer and stopwatch with lap functionality"
      keywords="timer, stopwatch, countdown timer, lap timer, time tracking"
    >
      <Tabs defaultValue="stopwatch" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stopwatch" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Stopwatch
          </TabsTrigger>
          <TabsTrigger value="timer" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Timer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stopwatch" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-mono font-bold mb-6 text-blue-600">
                {formatTime(stopwatchTime, true)}
              </div>
              
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  onClick={startStopwatch}
                  size="lg"
                  className={stopwatchRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                >
                  {stopwatchRunning ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={recordLap}
                  variant="outline"
                  size="lg"
                  disabled={!stopwatchRunning}
                >
                  Lap
                </Button>
                
                <Button
                  onClick={resetStopwatch}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {laps.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Lap Times</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {laps.map((lap, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Lap {index + 1}</span>
                      <span className="font-mono">{formatTime(lap, true)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timer" className="space-y-6">
          <Card>
            <CardContent className="p-8">
              {timerTime === 0 ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-center mb-6">Set Timer Duration</h3>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div>
                      <Label htmlFor="minutes">Minutes</Label>
                      <Input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                        className="text-center text-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seconds">Seconds</Label>
                      <Input
                        id="seconds"
                        type="number"
                        min="0"
                        max="59"
                        value={timerSeconds}
                        onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                        className="text-center text-lg"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`text-6xl font-mono font-bold mb-6 ${timerFinished ? 'text-red-600' : 'text-green-600'}`}>
                    {formatTime(timerTime)}
                  </div>
                  
                  {timerFinished && (
                    <div className="text-xl font-semibold text-red-600 mb-4">
                      Time's Up!
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={startTimer}
                  size="lg"
                  disabled={timerFinished}
                  className={timerRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                >
                  {timerRunning ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Features:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• High-precision stopwatch with lap functionality</li>
          <li>• Customizable countdown timer</li>
          <li>• Audio notification when timer completes</li>
          <li>• Clean, easy-to-read display</li>
        </ul>
      </div>
    </ToolPageTemplate>
  );
};

export default TimerStopwatch;
