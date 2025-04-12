
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  FileText, FileUp, FilePlus, ScanLine, ShieldCheck, Layers, Pencil, 
  Star, Check, FileSearch, Download, FileOutput, ChevronRight, 
  FileSpreadsheet, FileCog, Users, Laptop, ArrowRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedCard from '@/components/animation/AnimatedCard';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';

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
      
      {/* Hero Section with Modern Design */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] dark:opacity-[0.1]"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                All-in-one PDF Solution
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                Make Your PDFs <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent animate-gradient">Work For You</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Transform, convert, edit and optimize your PDFs with our powerful yet simple tools. No software to install, 100% online.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 font-medium" asChild>
                  <Link to="/tools">
                    Get Started - Free <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5" asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
              
              <div className="mt-6 lg:mt-8 flex items-center text-muted-foreground justify-center lg:justify-start">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">No registration required for basic tools</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-2xl transform rotate-6"></div>
              <img 
                src="/placeholder.svg" 
                alt="AquaPDF Dashboard" 
                className="rounded-xl shadow-2xl relative z-10 border border-slate-200 dark:border-slate-700"
              />
              
              <div className="absolute -bottom-6 -left-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex items-center gap-3 animate-float">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">PDF processed successfully</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="mb-4 font-medium">Trusted by thousands worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="opacity-80 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                  <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                  <span className="ml-2 text-sm font-medium">4.8/5 (2000+ reviews)</span>
                </div>
              </div>
              <div className="h-6 w-px bg-border"></div>
              <div className="opacity-80 hover:opacity-100 transition-all flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium">100% Secure & Private</span>
              </div>
              <div className="h-6 w-px bg-border"></div>
              <div className="opacity-80 hover:opacity-100 transition-all flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium">5M+ Monthly Users</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Preview Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-3">
              Popular Tools
            </span>
            <h2 className="text-3xl font-bold mb-3">Everything You Need for PDFs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of powerful tools to handle all your PDF needs in seconds.
              No installation, no registration required.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {featuredTools.map((toolId, index) => {
              const tool = findToolById(toolId);
              if (!tool) return null;
              
              return (
                <motion.div 
                  key={tool.id}
                  variants={itemVariants}
                  className="group"
                >
                  <AnimatedCard 
                    className="h-full p-6 hover:shadow-lg transition-all hover:border-primary/40 relative overflow-hidden" 
                    delay={index * 0.1}
                  >
                    <Link 
                      to={`/tools/${toolId}`}
                      className="flex flex-col h-full"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 z-0"></div>
                      <div className="bg-primary/10 p-3 rounded-full mb-4 w-14 h-14 flex items-center justify-center relative z-10">
                        <tool.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                      <p className="text-muted-foreground mb-4 flex-grow">{tool.description}</p>
                      <div className="flex items-center text-primary mt-auto font-medium">
                        <span>Try it now</span>
                        <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </AnimatedCard>
                </motion.div>
              );
            })}
          </motion.div>
          
          <div className="text-center mt-10">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
              <Link to="/tools">View All PDF Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-3">
              Simple & Fast
            </span>
            <h2 className="text-3xl font-bold mb-3">How AquaPDF Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your PDF tasks done in three simple steps - no technical knowledge required.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 overflow-hidden">
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg font-bold">1</div>
                <h3 className="text-xl font-bold mb-3">Upload Your Files</h3>
                <p className="text-muted-foreground">
                  Simply drag & drop your PDF files into our secure platform. Your files stay private and are automatically deleted after processing.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-lg font-bold">2</div>
                <h3 className="text-xl font-bold mb-3">Select Your Tool</h3>
                <p className="text-muted-foreground">
                  Choose from our wide range of professional PDF tools. Convert, compress, edit, merge, split or perform OCR with a single click.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 overflow-hidden">
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-lg font-bold">3</div>
                <h3 className="text-xl font-bold mb-3">Download Result</h3>
                <p className="text-muted-foreground">
                  Get your processed PDF instantly. Our powerful cloud-based processing ensures high-quality results every time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-3">
              Comprehensive
            </span>
            <h2 className="text-3xl font-bold mb-3">Explore PDF Tools by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the right tool for any PDF task, organized by category for easy access
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="group"
              >
                <AnimatedCard className="h-full transition-all duration-300 group-hover:border-primary/40 hover:shadow-lg" delay={index * 0.1}>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2.5 rounded-lg">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{category.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-5">{category.description}</p>
                    <ul className="space-y-3 mb-5">
                      {category.tools.slice(0, 3).map(tool => (
                        <li key={tool.id}>
                          <Link 
                            to={`/tools/${tool.id}`}
                            className="flex items-center text-sm hover:text-primary transition-colors"
                          >
                            <tool.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                      {category.tools.length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          +{category.tools.length - 3} more tools
                        </li>
                      )}
                    </ul>
                    <div className="pt-4 border-t border-border">
                      <Button variant="ghost" size="sm" asChild className="w-full text-primary hover:bg-primary/5 font-medium">
                        <Link to={`/tools#${category.id}`} className="flex items-center justify-center">
                          View All {category.title} Tools
                          <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
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
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-3">
              Why AquaPDF
            </span>
            <h2 className="text-3xl font-bold mb-3">The AquaPDF Advantage</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our toolkit is designed to make working with PDFs simple, efficient, and accessible to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-border/50 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 hover:shadow-lg transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Files processed securely in your browser and automatically deleted after processing. We never see your data.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border/50 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 hover:shadow-lg transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Perfect Format Support</h3>
                <p className="text-muted-foreground">
                  Convert between PDF and popular formats like Word, Excel, PowerPoint, and images while maintaining precise formatting.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border/50 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 hover:shadow-lg transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4 w-16 h-16 flex items-center justify-center">
                  <Laptop className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Works Everywhere</h3>
                <p className="text-muted-foreground">
                  Use our tools on any device - desktop, tablet, or mobile. No software to install, just a browser is all you need.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-3">
              Testimonials
            </span>
            <h2 className="text-3xl font-bold mb-3">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who trust AquaPDF for their document needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedCard className="p-6 border border-border/50 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 hover:shadow-lg transition-all">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="mb-4 italic">"AquaPDF saved me so much time converting my bank statements to Excel. The OCR feature is incredibly accurate and maintained all my data!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  ST
                </div>
                <div className="ml-3">
                  <p className="font-medium">Sarah T.</p>
                  <p className="text-sm text-muted-foreground">Financial Analyst</p>
                </div>
              </div>
            </AnimatedCard>
            
            <AnimatedCard className="p-6 border border-primary/20 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 hover:shadow-lg transition-all" delay={0.1}>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="mb-4 italic">"The form filling tools are perfect for my business. No more printing and scanning documents! Everything is digital and professional."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  MR
                </div>
                <div className="ml-3">
                  <p className="font-medium">Mark R.</p>
                  <p className="text-sm text-muted-foreground">Small Business Owner</p>
                </div>
              </div>
            </AnimatedCard>
            
            <AnimatedCard className="p-6 border border-border/50 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50 hover:shadow-lg transition-all" delay={0.2}>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="mb-4 italic">"I use the PDF merger daily for my research papers. It's incredibly fast and maintains all the formatting perfectly. A must-have tool!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  LM
                </div>
                <div className="ml-3">
                  <p className="font-medium">Dr. Lisa M.</p>
                  <p className="text-sm text-muted-foreground">University Professor</p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-500/90"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your PDF Workflow?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-xl mx-auto">
              Join millions of users who save time with AquaPDF. Start using our tools for free today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-medium" asChild>
                <Link to="/tools">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 border-2" asChild>
                <Link to="/signup">Create Free Account</Link>
              </Button>
            </div>
            <p className="mt-6 text-white/80 text-sm">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Index;
