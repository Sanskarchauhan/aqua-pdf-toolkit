
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileUp, Download } from 'lucide-react';
import FileUploader from '@/components/shared/FileUploader';
import { compressPdf, downloadFile } from '@/utils/fileProcessing';
import { useToast } from '@/hooks/use-toast';
import AnimatedPage from '@/components/animation/AnimatedPage';
import PDFViewer from '@/components/shared/PDFViewer';

const CompressPdf = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles([...files, ...newFiles]);
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload a PDF file to compress.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // Use the actual compressPdf function from utils/fileProcessing
      const compressedFile = await compressPdf(files[0]);
      
      // Set progress to 100% when done
      setProgress(100);
      setTimeout(() => {
        setResultFile(compressedFile);
        setIsProcessing(false);
        setIsCompleted(true);
        
        toast({
          title: "Compression Complete",
          description: `Original size: ${(files[0].size / 1024 / 1024).toFixed(2)}MB, New size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
        });
      }, 500);
    } catch (error) {
      console.error("Compression error:", error);
      toast({
        title: "Compression Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setIsProcessing(false);
    } finally {
      clearInterval(progressInterval);
    }
  };
  
  const handleDownload = () => {
    if (!resultFile) return;
    
    downloadFile(resultFile);
    
    toast({
      title: "Download Started",
      description: `Your compressed PDF is downloading.`,
    });
  };
  
  const handleReset = () => {
    setFiles([]);
    setIsProcessing(false);
    setProgress(0);
    setIsCompleted(false);
    setResultFile(null);
    setShowPreview(false);
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/tools')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Compress PDF</h1>
            <p className="text-muted-foreground">
              Reduce the size of your PDF files while maintaining quality
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              {!isCompleted ? (
                <>
                  <FileUploader 
                    accept={{ 'application/pdf': ['.pdf'] }}
                    maxFiles={1}
                    onFilesAdded={handleFilesAdded}
                    className="mb-6"
                  />
                  
                  {files.length > 0 && (
                    <div className="space-y-4">
                      {isProcessing ? (
                        <div className="space-y-2">
                          <p className="text-center font-medium">Compressing file...</p>
                          <Progress value={progress} className="h-2" />
                          <p className="text-center text-sm text-muted-foreground">
                            {progress === 100 ? 'Finalizing...' : `${progress}%`}
                          </p>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={handleCompress}
                        >
                          Compress PDF
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-medium">Compression Complete!</p>
                    {resultFile && files[0] && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Size reduced from {(files[0].size / 1024 / 1024).toFixed(2)}MB to {(resultFile.size / 1024 / 1024).toFixed(2)}MB ({Math.round((1 - resultFile.size / files[0].size) * 100)}% smaller)
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <Button
                      className="w-full"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Compressed PDF
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? "Hide Preview" : "Preview Result"}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={handleReset}
                    >
                      Compress Another File
                    </Button>
                  </div>
                  
                  {showPreview && resultFile && (
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <PDFViewer file={resultFile} className="max-h-[400px]" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CompressPdf;
