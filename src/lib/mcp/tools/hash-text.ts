import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createHash } from "node:crypto";

const algos = ["md5", "sha1", "sha256", "sha512"] as const;

export default defineTool({
  name: "hash_text",
  title: "Hash text",
  description: "Compute a cryptographic hash (MD5, SHA-1, SHA-256, SHA-512) of the given text.",
  inputSchema: {
    text: z.string().describe("Text to hash."),
    algorithm: z.enum(algos).default("sha256").describe("Hash algorithm."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ text, algorithm }) => {
    const hash = createHash(algorithm).update(text, "utf-8").digest("hex");
    return { content: [{ type: "text", text: hash }], structuredContent: { algorithm, hash } };
  },
});
