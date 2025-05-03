import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import { Button } from '@/components/ui/button';
import AnimatedButton from '@/components/animation/AnimatedButton';
import {
  ArrowLeft, Download, FileText, FileUp, Layers, 
  ScanLine, Pencil, Lock, Unlock, Camera, FileSignature
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ToolDebug from '@/components/debug/ToolDebug';
import ToolCard from '@/components/tools/ToolCard';
import PasswordDialog from '@/components/shared/PasswordDialog';
import { processFile, downloadFile } from '@/utils/fileProcessing';
import PDFViewer from '@/components/shared/PDFViewer';
import PDFEditor from '@/components/shared/PDFEditor';
import { useAuth } from '@/contexts/AuthContext';
import PremiumModal from '@/components/shared/PremiumModal';
import AnimatedPage from '@/components/animation/AnimatedPage';
import { motion } from 'framer-motion';

interface ToolInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  acceptedFormats: Record<string, string[]>;
  maxFiles: number;
  requiresPassword?: boolean;
  isEditTool?: boolean;
  isPremium?: boolean;
}

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, increaseTrialCount, hasAvailableTrials, isAuthenticated } = useAuth();
  
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [resultFile, setResultFile] = useState<File | null>(null);
  
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [edits, setEdits] = useState<Array<{type: string, content: string, page: number, x: number, y: number}>>([]);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);
  
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
  
  const handleFilesAdded = (newFiles: File[]) => {
    // Check if we're in jpg-to-pdf tool for queue processing
    const isJpgToPdf = toolId === 'jpg-to-pdf';
    
    setTimeout(() => {
      setFiles(prevFiles => {
        // For jpg-to-pdf we want to accumulate files for batch processing
        const updatedFiles = isJpgToPdf 
          ? [...prevFiles, ...newFiles]
          : [...prevFiles, ...newFiles];
        
        toast({
          title: "Files added successfully",
          description: `${newFiles.length} ${newFiles.length === 1 ? 'file' : 'files'} added.`,
        });
        
        // For jpg-to-pdf, we have a special message about queue processing
        if (isJpgToPdf && updatedFiles.length > 1) {
          toast({
            title: "Multiple images added",
            description: "Click 'Process' when you're ready to convert all images to PDF.",
          });
        }
        
        return updatedFiles;
      });
    }, 0);
  };
  
  const handlePdfEdits = async (edits: Array<{type: string, content: string, page: number, x: number, y: number}>) => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add a file to edit.",
        variant: "destructive",
      });
      return;
    }
    
    setEdits(edits);
    handleProcess();
  };
  
  const handleDeletePages = async (pageNumbers: number[]) => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add a file to edit.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedPages(pageNumbers);
    handleProcess();
  };
  
  const handleExtractPages = async (pageNumbers: number[]) => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add a file to edit.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedPages(pageNumbers);
    handleProcess();
  };
  
  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add at least one file to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Modified: Check for premium features but don't require login for basic features
    if (toolInfo?.isPremium) {
      if (!isAuthenticated) {
        // Inform user they need to login for premium features
        toast({
          title: "Premium Feature",
          description: "This is a premium feature. You can use basic features without logging in.",
        });
        setShowLoginPrompt(true);
        return;
      } else if (!hasAvailableTrials) {
        setShowPremiumModal(true);
        return;
      }
    }
    
    if (toolInfo?.requiresPassword && !password) {
      setShowPasswordDialog(true);
      return;
    }
    
    // Increment trial count only for authenticated non-subscribed users
    if (isAuthenticated && user && !user.isSubscribed) {
      increaseTrialCount();
    }
    
    setProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          setTimeout(async () => {
            try {
              let options: any = {};
              
              if (toolInfo?.requiresPassword) {
                options.password = password;
              }
              
              if (toolId === 'delete-pages' && selectedPages.length > 0) {
                options.pages = selectedPages;
              }
              
              if (toolId === 'extract-pages' && selectedPages.length > 0) {
                options.pages = selectedPages;
              }
              
              if (toolId === 'edit-pdf' && edits.length > 0) {
                options.edits = edits;
              }
              
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
    }, 100);
  };
  
  const handlePasswordConfirm = (enteredPassword: string) => {
    setPassword(enteredPassword);
    setShowPasswordDialog(false);
    handleProcess();
  };
  
  const handleReset = () => {
    setFiles([]);
    setCompleted(false);
    setProgress(0);
    setResultFile(null);
    setPassword('');
    setSelectedPages([]);
    setEdits([]);
  };
  
  const handleDownload = () => {
    if (resultFile) {
      downloadFile(resultFile);
      
      toast({
        title: "Download started",
        description: `Your file ${resultFile.name} is downloading.`,
      });
    }
  };
  
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
      isPremium: true,
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
      isPremium: true,
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
      isPremium: true,
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
      isPremium: true,
    },
    'edit-pdf': {
      id: 'edit-pdf',
      name: 'Edit PDF',
      description: 'Edit text, images, and more in your PDF documents.',
      icon: Pencil,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
      isEditTool: true,
      isPremium: true,
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
    'pdf-scanner': {
      id: 'pdf-scanner',
      name: 'PDF Scanner',
      description: 'Scan documents to PDF using camera.',
      icon: Camera,
      acceptedFormats: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
      maxFiles: 10,
      isPremium: true,
    },
    'delete-pages': {
      id: 'delete-pages',
      name: 'Delete PDF Pages',
      description: 'Remove pages from your PDF documents.',
      icon: FileText,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
      isEditTool: true,
    },
    'extract-pages': {
      id: 'extract-pages',
      name: 'Extract PDF Pages',
      description: 'Extract specific pages from PDF documents.',
      icon: FileText,
      acceptedFormats: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
      isEditTool: true,
    },
  };
  
  const toolInfo = toolId ? tools[toolId] : null;
  
  if (!toolInfo) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <p className="mb-8">The tool you're looking for doesn't exist or is not yet implemented.</p>
          <AnimatedButton onClick={() => navigate('/tools')} className="bg-primary hover:bg-primary/90">View All Tools</AnimatedButton>
        </div>
        <Footer />
      </>
    );
  }
  
  const getIcon = () => {
    const Icon = toolInfo.icon;
    return <Icon className="h-6 w-6 text-primary" />;
  };
  
  // Check if the current tool is jpg-to-pdf for queue mode
  const isQueueModeEnabled = toolId === 'jpg-to-pdf';
  
  return (
    <AnimatedPage>
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
        
        <motion.div 
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-primary/10 p-3 rounded-full">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{toolInfo.name}</h1>
            <p className="text-muted-foreground">{toolInfo.description}</p>
          </div>
          {toolInfo.isPremium && (
            <div className="ml-auto">
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs py-1 px-2 rounded-full flex items-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3 w-3 mr-1"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                Premium Feature
              </div>
            </div>
          )}
        </motion.div>

        {/* Show login prompt for premium features if not authenticated */}
        {showLoginPrompt && (
          <div className="mb-6 p-4 border border-primary/20 bg-primary/5 rounded-lg">
            <p className="flex items-center text-sm">
              <Lock className="h-4 w-4 mr-2 text-primary" />
              This is a premium feature. 
              <Button 
                variant="link" 
                onClick={() => navigate('/login')} 
                className="px-2 h-auto"
              >
                Sign in
              </Button> 
              or 
              <Button 
                variant="link" 
                onClick={() => navigate('/signup')} 
                className="px-2 h-auto"
              >
                create an account
              </Button> 
              to continue.
            </p>
          </div>
        )}
        
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
            acceptedFileTypes={toolInfo?.acceptedFormats}
            maxFiles={toolInfo?.maxFiles || 1}
            onFilesAdded={handleFilesAdded}
            className="mb-4"
            queueMode={isQueueModeEnabled}
          />
          
          {files.length > 0 && files[0].type.includes('pdf') && !processing && (
            <motion.div 
              className="mt-6 border rounded-xl overflow-hidden bg-muted/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {toolInfo.isEditTool ? (
                <PDFEditor
                  file={files[0]}
                  onSave={handlePdfEdits}
                  onDeletePages={toolId === 'delete-pages' ? handleDeletePages : undefined}
                  onExtractPages={toolId === 'extract-pages' ? handleExtractPages : undefined}
                />
              ) : (
                <PDFViewer file={files[0]} className="max-h-[400px]" />
              )}
            </motion.div>
          )}
          
          {/* Special instructions for jpg-to-pdf */}
          {isQueueModeEnabled && files.length > 0 && (
            <motion.div
              className="mt-4 p-3 bg-primary/10 rounded-md text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="flex items-center">
                <Queue className="h-4 w-4 mr-2 text-primary" />
                <span>
                  <strong>{files.length}</strong> images are ready to be converted. 
                  Click the "Process" button to convert them all to a single PDF.
                </span>
              </p>
            </motion.div>
          )}
          
          {/* Only show trial information for authenticated users */}
          {isAuthenticated && user && !user.isSubscribed && (
            <motion.div 
              className="mt-4 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p>
                You've used {user.trialCount} of 3 free trials
                {user.trialCount >= 3 && (
                  <Button
                    variant="link"
                    className="text-primary p-0 h-auto font-normal ml-2"
                    onClick={() => navigate('/pricing')}
                  >
                    Upgrade to Premium
                  </Button>
                )}
              </p>
              <div className="w-full bg-muted/50 rounded-full h-1.5 mt-1">
                <div 
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${Math.min(100, (user.trialCount / 3) * 100)}%` }}
                ></div>
              </div>
            </motion.div>
          )}
        </ToolCard>
        
        <PasswordDialog
          open={showPasswordDialog}
          title={toolId === 'unlock-pdf' ? 'Enter PDF Password' : 'Set PDF Password'}
          description={
            toolId === 'unlock-pdf' 
              ? 'Enter the password to unlock this PDF file.'
              : 'Set a password to protect your PDF file.'
          }
          onClose={() => setShowPasswordDialog(false)}
          onConfirm={handlePasswordConfirm}
        />
        
        <PremiumModal
          open={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
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
        
        <motion.div 
          className="mt-12 bg-card border rounded-xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-background p-6 rounded-xl border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <span className="font-medium">1</span>
              </div>
              <h3 className="font-medium mb-2">Upload Your Files</h3>
              <p className="text-muted-foreground">
                Select or drag and drop your {toolInfo?.maxFiles || 1} {toolInfo?.maxFiles === 1 ? 'file' : 'files'} into the upload area.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-background p-6 rounded-xl border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <span className="font-medium">2</span>
              </div>
              <h3 className="font-medium mb-2">Process</h3>
              <p className="text-muted-foreground">
                Click the Process button and our system will handle the conversion.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-background p-6 rounded-xl border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <span className="font-medium">3</span>
              </div>
              <h3 className="font-medium mb-2">Download Result</h3>
              <p className="text-muted-foreground">
                Once processing is complete, preview and download your {toolId?.includes('merge') ? 'merged file' : 'processed files'}.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </AnimatedPage>
  );
};

export default ToolPage;
