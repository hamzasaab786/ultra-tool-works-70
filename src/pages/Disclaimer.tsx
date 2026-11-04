import React from "react";
import SEO from "@/components/SEO";

const Disclaimer = () => {
  const formattedDate = 'November 4, 2026';

  return (
    <>
      <SEO
        title="Disclaimer — Accuracy & Use of Klipza Tools"
        description="Klipza's disclaimer: tool results, calculators and conversions are provided as-is for general use, with no professional, legal, medical or financial advice."
        keywords="klipza disclaimer, online tools disclaimer, no warranty online calculator"
        canonicalUrl="https://klipza.live/disclaimer"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Disclaimer</h1>
          <p className="text-muted-foreground mb-8">Last updated: {formattedDate}</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">General information only</h2>
              <p className="text-muted-foreground">
                Everything on Klipza — tool results, calculators, converters, and guides — is provided for general informational purposes only. It is not professional advice of any kind: not legal, medical, financial, tax, or engineering advice. For decisions that matter, consult a qualified professional.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Accuracy</h2>
              <p className="text-muted-foreground">
                File conversions, image processing, calculations, and especially AI-generated outputs can contain errors or unexpected results. Always keep your original files and double-check important results before using them.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">External links and services</h2>
              <p className="text-muted-foreground">
                Klipza may link to or integrate with third-party websites and services. We are not responsible for their content, accuracy, or practices.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Advertising</h2>
              <p className="text-muted-foreground">
                This site displays third-party advertisements. We do not endorse the products or services advertised, and any dealings with advertisers are solely between you and them.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Availability</h2>
              <p className="text-muted-foreground">
                We aim to keep Klipza available and working, but we do not guarantee uninterrupted or error-free service.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Contact</h2>
              <p className="text-muted-foreground">
                Questions about this disclaimer: <a className="text-primary underline" href="mailto:officalsaab96@gmail.com">officalsaab96@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Disclaimer;
