
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Scissors, FileText, Download } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import PDFEditor from '@/components/shared/PDFEditor';
import { processFile } from '@/utils/fileProcessing';
import { useAuth } from '@/contexts/AuthContext';
import PremiumModal from '@/components/shared/PremiumModal';
import { motion } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Set workerSrc to a CDN URL that's more reliable than unpkg
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ExtractPages = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, hasAvailableTrials, increaseTrialCount } = useAuth();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultFile(null);
    setSelectedPages([]);
    
    // Create object URL for the PDF file
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);
    }
  };

  const handleExtractPages = async (pageNumbers: number[]) => {
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
      navigate('/login', { state: { from: '/tools/extract-pages' } });
      return;
    }

    if (!hasAvailableTrials) {
      setShowPremiumModal(true);
      return;
    }

    setIsProcessing(true);
    setSelectedPages(pageNumbers);
    
    try {
      // Increase trial count - only counts if user is not subscribed
      increaseTrialCount();
      
      // Process the file to extract pages
      const result = await processFile('extract-pages', [file], { pages: pageNumbers });
      setResultFile(result);
      
      // Create object URL for the result file
      if (result) {
        const url = URL.createObjectURL(result);
        setFileUrl(url);
      }
      
      toast({
        title: "Pages Successfully Extracted",
        description: `${pageNumbers.length} page(s) have been extracted from your PDF.`,
      });
    } catch (error) {
      console.error('Extract pages error:', error);
      toast({
        title: "Operation failed",
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
        description: "Your extracted PDF is downloading.",
      });
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const prevPage = () => setPageNumber(page => (page <= 1 ? 1 : page - 1));
  const nextPage = () => setPageNumber(page => (page >= (numPages || 1) ? (numPages || 1) : page + 1));

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <Scissors className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Extract PDF Pages</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Extract specific pages from your PDF documents to create a new file.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Card className="p-6 border shadow-sm mb-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Upload PDF
                </h2>
                <FileUploader 
                  acceptedFileTypes={{
                    'application/pdf': ['.pdf']
                  }}
                  maxFiles={1}
                  onFilesAdded={(files) => handleFileSelect(files[0])}
                />
              </div>

              {resultFile && (
                <div className="space-y-4">
                  <Button 
                    onClick={handleDownload}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Extracted PDF
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full"
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                  
                  {showPreview && fileUrl && (
                    <div className="border rounded-md overflow-hidden p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={prevPage} 
                          disabled={pageNumber <= 1}
                        >
                          Previous
                        </Button>
                        <span>Page {pageNumber} of {numPages || '?'}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={nextPage} 
                          disabled={!numPages || pageNumber >= numPages}
                        >
                          Next
                        </Button>
                      </div>
                      <div className="flex justify-center bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                        <Document
                          file={fileUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          loading={<div className="flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}
                          error={<div className="text-center text-red-500">Failed to load PDF. Please try again.</div>}
                          externalLinkTarget="_blank"
                        >
                          <Page 
                            pageNumber={pageNumber} 
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="mx-auto"
                          />
                        </Document>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {file && !resultFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Select Pages to Extract</h2>
                <div className="mb-4 text-muted-foreground text-sm">
                  Use the tools below to select which pages you want to extract from your PDF.
                </div>
                <PDFEditor 
                  file={file}
                  onExtractPages={handleExtractPages}
                />
                {isProcessing && (
                  <div className="mt-4 p-4 bg-background border rounded-md flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Processing your request...</span>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
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

export default ExtractPages;
