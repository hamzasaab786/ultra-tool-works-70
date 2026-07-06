import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

function pick() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }
function sentence() {
  const n = 6 + Math.floor(Math.random() * 12);
  const words = Array.from({ length: n }, pick);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

export default defineTool({
  name: "lorem_ipsum",
  title: "Lorem ipsum generator",
  description: "Generate placeholder lorem ipsum text as paragraphs, sentences, or words.",
  inputSchema: {
    count: z.number().int().min(1).max(100).default(3).describe("How many units to produce."),
    unit: z.enum(["paragraphs", "sentences", "words"]).default("paragraphs").describe("Unit type."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: ({ count, unit }) => {
    let out = "";
    if (unit === "words") out = Array.from({ length: count }, pick).join(" ");
    else if (unit === "sentences") out = Array.from({ length: count }, sentence).join(" ");
    else {
      out = Array.from({ length: count }, () => {
        const s = 3 + Math.floor(Math.random() * 5);
        return Array.from({ length: s }, sentence).join(" ");
      }).join("\n\n");
    }
    return { content: [{ type: "text", text: out }], structuredContent: { text: out } };
  },
});
