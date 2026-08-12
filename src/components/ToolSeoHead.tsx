import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getToolSeo, buildCommonFaqs } from "@/data/toolSeo";
import { useToolContent } from "@/data/toolContent";

const SITE_URL = "https://klipza.live";

/**
 * Route-aware SEO head for every tool page.
 * Renders a unique title, meta description, keywords, canonical, social tags
 * and FAQPage / SoftwareApplication / BreadcrumbList structured data.
 *
 * Mounted after page content in Layout so it takes precedence over any
 * per-page <Helmet> that a tool component may still render.
 */
const ToolSeoHead = () => {
  const { pathname } = useLocation();
  const entry = getToolSeo(pathname);
  const content = useToolContent(pathname);

  if (!entry) return null;


  const url = `${SITE_URL}${entry.path}`;
  const faqs = [...entry.faqs, ...buildCommonFaqs(entry)];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // WebPage (not SoftwareApplication): Google's Software App rich result requires a
  // genuine aggregateRating/review, which we don't have — an unrated SoftwareApplication
  // item is reported as an invalid item in the Rich Results Test.
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: `${entry.title} | Klipza`,
    description: entry.description,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    about: { "@type": "Thing", name: entry.name },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    breadcrumb: { "@id": `${url}#breadcrumb` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: entry.category, item: `${SITE_URL}/#tools` },
      { "@type": "ListItem", position: 3, name: entry.name, item: url },
    ],
  };

  // HowTo is emitted only when the page actually renders the matching numbered
  // steps, so the structured data always reflects visible on-page content.
  const howToSchema = content
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: `How to use the ${entry.name}`,
        description: entry.description,
        totalTime: "PT1M",
        step: content.steps.map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: `Step ${i + 1}`,
          text,
          url: `${url}#tool-article-heading`,
        })),
      }
    : null;


  return (
    <Helmet prioritizeSeoTags>
      <title>{`${entry.title} | Klipza`}</title>
      <meta name="description" content={entry.description} />
      <meta name="keywords" content={entry.keywords} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Klipza" />
      <meta property="og:title" content={entry.title} />
      <meta property="og:description" content={entry.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${entry.name} — free online tool on Klipza`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={entry.title} />
      <meta name="twitter:description" content={entry.description} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.jpg`} />


      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {howToSchema && (
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      )}
    </Helmet>
  );
};

export default ToolSeoHead;
