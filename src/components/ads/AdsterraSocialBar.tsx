import { useEffect, useRef } from "react";

/** Adsterra global scripts (Social Bar / Popunder style). */
const SCRIPT_SOURCES = [
  "https://pl30628822.effectivecpmnetwork.com/e2/e0/f5/e2e0f56580b03c7f4df720ffb30efb79.js",
  "https://pl30628823.effectivecpmnetwork.com/3e/5f/a2/3e5fa2b706528f7ead7aa834db1da13f.js",
];

const AdsterraSocialBar = () => {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    SCRIPT_SOURCES.forEach((src) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      document.body.appendChild(script);
    });
  }, []);

  return null;
};

export default AdsterraSocialBar;
