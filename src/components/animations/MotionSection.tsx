'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  variants: Variants;
  viewportAmount?: number;
  once?: boolean;
}

export default function MotionSection({
  children,
  className,
  variants,
  viewportAmount = 0.2,
  once = true,
}: MotionSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: viewportAmount, once }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
