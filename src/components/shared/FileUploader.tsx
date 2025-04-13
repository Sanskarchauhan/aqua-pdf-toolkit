
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileUp, FilePlus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface FileUploaderProps {
  accept: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  maxFileSizeMB?: number; // Added for compatibility with tool pages
  className?: string;
  onFilesAdded?: (files: File[]) => void;
  onFileSelect?: (file: File) => void; // Added for single file selection
  acceptedFileTypes?: Record<string, string[]>; // Added for compatibility with tool pages
}

const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  acceptedFileTypes, // Support alternative prop name
  maxFiles = 1,
  maxSize: propMaxSize,
  maxFileSizeMB = 10, // Default 10MB
  className,
  onFilesAdded,
  onFileSelect,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  
  // Calculate maxSize in bytes
  const maxSize = propMaxSize || maxFileSizeMB * 1024 * 1024;
  
  // Use acceptedFileTypes if provided, otherwise use accept
  const acceptedTypes = acceptedFileTypes || accept;

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const errors = fileRejections.map(rejection => {
        if (rejection.errors[0].code === 'file-too-large') {
          return `"${rejection.file.name}" is too large.`;
        } else if (rejection.errors[0].code === 'file-invalid-type') {
          return `"${rejection.file.name}" has an unsupported file type.`;
        }
        return `"${rejection.file.name}" - ${rejection.errors[0].message}`;
      });

      toast({
        title: "File Upload Error",
        description: errors.join(' '),
        variant: "destructive",
      });
      return;
    }

    if (files.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} ${maxFiles === 1 ? 'file is' : 'files are'} allowed.`,
        variant: "destructive",
      });
      return;
    }

    // Update internal state
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    
    // Call callbacks
    if (onFilesAdded) {
      onFilesAdded(acceptedFiles);
    }
    
    // If single file selection is used
    if (onFileSelect && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [files.length, maxFiles, onFilesAdded, onFileSelect, toast]);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles,
    maxSize
  });

  const formatFileSize = (size: number) => {
    if (size < 1024) return size + ' B';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    else return (size / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={cn("w-full", className)}>
      <div 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <FileUp className={cn("h-10 w-10 mb-3", isDragActive ? "text-primary" : "text-muted-foreground")} />
        <p className="text-center mb-1 font-medium">
          {isDragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-center text-sm text-muted-foreground mb-3">
          or click to select files
        </p>
        <Button type="button" size="sm" variant="outline" className="mt-2">
          <FilePlus className="h-4 w-4 mr-2" />
          Select Files
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Max {maxFiles} {maxFiles === 1 ? 'file' : 'files'}, up to {formatFileSize(maxSize)} each
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium mb-2">Selected Files:</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-lg">
              <div className="flex items-center overflow-hidden">
                <div className="bg-primary/10 p-2 rounded-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeFile(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
