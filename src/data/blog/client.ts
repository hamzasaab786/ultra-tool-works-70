import { useEffect, useState } from 'react';
import metadata from './metadata.json';
import type { BlogPost } from './types';
import { editGuide } from './editorial';

export const blogSummaries = metadata;
const loaders: Record<string, () => Promise<BlogPost[]>> = {
  posts1: () => import('./posts1').then(m => m.posts1),
  posts2: () => import('./posts2').then(m => m.posts2),
  posts3: () => import('./posts3').then(m => m.posts3),
  imageGuides: () => import('./imageGuides').then(m => m.imageGuides),
  pdfGuides: () => import('./pdfGuides').then(m => m.pdfGuides),
  calculatorGuides: () => import('./calculatorGuides').then(m => m.calculatorGuides),
  textGuides: () => import('./textGuides').then(m => m.textGuides),
  utilityGuides: () => import('./utilityGuides').then(m => m.utilityGuides),
};
const cache = new Map<string, BlogPost>();
export async function loadBlogPost(slug: string) {
  const cached = cache.get(slug);
  if (cached) return cached;
  const summary = blogSummaries.find(post => post.slug === slug);
  if (!summary) return undefined;
  const posts = await loaders[summary.group]();
  posts.forEach(post => cache.set(post.slug, editGuide(post)));
  return cache.get(slug);
}
export function useBlogPost(slug: string) {
  const [state, setState] = useState<{slug: string; post?: BlogPost; loading: boolean}>({slug, loading: true});
  useEffect(() => {
    let active = true;
    setState({slug, loading: true});
    loadBlogPost(slug).then(post => {
      if (active) setState({slug, post, loading: false});
    }).catch(() => {
      if (active) setState({slug, loading: false});
    });
    return () => { active = false; };
  }, [slug]);
  return state.slug === slug ? state : {slug, loading: true};
}