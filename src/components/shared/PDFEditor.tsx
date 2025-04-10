
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
  FilePlus,
  Pencil,
  ZoomIn,
  ZoomOut,
  Undo
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/theme/ThemeProvider';

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
  const [scale, setScale] = useState<number>(1.0);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();

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
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

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

  const handleUndoEdit = () => {
    setEdits(prev => prev.slice(0, -1));
    toast({
      title: "Edit Undone",
      description: "The last edit has been removed."
    });
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'edit' && currentEdit.type === 'text' && currentEdit.content) {
      // Calculate position relative to the page
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top; 
        
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
        return [...prev, pageNum].sort((a, b) => a - b);
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

          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-xs">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
          >
            <ZoomIn className="h-4 w-4" />
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
          
          {edits.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndoEdit}
            >
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
          )}
          
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
      
      {/* Grid and alignment tools */}
      <div className="flex items-center mb-2 space-x-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-grid" 
            checked={showGrid}
            onCheckedChange={setShowGrid}
          />
          <Label htmlFor="show-grid" className="text-sm">Show Grid</Label>
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
            autoFocus
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
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={`page-${pageNum}`}
                onClick={() => handleTogglePage(pageNum)}
                className={`p-2 border rounded text-center transition-all ${
                  selectedPages.includes(pageNum) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/70'
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
        className={`border rounded-md overflow-auto relative ${showGrid ? 'bg-grid' : ''}`}
        onClick={handlePageClick}
        style={{ 
          minHeight: '400px',
          backgroundSize: '20px 20px',
          backgroundImage: showGrid ? `linear-gradient(to right, ${resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
                                      linear-gradient(to bottom, ${resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)` : 'none'
        }}
      >
        {file ? (
          <Document 
            file={file} 
            onLoadSuccess={onDocumentLoadSuccess} 
            className="pdf-document"
            loading={
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
              </div>
            }
            error={
              <div className="flex flex-col justify-center items-center h-64 text-center p-4">
                <Pencil className="h-10 w-10 text-destructive mb-2" />
                <p className="text-destructive font-medium">Error loading PDF</p>
                <p className="text-sm text-muted-foreground mt-2">The file may be corrupted or password protected.</p>
              </div>
            }
          >
            <Page 
              pageNumber={pageNumber} 
              className="pdf-page mx-auto"
              renderTextLayer={true}
              renderAnnotationLayer={true}
              scale={scale}
              canvasBackground={resolvedTheme === 'dark' ? '#2d2d2d' : '#ffffff'}
            />
          </Document>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 text-center p-4">
            <Pencil className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="font-medium">No PDF loaded</p>
            <p className="text-sm text-muted-foreground mt-2">Upload a PDF file to edit it.</p>
          </div>
        )}
        
        {/* Visual indication of edits on current page */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
          {edits
            .filter(edit => edit.page === pageNumber - 1)
            .map((edit, index) => (
              <div 
                key={`edit-${index}`}
                className="absolute bg-yellow-100 bg-opacity-50 p-1 border border-yellow-400 rounded dark:bg-yellow-900 dark:border-yellow-600 dark:bg-opacity-70 dark:text-white"
                style={{ 
                  left: `${edit.x}px`, 
                  top: `${edit.y}px`,
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
