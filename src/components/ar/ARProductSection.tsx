'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { type ARModelUrls } from '@/lib/ar-utils';
import ARViewButton from './ARViewButton';

// Dynamically import the modal to avoid SSR issues
const ARPreviewModal = dynamic(() => import('./ARPreviewModal'), {
  ssr: false,
});

interface ARProductSectionProps {
  productName: string;
  productImage?: string;
  productPrice?: number;
  modelUrls: ARModelUrls;
  className?: string;
}

/**
 * A section component to add AR functionality to product pages.
 * Shows an AR button and opens a modal with 3D preview.
 */
export default function ARProductSection({
  productName,
  productImage,
  productPrice,
  modelUrls,
  className = '',
}: ARProductSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if we have any valid models
  const hasModels = modelUrls.glb || modelUrls.gltf || modelUrls.usdz;

  if (!hasModels) {
    return null;
  }

  return (
    <>
      {/* AR Section */}
      <div className={`bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">AR Try-On Available</h4>
              <p className="text-sm text-gray-600">See how it looks before you buy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View 3D Button (works on all devices) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View 3D
            </button>

            {/* AR Button (mobile optimized) */}
            <ARViewButton
              modelUrls={modelUrls}
              productName={productName}
              onOpenViewer={() => setIsModalOpen(true)}
              variant="primary"
              size="md"
            />
          </div>
        </div>
      </div>

      {/* AR Preview Modal */}
      <ARPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modelUrls={modelUrls}
        productName={productName}
        productImage={productImage}
        productPrice={productPrice}
      />
    </>
  );
}
