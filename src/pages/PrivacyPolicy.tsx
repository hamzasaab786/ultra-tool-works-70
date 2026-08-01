import React from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";

const LAST_UPDATED = "August 1, 2026";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24">
    <h2 className="text-2xl font-bold mb-3">{title}</h2>
    <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
  </section>
);

const PrivacyPolicy = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://klipza.live/privacy#webpage",
    url: "https://klipza.live/privacy",
    name: "Privacy Policy | Klipza",
    description:
      "How Klipza handles your files and data: browser-based processing, cookies, analytics and advertising partners, and your privacy rights.",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", "@id": "https://klipza.live/#website" },
    dateModified: "2026-08-01",
  };

  return (
    <Layout>
      <SEO
        title="Privacy Policy — How Klipza Handles Your Data"
        description="Klipza processes files in your browser and never stores them. Read how we use cookies, analytics and advertising partners, and what rights you have."
        keywords="klipza privacy policy, online tools privacy, browser based file processing privacy, cookie policy, gdpr online tools"
        canonicalUrl="https://klipza.live/privacy"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {LAST_UPDATED}</p>

          <nav aria-label="On this page" className="mb-10 rounded-xl border p-4">
            <p className="font-semibold mb-2">On this page</p>
            <ul className="grid gap-1 sm:grid-cols-2 text-sm">
              {[
                ["introduction", "Introduction"],
                ["files", "How your files are processed"],
                ["not-collected", "Information we don't collect"],
                ["collected", "Information we may collect"],
                ["cookies", "Cookies and similar technologies"],
                ["analytics", "Analytics"],
                ["advertising", "Advertising partners"],
                ["ai", "AI-assisted features"],
                ["legal-basis", "Legal basis and retention"],
                ["rights", "Your privacy rights"],
                ["security", "Data security"],
                ["children", "Children's privacy"],
                ["changes", "Changes to this policy"],
                ["contact", "Contact us"],
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
            <Section id="introduction" title="Introduction">
              <p>
                Klipza ("we", "our", "us") operates the free online tools available at klipza.live. This Privacy
                Policy explains what information we do and do not collect when you use our image tools, PDF tools,
                calculators, text tools and utilities, and how that information is used.
              </p>
              <p>
                By using Klipza you agree to this policy. If you do not agree with it, please stop using the site.
              </p>
            </Section>

            <Section id="files" title="How your files are processed">
              <p>
                Almost every Klipza tool runs entirely inside your browser using JavaScript and WebAssembly. When you
                compress an image, merge a PDF, edit PDF text or build a resume, the file never leaves your device:
                it is read into memory, processed locally and written back out as a download.
              </p>
              <p>
                A small number of AI-assisted features (for example AI passport photo editing, document translation
                and PDF comparison) must send the content you submit to a processing server to work. These requests
                are used only to produce your result and are not used to build a profile of you. Tools that behave
                this way state it on the tool page itself.
              </p>
            </Section>

            <Section id="not-collected" title="Information we don't collect">
              <p>Klipza is a no-sign-up service. We do not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Require you to create an account to use any tool</li>
                <li>Ask for your name, postal address or phone number</li>
                <li>Store the files you process, or keep copies of your results</li>
                <li>Request or process payment information</li>
                <li>Sell your personal information to anyone</li>
              </ul>
            </Section>

            <Section id="collected" title="Information we may collect">
              <p>
                Like most websites, we and our service providers automatically receive limited technical information
                when you visit, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browser type, version and language</li>
                <li>Operating system and device type</li>
                <li>Approximate location derived from your IP address (country or city level)</li>
                <li>Referring website and the pages you view on Klipza</li>
                <li>Time spent on pages and general interaction events</li>
              </ul>
              <p>
                This data is aggregated and used to understand which tools are useful, to fix problems and to keep the
                site fast and reliable.
              </p>
            </Section>

            <Section id="cookies" title="Cookies and similar technologies">
              <p>We use a small number of cookies and browser storage keys:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Essential storage</strong> — for example your light/dark theme preference, stored locally in
                  your browser and never sent to us.
                </li>
                <li>
                  <strong>Analytics cookies</strong> — used to count visits and understand which tools are popular.
                </li>
                <li>
                  <strong>Advertising cookies</strong> — set by our advertising partners to limit repetition and
                  measure ad performance.
                </li>
              </ul>
              <p>
                You can block or delete cookies in your browser settings at any time. Blocking analytics and
                advertising cookies does not stop any Klipza tool from working.
              </p>
            </Section>

            <Section id="analytics" title="Analytics">
              <p>
                We use Google Analytics 4 to measure traffic and tool usage in aggregate. Google may set cookies and
                process technical data on our behalf as described in Google's own privacy policy. We do not send
                Google the contents of any file you process.
              </p>
            </Section>

            <Section id="advertising" title="Advertising partners">
              <p>
                Klipza is free and is funded by advertising. Our advertising partners (including Adsterra) may use
                cookies, device identifiers and similar technologies to serve and measure ads. These partners operate
                under their own privacy policies and we do not share your files or tool inputs with them.
              </p>
            </Section>

            <Section id="ai" title="AI-assisted features">
              <p>
                A few tools use AI models to produce a result. The text or image you submit to such a tool is sent to
                the model provider solely to generate your output, is not used to train models on your data by us, and
                is not retained by Klipza after the response is returned.
              </p>
            </Section>

            <Section id="legal-basis" title="Legal basis and retention">
              <p>
                Where the GDPR applies, we rely on legitimate interests for basic analytics and site security, and on
                your consent where required for advertising and non-essential cookies. Because we do not store your
                files or account data, there is nothing for us to retain beyond aggregated, non-identifying usage
                statistics.
              </p>
            </Section>

            <Section id="rights" title="Your privacy rights">
              <p>
                Depending on where you live, you may have the right to access, correct, delete or restrict the
                processing of personal data about you, to object to processing, and to withdraw consent. Since Klipza
                does not maintain user accounts, most requests can be satisfied by clearing cookies in your browser.
                For anything else, contact us and we will respond within a reasonable period.
              </p>
            </Section>

            <Section id="security" title="Data security">
              <p>
                The site is served over HTTPS and local-only processing means most of your data never travels over the
                network at all. No method of transmission or electronic storage is completely secure, so we cannot
                guarantee absolute security, but we take reasonable technical measures to protect the service.
              </p>
            </Section>

            <Section id="children" title="Children's privacy">
              <p>
                Klipza is not directed at children under 13, and we do not knowingly collect personal information from
                them. If you believe a child has provided us with personal information, please contact us.
              </p>
            </Section>

            <Section id="changes" title="Changes to this privacy policy">
              <p>
                We may update this policy as the service evolves. Changes take effect when posted on this page and the
                "Last updated" date above is revised. Continued use of Klipza after an update means you accept it.
              </p>
            </Section>

            <Section id="contact" title="Contact us">
              <p>
                Questions about this Privacy Policy or how your data is handled? Reach us through the contact details
                published on our <a className="text-primary hover:underline" href="/about">About page</a>.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
