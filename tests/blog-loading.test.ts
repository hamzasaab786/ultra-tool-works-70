import { expect, test } from 'bun:test';
import { blogPosts } from '../src/data/blog';
import { blogSummaries, loadBlogPost } from '../src/data/blog/client';

test('lightweight summaries cover the same articles without embedding bodies', () => {
  expect(blogSummaries.map(p => p.slug)).toEqual(blogPosts.map(p => p.slug));
  expect(blogSummaries.every(p => !('body' in p) && !('faqs' in p))).toBe(true);
});
test('on-demand article loading retains the complete selected guide', async () => {
  const slug = 'split-pdf-practical-guide';
  const post = await loadBlogPost(slug);
  expect(post).toEqual(blogPosts.find(p => p.slug === slug));
  expect(post?.toolPath).toBe('/tools/split-pdf');
  expect(await loadBlogPost('missing-guide')).toBeUndefined();
});