import React from "react";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";

const LAST_UPDATED = "November 4, 2026";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-2xl font-bold mb-3">{title}</h2>
    <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
  </section>
);

const Terms = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://klipza.live/terms#webpage",
    url: "https://klipza.live/terms",
    name: "Terms and Conditions | Klipza",
    description:
      "The terms and conditions governing your use of Klipza's free online image, PDF, calculator and text tools.",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", "@id": "https://klipza.live/#website" },
    dateModified: "2026-11-04",
  };

  return (
    <>
      <SEO
        title="Terms and Conditions — Using Klipza's Free Tools"
        description="Read the terms and conditions for using Klipza: acceptable use, your content and ownership, accuracy of results, advertising, liability limits and governing law."
        keywords="klipza terms and conditions, terms of service online tools, acceptable use policy, free tools terms"
        canonicalUrl="https://klipza.live/terms"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-8">Last updated: {LAST_UPDATED}</p>

          <nav aria-label="On this page" className="mb-10 rounded-xl border p-4">
            <p className="font-semibold mb-2">On this page</p>
            <ul className="grid gap-1 sm:grid-cols-2 text-sm">
              {[
                ["acceptance", "1. Acceptance of terms"],
                ["service", "2. The service"],
                ["acceptable-use", "3. Acceptable use"],
                ["accuracy", "4. Accuracy of results"],
                ["ip", "5. Intellectual property"],
                ["third-party", "6. Third-party services and advertising"],
                ["liability", "7. Limitation of liability"],
                ["changes", "8. Changes"],
                ["contact", "9. Contact"],
              ].map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-primary hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-10">
            <Section id="acceptance" title="1. Acceptance of terms">
              <p>
                By using klipza.live ("Klipza", "the site"), you agree to these Terms and Conditions. If you do not agree, please do not use the site.
              </p>
            </Section>

            <Section id="service" title="2. The service">
              <p>
                Klipza provides free browser-based tools for working with PDF files, images, text, and numbers — including converters, compressors, generators, and calculators. Tools are provided free of charge, with no account required.
              </p>
            </Section>

            <Section id="acceptable-use" title="3. Acceptable use">
              <p>
                You agree to use Klipza only for lawful purposes. You must not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Use the tools for any illegal activity or to process content you have no right to use.
                </li>
                <li>
                  Attempt to disrupt, overload, or reverse-engineer the site or its services.
                </li>
                <li>
                  Upload or process malicious files, or use the tools to harm others.
                </li>
              </ul>
            </Section>

            <Section id="accuracy" title="4. Accuracy of results">
              <p>
                Tools are provided on an "as is" basis. While we work to keep them accurate, file conversions, compressions, calculations, and AI-generated results may contain errors. Always keep your original files and verify important results before relying on them. See our{" "}
                <a className="text-primary hover:underline" href="/disclaimer">
                  Disclaimer
                </a>{" "}
                for more detail.
              </p>
            </Section>

            <Section id="ip" title="5. Intellectual property">
              <p>
                The Klipza name, design, and original content on this site belong to us. You may use the tools for personal and commercial tasks, but you may not copy, redistribute, or resell the site itself or its underlying code without permission.
              </p>
            </Section>

            <Section id="third-party" title="6. Third-party services and advertising">
              <p>
                Some features rely on connected third-party services, which operate under their own terms. The site is supported by advertising; ad content is the responsibility of the advertisers.
              </p>
            </Section>

            <Section id="liability" title="7. Limitation of liability">
              <p>
                To the maximum extent permitted by law, Klipza and its operator are not liable for any loss or damage arising from your use of the site — including data loss, inaccurate results, or service interruptions. Your use of the tools is at your own risk.
              </p>
            </Section>

            <Section id="changes" title="8. Changes">
              <p>
                We may update these terms at any time. Continued use of the site after changes means you accept the updated terms.
              </p>
            </Section>

            <Section id="contact" title="9. Contact">
              <p>
                Questions about these terms:{" "}
                <a className="text-primary underline" href="mailto:officalsaab96@gmail.com">
                  officalsaab96@gmail.com
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
