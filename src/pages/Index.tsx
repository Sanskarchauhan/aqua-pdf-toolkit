
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  FileText, FileUp, FilePlus, ScanLine, ShieldCheck, Layers, Pencil, Star, 
  Check, FileSearch, Download, FileOutput, FileSpreadsheet, FileCog
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedCard from '@/components/animation/AnimatedCard';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Tool category interface
interface ToolCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tools: {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    tagline: string; // SEO friendly tagline
  }[];
}

// Tool categories data with SEO taglines
const categories: ToolCategory[] = [
  {
    id: 'compress',
    title: 'Compress',
    description: 'Reduce file size while maintaining quality',
    icon: FileUp,
    tools: [
      { 
        id: 'compress-pdf', 
        name: 'Compress PDF', 
        icon: FileUp,
        description: 'Reduce PDF file size without losing quality',
        tagline: 'Compress PDF files online - Reduce PDF size without losing quality'
      },
    ],
  },
  {
    id: 'convert',
    title: 'Convert',
    description: 'Transform PDFs to and from other formats',
    icon: FileText,
    tools: [
      { 
        id: 'pdf-converter', 
        name: 'PDF Converter', 
        icon: FileText,
        description: 'Convert files to and from PDF format',
        tagline: 'Convert any document to PDF online - Fast, free & secure'
      },
      { 
        id: 'word-to-pdf', 
        name: 'Word to PDF', 
        icon: FileText,
        description: 'Convert Word documents to PDF',
        tagline: 'Convert Word to PDF online - Maintain perfect formatting'
      },
      { 
        id: 'pdf-to-word', 
        name: 'PDF to Word', 
        icon: FileText,
        description: 'Convert PDF to editable Word documents',
        tagline: 'Convert PDF to editable Word documents - Keep text & layout intact'
      },
      { 
        id: 'pdf-to-excel', 
        name: 'PDF to Excel', 
        icon: FileSpreadsheet,
        description: 'Convert bank statements and tables to Excel',
        tagline: 'Convert bank statement PDF to Excel - Fast & accurate table extraction'
      },
    ],
  },
  {
    id: 'organize',
    title: 'Organize',
    description: 'Rearrange and optimize your PDFs',
    icon: Layers,
    tools: [
      { 
        id: 'merge-pdf', 
        name: 'Merge PDFs', 
        icon: Layers,
        description: 'Combine multiple PDFs into one document',
        tagline: 'Merge PDF files online - Combine multiple PDFs into one document'
      },
      { 
        id: 'split-pdf', 
        name: 'Split PDF', 
        icon: FilePlus,
        description: 'Split PDFs into multiple documents',
        tagline: 'Split PDF into separate files - Extract pages easily'
      },
    ],
  },
  {
    id: 'edit',
    title: 'View & Edit',
    description: 'Make changes to your PDF documents',
    icon: Pencil,
    tools: [
      { 
        id: 'edit-pdf', 
        name: 'Edit PDF', 
        icon: Pencil,
        description: 'Edit text and images in your PDF files',
        tagline: 'PDF editor online - Edit text, images and annotations for free'
      },
      { 
        id: 'annotate-pdf', 
        name: 'Annotate PDF', 
        icon: Pencil,
        description: 'Add comments and annotations to your PDFs',
        tagline: 'Annotate PDF online - Add comments, highlights and notes easily'
      },
      { 
        id: 'pdf-form-filler', 
        name: 'Fill PDF Forms', 
        icon: FileCog,
        description: 'Fill out PDF forms digitally',
        tagline: 'Fill PDF forms online - Complete, sign and save PDF forms easily'
      },
    ],
  },
  {
    id: 'ocr',
    title: 'OCR',
    description: 'Extract text from scanned documents',
    icon: ScanLine,
    tools: [
      { 
        id: 'pdf-ocr', 
        name: 'PDF OCR', 
        icon: ScanLine,
        description: 'Convert scanned PDFs to editable text',
        tagline: 'Convert scanned PDF to text - Extract text from images with OCR'
      },
      { 
        id: 'searchable-pdf', 
        name: 'Searchable PDF', 
        icon: FileSearch,
        description: 'Make your scanned PDFs searchable',
        tagline: 'Make scanned PDFs searchable - Add text layer to scanned documents'
      },
    ],
  },
];

