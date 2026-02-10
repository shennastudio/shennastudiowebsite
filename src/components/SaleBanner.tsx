'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

export function SaleBanner() {
  const [show, setShow] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('sale-banner-dismissed');
    if (dismissed) {
      setShow(false);
      return;
    }

    // Calculate time until Jan 31, 2026 23:59:59
    const calculateTimeLeft = () => {
      const endDate = new Date('2026-01-31T23:59:59');
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('Sale Ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days} day${days > 1 ? 's' : ''} left!`);
      } else {
        setTimeLeft(`${hours} hour${hours > 1 ? 's' : ''} left!`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('sale-banner-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden border-b border-white/10">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-violet-500/15 to-emerald-400/20" />
        <div className="absolute inset-0 bg-[url('/ocean-pattern.svg')] opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-3 sm:py-4">
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          {/* Icon */}
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-yellow-300" />
          
          {/* Main text */}
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
            <span className="font-bold text-base sm:text-lg">
              🌊 Ocean Treasures Sale!
            </span>
            <span className="text-sm sm:text-base font-medium bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Save 25% with code OCEANSALE25
            </span>
            {timeLeft && (
              <span className="text-xs sm:text-sm font-semibold text-yellow-200 animate-pulse">
                ⏰ {timeLeft}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href="/products"
            className="bg-cyan-500 text-slate-900 hover:bg-cyan-400 px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all hover:scale-105 shadow-[0_12px_30px_rgba(34,211,238,0.35)]"
          >
            Shop Now →
          </Link>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 sm:relative sm:right-auto sm:top-auto sm:translate-y-0 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
