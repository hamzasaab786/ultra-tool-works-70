import { defineMcp } from "@lovable.dev/mcp-js";
import wordCount from "./tools/word-count";
import caseConvert from "./tools/case-convert";
import base64 from "./tools/base64";
import hashText from "./tools/hash-text";
import generatePassword from "./tools/generate-password";
import loremIpsum from "./tools/lorem-ipsum";

export default defineMcp({
  name: "klipza-mcp",
  title: "Klipza Tools",
  version: "0.1.0",
  instructions:
    "Utility tools from Klipza. Use `word_count` for text stats, `case_convert` to change casing, `base64` to encode/decode, `hash_text` for cryptographic hashes, `generate_password` for random passwords, and `lorem_ipsum` for placeholder text.",
  tools: [wordCount, caseConvert, base64, hashText, generatePassword, loremIpsum],
});
