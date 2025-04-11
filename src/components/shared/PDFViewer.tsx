
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, File } from 'lucide-react';
import { cn } from '@/lib/utils';

// Set PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  className?: string;
}

const PDFViewer = ({ file, className }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!file) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-muted-foreground", className)}>
        <File className="h-12 w-12 mb-4" />
        <p>No file selected</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {url ? (
        <>
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error('Error loading PDF:', error)}
            loading={
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="border shadow-sm mx-auto"
            />
          </Document>
          
          <div className="flex items-center justify-between w-full mt-4 px-4">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            
            <p className="text-sm">
              Page {pageNumber} of {numPages || '?'}
            </p>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(prev => numPages ? Math.min(prev + 1, numPages) : prev)}
              disabled={numPages ? pageNumber >= numPages : true}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