const Index = () => {
  const featuredTools = [
    'compress-pdf', 
    'merge-pdf', 
    'pdf-converter', 
    'edit-pdf', 
    'pdf-ocr',
    'pdf-to-word'
  ];

  // Helper function to find a tool by ID
  const findToolById = (id: string) => {
    for (const category of categories) {
      const tool = category.tools.find(tool => tool.id === id);
      if (tool) return tool;
    }
    return null;
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>AquaPDF - All-in-One PDF Editor, Converter & Tools Online</title>
        <meta name="description" content="Edit, convert, compress, and e-sign PDFs online. Free PDF tools including compress PDF, merge PDF, convert PDF to Word, Excel and more. Try AquaPDF toolkit now!" />
        <meta property="og:title" content="AquaPDF - All-in-One PDF Editor & Converter" />
        <meta property="og:description" content="Free online PDF editor, converter, compressor and more. Edit PDF text, convert to Word, merge files, and add signatures." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aquapdf.com" />
        <meta property="og:image" content="https://aquapdf.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AquaPDF - PDF Tools Made Easy" />
        <meta name="twitter:description" content="Free online PDF editor, converter and compressor. No installation needed." />
        <meta name="twitter:image" content="https://aquapdf.com/twitter-image.jpg" />
        <meta name="keywords" content="pdf editor online, convert pdf to word, compress pdf, merge pdf files, pdf to excel, bank statement to excel, scanned pdf to text, pdf converter, split pdf, pdf tools" />
      </Helmet>
      
      <Navbar />
      
      {/* Hero Section with Animated Gradient */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-primary/20 animate-gradient"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        
        <div className="container relative mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              All Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">PDF Tools</span> in One Place
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground md:text-2xl"
          >
            Edit, convert, compress, e-sign PDFs and much more with our all-in-one PDF toolkit. Free, secure, and works on any device.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="gradient-button" asChild>
              <Link to="/tools">Get Started - It's Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5" asChild>
              <Link to="/signup">Create Free Account</Link>
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 text-center text-muted-foreground"
          >
            <p className="mb-2 font-medium">Trusted by thousands of users</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                <Star className="h-5 w-5 inline mr-1 text-yellow-500" />
                <Star className="h-5 w-5 inline mr-1 text-yellow-500" />
                <Star className="h-5 w-5 inline mr-1 text-yellow-500" />
                <Star className="h-5 w-5 inline mr-1 text-yellow-500" />
                <Star className="h-5 w-5 inline text-yellow-500" />
                <span className="ml-2 text-sm font-medium">4.8/5 (2000+ reviews)</span>
              </div>
              <div className="h-6 w-px bg-border"></div>
              <div className="opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                <span className="text-sm font-medium">100% Secure & Private</span>
              </div>
              <div className="h-6 w-px bg-border"></div>
              <div className="opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                <span className="text-sm font-medium">5M+ Monthly Users</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Most Popular PDF Tools</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Choose from our most popular tools to handle your PDF needs in seconds.
            No installation, no registration required.
          </p>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featuredTools.map((toolId, index) => {
              const tool = findToolById(toolId);
              if (!tool) return null;
              
              return (
                <motion.div 
                  key={tool.id}
                  variants={itemVariants}
                >
                  <AnimatedCard className="h-full p-6 hover:border-primary/40 transition-all" delay={index * 0.1}>
                    <Link 
                      to={`/tools/${toolId}`}
                      className="flex flex-col items-center h-full"
                    >
                      <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <tool.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">{tool.name}</h3>
                      <p className="text-muted-foreground text-center mb-4">{tool.description}</p>
                      <p className="text-sm text-primary mt-auto">Try it now →</p>
                    </Link>
                  </AnimatedCard>
                </motion.div>
              );
            })}
          </motion.div>
          
          <div className="text-center mt-10">
            <Button asChild>
              <Link to="/tools">View All PDF Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Taglines Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">What Can You Do With AquaPDF?</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Everything you need to work with PDF files in one place
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.flatMap(category => 
              category.tools.slice(0, 2).map(tool => (
                <Link 
                  key={tool.id}
                  to={`/tools/${tool.id}`}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-background transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-md mt-1">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{tool.name}</h3>
                    <p className="text-muted-foreground text-sm">{tool.tagline}</p>
                  </div>
                </Link>
              ))
            ).slice(0, 10)}
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Explore All PDF Tools</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Find the right tool for any PDF task, organized by category
          </p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="group"
              >
                <AnimatedCard className="h-full transition-all duration-300 group-hover:border-primary/40" delay={index * 0.1}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium">{category.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <ul className="space-y-2">
                      {category.tools.map(tool => (
                        <li key={tool.id}>
                          <Link 
                            to={`/tools/${tool.id}`}
                            className="flex items-center text-sm hover:text-primary transition-colors"
                          >
                            <tool.icon className="h-4 w-4 mr-2" />
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="ghost" size="sm" asChild className="w-full group-hover:text-primary">
                        <Link to={`/tools#${category.id}`}>
                          View All {category.title} Tools
                        </Link>
                      </Button>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose AquaPDF</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Our toolkit is designed to make working with PDFs simple, efficient, and accessible to everyone.
          </p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your files are processed securely in your browser and automatically deleted after processing.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Wide Format Support</h3>
              <p className="text-muted-foreground">
                Convert between PDF and popular formats like Word, Excel, PowerPoint, and images with perfect formatting.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Free to Use</h3>
              <p className="text-muted-foreground">
                Start using our basic tools for free with no registration. Premium features available for power users.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust AquaPDF for their document needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedCard className="p-6">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="mb-4">"AquaPDF saved me so much time converting my bank statements to Excel. The OCR feature is incredibly accurate!"</p>
              <p className="font-medium">Sarah T.</p>
              <p className="text-sm text-muted-foreground">Financial Analyst</p>
            </AnimatedCard>
            
            <AnimatedCard className="p-6" delay={0.1}>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="mb-4">"The form filling and e-signature tools are perfect for my business. No more printing and scanning documents!"</p>
              <p className="font-medium">Mark R.</p>
              <p className="text-sm text-muted-foreground">Small Business Owner</p>
            </AnimatedCard>
            
            <AnimatedCard className="p-6" delay={0.2}>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="mb-4">"I use the PDF merger daily for my research papers. It's incredibly fast and maintains all the formatting perfectly."</p>
              <p className="font-medium">Dr. Lisa M.</p>
              <p className="text-sm text-muted-foreground">University Professor</p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Start Working with Your PDFs Now</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            No registration required — just upload your files and get started!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/tools">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/signup">Create an Account</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Index;
