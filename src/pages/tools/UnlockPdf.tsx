
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Unlock, Lock, FileText, Download } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import PDFViewer from '@/components/shared/PDFViewer';
import PasswordDialog from '@/components/shared/PasswordDialog';
import { processFile } from '@/utils/fileProcessing';
import { useAuth } from '@/contexts/AuthContext';
import PremiumModal from '@/components/shared/PremiumModal';

const UnlockPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, hasAvailableTrials, increaseTrialCount } = useAuth();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultFile(null);
  };

  const handleUnlockClick = () => {
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

    setShowPasswordDialog(true);
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!file) return;
    
    setShowPasswordDialog(false);
    setIsProcessing(true);
    
    try {
      // Increase trial count
      increaseTrialCount();
      
      // Process file with the password
      const result = await processFile('unlock-pdf', [file], { password });
      setResultFile(result);
      
      toast({
        title: "PDF Successfully Unlocked",
        description: "Your PDF has been unlocked and is now ready to download.",
      });
    } catch (error) {
      console.error('Error unlocking PDF:', error);
      toast({
        title: "Failed to unlock PDF",
        description: "The password may be incorrect or the file is not protected.",
        variant: "destructive",
      });
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
        title: "Download Started",
        description: "Your unlocked PDF is downloading.",
      });
    }
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
            Remove password protection from your PDF documents safely and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 border shadow-sm">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Upload Protected PDF
                </h2>
                <FileUploader 
                  onFileSelect={handleFileSelect}
                  acceptedFileTypes={{
                    'application/pdf': ['.pdf']
                  }}
                  maxFileSizeMB={10}
                />
              </div>

              {file && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Selected File: {file.name}</h3>
                  <Button 
                    onClick={handleUnlockClick} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <span className="mr-2">Processing...</span>
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
                      className="w-full mt-4"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Unlocked PDF
                    </Button>
                  )}
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">About PDF Unlocking</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Removes user password protection from PDF files</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Your PDF is processed securely on our servers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Files and passwords are never stored</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Maximum file size: 10 MB</span>
                  </li>
                </ul>
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
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-900/30">
                <div className="flex items-center">
                  <Unlock className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <h3 className="font-medium text-green-800 dark:text-green-300">PDF Successfully Unlocked</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  Your PDF is now unlocked and ready to download.
                </p>
              </div>
            )}
          </div>
        </div>

        <PasswordDialog
          open={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
          onSubmit={handlePasswordSubmit}
          title="Enter PDF Password"
          description="Enter the password for this protected PDF document."
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
