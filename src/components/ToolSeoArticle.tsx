import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Sparkles, Zap, ShieldCheck, Search } from "lucide-react";
import { getToolSeo, toolSeoEntries, type ToolSeoEntry } from "@/data/toolSeo";
import { getToolContent } from "@/data/toolContent";

/**
 * Long-form SEO content rendered under every tool.
 * Hand-written, tool-specific copy from src/data/toolContent is used whenever it
 * exists, so no two tool pages share the same body text. Tools that do not have
 * bespoke copy yet fall back to catalog-driven content.
 */

const keywordList = (entry: ToolSeoEntry) =>
  entry.keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

const fallbackSteps = (entry: ToolSeoEntry): string[] => [
  `Open the ${entry.name} on Klipza — no signup, no installation and no email required.`,
  `Add your file or input to the tool. Everything runs in your browser, so even large jobs start instantly.`,
  `Adjust the available options until the live result matches exactly what you need.`,
  `Download the finished result in one click and reuse the ${entry.name} as often as you like — it is unlimited and free.`,
];

const fallbackFeatures = (entry: ToolSeoEntry): { title: string; body: string }[] => [
  {
    title: "100% free, unlimited use",
    body: `The ${entry.name} has no paywall, no trial period, no watermark and no daily cap. Use it once or a hundred times a day at no cost.`,
  },
  {
    title: "Private by design",
    body: `Wherever technically possible your data is processed locally in the browser, so files used with the ${entry.name} are never uploaded, stored or shared.`,
  },
  {
    title: "Fast and lightweight",
    body: `No queues and no server round-trips: the ${entry.name} produces results in seconds, even on a mid-range phone or a slow connection.`,
  },
  {
    title: "Works on every device",
    body: `${entry.name} online works on Windows, macOS, Linux, Android and iPhone straight from Chrome, Safari, Edge or Firefox — nothing to install.`,
  },
];

const fallbackUseCases = (entry: ToolSeoEntry): string[] => [
  `Students and teachers preparing assignments, applications and classroom material`,
  `Freelancers and agencies delivering polished files to clients on a deadline`,
  `Small business owners handling paperwork without paid office software`,
  `Developers, marketers and job seekers who need a quick, accurate ${entry.name.toLowerCase()}`,
];

const ToolSeoArticle = () => {
  const { pathname } = useLocation();
  const entry = getToolSeo(pathname);

  if (!entry) return null;

  const content = getToolContent(entry.path);
  const keywords = keywordList(entry);
  const primary = keywords[0] ?? entry.name.toLowerCase();
  const steps = content?.steps ?? fallbackSteps(entry);
  const features = content?.benefits ?? fallbackFeatures(entry);
  const useCases = content?.useCases ?? fallbackUseCases(entry);
  const sections = content?.sections ?? [];

  const related = toolSeoEntries
    .filter((e) => e.category === entry.category && e.path !== entry.path)
    .slice(0, 6);


  return (
    <section
      aria-labelledby="tool-article-heading"
      className="relative z-10 w-full border-t border-border/60 py-14"
    >
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          About the {entry.name}
        </div>

        <h2
          id="tool-article-heading"
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {entry.title}
        </h2>

        <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
          {content ? (
            content.intro.map((para) => <p key={para.slice(0, 40)}>{para}</p>)
          ) : (
            <>
              <p>
                Klipza&rsquo;s {entry.name} is a free online{" "}
                {entry.category.toLowerCase().replace(/ tools?$/, "")} tool built for people who need a
                reliable {primary} without downloading software or creating an account. {entry.description}
              </p>
              <p>
                Most paid apps hide the same functionality behind a subscription, a watermark or a file
                limit. The {entry.name} removes all of that: open the page, do the job, download the
                result. Because the work happens in your own browser, the {entry.name} is also one of the
                safest ways to handle sensitive documents, invoices, ID photos or private data.
              </p>
            </>
          )}
        </div>


        {/* How to use */}
        <h3 className="mt-10 text-xl font-semibold text-foreground">
          How to use the {entry.name} (step by step)
        </h3>
        <ol className="mt-4 space-y-3">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-muted-foreground">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        {/* Features */}
        <h3 className="mt-10 text-xl font-semibold text-foreground">
          Why choose this {entry.name} online
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => {
            const Icon = [CheckCircle2, ShieldCheck, Zap, Sparkles][i % 4];
            return (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-background/70 p-5 backdrop-blur"
              >
                <div className="mb-2 flex items-center gap-2 text-foreground">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h4 className="text-sm font-semibold">{f.title}</h4>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            );
          })}
        </div>

        {/* Use cases */}
        <h3 className="mt-10 text-xl font-semibold text-foreground">
          Who uses the {entry.name}?
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {useCases.map((useCase) => (
            <li key={useCase} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{useCase}</span>
            </li>
          ))}
        </ul>

        {/* Tool-specific deep-dive sections */}
        {sections.map((section) => (
          <React.Fragment key={section.heading}>
            <h3 className="mt-10 text-xl font-semibold text-foreground">{section.heading}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
          </React.Fragment>
        ))}



        {/* Keyword cluster */}
        <h3 className="mt-10 text-xl font-semibold text-foreground">
          Popular searches for this tool
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          People find the {entry.name} on Klipza using searches like these:
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <li
              key={kw}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground"
            >
              <Search className="h-3 w-3 opacity-60" aria-hidden="true" />
              {kw}
            </li>
          ))}
        </ul>

        {/* Related tools */}
        {related.length > 0 && (
          <>
            <h3 className="mt-10 text-xl font-semibold text-foreground">
              Related {entry.category.toLowerCase()} on Klipza
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.path}>
                  <Link
                    to={r.path}
                    className="block rounded-lg border border-border bg-background/70 px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {r.name} — free online tool
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default ToolSeoArticle;
