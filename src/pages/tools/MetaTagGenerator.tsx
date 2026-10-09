import React, { useMemo, useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const MetaTagGenerator = () => {
  const [title, setTitle] = useState("Free Online PDF Tools — Merge, Split & Compress");
  const [desc, setDesc] = useState("Merge, split, compress and convert PDF files free in your browser. No signup, no watermark and your files never leave your device.");
  const [url, setUrl] = useState("https://example.com/");
  const [image, setImage] = useState("https://example.com/og-image.jpg");
  const [site, setSite] = useState("Example");
  const [twitter, setTwitter] = useState("");
  const [index, setIndex] = useState(true);

  const tl = title.length, dl = desc.length;
  const code = useMemo(() => {
    const t = esc(title), d = esc(desc);
    return [
      `<title>${t}</title>`,
      `<meta name="description" content="${d}" />`,
      `<meta name="robots" content="${index ? "index, follow" : "noindex, nofollow"}" />`,
      `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
      url && `<link rel="canonical" href="${esc(url)}" />`,
      ``,
      `<!-- Open Graph -->`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:title" content="${t}" />`,
      `<meta property="og:description" content="${d}" />`,
      url && `<meta property="og:url" content="${esc(url)}" />`,
      image && `<meta property="og:image" content="${esc(image)}" />`,
      site && `<meta property="og:site_name" content="${esc(site)}" />`,
      ``,
      `<!-- Twitter / X -->`,
      `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
      `<meta name="twitter:title" content="${t}" />`,
      `<meta name="twitter:description" content="${d}" />`,
      image && `<meta name="twitter:image" content="${esc(image)}" />`,
      twitter && `<meta name="twitter:site" content="@${esc(twitter.replace(/^@/, ""))}" />`,
    ].filter((x): x is string => typeof x === "string").join("\n");
  }, [title, desc, url, image, site, twitter, index]);

  const host = (() => { try { return new URL(url).host; } catch { return "example.com"; } })();
  const hint = (n: number, lo: number, hi: number) => (n < lo ? "text-amber-600" : n > hi ? "text-destructive" : "text-green-600");

  return (
    <ToolPageTemplate title="Meta Tag Generator" description="Generate SEO title, meta description, canonical, Open Graph and Twitter Card tags with live Google and social previews.">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-3">
            <div><Label htmlFor="t" className="flex justify-between"><span>Page title</span><span className={hint(tl, 30, 60)}>{tl}/60</span></Label><Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div><Label htmlFor="d" className="flex justify-between"><span>Meta description</span><span className={hint(dl, 70, 160)}>{dl}/160</span></Label><Textarea id="d" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
            <div><Label htmlFor="u">Canonical URL</Label><Input id="u" value={url} onChange={(e) => setUrl(e.target.value)} /></div>
            <div><Label htmlFor="i">Social share image URL (1200×630)</Label><Input id="i" value={image} onChange={(e) => setImage(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="s">Site name</Label><Input id="s" value={site} onChange={(e) => setSite(e.target.value)} /></div>
              <div><Label htmlFor="tw">X / Twitter handle</Label><Input id="tw" placeholder="@brand" value={twitter} onChange={(e) => setTwitter(e.target.value)} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch id="ix" checked={index} onCheckedChange={setIndex} /><Label htmlFor="ix">Allow search engines to index</Label></div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Google preview</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{host}</p>
              <p className="text-lg text-primary truncate">{title || "Page title"}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{desc.length > 160 ? desc.slice(0, 157) + "…" : desc}</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            {image && <img src={image} alt="Social share preview" className="aspect-[1200/630] w-full bg-muted object-cover" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />}
            <CardContent className="p-3">
              <p className="text-xs uppercase text-muted-foreground">{host}</p>
              <p className="font-semibold truncate">{title}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{desc}</p>
            </CardContent>
          </Card>
          <pre className="max-h-80 overflow-auto rounded-lg border bg-muted/50 p-4 text-xs"><code>{code}</code></pre>
          <Button onClick={() => { navigator.clipboard.writeText(code); toast.success("Meta tags copied"); }}><Copy className="h-4 w-4 mr-1" /> Copy HTML</Button>
        </div>
      </div>
    </ToolPageTemplate>
  );
};

export default MetaTagGenerator;
