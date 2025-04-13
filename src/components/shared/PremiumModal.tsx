
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            You've used all your free trials. Upgrade to Premium for unlimited access to all features.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Premium Benefits:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Unlimited PDF conversions</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Higher file size limits</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Advanced editing features</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={handleUpgrade} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
