'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Import QRCode dynamically to avoid SSR issues
const QRCode = dynamic(() => import('react-qr-code'), { ssr: false });

interface VCardQRCodeProps {
  size?: number;
}

export function VCardQRCode({ size = 120 }: VCardQRCodeProps) {
  const [showQR, setShowQR] = useState(false);

  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Shenna Studio
ORG:Shenna's Studio
TITLE:Custom Bracelets & Marine Conservation
TEL:+1-956-555-0123
URL:https://shennastudio.com
ADR:;;2436 Pablo Kisel Blvd;Brownsville;TX;78520;USA
EMAIL:info@shennastudio.com
NOTE:Handcrafted ocean-inspired bracelets. 10% of every purchase supports marine conservation in South Padre Island.
END:VCARD`;

  return (
    <div className="relative">
      <button
        onClick={() => setShowQR(!showQR)}
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-cyan-700 hover:to-teal-700 transition-all shadow-md text-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        Save Contact
      </button>

      {showQR && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3">
          <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-cyan-200">
            <div className="text-center mb-2">
              <p className="text-sm font-semibold text-gray-800">Scan to Save Contact</p>
              <p className="text-xs text-gray-500">Works on iPhone & Android</p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <QRCode
                value={vCardData}
                size={size}
                level="M"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <button
              onClick={() => {
                const svg = document.querySelector('.qr-code-container svg');
                if (svg) {
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const img = new Image();
                  img.onload = () => {
                    canvas.width = size;
                    canvas.height = size;
                    ctx?.fillRect(0, 0, size, size);
                    ctx?.drawImage(img, 0, 0);
                    const pngFile = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'shenna-studio-contact.png';
                    downloadLink.href = pngFile;
                    downloadLink.click();
                  };
                  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                }
              }}
              className="mt-2 w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function QRCodeWrapper({ value, size = 120 }: { value: string; size?: number }) {
  return (
    <div className="qr-code-container inline-block p-2 bg-white rounded-lg">
      <QRCode
        value={value}
        size={size}
        level="M"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}
