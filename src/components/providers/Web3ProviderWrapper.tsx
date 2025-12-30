'use client';

import dynamic from 'next/dynamic';
import { type ReactNode } from 'react';

// Dynamically import Web3Provider to avoid SSR issues with wagmi/rainbowkit
const Web3Provider = dynamic(() => import('./Web3Provider'), {
  ssr: false,
  loading: () => null, // Don't show loading state, just render children
});

interface Web3ProviderWrapperProps {
  children: ReactNode;
}

export default function Web3ProviderWrapper({ children }: Web3ProviderWrapperProps) {
  return <Web3Provider>{children}</Web3Provider>;
}
