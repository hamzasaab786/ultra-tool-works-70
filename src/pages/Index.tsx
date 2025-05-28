import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ToolCard from "@/components/ToolCard";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowDown, Sparkles, Zap, Shield, Clock } from "lucide-react";

// Import tool icons
import { ImageIcon, FileIcon, Calculator, Type, QrCode, Fingerprint, FilePlus, Scissors, FileDown, Percent, Ruler, Coins, AlignLeft, CaseSensitive, Camera, Timer, Palette, DollarSign, Link2, Eraser } from "lucide-react";

const Index = () => {
  const scrollToTools = () => {
    document.getElementById('popular-tools')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const toolCategories = [{
    title: "🖼️ Image Tools",
    description: "Professional image processing tools for compression, resizing, format conversion, and enhancement. Perfect for photographers, designers, and content creators.",
    keywords: "image compressor, photo editor, image resizer, JPG to PDF converter, SVG to JPG, background remover, passport photo maker",
    tools: [{
      title: "Image Compressor",
      description: "Reduce image file size with minimal quality loss using advanced compression algorithms",
      icon: <ImageIcon />,
      path: "/tools/image-compressor"
    }, {
      title: "Image Resizer",
      description: "Change dimensions of your images easily with professional quality preservation",
      icon: <ImageIcon />,
      path: "/tools/image-resizer"
    }, {
      title: "Image Enhancer",
      description: "Adjust brightness, contrast, saturation and more with professional image enhancement tools",
      icon: <ImageIcon />,
      path: "/tools/image-enhancer"
    }, {
      title: "JPG to PDF",
      description: "Convert images to PDF documents with custom layouts and compression settings",
      icon: <FileIcon />,
      path: "/tools/jpg-to-pdf"
    }, {
      title: "SVG to JPG",
      description: "Convert SVG vector graphics to high-quality JPG images with custom dimensions",
      icon: <ImageIcon />,
      path: "/tools/svg-to-jpg"
    }, {
      title: "Image to URL",
      description: "Convert images to shareable URLs for easy embedding and sharing online",
      icon: <Link2 />,
      path: "/tools/image-to-url"
    }, {
      title: "Background Remover",
      description: "Remove backgrounds from images with AI-powered precision and professional results",
      icon: <Eraser />,
      path: "/tools/background-remover"
    }, {
      title: "Passport Photo Maker",
      description: "Create professional passport photos with correct dimensions and quality standards",
      icon: <Camera />,
      path: "/tools/passport-photo-maker"
    }]
  }, {
    title: "📄 PDF Tools",
    description: "Complete PDF management suite for merging, splitting, and compressing PDF documents. Essential tools for document workflow automation.",
    keywords: "PDF merger, PDF splitter, PDF compressor, document tools, PDF editor",
    tools: [{
      title: "Merge PDF",
      description: "Combine multiple PDF files into one document with custom page ordering",
      icon: <FilePlus />,
      path: "/tools/merge-pdf"
    }, {
      title: "Split PDF",
      description: "Extract specific pages from PDF documents with precision control",
      icon: <Scissors />,
      path: "/tools/split-pdf"
    }, {
      title: "Compress PDF",
      description: "Reduce PDF file size while maintaining document quality and readability",
      icon: <FileDown />,
      path: "/tools/compress-pdf"
    }]
  }, {
    title: "🧮 Calculators & Converters",
    description: "Mathematical calculators and unit converters for everyday calculations. From percentage calculations to currency conversion with real-time rates.",
    keywords: "percentage calculator, unit converter, currency converter, measurement tools, financial calculator",
    tools: [{
      title: "Percentage Calculator",
      description: "Calculate percentages, percentage increase, decrease, and percentage of numbers easily",
      icon: <Percent />,
      path: "/tools/percentage-calculator"
    }, {
      title: "Unit Converter",
      description: "Convert between different units of measurement including length, weight, temperature, and volume",
      icon: <Ruler />,
      path: "/tools/unit-converter"
    }, {
      title: "Currency Converter",
      description: "Convert between major world currencies with up-to-date exchange rates",
      icon: <Coins />,
      path: "/tools/currency-converter"
    }]
  }, {
    title: "📝 Text Tools",
    description: "Text processing and manipulation tools for writers, editors, and content creators. Count words, convert case, and encode/decode text.",
    keywords: "word counter, character counter, text case converter, Base64 encoder decoder, text tools",
    tools: [{
      title: "Word & Character Counter",
      description: "Count words, characters, paragraphs, and reading time in your text content",
      icon: <AlignLeft />,
      path: "/tools/word-counter"
    }, {
      title: "Case Converter",
      description: "Convert text case between uppercase, lowercase, title case, and sentence case",
      icon: <CaseSensitive />,
      path: "/tools/case-converter"
    }, {
      title: "Base64 Encoder/Decoder",
      description: "Encode and decode Base64 strings for data transmission and storage",
      icon: <Type />,
      path: "/tools/base64-tool"
    }]
  }, {
    title: "🛠️ Utility Tools",
    description: "Essential utility tools for productivity and daily tasks. Generate QR codes, create secure passwords, track time, and manage finances.",
    keywords: "QR code generator, password generator, timer stopwatch, color picker, budget tracker",
    tools: [{
      title: "QR Code Generator",
      description: "Create custom QR codes for URLs, text, contact info, and more with color customization",
      icon: <QrCode />,
      path: "/tools/qr-code-generator"
    }, {
      title: "Password Generator",
      description: "Generate strong, secure passwords with customizable length and character sets",
      icon: <Fingerprint />,
      path: "/tools/password-generator"
    }, {
      title: "Timer & Stopwatch",
      description: "Professional timer and stopwatch with lap tracking and notification features",
      icon: <Timer />,
      path: "/tools/timer-stopwatch"
    }, {
      title: "Color Picker",
      description: "Pick colors and get HEX, RGB, HSL values with gradient and palette tools",
      icon: <Palette />,
      path: "/tools/color-picker"
    }, {
      title: "Budget Tracker",
      description: "Track your monthly income and expenses with category management and currency support",
      icon: <DollarSign />,
      path: "/tools/budget-tracker"
    }]
  }];

  const faqs = [
    {
      question: "Are all tools completely free to use?",
      answer: "Yes! All our tools are 100% free with no hidden costs, premium features, or subscription fees. We believe everyone should have access to essential digital tools."
    }, {
      question: "Do I need to create an account to use the tools?",
      answer: "No account required! You can use all our tools instantly without signing up, providing personal information, or creating passwords."
    }, {
      question: "Is my data safe and private?",
      answer: "Absolutely. Most tools process your files locally in your browser, meaning your data never leaves your device. For tools that require server processing, we don't store any of your files or personal information."
    }, {
      question: "What file formats do you support?",
      answer: "We support all major file formats including JPG, PNG, GIF, WebP for images; PDF for documents; and various text formats. Each tool clearly indicates which formats are supported."
    }, {
      question: "Are there any file size limitations?",
      answer: "We have reasonable limits to ensure good performance for all users. Most tools support files up to 10MB, which covers the vast majority of use cases."
    }, {
      question: "Can I use these tools on mobile devices?",
      answer: "Yes! Our website is fully responsive and works perfectly on smartphones, tablets, and desktop computers. All tools are optimized for touch interfaces."
    }, {
      question: "How often do you add new tools?",
      answer: "We regularly add new tools based on user feedback and emerging needs. Follow us or bookmark our site to stay updated with the latest additions."
    }, {
      question: "Can I suggest a new tool?",
      answer: "We'd love to hear your suggestions! While we don't have a formal contact form yet, we're always looking for ways to improve and add valuable tools for our users."
    }
  ];

  return (
    <Layout>
      <SEO 
        title="ToolifyConvert - Free Online Tools for Digital Productivity | Image, PDF, Text & More"
        description="Discover 20+ free online tools including image compressor, PDF merger, QR generator, currency converter, password generator, and more. No registration required, instant results."
        keywords="free online tools, image compressor, PDF merger, QR code generator, currency converter, password generator, unit converter, background remover, text tools, productivity tools"
        canonicalUrl="https://toolifyconvert.com"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "ToolifyConvert",
          "description": "Free online tools for image processing, PDF management, text manipulation, calculations, and productivity",
          "url": "https://toolifyconvert.com",
          "applicationCategory": "Utility",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Image Compression and Processing",
            "PDF Management Tools",
            "QR Code Generation",
            "Currency and Unit Conversion", 
            "Text Processing Tools",
            "Password and Security Tools",
            "Timer and Productivity Tools"
          ],
          "author": {
            "@type": "Organization",
            "name": "ToolifyConvert"
          }
        }}
      />
      
      {/* Hero Section with 3D Effects */}
      <section className="relative overflow-hidden">
        {/* Hero Section with 3D Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* 3D Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-white text-sm">✨ All Tools Are 100% Free Forever</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight animate-fade-in">
              ToolifyConvert
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in delay-500">
              The Ultimate Collection of Free Online Tools
            </p>
            
            <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-3xl mx-auto animate-fade-in delay-700">
              Convert, compress, resize, calculate, and more - all powered by cutting-edge technology. 
              No sign-up required, lightning-fast processing, and completely secure.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in delay-1000">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300" onClick={scrollToTools}>
                <Zap className="mr-2 h-5 w-5" />
                Explore All Tools
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({
              behavior: 'smooth'
            })} className="text-lg px-8 py-4 border-2 border-white/30 text-white backdrop-blur-sm bg-indigo-500 hover:bg-indigo-400">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center pb-8">
          <button onClick={scrollToTools} className="animate-bounce p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
            <ArrowDown className="h-6 w-6 text-white" />
          </button>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section id="popular-tools" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              🔥 Most Popular Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These are our most loved and frequently used tools by millions of users worldwide for image processing, document management, and productivity enhancement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              toolCategories[0].tools[0], // Image Compressor
              toolCategories[1].tools[0], // Merge PDF
              toolCategories[2].tools[0], // Percentage Calculator
              toolCategories[4].tools[0], // QR Code Generator
              toolCategories[0].tools[6], // Background Remover
              toolCategories[4].tools[2], // Timer & Stopwatch
              toolCategories[3].tools[2], // Base64 Tool
              toolCategories[4].tools[3]  // Color Picker
            ].map((tool, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ToolCard 
                  title={tool.title} 
                  description={tool.description} 
                  icon={tool.icon} 
                  path={tool.path} 
                  className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm border border-white/50" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools Sections */}
      {toolCategories.map((category, catIndex) => (
        <section key={catIndex} className={`py-16 ${catIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-indigo-50'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {category.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-4">
                {category.description}
              </p>
              <p className="text-sm text-gray-500">
                Keywords: {category.keywords}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.tools.map((tool, toolIndex) => (
                <div key={toolIndex} className="animate-fade-in" style={{ animationDelay: `${toolIndex * 50}ms` }}>
                  <ToolCard 
                    title={tool.title} 
                    description={tool.description} 
                    icon={tool.icon} 
                    path={tool.path} 
                    className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose ToolifyConvert?
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              We've built the most comprehensive suite of online tools with cutting-edge technology and user experience in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300 animate-fade-in">
              <div className="text-green-400 mb-6">
                <Zap className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-gray-200">Advanced algorithms ensure blazing-fast processing, even for large files. No more waiting around!</p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300 animate-fade-in delay-200">
              <div className="text-blue-400 mb-6">
                <Shield className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold mb-4">100% Secure</h3>
              <p className="text-gray-200">Your files are processed securely and never stored on our servers. Complete privacy guaranteed.</p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300 animate-fade-in delay-400">
              <div className="text-purple-400 mb-6">
                <Sparkles className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold mb-4">Always Free</h3>
              <p className="text-gray-200">Every single tool is completely free with no limitations, ads, or hidden costs. Forever.</p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300 animate-fade-in delay-600">
              <div className="text-pink-400 mb-6">
                <Clock className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold mb-4">No Sign-Up</h3>
              <p className="text-gray-200">Start using any tool instantly. No accounts, no forms, no personal information required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              ❓ Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Got questions? We've got answers! Here are the most common questions about our tools and services.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 px-6">
                  <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join millions of users who trust ToolifyConvert for their daily digital tasks including image processing, document management, and productivity tools
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-300" 
            onClick={scrollToTools}
          >
            Start Using Tools Now →
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
