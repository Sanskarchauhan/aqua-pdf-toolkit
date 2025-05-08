
import React, { useState } from 'react';
import { FileCheck, Download, FileUp, ArrowRight, Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PDFViewer from '@/components/shared/PDFViewer';
import { downloadFile } from '@/utils/fileProcessing';

interface ToolCardProps {
  toolId: string;
  files: File[];
  processing: boolean;
  progress: number;
  completed: boolean;
  resultFile: File | null;
  onProcess: () => void;
  onDownload: () => void;
  onReset: () => void;
  showPreview?: boolean;
  children?: React.ReactNode;
}

const ToolCard: React.FC<ToolCardProps> = ({
  toolId,
  files,
  processing,
  progress,
  completed,
  resultFile,
  onProcess,
  onDownload,
  onReset,
  showPreview = true,
  children,
}) => {
  const [showPreviewContent, setShowPreviewContent] = useState<boolean>(false);
  const isMergeTool = toolId === 'merge-pdf';

  return (
    <div className="bg-card border rounded-xl mt-6 shadow-sm overflow-hidden">
      {!completed ? (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 text-xl font-medium">
            {isMergeTool ? (
              <Files className="h-5 w-5 text-primary" />
            ) : (
              <FileUp className="h-5 w-5 text-primary" />
            )}
            {isMergeTool ? 'Upload Multiple Files' : 'Upload Files'}
          </div>
          
          {/* Show merge tool specific instructions */}
          {isMergeTool && files.length < 2 && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg text-sm">
              <p className="flex items-center">
                <Files className="h-4 w-4 mr-2 text-primary" />
                <span>
                  Select multiple PDF files to combine them into one document. 
                  You can select up to 20 files at once or add them one by one.
                </span>
              </p>
            </div>
          )}
          
          {children}
          
          {/* Always show the process button when at least one file is selected */}
          {files.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={onProcess} 
                disabled={processing || (isMergeTool && files.length < 2)}
                className="min-w-[150px] bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse">Processing</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '0s' }} />
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </span>
                ) : (
                  <span className="flex items-center">
                    {isMergeTool ? 
                      `Merge ${files.length} ${files.length === 1 ? 'File' : 'Files'}` : 
                      files.length > 1 ? `Process ${files.length} Files` : 'Process File'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          )}
          
          {isMergeTool && files.length === 1 && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Please add at least one more PDF file to merge
            </p>
          )}
          
          {processing && (
            <div className="mt-8 animate-fade-in">
              <p className="text-center mb-2">
                {files.length > 1 ? `Processing ${files.length} files...` : 'Processing your file...'}
              </p>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="p-6 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Processing Complete!</h2>
            <p className="text-muted-foreground mb-6">
              {files.length > 1 ? 'Your files have been processed successfully.' : 'Your file has been processed successfully.'}
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <Button onClick={onDownload} className="bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4 mr-2" />
                Download Result
              </Button>
              
              {/* Only show preview button if showPreview is true */}
              {showPreview && resultFile && resultFile.type.includes('pdf') && (
                <Button variant="outline" onClick={() => setShowPreviewContent(!showPreviewContent)}>
                  {showPreviewContent ? 'Hide Preview' : 'Preview Result'}
                </Button>
              )}
              
              <Button variant="ghost" onClick={onReset}>
                Process {files.length > 1 ? 'More Files' : 'Another File'}
              </Button>
            </div>
          </div>
          
          {/* Only render preview content if showPreview is true and preview is toggled on */}
          {showPreview && showPreviewContent && resultFile && resultFile.type.includes('pdf') && (
            <div className="p-4 bg-muted/30 border-t">
              <PDFViewer file={resultFile} className="max-h-[500px]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolCard;
