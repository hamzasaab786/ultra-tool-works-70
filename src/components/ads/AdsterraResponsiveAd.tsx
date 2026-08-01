import { useEffect, useState, useMemo } from "react";

export interface AdVariant {
  /** Max-width (in px) below which this variant should display. */
  maxWidth: number;
  adKey: string;
  width: number;
  height: number;
  /** Optional label for debugging. */
  label?: string;
}

interface AdsterraResponsiveAdProps {
  /** Ordered from smallest to largest breakpoint. */
  variants: AdVariant[];
  /** Default to show while/instead of no match. */
  defaultAdKey?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  className?: string;
}

/**
 * Responsive Adsterra iframe ad slot.
 * Picks the best variant based on the current viewport width.
 * Ads are rendered in a sandboxed iframe so their scripts never leak into the app.
 */
const AdsterraResponsiveAd = ({
  variants,
  defaultAdKey,
  defaultWidth = 320,
  defaultHeight = 50,
  className = "",
}: AdsterraResponsiveAdProps) => {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const variant = useMemo(() => {
    if (!variants.length) return null;

    // Pick the largest matching variant by breakpoint.
    let matched: AdVariant | null = null;
    for (const v of variants) {
      if (viewportWidth <= v.maxWidth) matched = v;
    }
    // Fallback to the last (largest) variant if viewport is larger than all breakpoints.
    return matched || variants[variants.length - 1];
  }, [variants, viewportWidth]);

  const active = variant || {
    adKey: defaultAdKey || variants[0]?.adKey || "",
    width: variant?.width || defaultWidth,
    height: variant?.height || defaultHeight,
  };

  if (!active.adKey) return null;

  const srcDoc = useMemo(
    () => `<!DOCTYPE html><html><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html,body{margin:0;padding:0;overflow:hidden;background:transparent;display:flex;align-items:center;justify-content:center;min-height:${active.height}px;}
  iframe{width:100%;height:100%;border:0;}
</style>
</head><body>
<script type="text/javascript">
  atOptions = { 'key':'${active.adKey}', 'format':'iframe', 'height':${active.height}, 'width':${active.width}, 'params':{} };
<\/script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${active.adKey}/invoke.js"><\/script>
</body></html>`,
    [active.adKey, active.width, active.height]
  );

  return (
    <div
      className={`w-full flex justify-center my-6 px-2 sm:px-4 ${className}`}
      style={{ minHeight: active.height }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: active.width,
          height: active.height,
          maxWidth: "100%",
        }}
      >
        <iframe
          title="Advertisement"
          srcDoc={srcDoc}
          width={active.width}
          height={active.height}
          scrolling="no"
          loading="lazy"
          className="block"
          style={{ border: 0, width: active.width, height: active.height, maxWidth: "100%" }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        />
      </div>
    </div>
  );
};

export default AdsterraResponsiveAd;
