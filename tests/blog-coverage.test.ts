import { describe, expect, test } from "bun:test";
import { blogPosts } from "../src/data/blog";
import { allToolLinks } from "../src/data/toolIndex";

describe("catalog article coverage", () => {
  test("all 131 catalog tools have exactly one dedicated guide", () => {
    expect(allToolLinks.length).toBe(131);
    expect(blogPosts.length).toBe(131);
    for (const tool of allToolLinks) {
      expect(blogPosts.filter(post => post.toolPath.toLowerCase() === tool.path.toLowerCase()).length).toBe(1);
    }
  });
  test("article addresses are unique", () => {
    expect(new Set(blogPosts.map(post => post.slug)).size).toBe(131);
  });
});