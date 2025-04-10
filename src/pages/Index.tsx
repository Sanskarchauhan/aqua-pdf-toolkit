
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  FileText, FileUp, FilePlus, ScanLine, ShieldCheck, Layers, Pencil
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
  }[];
}

// Tool categories data
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
        description: 'Reduce PDF file size without losing quality'
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
        description: 'Convert files to and from PDF format'
      },
      { 
        id: 'word-to-pdf', 
        name: 'Word to PDF', 
        icon: FileText,
        description: 'Convert Word documents to PDF'
      },
      { 
        id: 'pdf-to-word', 
        name: 'PDF to Word', 
        icon: FileText,
        description: 'Convert PDF to editable Word documents'
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
        description: 'Combine multiple PDFs into one document'
      },
      { 
        id: 'split-pdf', 
        name: 'Split PDF', 
        icon: FilePlus,
        description: 'Split PDFs into multiple documents'
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
        description: 'Edit text and images in your PDF files'
      },
      { 
        id: 'annotate-pdf', 
        name: 'Annotate PDF', 
        icon: Pencil,
        description: 'Add comments and annotations to your PDFs'
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
        description: 'Convert scanned PDFs to editable text'
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

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            All Your PDF Tools in One Place
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Edit, convert, compress, e-sign PDFs and much more with our all-in-one PDF toolkit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/tools">Explore Tools</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Most Popular Tools</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {featuredTools.map(toolId => {
              const tool = findToolById(toolId);
              if (!tool) return null;
              
              return (
                <Link 
                  to={`/tools/${toolId}`} 
                  key={tool.id}
                  className="tool-card"
                >
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <tool.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{tool.name}</h3>
                  <p className="text-muted-foreground text-center">{tool.description}</p>
                </Link>
              );
            })}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild>
              <Link to="/tools">View All Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">All Tool Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
              <div key={category.id} className="bg-card p-6 rounded-lg shadow-sm">
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
                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <Link to={`/tools#${category.id}`}>
                      View All {category.title} Tools
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose AquaPDF</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Our toolkit is designed to make working with PDFs simple, efficient, and accessible to everyone.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <ShieldCheck className="feature-icon" />
              <h3 className="text-xl font-medium mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your files are processed securely and automatically deleted after processing.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <FileText className="feature-icon" />
              <h3 className="text-xl font-medium mb-2">Wide Format Support</h3>
              <p className="text-muted-foreground">
                Convert between PDF and popular formats like Word, Excel, PowerPoint, and images.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <Layers className="feature-icon" />
              <h3 className="text-xl font-medium mb-2">All-in-One Solution</h3>
              <p className="text-muted-foreground">
                Over 20 PDF tools to handle all your document needs in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Working with Your PDFs Now</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            No registration required — just upload your files and get started!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link to="/tools">Get Started for Free</Link>
            </Button>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
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
