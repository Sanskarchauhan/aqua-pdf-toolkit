
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import { Button } from '@/components/ui/button';
import {
  FileText, FileUp, Wand2, Layers, Pencil, ScanLine, 
  FileSignature, Lock, Camera, ArrowRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Workspace = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTool, setSelectedTool] = useState('');

  // Handle file upload
  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    toast({
      title: "Files added successfully",
      description: `${newFiles.length} ${newFiles.length === 1 ? 'file' : 'files'} added to your workspace.`,
    });
  };

  // Tool categories for quick access
  const toolCategories = [
    {
      id: 'compress',
      name: 'Compress',
      icon: FileUp,
      tools: ['compress-pdf']
    },
    {
      id: 'convert',
      name: 'Convert',
      icon: FileText,
      tools: ['pdf-converter', 'word-to-pdf', 'pdf-to-word']
    },
    {
      id: 'ai-tools',
      name: 'AI Tools',
      icon: Wand2,
      tools: ['chat-pdf', 'summarize-pdf']
    },
    {
      id: 'organize',
      name: 'Organize',
      icon: Layers,
      tools: ['merge-pdf', 'split-pdf']
    },
    {
      id: 'edit',
      name: 'Edit',
      icon: Pencil,
      tools: ['edit-pdf', 'annotate-pdf']
    },
    {
      id: 'ocr',
      name: 'OCR',
      icon: ScanLine,
      tools: ['pdf-ocr']
    },
    {
      id: 'sign',
      name: 'Sign',
      icon: FileSignature,
      tools: ['sign-pdf', 'request-signature']
    },
    {
      id: 'security',
      name: 'Security',
      icon: Lock,
      tools: ['unlock-pdf', 'protect-pdf']
    },
    {
      id: 'scan',
      name: 'Scan',
      icon: Camera,
      tools: ['pdf-scanner']
    }
  ];

  // Select a tool
  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    toast({
      title: "Tool selected",
      description: "Please configure tool settings and click Process to continue.",
    });
  };

  // Process files with selected tool
  const handleProcess = () => {
    if (!selectedTool) {
      toast({
        title: "No tool selected",
        description: "Please select a tool first.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No files added",
        description: "Please add at least one file.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing started",
      description: "Your files are being processed. This may take a moment.",
    });

    // Simulate processing
    setTimeout(() => {
      toast({
        title: "Processing complete",
        description: "Your files have been processed successfully.",
      });
    }, 2000);
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Workspace</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Upload your files and select a tool to get started
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - File uploader */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Upload Files</h2>
              <FileUploader onFilesAdded={handleFilesAdded} className="mb-4" />
              
              {files.length > 0 && (
                <div className="text-center mt-6">
                  <Button onClick={handleProcess} className="gap-2">
                    Process Files
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Tool selection */}
          <div>
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Select Tool</h2>
              
              <Tabs defaultValue="recent">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
                  <TabsTrigger value="all" className="flex-1">All Tools</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent" className="space-y-2">
                  {/* Recent/featured tools */}
                  {['compress-pdf', 'merge-pdf', 'pdf-to-word', 'chat-pdf'].map(toolId => (
                    <Button
                      key={toolId}
                      variant={selectedTool === toolId ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleToolSelect(toolId)}
                    >
                      {toolId === 'compress-pdf' && <FileUp className="h-4 w-4 mr-2" />}
                      {toolId === 'merge-pdf' && <Layers className="h-4 w-4 mr-2" />}
                      {toolId === 'pdf-to-word' && <FileText className="h-4 w-4 mr-2" />}
                      {toolId === 'chat-pdf' && <Wand2 className="h-4 w-4 mr-2" />}
                      
                      {toolId === 'compress-pdf' && 'Compress PDF'}
                      {toolId === 'merge-pdf' && 'Merge PDFs'}
                      {toolId === 'pdf-to-word' && 'PDF to Word'}
                      {toolId === 'chat-pdf' && 'Chat with PDF'}
                    </Button>
                  ))}
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="space-y-4">
                    {toolCategories.map(category => (
                      <div key={category.id}>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                          <category.icon className="h-4 w-4" />
                          {category.name}
                        </div>
                        <div className="space-y-1">
                          {category.tools.map(toolId => (
                            <Button
                              key={toolId}
                              variant={selectedTool === toolId ? "default" : "outline"}
                              className="w-full justify-start text-sm h-8"
                              onClick={() => handleToolSelect(toolId)}
                            >
                              {toolId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Workspace;
