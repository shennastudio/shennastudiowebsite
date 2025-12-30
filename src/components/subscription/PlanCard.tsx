'use client';

import Link from 'next/link';
import { type PlanData } from '@/lib/subscription-data';

// Re-export types for backward compatibility
export type { SubscriptionTier, PlanFeature, PlanData } from '@/lib/subscription-data';
export { SUBSCRIPTION_PLANS } from '@/lib/subscription-data';

interface PlanCardProps {
  plan: PlanData;
  selected?: boolean;
  onSelect?: (plan: PlanData) => void;
}

export default function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  const tierColors = {
    BASIC: {
      bg: 'from-cyan-500 to-teal-500',
      badge: 'bg-cyan-100 text-cyan-800',
      border: 'border-cyan-200',
      button: 'bg-cyan-600 hover:bg-cyan-700',
    },
    PREMIUM: {
      bg: 'from-teal-500 to-emerald-500',
      badge: 'bg-teal-100 text-teal-800',
      border: 'border-teal-200',
      button: 'bg-teal-600 hover:bg-teal-700',
    },
    COLLECTOR: {
      bg: 'from-purple-500 to-pink-500',
      badge: 'bg-purple-100 text-purple-800',
      border: 'border-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
  };

  const colors = tierColors[plan.tier];

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
        selected ? 'ring-4 ring-teal-500 scale-105' : 'hover:scale-102'
      } ${plan.isPopular ? 'shadow-xl' : 'shadow-lg'}`}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-r from-coral-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
            MOST POPULAR
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.bg} p-6 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/20`}>
            {plan.tier}
          </span>
          <span className="text-lg">🌊</span>
        </div>
        <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
        <p className="text-white/80 text-sm">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="bg-white p-6 text-center border-b">
        <div className="flex items-end justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
          <span className="text-gray-500 mb-1">/month</span>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          {plan.braceletsPerMonth} bracelet{plan.braceletsPerMonth > 1 ? 's' : ''} delivered monthly
        </p>
      </div>

      {/* Features */}
      <div className="bg-white p-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {feature.included ? (
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 p-6">
        {onSelect ? (
          <button
            onClick={() => onSelect(plan)}
            className={`w-full ${colors.button} text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105`}
          >
            {selected ? 'Selected' : 'Choose Plan'}
          </button>
        ) : (
          <Link
            href={`/subscribe/${plan.tier.toLowerCase()}`}
            className={`block text-center w-full ${colors.button} text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105`}
          >
            Start Subscription
          </Link>
        )}
      </div>
    </div>
  );
}
