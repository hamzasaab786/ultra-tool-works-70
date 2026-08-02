import { useEffect, useRef } from "react";

/** Adsterra global scripts (Social Bar / Popunder style). */
const SCRIPT_SOURCES = [
  "https://pl30628822.effectivecpmnetwork.com/e2/e0/f5/e2e0f56580b03c7f4df720ffb30efb79.js",
  "https://pl30628823.effectivecpmnetwork.com/3e/5f/a2/3e5fa2b706528f7ead7aa834db1da13f.js",
];

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const AdsterraSocialBar = () => {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let cancelled = false;

    const load = (src: string, attempt = 0) => {
      if (cancelled) return;
      if (document.querySelector(`script[data-ad-src="${src}"]`)) return;

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.setAttribute("data-ad-src", src);
      script.onerror = () => {
        script.remove();
        if (attempt < MAX_RETRIES) {
          setTimeout(() => load(src, attempt + 1), RETRY_DELAY_MS * (attempt + 1));
        }
      };
      document.body.appendChild(script);
    };

    SCRIPT_SOURCES.forEach((src) => load(src));

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
};

export default AdsterraSocialBar;
