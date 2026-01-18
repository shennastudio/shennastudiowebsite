import { Metadata } from 'next';
import Link from 'next/link';
import PlanCard from '@/components/subscription/PlanCard';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-data';

export const metadata: Metadata = {
  title: 'Ocean Guardian Subscription | Shenna's Studio',
  description: 'Subscribe to receive handcrafted ocean-themed bracelets monthly. Support marine conservation with every delivery.',
};

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
            <span className="text-lg">🌊</span>
            <span>Ocean Guardian Subscription</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Monthly Ocean Magic
          </h1>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Receive handcrafted ocean-inspired bracelets delivered to your door each month.
            Every subscription supports marine conservation in South Padre Island and Rio Grande Valley.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>10% to Conservation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Comparison Note */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              All plans include free shipping and can be cancelled anytime.
              Subscriptions renew automatically each month.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting your monthly ocean treasures is simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-cyan-100 rounded-full flex items-center justify-center text-3xl mb-4">
                1️⃣
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Your Plan</h3>
              <p className="text-gray-600 text-sm">
                Select from Basic, Premium, or Collector tier based on your preferences
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-teal-100 rounded-full flex items-center justify-center text-3xl mb-4">
                2️⃣
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Set Preferences</h3>
              <p className="text-gray-600 text-sm">
                Tell us your size, color preferences, and shipping address
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-4">
                3️⃣
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Monthly Delivery</h3>
              <p className="text-gray-600 text-sm">
                Receive your curated ocean bracelets on the 15th of each month
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-3xl mb-4">
                4️⃣
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Support Conservation</h3>
              <p className="text-gray-600 text-sm">
                10% of your subscription goes directly to marine conservation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                More Than Just Bracelets
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📦</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Curated Selection</h3>
                    <p className="text-gray-600 text-sm">
                      Each box is personally curated with seasonal ocean themes and exclusive designs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Conservation Stories</h3>
                    <p className="text-gray-600 text-sm">
                      Learn about the marine life your purchase is helping protect
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🎁</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Surprise Extras</h3>
                    <p className="text-gray-600 text-sm">
                      Premium and Collector tiers include bonus items like stickers, postcards, and charms
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💚</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Eco-Friendly Packaging</h3>
                    <p className="text-gray-600 text-sm">
                      All packaging is recyclable and made from sustainable materials
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <span className="text-6xl">🎁</span>
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">
                  Sample Box Contents
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Handcrafted bracelet</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Conservation impact card</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Care instructions & bracelet story</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Ocean-themed sticker (Premium+)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                When will I receive my first box?
              </h3>
              <p className="text-gray-600 text-sm">
                Your first box ships within 3-5 business days of subscribing.
                After that, boxes ship on the 15th of each month.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my plan?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time.
                Changes take effect on your next billing cycle.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                How do I cancel my subscription?
              </h3>
              <p className="text-gray-600 text-sm">
                You can cancel anytime from your account settings.
                Your subscription will remain active until the end of your current billing period.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you ship internationally?
              </h3>
              <p className="text-gray-600 text-sm">
                Currently, we only ship within the United States.
                International shipping is coming soon!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Ocean Journey?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Join thousands of ocean lovers supporting marine conservation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#plans"
              className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              View Plans
            </Link>
            <Link
              href="/products"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
