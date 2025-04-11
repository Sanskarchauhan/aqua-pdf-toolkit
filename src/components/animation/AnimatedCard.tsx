
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardProps } from '@/components/ui/card';

interface AnimatedCardProps extends CardProps {
  delay?: number;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, delay = 0, ...props }, ref) => {
    const controls = useAnimation();
    const [cardRef, inView] = useInView({ 
      triggerOnce: true,
      threshold: 0.1
    });

    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);

    const cardVariants = {
      hidden: { 
        opacity: 0, 
        y: 20 
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: delay * 0.1,
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.div
        ref={cardRef}
        initial="hidden"
        animate={controls}
        variants={cardVariants}
        className="h-full"
      >
        <Card ref={ref} className={className} {...props}>
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export default AnimatedCard;
