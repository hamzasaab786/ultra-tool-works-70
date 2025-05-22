
import React from "react";
import Layout from "@/components/Layout";

const Terms = () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {formattedDate}</p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern your access to and use of the QuickConvert website and all related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
              </p>
              <p className="text-muted-foreground mt-4">
                Please read these Terms carefully. If you do not agree with these Terms, you may not access or use the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Use of the Service</h2>
              <p className="text-muted-foreground">
                You may use our Service for lawful purposes only and in accordance with these Terms. You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation</li>
                <li>To impersonate or attempt to impersonate QuickConvert, a QuickConvert employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which may harm QuickConvert or users of the Service</li>
                <li>For any purpose that is unlawful or prohibited by these Terms</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Intellectual Property Rights</h2>
              <p className="text-muted-foreground">
                The Service and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by QuickConvert, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
              <p className="text-muted-foreground mt-4">
                These Terms do not grant you any right, title, or interest in the Service, its content, or our trademarks, logos, or other brand features.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">4. Your Content</h2>
              <p className="text-muted-foreground">
                Our Service allows you to process and manipulate various types of files and data. You retain all rights to your content. We do not claim ownership of your content, and these Terms do not grant us any licenses or rights to your content except for the limited rights needed to run the Service.
              </p>
              <p className="text-muted-foreground mt-4">
                You are solely responsible for your content and the consequences of uploading, submitting, or otherwise making your content available on our Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">5. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. WITHOUT LIMITING THE FOREGOING, QUICKCONVERT EXPLICITLY DISCLAIMS ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT, OR NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE.
              </p>
              <p className="text-muted-foreground mt-4">
                We make no warranty that the Service will meet your requirements or be available on an uninterrupted, secure, or error-free basis. We make no warranty regarding the quality, accuracy, timeliness, truthfulness, completeness, or reliability of any content available through the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUICKCONVERT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE</li>
                <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE</li>
                <li>ANY CONTENT OBTAINED FROM THE SERVICE</li>
                <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">7. Changes to the Terms</h2>
              <p className="text-muted-foreground">
                We may revise and update these Terms from time to time at our sole discretion. All changes are effective immediately when we post them.
              </p>
              <p className="text-muted-foreground mt-4">
                Your continued use of the Service following the posting of revised Terms means that you accept and agree to the changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms and your use of the Service shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us through the provided information on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
