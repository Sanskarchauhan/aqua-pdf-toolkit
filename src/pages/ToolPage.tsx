import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Download, FileText, FileUp, Layers, 
  ScanLine, Pencil, Lock, Unlock, Camera, FileSignature
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ToolDebug from '@/components/debug/ToolDebug';
import ToolCard from '@/components/tools/ToolCard';
import PasswordDialog from '@/components/shared/PasswordDialog';
import SignatureCanvas from '@/components/shared/SignatureCanvas';
import { processFile, downloadFile } from '@/utils/fileProcessing';
import PDFViewer from '@/components/shared/PDFViewer';

// Tool info type
interface ToolInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  acceptedFormats: Record<string, string[]>;
  maxFiles: number;
  requiresPassword?: boolean;
  requiresSignature?: boolean;
}

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // File and processing states
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [resultFile, setResultFile] = useState<File | null>(null);
  
  // UI states
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [signatureData, setSignatureData] = useState<string>('');
  
  // Enable debug mode with key combination (Ctrl+Alt+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        setShowDebug(prev => !prev);
        toast({
          title: showDebug ? "Debug mode disabled" : "Debug mode enabled",
          description: "Press Ctrl+Alt+D to toggle debug panel",
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDebug, toast]);
  
  // Handle file upload
  const handleFilesAdded = (newFiles: File[]) => {
    // Using setTimeout to avoid React state update during render
    setTimeout(() => {
      setFiles(prevFiles => {
        const updatedFiles = [...prevFiles, ...newFiles];
        toast({
          title: "Files added successfully",
          description: `${newFiles.length} ${newFiles.length === 1 ? 'file' : 'files'} added.`,
        });
        return updatedFiles;
      });
    }, 0);
  };
  
  // Process files
  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add at least one file to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if we need to show the password dialog
    if (toolInfo?.requiresPassword && !password) {
      setShowPasswordDialog(true);
      return;
    }
    
    // Check if we need to show the signature dialog
    if (toolInfo?.requiresSignature && !signatureData) {
      setShowSignatureDialog(true);
      return;
    }
    
    setProcessing(true);
    setProgress(0);
    
    // Simulate processing with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Process asynchronously after the progress is complete
          setTimeout(async () => {
            try {
              const options = toolInfo?.requiresPassword ? { password } : 
                          toolInfo?.requiresSignature ? { signature: signatureData } : undefined;
              
              const result = await processFile(toolId || '', files, options);
              setResultFile(result);
              setProcessing(false);
              setCompleted(true);
              
              toast({
                title: "Processing complete",
                description: "Your files have been processed successfully.",
              });
            } catch (error) {
              setProcessing(false);
              console.error("Processing error:", error);
              
              toast({
                title: "Processing failed",
                description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant: "destructive",
              });
            }
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 100); // Faster processing for demo
  };
  
  // Password handlers
  const handlePasswordConfirm = (enteredPassword: string) => {
    setPassword(enteredPassword);
    setShowPasswordDialog(false);
    handleProcess();
  };
  
  // Signature handlers
  const handleSignatureSave = (data: string) => {
    setSignatureData(data);
    setShowSignatureDialog(false);
    handleProcess();
  };
  
  // Reset the tool
  const handleReset = () => {
    setFiles([]);
    setCompleted(false);
    setProgress(0);
    setResultFile(null);
    setPassword('');
    setSignatureData('');
  };
  
  // Handle download of result file
  const handleDownload = () => {
    if (resultFile) {
      downloadFile(resultFile);
      
      toast({
        title: "Download started",
        description: `Your file ${resultFile.name} is downloading.`,
      });
    }
  };
  
  // Tool definitions
  const tools: Record<string, ToolInfo> = {
    'compress-pdf': {
      id: 'compress-pdf',
      name: 'Compress PDF',
      description: 'Reduce the size of your PDF files while maintaining quality.',
      icon: FileUp,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 5,
    },
    'merge-pdf': {
      id: 'merge-pdf',
      name: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document.',
      icon: Layers,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 20,
    },
    'pdf-to-word': {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files.',
      icon: FileText,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 3,
    },
    'word-to-pdf': {
      id: 'word-to-pdf',
      name: 'Word to PDF',
      description: 'Convert Word documents to PDF format.',
      icon: FileText,
      acceptedFormats: { 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/msword': ['.doc'] 
      },
      maxFiles: 3,
    },
    'pdf-to-excel': {
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      description: 'Convert PDF to Excel spreadsheets.',
      icon: FileText,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
    },
    'excel-to-pdf': {
      id: 'excel-to-pdf',
      name: 'Excel to PDF',
      description: 'Convert Excel spreadsheets to PDF.',
      icon: FileText,
      acceptedFormats: { 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls'] 
      },
      maxFiles: 3,
    },
    'pdf-to-jpg': {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      description: 'Convert PDF to JPG images.',
      icon: FileText,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
    },
    'jpg-to-pdf': {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      description: 'Convert JPG images to PDF.',
      icon: FileText,
      acceptedFormats: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
      maxFiles: 20,
    },
    'pdf-to-ppt': {
      id: 'pdf-to-ppt',
      name: 'PDF to PPT',
      description: 'Convert PDF to PowerPoint presentations.',
      icon: FileText,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
    },
    'ppt-to-pdf': {
      id: 'ppt-to-pdf',
      name: 'PPT to PDF',
      description: 'Convert PowerPoint presentations to PDF.',
      icon: FileText,
      acceptedFormats: { 
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'application/vnd.ms-powerpoint': ['.ppt'] 
      },
      maxFiles: 3,
    },
    'split-pdf': {
      id: 'split-pdf',
      name: 'Split PDF',
      description: 'Split PDFs into multiple documents.',
      icon: FileText,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
    },
    'rotate-pdf': {
      id: 'rotate-pdf',
      name: 'Rotate PDF',
      description: 'Rotate PDF pages to the correct orientation.',
      icon: FileText,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
    },
    'pdf-ocr': {
      id: 'pdf-ocr',
      name: 'PDF OCR',
      description: 'Convert scanned PDFs to searchable, editable text.',
      icon: ScanLine,
      acceptedFormats: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
      maxFiles: 2,
    },
    'edit-pdf': {
      id: 'edit-pdf',
      name: 'Edit PDF',
      description: 'Edit text, images, and more in your PDF documents.',
      icon: Pencil,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
    },
    'unlock-pdf': {
      id: 'unlock-pdf',
      name: 'Unlock PDF',
      description: 'Remove password protection from your PDF files.',
      icon: Unlock,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
      requiresPassword: true,
    },
    'protect-pdf': {
      id: 'protect-pdf',
      name: 'Protect PDF',
      description: 'Add password protection to your PDF documents.',
      icon: Lock,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
      requiresPassword: true,
    },
    'sign-pdf': {
      id: 'sign-pdf',
      name: 'Sign PDF',
      description: 'Add your electronic signature to PDF documents.',
      icon: FileSignature,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
      requiresSignature: true,
    },
    'pdf-scanner': {
      id: 'pdf-scanner',
      name: 'PDF Scanner',
      description: 'Scan documents to PDF using camera.',
      icon: Camera,
      acceptedFormats: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
      maxFiles: 10,
    },
  };
  
  // Get current tool info
  const toolInfo = toolId ? tools[toolId] : null;
  
  if (!toolInfo) {
    // Handle unknown tool
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <p className="mb-8">The tool you're looking for doesn't exist or is not yet implemented.</p>
          <Button onClick={() => navigate('/tools')} className="bg-primary hover:bg-primary/90">View All Tools</Button>
        </div>
        <Footer />
      </>
    );
  }
  
  // Helper to get an icon component
  const getIcon = () => {
    const Icon = toolInfo.icon;
    return <Icon className="h-6 w-6 text-primary" />;
  };
  
  return (
    <>
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <Button 
          variant="outline" 
          className="mb-6 group transition-all duration-300 hover:border-primary"
          onClick={() => navigate('/tools')}
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          Back to All Tools
        </Button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{toolInfo.name}</h1>
            <p className="text-muted-foreground">{toolInfo.description}</p>
          </div>
        </div>
        
        <ToolCard
          toolId={toolId || ''}
          files={files}
          processing={processing}
          progress={progress}
          completed={completed}
          resultFile={resultFile}
          onProcess={handleProcess}
          onDownload={handleDownload}
          onReset={handleReset}
        >
          <FileUploader
            onFilesAdded={handleFilesAdded}
            accept={toolInfo.acceptedFormats}
            maxFiles={toolInfo.maxFiles}
            className="mb-4"
          />
          
          {files.length > 0 && files[0].type.includes('pdf') && !processing && (
            <div className="mt-6 border rounded-xl overflow-hidden bg-muted/20">
              <PDFViewer file={files[0]} className="max-h-[400px]" />
            </div>
          )}
        </ToolCard>
        
        {/* Password Dialog */}
        <PasswordDialog
          isOpen={showPasswordDialog}
          title={toolId === 'unlock-pdf' ? 'Enter PDF Password' : 'Set PDF Password'}
          description={
            toolId === 'unlock-pdf' 
              ? 'Enter the password to unlock this PDF file.'
              : 'Set a password to protect your PDF file.'
          }
          onClose={() => setShowPasswordDialog(false)}
          onConfirm={handlePasswordConfirm}
        />
        
        {/* Signature Dialog */}
        <SignatureCanvas
          isOpen={showSignatureDialog}
          onClose={() => setShowSignatureDialog(false)}
          onSave={handleSignatureSave}
        />
        
        {showDebug && (
          <ToolDebug 
            toolId={toolId || ''}
            files={files}
            processing={processing}
            progress={progress}
            completed={completed}
            onTest={handleProcess}
          />
        )}
        
        {/* How it works section */}
        <div className="mt-12 bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-xl border shadow-sm">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <span className="font-medium">1</span>
              </div>
              <h3 className="font-medium mb-2">Upload Your Files</h3>
              <p className="text-muted-foreground">
                Select or drag and drop your {toolInfo.maxFiles > 1 ? 'files' : 'file'} into the upload area.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl border shadow-sm">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <span className="font-medium">2</span>
              </div>
              <h3 className="font-medium mb-2">Process</h3>
              <p className="text-muted-foreground">
                Click the Process button and our system will handle the conversion.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl border shadow-sm">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <span className="font-medium">3</span>
              </div>
              <h3 className="font-medium mb-2">Download Result</h3>
              <p className="text-muted-foreground">
                Once processing is complete, preview and download your {toolId?.includes('merge') ? 'merged file' : 'processed files'}.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ToolPage;
