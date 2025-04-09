
import React from 'react';
import { FileCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
  children,
}) => {
  return (
    <div className="bg-card border rounded-lg mt-6">
      {!completed ? (
        <div className="p-6">
          <h2 className="text-xl font-medium mb-4">Upload Files</h2>
          {children}
          
          {files.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={onProcess} 
                disabled={processing}
                className="min-w-[150px]"
              >
                {processing ? "Processing..." : "Process Files"}
              </Button>
            </div>
          )}
          
          {processing && (
            <div className="mt-8 animate-fade-in">
              <p className="text-center mb-2">Processing your files...</p>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 text-center animate-fade-in">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Processing Complete!</h2>
          <p className="text-muted-foreground mb-6">
            Your files have been processed successfully.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Result
            </Button>
            <Button variant="outline" onClick={onReset}>
              Process Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolCard;
