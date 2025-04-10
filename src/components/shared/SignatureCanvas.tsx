
import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'signature_pad';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileSignature, Trash2, Check, Download } from 'lucide-react';

interface SignatureCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const initSignaturePad = () => {
      if (canvasRef.current && isOpen) {
        // Adjust canvas for high DPI displays
        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        const context = canvas.getContext('2d');
        
        if (context) {
          context.scale(ratio, ratio);
          context.fillStyle = '#fff';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Initialize signature pad
        if (signaturePadRef.current) {
          signaturePadRef.current.clear();
        } else {
          signaturePadRef.current = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'black',
            minWidth: 1,
            maxWidth: 2.5,
          });
          
          signaturePadRef.current.addEventListener('beginStroke', () => {
            setIsEmpty(false);
          });
          
          signaturePadRef.current.addEventListener('endStroke', () => {
            setIsEmpty(signaturePadRef.current?.isEmpty() || true);
          });
        }
      }
    };

    const timeoutId = setTimeout(() => {
      initSignaturePad();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen]);

  const clearCanvas = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setIsEmpty(true);
    }
  };

  const saveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const signatureData = signaturePadRef.current.toDataURL('image/png');
      onSave(signatureData);
    }
  };

  const saveAsImage = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const signatureData = signaturePadRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = signatureData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Draw Your Signature
          </DialogTitle>
          <DialogDescription>
            Use your mouse or touch screen to draw your signature below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex flex-col items-center">
          <div className="border border-dashed border-gray-300 rounded-md w-full mb-4 bg-white">
            <canvas
              ref={canvasRef}
              height={200}
              className="signature-canvas w-full h-48"
            />
          </div>
          <div className="flex justify-center space-x-4">
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              onClick={clearCanvas}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={saveAsImage}
              disabled={isEmpty}
            >
              <Download className="h-4 w-4 mr-1" />
              Save as Image
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={saveSignature}
            disabled={isEmpty}
          >
            <Check className="h-4 w-4 mr-1" />
            Use Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureCanvas;
