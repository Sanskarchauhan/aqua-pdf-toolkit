
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FileText, FileUp, FilePlus, Layers, FileCheck, FileSearch, 
  ScanLine, ShieldCheck, Pencil, Search, FileSignature,
  Lock, Unlock, Edit, Settings, Camera, Compress
} from 'lucide-react';

// Tool interface
interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  available: boolean;
}

// Tool category interface
interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

// Categories
const categories: Category[] = [
  {
    id: 'compress',
    name: 'Compress',
    description: 'Reduce file size while maintaining quality',
    icon: FileUp
  },
  {
    id: 'convert',
    name: 'Convert',
    description: 'Transform PDFs to and from other formats',
    icon: FileText
  },
  {
    id: 'organize',
    name: 'Organize',
    description: 'Rearrange and optimize your PDFs',
    icon: Layers
  },
  {
    id: 'edit',
    name: 'View & Edit',
    description: 'Make changes to your PDF documents',
    icon: Pencil
  },
  {
    id: 'ocr',
    name: 'OCR',
    description: 'Extract text from scanned documents',
    icon: ScanLine
  },
  {
    id: 'sign',
    name: 'Sign',
    description: 'Add electronic signatures to PDFs',
    icon: FileSignature
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Protect and secure your PDF documents',
    icon: Lock
  },
  {
    id: 'scan',
    name: 'Scan',
    description: 'Scan documents to PDF',
    icon: Camera
  }
];

// All tools
const allTools: Tool[] = [
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size without losing quality',
    icon: Compress,
    category: 'compress',
    available: true
  },
  {
    id: 'pdf-converter',
    name: 'PDF Converter',
    description: 'Convert files to and from PDF format',
    icon: FileText,
    category: 'convert',
    available: false
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Word documents to PDF',
    icon: FileText,
    category: 'convert',
    available: false
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF',
    icon: FileText,
    category: 'convert',
    available: false
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF',
    description: 'Convert PowerPoint presentations to PDF',
    icon: FileText,
    category: 'convert',
    available: false
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images to PDF',
    icon: FileText,
    category: 'convert',
    available: false
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF to editable Word documents',
    icon: FileText,
    category: 'convert',
    available: false
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Convert PDF to Excel spreadsheets',
    icon: FileText,
    category: 'convert',
    available: false
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PPT',
    description: 'Convert PDF to PowerPoint presentations',
    icon: FileText,
    category: 'convert',
    available: false
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert PDF to JPG images',
    icon: FileText,
    category: 'convert',
    available: false
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDFs',
    description: 'Combine multiple PDFs into one document',
    icon: Layers,
    category: 'organize',
    available: false
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Split PDFs into multiple documents',
    icon: FilePlus,
    category: 'organize',
    available: false
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages to the correct orientation',
    icon: Settings,
    category: 'organize',
    available: false
  },
  {
    id: 'delete-pages',
    name: 'Delete PDF Pages',
    description: 'Remove pages from PDF documents',
    icon: Edit,
    category: 'organize',
    available: false
  },
  {
    id: 'extract-pages',
    name: 'Extract PDF Pages',
    description: 'Extract specific pages from PDF documents',
    icon: FilePlus,
    category: 'organize',
    available: false
  },
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    description: 'Edit text and annotations in your PDF files',
    icon: Pencil,
    category: 'edit',
    available: true
  },
  {
    id: 'annotate-pdf',
    name: 'Annotate PDF',
    description: 'Add comments and annotations to your PDFs',
    icon: Pencil,
    category: 'edit',
    available: false
  },
  {
    id: 'pdf-reader',
    name: 'PDF Reader',
    description: 'View and read PDF documents online',
    icon: FileText,
    category: 'edit',
    available: false
  },
  {
    id: 'add-page-numbers',
    name: 'Add Page Numbers',
    description: 'Add page numbers to your PDF documents',
    icon: Edit,
    category: 'edit',
    available: false
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF',
    description: 'Crop pages in PDF documents',
    icon: Edit,
    category: 'edit',
    available: false
  },
  {
    id: 'pdf-ocr',
    name: 'PDF OCR',
    description: 'Convert scanned PDFs to editable text',
    icon: ScanLine,
    category: 'ocr',
    available: true
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Add your signature to PDF documents',
    icon: FileSignature,
    category: 'sign',
    available: false
  },
  {
    id: 'request-signature',
    name: 'Request Signatures',
    description: 'Request signatures from others',
    icon: FileSignature,
    category: 'sign',
    available: false
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove password protection from PDFs',
    icon: Unlock,
    category: 'security',
    available: true
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Add password protection to PDFs',
    icon: Lock,
    category: 'security',
    available: false
  },
  {
    id: 'pdf-scanner',
    name: 'PDF Scanner',
    description: 'Scan documents to PDF using camera',
    icon: Camera,
    category: 'scan',
    available: false
  }
];

const Tools = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tools by search query
  const filteredTools = searchQuery
    ? allTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allTools;

  // Group tools by category
  const toolsByCategory = categories.map(category => {
    const tools = filteredTools.filter(tool => tool.category === category.id);
    return {
      ...category,
      tools
    };
  }).filter(category => category.tools.length > 0);

  // Handle tool click
  const handleToolClick = (toolId: string, available: boolean) => {
    if (available) {
      navigate(`/tools/${toolId}`);
    } else {
      // For unavailable tools, show a toast or navigate to a coming soon page
      // For now, we'll just log
      console.log(`Tool ${toolId} is coming soon!`);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">All PDF Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to work with PDFs in one place. Select a tool to get started.
          </p>
          
          {/* Search bar */}
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search for a tool..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Tool categories */}
        <div className="space-y-12">
          {toolsByCategory.map(category => (
            <div key={category.id} id={category.id} className="tool-category scroll-mt-20">
              <div className="flex items-center mb-4">
                <category.icon className="h-6 w-6 mr-2 text-primary" />
                <h2 className="text-2xl font-semibold">{category.name}</h2>
              </div>
              <p className="text-muted-foreground mb-6">{category.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.tools.map(tool => (
                  <Button
                    key={tool.id}
                    variant={tool.available ? "outline" : "secondary"}
                    className={`h-auto flex items-start p-4 justify-start text-left ${!tool.available ? 'opacity-70' : ''}`}
                    onClick={() => handleToolClick(tool.id, tool.available)}
                  >
                    <tool.icon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${tool.available ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <div className="font-medium mb-1">
                        {tool.name}
                        {!tool.available && <span className="ml-2 text-xs bg-secondary-foreground/20 py-0.5 px-1.5 rounded text-secondary-foreground">Coming Soon</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{tool.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Tools;
