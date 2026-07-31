import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, HelpCircle } from "lucide-react";
import { getToolSeo, buildCommonFaqs } from "@/data/toolSeo";

/**
 * Visible, crawlable FAQ + breadcrumb block appended to every tool page.
 * The questions mirror the FAQPage JSON-LD emitted by ToolSeoHead so the
 * structured data always matches on-page content (a Google requirement).
 */
const ToolFaqSection = () => {
  const { pathname } = useLocation();
  const entry = getToolSeo(pathname);

  if (!entry) return null;

  const faqs = [...entry.faqs, ...buildCommonFaqs(entry)];

  return (
    <section
      aria-labelledby="tool-faq-heading"
      className="relative z-10 w-full border-t border-border/60 bg-muted/30 py-14"
    >
      <div className="mx-auto w-full max-w-4xl px-4">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            <li>
              <Link to="/#tools" className="hover:text-foreground transition-colors">
                {entry.category}
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            <li aria-current="page" className="font-medium text-foreground">
              {entry.name}
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {entry.name} FAQ
          </div>
          <h2
            id="tool-faq-heading"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Frequently asked questions — {entry.name}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{entry.description}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-border bg-background/70 p-5 backdrop-blur transition-colors hover:border-primary/40"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span>{faq.q}</span>
                  <ChevronRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
                    aria-hidden="true"
                  />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolFaqSection;
