import type { NextConfig } from "next";
import withMDX from '@next/mdx';
// Temporarily disabled: import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'jeuimbhpmse1l96a.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'y3lwsevd8tgknadr.public.blob.vercel-storage.com',
      },
    ],
  },
  // Enable standalone output for Docker deployment
  output: 'standalone',
  // Ignore ESLint errors during build for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sharp', 'pino', 'pino-pretty'],
  // Fix for web3 optional dependencies that aren't available in browser
  webpack: (config, { isServer }) => {
    // Ignore optional React Native dependencies from MetaMask SDK
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    // Ignore optional dependencies that cause warnings
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

const withMDXConfig = withMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Temporarily disabled for testing shadcn/ui: export default withPayload(withMDXConfig(nextConfig));
export default withMDXConfig(nextConfig);
