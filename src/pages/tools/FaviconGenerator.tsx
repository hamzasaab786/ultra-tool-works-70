import React, { useState } from "react";
import ToolPageTemplate from "./ToolPageTemplate";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Image as ImageIcon } from "lucide-react";

const SIZES = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512];

const FaviconGenerator = () => {
  const [src, setSrc] = useState<HTMLImageElement | null>(null);
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);

  const build = (image: HTMLImageElement) => {
    const out = SIZES.map((size) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const min = Math.min(image.naturalWidth, image.naturalHeight);
      const sx = (image.naturalWidth - min) / 2;
      const sy = (image.naturalHeight - min) / 2;
      ctx.drawImage(image, sx, sy, min, min, 0, 0, size, size);
      return { size, url: c.toDataURL("image/png") };
    });
    setPreviews(out);
  };

  const onFile = (f?: File) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => { setSrc(image); build(image); URL.revokeObjectURL(url); };
    image.src = url;
  };

  const dl = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  const downloadAll = async () => {
    for (const p of previews) {
      dl(p.url, `favicon-${p.size}x${p.size}.png`);
      await new Promise((r) => setTimeout(r, 350));
    }
  };

  return (
    <>
      <SEO
        title="Favicon Generator - Create Favicons from Any Image Free | Klipza"
        description="Turn any PNG or JPG into crisp favicons in 10 sizes (16x16 to 512x512) including Apple touch icon. 100% browser-based, nothing is uploaded."
        keywords="favicon generator, create favicon, favicon from image, apple touch icon generator"
        canonicalUrl="https://klipza.live/tools/favicon-generator"
      />
      <ToolPageTemplate title="Favicon Generator" description="Generate every favicon size your website needs from a single image">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Upload source image</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
              <p className="text-sm text-muted-foreground">A square image of at least 512x512px gives the sharpest results. Non-square images are center-cropped.</p>
            </CardContent>
          </Card>

          {src && previews.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Generated favicons</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {previews.map((p) => (
                    <div key={p.size} className="flex flex-col items-center gap-2 rounded-lg border p-3">
                      <img src={p.url} alt={`${p.size} by ${p.size} favicon preview`} width={Math.min(p.size, 64)} height={Math.min(p.size, 64)} />
                      <span className="text-xs text-muted-foreground">{p.size}×{p.size}</span>
                      <Button size="sm" variant="outline" onClick={() => dl(p.url, `favicon-${p.size}x${p.size}.png`)}>PNG</Button>
                    </div>
                  ))}
                </div>
                <Button onClick={downloadAll}><Download className="mr-2 h-4 w-4" /> Download all sizes</Button>
                <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto">{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />`}</pre>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolPageTemplate>
    </>
  );
};

export default FaviconGenerator;
