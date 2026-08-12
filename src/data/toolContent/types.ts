// Long-form, hand-written SEO content per tool route.
// One entry per tool page so no two pages share the same body copy —
// unique content is what lets each tool page rank on its own terms.

export interface ToolContentSection {
  heading: string;
  body: string;
}

export interface ToolContent {
  /** 2 paragraphs, ~90-130 words each: what the tool does, who needs it, why this one. */
  intro: string[];
  /** Concrete, tool-specific steps (4-6). */
  steps: string[];
  /** Tool-specific differentiators, not generic "free and fast" filler. */
  benefits: { title: string; body: string }[];
  /** Real scenarios where this exact tool is used. */
  useCases: string[];
  /** Extra depth: format notes, limits, accuracy, comparisons, troubleshooting. */
  sections: ToolContentSection[];
}

export type ToolContentMap = Record<string, ToolContent>;
