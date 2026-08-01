import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

const ACTIVITY = [
  { label: "Sedentary (little exercise)", value: 1.2 },
  { label: "Light (1–3 days/week)", value: 1.375 },
  { label: "Moderate (3–5 days/week)", value: 1.55 },
  { label: "Active (6–7 days/week)", value: 1.725 },
  { label: "Very active (physical job)", value: 1.9 },
];

const CalorieCalculator = () => {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("28");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("70");
  const [activity, setActivity] = useState(1.375);

  const result = useMemo(() => {
    const a = parseFloat(age);
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (!a || !h || !w) return null;
    // Mifflin-St Jeor
    const bmr = 10 * w + 6.25 * h - 5 * a + (gender === "male" ? 5 : -161);
    const tdee = bmr * activity;
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      mildLoss: Math.round(tdee - 275),
      loss: Math.round(tdee - 550),
      gain: Math.round(tdee + 400),
      protein: Math.round(w * 1.8),
    };
  }, [age, heightCm, weightKg, gender, activity]);

  return (
    <ToolPageTemplate
      title="Calorie Calculator (BMR & TDEE)"
      description="Find your daily calorie needs for maintenance, weight loss or muscle gain using the Mifflin-St Jeor formula."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5" /> Your details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {(["male", "female"] as const).map((g) => (
                <Button key={g} variant={gender === g ? "default" : "outline"} className="flex-1 capitalize" onClick={() => setGender(g)}>
                  {g}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Activity level</Label>
              <div className="grid gap-2">
                {ACTIVITY.map((a) => (
                  <Button key={a.value} size="sm" variant={activity === a.value ? "default" : "outline"} onClick={() => setActivity(a.value)}>
                    {a.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Your daily calories</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {result ? (
              <>
                <Row label="BMR (at rest)" value={`${result.bmr} kcal`} />
                <Row label="Maintenance (TDEE)" value={`${result.tdee} kcal`} strong />
                <Row label="Mild weight loss (~0.25 kg/week)" value={`${result.mildLoss} kcal`} />
                <Row label="Weight loss (~0.5 kg/week)" value={`${result.loss} kcal`} />
                <Row label="Lean muscle gain" value={`${result.gain} kcal`} />
                <Row label="Suggested protein" value={`${result.protein} g/day`} />
                <p className="pt-2 text-xs text-muted-foreground">
                  Estimates only — not medical advice. Consult a doctor or dietitian before changing your diet.
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">Enter your details to see results.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className={`flex items-center justify-between border-b pb-2 ${strong ? "text-lg font-bold" : ""}`}>
    <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default CalorieCalculator;
