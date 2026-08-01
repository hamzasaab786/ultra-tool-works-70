import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sunrise } from "lucide-react";

const CYCLE = 90; // minutes
const FALL_ASLEEP = 15;

const toTime = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const SleepCalculator = () => {
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [time, setTime] = useState("06:30");

  const results = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return [];
    const base = new Date();
    base.setHours(h, m, 0, 0);
    return [6, 5, 4, 3].map((cycles) => {
      const t = new Date(
        mode === "wake"
          ? base.getTime() - (cycles * CYCLE + FALL_ASLEEP) * 60000
          : base.getTime() + (cycles * CYCLE + FALL_ASLEEP) * 60000,
      );
      return { cycles, time: t, hours: ((cycles * CYCLE) / 60).toFixed(1) };
    });
  }, [time, mode]);

  return (
    <ToolPageTemplate
      title="Sleep Calculator"
      description="Find the best bedtime or wake-up time based on 90-minute sleep cycles so you wake up refreshed, not groggy."
    >
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Moon className="h-5 w-5" /> What do you want to plan?</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button className="flex-1" variant={mode === "wake" ? "default" : "outline"} onClick={() => setMode("wake")}>
                I want to wake up at…
              </Button>
              <Button className="flex-1" variant={mode === "sleep" ? "default" : "outline"} onClick={() => setMode("sleep")}>
                I'm going to bed at…
              </Button>
            </div>
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="t">{mode === "wake" ? "Wake-up time" : "Bedtime"}</Label>
              <Input id="t" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sunrise className="h-5 w-5" />
              {mode === "wake" ? "Go to bed at one of these times" : "Best times to wake up"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {results.map((r, idx) => (
              <div key={r.cycles} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="text-2xl font-bold">{toTime(r.time)}</div>
                  <div className="text-sm text-muted-foreground">{r.cycles} cycles · {r.hours} h sleep</div>
                </div>
                {idx === 0 && <Badge>Recommended</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Based on average 90-minute sleep cycles plus about 15 minutes to fall asleep. Individual cycles vary.
        </p>
      </div>
    </ToolPageTemplate>
  );
};

export default SleepCalculator;
