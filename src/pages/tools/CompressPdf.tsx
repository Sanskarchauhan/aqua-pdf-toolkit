
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileUp,
  Download,
  Settings,
  FileText,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUploader from '@/components/shared/FileUploader';
import { readFileAsArrayBuffer, compressPdf } from '@/utils/fileProcessing';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PDFViewer from '@/components/shared/PDFViewer';

type CompressionLevel = 'low' | 'medium' | 'high';

const CompressionOptions = [
  { value: 'low', label: 'Low Compression', description: 'Better quality, larger file size' },
  { value: 'medium', label: 'Medium Compression', description: 'Balanced quality and file size' },
  { value: 'high', label: 'High Compression', description: 'Smaller file size, lower quality' },
];

const CompressPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [beforeSize, setBeforeSize] = useState<number>(0);
  const [afterSize, setAfterSize] = useState<number>(0);
  const [reductionPercent, setReductionPercent] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset progress when user changes the file
    if (file) {
      setProgress(0);
      setCompressedFile(null);
    }
  }, [file]);

  const handleFilesAdded = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const selectedFile = newFiles[0]; // Take only the first file
      setFile(selectedFile);
      setBeforeSize(selectedFile.size);
      
      toast({
        title: "File added",
        description: `${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB) is ready to compress.`,
      });
    }
  };

  const handleCompress = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to compress.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    try {
      const result = await compressPdf(file, compressionLevel);
      setCompressedFile(result);
      
      // Calculate and set compression statistics
      const originalSize = file.size;
      const newSize = result.size;
      const reduction = originalSize - newSize;
      const reductionPercentage = (reduction / originalSize) * 100;
      
      setAfterSize(newSize);
      setReductionPercent(reductionPercentage);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "Compression complete",
        description: `Reduced by ${reductionPercentage.toFixed(1)}% (${(reduction / 1024 / 1024).toFixed(2)} MB)`,
      });
    } catch (error) {
      console.error("Compression error:", error);
      
      toast({
        title: "Compression failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      
      clearInterval(progressInterval);
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (compressedFile) {
      const url = URL.createObjectURL(compressedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = compressedFile.name;
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

  const handleReset = () => {
    setFile(null);
    setCompressedFile(null);
    setProgress(0);
    setBeforeSize(0);
    setAfterSize(0);
    setReductionPercent(0);
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    if (mb < 0.01) return "< 0.01 MB";
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <>
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <FileUp className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Compress PDF</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Reduce the file size of your PDF documents while maintaining quality.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                {!compressedFile ? "Upload PDF to Compress" : "Compression Complete"}
              </h2>

              {!compressedFile ? (
                <>
                  <FileUploader
                    acceptedFileTypes={{
                      'application/pdf': ['.pdf']
                    }}
                    maxFiles={1}
                    onFilesAdded={handleFilesAdded}
                    maxFileSizeMB={100}
                  />

                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center mb-4"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Compression Settings
                      {showSettings ? (
                        <ChevronUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-2" />
                      )}
                    </Button>
                    
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div 
                          className="p-4 bg-muted/40 rounded-md mb-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="mb-2 text-sm font-medium">Compression Level</div>
                          <Select 
                            value={compressionLevel} 
                            onValueChange={(value) => setCompressionLevel(value as CompressionLevel)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select compression level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {CompressionOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div>
                                      <div>{option.label}</div>
                                      <div className="text-xs text-muted-foreground">{option.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          
                          <div className="mt-4 text-xs text-muted-foreground">
                            <p><strong>Low:</strong> Minimal compression, better for documents with high-quality images.</p>
                            <p><strong>Medium:</strong> Balanced compression, suitable for most documents.</p>
                            <p><strong>High:</strong> Maximum compression, may reduce image quality.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button 
                      onClick={handleCompress} 
                      disabled={!file || isProcessing}
                      className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 transition-opacity"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="mr-2">Compressing</div>
                          <div className="flex space-x-1">
                            <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      ) : (
                        <>
                          Compress PDF
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {isProcessing && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Compressing...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <motion.div
                    className="bg-muted/30 p-4 rounded-md grid grid-cols-3 gap-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div>
                      <div className="text-sm text-muted-foreground">Original Size</div>
                      <div className="text-xl font-bold">{formatSize(beforeSize)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">New Size</div>
                      <div className="text-xl font-bold">{formatSize(afterSize)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Reduction</div>
                      <div className="text-xl font-bold text-green-500">{reductionPercent.toFixed(1)}%</div>
                    </div>
                  </motion.div>
                  
                  <Tabs defaultValue="preview">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview">Preview Result</TabsTrigger>
                      <TabsTrigger value="download">Download</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                      <div className="border rounded-lg overflow-hidden">
                        <PDFViewer file={compressedFile} className="h-[400px]" />
                      </div>
                    </TabsContent>
                    <TabsContent value="download" className="mt-4">
                      <div className="text-center p-6 space-y-4">
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button 
                            onClick={handleDownload}
                            className="w-full h-16 text-lg bg-primary hover:bg-primary/90"
                          >
                            <Download className="mr-2 h-5 w-5" />
                            Download Compressed PDF
                          </Button>
                        </motion.div>
                        
                        <p className="text-sm text-muted-foreground">
                          Your compressed file is ready! Click the button above to download.
                        </p>
                        
                        <div className="pt-4">
                          <Button
                            variant="outline"
                            onClick={handleReset}
                          >
                            Compress Another PDF
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </Card>

          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-4">Tips for PDF Compression</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-2">Choose the Right Level</h4>
                <p className="text-sm text-muted-foreground">
                  Use lower compression for documents with important images and higher compression for text-heavy documents.
                </p>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-2">Check Quality After Compression</h4>
                <p className="text-sm text-muted-foreground">
                  Always verify important details in your compressed PDF before sharing it.
                </p>
              </Card>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-2">Optimize Original Files</h4>
                <p className="text-sm text-muted-foreground">
                  For best results, optimize images before creating PDFs to achieve smaller file sizes.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CompressPdf;
