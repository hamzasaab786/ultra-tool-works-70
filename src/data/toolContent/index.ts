import { useEffect, useState } from "react";
import type { ToolContent, ToolContentMap } from "./types";
import { pathChunk } from "./pathChunk";

export type { ToolContent, ToolContentSection, ToolContentMap } from "./types";
export { pathChunk } from "./pathChunk";

const loaders: Record<number, () => Promise<ToolContentMap>> = {
  1: () => import("./chunk1").then((m) => m.chunk1),
  2: () => import("./chunk2").then((m) => m.chunk2),
  3: () => import("./chunk3").then((m) => m.chunk3),
  4: () => import("./chunk4").then((m) => m.chunk4),
  5: () => import("./chunk5").then((m) => m.chunk5),
  6: () => import("./chunk6").then((m) => m.chunk6),
  7: () => import("./chunk7").then((m) => m.chunk7),
};

const cache = new Map<number, ToolContentMap>();
const inflight = new Map<number, Promise<ToolContentMap>>();

const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

/** Synchronous read — only returns content once its chunk has been loaded. */
export const getToolContent = (path: string): ToolContent | undefined => {
  const key = normalize(path);
  const chunk = pathChunk[key];
  if (!chunk) return undefined;
  return cache.get(chunk)?.[key];
};

export const loadToolContent = async (path: string): Promise<ToolContent | undefined> => {
  const key = normalize(path);
  const chunk = pathChunk[key];
  if (!chunk) return undefined;
  const cached = cache.get(chunk);
  if (cached) return cached[key];

  let promise = inflight.get(chunk);
  if (!promise) {
    promise = loaders[chunk]().then((map) => {
      cache.set(chunk, map);
      inflight.delete(chunk);
      return map;
    });
    inflight.set(chunk, promise);
  }
  const map = await promise;
  return map[key];
};

/** React hook: loads the route's SEO copy on demand. */
export const useToolContent = (path: string): ToolContent | undefined => {
  const [content, setContent] = useState<ToolContent | undefined>(() => getToolContent(path));

  useEffect(() => {
    let active = true;
    setContent(getToolContent(path));
    loadToolContent(path).then((next) => {
      if (active) setContent(next);
    });
    return () => {
      active = false;
    };
  }, [path]);

  return content;
};
