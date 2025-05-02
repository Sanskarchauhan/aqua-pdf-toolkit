
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, File, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FileUploaderProps {
  acceptedFileTypes?: Record<string, string[]>;
  maxFiles?: number;
  maxFileSizeMB?: number;
  onFilesAdded: (files: File[]) => void;
  onFileSelect?: (file: File) => void;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  acceptedFileTypes,
  maxFiles = 10,
  maxFileSizeMB = 50,
  onFilesAdded,
  onFileSelect,
  className = '',
  label,
  icon,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      // Filter out files that exceed the size limit
      const validFiles = acceptedFiles.filter((file) => {
        const isValidSize = file.size <= maxFileSizeMB * 1024 * 1024;
        if (!isValidSize) {
          setError(`File "${file.name}" is too large. Maximum size is ${maxFileSizeMB}MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // Limit the number of files if needed
      const newFiles = [...files, ...validFiles].slice(0, maxFiles);
      
      setFiles(newFiles);
      onFilesAdded(validFiles);
      
      // If onFileSelect is provided and there's only one file, call it
      if (onFileSelect && validFiles.length === 1) {
        onFileSelect(validFiles[0]);
      }
    },
    [files, maxFiles, maxFileSizeMB, onFilesAdded, onFileSelect]
  );

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: acceptedFileTypes,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          {icon || <Upload className="h-8 w-8 text-muted-foreground mb-2" />}
          
          <p className="text-lg font-medium">
            {label || "Drag & drop files here, or click to select files"}
          </p>
          <p className="text-sm text-muted-foreground">
            {acceptedFileTypes ? 
              `Supported formats: ${Object.values(acceptedFileTypes).flat().join(', ')}` : 
              'All file types accepted'}
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum file size: {maxFileSizeMB}MB
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Select Files
          </Button>
        </div>
      </div>

      {error && (
        <motion.div 
          className="flex items-center gap-2 mt-2 p-2 rounded-md bg-destructive/10 text-destructive text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            className="mt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm font-medium">Selected files:</p>
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
