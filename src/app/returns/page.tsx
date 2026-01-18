import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Shenna's Studio',
  description: 'Our 30-day return and exchange policy for ocean-inspired bracelets. Easy returns, customer satisfaction guaranteed.',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-700 py-20 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Your satisfaction is our priority. Learn about our easy return process.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 -mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-12">
            
            {/* 30-Day Policy */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🔄</span> 30-Day Satisfaction Guarantee
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We want you to love your ocean-inspired bracelet as much as we loved creating it.
                We offer a 30-day return policy from the date you receive your order. If you&apos;re not completely satisfied with your ocean-inspired bracelet,
                you can return it for a full refund or exchange.
              </p>
              <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                <h3 className="font-bold text-teal-800 mb-2">Eligibility for Returns:</h3>
                <ul className="space-y-2 text-teal-700 text-sm">
                  <li>• Items must be in original, unused condition</li>
                  <li>• Must include all original packaging and tags</li>
                  <li>• Custom-designed bracelets are final sale (unless defective)</li>
                </ul>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Return Process */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">📦</span> How to Start a Return
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h4 className="font-bold">Contact Us</h4>
                  <p className="text-sm text-gray-600">Email info@shennastudio.com with your order number.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h4 className="font-bold">Pack It Up</h4>
                  <p className="text-sm text-gray-600">We&apos;ll provide you with a return authorization and shipping instructions.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h4 className="font-bold">Get Refunded</h4>
                  <p className="text-sm text-gray-600">Once received, we&apos;ll process your refund within 5-7 business days.</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Exchanges */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🤝</span> Easy Exchanges
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Need a different size or fell in love with a different ocean design?
                Exchanges are free! Just contact us within 30 days, and we&apos;ll help you
                find the perfect piece.
              </p>
            </div>

            {/* Damaged Items */}
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
              <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-3">
                <span className="text-2xl">⚠️</span> Damaged or Wrong Items
              </h2>
              <p className="text-red-700 leading-relaxed text-sm">
                In the rare case your bracelet arrives damaged or we sent the wrong item,
                please contact us immediately. We&apos;ll send a replacement and cover all
                shipping costs to make it right.
              </p>
            </div>
          </div>

          {/* Help CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">Have more questions about returns?</p>
            <Link
              href="/contact"
              className="inline-block bg-white border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-full font-bold hover:bg-teal-50 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
