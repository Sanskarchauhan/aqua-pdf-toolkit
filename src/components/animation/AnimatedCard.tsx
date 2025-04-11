
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card } from '@/components/ui/card';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
}

const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'fade'
}: AnimatedCardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

  // Animation variants based on the selected animation type
  const getAnimationVariant = () => {
    switch (animation) {
      case 'slide':
        return {
          hidden: { opacity: 0, x: 20 },
          visible: { opacity: 1, x: 0 }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.85 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'bounce':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 10
            }
          }
        };
      case 'fade':
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  const variant = getAnimationVariant();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variant}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      className="h-full"
    >
      <Card className={className}>{children}</Card>
    </motion.div>
  );
};

export default AnimatedCard;
