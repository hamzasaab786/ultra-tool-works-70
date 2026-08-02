import { useEffect, useState, useMemo, useRef, useCallback } from "react";

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
  defaultAdKey?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  className?: string;
}

/** Max automatic reload attempts when an ad slot stays empty. */
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000;

/**
 * Responsive Adsterra iframe ad slot.
 * - Picks a variant from the viewport width (debounced so resizing doesn't kill the ad).
 * - Renders the ad inside a sandboxed iframe (scripts never leak into the app).
 * - Retries automatically if the ad fails to fill (slow networks / regional latency).
 */
const AdsterraResponsiveAd = ({
  variants,
  defaultAdKey,
  defaultWidth = 320,
  defaultHeight = 50,
  className = "",
}: AdsterraResponsiveAdProps) => {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [attempt, setAttempt] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const retriesRef = useRef(0);

  // Debounced resize so the iframe isn't remounted mid-drag.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let t: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setViewportWidth(window.innerWidth), 250);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const active = useMemo(() => {
    let matched: AdVariant | null = null;
    for (const v of variants) {
      if (viewportWidth <= v.maxWidth) {
        matched = v;
        break;
      }
    }
    const chosen = matched || variants[variants.length - 1];
    return (
      chosen || {
        adKey: defaultAdKey || "",
        width: defaultWidth,
        height: defaultHeight,
      }
    );
  }, [variants, viewportWidth, defaultAdKey, defaultWidth, defaultHeight]);

  const srcDoc = useMemo(
    () => `<!DOCTYPE html><html><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html,body{margin:0;padding:0;overflow:hidden;background:transparent;display:flex;align-items:center;justify-content:center;min-height:${active.height}px;}
  iframe,img{max-width:100%;border:0;}
</style>
</head><body>
<script type="text/javascript">
  atOptions = { 'key':'${active.adKey}', 'format':'iframe', 'height':${active.height}, 'width':${active.width}, 'params':{} };
  // Report fill status back to the parent so it can retry when empty.
  setTimeout(function(){
    var filled = document.body.querySelector('iframe, img, ins, div[id]');
    try { parent.postMessage({ __ad: '${active.adKey}', filled: !!filled }, '*'); } catch (e) {}
  }, 3000);
<\/script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${active.adKey}/invoke.js"><\/script>
</body></html>`,
    [active.adKey, active.width, active.height]
  );

  const retry = useCallback(() => {
    if (retriesRef.current >= MAX_RETRIES) return;
    retriesRef.current += 1;
    setAttempt((a) => a + 1);
  }, []);

  // Listen for the fill report; retry when the slot came back empty.
  useEffect(() => {
    if (!active.adKey) return;
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { __ad?: string; filled?: boolean } | undefined;
      if (!data || data.__ad !== active.adKey) return;
      if (!data.filled) setTimeout(retry, RETRY_DELAY_MS);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [active.adKey, retry]);

  // Safety net: if no report arrives at all (script blocked / timed out), retry once per attempt.
  useEffect(() => {
    if (!active.adKey) return;
    const t = setTimeout(() => {
      const doc = iframeRef.current?.contentDocument;
      const filled = doc?.body?.querySelector("iframe, img, ins");
      if (!filled) retry();
    }, RETRY_DELAY_MS + 3000);
    return () => clearTimeout(t);
  }, [active.adKey, attempt, retry]);

  // Re-request the ad when the user returns to the tab after a long absence.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && retriesRef.current < MAX_RETRIES) {
        setAttempt((a) => a + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  if (!active.adKey) return null;

  return (
    <div
      ref={containerRef}
      className={`w-full flex justify-center my-6 px-2 sm:px-4 ${className}`}
      style={{ minHeight: active.height }}
    >
      <div
        className="relative overflow-hidden"
        style={{ width: active.width, height: active.height, maxWidth: "100%" }}
      >
        <iframe
          key={`${active.adKey}-${attempt}`}
          ref={iframeRef}
          title="Advertisement"
          srcDoc={srcDoc}
          width={active.width}
          height={active.height}
          scrolling="no"
          className="block"
          style={{ border: 0, width: active.width, height: active.height, maxWidth: "100%" }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
};

export default AdsterraResponsiveAd;
