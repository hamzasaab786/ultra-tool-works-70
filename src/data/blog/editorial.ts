import type { BlogPost } from './types';

/** Remove mass-generated filler while retaining each guide's specific advice. */
export function editGuide(post: BlogPost): BlogPost {
  if (!post.slug.endsWith('-practical-guide')) return post;
  const body: string[] = [];
  let skip = false;
  for (const block of post.body) {
    if (block.startsWith('## ')) {
      skip = ['## Check the destination, not only the preview', '## Your next step'].includes(block);
      if (skip) continue;
    }
    if (skip || block.startsWith('When you need ') || block.startsWith('Open the [') ||
        block.startsWith('Choose one representative example from your actual task') ||
        block.startsWith('The result reflects the input and options you provide.')) continue;
    if (block.startsWith('## A practical check') && post.body[post.body.indexOf(block) + 1]?.startsWith('Choose one representative')) continue;
    if (block.startsWith('## Limits worth knowing') && post.body[post.body.indexOf(block) + 1]?.startsWith('The result reflects')) continue;
    body.push(block);
  }
  const specific = body.find(block => !block.startsWith('#') && !block.startsWith('-') && !/^\d+\./.test(block));
  const title = post.title.replace(': A Practical Guide to ', ': ');
  const description = specific ? specific.slice(0, 157).replace(/\s+\S*$/, '') + '…' : post.description;
  const faqs = post.faqs.filter(faq => !faq.a.startsWith('Start with a representative input and review'));
  return { ...post, title, description, body, faqs };
}