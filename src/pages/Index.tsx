
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ToolCard from "@/components/ToolCard";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowDown, Sparkles, Zap, Shield, Clock, Star } from "lucide-react";
import ThreeDEffects from "@/components/ThreeDEffects";

// Import tool icons
import { ImageIcon, FileIcon, Calculator, Type, QrCode, Fingerprint, FilePlus, Scissors, FileDown, Percent, Ruler, Coins, AlignLeft, CaseSensitive, Camera, Timer, Palette, DollarSign, Link2, Eraser } from "lucide-react";

const Index = () => {
  const scrollToTools = () => {
    document.getElementById('popular-tools')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const toolCategories = [
    {
      title: "🖼️ Image Tools",
      description: "Professional image processing tools for compression, resizing, format conversion, and enhancement.",
      tools: [
        {
          title: "Image Compressor",
          description: "Reduce image file size with minimal quality loss using advanced compression algorithms",
          icon: <ImageIcon />,
          path: "/tools/image-compressor"
        },
        {
          title: "Image Resizer",
          description: "Change dimensions of your images easily with professional quality preservation",
          icon: <ImageIcon />,
          path: "/tools/image-resizer"
        },
        {
          title: "Background Remover",
          description: "Remove backgrounds from images with AI-powered precision",
          icon: <Eraser />,
          path: "/tools/background-remover"
        }
      ]
    },
    {
      title: "📄 PDF Tools",
      description: "Complete PDF management suite for merging, splitting, and compressing documents.",
      tools: [
        {
          title: "Merge PDF",
          description: "Combine multiple PDF files into one document with custom page ordering",
          icon: <FilePlus />,
          path: "/tools/merge-pdf"
        },
        {
          title: "Split PDF",
          description: "Extract specific pages from PDF documents with precision control",
          icon: <Scissors />,
          path: "/tools/split-pdf"
        }
      ]
    },
    {
      title: "🧮 Calculators",
      description: "Mathematical calculators and unit converters for everyday calculations.",
      tools: [
        {
          title: "Currency Converter",
          description: "Convert between major world currencies with up-to-date exchange rates",
          icon: <Coins />,
          path: "/tools/currency-converter"
        },
        {
          title: "Percentage Calculator",
          description: "Calculate percentages, percentage increase, decrease easily",
          icon: <Percent />,
          path: "/tools/percentage-calculator"
        }
      ]
    },
    {
      title: "🛠️ Utility Tools",
      description: "Essential utility tools for productivity and daily tasks.",
      tools: [
        {
          title: "QR Code Generator",
          description: "Create custom QR codes for URLs, text, contact info, and more",
          icon: <QrCode />,
          path: "/tools/qr-code-generator"
        },
        {
          title: "Password Generator",
          description: "Generate strong, secure passwords with customizable length",
          icon: <Fingerprint />,
          path: "/tools/password-generator"
        }
      ]
    }
  ];

  const features = [
    {
      icon: <Zap className="h-12 w-12" />,
      title: "Lightning Fast",
      description: "Advanced algorithms ensure blazing-fast processing, even for large files.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "100% Secure",
      description: "Your files are processed securely and never stored on our servers.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Sparkles className="h-12 w-12" />,
      title: "Always Free",
      description: "Every single tool is completely free with no limitations or hidden costs.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: "No Sign-Up",
      description: "Start using any tool instantly. No accounts or personal information required.",
      color: "from-blue-400 to-cyan-500"
    }
  ];

  const faqs = [
    {
      question: "Are all tools completely free to use?",
      answer: "Yes! All our tools are 100% free with no hidden costs, premium features, or subscription fees."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account required! You can use all our tools instantly without signing up."
    },
    {
      question: "Is my data safe and private?",
      answer: "Absolutely. Your files are processed locally and never stored on our servers."
    }
  ];

  return (
    <Layout>
      <SEO 
        title="ToolifyConvert - Free Online Tools for Digital Productivity" 
        description="Discover 20+ free online tools including image compressor, PDF merger, QR generator, currency converter, and more." 
        keywords="free online tools, image compressor, PDF merger, QR code generator, currency converter"
        canonicalUrl="https://toolifyconvert.com" 
      />
      
      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <ThreeDEffects type="float" intensity="high" className="mb-8">
            <div className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-12 animate-fade-in">
              <Star className="w-6 h-6 text-yellow-400 mr-3 animate-spin-slow" />
              <span className="text-white text-xl font-semibold">✨ All Tools Are 100% Free Forever</span>
            </div>
          </ThreeDEffects>
          
          <ThreeDEffects type="tilt" intensity="medium">
            <h1 className="text-7xl md:text-9xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-x leading-tight">
              ToolifyConvert
            </h1>
          </ThreeDEffects>
          
          <ThreeDEffects type="card" intensity="low" className="mb-8">
            <p className="text-3xl md:text-4xl mb-6 text-white/90 font-light">
              The Ultimate Collection of Free Online Tools
            </p>
          </ThreeDEffects>
          
          <ThreeDEffects type="float" intensity="low" className="mb-16">
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Convert, compress, resize, calculate, and more - all powered by cutting-edge technology.
            </p>
          </ThreeDEffects>
          
          <ThreeDEffects type="card" intensity="high" className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              size="lg" 
              className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-purple-500/25 backdrop-blur-sm border border-white/20 transition-all duration-500 hover:scale-105"
              onClick={scrollToTools}
            >
              <Zap className="mr-3 h-6 w-6" />
              Explore All Tools
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-xl px-12 py-8 border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:scale-105"
            >
              Learn More
            </Button>
          </ThreeDEffects>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={scrollToTools} 
            className="p-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-110 animate-bounce-gentle"
          >
            <ArrowDown className="h-8 w-8 text-white" />
          </button>
        </div>
      </section>

      {/* Modern Tools Section */}
      <section id="popular-tools" className="py-32 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto px-6">
          <ThreeDEffects type="card" intensity="medium" className="text-center mb-20">
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              🔥 Popular Tools
            </h2>
            <p className="text-2xl text-white/70 max-w-3xl mx-auto">
              Most loved tools by millions of users worldwide
            </p>
          </ThreeDEffects>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {toolCategories.flatMap(cat => cat.tools.slice(0, 2)).map((tool, index) => (
              <ThreeDEffects 
                key={index} 
                type="card" 
                intensity="high" 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ToolCard 
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  path={tool.path}
                  className="h-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-500"
                />
              </ThreeDEffects>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <ThreeDEffects type="card" intensity="medium" className="text-center mb-20">
            <h2 className="text-6xl font-bold mb-6 text-white">
              Why Choose ToolifyConvert?
            </h2>
            <p className="text-2xl text-white/70 max-w-4xl mx-auto">
              Built with cutting-edge technology and user experience in mind
            </p>
          </ThreeDEffects>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <ThreeDEffects 
                key={index} 
                type="card" 
                intensity="high"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="p-10 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 text-center hover:bg-white/20 transition-all duration-500 group">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-white/70 text-lg leading-relaxed">{feature.description}</p>
                </div>
              </ThreeDEffects>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <ThreeDEffects type="card" intensity="medium" className="text-center mb-20">
            <h2 className="text-6xl font-bold mb-6 text-white">
              ❓ Frequently Asked Questions
            </h2>
            <p className="text-2xl text-white/70 max-w-3xl mx-auto">
              Got questions? We've got answers!
            </p>
          </ThreeDEffects>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, index) => (
                <ThreeDEffects key={index} type="card" intensity="medium">
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 px-8 hover:bg-white/20 transition-all duration-500"
                  >
                    <AccordionTrigger className="text-left font-semibold text-white hover:text-cyan-400 transition-colors text-xl py-8">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 leading-relaxed text-lg pb-8">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </ThreeDEffects>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <ThreeDEffects type="float" intensity="high">
            <h2 className="text-6xl font-bold mb-6 text-white">Ready to Get Started?</h2>
            <p className="text-2xl mb-12 text-white/70 max-w-4xl mx-auto">
              Join millions who trust ToolifyConvert for their digital tasks
            </p>
            <Button 
              size="lg" 
              className="text-2xl px-16 py-8 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-2xl transition-all duration-500 hover:scale-110"
              onClick={scrollToTools}
            >
              Start Using Tools Now →
            </Button>
          </ThreeDEffects>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
