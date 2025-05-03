
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedCard from '@/components/animation/AnimatedCard';
import AnimatedPage from '@/components/animation/AnimatedPage';
import { 
  ArrowRight, FileUp, Layers, FileText, ScanLine, Pencil, Lock, Unlock, 
  Camera, FileSignature 
} from 'lucide-react';

const Tools = () => {
  const navigate = useNavigate();
  
  const tools = [
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      description: 'Reduce the size of your PDF files while maintaining quality.',
      icon: FileUp,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      id: 'merge-pdf',
      name: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document.',
      icon: Layers,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files.',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      id: 'word-to-pdf',
      name: 'Word to PDF',
      description: 'Convert Word documents to PDF format.',
      icon: FileText,
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      description: 'Convert PDF tables to Excel spreadsheets.',
      icon: FileText,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      id: 'excel-to-pdf',
      name: 'Excel to PDF',
      description: 'Convert Excel spreadsheets to PDF.',
      icon: FileText,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      description: 'Convert PDF to JPG images.',
      icon: FileText,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      description: 'Convert JPG images to PDF.',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
    {
      id: 'pdf-to-ppt',
      name: 'PDF to PPT',
      description: 'Convert PDF to PowerPoint presentations.',
      icon: FileText,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    },
    {
      id: 'ppt-to-pdf',
      name: 'PPT to PDF',
      description: 'Convert PowerPoint presentations to PDF.',
      icon: FileText,
      color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    },
    {
      id: 'split-pdf',
      name: 'Split PDF',
      description: 'Split PDF into multiple documents.',
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    {
      id: 'rotate-pdf',
      name: 'Rotate PDF',
      description: 'Rotate PDF pages to the correct orientation.',
      icon: FileText,
      color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    },
    {
      id: 'pdf-ocr',
      name: 'PDF OCR',
      description: 'Convert scanned PDFs to searchable, editable text.',
      icon: ScanLine,
      color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    },
    {
      id: 'edit-pdf',
      name: 'Edit PDF',
      description: 'Edit text, images, and more in your PDF documents.',
      icon: Pencil,
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    },
    {
      id: 'unlock-pdf',
      name: 'Unlock PDF',
      description: 'Remove password protection from your PDF files.',
      icon: Unlock,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      id: 'protect-pdf',
      name: 'Protect PDF',
      description: 'Add password protection to your PDF documents.',
      icon: Lock,
      color: 'bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400',
    },
    {
      id: 'pdf-scanner',
      name: 'PDF Scanner',
      description: 'Scan documents to PDF using camera.',
      icon: Camera,
      color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
    },
    {
      id: 'delete-pages',
      name: 'Delete PDF Pages',
      description: 'Remove pages from your PDF documents.',
      icon: FileText,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    },
    {
      id: 'extract-pages',
      name: 'Extract PDF Pages',
      description: 'Extract specific pages from PDF documents.',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
  ];

  return (
    <AnimatedPage>
      <Navbar />
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All PDF Tools</h1>
          <p className="text-muted-foreground text-lg">
            Powerful tools to handle all your PDF needs, all in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <AnimatedCard key={tool.id} delay={index * 0.05}>
              <div 
                className="p-6 rounded-xl border bg-card transition-all cursor-pointer hover:shadow-md"
                onClick={() => navigate(`/tools/${tool.id}`)}
              >
                <div className={`${tool.color} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">{tool.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Use Tool <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
      <Footer />
    </AnimatedPage>
  );
};

export default Tools;
