import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Shipping Information | Shenna's Studio",
  description: 'Fast and reliable shipping for ocean-inspired bracelets. Free shipping on orders over $50.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-700 py-20 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Information</h1>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Fast and secure shipping from our ocean-inspired studio in Texas.
          </p>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-8 border-teal-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Standard Shipping</h2>
                  <p className="text-teal-600 font-medium">Free on orders over $50</p>
                </div>
                <span className="text-3xl">🚛</span>
              </div>
              <ul className="space-y-4 text-gray-600 mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-teal-500">✓</span> Delivery in 5-7 business days
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-teal-500">✓</span> $5.95 flat rate for orders under $50
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-teal-500">✓</span> Fully tracked journey
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-8 border-blue-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Express Shipping</h2>
                  <p className="text-blue-600 font-medium">Priority handling</p>
                </div>
                <span className="text-3xl">✈️</span>
              </div>
              <ul className="space-y-4 text-gray-600 mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">✓</span> Delivery in 2-3 business days
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">✓</span> $12.95 flat rate
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">✓</span> Priority order processing
                </li>
              </ul>
            </div>
          </div>

          {/* Processing Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">🔨</span> Handcrafting & Processing
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Because each Shenna's Studio bracelet is carefully handcrafted, please allow 
                    <span className="font-bold text-gray-900"> 1-2 business days</span> for 
                    processing before your order ships.
                  </p>
                  <p>
                    During peak seasons or major ocean conservation events, processing
                    time may be slightly longer. We&apos;ll always keep you updated on
                    your order&apos;s status.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">🐚</span> Custom Orders
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Custom ocean-inspired designs require additional time for artistic 
                  creation and approval. 
                </p>
                <ul className="space-y-2 text-sm text-gray-500 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <li>• Custom design time: 3-5 business days</li>
                  <li>• You&apos;ll receive photos for approval</li>
                  <li>• Ships immediately after approval</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl mb-4">🌎</div>
              <h3 className="font-bold mb-2">US Shipping Only</h3>
              <p className="text-sm text-gray-600">International shipping is not available at this time, but we&apos;re working on expanding our ocean-inspired reach!</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-bold mb-2">Order Tracking</h3>
              <p className="text-sm text-gray-600">All shipments include tracking information. You&apos;ll receive an email with tracking details once your order ships. Track your package&apos;s journey to your doorstep.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="font-bold mb-2">P.O. Boxes</h3>
              <p className="text-sm text-gray-600">Yes! We ship to P.O. Boxes and military addresses (APO/FPO) via standard shipping.</p>
            </div>
          </div>

          {/* Help CTA */}
          <div className="mt-16 bg-teal-600 rounded-3xl p-10 text-center text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Need Help with Shipping?</h2>
            <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
              Need help with shipping options or have special delivery requirements? We&apos;re here to help!
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-teal-600 px-10 py-4 rounded-full font-bold hover:bg-teal-50 transition-all transform hover:scale-105"
            >
              Contact Shipping Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
