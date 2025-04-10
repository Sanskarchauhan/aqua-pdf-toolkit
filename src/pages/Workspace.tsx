
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import { Button } from '@/components/ui/button';
import {
  FileText, FileUp, Wand2, Layers, Pencil, ScanLine, 
  FileSignature, Lock, Camera, ArrowRight,
  Trash2, Plus, File, Sparkles, Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  getWorkspace, 
  addToWorkspace, 
  removeFromWorkspace, 
  clearWorkspace,
  WorkspaceItem 
} from '@/utils/workspaceManager';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Workspace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTool, setSelectedTool] = useState('');
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load workspace on component mount
  useEffect(() => {
    const items = getWorkspace();
    setWorkspaceItems(items);
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // We'll allow browsing but show a prompt when trying to use tools
    }
  }, [isAuthenticated]);

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
      tools: ['pdf-to-word', 'word-to-pdf', 'pdf-to-excel', 'excel-to-pdf', 'pdf-to-ppt', 'ppt-to-pdf', 'pdf-to-jpg', 'jpg-to-pdf']
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
      tools: ['edit-pdf', 'rotate-pdf']
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

  // Save to workspace
  const handleSaveToWorkspace = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save items to your workspace.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (files.length === 0) {
      toast({
        title: "No files added",
        description: "Please add at least one file to save to workspace.",
        variant: "destructive",
      });
      return;
    }
    
    addToWorkspace(files, selectedTool);
    
    // Refresh workspace items
    setWorkspaceItems(getWorkspace());
    
    // Clear the files and selected tool after saving to workspace
    setFiles([]);
    setSelectedTool('');
    
    toast({
      title: "Saved to workspace",
      description: "Your files have been saved to your workspace.",
    });
  };
  
  // Remove item from workspace
  const handleRemoveItem = (id: string) => {
    removeFromWorkspace(id);
    setWorkspaceItems(getWorkspace());
  };
  
  // Clear entire workspace
  const handleClearWorkspace = () => {
    if (workspaceItems.length === 0) return;
    
    if (confirm('Are you sure you want to clear your entire workspace? This cannot be undone.')) {
      clearWorkspace();
      setWorkspaceItems([]);
    }
  };
  
  // Process with selected tool
  const handleProcessWithTool = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to process files.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
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
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      
      // Navigate to the selected tool page with these files
      // In a real implementation, we would pass the files through state management
      // For now, we'll just redirect and use workspace functionality later
      navigate(`/tools/${selectedTool}`);
    }, 1500);
  };
  
  // Use workspace item
  const handleUseWorkspaceItem = (item: WorkspaceItem) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use workspace items.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (item.toolId) {
      // Navigate to the tool page
      navigate(`/tools/${item.toolId}`);
    } else {
      // Set the files but no tool selected
      setFiles(item.files);
      setSelectedTool('');
      
      toast({
        title: "Files loaded from workspace",
        description: "Please select a tool to process these files.",
      });
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Get tool name in presentable format
  const getToolDisplayName = (toolId: string) => {
    return toolId
      .replace(/-/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Your Workspace</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Upload your files and select a tool to get started
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - File uploader */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-xl font-medium mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                Upload Files
              </h2>
              <FileUploader onFilesAdded={handleFilesAdded} className="mb-4" />
              
              {files.length > 0 && (
                <div className="text-center mt-6 flex justify-center gap-4">
                  <Button 
                    onClick={handleProcessWithTool} 
                    className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Process Files
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleSaveToWorkspace}
                    className="gap-2"
                    disabled={isProcessing}
                  >
                    <Plus className="h-4 w-4" />
                    Save to Workspace
                  </Button>
                </div>
              )}
            </div>
            
            {/* Workspace items */}
            {workspaceItems.length > 0 && (
              <div className="bg-card border rounded-lg p-6 mt-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium flex items-center">
                    <File className="h-5 w-5 mr-2 text-primary" />
                    Your Workspace
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearWorkspace}
                    className="text-xs h-8"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {workspaceItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="border rounded-md p-4 flex justify-between items-center hover:border-primary/30 transition-all card-hover-effect"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <File className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {item.files.length} {item.files.length === 1 ? 'file' : 'files'}
                            {item.toolId ? ` - ${getToolDisplayName(item.toolId)}` : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Added on {formatDate(item.dateAdded)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="h-8 bg-gradient-to-r from-primary to-accent hover:opacity-90" 
                          onClick={() => handleUseWorkspaceItem(item)}
                        >
                          Use
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Tool selection */}
          <div>
            <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
              <h2 className="text-xl font-medium mb-4 flex items-center">
                <Wand2 className="h-5 w-5 mr-2 text-primary" />
                Select Tool
              </h2>
              
              <Tabs defaultValue="recent">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
                  <TabsTrigger value="all" className="flex-1">All Tools</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent" className="space-y-2">
                  {/* Recent/featured tools */}
                  {['compress-pdf', 'merge-pdf', 'pdf-to-word', 'pdf-to-excel', 'rotate-pdf'].map(toolId => (
                    <Button
                      key={toolId}
                      variant={selectedTool === toolId ? "default" : "outline"}
                      className={`w-full justify-start ${selectedTool === toolId ? 'bg-gradient-to-r from-primary to-accent' : ''}`}
                      onClick={() => handleToolSelect(toolId)}
                    >
                      {toolId === 'compress-pdf' && <FileUp className="h-4 w-4 mr-2" />}
                      {toolId === 'merge-pdf' && <Layers className="h-4 w-4 mr-2" />}
                      {toolId === 'pdf-to-word' && <FileText className="h-4 w-4 mr-2" />}
                      {toolId === 'pdf-to-excel' && <FileText className="h-4 w-4 mr-2" />}
                      {toolId === 'rotate-pdf' && <FileText className="h-4 w-4 mr-2" />}
                      
                      {getToolDisplayName(toolId)}
                    </Button>
                  ))}
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="space-y-6">
                    {toolCategories.map(category => (
                      <div key={category.id} className="animate-fade-in">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                          <category.icon className="h-4 w-4" />
                          {category.name}
                        </div>
                        <div className="space-y-1">
                          {category.tools.map(toolId => (
                            <Button
                              key={toolId}
                              variant={selectedTool === toolId ? "default" : "outline"}
                              className={`w-full justify-start text-sm h-8 ${selectedTool === toolId ? 'bg-gradient-to-r from-primary to-accent' : ''}`}
                              onClick={() => handleToolSelect(toolId)}
                            >
                              {getToolDisplayName(toolId)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              {user && (
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Workspace;
