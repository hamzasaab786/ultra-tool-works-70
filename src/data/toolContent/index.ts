import type { ToolContent, ToolContentMap } from "./types";
import { chunk1 } from "./chunk1";
import { chunk2 } from "./chunk2";
import { chunk3 } from "./chunk3";
import { chunk4 } from "./chunk4";
import { chunk5 } from "./chunk5";

export type { ToolContent, ToolContentSection, ToolContentMap } from "./types";

export const toolContent: ToolContentMap = {
  ...chunk1,
  ...chunk2,
  ...chunk3,
  ...chunk4,
  ...chunk5,
};

export const getToolContent = (path: string): ToolContent | undefined =>
  toolContent[path.replace(/\/+$/, "") || "/"];
