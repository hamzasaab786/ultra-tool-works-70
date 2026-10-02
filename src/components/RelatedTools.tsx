import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { allToolLinks } from "@/data/toolIndex";

// Hand-picked "next step" tools for high-traffic pages; others fall back to
// neighbours from the same category.
const curated: Record<string, string[]> = {
  "/tools/repair-pdf": ["/tools/pdf-compressor", "/tools/UnlockPdf", "/tools/merge-pdf", "/tools/pdf-to-word"],
  "/tools/invoice-generator": ["/tools/receipt-generator", "/tools/qr-code-generator", "/tools/business-card-generator", "/tools/signature-generator"],
  "/tools/receipt-generator": ["/tools/invoice-generator", "/tools/qr-code-generator", "/tools/barcode-generator", "/tools/split-bill-calculator"],
  "/tools/qr-code-generator": ["/tools/barcode-generator", "/tools/business-card-generator", "/tools/invoice-generator", "/tools/url-shortener"],
  "/tools/merge-pdf": ["/tools/split-pdf", "/tools/pdf-compressor", "/tools/organize-pdf", "/tools/add-page-numbers"],
  "/tools/jpg-to-pdf": ["/tools/pdf-to-jpg", "/tools/merge-pdf", "/tools/image-compressor", "/tools/pdf-compressor"],
  "/tools/pdf-to-jpg": ["/tools/jpg-to-pdf", "/tools/extract-pdf-images", "/tools/image-compressor", "/tools/split-pdf"],
  "/tools/word-counter": ["/tools/case-converter", "/tools/text-diff", "/tools/lorem-ipsum", "/tools/typing-speed-test"],
  "/tools/resume-builder": ["/tools/word-to-pdf", "/tools/pdf-compressor", "/tools/signature-generator", "/tools/word-counter"],
};

const norm = (p: string) => p.replace(/\/+$/, "").toLowerCase();

const RelatedTools = () => {
  const { pathname } = useLocation();
  const current = norm(pathname);
  const self = allToolLinks.find((t) => norm(t.path) === current);
  if (!self) return null;

  const byPath = new Map(allToolLinks.map((t) => [norm(t.path), t]));
  const picks: typeof allToolLinks = [];
  const add = (t?: (typeof allToolLinks)[number]) => {
    if (t && norm(t.path) !== current && !picks.includes(t)) picks.push(t);
  };
  const curatedKey = Object.keys(curated).find((k) => norm(k) === current);
  (curatedKey ? curated[curatedKey] : []).forEach((p) => add(byPath.get(norm(p))));

  const siblings = allToolLinks.filter((t) => t.category === self.category);
  const idx = siblings.indexOf(self);
  for (let i = 1; picks.length < 4 && i < siblings.length; i++) {
    add(siblings[(idx + i) % siblings.length]);
  }

  return (
    <section aria-labelledby="related-tools-heading" className="relative z-10 w-full py-12">
      <div className="mx-auto w-full max-w-5xl px-4">
        <h2 id="related-tools-heading" className="mb-6 text-2xl font-bold text-foreground">
          Related tools you may need next
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picks.slice(0, 4).map((t) => (
            <li key={t.path}>
              <Link
                to={t.path}
                className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card/60 p-4 backdrop-blur transition hover:border-primary hover:shadow-lg"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.category}</span>
                <span className="mt-2 flex items-center justify-between font-semibold text-foreground">
                  {t.name}
                  <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RelatedTools;
