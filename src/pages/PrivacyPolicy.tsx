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
    dateModified: "2026-11-04",
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
                ["files", "Files you process"],
                ["collected", "Information we collect"],
                ["cookies", "Cookies and advertising"],
                ["children", "Children's privacy"],
                ["changes", "Changes to this policy"],
                ["contact", "Contact"],
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
                This Privacy Policy explains how Klipza ("we", "our") handles information when you use klipza.live.
              </p>
            </Section>

            <Section id="files" title="Files you process">
              <p>
                Most Klipza tools run entirely in your browser. When you compress an image, merge PDFs, or convert a file, the processing happens locally on your device — your files are not uploaded to our servers and we never see, store, or share them. AI-powered and online lookup features use connected third-party services to function; only the data needed for that feature is transmitted, and it is handled according to those services' own policies.
              </p>
            </Section>

            <Section id="collected" title="Information we collect">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Usage data:</strong> We may collect anonymous, aggregated information about how the site is used (pages visited, tools used, device type) to improve Klipza. This data does not identify you personally.
                </li>
                <li>
                  <strong>No accounts:</strong> Klipza does not require registration, so we do not collect names, email addresses, or passwords from visitors.
                </li>
              </ul>
            </Section>

            <Section id="cookies" title="Cookies and advertising">
              <p>
                We use cookies for basic site functionality (such as remembering preferences). We also use third-party advertising partners, including Google AdSense:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites.
                </li>
                <li>
                  Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.
                </li>
                <li>
                  You may opt out of personalized advertising by visiting{" "}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline">
                    Google's Ads Settings
                  </a>
                  . You can also opt out of some third-party vendors' use of cookies for personalized advertising at{" "}
                  <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="underline">
                    optout.aboutads.info
                  </a>
                  .
                </li>
              </ul>
              <p>
                You can control cookies through your browser settings, including blocking or deleting them, though some site features may not work as intended without them.
              </p>
            </Section>

            <Section id="children" title="Children's privacy">
              <p>
                Klipza is not directed at children under 13, and we do not knowingly collect personal information from children.
              </p>
            </Section>

            <Section id="changes" title="Changes to this policy">
              <p>
                We may update this policy from time to time. The "Last updated" date at the top will reflect the most recent revision.
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>
                If you have questions about this Privacy Policy, contact us at{" "}
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

export default PrivacyPolicy;
