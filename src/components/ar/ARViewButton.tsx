'use client';

import { useState, useEffect } from 'react';
import { isMobileDevice, supportsAR, isIOSDevice, isAndroidDevice, type ARModelUrls, getBestARModelUrl } from '@/lib/ar-utils';

interface ARViewButtonProps {
  modelUrls: ARModelUrls;
  productName: string;
  onOpenViewer?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function ARViewButton({
  modelUrls,
  productName,
  onOpenViewer,
  className = '',
  variant = 'primary',
  size = 'md',
}: ARViewButtonProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [hasAR, setHasAR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    setHasAR(supportsAR());
  }, []);

  const hasValidModel = getBestARModelUrl(modelUrls) !== null;

  // Don't render if no valid model
  if (!hasValidModel) {
    return null;
  }

  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const handleClick = () => {
    if (!isMobile) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    setIsLoading(true);

    if (onOpenViewer) {
      onOpenViewer();
      setIsLoading(false);
      return;
    }

    // For iOS, use AR Quick Look directly
    if (isIOSDevice() && modelUrls.usdz) {
      const link = document.createElement('a');
      link.rel = 'ar';
      link.href = modelUrls.usdz;
      link.appendChild(document.createElement('img')); // Required for AR Quick Look
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsLoading(false);
      return;
    }

    // For Android, use Scene Viewer
    if (isAndroidDevice() && (modelUrls.glb || modelUrls.gltf)) {
      const modelUrl = modelUrls.glb || modelUrls.gltf;
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl!)}&mode=ar_only&title=${encodeURIComponent(productName)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
      window.location.href = intentUrl;
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          relative overflow-hidden rounded-xl font-semibold transition-all transform hover:scale-105
          flex items-center justify-center gap-2
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${isLoading ? 'opacity-75 cursor-wait' : ''}
          ${!isMobile ? 'opacity-90' : ''}
          ${className}
        `}
      >
        {/* AR Icon */}
        <svg
          className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>

        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Loading AR...
          </span>
        ) : (
          <>
            <span>Try On in AR</span>
            {!isMobile && (
              <span className="text-xs opacity-75 ml-1">(Mobile)</span>
            )}
          </>
        )}

        {/* Shimmer effect */}
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </button>

      {/* Desktop tooltip */}
      {showTooltip && !isMobile && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>AR Try-On is available on mobile devices</span>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* Mobile indicator badge */}
      {isMobile && hasAR && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
}
