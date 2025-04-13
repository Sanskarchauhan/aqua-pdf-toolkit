
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Compress, FileText, Download } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import PDFViewer from '@/components/shared/PDFViewer';
import { processFile } from '@/utils/fileProcessing';
import { useAuth } from '@/contexts/AuthContext';
import PremiumModal from '@/components/shared/PremiumModal';

const CompressPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [compressionRate, setCompressionRate] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, hasAvailableTrials, increaseTrialCount } = useAuth();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultFile(null); // Reset result when new file is selected
    setCompressionRate(null);
  };

  const handleCompress = async () => {
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
      navigate('/login', { state: { from: '/tools/compress-pdf' } });
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
      
      // Process the file with compression
      const result = await processFile('compress-pdf', [file]);
      setResultFile(result);
      
      // Calculate compression rate
      const originalSize = file.size;
      const compressedSize = result.size;
      const reduction = originalSize - compressedSize;
      const percentReduction = ((reduction / originalSize) * 100).toFixed(1);
      setCompressionRate(percentReduction);
      
      toast({
        title: "PDF Successfully Compressed",
        description: `Reduced file size by ${percentReduction}%`,
      });
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "Compression failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
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
        description: "Your compressed PDF is downloading.",
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <Compress className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Compress PDF</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Reduce the file size of your PDF documents while maintaining quality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 border shadow-sm">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Upload PDF
                </h2>
                <FileUploader 
                  onFileSelect={handleFileSelect}
                  acceptedFileTypes={{
                    'application/pdf': ['.pdf']
                  }}
                  maxFileSizeMB={20}
                />
              </div>

              {file && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Selected File: {file.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Original size: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button 
                    onClick={handleCompress} 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <span className="mr-2">Compressing...</span>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      'Compress PDF'
                    )}
                  </Button>
                  
                  {resultFile && (
                    <div className="mt-4 space-y-3">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-900/30">
                        <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">Compression Results</h4>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          New size: {(resultFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {compressionRate && (
                          <p className="text-sm text-green-700 dark:text-green-400">
                            Reduced by: {compressionRate}%
                          </p>
                        )}
                      </div>
                      <Button 
                        onClick={handleDownload}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Compressed PDF
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">About PDF Compression</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Reduces file size while preserving quality</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Perfect for email attachments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Optimizes file for web sharing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>Maximum file size: 20 MB</span>
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
          </div>
        </div>
        
        <PremiumModal 
          open={showPremiumModal} 
          onClose={() => setShowPremiumModal(false)}
        />
      </div>

      <Footer />
    </>
  );
};

export default CompressPdf;
