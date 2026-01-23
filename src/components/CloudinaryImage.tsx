'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Cloudinary configuration
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'default';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

// Build optimized Cloudinary URL
function getOptimizedUrl(url: string, width: number, height: number): string {
  if (!url) return '';

  // Already a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
    }
    return url;
  }

  // Local or external URL - use Cloudinary fetch
  return `https://res.cloudinary.com/${cloudName}/image/fetch/w_${width},h_${height},c_fill,q_auto,f_auto/${url}`;
}

// Optimized Cloudinary Image Component
export function CloudinaryImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
}: CloudinaryImageProps) {
  return (
    <img
      src={getOptimizedUrl(src, width, height)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

// Image Upload Component
interface ImageUploaderProps {
  onUploadComplete: (url: string, publicId: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  maxFiles?: number;
}

export function ImageUploader({
  onUploadComplete,
  onRemove,
  currentImage,
  maxFiles = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'lapesqueria_products');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        onUploadComplete(data.secure_url, data.public_id);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [maxFiles, onUploadComplete]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative">
          <CloudinaryImage
            src={currentImage}
            alt="Uploaded image"
            width={400}
            height={300}
            className="rounded-lg object-cover w-full h-48"
          />
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-[#FF4500] bg-[#FF4500]/5'
              : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF4500]" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop images here, or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </p>
              <input
                type="file"
                accept="image/*"
                multiple={maxFiles > 1}
                onChange={(e) => handleUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Select Images
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Server-side Cloudinary operations (uses API route internally)
export const cloudinaryServer = {
  upload: async (file: string | Buffer, options: {
    public_id?: string;
    folder?: string;
    transformation?: Array<Record<string, unknown>>;
  } = {}) => {
    const response = await fetch(`/api/cloudinary/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, ...options }),
    });
    return response.json();
  },

  url: (publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}) => {
    const transforms = [];
    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.crop) transforms.push(`c_${options.crop}`);
    if (options.quality) transforms.push(`q_${options.quality}`);
    if (options.format) transforms.push(`f_${options.format}`);
    transforms.push('q_auto', 'f_auto');
    
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
  },
};

export default CloudinaryImage;
