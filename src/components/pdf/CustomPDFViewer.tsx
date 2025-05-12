
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, RotateCw } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import PDFLayers, { PDFLayer } from './PDFLayers';
import { cn } from '@/lib/utils';

// Initialize the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface CustomPDFViewerProps {
  file: File | null;
  className?: string;
  layers?: PDFLayer[];
  onLayerClick?: (layer: PDFLayer) => void;
  editable?: boolean;
}

const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({
  file,
  className,
  layers = [],
  onLayerClick,
  editable = false
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const documentRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (file) {
      // Create a blob URL from the file
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setLoadError(null);
      setIsLoading(true);
      setPageNumber(1);
      
      // Clean up function to revoke the URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setFileUrl(null);
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError(null);
    console.log(`PDF loaded successfully with ${numPages} pages`);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setLoadError(error);
    setIsLoading(false);
  };

  const prevPage = () => {
    setPageNumber(curr => Math.max(curr - 1, 1));
  };

  const nextPage = () => {
    setPageNumber(curr => numPages ? Math.min(curr + 1, numPages) : curr);
  };

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 3));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  const resetZoom = () => setScale(1);
  const rotateClockwise = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    if (file && fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!file) {
    return (
      <div className={cn("flex items-center justify-center p-6 text-muted-foreground border rounded-md", className)}>
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No PDF file selected</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-6 text-destructive border rounded-md", className)}>
        <svg className="h-12 w-12 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-medium">Error Loading PDF</p>
        <p className="text-sm mt-2 text-center max-w-md">There was an error loading this PDF file. It might be corrupted or using unsupported features.</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => setLoadError(null)}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center p-2 mb-2 bg-muted/30 rounded-md">
        {/* Page navigation */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={prevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page <span className="font-medium">{pageNumber}</span> of{' '}
            <span className="font-medium">{numPages || '?'}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={nextPage}
            disabled={!numPages || pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom and other controls */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={zoomOut}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="text-xs w-16 text-center">
            {Math.round(scale * 100)}%
          </div>
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
            onClick={rotateClockwise}
            title="Rotate clockwise"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF renderer */}
      <div className="border rounded-md overflow-auto relative" style={{ height: '500px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="relative" ref={documentRef}>
          {fileUrl && (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              options={{
                cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                cMapPacked: true,
              }}
            >
              <div className="relative">
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  canvasBackground={resolvedTheme === 'dark' ? '#2d2d2d' : '#ffffff'}
                />
                {layers.length > 0 && (
                  <PDFLayers
                    layers={layers}
                    currentPage={pageNumber}
                    scale={scale}
                    onLayerClick={onLayerClick}
                    editable={editable}
                  />
                )}
              </div>
            </Document>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomPDFViewer;
