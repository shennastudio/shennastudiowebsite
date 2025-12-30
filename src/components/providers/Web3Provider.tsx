'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  type Theme,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { wagmiConfig, chains } from '@/lib/web3/config';

// Custom RainbowKit theme to match ShennaStudio branding
const shennaTheme: Theme = {
  ...lightTheme(),
  colors: {
    ...lightTheme().colors,
    accentColor: '#0d9488', // teal-600
    accentColorForeground: 'white',
    connectButtonBackground: '#f0fdfa', // teal-50
    connectButtonText: '#0d9488', // teal-600
    modalBackground: '#ffffff',
    modalBorder: '#e5e7eb', // gray-200
    modalText: '#1f2937', // gray-800
    modalTextSecondary: '#6b7280', // gray-500
  },
  radii: {
    ...lightTheme().radii,
    actionButton: '12px',
    connectButton: '12px',
    menuButton: '12px',
    modal: '16px',
    modalMobile: '16px',
  },
  fonts: {
    body: 'inherit',
  },
};

interface Web3ProviderProps {
  children: ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  // Prevent hydration errors by only rendering on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={shennaTheme}
          modalSize="compact"
          appInfo={{
            appName: 'ShennaStudio',
            learnMoreUrl: 'https://shennastudio.com/about',
            disclaimer: ({ Text, Link }) => (
              <Text>
                By connecting your wallet, you agree to the{' '}
                <Link href="/terms">Terms of Service</Link> and{' '}
                <Link href="/privacy">Privacy Policy</Link>.
              </Text>
            ),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
