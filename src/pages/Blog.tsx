import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { blogPosts, readingMinutes } from "@/data/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SITE = "https://klipza.live";

const Blog = () => {
  const [query, setQuery] = useState("");
  const matching = blogPosts.filter((post) =>
    `${post.title} ${post.toolName} ${post.keywords.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
  <>
    <Helmet prioritizeSeoTags>
      <title>Klipza Blog — Practical Guides for PDF, Image & Everyday Tools</title>
      <meta name="description" content="Clear, step-by-step guides on PDFs, images, invoices, resumes, QR codes and more — written to help you get the job done fast." />
      <link rel="canonical" href={`${SITE}/blog/`} />
      <meta property="og:title" content="Klipza Blog — Practical How-To Guides" />
      <meta property="og:description" content="Step-by-step guides for PDFs, images, invoices, resumes and QR codes." />
      <meta property="og:url" content={`${SITE}/blog/`} />
      <meta property="og:type" content="website" />
    </Helmet>
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-foreground">Klipza Blog</h1>
        <p className="mt-3 text-lg text-muted-foreground">Practical, no-fluff guides for the tasks people search for every day.</p>
        <div className="relative mt-8 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search guides" placeholder="Search guides…" className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">{matching.length} guides</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matching.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardContent className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">{p.toolName}</p>
                  <h2 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary">{p.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{readingMinutes(p)} min read</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {matching.length === 0 && <p className="mt-8 text-muted-foreground">No matching guides.</p>}
      </div>
    </div>
  </>
  );
};

export default Blog;
