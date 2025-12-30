'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { WalletConnect, NFTBadge } from '@/components/nft';
import { NFT_COLLECTION_CONFIG } from '@/lib/web3/config';

// Dynamically import components that use wagmi hooks
const NFTGallery = dynamic(() => import('@/components/nft/NFTGallery'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
  ),
});

const Web3ProviderWrapper = dynamic(
  () => import('@/components/providers/Web3ProviderWrapper'),
  { ssr: false }
);

export default function AccountNFTsPage() {
  return (
    <Web3ProviderWrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <nav className="text-sm text-purple-200 mb-2">
                  <Link href="/account" className="hover:text-white transition-colors">
                    Account
                  </Link>
                  <span className="mx-2">/</span>
                  <span className="text-white">My NFTs</span>
                </nav>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.8 11.5L14.3 8L17.8 4.5L21.3 8L17.8 11.5ZM6.2 19.5L2.7 16L6.2 12.5L9.7 16L6.2 19.5ZM6.2 11.5L2.7 8L6.2 4.5L9.7 8L6.2 11.5ZM12 16L8.5 12.5L12 9L15.5 12.5L12 16Z" />
                  </svg>
                  My Digital Collectibles
                </h1>
                <p className="text-purple-100 mt-2">
                  View and manage your ShennaStudio NFT collection on Polygon
                </p>
              </div>
              <div className="flex items-center gap-4">
                <WalletConnect variant="prominent" showBalance />
              </div>
            </div>
          </div>
        </div>

        {/* Collection Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🌊</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{NFT_COLLECTION_CONFIG.name}</h2>
                  <p className="text-gray-600 text-sm">{NFT_COLLECTION_CONFIG.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {NFT_COLLECTION_CONFIG.maxSupply?.toLocaleString()}
                  </p>
                  <p className="text-gray-500">Max Supply</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-600">{NFT_COLLECTION_CONFIG.royaltyPercent}%</p>
                  <p className="text-gray-500">Royalty</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Gallery */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Collection</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Powered by</span>
              <span className="font-semibold text-purple-600">Polygon</span>
            </div>
          </div>

          <NFTGallery />
        </div>

        {/* How It Works Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              How ShennaStudio NFTs Work
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-3xl mb-4">
                  1️⃣
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Purchase a Bracelet</h3>
                <p className="text-gray-600 text-sm">
                  Select any NFT-enabled bracelet from our collection. Look for the{' '}
                  <NFTBadge variant="small" className="inline-flex mx-1" showTooltip={false} /> badge.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-3xl mb-4">
                  2️⃣
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 text-sm">
                  Connect your crypto wallet (MetaMask, Coinbase, etc.) to receive your NFT after purchase.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-teal-100 rounded-full flex items-center justify-center text-3xl mb-4">
                  3️⃣
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Receive Your NFT</h3>
                <p className="text-gray-600 text-sm">
                  Once your order ships, your exclusive NFT is minted on Polygon and sent to your wallet.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
              <h3 className="font-semibold text-gray-900 mb-4">NFT Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Proof of Authenticity</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Exclusive Discounts</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Early Access to Drops</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Tradeable on OpenSea</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Start Your Collection Today
            </h2>
            <p className="text-purple-100 mb-8">
              Browse our NFT-enabled bracelets and receive your first digital collectible
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Shop NFT Collection
            </Link>
          </div>
        </section>
      </div>
    </Web3ProviderWrapper>
  );
}
