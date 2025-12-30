'use client';

import { useEffect, useRef, useState } from 'react';
import { BRACELET_AR_SETTINGS, type ARModelUrls } from '@/lib/ar-utils';

// Extend JSX to include model-viewer custom element
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          poster?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
          'camera-controls'?: boolean;
          'touch-action'?: string;
          'camera-orbit'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'field-of-view'?: string;
          exposure?: number;
          'shadow-intensity'?: number;
          'shadow-softness'?: number;
          'auto-rotate'?: boolean;
          'rotation-per-second'?: string;
          'environment-image'?: string;
          'skybox-image'?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          reveal?: 'auto' | 'interaction' | 'manual';
        },
        HTMLElement
      >;
    }
  }
}

interface ARModelViewerProps {
  modelUrls: ARModelUrls;
  productName: string;
  posterImage?: string;
  className?: string;
  autoRotate?: boolean;
  showARButton?: boolean;
  onARStatusChange?: (status: 'not-presenting' | 'session-started' | 'object-placed' | 'failed') => void;
  onLoadProgress?: (progress: number) => void;
}

export default function ARModelViewer({
  modelUrls,
  productName,
  posterImage,
  className = '',
  autoRotate = true,
  showARButton = true,
  onARStatusChange,
  onLoadProgress,
}: ARModelViewerProps) {
  const modelViewerRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load model-viewer script dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already loaded
    if (customElements.get('model-viewer')) {
      setScriptLoaded(true);
      return;
    }

    // Load the model-viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Failed to load AR viewer');
    document.head.appendChild(script);

    return () => {
      // Don't remove script as it's shared
    };
  }, []);

  // Set up event listeners when model-viewer is ready
  useEffect(() => {
    if (!scriptLoaded || !modelViewerRef.current) return;

    const viewer = modelViewerRef.current;

    const handleLoad = () => {
      setIsLoaded(true);
      setLoadProgress(100);
    };

    const handleProgress = (event: Event) => {
      const progressEvent = event as CustomEvent<{ totalProgress: number }>;
      const progress = Math.round(progressEvent.detail.totalProgress * 100);
      setLoadProgress(progress);
      onLoadProgress?.(progress);
    };

    const handleError = () => {
      setError('Failed to load 3D model');
    };

    const handleARStatus = (event: Event) => {
      const statusEvent = event as CustomEvent<{ status: 'not-presenting' | 'session-started' | 'object-placed' | 'failed' }>;
      onARStatusChange?.(statusEvent.detail.status);
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('progress', handleProgress);
    viewer.addEventListener('error', handleError);
    viewer.addEventListener('ar-status', handleARStatus);

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('progress', handleProgress);
      viewer.removeEventListener('error', handleError);
      viewer.removeEventListener('ar-status', handleARStatus);
    };
  }, [scriptLoaded, onARStatusChange, onLoadProgress]);

  // Get the best model source
  const modelSrc = modelUrls.glb || modelUrls.gltf;
  const iosSrc = modelUrls.usdz;

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}>
        <div className="text-center p-8">
          <span className="text-4xl mb-4 block">3D</span>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!modelSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}>
        <div className="text-center p-8">
          <span className="text-4xl mb-4 block">3D</span>
          <p className="text-gray-600 text-sm">No 3D model available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading indicator */}
      {!isLoaded && scriptLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading 3D model... {loadProgress}%</p>
          </div>
        </div>
      )}

      {/* Script loading indicator */}
      {!scriptLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Initializing AR viewer...</p>
          </div>
        </div>
      )}

      {scriptLoaded && (
        <model-viewer
          ref={modelViewerRef}
          src={modelSrc}
          ios-src={iosSrc}
          poster={posterImage}
          alt={`3D model of ${productName}`}
          ar={showARButton}
          ar-modes="webxr scene-viewer quick-look"
          ar-scale={BRACELET_AR_SETTINGS.arScale}
          ar-placement={BRACELET_AR_SETTINGS.arPlacement}
          camera-controls
          touch-action="pan-y"
          camera-orbit={BRACELET_AR_SETTINGS.cameraOrbit}
          min-camera-orbit={BRACELET_AR_SETTINGS.minCameraOrbit}
          max-camera-orbit={BRACELET_AR_SETTINGS.maxCameraOrbit}
          field-of-view={BRACELET_AR_SETTINGS.fieldOfView}
          exposure={BRACELET_AR_SETTINGS.exposure}
          shadow-intensity={BRACELET_AR_SETTINGS.shadowIntensity}
          shadow-softness={BRACELET_AR_SETTINGS.shadowSoftness}
          auto-rotate={autoRotate}
          rotation-per-second="30deg"
          loading="eager"
          reveal="auto"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '300px',
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem',
          }}
        >
          {/* AR Button Slot */}
          {showARButton && (
            <button
              slot="ar-button"
              className="absolute bottom-4 right-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              View in AR
            </button>
          )}

          {/* Poster Image Slot */}
          {posterImage && (
            <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={posterImage} alt={productName} className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </model-viewer>
      )}

      {/* AR Instructions (shown on mobile) */}
      {showARButton && isLoaded && (
        <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none">
          <p className="text-xs text-gray-500 bg-white/80 backdrop-blur-sm inline-block px-3 py-1 rounded-full">
            Tap &quot;View in AR&quot; to try it on
          </p>
        </div>
      )}
    </div>
  );
}
