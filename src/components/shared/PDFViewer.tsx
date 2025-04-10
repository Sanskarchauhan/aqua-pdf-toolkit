
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { saveAs } from 'file-saver';

// Set up the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | string | null;
  onDownload?: () => void;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onDownload, className }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);

  // Reset page number when file changes
  useEffect(() => {
    setPageNumber(1);
  }, [file]);

  if (!file) {
    return null;
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(numPages || 1, newPageNumber));
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.1, 2.0));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.1, 0.5));

  const handleThumbnailClick = (page: number) => {
    setPageNumber(page);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (file instanceof File) {
      saveAs(file, file.name);
    }
  };

  return (
    <div className={`pdf-viewer ${className || ''}`}>
      <div className="flex justify-between items-center mb-4 space-x-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
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
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          
          <span className="text-sm whitespace-nowrap">
            {Math.round(scale * 100)}%
          </span>
          
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
            className="ml-2"
          >
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </div>
      
      <div className="flex">
        {showThumbnails && numPages && numPages > 1 && (
          <div className="hidden md:flex flex-col pr-4 space-y-2 w-24">
            {Array.from(new Array(numPages), (_, index) => (
              <div
                key={`thumb-${index}`}
                className={`pdf-thumbnail ${pageNumber === index + 1 ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index + 1)}
              >
                <Document file={file}>
                  <Page
                    pageNumber={index + 1}
                    width={80}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            ))}
          </div>
        )}

        <div className="pdf-content flex-grow overflow-auto">
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="pdf-page"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
