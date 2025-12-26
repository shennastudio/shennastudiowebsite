import type { NextConfig } from "next";
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
};

// Temporarily disabled for testing shadcn/ui: export default withPayload(nextConfig);
export default nextConfig;
