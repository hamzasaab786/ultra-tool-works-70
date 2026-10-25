import React from "react";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";

const LAST_UPDATED = "October 24, 2026";

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
    dateModified: "2026-10-24",
  };

  return (
    <>
      <SEO
        title="Privacy Policy — How Klipza Handles Your Data"
        description="How Klipza handles local file processing, connected AI features, accounts, analytics and advertising cookies. Contact us with privacy questions."
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
                AI-assisted document translation, PDF comparison and invoice suggestions send the content needed
                for your request to our processing service and AI provider. Online lookups also contact external services.
                Do not submit confidential information unless you are comfortable with this processing.
              </p>
            </Section>

            <Section id="not-collected" title="Information we don't collect">
              <p>Many tools work without an account. For local file tools, we do not:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Require an account for ordinary local file processing</li>
                <li>Ask for your name, postal address or phone number</li>
                <li>Upload the locally processed file to an advertising partner</li>
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
                Klipza is free and is funded by advertising through Google AdSense. Third-party vendors, including
                Google, use cookies to serve ads based on your prior visits to this and other websites. Google's use of
                advertising cookies enables it and its partners to serve ads based on your visits. You may opt out of
                personalised advertising at{" "}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Ads Settings</a>{" "}
                or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="underline">aboutads.info</a>.
                We do not share your files or tool inputs with advertising partners.
              </p>
            </Section>

            <Section id="ai" title="AI-assisted features">
              <p>
                Some tools send submitted text or document content to an AI provider to generate a result.
                Connected services may process technical logs under their own policies. We cannot promise zero
                retention by all service providers. Avoid personal, confidential or regulated information in AI inputs.
              </p>
            </Section>

            <Section id="legal-basis" title="Legal basis and retention">
              <p>
                We seek consent where required for non-essential cookies and personalized advertising.
                Local files remain on your device, while connected services may retain technical records under
                their policies. If you create an account, account information is handled by our authentication service.
              </p>
            </Section>

            <Section id="rights" title="Your privacy rights">
              <p>
                Depending on where you live, you may have the right to access, correct, delete or restrict the
                processing of personal data about you, to object to processing, and to withdraw consent. Since Klipza
                offers local processing tools, clearing browser storage removes local preferences and saved tool data.
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
                Questions about this Privacy Policy or how your data is handled? Email <a className="text-primary underline" href="mailto:officalsaab96@gmail.com">officalsaab96@gmail.com</a>.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
