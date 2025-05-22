
import React from "react";
import Layout from "@/components/Layout";

const AboutUs = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">About QuickConvert</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                At QuickConvert, our mission is to provide free, accessible, and easy-to-use online tools for everyone.
                We believe that essential digital tools should be available to all users without barriers such as 
                sign-ups, subscriptions, or complex interfaces.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
              <p className="text-muted-foreground">
                QuickConvert provides a comprehensive suite of online utilities designed to help you with everyday
                digital tasks. From image and PDF manipulation to text tools, unit converters, and more — all our 
                tools are developed with simplicity and efficiency in mind.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Principles</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium">Free Access</span>: All tools on QuickConvert are completely free to use.
                  We don't believe in putting essential utilities behind paywalls.
                </li>
                <li>
                  <span className="font-medium">No Sign-Ups</span>: We don't require you to create an account to use our services.
                  Just visit the site and start using the tools immediately.
                </li>
                <li>
                  <span className="font-medium">Privacy-Focused</span>: We minimize data collection and don't store your files.
                  All processing is done in your browser whenever possible.
                </li>
                <li>
                  <span className="font-medium">User-Friendly Design</span>: We focus on creating intuitive interfaces that
                  make our tools accessible to users of all technical levels.
                </li>
                <li>
                  <span className="font-medium">High Performance</span>: We optimize our tools to be fast and efficient,
                  respecting your time and device resources.
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">How We Help</h2>
              <p className="text-muted-foreground">
                Whether you're a student working on a project, a professional preparing documents, or simply someone who
                needs to perform a quick calculation or conversion, QuickConvert is here to help. Our tools streamline
                common tasks, saving you time and effort in your daily digital activities.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                We envision a web where essential digital tools are freely available to everyone, regardless of their
                location, financial situation, or technical expertise. QuickConvert is our contribution to that vision —
                a platform that democratizes access to useful utilities and helps make the internet more useful for all.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
