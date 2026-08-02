
import React from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const Disclaimer = () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  return (
    <Layout>
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
              <h2 className="text-2xl font-bold mb-4">Website Disclaimer</h2>
              <p className="text-muted-foreground">
                The information provided by Klipza ("we," "us," or "our") on our website is for general informational and tool usage purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or tools on the site.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">No Liability</h2>
              <p className="text-muted-foreground">
                UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION OR TOOL ON THE SITE IS SOLELY AT YOUR OWN RISK.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Tools and Results</h2>
              <p className="text-muted-foreground">
                While we strive to provide useful and functional tools:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We do not guarantee that our tools will always function without errors or interruptions</li>
                <li>Results from our tools (such as conversions, calculations, etc.) are provided "as is" without any guarantees of accuracy</li>
                <li>You should verify important results through other means before relying on them for significant decisions</li>
                <li>The quality of output (such as compressed files) may vary based on many factors including browser capabilities, file characteristics, and connection speed</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">External Links</h2>
              <p className="text-muted-foreground">
                The Site may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Content Usage</h2>
              <p className="text-muted-foreground">
                You are responsible for ensuring that any content you process using our tools:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Does not infringe on any third-party intellectual property rights</li>
                <li>Does not violate any applicable laws or regulations</li>
                <li>Does not contain malicious software or components</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                We are not responsible for any unauthorized use or distribution of content processed through our tools.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Technical Limitations</h2>
              <p className="text-muted-foreground">
                Our tools operate within the technical constraints of web browsers. Large files, complex operations, or certain file formats may not be supported or may function differently depending on your device, browser, or internet connection.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Changes</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify this disclaimer at any time. Any changes will be effective immediately upon posting the updated disclaimer on this website.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this disclaimer, please contact us through the provided information on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Disclaimer;
