
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Unlock, FileText, Download, Lock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import PDFViewer from '@/components/shared/PDFViewer';
import { processFile } from '@/utils/fileProcessing';
import { useAuth } from '@/contexts/AuthContext';
import PremiumModal from '@/components/shared/PremiumModal';
import PasswordDialog from '@/components/shared/PasswordDialog';

const UnlockPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, hasAvailableTrials, increaseTrialCount } = useAuth();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultFile(null); // Reset result when new file is selected
  };

  const handleProcess = async (password?: string) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file first.",
        variant: "destructive",
      });
      return;
    }

    // Check authentication and trial availability
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use this feature.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: '/tools/unlock-pdf' } });
      return;
    }

    if (!hasAvailableTrials) {
      setShowPremiumModal(true);
      return;
    }

    setIsProcessing(true);
    
    try {
      // Increase trial count - only counts if user is not subscribed
      increaseTrialCount();
      
      // Process the file with unlock
      const result = await processFile('unlock-pdf', [file], { password });
      setResultFile(result);
      
      toast({
        title: "PDF Successfully Unlocked",
        description: "Your PDF has been unlocked and is ready to download.",
      });
    } catch (error) {
      console.error('Unlock error:', error);
      toast({
        title: "Unlock failed",
        description: "The password may be incorrect or the PDF is not encrypted.",
        variant: "destructive",
      });
      // Allow the user to try again with a different password
      setPasswordDialogOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultFile) {
      const url = URL.createObjectURL(resultFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = resultFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your unlocked PDF is downloading.",
      });
    }
  };

  const handleUnlock = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = (password: string) => {
    setPasswordDialogOpen(false);
    handleProcess(password);
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <Unlock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Unlock PDF</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Remove password protection from your PDF files securely and easily.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 border shadow-sm">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Upload Password-Protected PDF
                </h2>
                <FileUploader 
                  onFileSelect={handleFileSelect}
                  acceptedFileTypes={['application/pdf']}
                  maxFileSizeMB={10}
                />
              </div>

              {file && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Selected File: {file.name}</h3>
                  <Button 
                    onClick={handleUnlock} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <span className="mr-2">Unlocking...</span>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      <>
                        <Unlock className="mr-2 h-4 w-4" />
                        Unlock PDF
                      </>
                    )}
                  </Button>
                  
                  {resultFile && (
                    <Button 
                      onClick={handleDownload}
                      variant="outline"
                      className="w-full mt-3"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Unlocked PDF
                    </Button>
                  )}
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">How to Unlock a PDF</h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-4">
                  <li>Upload your password-protected PDF file</li>
                  <li>Enter the PDF password when prompted</li>
                  <li>Click "Unlock PDF"</li>
                  <li>Download your unlocked PDF document</li>
                </ol>
                
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <div className="flex items-start">
                    <Lock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      All unlocking is done locally on your device. Your files and passwords are never sent to our servers, ensuring complete privacy and security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="border rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">PDF Preview</h2>
            {resultFile ? (
              <PDFViewer file={resultFile} />
            ) : (
              <PDFViewer file={file} />
            )}
            {resultFile && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-900">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="font-medium ml-2 text-green-800 dark:text-green-300">PDF Successfully Unlocked</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  Your PDF is now unlocked and ready for download.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <PasswordDialog 
          open={passwordDialogOpen} 
          onClose={() => setPasswordDialogOpen(false)}
          onSubmit={handlePasswordSubmit}
          title="Enter PDF Password"
          description="Enter the password required to unlock this PDF file."
        />
        
        <PremiumModal 
          open={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)}
        />
      </div>

      <Footer />
    </>
  );
};

export default UnlockPdf;
