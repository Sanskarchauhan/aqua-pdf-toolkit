import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileUp, Download, FileText, ZoomIn, CheckCircle, BarChart3 } from 'lucide-react';
import FileUploader from '@/components/shared/FileUploader';
import { compressPdf, downloadFile } from '@/utils/fileProcessing';
import { useToast } from '@/hooks/use-toast';
import AnimatedPage from '@/components/animation/AnimatedPage';
import PDFViewer from '@/components/shared/PDFViewer';
import { motion, AnimatePresence } from 'framer-motion';
import ToolCard from '@/components/tools/ToolCard';

const CompressPdf = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: string;
    newSize: string;
    reduction: string;
  } | null>(null);
  
  // Clear previous results when new files are added
  useEffect(() => {
    if (files.length > 0) {
      setIsCompleted(false);
      setResultFile(null);
      setShowPreview(false);
      setCompressionStats(null);
    }
  }, [files]);

  const handleFilesAdded = (newFiles: File[]) => {
    // Only keep PDF files
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only.",
        variant: "destructive",
      });
      return;
    }
    
    // Only keep the latest file
    setFiles([pdfFiles[pdfFiles.length - 1]]);
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
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 5;
        });
      }, 200);
      
      // Pass the compression level to the compress function
      const compressedFile = await compressPdf(files[0], compressionLevel);
      
      // Set progress to 100% when done
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setResultFile(compressedFile);
        setIsProcessing(false);
        setIsCompleted(true);
        
        const originalSize = (files[0].size / 1024 / 1024).toFixed(2);
        const newSize = (compressedFile.size / 1024 / 1024).toFixed(2);
        const reductionPercentage = ((1 - compressedFile.size / files[0].size) * 100).toFixed(0);
        
        setCompressionStats({
          originalSize: `${originalSize}MB`,
          newSize: `${newSize}MB`,
          reduction: `${reductionPercentage}%`
        });
        
        toast({
          title: "Compression Complete",
          description: `Size reduced from ${originalSize}MB to ${newSize}MB (${reductionPercentage}% smaller)`,
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
    setCompressionStats(null);
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatedPage animation="scale">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-8 hover:scale-105 transition-transform"
          onClick={() => navigate('/tools')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
          >
            <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FileUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Compress PDF</h1>
            <p className="text-muted-foreground">
              Reduce the size of your PDF files while maintaining quality
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary/10">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {!isCompleted ? (
                    <motion.div 
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FileUploader 
                        accept={{ 'application/pdf': ['.pdf'] }}
                        maxFiles={1}
                        onFilesAdded={handleFilesAdded}
                        className="mb-6 border-dashed border-2 border-primary/50 hover:border-primary transition-colors p-8"
                        label="Drop your PDF file here or click to browse"
                        icon={<FileUp size={40} className="text-primary/50" />}
                      />
                      
                      {files.length > 0 && (
                        <motion.div 
                          className="space-y-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center justify-between mb-2 p-3 bg-secondary/10 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText size={18} className="text-primary" />
                              <p className="font-medium text-sm truncate max-w-[200px]">{files[0].name}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {(files[0].size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <BarChart3 size={18} className="text-primary" />
                                <p className="text-sm font-medium">Select compression level:</p>
                              </div>
                              <div className="flex gap-2">
                                {['low', 'medium', 'high'].map((level) => (
                                  <Button
                                    key={level}
                                    type="button"
                                    variant={compressionLevel === level ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCompressionLevel(level as 'low' | 'medium' | 'high')}
                                    className={`flex-1 capitalize ${compressionLevel === level ? 'bg-primary text-primary-foreground' : ''}`}
                                  >
                                    {level === 'low' ? 'Less' : level === 'medium' ? 'Balanced' : 'Maximum'}
                                  </Button>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {compressionLevel === 'low' 
                                  ? 'Better quality, less compression' 
                                  : compressionLevel === 'medium'
                                  ? 'Balanced quality and compression'
                                  : 'Maximum compression, lower quality'}
                              </p>
                            </div>
                            
                            {isProcessing ? (
                              <motion.div 
                                className="space-y-2 p-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <p className="text-center font-medium">Compressing file...</p>
                                <Progress value={progress} className="h-2" />
                                <p className="text-center text-sm text-muted-foreground">
                                  {progress === 100 ? 'Finalizing...' : `${Math.round(progress)}%`}
                                </p>
                              </motion.div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <Button 
                                  className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity" 
                                  onClick={handleCompress}
                                >
                                  Compress PDF
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="result"
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-4"
                        >
                          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </motion.div>
                        <h3 className="font-medium text-lg mb-2">Compression Complete!</h3>
                        
                        {compressionStats && (
                          <div className="flex justify-center gap-6 mt-4">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Original size</p>
                              <p className="font-semibold">{compressionStats.originalSize}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Compressed size</p>
                              <p className="font-semibold">{compressionStats.newSize}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Reduction</p>
                              <p className="font-semibold text-green-600 dark:text-green-400">
                                {compressionStats.reduction}
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                      
                      <motion.div 
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button
                          className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all hover:scale-105 transform"
                          onClick={handleDownload}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Compressed PDF
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="w-full hover:bg-primary/10 transition-colors"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          <ZoomIn className="h-4 w-4 mr-2" />
                          {showPreview ? "Hide Preview" : "Preview Result"}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="w-full hover:bg-primary/5 transition-colors"
                          onClick={handleReset}
                        >
                          Compress Another File
                        </Button>
                      </motion.div>
                      
                      <AnimatePresence>
                        {showPreview && resultFile && (
                          <motion.div 
                            className="mt-4 border rounded-lg overflow-hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="h-[400px]">
                              <PDFViewer file={resultFile} className="max-h-[400px]" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CompressPdf;
