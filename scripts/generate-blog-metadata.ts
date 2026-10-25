import { writeFileSync } from 'node:fs';
import { posts1 } from '../src/data/blog/posts1';
import { posts2 } from '../src/data/blog/posts2';
import { posts3 } from '../src/data/blog/posts3';
import { imageGuides } from '../src/data/blog/imageGuides';
import { pdfGuides } from '../src/data/blog/pdfGuides';
import { calculatorGuides } from '../src/data/blog/calculatorGuides';
import { textGuides } from '../src/data/blog/textGuides';
import { utilityGuides } from '../src/data/blog/utilityGuides';
import { editGuide } from '../src/data/blog/editorial';

const groups = { posts1, posts2, posts3, imageGuides, pdfGuides, calculatorGuides, textGuides, utilityGuides };
const summaries = Object.entries(groups).flatMap(([group, posts]) => posts.map(raw => {
  const { body, faqs, ...metadata } = editGuide(raw);
  return { ...metadata, group, minutes: Math.max(1, Math.round(body.join(' ').split(/\s+/).length / 220)) };
}));
writeFileSync('src/data/blog/metadata.json', JSON.stringify(summaries));
console.log(`Generated ${summaries.length} lightweight blog summaries`);