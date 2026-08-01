import { useMemo } from "react";

interface AdsterraIframeBannerProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Adsterra fixed-size iframe banner.
 * Rendered inside a sandboxed iframe so the ad's global `atOptions`
 * and document.write calls never touch the React app.
 */
const AdsterraIframeBanner = ({
  adKey,
  width,
  height,
  className = "",
}: AdsterraIframeBannerProps) => {
  const srcDoc = useMemo(
    () => `<!DOCTYPE html><html><head><meta charset="utf-8" />
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>
</head><body>
<script type="text/javascript">
  atOptions = { 'key':'${adKey}', 'format':'iframe', 'height':${height}, 'width':${width}, 'params':{} };
<\/script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"><\/script>
</body></html>`,
    [adKey, width, height]
  );

  return (
    <div className={`w-full flex justify-center my-8 px-4 ${className}`}>
      <div
        className="relative overflow-hidden"
        style={{ width, height, maxWidth: "100%" }}
      >
        <iframe
          title="Advertisement"
          srcDoc={srcDoc}
          width={width}
          height={height}
          scrolling="no"
          loading="lazy"
          className="block"
          style={{ border: 0, width, height, maxWidth: "100%" }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        />
      </div>
    </div>
  );

};

export default AdsterraIframeBanner;
