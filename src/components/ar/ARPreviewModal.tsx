'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { type ARModelUrls, isMobileDevice } from '@/lib/ar-utils';

// Dynamically import ARModelViewer to avoid SSR issues
const ARModelViewer = dynamic(() => import('./ARModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

interface ARPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelUrls: ARModelUrls;
  productName: string;
  productImage?: string;
  productPrice?: number;
}

export default function ARPreviewModal({
  isOpen,
  onClose,
  modelUrls,
  productName,
  productImage,
  productPrice,
}: ARPreviewModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [arStatus, setArStatus] = useState<string>('not-presenting');

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-teal-50 to-cyan-50">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{productName}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-teal-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  3D Preview
                </span>
                {isMobile && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    AR Ready
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 3D Viewer */}
          <div className="relative bg-gray-50 p-4">
            <div className="aspect-square max-h-[500px] w-full">
              <ARModelViewer
                modelUrls={modelUrls}
                productName={productName}
                posterImage={productImage}
                showARButton={isMobile}
                onARStatusChange={setArStatus}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Controls & Info */}
          <div className="px-6 py-4 bg-white border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Instructions */}
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600">
                  {isMobile ? (
                    <>Drag to rotate. Pinch to zoom. Tap <strong>&quot;View in AR&quot;</strong> to see it on your wrist.</>
                  ) : (
                    <>Click and drag to rotate. Scroll to zoom. Open on mobile for AR try-on.</>
                  )}
                </p>
                {arStatus === 'object-placed' && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Bracelet placed in AR!
                  </p>
                )}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                {productPrice && (
                  <span className="text-2xl font-bold text-gray-900">
                    ${productPrice.toFixed(2)}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Mobile AR Tip */}
          {!isMobile && (
            <div className="px-6 py-3 bg-gradient-to-r from-cyan-50 to-teal-50 border-t">
              <div className="flex items-center gap-3 text-sm text-teal-700">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>
                  <strong>Pro tip:</strong> View this page on your phone to try the bracelet on using AR!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
