// Web3 Configuration for Polygon Network
import { http } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';
import { createConfig } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Get environment-based chain
const isProduction = process.env.NODE_ENV === 'production';
export const defaultChain = isProduction ? polygon : polygonAmoy;

// WalletConnect project ID - required for WalletConnect v2
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Polygon RPC URLs
const polygonRpcUrl = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com';
const amoyRpcUrl = 'https://rpc-amoy.polygon.technology';

// Configure chains with custom RPC
export const chains = [polygon, polygonAmoy] as const;

// Create wagmi config
export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected(),
    ...(walletConnectProjectId
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            metadata: {
              name: 'ShennaStudio',
              description: 'Ocean-themed artisan bracelets with NFT collectibles',
              url: 'https://shennastudio.com',
              icons: ['https://shennastudio.com/icon.png'],
            },
          }),
        ]
      : []),
    coinbaseWallet({
      appName: 'ShennaStudio',
      appLogoUrl: 'https://shennastudio.com/icon.png',
    }),
  ],
  transports: {
    [polygon.id]: http(polygonRpcUrl),
    [polygonAmoy.id]: http(amoyRpcUrl),
  },
});

// NFT Collection configuration
export interface NFTCollectionConfig {
  name: string;
  symbol: string;
  contractAddress?: string;
  maxSupply?: number;
  royaltyPercent: number;
  description: string;
}

export const NFT_COLLECTION_CONFIG: NFTCollectionConfig = {
  name: 'ShennaStudio Ocean Guardians',
  symbol: 'SSOG',
  contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
  maxSupply: 10000,
  royaltyPercent: 5, // 5% royalty on secondary sales
  description: 'Exclusive digital collectibles representing handcrafted ocean-themed bracelets. Each NFT serves as proof of authenticity and ownership.',
};

// NFT Metadata base URI (typically IPFS or similar)
export const NFT_METADATA_BASE_URI = process.env.NEXT_PUBLIC_NFT_METADATA_BASE_URI || 'ipfs://';

// Explorer URLs
export const getExplorerUrl = (chainId: number): string => {
  switch (chainId) {
    case polygon.id:
      return 'https://polygonscan.com';
    case polygonAmoy.id:
      return 'https://amoy.polygonscan.com';
    default:
      return 'https://polygonscan.com';
  }
};

export const getExplorerTxUrl = (txHash: string, chainId: number = polygon.id): string => {
  return `${getExplorerUrl(chainId)}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (address: string, chainId: number = polygon.id): string => {
  return `${getExplorerUrl(chainId)}/address/${address}`;
};

export const getExplorerTokenUrl = (contractAddress: string, tokenId: string, chainId: number = polygon.id): string => {
  return `${getExplorerUrl(chainId)}/token/${contractAddress}?a=${tokenId}`;
};

// OpenSea URLs
export const getOpenSeaUrl = (contractAddress: string, tokenId: string, isTestnet: boolean = false): string => {
  if (isTestnet) {
    return `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}`;
  }
  return `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`;
};

// Utility to format addresses
export const formatAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Check if wallet is connected
export const isWalletConnected = (address: string | undefined): boolean => {
  return !!address && address.length === 42 && address.startsWith('0x');
};
