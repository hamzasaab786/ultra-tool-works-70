import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "word_count",
  title: "Word count",
  description: "Count words, characters, sentences, and paragraphs in the given text.",
  inputSchema: {
    text: z.string().describe("Text to analyze."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ text }) => {
    const words = (text.trim().match(/\S+/g) ?? []).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = (text.match(/[^.!?]+[.!?]+/g) ?? []).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
    const stats = { words, characters, charactersNoSpaces, sentences, paragraphs };
    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
      structuredContent: stats,
    };
  },
});
