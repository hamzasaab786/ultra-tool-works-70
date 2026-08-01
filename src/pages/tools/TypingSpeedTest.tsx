import React, { useEffect, useMemo, useRef, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Keyboard, RotateCcw } from "lucide-react";

const SAMPLES = [
  "The quick brown fox jumps over the lazy dog while the morning sun rises slowly above the quiet river and the city begins another ordinary day.",
  "Learning to type quickly is less about speed and more about rhythm; keep your fingers on the home row, look at the screen and let accuracy build your pace.",
  "Good software is written for people first and machines second, so keep your code simple, name things clearly and remove anything that does not earn its place.",
];

const DURATIONS = [15, 30, 60, 120];

const TypingSpeedTest = () => {
  const [duration, setDuration] = useState(60);
  const [sample, setSample] = useState(SAMPLES[0]);
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState(60);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!started || finished) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setFinished(true);
          setStarted(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [started, finished]);

  const stats = useMemo(() => {
    const elapsed = Math.max(1, duration - remaining);
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === sample[i]) correct++;
    const accuracy = typed.length ? (correct / typed.length) * 100 : 100;
    const wpm = correct / 5 / (elapsed / 60);
    const rawWpm = typed.length / 5 / (elapsed / 60);
    return { wpm: Math.round(wpm), rawWpm: Math.round(rawWpm), accuracy: Math.round(accuracy), chars: typed.length, errors: typed.length - correct };
  }, [typed, remaining, duration, sample]);

  const reset = (d = duration) => {
    setDuration(d);
    setRemaining(d);
    setTyped("");
    setStarted(false);
    setFinished(false);
    setSample(SAMPLES[Math.floor(Math.random() * SAMPLES.length)]);
    inputRef.current?.focus();
  };

  return (
    <ToolPageTemplate
      title="Typing Speed Test"
      description="Test your typing speed in WPM with live accuracy tracking. Choose 15, 30, 60 or 120 seconds and beat your record."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2"><Keyboard className="h-5 w-5" /> Test</span>
              <Badge variant="secondary" className="text-base">{remaining}s</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <Button key={d} size="sm" variant={duration === d ? "default" : "outline"} onClick={() => reset(d)}>
                  {d}s
                </Button>
              ))}
              <Button size="sm" variant="outline" onClick={() => reset()}>
                <RotateCcw className="mr-2 h-4 w-4" /> Restart
              </Button>
            </div>

            <p className="rounded-lg border bg-muted/40 p-4 text-lg leading-relaxed">
              {sample.split("").map((ch, i) => {
                const state = i < typed.length ? (typed[i] === ch ? "ok" : "bad") : i === typed.length ? "cur" : "idle";
                return (
                  <span
                    key={i}
                    className={
                      state === "ok"
                        ? "text-primary"
                        : state === "bad"
                          ? "bg-destructive/20 text-destructive"
                          : state === "cur"
                            ? "border-b-2 border-primary"
                            : "text-muted-foreground"
                    }
                  >
                    {ch}
                  </span>
                );
              })}
            </p>

            <textarea
              ref={inputRef}
              value={typed}
              disabled={finished}
              onChange={(e) => {
                if (!started && !finished) setStarted(true);
                setTyped(e.target.value.slice(0, sample.length));
                if (e.target.value.length >= sample.length) {
                  setFinished(true);
                  setStarted(false);
                }
              }}
              placeholder="Start typing here — the timer starts on your first keystroke"
              className="min-h-[120px] w-full rounded-lg border bg-background p-3 text-base outline-none focus:ring-2 focus:ring-ring"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{finished ? "Your result" : "Live stats"}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Net WPM" value={String(stats.wpm)} />
            <Stat label="Raw WPM" value={String(stats.rawWpm)} />
            <Stat label="Accuracy" value={`${stats.accuracy}%`} />
            <Stat label="Errors" value={String(stats.errors)} />
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border p-4 text-center">
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default TypingSpeedTest;
