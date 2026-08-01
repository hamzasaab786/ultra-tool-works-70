import { useMemo } from "react";

const KEY = "38fcb1c657b604f630f79cb846ce6e8d";
const WIDTH = 160;
const HEIGHT = 300;

/**
 * Adsterra fixed-size iframe banner (160x300).
 * Rendered inside a sandboxed iframe so the ad's global `atOptions`
 * and document.write calls never touch the React app.
 */
const AdsterraBanner160x300 = ({ className = "" }: { className?: string }) => {
  const srcDoc = useMemo(
    () => `<!DOCTYPE html><html><head><meta charset="utf-8" />
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>
</head><body>
<script type="text/javascript">
  atOptions = { 'key':'${KEY}', 'format':'iframe', 'height':${HEIGHT}, 'width':${WIDTH}, 'params':{} };
<\/script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${KEY}/invoke.js"><\/script>
</body></html>`,
    []
  );

  return (
    <div className={`flex justify-center my-8 ${className}`}>
      <iframe
        title="Advertisement"
        srcDoc={srcDoc}
        width={WIDTH}
        height={HEIGHT}
        scrolling="no"
        loading="lazy"
        style={{ border: 0, width: WIDTH, height: HEIGHT, overflow: "hidden" }}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      />
    </div>
  );
};

export default AdsterraBanner160x300;
