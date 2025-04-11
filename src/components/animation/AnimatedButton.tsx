
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RippleProps {
  x: number;
  y: number;
  size: number;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<RippleProps[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;
      
      // Add new ripple
      const newRipple: RippleProps = { x, y, size };
      setRipples([...ripples, newRipple]);
      
      // Clean up old ripples
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r !== newRipple));
      }, 1000);
      
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="relative overflow-hidden rounded-md"
      >
        <Button 
          ref={ref} 
          className={cn("relative overflow-hidden", className)} 
          onClick={handleClick}
          {...props}
        >
          {ripples.map((ripple, index) => (
            <span
              key={index}
              className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
              style={{
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;
