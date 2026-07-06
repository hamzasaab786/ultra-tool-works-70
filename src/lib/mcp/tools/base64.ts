import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "base64",
  title: "Base64 encode/decode",
  description: "Encode text to Base64 or decode a Base64 string back to text (UTF-8).",
  inputSchema: {
    input: z.string().describe("Text or Base64 string."),
    mode: z.enum(["encode", "decode"]).describe("Operation to perform."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ input, mode }) => {
    try {
      const result = mode === "encode"
        ? Buffer.from(input, "utf-8").toString("base64")
        : Buffer.from(input, "base64").toString("utf-8");
      return { content: [{ type: "text", text: result }], structuredContent: { result } };
    } catch (e) {
      return { content: [{ type: "text", text: `Error: ${(e as Error).message}` }], isError: true };
    }
  },
});
