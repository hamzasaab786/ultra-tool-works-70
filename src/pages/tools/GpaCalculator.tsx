import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, RotateCcw, GraduationCap } from "lucide-react";

interface Course {
  id: string;
  name: string;
  credits: string;
  grade: string;
}

const GRADE_POINTS: Record<string, number> = {
  "A+": 4, A: 4, "A-": 3.7,
  "B+": 3.3, B: 3, "B-": 2.7,
  "C+": 2.3, C: 2, "C-": 1.7,
  "D+": 1.3, D: 1, F: 0,
};

interface Semester {
  id: string;
  gpa: string;
  credits: string;
}

const newId = () => Math.random().toString(36).slice(2, 9);

const GpaCalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: newId(), name: "", credits: "3", grade: "A" },
    { id: newId(), name: "", credits: "3", grade: "B+" },
  ]);
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: newId(), gpa: "", credits: "" },
    { id: newId(), gpa: "", credits: "" },
  ]);

  const gpa = useMemo(() => {
    let points = 0;
    let credits = 0;
    courses.forEach((c) => {
      const cr = parseFloat(c.credits);
      const gp = GRADE_POINTS[c.grade];
      if (!isNaN(cr) && cr > 0 && gp !== undefined) {
        points += cr * gp;
        credits += cr;
      }
    });
    return { value: credits > 0 ? points / credits : 0, credits, points };
  }, [courses]);

  const cgpa = useMemo(() => {
    let points = 0;
    let credits = 0;
    semesters.forEach((s) => {
      const g = parseFloat(s.gpa);
      const cr = parseFloat(s.credits);
      if (!isNaN(g) && !isNaN(cr) && cr > 0) {
        points += g * cr;
        credits += cr;
      }
    });
    return { value: credits > 0 ? points / credits : 0, credits };
  }, [semesters]);

  const updateCourse = (id: string, patch: Partial<Course>) =>
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const updateSemester = (id: string, patch: Partial<Semester>) =>
    setSemesters((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <ToolPageTemplate
      title="GPA & CGPA Calculator"
      description="Calculate your semester GPA from course credits and letter grades, then combine every semester into an accurate cumulative CGPA on the 4.0 scale."
      keywords="gpa calculator, cgpa calculator, semester gpa, 4.0 scale grade calculator"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Semester GPA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {courses.map((c, i) => (
              <div key={c.id} className="grid grid-cols-12 gap-2">
                <Input
                  className="col-span-5"
                  placeholder={`Course ${i + 1}`}
                  value={c.name}
                  onChange={(e) => updateCourse(c.id, { name: e.target.value })}
                />
                <Input
                  className="col-span-3"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Credits"
                  value={c.credits}
                  onChange={(e) => updateCourse(c.id, { credits: e.target.value })}
                />
                <div className="col-span-3">
                  <Select value={c.grade} onValueChange={(v) => updateCourse(c.id, { grade: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(GRADE_POINTS).map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="col-span-1"
                  onClick={() => setCourses((p) => p.filter((x) => x.id !== c.id))}
                  aria-label="Remove course"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setCourses((p) => [...p, { id: newId(), name: "", credits: "3", grade: "A" }])}>
                <Plus className="mr-1 h-4 w-4" /> Add course
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCourses([{ id: newId(), name: "", credits: "3", grade: "A" }])}>
                <RotateCcw className="mr-1 h-4 w-4" /> Reset
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Semester GPA</p>
              <p className="text-3xl font-bold text-primary">{gpa.value.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                {gpa.credits} credits · {gpa.points.toFixed(1)} grade points
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative CGPA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {semesters.map((s, i) => (
              <div key={s.id} className="grid grid-cols-12 items-center gap-2">
                <Label className="col-span-3 text-sm">Sem {i + 1}</Label>
                <Input
                  className="col-span-4"
                  type="number"
                  step="0.01"
                  placeholder="GPA"
                  value={s.gpa}
                  onChange={(e) => updateSemester(s.id, { gpa: e.target.value })}
                />
                <Input
                  className="col-span-4"
                  type="number"
                  placeholder="Credits"
                  value={s.credits}
                  onChange={(e) => updateSemester(s.id, { credits: e.target.value })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="col-span-1"
                  onClick={() => setSemesters((p) => p.filter((x) => x.id !== s.id))}
                  aria-label="Remove semester"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setSemesters((p) => [...p, { id: newId(), gpa: "", credits: "" }])}>
              <Plus className="mr-1 h-4 w-4" /> Add semester
            </Button>

            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Cumulative CGPA</p>
              <p className="text-3xl font-bold text-primary">{cgpa.value.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{cgpa.credits} total credits</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Percentage estimate: {(cgpa.value * 25).toFixed(1)}% (CGPA × 25, common conversion)
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default GpaCalculator;
