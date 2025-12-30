'use client';

import dynamic from 'next/dynamic';

// Dynamic import for Leaflet map (doesn't work with SSR)
const DonationMap = dynamic(
  () => import('./DonationMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-4xl mb-4">🗺️</div>
          <p className="text-gray-600">Loading conservation map...</p>
        </div>
      </div>
    )
  }
);

export default function DonationMapWrapper() {
  return <DonationMap />;
}
