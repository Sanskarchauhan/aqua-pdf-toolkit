
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
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, hasAvailableTrials, increaseTrialCount } = useAuth();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultFile(null); // Reset result when new file is selected
  };
  
  const handleFilesAdded = (files: File[]) => {
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUnlock = async () => {
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
    
    setIsProcessing(true);
    setShowPasswordDialog(false);
    
    try {
      // Increase trial count - only counts if user is not subscribed
      increaseTrialCount();
      
      // Process the file with password
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
        description: "The password may be incorrect or the PDF cannot be unlocked.",
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
        title: "Download started",
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
            Remove password protection from your PDF files.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 border shadow-sm">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-primary" />
                  Upload Password Protected PDF
                </h2>
                <FileUploader 
                  onFileSelect={handleFileSelect}
                  onFilesAdded={handleFilesAdded}
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
                    onClick={handleUnlock} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <span className="mr-2">Processing...</span>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      'Unlock PDF'
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
                <h3 className="font-medium mb-2">About PDF Unlocking</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Removes password protection from PDFs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>You must know the original password</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>We don't store your passwords or PDF content</span>
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
              <div className="mt-4 p-4 bg-primary/5 rounded-md border">
                <h3 className="font-medium mb-2 flex items-center">
                  <Unlock className="h-4 w-4 mr-2 text-primary" />
                  PDF Unlocked Successfully
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your PDF is now unlocked and no longer requires a password to open or edit.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <PasswordDialog
          open={showPasswordDialog}
          title="Enter PDF Password"
          description="Please enter the password for this PDF file to unlock it."
          onClose={() => setShowPasswordDialog(false)}
          onConfirm={handlePasswordSubmit}
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
