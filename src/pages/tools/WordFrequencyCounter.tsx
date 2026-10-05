import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

const STOP = new Set("a an the and or but if of to in on for with at by is are was were be been it this that these those as from i you he she we they my your our their its not no so do does did have has had will would can could".split(" "));

const WordFrequencyCounter = () => {
  const [text, setText] = useState("Paste an article here to see which words appear most often. Word frequency helps writers spot repetition, and SEO writers check keyword density. Frequency, density and repetition all matter.");
  const [skipStop, setSkipStop] = useState(true);
  const [n, setN] = useState<1 | 2 | 3>(1);

  const { rows, total } = useMemo(() => {
    const words = (text.toLowerCase().match(/[\p{L}\p{N}']+/gu) || []).map((w) => w.replace(/^'+|'+$/g, "")).filter(Boolean);
    const counts = new Map<string, number>();
    let total = 0;
    for (let i = 0; i + n <= words.length; i++) {
      const gram = words.slice(i, i + n);
      if (skipStop && (STOP.has(gram[0]) || STOP.has(gram[gram.length - 1]))) continue;
      const k = gram.join(" ");
      counts.set(k, (counts.get(k) || 0) + 1);
      total++;
    }
    const rows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return { rows, total: words.length };
  }, [text, skipStop, n]);

  const csv = () => {
    const body = "phrase,count,density\n" + rows.map(([w, c]) => `"${w}",${c},${((c / Math.max(total, 1)) * 100).toFixed(2)}%`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = "word-frequency.csv";
    a.click();
  };

  return (
    <ToolPageTemplate title="Word Frequency Counter" description="Count how often every word or phrase appears in your text, with keyword density percentages and CSV export.">
      <Card>
        <CardContent className="p-6 space-y-4">
          <Textarea aria-label="Text" className="min-h-[200px]" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex flex-wrap items-center gap-4">
            {[1, 2, 3].map((k) => (
              <Button key={k} size="sm" variant={n === k ? "default" : "outline"} onClick={() => setN(k as 1 | 2 | 3)}>{k === 1 ? "Single words" : `${k}-word phrases`}</Button>
            ))}
            <div className="flex items-center gap-2"><Switch id="sw" checked={skipStop} onCheckedChange={setSkipStop} /><Label htmlFor="sw">Ignore common words</Label></div>
            <span className="text-sm text-muted-foreground">{total} words · {rows.length} unique</span>
            <Button size="sm" variant="outline" className="ml-auto" disabled={!rows.length} onClick={csv}><Download className="h-4 w-4 mr-1" /> CSV</Button>
          </div>
          <div className="max-h-[420px] overflow-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted"><tr><th className="p-2 text-left">#</th><th className="p-2 text-left">Word / phrase</th><th className="p-2 text-right">Count</th><th className="p-2 text-right">Density</th></tr></thead>
              <tbody>
                {rows.slice(0, 300).map(([w, c], i) => (
                  <tr key={w} className="border-t"><td className="p-2 text-muted-foreground">{i + 1}</td><td className="p-2">{w}</td><td className="p-2 text-right">{c}</td><td className="p-2 text-right">{((c / Math.max(total, 1)) * 100).toFixed(2)}%</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </ToolPageTemplate>
  );
};

export default WordFrequencyCounter;
