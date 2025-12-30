'use client';

import { useState } from 'react';

interface NFTBadgeProps {
  variant?: 'default' | 'small' | 'large';
  showTooltip?: boolean;
  isMinted?: boolean;
  tokenId?: string;
  className?: string;
}

export default function NFTBadge({
  variant = 'default',
  showTooltip = true,
  isMinted = false,
  tokenId,
  className = '',
}: NFTBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Size variants
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs gap-1',
    default: 'px-3 py-1 text-sm gap-1.5',
    large: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          inline-flex items-center font-semibold rounded-full
          ${sizeClasses[variant]}
          ${isMinted
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
          }
        `}
      >
        {/* Polygon/NFT Icon */}
        <svg
          className={iconSizes[variant]}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.8 11.5L14.3 8L17.8 4.5L21.3 8L17.8 11.5ZM6.2 19.5L2.7 16L6.2 12.5L9.7 16L6.2 19.5ZM6.2 11.5L2.7 8L6.2 4.5L9.7 8L6.2 11.5ZM12 16L8.5 12.5L12 9L15.5 12.5L12 16Z" />
        </svg>

        <span>{isMinted ? 'NFT Owned' : 'NFT Available'}</span>

        {/* Token ID badge */}
        {isMinted && tokenId && variant !== 'small' && (
          <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
            #{tokenId}
          </span>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.8 11.5L14.3 8L17.8 4.5L21.3 8L17.8 11.5ZM6.2 19.5L2.7 16L6.2 12.5L9.7 16L6.2 19.5ZM6.2 11.5L2.7 8L6.2 4.5L9.7 8L6.2 11.5ZM12 16L8.5 12.5L12 9L15.5 12.5L12 16Z" />
              </svg>
              <span className="font-semibold">Digital Collectible</span>
            </div>
            {isMinted ? (
              <p className="text-gray-300 text-xs leading-relaxed">
                This bracelet comes with an exclusive NFT on Polygon. You own the digital twin of this unique piece.
              </p>
            ) : (
              <p className="text-gray-300 text-xs leading-relaxed">
                Purchase includes an exclusive NFT on Polygon blockchain - proof of authenticity for your handcrafted bracelet.
              </p>
            )}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
