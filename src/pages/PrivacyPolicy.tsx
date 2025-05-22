
import React from "react";
import Layout from "@/components/Layout";

const PrivacyPolicy = () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {formattedDate}</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                QuickConvert ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our online tools.
              </p>
              <p className="text-muted-foreground mt-4">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Information We Don't Collect</h2>
              <p className="text-muted-foreground">
                As a "no sign-up" service, we do not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Require you to create an account</li>
                <li>Collect your name, email address, or other personal identifiers</li>
                <li>Store the files or data you process through our tools</li>
                <li>Request payment information</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Information We May Collect</h2>
              <p className="text-muted-foreground">
                We may collect certain non-personal information automatically, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Device type</li>
                <li>Referring website</li>
                <li>Time spent on pages</li>
                <li>Pages visited</li>
                <li>IP address (which is anonymized)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Use of Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies to enhance your experience on our site. These may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Essential cookies that enable basic functions</li>
                <li>Analytics cookies to help us understand how visitors use our site</li>
                <li>Advertising cookies that may be set by third-party advertising services</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">How We Process Your Data</h2>
              <p className="text-muted-foreground">
                When you use our tools:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>All file processing (image compression, PDF manipulation, etc.) is done directly in your browser whenever possible</li>
                <li>Files uploaded are not stored on our servers</li>
                <li>We do not have access to the content of your files</li>
                <li>The results are delivered back to your browser for download</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground">
                We may use third-party services for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Analytics (e.g., Google Analytics) to understand site usage</li>
                <li>Advertising (e.g., Google AdSense) to display relevant ads</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                These third-party services may collect information as specified in their respective privacy policies.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground">
                We implement reasonable precautions to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us through the provided information on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
