import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { blogPosts, readingMinutes } from "@/data/blog";
import { Card, CardContent } from "@/components/ui/card";

const SITE = "https://klipza.live";

const Blog = () => (
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
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((p) => (
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
      </div>
    </div>
  </>
);

export default Blog;
