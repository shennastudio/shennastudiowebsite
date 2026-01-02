'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface ProductThumbnailProps {
  src: string | null | undefined;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProductThumbnail({ src, alt, size = 'md', className }: ProductThumbnailProps) {
  const [error, setError] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (!src || error) {
    return (
      <div 
        className={cn(
          sizeClasses[size], 
          "bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 shrink-0",
          className
        )}
        title={alt}
      >
        <ImageOff className="w-5 h-5" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        sizeClasses[size],
        "object-cover rounded-lg shrink-0 border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800",
        className
      )}
      onError={() => setError(true)}
    />
  );
}
