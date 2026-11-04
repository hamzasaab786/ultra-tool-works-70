import React from "react";
import SEO from "@/components/SEO";

const AboutUs = () => {
  return (
    <>
      <SEO
        title="About Klipza — Free Privacy-First Online Tools"
        description="Learn who builds Klipza, why our 130+ PDF, image, text and calculator tools are free, and how browser-based processing keeps your files private."
        keywords="about klipza, free online tools company, privacy first web tools"
        canonicalUrl="https://klipza.live/about"
      />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">About Klipza</h1>

          <div className="space-y-6">
            <section>
              <p className="text-muted-foreground">Klipza is a free collection of online tools for everyday tasks — PDF tools, image tools, text utilities, converters, QR codes, and calculators. Everything is designed to work fast, right in your browser, with no sign-up and no software to install.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Who runs Klipza</h2>
              <p className="text-muted-foreground">Klipza is built and maintained by Hamza, an independent developer. It started as a simple idea: the small file tasks people do every day — merging PDFs, compressing images, converting formats — shouldn't require expensive software, accounts, or uploading personal files to random servers.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Why it's free</h2>
              <p className="text-muted-foreground">Most Klipza tools process your files locally, inside your own browser, which keeps operating costs low. The site is supported by advertising, which is why you can use all 130+ tools for free.</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Privacy-first by design</h2>
              <p className="text-muted-foreground">Unlike many online tools, Klipza doesn't need your files to leave your device. Compression, conversion, and PDF operations run locally using your browser's built-in capabilities — nothing is uploaded to a server for the core tools. AI and online lookup features clearly use connected services, and those are marked where they appear.</p>
            </section>
            <section id="contact" className="scroll-mt-40">
              <h2 className="text-2xl font-bold mb-4">Contact</h2>
              <p className="text-muted-foreground">Questions, feedback, or a tool request? Reach out at <a className="text-primary underline" href="mailto:officalsaab96@gmail.com">officalsaab96@gmail.com</a>.</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
