import { auth, defineMcp } from "@lovable.dev/mcp-js";
import wordCount from "./tools/word-count";
import caseConvert from "./tools/case-convert";
import base64 from "./tools/base64";
import hashText from "./tools/hash-text";
import generatePassword from "./tools/generate-password";
import loremIpsum from "./tools/lorem-ipsum";

// Direct Supabase host is required as the OAuth issuer (never the proxy URL).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "klipza-mcp",
  title: "Klipza Tools",
  version: "0.1.0",
  instructions:
    "Utility tools from Klipza. Use `word_count` for text stats, `case_convert` to change casing, `base64` to encode/decode, `hash_text` for cryptographic hashes, `generate_password` for random passwords, and `lorem_ipsum` for placeholder text.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [wordCount, caseConvert, base64, hashText, generatePassword, loremIpsum],
});
