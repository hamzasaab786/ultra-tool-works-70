
import React from "react";

interface ToolSEOContentProps {
  toolName: string;
}

const ToolSEOContent: React.FC<ToolSEOContentProps> = ({ toolName }) => {
  const getToolContent = (tool: string) => {
    const contents: { [key: string]: any } = {
      "Image Compressor": {
        title: "Professional Image Compression Tool - Reduce File Size Without Quality Loss",
        description: "Our advanced image compressor uses cutting-edge algorithms to reduce image file sizes by up to 80% while maintaining visual quality. Perfect for web optimization, email attachments, and storage management. Supports JPG, PNG, WebP, and GIF formats with batch processing capabilities.",
        benefits: [
          "Reduce image file size for faster website loading",
          "Optimize images for social media platforms",
          "Save storage space on devices and cloud services",
          "Improve SEO rankings with faster page speeds",
          "Maintain image quality with smart compression"
        ],
        techSpecs: "Uses lossy and lossless compression algorithms, supports batch processing up to 20 images, maximum file size 10MB per image",
        localUse: "Ideal for Pakistani businesses, bloggers, e-commerce stores, photographers, and digital marketers who need to optimize images for better online performance and reduced data usage."
      },
      "Merge PDF": {
        title: "Professional PDF Merger - Combine Multiple PDF Files Into One Document",
        description: "Merge multiple PDF documents into a single file with our secure online PDF merger. Maintain document quality, preserve formatting, and arrange pages in custom order. Essential for business reports, academic papers, and document management.",
        benefits: [
          "Combine multiple PDFs into one organized document",
          "Maintain original formatting and quality",
          "Arrange pages in custom order before merging",
          "Reduce file clutter and improve organization",
          "Create comprehensive reports and presentations"
        ],
        techSpecs: "Supports PDF files up to 100MB each, unlimited merging, preserves metadata and bookmarks, secure client-side processing",
        localUse: "Perfect for Pakistani students preparing thesis documents, businesses creating comprehensive reports, legal professionals combining case files, and government offices organizing official documents."
      },
      "Percentage Calculator": {
        title: "Advanced Percentage Calculator - Calculate Percentages, Increases, and Decreases",
        description: "Calculate percentages, percentage increases, decreases, and find what percentage one number is of another. Essential for business calculations, academic work, financial planning, and everyday math problems with step-by-step solutions.",
        benefits: [
          "Calculate percentage increases and decreases",
          "Find what percentage one number is of another",
          "Determine original values from percentages",
          "Business markup and discount calculations",
          "Academic grade and score calculations"
        ],
        techSpecs: "Supports decimal calculations, percentage points, compound calculations, and provides detailed step-by-step solutions",
        localUse: "Essential for Pakistani students solving math problems, business owners calculating profits and discounts, shopkeepers determining sale prices, and financial planners working with investment returns."
      },
      "QR Code Generator": {
        title: "Free QR Code Generator - Create Custom QR Codes for Any Purpose",
        description: "Generate high-quality QR codes for URLs, text, contact information, WiFi passwords, and more. Customize colors, sizes, and download in various formats. Perfect for marketing campaigns, business cards, and digital connectivity.",
        benefits: [
          "Create QR codes for websites, contact info, and text",
          "Customize colors and design to match branding",
          "Generate WiFi password QR codes",
          "Download in multiple formats and sizes",
          "Track engagement and usage analytics"
        ],
        techSpecs: "Supports URL, text, email, phone, SMS, WiFi, and vCard formats, customizable colors and sizes, SVG and PNG export options",
        localUse: "Ideal for Pakistani restaurants creating digital menus, shops enabling mobile payments, event organizers sharing information, and businesses connecting customers to social media and websites."
      },
      "Word Counter": {
        title: "Professional Word Counter Tool - Count Words, Characters, and Reading Time",
        description: "Count words, characters, paragraphs, and estimate reading time for any text. Essential for writers, students, bloggers, and content creators who need to meet specific word count requirements and optimize content length.",
        benefits: [
          "Real-time word and character counting",
          "Estimate reading and speaking time",
          "Track paragraphs and sentence count",
          "Meet assignment and article requirements",
          "Optimize content for SEO and readability"
        ],
        techSpecs: "Real-time counting, supports multiple languages, calculates average reading speed, tracks various text metrics",
        localUse: "Perfect for Pakistani students writing essays and assignments, bloggers creating content, journalists meeting article requirements, and social media managers optimizing posts for platforms."
      },
      "Background Remover": {
        title: "AI-Powered Background Remover - Remove Image Backgrounds Instantly",
        description: "Remove backgrounds from images automatically using advanced AI technology. Perfect for product photos, profile pictures, and graphic design. Get professional results without complex software or design skills.",
        benefits: [
          "Automatically detect and remove backgrounds",
          "Create transparent PNG images",
          "Perfect for e-commerce product photos",
          "Professional results without design skills",
          "Save time on manual editing"
        ],
        techSpecs: "AI-powered background detection, supports JPG and PNG formats, automatic edge refinement, transparent PNG output",
        localUse: "Essential for Pakistani e-commerce sellers creating product catalogs, job seekers preparing professional photos, graphic designers working on projects, and social media content creators."
      },
      "Password Generator": {
        title: "Secure Password Generator - Create Strong, Unbreakable Passwords",
        description: "Generate strong, secure passwords with customizable length and character sets. Include uppercase, lowercase, numbers, and special characters to create unbreakable passwords for maximum security.",
        benefits: [
          "Create strong, secure passwords instantly",
          "Customize length and character requirements",
          "Include special characters for extra security",
          "Generate multiple passwords at once",
          "Protect accounts from cyber attacks"
        ],
        techSpecs: "Supports 4-100 character passwords, customizable character sets, cryptographically secure generation, no password storage",
        localUse: "Crucial for Pakistani professionals securing business accounts, students protecting academic portals, online shoppers safeguarding payment information, and anyone concerned about cybersecurity."
      },
      "Unit Converter": {
        title: "Universal Unit Converter - Convert Length, Weight, Temperature, and More",
        description: "Convert between different units of measurement including length, weight, temperature, volume, and area. Essential for students, engineers, cooks, and anyone working with international measurements.",
        benefits: [
          "Convert length, weight, and temperature units",
          "Support for metric and imperial systems",
          "Accurate conversions for scientific work",
          "Essential for international business",
          "Educational tool for learning measurements"
        ],
        techSpecs: "Supports metric, imperial, and scientific units, high-precision calculations, multiple unit categories",
        localUse: "Valuable for Pakistani engineers working with international standards, students learning different measurement systems, cooks following international recipes, and businesses dealing with global suppliers."
      },
      "Currency Converter": {
        title: "Real-Time Currency Converter - Convert PKR to USD, EUR, and More",
        description: "Convert between major world currencies with up-to-date exchange rates. Essential for international business, travel planning, online shopping, and financial calculations with Pakistani Rupee support.",
        benefits: [
          "Real-time exchange rates for accurate conversions",
          "Support for Pakistani Rupee and major currencies",
          "Essential for international business",
          "Plan travel budgets effectively",
          "Calculate online purchase costs"
        ],
        techSpecs: "Real-time exchange rates, supports 50+ currencies, historical rate tracking, API-powered updates",
        localUse: "Essential for Pakistani businesses importing/exporting goods, students planning foreign education, travelers budgeting international trips, and online shoppers calculating actual costs in PKR."
      },
      "Base64 Tool": {
        title: "Base64 Encoder/Decoder - Secure Data Encoding and Decoding",
        description: "Encode and decode Base64 strings for secure data transmission and storage. Essential for developers, system administrators, and anyone working with data encoding for web applications and APIs.",
        benefits: [
          "Secure data encoding and decoding",
          "Essential for web development",
          "API data transmission",
          "Image and file encoding",
          "Data obfuscation and security"
        ],
        techSpecs: "Supports text and file encoding, real-time conversion, handles large data sets, secure client-side processing",
        localUse: "Valuable for Pakistani developers building web applications, IT professionals managing data transmission, cybersecurity experts encoding sensitive information, and students learning data encoding concepts."
      }
    };

    return contents[tool] || {
      title: `${tool} - Professional Online Tool`,
      description: `Use our free ${tool} for all your digital needs.`,
      benefits: [],
      techSpecs: "",
      localUse: ""
    };
  };

  const content = getToolContent(toolName);

  return (
    <div className="mt-12 space-y-8">
      {/* Main SEO Content */}
      <section className="glassmorphism rounded-2xl p-8 border border-gray-200/50">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{content.title}</h2>
        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          {content.description}
        </p>
        
        {content.benefits.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Benefits:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {content.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Technical Specifications */}
      {content.techSpecs && (
        <section className="glassmorphism rounded-2xl p-8 border border-gray-200/50">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Technical Specifications</h3>
          <p className="text-gray-700 leading-relaxed">{content.techSpecs}</p>
        </section>
      )}

      {/* Local SEO Content */}
      {content.localUse && (
        <section className="glassmorphism rounded-2xl p-8 border border-gray-200/50">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Perfect for Pakistani Users</h3>
          <p className="text-gray-700 leading-relaxed">{content.localUse}</p>
        </section>
      )}

      {/* FAQ Section */}
      <section className="glassmorphism rounded-2xl p-8 border border-gray-200/50">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Is this {toolName} free to use?</h4>
            <p className="text-gray-700">Yes, our {toolName} is completely free with no hidden costs or registration required. Use it unlimited times.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Is my data secure?</h4>
            <p className="text-gray-700">Absolutely. All processing happens in your browser, and we don't store any of your files or data on our servers.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Do I need to install any software?</h4>
            <p className="text-gray-700">No installation required. Our {toolName} works directly in your web browser on any device.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToolSEOContent;
