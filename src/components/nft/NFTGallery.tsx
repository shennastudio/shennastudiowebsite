'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { getOpenSeaUrl, getExplorerTokenUrl, formatAddress, NFT_COLLECTION_CONFIG } from '@/lib/web3/config';
import NFTBadge from './NFTBadge';

// Mock NFT data type - would come from blockchain/API in production
interface NFTItem {
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  mintedAt: Date;
  productName?: string;
  orderId?: string;
}

interface NFTGalleryProps {
  nfts?: NFTItem[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

// Sample data for demonstration
const SAMPLE_NFTS: NFTItem[] = [
  {
    tokenId: '1',
    name: 'Ocean Guardian #1',
    description: 'Turquoise Sea Glass bracelet with sea turtle charm',
    imageUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop',
    attributes: [
      { trait_type: 'Collection', value: 'Ocean Series' },
      { trait_type: 'Rarity', value: 'Rare' },
      { trait_type: 'Material', value: 'Sea Glass' },
      { trait_type: 'Charm', value: 'Sea Turtle' },
    ],
    mintedAt: new Date('2024-01-15'),
    productName: 'Turquoise Dream Bracelet',
    orderId: 'SS-2024-001',
  },
  {
    tokenId: '42',
    name: 'Ocean Guardian #42',
    description: 'Sunset coral bracelet with dolphin charm',
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
    attributes: [
      { trait_type: 'Collection', value: 'Sunset Series' },
      { trait_type: 'Rarity', value: 'Epic' },
      { trait_type: 'Material', value: 'Coral Beads' },
      { trait_type: 'Charm', value: 'Dolphin' },
    ],
    mintedAt: new Date('2024-02-20'),
    productName: 'Sunset Wave Bracelet',
    orderId: 'SS-2024-042',
  },
];

export default function NFTGallery({
  nfts = SAMPLE_NFTS,
  isLoading = false,
  emptyMessage = "You don't have any NFTs yet. Purchase a bracelet to receive your first digital collectible!",
  className = '',
}: NFTGalleryProps) {
  const { address, isConnected } = useAccount();
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);

  const contractAddress = NFT_COLLECTION_CONFIG.contractAddress || '0x0000000000000000000000000000000000000000';

  if (!isConnected) {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center ${className}`}>
        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600 text-sm">
          Connect your wallet to view your NFT collection and digital collectibles.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-8 text-center ${className}`}>
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No NFTs Yet</h3>
        <p className="text-gray-600 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {nfts.map((nft) => (
          <div
            key={nft.tokenId}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setSelectedNFT(nft)}
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <NFTBadge variant="small" isMinted tokenId={nft.tokenId} showTooltip={false} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-medium">View Details</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{nft.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{nft.description}</p>

              {/* Attributes preview */}
              <div className="flex flex-wrap gap-1">
                {nft.attributes.slice(0, 2).map((attr, i) => (
                  <span
                    key={i}
                    className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full"
                  >
                    {attr.value}
                  </span>
                ))}
                {nft.attributes.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{nft.attributes.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedNFT(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={() => setSelectedNFT(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedNFT.imageUrl}
                    alt={selectedNFT.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col">
                  <div className="mb-4">
                    <NFTBadge isMinted tokenId={selectedNFT.tokenId} showTooltip={false} />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedNFT.name}</h2>
                  <p className="text-gray-600 text-sm mb-4">{selectedNFT.description}</p>

                  {/* Attributes */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedNFT.attributes.map((attr, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">{attr.trait_type}</p>
                        <p className="text-sm font-medium text-gray-900">{attr.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="border-t pt-4 mt-auto space-y-2">
                    {selectedNFT.productName && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Product</span>
                        <span className="font-medium">{selectedNFT.productName}</span>
                      </div>
                    )}
                    {selectedNFT.orderId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Order</span>
                        <span className="font-medium">{selectedNFT.orderId}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Minted</span>
                      <span className="font-medium">
                        {selectedNFT.mintedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Owner</span>
                      <span className="font-medium font-mono">
                        {formatAddress(address || '')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <a
                      href={getOpenSeaUrl(contractAddress, selectedNFT.tokenId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2 px-4 rounded-xl font-medium text-center transition-colors"
                    >
                      View on OpenSea
                    </a>
                    <a
                      href={getExplorerTokenUrl(contractAddress, selectedNFT.tokenId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl font-medium text-center transition-colors"
                    >
                      View on Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
