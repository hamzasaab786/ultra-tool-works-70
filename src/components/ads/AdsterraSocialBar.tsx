import { useEffect, useRef } from "react";

const SCRIPT_SRC =
  "https://pl30628822.effectivecpmnetwork.com/e2/e0/f5/e2e0f56580b03c7f4df720ffb30efb79.js";

/**
 * Adsterra global script (Social Bar / Popunder style).
 * Injected once per session; no visible container needed.
 */
const AdsterraSocialBar = () => {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);
  }, []);

  return null;
};

export default AdsterraSocialBar;
