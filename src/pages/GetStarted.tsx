
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, Layers, FileText, ScanLine, FileSignature, Lock } from 'lucide-react';

const GetStarted = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('convert');
  
  const categories = [
    { 
      id: 'convert', 
      name: 'Convert',
      icon: <FileText className="h-5 w-5 mr-2" />,
      description: 'Transform your documents between PDF and other formats',
      tools: [
        { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF documents to editable Word files' },
        { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word documents to PDF format' },
        { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Convert PDF to Excel spreadsheets' },
        { id: 'pdf-to-ppt', name: 'PDF to PPT', description: 'Convert PDF to PowerPoint presentations' }
      ]
    },
    { 
      id: 'organize', 
      name: 'Organize',
      icon: <Layers className="h-5 w-5 mr-2" />,
      description: 'Combine, split, and rearrange your PDF documents',
      tools: [
        { id: 'merge-pdf', name: 'Merge PDFs', description: 'Combine multiple PDFs into one document' },
        { id: 'split-pdf', name: 'Split PDF', description: 'Split PDFs into multiple documents' },
        { id: 'delete-pages', name: 'Delete Pages', description: 'Remove pages from PDF documents' },
        { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages to the correct orientation' }
      ]
    },
    { 
      id: 'modify', 
      name: 'Modify',
      icon: <FileUp className="h-5 w-5 mr-2" />,
      description: 'Edit, compress, and enhance your PDF documents',
      tools: [
        { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size without losing quality' },
        { id: 'edit-pdf', name: 'Edit PDF', description: 'Edit text and images in your PDF files' },
        { id: 'annotate-pdf', name: 'Annotate PDF', description: 'Add comments and annotations to your PDFs' },
        { id: 'add-page-numbers', name: 'Add Page Numbers', description: 'Add page numbers to your PDF documents' }
      ]
    },
    { 
      id: 'security', 
      name: 'Security',
      icon: <Lock className="h-5 w-5 mr-2" />,
      description: 'Protect and secure your PDF documents',
      tools: [
        { id: 'protect-pdf', name: 'Protect PDF', description: 'Add password protection to your PDF documents' },
        { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove password protection from your PDF files' },
        { id: 'sign-pdf', name: 'Sign PDF', description: 'Add your electronic signature to PDF documents' }
      ]
    },
    { 
      id: 'advanced', 
      name: 'Advanced',
      icon: <ScanLine className="h-5 w-5 mr-2" />,
      description: 'Use advanced features for your PDF documents',
      tools: [
        { id: 'pdf-ocr', name: 'PDF OCR', description: 'Convert scanned PDFs to searchable, editable text' },
        { id: 'pdf-scanner', name: 'PDF Scanner', description: 'Scan documents to PDF using your camera' }
      ]
    }
  ];

  const quickStartSteps = [
    {
      title: "Upload Your Files",
      description: "Choose the tool you need and upload your files. We support various formats including PDF, Word, Excel, PowerPoint, and images.",
      icon: <FileUp className="h-8 w-8" />
    },
    {
      title: "Process Your Files",
      description: "Our system will automatically process your files based on the selected tool. Wait a few moments while the processing completes.",
      icon: <Layers className="h-8 w-8" />
    },
    {
      title: "Download Results",
      description: "Once processing is complete, download your files. They are ready to use right away!",
      icon: <FileText className="h-8 w-8" />
    },
    {
      title: "Create an Account (Optional)",
      description: "For additional benefits like saved history, cloud storage, and premium features, create a free account.",
      icon: <FileSignature className="h-8 w-8" />
    }
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to AquaPDF!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's get you started with our easy-to-use PDF tools. Follow this guide to make the most of our platform.
          </p>
        </div>

        <Tabs defaultValue="quick-start" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="quick-start">Quick Start Guide</TabsTrigger>
            <TabsTrigger value="popular-tools">Popular Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick-start" className="animate-in fade-in-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStartSteps.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      <span className="inline-block bg-primary/10 w-6 h-6 rounded-full text-primary text-sm mr-2">
                        {index + 1}
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <Button size="lg" asChild>
                <Link to="/tools">Browse All Tools</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="popular-tools" className="animate-in fade-in-50">
            <div className="flex overflow-x-auto pb-4 space-x-4 mb-6">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center whitespace-nowrap"
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
            
            {categories.map(category => (
              <div 
                key={category.id} 
                className={activeCategory === category.id ? "block animate-in fade-in-50" : "hidden"}
              >
                <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.tools.map(tool => (
                    <Button
                      key={tool.id}
                      variant="outline"
                      className="h-auto flex flex-col items-start p-4 text-left"
                      onClick={() => navigate(`/tools/${tool.id}`)}
                    >
                      <div className="font-medium mb-1">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.description}</div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="bg-muted/30 rounded-lg p-8 mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Need More Help?</h2>
            <p className="text-muted-foreground">
              Check out our resources to learn more about our PDF tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Watch step-by-step guides on how to use our most popular tools.
                </p>
                <Button variant="outline" className="w-full">
                  Watch Videos
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">FAQ</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find answers to the most commonly asked questions about our tools.
                </p>
                <Button variant="outline" className="w-full">
                  View FAQ
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Still have questions? Our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GetStarted;
