import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getToolSeo, buildCommonFaqs } from "@/data/toolSeo";

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
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: entry.category, item: `${SITE_URL}/#tools` },
      { "@type": "ListItem", position: 3, name: entry.name, item: url },
    ],
  };

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

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={entry.title} />
      <meta name="twitter:description" content={entry.description} />

      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(appSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  );
};

export default ToolSeoHead;
