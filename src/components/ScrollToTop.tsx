import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reset scroll position to the top of the page on every route change.
 * Without this, React Router preserves the previous scroll position, so users
 * landing on a tool page from a scrolled list end up somewhere in the middle
 * of the new page instead of seeing the tool's title and controls first.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    // Also reset the document element for cross-browser safety.
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
