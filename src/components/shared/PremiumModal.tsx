
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal = ({ isOpen, onClose }: PremiumModalProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
                  className="mx-auto bg-gradient-to-br from-yellow-300 to-yellow-600 p-3 rounded-full mb-4"
                >
                  <Crown className="h-8 w-8 text-white" />
                </motion.div>
                <DialogTitle className="text-xl">Upgrade to Premium</DialogTitle>
                <DialogDescription>
                  {user ? (
                    <>You've used all {user.trialCount} of your free trials.</>
                  ) : (
                    <>You need to upgrade to continue using this feature.</>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="my-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <motion.div whileHover={{ scale: 1.05 }} className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">✓</span>
                    </motion.div>
                    <p>Unlimited document processing</p>
                  </div>
                  <div className="flex items-center">
                    <motion.div whileHover={{ scale: 1.05 }} className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">✓</span>
                    </motion.div>
                    <p>Access to all tools</p>
                  </div>
                  <div className="flex items-center">
                    <motion.div whileHover={{ scale: 1.05 }} className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">✓</span>
                    </motion.div>
                    <p>Priority processing</p>
                  </div>
                  <div className="flex items-center">
                    <motion.div whileHover={{ scale: 1.05 }} className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">✓</span>
                    </motion.div>
                    <p>Cloud storage for documents</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                >
                  Maybe Later
                </Button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleUpgrade} 
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
                  >
                    Upgrade Now
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;
