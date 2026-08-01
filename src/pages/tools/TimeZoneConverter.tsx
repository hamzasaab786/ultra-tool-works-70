import React, { useEffect, useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Plus, Trash2 } from "lucide-react";

const ZONES = [
  "UTC", "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York",
  "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Africa/Cairo", "Africa/Lagos", "Africa/Johannesburg", "Asia/Dubai", "Asia/Karachi",
  "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok", "Asia/Shanghai", "Asia/Singapore",
  "Asia/Tokyo", "Asia/Seoul", "Australia/Sydney", "Pacific/Auckland",
];

const pad = (n: number) => String(n).padStart(2, "0");

const TimeZoneConverter = () => {
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();

  const [sourceZone, setSourceZone] = useState(ZONES.includes(localZone) ? localZone : "UTC");
  const [date, setDate] = useState(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
  const [time, setTime] = useState(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
  const [targets, setTargets] = useState<string[]>(["UTC", "America/New_York", "Europe/London", "Asia/Dubai"]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  /** Offset (ms) of a zone at a given instant. */
  const zoneOffset = (zone: string, instant: Date) => {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: zone, hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    const parts = dtf.formatToParts(instant).reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});
    const asUTC = Date.UTC(
      Number(parts.year), Number(parts.month) - 1, Number(parts.day),
      Number(parts.hour) % 24, Number(parts.minute), Number(parts.second),
    );
    return asUTC - instant.getTime();
  };

  const instant = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    if (!y || !m || !d || isNaN(hh) || isNaN(mm)) return null;
    const naive = Date.UTC(y, m - 1, d, hh, mm);
    // resolve offset iteratively (handles DST edges)
    let guess = new Date(naive);
    for (let i = 0; i < 3; i++) guess = new Date(naive - zoneOffset(sourceZone, guess));
    return guess;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time, sourceZone, tick]);

  const format = (zone: string) =>
    instant
      ? new Intl.DateTimeFormat("en-GB", {
          timeZone: zone, weekday: "short", day: "2-digit", month: "short",
          hour: "2-digit", minute: "2-digit", hour12: true, timeZoneName: "short",
        }).format(instant)
      : "—";

  return (
    <ToolPageTemplate
      title="Time Zone Converter"
      description="Convert any date and time between world time zones and compare several cities at once — perfect for scheduling meetings, calls and flights across countries."
      keywords="time zone converter, world clock, meeting time planner, utc to local time"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" /> Source time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Time zone</Label>
              <Select value={sourceZone} onValueChange={setSourceZone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {ZONES.map((z) => <SelectItem key={z} value={z}>{z.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="tz-date">Date</Label>
                <Input id="tz-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="tz-time">Time</Label>
                <Input id="tz-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const d = new Date();
                setDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
                setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
              }}
            >
              Use current time
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Converted times</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {targets.map((z) => (
              <div key={z} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{z.replace(/_/g, " ")}</p>
                  <p className="text-sm text-primary">{format(z)}</p>
                </div>
                <Button variant="ghost" size="icon" aria-label={`Remove ${z}`} onClick={() => setTargets((p) => p.filter((x) => x !== z))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Select value="" onValueChange={(v) => setTargets((p) => (p.includes(v) ? p : [...p, v]))}>
                <SelectTrigger><SelectValue placeholder="Add a time zone" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {ZONES.filter((z) => !targets.includes(z)).map((z) => (
                    <SelectItem key={z} value={z}>{z.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Plus className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default TimeZoneConverter;
