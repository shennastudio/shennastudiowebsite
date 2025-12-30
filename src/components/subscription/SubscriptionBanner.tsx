'use client';

import Link from 'next/link';

export default function SubscriptionBanner() {
  return (
    <section className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-white/90 text-sm font-medium mb-4">
              <span className="text-lg">🌊</span>
              <span>Ocean Guardian Subscription</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Monthly Ocean Magic
            </h2>
            <p className="text-cyan-100 max-w-xl">
              Get handcrafted ocean bracelets delivered monthly. Starting at just $19/month with free shipping.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              <span>View Plans</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free Shipping
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cancel Anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
