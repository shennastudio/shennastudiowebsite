'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatAddress } from '@/lib/web3/config';

interface WalletConnectProps {
  variant?: 'default' | 'minimal' | 'prominent';
  showBalance?: boolean;
  className?: string;
}

export default function WalletConnect({
  variant = 'default',
  showBalance = true,
  className = '',
}: WalletConnectProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        if (!ready) {
          return (
            <div className={`animate-pulse bg-gray-200 rounded-xl h-10 w-32 ${className}`} />
          );
        }

        if (!connected) {
          // Not connected - show connect button
          return (
            <button
              onClick={openConnectModal}
              className={`
                flex items-center gap-2 font-semibold transition-all transform hover:scale-105
                ${variant === 'prominent'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg'
                  : variant === 'minimal'
                    ? 'text-gray-600 hover:text-gray-900 px-3 py-2'
                    : 'bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl'
                }
                ${className}
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Connect Wallet</span>
            </button>
          );
        }

        // Check for wrong network
        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              className={`
                flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all
                ${className}
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Wrong Network</span>
            </button>
          );
        }

        // Connected - show account info
        return (
          <div className={`flex items-center gap-2 ${className}`}>
            {/* Chain selector (if needed) */}
            {variant !== 'minimal' && (
              <button
                onClick={openChainModal}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                title="Switch network"
              >
                {chain.hasIcon && chain.iconUrl && (
                  <img
                    src={chain.iconUrl}
                    alt={chain.name ?? 'Chain icon'}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                {variant === 'prominent' && (
                  <span className="text-sm font-medium text-gray-700">{chain.name}</span>
                )}
              </button>
            )}

            {/* Account button */}
            <button
              onClick={openAccountModal}
              className={`
                flex items-center gap-2 transition-all
                ${variant === 'prominent'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl shadow-md'
                  : variant === 'minimal'
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'bg-white border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-xl'
                }
              `}
            >
              {/* Balance */}
              {showBalance && account.displayBalance && variant !== 'minimal' && (
                <span className="font-medium text-sm opacity-80">
                  {account.displayBalance}
                </span>
              )}

              {/* Address */}
              <span className={`font-semibold ${variant === 'minimal' ? 'text-sm' : ''}`}>
                {formatAddress(account.address)}
              </span>

              {/* Connected indicator */}
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
