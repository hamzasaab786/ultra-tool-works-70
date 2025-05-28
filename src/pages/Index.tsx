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
      <SEO title="ToolifyConvert - Free Online Tools for Digital Productivity | Image, PDF, Text & More" description="Discover 20+ free online tools including image compressor, PDF merger, QR generator, currency converter, password generator, and more. No registration required, instant results." keywords="free online tools, image compressor, PDF merger, QR code generator, currency converter, password generator, unit converter, background remover, text tools, productivity tools" canonicalUrl="https://toolifyconvert.com" />
      
      {/* Hero Section with Enhanced 3D Effects */}
      <section className="relative overflow-hidden min-h-screen flex items-center parallax-bg">
        {/* Enhanced 3D Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Enhanced 3D Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl animate-float delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl animate-rotate-y"></div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center perspective-2000">
            <div className="inline-flex items-center px-6 py-3 glassmorphism rounded-full backdrop-blur-lg border border-white/20 mb-12 animate-fade-in transform-style-3d">
              <Sparkles className="w-5 h-5 text-yellow-400 mr-3 animate-glow" />
              <span className="text-white text-lg font-medium">✨ All Tools Are 100% Free Forever</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight animate-fade-in-up text-3d transform-style-3d">
              ToolifyConvert
            </h1>
            
            <p className="text-2xl md:text-3xl mb-10 text-gray-200 animate-fade-in delay-500 transform-style-3d">
              The Ultimate Collection of Free Online Tools
            </p>
            
            <p className="text-xl md:text-2xl mb-16 text-gray-300 max-w-4xl mx-auto animate-fade-in delay-700 transform-style-3d">
              Convert, compress, resize, calculate, and more - all powered by cutting-edge technology. 
              No sign-up required, lightning-fast processing, and completely secure.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-8 animate-fade-in delay-1000">
              <Button size="lg" className="text-xl px-12 py-6 btn-3d bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/25 glassmorphism" onClick={scrollToTools}>
                <Zap className="mr-3 h-6 w-6" />
                Explore All Tools
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({
              behavior: 'smooth'
            })} className="text-xl px-12 py-6 btn-3d border-2 border-white/30 text-white glassmorphism bg-slate-50">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button onClick={scrollToTools} className="animate-bounce-gentle p-4 glassmorphism rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 btn-3d">
            <ArrowDown className="h-8 w-8 text-white" />
          </button>
        </div>
      </section>

      {/* Popular Tools Section with Enhanced 3D */}
      <section id="popular-tools" className="py-32 section-3d scroll-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 scroll-reveal">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-3d">
              🔥 Most Popular Tools
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              These are our most loved and frequently used tools by millions of users worldwide for image processing, document management, and productivity enhancement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 perspective-1000">
            {[toolCategories[0].tools[0],
          // Image Compressor
          toolCategories[1].tools[0],
          // Merge PDF
          toolCategories[2].tools[0],
          // Percentage Calculator
          toolCategories[4].tools[0],
          // QR Code Generator
          toolCategories[0].tools[5],
          // Background Remover
          toolCategories[4].tools[2],
          // Timer & Stopwatch
          toolCategories[3].tools[2],
          // Base64 Tool
          toolCategories[4].tools[3] // Color Picker
          ].map((tool, index) => <div key={index} className="scroll-reveal card-3d glassmorphism" style={{
            animationDelay: `${index * 150}ms`
          }}>
                <ToolCard title={tool.title} description={tool.description} icon={tool.icon} path={tool.path} className="h-full bg-white/90 backdrop-blur-sm border border-white/30 transform-style-3d" />
              </div>)}
          </div>
        </div>
      </section>

      {/* All Tools Sections with Enhanced 3D */}
      {toolCategories.map((category, catIndex) => <section key={catIndex} className={`py-24 section-3d scroll-reveal ${catIndex % 2 === 0 ? 'gradient-mesh' : 'bg-white/80 backdrop-blur-sm'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 scroll-reveal">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-3d">
                {category.title}
              </h2>
              <p className="text-xl text-gray-600 max-w-5xl mx-auto mb-6 leading-relaxed">
                {category.description}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 perspective-1000">
              {category.tools.map((tool, toolIndex) => <div key={toolIndex} className="scroll-reveal card-3d glassmorphism" style={{
            animationDelay: `${toolIndex * 100}ms`
          }}>
                  <ToolCard title={tool.title} description={tool.description} icon={tool.icon} path={tool.path} className="h-full bg-white/90 backdrop-blur-sm border border-white/30 transform-style-3d" />
                </div>)}
            </div>
          </div>
        </section>)}

      {/* Features Section with Enhanced 3D */}
      <section id="features" className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden section-3d scroll-reveal">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Enhanced Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-rotate-y"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 scroll-reveal">
            <h2 className="text-5xl font-bold mb-6 text-3d">
              Why Choose ToolifyConvert?
            </h2>
            <p className="text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              We've built the most comprehensive suite of online tools with cutting-edge technology and user experience in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 perspective-1000">
            <div className="glassmorphism p-10 rounded-3xl backdrop-blur-lg border border-white/20 card-3d scroll-reveal transform-style-3d">
              <div className="text-green-400 mb-8">
                <Zap className="h-16 w-16 animate-glow" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Lightning Fast</h3>
              <p className="text-gray-200 text-lg leading-relaxed">Advanced algorithms ensure blazing-fast processing, even for large files. No more waiting around!</p>
            </div>
            
            <div className="glassmorphism p-10 rounded-3xl backdrop-blur-lg border border-white/20 card-3d scroll-reveal delay-200 transform-style-3d">
              <div className="text-blue-400 mb-8">
                <Shield className="h-16 w-16 animate-glow" />
              </div>
              <h3 className="text-2xl font-bold mb-6">100% Secure</h3>
              <p className="text-gray-200 text-lg leading-relaxed">Your files are processed securely and never stored on our servers. Complete privacy guaranteed.</p>
            </div>
            
            <div className="glassmorphism p-10 rounded-3xl backdrop-blur-lg border border-white/20 card-3d scroll-reveal delay-400 transform-style-3d">
              <div className="text-purple-400 mb-8">
                <Sparkles className="h-16 w-16 animate-glow" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Always Free</h3>
              <p className="text-gray-200 text-lg leading-relaxed">Every single tool is completely free with no limitations, ads, or hidden costs. Forever.</p>
            </div>
            
            <div className="glassmorphism p-10 rounded-3xl backdrop-blur-lg border border-white/20 card-3d scroll-reveal delay-600 transform-style-3d">
              <div className="text-pink-400 mb-8">
                <Clock className="h-16 w-16 animate-glow" />
              </div>
              <h3 className="text-2xl font-bold mb-6">No Sign-Up</h3>
              <p className="text-gray-200 text-lg leading-relaxed">Start using any tool instantly. No accounts, no forms, no personal information required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Enhanced 3D */}
      <section className="py-32 gradient-mesh scroll-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 scroll-reveal">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-3d">
              ❓ Frequently Asked Questions
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Got questions? We've got answers! Here are the most common questions about our tools and services.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto perspective-1000">
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="glassmorphism rounded-2xl border border-white/30 px-8 card-3d scroll-reveal transform-style-3d" style={{
              animationDelay: `${index * 100}ms`
            }}>
                  <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-blue-600 transition-colors text-lg py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-lg pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced 3D */}
      <section className="py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden section-3d scroll-reveal">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10 perspective-1000">
          <h2 className="text-5xl font-bold mb-6 text-3d">Ready to Get Started?</h2>
          <p className="text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Join millions of users who trust ToolifyConvert for their daily digital tasks including image processing, document management, and productivity tools
          </p>
          <Button size="lg" className="text-2xl px-16 py-8 btn-3d bg-white text-blue-600 hover:bg-gray-100 shadow-2xl glassmorphism transform-style-3d" onClick={scrollToTools}>
            Start Using Tools Now →
          </Button>
        </div>
      </section>
    </Layout>;
};
export default Index;