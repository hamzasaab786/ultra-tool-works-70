import type { BlogPost } from "./types";
import { editGuide } from './editorial';
import { posts1 } from "./posts1";
import { posts2 } from "./posts2";
import { posts3 } from "./posts3";
import { imageGuides } from "./imageGuides";
import { pdfGuides } from "./pdfGuides";
import { calculatorGuides } from "./calculatorGuides";
import { textGuides } from "./textGuides";
import { utilityGuides } from "./utilityGuides";

export type { BlogPost } from "./types";

export const blogPosts: BlogPost[] = [...posts1, ...posts2, ...posts3, ...imageGuides, ...pdfGuides, ...calculatorGuides, ...textGuides, ...utilityGuides].map(editGuide);

export const getBlogPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

export const postsForTool = (toolPath: string) =>
  blogPosts.filter((p) => p.toolPath === toolPath.replace(/\/+$/, ""));

export const readingMinutes = (p: BlogPost) =>
  Math.max(1, Math.round(p.body.join(" ").split(/\s+/).length / 220));
