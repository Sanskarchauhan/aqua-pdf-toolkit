
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { FileIcon, UploadCloud, X, FileText, Image, File } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type FileUploaderProps = {
  onFilesAdded: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
};

const getIconForFile = (file: File) => {
  if (file.type.includes('pdf')) {
    return <FileText className="mr-2 h-4 w-4 text-red-500" />;
  } else if (file.type.includes('image')) {
    return <Image className="mr-2 h-4 w-4 text-blue-500" />;
  } else if (file.type.includes('word')) {
    return <FileText className="mr-2 h-4 w-4 text-blue-700" />;
  } else if (file.type.includes('excel') || file.type.includes('sheet')) {
    return <FileText className="mr-2 h-4 w-4 text-green-600" />;
  } else if (file.type.includes('presentation')) {
    return <FileText className="mr-2 h-4 w-4 text-orange-500" />;
  } else {
    return <File className="mr-2 h-4 w-4 text-gray-500" />;
  }
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
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  
  useEffect(() => {
    // Generate previews for image files
    const newPreviews = files.filter(file => file.type.includes('image')).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPreviews(newPreviews);
    
    // Clean up URLs when component unmounts
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [files]);
  
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
    
    // Check for maximum number of files
    if (files.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload a maximum of ${maxFiles} files at once.`,
        variant: "destructive",
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
            setFiles(prevFiles => {
              const combinedFiles = [...prevFiles, ...acceptedFiles];
              onFilesAdded(acceptedFiles);
              return combinedFiles;
            });
          }, 0);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
  }, [maxSize, maxFiles, files, onFilesAdded, toast]);
  
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
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
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
          isDragActive && !isDragReject && "border-primary bg-primary/5 animate-pulse",
          isDragReject && "border-destructive bg-destructive/5",
          !isDragActive && "border-muted-foreground/20 hover:border-primary/30 hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        
        <UploadCloud size={40} className={cn(
          "mb-4 mx-auto transition-transform duration-300",
          isDragActive && "scale-110",
          isDragActive && !isDragReject && "text-primary animate-bounce",
          isDragReject && "text-destructive"
        )} />
        
        <div className="text-center">
          <h3 className="font-medium text-lg">
            {isDragAccept ? "Drop to upload!" : 
             isDragReject ? "File type not supported" : 
             "Drop your files here"}
          </h3>
          <p className="text-muted-foreground mb-4">
            or click to browse (max {maxSize / 1048576}MB)
          </p>
          <Button type="button" variant="outline" className="bg-white/50 dark:bg-white/5">
            Select Files
          </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {files.map((file, index) => {
              // Find preview for this file if it exists
              const preview = previews.find(p => p.file === file);
              
              return (
                <div 
                  key={`${file.name}-${index}`} 
                  className="flex items-center justify-between p-3 bg-muted rounded-md animate-scale-in group hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center overflow-hidden">
                    {preview ? (
                      <img 
                        src={preview.preview} 
                        alt={file.name}
                        className="w-8 h-8 object-cover rounded mr-2" 
                      />
                    ) : (
                      getIconForFile(file)
                    )}
                    <span className="text-sm truncate max-w-[180px]" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 opacity-70 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
