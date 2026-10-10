export interface BlogPost {
  slug: string;
  title: string;
  /** meta description, under ~160 chars */
  description: string;
  /** primary keyword first, then supporting long-tail terms */
  keywords: string[];
  /** the Klipza tool this guide points to */
  toolPath: string;
  toolName: string;
  date: string; // ISO yyyy-mm-dd
  /**
   * Body blocks. "## " = H2, "### " = H3, lines starting "- " = bullet list,
   * lines starting "1. " = numbered list, anything else = paragraph.
   * Inline links: [text](/path).
   */
  body: string[];
  faqs: { q: string; a: string }[];
}
