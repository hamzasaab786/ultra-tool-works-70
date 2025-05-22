
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ToolCard from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

// Import tool icons (using Lucide React icons)
import { 
  ImageIcon, FileIcon, Calculator, Type, QrCode, 
  Fingerprint, FilePlus, Scissors, FileDown, 
  Percent, Ruler, Coins, AlignLeft, CaseSensitive
} from "lucide-react";

const Index = () => {
  // Scroll to tools section function
  const scrollToTools = () => {
    document.getElementById('popular-tools')?.scrollIntoView({ 
      behavior: 'smooth'
    });
  };

  // Tool categories
  const toolCategories = [
    {
      title: "Image Tools",
      tools: [
        { 
          title: "Image Compressor", 
          description: "Reduce image file size with minimal quality loss",
          icon: <ImageIcon />,
          path: "/tools/image-compressor"
        },
        { 
          title: "Image Resizer", 
          description: "Change dimensions of your images easily",
          icon: <ImageIcon />,
          path: "/tools/image-resizer"
        },
        { 
          title: "Image Enhancer", 
          description: "Adjust brightness, contrast and more",
          icon: <ImageIcon />,
          path: "/tools/image-enhancer"
        },
        { 
          title: "JPG to PDF", 
          description: "Convert images to PDF documents",
          icon: <FileIcon />,
          path: "/tools/jpg-to-pdf"
        }
      ]
    },
    {
      title: "PDF Tools",
      tools: [
        { 
          title: "Merge PDF", 
          description: "Combine multiple PDF files into one",
          icon: <FilePlus />,
          path: "/tools/merge-pdf"
        },
        { 
          title: "Split PDF", 
          description: "Extract specific pages from PDF documents",
          icon: <Scissors />,
          path: "/tools/split-pdf"
        },
        { 
          title: "Compress PDF", 
          description: "Reduce PDF file size",
          icon: <FileDown />,
          path: "/tools/compress-pdf"
        }
      ]
    },
    {
      title: "Calculators & Converters",
      tools: [
        { 
          title: "Percentage Calculator", 
          description: "Calculate percentages easily",
          icon: <Percent />,
          path: "/tools/percentage-calculator"
        },
        { 
          title: "Unit Converter", 
          description: "Convert between different units of measurement",
          icon: <Ruler />,
          path: "/tools/unit-converter"
        },
        { 
          title: "Currency Converter", 
          description: "Convert between major world currencies",
          icon: <Coins />,
          path: "/tools/currency-converter"
        }
      ]
    },
    {
      title: "Text Tools",
      tools: [
        { 
          title: "Word & Character Counter", 
          description: "Count words, characters, and lines in your text",
          icon: <AlignLeft />,
          path: "/tools/word-counter"
        },
        { 
          title: "Case Converter", 
          description: "Convert text case (uppercase, lowercase, etc.)",
          icon: <CaseSensitive />,
          path: "/tools/case-converter"
        }
      ]
    },
    {
      title: "Other Utilities",
      tools: [
        { 
          title: "QR Code Generator", 
          description: "Create QR codes for various purposes",
          icon: <QrCode />,
          path: "/tools/qr-code-generator"
        },
        { 
          title: "Password Generator", 
          description: "Generate strong, secure passwords",
          icon: <Fingerprint />,
          path: "/tools/password-generator"
        }
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 -z-10"></div>
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              Free Online Tools for Everyone
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
              Convert, compress, resize, calculate, and more - all for free, with no sign-up required.
              Quick and easy tools for your everyday digital tasks.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="text-md bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                onClick={scrollToTools}
              >
                Explore Tools
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button onClick={scrollToTools} className="animate-bounce p-2">
            <ArrowDown className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section id="popular-tools" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              toolCategories[0].tools[0], // Image Compressor
              toolCategories[1].tools[0], // Merge PDF
              toolCategories[2].tools[0], // Percentage Calculator
              toolCategories[4].tools[0], // QR Code Generator
            ].map((tool, index) => (
              <ToolCard
                key={index}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                path={tool.path}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Tools Section */}
      {toolCategories.map((category, catIndex) => (
        <section key={catIndex} className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">{category.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.tools.map((tool, toolIndex) => (
                <ToolCard
                  key={toolIndex}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  path={tool.path}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose QuickConvert?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-md">
              <div className="text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Completely Free</h3>
              <p className="text-muted-foreground">All our tools are 100% free to use with no hidden costs or limitations.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-md">
              <div className="text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast & Efficient</h3>
              <p className="text-muted-foreground">Our tools are designed to be quick and efficient, saving you time on your tasks.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-md">
              <div className="text-primary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No Sign-Up Required</h3>
              <p className="text-muted-foreground">Use all our tools without creating an account or providing any personal information.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
