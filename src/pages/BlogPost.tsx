import React from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { blogPosts, getBlogPost, readingMinutes } from "@/data/blog";
import BlogBody from "@/components/BlogBody";
import NotFound from "./NotFound";
import { Button } from "@/components/ui/button";

const SITE = "https://klipza.live";

const BlogPostPage = () => {
  const { slug = "" } = useParams();
  const post = getBlogPost(slug);
  if (!post) return <NotFound />;
  const url = `${SITE}/blog/${post.slug}/`;
  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 4);

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "Klipza" },
    publisher: { "@type": "Organization", "@id": `${SITE}/#organization`, name: "Klipza" },
    keywords: post.keywords.join(", "),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog/` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>{post.title}</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>
      <article className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm text-muted-foreground"><Link to="/" className="hover:text-primary">Home</Link> / <Link to="/blog" className="hover:text-primary">Blog</Link></nav>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            By the Klipza team · {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {readingMinutes(post)} min read
          </p>
          <BlogBody blocks={post.body} />

          <div className="mt-10 rounded-xl border bg-muted/40 p-6 text-center">
            <p className="text-lg font-semibold text-foreground">Try the free {post.toolName}</p>
            <p className="mt-1 text-sm text-muted-foreground">Check the result before using it in your final document or project.</p>
            <Button asChild className="mt-4"><Link to={post.toolPath}>Open {post.toolName}</Link></Button>
          </div>

          <h2 className="mt-12 text-2xl font-bold text-foreground">Frequently asked questions</h2>
          <div className="mt-4 space-y-5">
            {post.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-foreground">{f.q}</h3>
                <p className="mt-1 text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-xl font-bold text-foreground">More guides</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {more.map((p) => (
              <li key={p.slug}><Link to={`/blog/${p.slug}`} className="block rounded-lg border px-4 py-3 text-sm hover:border-primary/50 hover:text-primary">{p.title}</Link></li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;
