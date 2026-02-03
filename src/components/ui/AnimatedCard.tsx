import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn('metric-card', className)}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedMetric({ 
  value, 
  suffix = '', 
  prefix = '',
  className 
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {prefix}{typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : value}{suffix}
      </motion.span>
    </motion.span>
  );
}
