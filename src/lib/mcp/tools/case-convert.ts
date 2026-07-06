import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const cases = ["upper", "lower", "title", "sentence", "camel", "pascal", "snake", "kebab"] as const;

export default defineTool({
  name: "case_convert",
  title: "Case converter",
  description: "Convert text between upper, lower, title, sentence, camel, pascal, snake, and kebab case.",
  inputSchema: {
    text: z.string().describe("Text to convert."),
    to: z.enum(cases).describe("Target case."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ text, to }) => {
    const words = text.match(/[A-Za-z0-9]+/g) ?? [];
    let out = text;
    switch (to) {
      case "upper": out = text.toUpperCase(); break;
      case "lower": out = text.toLowerCase(); break;
      case "title": out = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()); break;
      case "sentence": out = text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()); break;
      case "camel": out = words.map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join(""); break;
      case "pascal": out = words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(""); break;
      case "snake": out = words.map((w) => w.toLowerCase()).join("_"); break;
      case "kebab": out = words.map((w) => w.toLowerCase()).join("-"); break;
    }
    return { content: [{ type: "text", text: out }], structuredContent: { result: out } };
  },
});
