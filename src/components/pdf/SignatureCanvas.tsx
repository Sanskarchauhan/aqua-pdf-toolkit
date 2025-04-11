
import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'signature_pad';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Download, Check } from 'lucide-react';

interface SignatureCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [penColor, setPenColor] = useState('#000000');

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      
      // Adjust canvas for retina displays
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      
      // Initialize signature pad
      signaturePadRef.current = new SignaturePad(canvas, {
        penColor,
        backgroundColor: 'rgba(255, 255, 255, 0)'
      });
      
      return () => {
        if (signaturePadRef.current) {
          signaturePadRef.current.off();
          signaturePadRef.current = null;
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (signaturePadRef.current) {
      signaturePadRef.current.penColor = penColor;
    }
  }, [penColor]);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setIsEmpty(true);
    }
  };

  const handleSave = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataURL = signaturePadRef.current.toDataURL('image/png');
      onSave(dataURL);
    }
  };

  const handleDownload = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataURL = signaturePadRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `signature-${new Date().toISOString().slice(0,10)}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const colors = ['#000000', '#1E40AF', '#047857', '#B91C1C', '#6D28D9'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Draw Your Signature</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          <div className="border rounded-md p-1 bg-white">
            <canvas 
              ref={canvasRef} 
              className="w-full h-48 cursor-crosshair touch-none"
              onMouseDown={() => setIsEmpty(false)}
              onTouchStart={() => setIsEmpty(false)}
            />
          </div>
          
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border border-muted ${
                  penColor === color ? 'ring-2 ring-primary' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setPenColor(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClear}
              disabled={isEmpty}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={isEmpty}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isEmpty}
          >
            <Check className="h-4 w-4 mr-1" />
            Save Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureCanvas;
