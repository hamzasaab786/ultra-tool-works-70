import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { randomInt } from "node:crypto";

export default defineTool({
  name: "generate_password",
  title: "Generate password",
  description: "Generate a strong random password with configurable length and character classes.",
  inputSchema: {
    length: z.number().int().min(4).max(128).default(16).describe("Password length (4-128)."),
    uppercase: z.boolean().default(true).describe("Include uppercase letters."),
    lowercase: z.boolean().default(true).describe("Include lowercase letters."),
    numbers: z.boolean().default(true).describe("Include digits."),
    symbols: z.boolean().default(true).describe("Include punctuation symbols."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: false },
  handler: ({ length, uppercase, lowercase, numbers, symbols }) => {
    let charset = "";
    if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()-_=+[]{};:,.<>?";
    if (!charset) {
      return { content: [{ type: "text", text: "Error: enable at least one character class." }], isError: true };
    }
    let password = "";
    for (let i = 0; i < length; i++) password += charset[randomInt(0, charset.length)];
    return { content: [{ type: "text", text: password }], structuredContent: { password } };
  },
});
