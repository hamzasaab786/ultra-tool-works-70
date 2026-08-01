// Tracks the tools a visitor opened most recently, stored locally in the browser.

export interface RecentTool {
  path: string;
  title: string;
  at: number;
}

const STORAGE_KEY = "klipza-recent-tools";
const MAX_RECENTS = 8;

export function getRecentTools(): RecentTool[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is RecentTool =>
        Boolean(item) && typeof item.path === "string" && typeof item.title === "string",
      )
      .slice(0, MAX_RECENTS);
  } catch {
    return [];
  }
}

export function recordRecentTool(path: string, title: string) {
  if (typeof window === "undefined") return;
  if (!path.startsWith("/tools/")) return;
  try {
    const next = [
      { path, title, at: Date.now() },
      ...getRecentTools().filter((item) => item.path !== path),
    ].slice(0, MAX_RECENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("klipza:recent-tools-changed"));
  } catch {
    // Ignore quota or privacy-mode errors — recents are a convenience only.
  }
}

export function clearRecentTools() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("klipza:recent-tools-changed"));
  } catch {
    // Ignore.
  }
}
