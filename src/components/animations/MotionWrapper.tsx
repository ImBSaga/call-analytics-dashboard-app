'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export const FadeIn = ({ children, delay = 0, ...props }: MotionWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, ...props }: MotionWrapperProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, ...props }: MotionWrapperProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
