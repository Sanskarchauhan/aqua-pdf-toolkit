
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { FileIcon, UploadCloud, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';

type FileUploaderProps = {
  onFilesAdded: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAdded,
  accept = {
    'application/pdf': ['.pdf'],
  },
  maxFiles = 10,
  maxSize = 10485760, // 10MB
  className,
}) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach((rejection) => {
        const { file, errors } = rejection;
        if (errors[0]?.code === 'file-too-large') {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the ${maxSize / 1048576}MB limit.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Invalid file",
            description: `${file.name} is not a valid file format.`,
            variant: "destructive",
          });
        }
      });
      return;
    }
    
    // Simulate upload progress
    setUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          // Use setTimeout to avoid React state updates during render
          setTimeout(() => {
            setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
            onFilesAdded(acceptedFiles);
          }, 0);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
  }, [maxSize, onFilesAdded, toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    maxSize,
  });
  
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  return (
    <div className={className}>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'} transition-colors cursor-pointer`}
      >
        <input {...getInputProps()} />
        
        <UploadCloud size={40} className="text-primary mb-4 mx-auto" />
        
        <div className="text-center">
          <h3 className="font-medium text-lg">Drop your files here</h3>
          <p className="text-muted-foreground mb-4">
            or click to browse (max {maxSize / 1048576}MB)
          </p>
          <Button type="button">Select Files</Button>
        </div>
      </div>
      
      {uploading && (
        <div className="mt-4 animate-fade-in">
          <p className="text-sm mb-2">Uploading...</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Added Files:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-muted rounded-md animate-scale-in">
                <div className="flex items-center">
                  <FileIcon className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(index)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
