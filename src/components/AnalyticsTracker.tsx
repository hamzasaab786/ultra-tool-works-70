import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "@/lib/analytics";

/** Initializes GA4 and reports SPA route changes as page views. */
const Analytics = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (lastPath.current === path) return;
    const isFirst = lastPath.current === null;
    lastPath.current = path;
    if (isFirst) return; // initial page_view is sent by gtag config
    trackPageView(path);
  }, [location]);

  return null;
};

export default Analytics;
