
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Pencil, FileText, Download, SaveIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import PDFEditor from '@/components/shared/PDFEditor';
import { processFile } from '@/utils/fileProcessing';
import { useAuth } from '@/contexts/AuthContext';
import PremiumModal from '@/components/shared/PremiumModal';

const EditPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, hasAvailableTrials, increaseTrialCount } = useAuth();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultFile(null); // Reset result when new file is selected
  };

  const handleSaveEdits = async (edits: Array<{type: string, content: string, page: number, x: number, y: number}>) => {
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
      navigate('/login', { state: { from: '/tools/edit-pdf' } });
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
      
      // Process the file with edits
      const result = await processFile('edit-pdf', [file], { edits });
      setResultFile(result);
      
      toast({
        title: "PDF Successfully Edited",
        description: "Your PDF has been updated with your edits.",
      });
    } catch (error) {
      console.error('Edit error:', error);
      toast({
        title: "Edit failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePages = async (pageNumbers: number[]) => {
    try {
      if (!file || !isAuthenticated || !hasAvailableTrials) return;
      
      setIsProcessing(true);
      increaseTrialCount();
      
      const result = await processFile('delete-pages', [file], { pages: pageNumbers });
      setFile(result); // Update the current file with pages deleted
      
      toast({
        title: "Pages Deleted",
        description: `${pageNumbers.length} page(s) successfully deleted.`,
      });
    } catch (error) {
      toast({
        title: "Failed to delete pages",
        description: "An error occurred while deleting the pages.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractPages = async (pageNumbers: number[]) => {
    try {
      if (!file || !isAuthenticated || !hasAvailableTrials) return;
      
      setIsProcessing(true);
      increaseTrialCount();
      
      const result = await processFile('extract-pages', [file], { pages: pageNumbers });
      setResultFile(result);
      
      toast({
        title: "Pages Extracted",
        description: `${pageNumbers.length} page(s) successfully extracted.`,
      });
    } catch (error) {
      toast({
        title: "Failed to extract pages",
        description: "An error occurred while extracting the pages.",
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
        description: "Your edited PDF is downloading.",
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <Pencil className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Edit PDF</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Add text, annotations, delete or extract pages from your PDF documents.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="p-6 border shadow-sm mb-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Upload PDF to Edit
                </h2>
                <FileUploader 
                  onFileSelect={handleFileSelect}
                  acceptedFileTypes={['application/pdf']}
                  maxFileSizeMB={10}
                />
              </div>

              {resultFile && (
                <Button 
                  onClick={handleDownload}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Edited PDF
                </Button>
              )}
            </div>
          </Card>

          {file && (
            <Card className="p-6 border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">PDF Editor</h2>
              <div className="mb-4 text-muted-foreground text-sm">
                Use the tools below to edit your PDF. You can add text, delete pages, or extract specific pages.
              </div>
              <PDFEditor 
                file={file}
                onSave={handleSaveEdits} 
                onDeletePages={handleDeletePages}
                onExtractPages={handleExtractPages}
              />
              {isProcessing && (
                <div className="mt-4 p-4 bg-background border rounded-md flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Processing your request...</span>
                </div>
              )}
            </Card>
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

export default EditPdf;
