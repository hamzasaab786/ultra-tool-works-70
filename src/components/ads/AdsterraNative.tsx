import { useEffect, useRef } from "react";

const AD_KEY = "00363835eeba6f143f8c52d85792a709";
const SCRIPT_SRC = `https://pl30628821.effectivecpmnetwork.com/${AD_KEY}/invoke.js`;

/**
 * Adsterra Native Banner.
 * Loads the invoke.js script once and renders the container div it targets.
 */
const AdsterraNative = ({ className = "" }: { className?: string }) => {
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

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 my-8 ${className}`}>
      <div id={`container-${AD_KEY}`} />
    </div>
  );
};

export default AdsterraNative;
