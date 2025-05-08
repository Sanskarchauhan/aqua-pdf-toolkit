
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, File, AlertCircle, ListPlus, Files } from 'lucide-react';
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
  queueMode?: boolean;
  isMultiFile?: boolean; // For multi-file tools
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
  queueMode = false,
  isMultiFile = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileQueue, setFileQueue] = useState<File[]>([]);
  const [processingQueue, setProcessingQueue] = useState<boolean>(false);

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

      if (queueMode || isMultiFile) {
        // In queue mode or for multi-file tools, add to the queue
        const newQueue = [...fileQueue, ...validFiles];
        setFileQueue(newQueue);
        
        // Update the displayed files, respecting the max files limit
        const newFiles = [...files, ...validFiles].slice(0, maxFiles);
        setFiles(newFiles);
        
        // If it's a multi-file tool, immediately notify parent about the new files
        if (isMultiFile) {
          onFilesAdded([...files, ...validFiles].slice(0, maxFiles));
        }
      } else {
        // Normal mode - process files immediately
        const newFiles = [...files, ...validFiles].slice(0, maxFiles);
        setFiles(newFiles);
        onFilesAdded(validFiles);
        
        // If onFileSelect is provided and there's only one file, call it
        if (onFileSelect && validFiles.length === 1) {
          onFileSelect(validFiles[0]);
        }
      }
    },
    [files, fileQueue, maxFiles, maxFileSizeMB, onFilesAdded, onFileSelect, queueMode, isMultiFile]
  );

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const removedFile = newFiles.splice(index, 1)[0];
    setFiles(newFiles);
    
    // Also remove from queue if in queue mode
    if (queueMode || isMultiFile) {
      const newQueue = fileQueue.filter(file => file.name !== removedFile.name);
      setFileQueue(newQueue);
      
      // If it's a multi-file tool, notify parent about the file removal
      if (isMultiFile) {
        onFilesAdded(newFiles);
      }
    } else {
      // Notify parent component about file removal
      onFilesAdded(newFiles);
    }
  };

  const processQueue = () => {
    if (fileQueue.length === 0 || processingQueue) return;
    
    setProcessingQueue(true);
    
    // Process the files in the queue
    onFilesAdded(fileQueue);
    
    // Clear the queue
    setFileQueue([]);
    setProcessingQueue(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: acceptedFileTypes,
    multiple: isMultiFile || queueMode || maxFiles > 1,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${isMultiFile || queueMode ? 'border-primary/50 bg-primary/5' : ''}`}
      >
        <input {...getInputProps()} multiple={isMultiFile || queueMode || maxFiles > 1} />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          {icon || (isMultiFile || queueMode ? 
            <Files className="h-8 w-8 text-primary mb-2" /> : 
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          )}
          
          <p className="text-lg font-medium">
            {label || (isMultiFile ? 
              "Drop multiple files here, or click to select" : 
              queueMode ?
              "Drop multiple files to queue them, or click to select" :
              "Drag & drop files here, or click to select files"
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {acceptedFileTypes ? 
              `Supported formats: ${Object.values(acceptedFileTypes).flat().join(', ')}` : 
              'All file types accepted'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isMultiFile || queueMode ? 
              `You can select up to ${maxFiles} files at once` :
              `Maximum file size: ${maxFileSizeMB}MB`
            }
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            {isMultiFile || queueMode ? "Select Multiple Files" : "Select Files"}
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
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Selected files: ({files.length})</p>
              {queueMode && fileQueue.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={processQueue}
                  disabled={processingQueue}
                  className="flex items-center gap-1 text-xs"
                >
                  <ListPlus className="h-4 w-4" />
                  Process Queue ({fileQueue.length})
                </Button>
              )}
            </div>
            
            <div className="max-h-[200px] overflow-y-auto pr-2">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-2 bg-muted rounded-md mb-2"
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
            </div>
            
            {queueMode && files.length >= 2 && fileQueue.length > 0 && (
              <div className="mt-4 p-3 bg-primary/10 rounded-md flex justify-between items-center">
                <p className="text-sm flex items-center">
                  <ListPlus className="h-4 w-4 mr-2 text-primary" />
                  <span>{fileQueue.length} files ready for batch processing</span>
                </p>
                <Button 
                  size="sm" 
                  onClick={processQueue}
                  disabled={processingQueue}
                >
                  Process All
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
