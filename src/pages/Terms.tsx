import React from "react";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";

const LAST_UPDATED = "August 1, 2026";

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
    dateModified: "2026-08-01",
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
                ["your-content", "4. Your content and ownership"],
                ["accuracy", "5. Accuracy of results"],
                ["ip", "6. Intellectual property"],
                ["third-party", "7. Advertising and third parties"],
                ["availability", "8. Availability and changes"],
                ["warranties", "9. Disclaimer of warranties"],
                ["liability", "10. Limitation of liability"],
                ["indemnity", "11. Indemnity"],
                ["termination", "12. Termination"],
                ["law", "13. Governing law"],
                ["contact", "14. Contact"],
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
                These Terms and Conditions ("Terms") govern your access to and use of the Klipza website and every tool
                offered on it (together, the "Service"). By using the Service you agree to these Terms. If you do not
                agree, please do not use Klipza.
              </p>
            </Section>

            <Section id="service" title="2. The service">
              <p>
                Klipza provides free browser-based utilities for images, PDFs, documents, calculations, text and
                everyday tasks. No account is required. Tools are provided for personal and commercial use at no
                charge, subject to these Terms.
              </p>
            </Section>

            <Section id="acceptable-use" title="3. Acceptable use">
              <p>You agree to use the Service lawfully, and specifically not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Break any applicable local, national or international law or regulation</li>
                <li>Process content you have no right to process, including copyrighted or confidential material</li>
                <li>
                  Use security-related tools (such as PDF unlocking or password tools) on documents you do not own or
                  are not authorised to access
                </li>
                <li>Create forged, fraudulent or misleading documents, identities or payment instruments</li>
                <li>Attempt to disrupt, overload, scrape at scale, reverse engineer or gain unauthorised access to the Service</li>
                <li>Impersonate Klipza or any other person or entity</li>
              </ul>
              <p>
                Developer-focused tools (for example the test card generator) are provided strictly for sandbox testing
                and must never be used to attempt real transactions.
              </p>
            </Section>

            <Section id="your-content" title="4. Your content and ownership">
              <p>
                You keep all rights to the files and text you process. We claim no ownership over your content, and
                because processing generally happens locally in your browser, we usually never receive it at all. You
                are solely responsible for the content you process and for keeping your own backups.
              </p>
            </Section>

            <Section id="accuracy" title="5. Accuracy of results">
              <p>
                Calculators, converters, OCR, health estimates and document conversions produce estimates and
                best-effort output. They are provided for general information only and are not financial, legal,
                medical or professional advice. Always verify important results independently before relying on them.
              </p>
            </Section>

            <Section id="ip" title="6. Intellectual property">
              <p>
                The Service and its content, design, code, branding and arrangement are owned by Klipza or its
                licensors and are protected by intellectual property laws. These Terms grant you a limited,
                non-exclusive, revocable licence to use the Service — no rights in our trademarks, logo or software are
                transferred to you.
              </p>
            </Section>

            <Section id="third-party" title="7. Advertising and third parties">
              <p>
                Klipza is funded by advertising and may display ads served by third parties. We are not responsible for
                the content, products or practices of advertisers or of any external site you reach through the
                Service. Your dealings with them are solely between you and them.
              </p>
            </Section>

            <Section id="availability" title="8. Availability and changes">
              <p>
                We may add, change, suspend or remove any tool or feature at any time without notice, and we do not
                guarantee uninterrupted availability. Occasional maintenance, browser incompatibilities or outages may
                affect access.
              </p>
            </Section>

            <Section id="warranties" title="9. Disclaimer of warranties">
              <p className="uppercase">
                The service is provided "as is" and "as available" without warranty of any kind, express or implied,
                including merchantability, fitness for a particular purpose and non-infringement. We do not warrant
                that the service will meet your requirements or be error-free, secure or uninterrupted.
              </p>
            </Section>

            <Section id="liability" title="10. Limitation of liability">
              <p className="uppercase">
                To the maximum extent permitted by law, Klipza shall not be liable for any indirect, incidental,
                special, consequential or punitive damages, or for any loss of profits, data, files, goodwill or
                business, arising from your access to, use of, or inability to use the service, any content obtained
                through it, or any unauthorised access to your transmissions.
              </p>
            </Section>

            <Section id="indemnity" title="11. Indemnity">
              <p>
                You agree to indemnify and hold Klipza harmless from any claim, demand, loss or expense arising out of
                your misuse of the Service or your breach of these Terms or of any law or third-party right.
              </p>
            </Section>

            <Section id="termination" title="12. Termination">
              <p>
                We may restrict or terminate your access to the Service at any time if we reasonably believe you have
                breached these Terms or are harming the Service or other users.
              </p>
            </Section>

            <Section id="law" title="13. Governing law">
              <p>
                These Terms and your use of the Service are governed by the laws of the jurisdiction in which we
                operate, without regard to conflict-of-law rules. If any provision is found unenforceable, the
                remaining provisions stay in full effect.
              </p>
            </Section>

            <Section id="contact" title="14. Contact">
              <p>
                Questions about these Terms? Reach us through the contact details published on our{" "}
                <a className="text-primary hover:underline" href="/about">About page</a>. See also our{" "}
                <a className="text-primary hover:underline" href="/privacy">Privacy Policy</a> and{" "}
                <a className="text-primary hover:underline" href="/disclaimer">Disclaimer</a>.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
