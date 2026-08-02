import { useEffect, useRef, useState } from "react";

const AD_KEY = "00363835eeba6f143f8c52d85792a709";
const SCRIPT_SRC = `https://pl30628821.effectivecpmnetwork.com/${AD_KEY}/invoke.js`;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000;

/**
 * Adsterra Native Banner.
 * Injects invoke.js and retries if the container stays empty
 * (slow networks, regional latency, transient script failures).
 */
const AdsterraNative = ({ className = "" }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const retries = useRef(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const inject = () => {
      // Remove any previous instance so the network re-runs the fill.
      document
        .querySelectorAll(`script[src="${SCRIPT_SRC}"]`)
        .forEach((s) => s.remove());

      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.onerror = () => scheduleRetry();
      document.body.appendChild(script);
    };

    const scheduleRetry = () => {
      if (cancelled || retries.current >= MAX_RETRIES) return;
      retries.current += 1;
      setTimeout(() => !cancelled && setAttempt((a) => a + 1), RETRY_DELAY_MS);
    };

    inject();

    // Verify the container actually filled; retry otherwise.
    const check = setTimeout(() => {
      if (cancelled) return;
      const el = containerRef.current?.querySelector(`#container-${AD_KEY}`);
      if (!el || el.childElementCount === 0) scheduleRetry();
    }, RETRY_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(check);
    };
  }, [attempt]);

  return (
    <div ref={containerRef} className={`w-full max-w-5xl mx-auto px-4 my-8 ${className}`}>
      <div id={`container-${AD_KEY}`} key={attempt} />
    </div>
  );
};

export default AdsterraNative;
