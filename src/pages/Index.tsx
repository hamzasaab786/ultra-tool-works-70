
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ToolCard from "@/components/ToolCard";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowDown, Sparkles, Zap, Shield, Clock } from "lucide-react";

// Import tool icons
import { ImageIcon, FileIcon, Calculator, Type, QrCode, Fingerprint, FilePlus, Scissors, FileDown, Percent, Ruler, Coins, AlignLeft, CaseSensitive, Camera, Timer, Palette, DollarSign, Link2, Eraser, FileImage, MessageSquare, Volume2 } from "lucide-react";

const Index = () => {
  const scrollToTools = () => {
    document.getElementById('popular-tools')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const toolCategories = [{
    title: "🖼️ Image Tools",
    description: "Professional image processing tools for compression, resizing, format conversion, and enhancement. Perfect for photographers, designers, and content creators.",
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
      description: "Convert SVG vector graphics to high-quality JPG images with optimized settings",
      icon: <ImageIcon />,
      path: "/tools/svg-to-jpg"
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
    }, {
      title: "Image to URL",
      description: "Upload images and get shareable URLs for web hosting and sharing",
      icon: <Link2 />,
      path: "/tools/image-to-url"
    }]
  }, {
    title: "📄 PDF Tools",
    description: "Complete PDF management suite for merging, splitting, compressing, converting, and securing PDF documents. Essential tools for document workflow automation.",
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
    }, {
      title: "PDF to JPG",
      description: "Convert PDF pages to high-quality JPG or PNG images with customizable settings",
      icon: <FileImage />,
      path: "/tools/pdf-to-jpg"
    }, {
      title: "Word to PDF",
      description: "Convert Microsoft Word documents to PDF with preserved formatting",
      icon: <FileIcon />,
      path: "/tools/word-to-pdf"
    }, {
      title: "PowerPoint to PDF",
      description: "Convert PowerPoint presentations to PDF format with slide layouts",
      icon: <FileIcon />,
      path: "/tools/powerpoint-to-pdf"
    }, {
      title: "Excel to PDF",
      description: "Convert Excel spreadsheets to PDF with preserved data and formatting",
      icon: <FileIcon />,
      path: "/tools/excel-to-pdf"
    }, {
      title: "HTML to PDF",
      description: "Convert HTML content or files to PDF with CSS styling preserved",
      icon: <FileIcon />,
      path: "/tools/html-to-pdf"
    }, {
      title: "PDF to Word",
      description: "Convert PDF documents to editable Word format with OCR support",
      icon: <FileIcon />,
      path: "/tools/pdf-to-word"
    }, {
      title: "Protect PDF",
      description: "Add password protection and permission restrictions to PDF documents",
      icon: <Shield />,
      path: "/tools/protect-pdf"
    }]
  }, {
    title: "🧮 Calculators & Converters",
    description: "Mathematical calculators and unit converters for everyday calculations. From percentage calculations to currency conversion with real-time rates.",
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
    }, {
      title: "Speech Converter",
      description: "Convert between direct and indirect speech with proper grammar rules and examples",
      icon: <MessageSquare />,
      path: "/tools/speech-converter"
    }]
  }, {
    title: "🛠️ Utility Tools",
    description: "Essential utility tools for productivity and daily tasks. Generate QR codes, create secure passwords, track time, and manage finances.",
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

  const faqs = [{
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
  }];

  return <Layout>
      <SEO title="ToolifyConvert - Free Online Tools for Digital Productivity | Image, PDF, Text & More" description="Discover 25+ free online tools including image compressor, PDF merger, QR generator, currency converter, password generator, and more. No registration required, instant results." keywords="free online tools, image compressor, PDF merger, QR code generator, currency converter, password generator, unit converter, background remover, text tools, productivity tools" canonicalUrl="https://toolifyconvert.com" />
      
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 glassmorphism rounded-full border border-indigo-200/50 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-indigo-700 font-medium">✨ All Tools Are 100% Free Forever</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text animate-slide-up">
              ToolifyConvert
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-700 animate-slide-up delay-200">The Ultimate Collection of 100% Free Online Tools</p>
            
            <p className="text-lg mb-12 text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-300">
              Convert, compress, resize, calculate, and more - all powered by cutting-edge technology. 
              No sign-up required, lightning-fast processing, and completely secure.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up delay-400">
              <Button size="lg" className="text-lg px-8 py-3 btn-modern bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white" onClick={scrollToTools}>
                <Zap className="mr-2 h-5 w-5" />
                Explore All Tools
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 btn-modern border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => document.getElementById('features')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button onClick={scrollToTools} className="animate-bounce p-3 glassmorphism rounded-full border border-indigo-200/50 hover:bg-indigo-50/50 transition-all duration-300 btn-modern">
            <ArrowDown className="h-6 w-6 text-indigo-600" />
          </button>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section id="popular-tools" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              🔥 Most Popular Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              These are our most loved and frequently used tools by millions of users worldwide for image processing, document management, and productivity enhancement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              toolCategories[0].tools[0], // Image Compressor
              toolCategories[1].tools[0], // Merge PDF
              toolCategories[2].tools[0], // Percentage Calculator
              toolCategories[4].tools[0], // QR Code Generator
              toolCategories[0].tools[5], // Background Remover
              toolCategories[4].tools[2], // Timer & Stopwatch
              toolCategories[3].tools[2], // Base64 Tool
              toolCategories[4].tools[3], // Color Picker
              toolCategories[1].tools[3], // PDF to JPG
              toolCategories[3].tools[3]  // Speech Converter
            ].map((tool, index) => <div key={index} className="animate-fade-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <ToolCard title={tool.title} description={tool.description} icon={tool.icon} path={tool.path} className="h-full" />
              </div>)}
          </div>
        </div>
      </section>

      {/* All Tools Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              🚀 All Tools by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our complete collection of professional-grade tools, organized by category for easy discovery
            </p>
          </div>

          <div className="space-y-16">
            {toolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    {category.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="animate-fade-in" style={{
                      animationDelay: `${toolIndex * 50}ms`
                    }}>
                      <ToolCard 
                        title={tool.title} 
                        description={tool.description} 
                        icon={tool.icon} 
                        path={tool.path} 
                        className="h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Why Choose ToolifyConvert?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've built the most comprehensive suite of online tools with cutting-edge technology and user experience in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glassmorphism p-6 rounded-2xl border border-white/50 card-modern text-center">
              <div className="text-green-600 mb-4 flex justify-center">
                <Zap className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Advanced algorithms ensure blazing-fast processing, even for large files. No more waiting around!</p>
            </div>
            
            <div className="glassmorphism p-6 rounded-2xl border border-white/50 card-modern text-center">
              <div className="text-blue-600 mb-4 flex justify-center">
                <Shield className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">100% Secure</h3>
              <p className="text-gray-600 leading-relaxed">Your files are processed securely and never stored on our servers. Complete privacy guaranteed.</p>
            </div>
            
            <div className="glassmorphism p-6 rounded-2xl border border-white/50 card-modern text-center">
              <div className="text-purple-600 mb-4 flex justify-center">
                <Sparkles className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">100% Completely Free</h3>
              <p className="text-gray-600 leading-relaxed">Every single tool is completely free with no limitations, or hidden costs. Forever.</p>
            </div>
            
            <div className="glassmorphism p-6 rounded-2xl border border-white/50 card-modern text-center">
              <div className="text-indigo-600 mb-4 flex justify-center">
                <Clock className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">No Sign-Up</h3>
              <p className="text-gray-600 leading-relaxed">Start using any tool instantly. No accounts, no forms, no personal information required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              ❓ Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Got questions? We've got answers! Here are the most common questions about our tools and services.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="glassmorphism rounded-xl border border-gray-200/50 px-6">
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-indigo-600 transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-indigo-100 max-w-3xl mx-auto leading-relaxed">
            Join millions of users who trust ToolifyConvert for their daily digital tasks
          </p>
          <Button size="lg" className="text-lg px-8 py-3 btn-modern bg-white text-indigo-600 hover:bg-gray-100" onClick={scrollToTools}>
            Start Using Tools Now →
          </Button>
        </div>
      </section>
    </Layout>;
};

export default Index;
