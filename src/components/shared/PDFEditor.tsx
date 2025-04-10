
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  Type, 
  Eraser, 
  Save, 
  Scissors, 
  FilePlus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Set up the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFEditorProps {
  file: File | null;
  onSave: (edits: Array<{type: string, content: string, page: number, x: number, y: number}>) => void;
  onDeletePages?: (pageNumbers: number[]) => void;
  onExtractPages?: (pageNumbers: number[]) => void;
}

const PDFEditor: React.FC<PDFEditorProps> = ({ file, onSave, onDeletePages, onExtractPages }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [edits, setEdits] = useState<Array<{type: string, content: string, page: number, x: number, y: number}>>([]);
  const [currentEdit, setCurrentEdit] = useState<{type: string, content: string}>({ type: '', content: '' });
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [mode, setMode] = useState<'view' | 'edit' | 'delete' | 'extract'>('view');
  const [textPosition, setTextPosition] = useState<{ x: number, y: number }>({ x: 100, y: 100 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handleAddTextClick = () => {
    setMode('edit');
    setCurrentEdit({ type: 'text', content: '' });
  };

  const handleTextContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentEdit({ ...currentEdit, content: e.target.value });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setTextPosition(prev => ({
        ...prev,
        [axis]: numValue
      }));
    }
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'edit' && currentEdit.type === 'text' && currentEdit.content) {
      // Calculate position relative to the page
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = rect.height - (e.clientY - rect.top); // PDF coordinates origin is bottom-left
        
        // Add the new edit
        setEdits([...edits, {
          ...currentEdit,
          page: pageNumber - 1, // 0-indexed for processing
          x,
          y
        }]);
        
        // Reset current edit
        setCurrentEdit({ type: '', content: '' });
        setMode('view');
        
        toast({
          title: "Text Added",
          description: "Text annotation added to the document."
        });
      }
    }
  };

  const handleTogglePage = (pageNum: number) => {
    setSelectedPages(prev => {
      if (prev.includes(pageNum)) {
        return prev.filter(p => p !== pageNum);
      } else {
        return [...prev, pageNum];
      }
    });
  };

  const handleDeletePages = () => {
    if (selectedPages.length > 0 && onDeletePages) {
      onDeletePages(selectedPages.map(p => p - 1)); // Convert to 0-indexed
      setSelectedPages([]);
      setMode('view');
      toast({
        title: "Pages Deleted",
        description: `${selectedPages.length} page(s) deleted.`
      });
    } else {
      toast({
        title: "No Pages Selected",
        description: "Please select pages to delete.",
        variant: "destructive"
      });
    }
  };

  const handleExtractPages = () => {
    if (selectedPages.length > 0 && onExtractPages) {
      onExtractPages(selectedPages.map(p => p - 1)); // Convert to 0-indexed
      setSelectedPages([]);
      setMode('view');
      toast({
        title: "Pages Extracted",
        description: `${selectedPages.length} page(s) extracted.`
      });
    } else {
      toast({
        title: "No Pages Selected",
        description: "Please select pages to extract.",
        variant: "destructive"
      });
    }
  };

  const handleSaveEdits = () => {
    if (edits.length > 0) {
      onSave(edits);
      setEdits([]);
      toast({
        title: "Edits Saved",
        description: `${edits.length} edit(s) saved to the document.`
      });
    } else {
      toast({
        title: "No Edits",
        description: "No edits to save.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="pdf-editor">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4 space-x-2 bg-muted p-2 rounded-lg">
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTextClick}
            className={mode === 'edit' ? 'bg-primary text-primary-foreground' : ''}
          >
            <Type className="h-4 w-4 mr-1" />
            Add Text
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === 'delete' ? 'view' : 'delete')}
            className={mode === 'delete' ? 'bg-destructive text-destructive-foreground' : ''}
          >
            <Scissors className="h-4 w-4 mr-1" />
            Delete Pages
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(mode === 'extract' ? 'view' : 'extract')}
            className={mode === 'extract' ? 'bg-primary text-primary-foreground' : ''}
          >
            <FilePlus className="h-4 w-4 mr-1" />
            Extract Pages
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveEdits}
            disabled={edits.length === 0}
          >
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>
      </div>
      
      {/* Edit Form */}
      {mode === 'edit' && currentEdit.type === 'text' && (
        <div className="mb-4 p-4 border rounded-md bg-background">
          <h3 className="text-sm font-medium mb-2">Add Text Annotation</h3>
          <Textarea 
            value={currentEdit.content}
            onChange={handleTextContentChange}
            placeholder="Enter text to add to the document"
            className="mb-2"
          />
          <div className="flex space-x-2 mb-2">
            <div>
              <label className="text-xs">X Position</label>
              <Input 
                type="number" 
                value={textPosition.x}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="w-20"
              />
            </div>
            <div>
              <label className="text-xs">Y Position</label>
              <Input 
                type="number" 
                value={textPosition.y}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="w-20"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            You can also click on the document to place text at that location.
          </p>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setCurrentEdit({ type: '', content: '' });
                setMode('view');
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!currentEdit.content}
              onClick={() => {
                if (currentEdit.content) {
                  setEdits([...edits, {
                    ...currentEdit,
                    page: pageNumber - 1,
                    x: textPosition.x,
                    y: textPosition.y
                  }]);
                  setCurrentEdit({ type: '', content: '' });
                  setMode('view');
                  toast({
                    title: "Text Added",
                    description: "Text annotation added to the document."
                  });
                }
              }}
            >
              Add Text
            </Button>
          </div>
        </div>
      )}
      
      {/* Page Selection Mode */}
      {(mode === 'delete' || mode === 'extract') && numPages && (
        <div className="mb-4 p-4 border rounded-md bg-background">
          <h3 className="text-sm font-medium mb-2">
            {mode === 'delete' ? 'Select Pages to Delete' : 'Select Pages to Extract'}
          </h3>
          <div className="grid grid-cols-8 gap-2 mb-4">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={`page-${pageNum}`}
                onClick={() => handleTogglePage(pageNum)}
                className={`p-2 border rounded text-center ${
                  selectedPages.includes(pageNum) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedPages([]);
                setMode('view');
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={mode === 'delete' ? 'destructive' : 'default'}
              disabled={selectedPages.length === 0}
              onClick={mode === 'delete' ? handleDeletePages : handleExtractPages}
            >
              {mode === 'delete' ? 'Delete Selected Pages' : 'Extract Selected Pages'}
            </Button>
          </div>
        </div>
      )}
      
      {/* PDF Display */}
      <div 
        ref={containerRef}
        className="border border-muted rounded-md overflow-auto"
        onClick={handlePageClick}
      >
        {file && (
          <Document 
            file={file} 
            onLoadSuccess={onDocumentLoadSuccess} 
            className="pdf-document"
          >
            <Page 
              pageNumber={pageNumber} 
              className="pdf-page"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        )}
        
        {/* Visual indication of edits on current page */}
        <div className="relative">
          {edits
            .filter(edit => edit.page === pageNumber - 1)
            .map((edit, index) => (
              <div 
                key={`edit-${index}`}
                className="absolute bg-yellow-100 bg-opacity-50 p-1 border border-yellow-400 rounded"
                style={{ 
                  left: `${edit.x}px`, 
                  bottom: `${edit.y}px`,
                  transform: 'translateY(-100%)'
                }}
              >
                <p className="text-xs">{edit.content}</p>
              </div>
            ))}
        </div>
      </div>
      
      {/* Edit indicator */}
      {edits.length > 0 && (
        <div className="mt-2 text-sm text-muted-foreground">
          {edits.length} pending edit(s). Click "Save Changes" to apply.
        </div>
      )}
    </div>
  );
};

export default PDFEditor;
