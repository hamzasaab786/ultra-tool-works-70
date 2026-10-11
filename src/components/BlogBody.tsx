import React from "react";
import { Link } from "react-router-dom";

const inline = (text: string) => {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((p, i) => {
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return <React.Fragment key={i}>{p}</React.Fragment>;
    return (
      <Link key={i} to={m[2]} className="font-medium text-primary underline underline-offset-2 hover:opacity-80">
        {m[1]}
      </Link>
    );
  });
};

/** Renders blog body blocks: "## " H2, "### " H3, "- " bullets, "1. " numbered, else paragraph. */
const BlogBody = ({ blocks }: { blocks: string[] }) => {
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.startsWith("## ")) {
      out.push(<h2 key={i} className="mt-10 text-2xl font-bold text-foreground">{b.slice(3)}</h2>);
      i++;
    } else if (b.startsWith("### ")) {
      out.push(<h3 key={i} className="mt-6 text-xl font-semibold text-foreground">{b.slice(4)}</h3>);
      i++;
    } else if (b.startsWith("- ") || /^\d+\. /.test(b)) {
      const ordered = !b.startsWith("- ");
      const items: string[] = [];
      while (i < blocks.length && (ordered ? /^\d+\. /.test(blocks[i]) : blocks[i].startsWith("- "))) {
        items.push(blocks[i].replace(/^(- |\d+\. )/, ""));
        i++;
      }
      const cls = `mt-4 space-y-2 pl-6 text-muted-foreground leading-relaxed ${ordered ? "list-decimal" : "list-disc"}`;
      const lis = items.map((it, k) => <li key={k}>{inline(it)}</li>);
      out.push(ordered ? <ol key={i} className={cls}>{lis}</ol> : <ul key={i} className={cls}>{lis}</ul>);
    } else {
      out.push(<p key={i} className="mt-4 leading-relaxed text-muted-foreground">{inline(b)}</p>);
      i++;
    }
  }
  return <>{out}</>;
};

export default BlogBody;
