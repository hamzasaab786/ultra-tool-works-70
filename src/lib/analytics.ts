declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const RAW_ID = import.meta.env
  .VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined;

// GA4 measurement IDs look like G-XXXXXXXXXX (usually 10 chars after "G-").
const isValidGa4Id = (id?: string) => !!id && /^G-[A-Z0-9]{6,15}$/i.test(id.trim());

const MEASUREMENT_ID = isValidGa4Id(RAW_ID) ? (RAW_ID as string).trim() : undefined;

if (RAW_ID && !MEASUREMENT_ID) {
  console.warn(
    "Google Analytics measurement ID looks invalid — expected format G-XXXXXXXXXX. Analytics disabled.",
  );
}

let initialized = false;

export function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  if (!MEASUREMENT_ID) {
    console.warn("Google Analytics measurement ID is not configured");
    return;
  }
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, { send_page_view: true });
}

export function trackPageView(path: string, title?: string) {
  if (!MEASUREMENT_ID) return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!MEASUREMENT_ID) return;
  gtag("event", name, params);
}
