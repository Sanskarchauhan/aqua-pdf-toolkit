
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme/ThemeProvider';

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
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const { resolvedTheme } = useTheme();

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

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 3));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  const fitToWidth = () => setScale(1.0);
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    if (file && url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!file) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-muted-foreground", className)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>No file selected</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex w-full items-center justify-between mb-4 px-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            Page {pageNumber} of {numPages || '?'}
          </span>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(prev => numPages ? Math.min(prev + 1, numPages) : prev)}
            disabled={numPages ? pageNumber >= numPages : true}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={zoomOut}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-xs w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={zoomIn}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={fitToWidth}
            title="Fit to width"
          >
            <Maximize className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={rotate}
            title="Rotate"
            className="rotate-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M21 13a9 9 0 1 1-3-7.7L21 8"></path>
            </svg>
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={handleDownload}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {url ? (
        <div className="border shadow-sm rounded-lg overflow-auto max-h-[600px] w-full">
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
              scale={scale}
              rotate={rotation}
              canvasBackground={resolvedTheme === 'dark' ? '#2d2d2d' : '#ffffff'}
              className="mx-auto"
            />
          </Document>
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
