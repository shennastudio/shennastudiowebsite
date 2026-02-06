import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Terms and Conditions | Shenna&apos;s Studio",
  description: "Terms and Conditions for Shenna&apos;s Studio. Complete legal terms governing purchases and use of our services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-700 py-20 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Complete terms governing your relationship with Shenna&apos;s Studio.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 -mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">

            <p className="italic text-gray-500">Last Updated: December 2025</p>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                These Terms and Conditions (&quot;Terms&quot;) govern your use of the Shenna&apos;s Studio website located at
                shennastudio.com (&quot;Website&quot;) and any related services provided by Shenna&apos;s Studio (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                By accessing or using our Website, you agree to be bound by these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>&quot;Customer&quot;</strong> refers to any individual or entity that purchases products from our Website</li>
                <li><strong>&quot;Products&quot;</strong> refers to handcrafted bracelets and related items sold on our Website</li>
                <li><strong>&quot;Order&quot;</strong> refers to a request to purchase Products through our Website</li>
                <li><strong>&quot;Subscription&quot;</strong> refers to recurring purchase arrangements such as our Ocean Guardian Box</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Eligibility</h2>
              <p>
                You must be at least 18 years old to make purchases on our Website. If you are under 18, you may only
                use our Website with the involvement of a parent or guardian. By using our Website, you represent that
                you meet these requirements.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Product Descriptions</h2>
              <p>
                We strive to display our products as accurately as possible. However, colors may appear differently
                on different devices. As our bracelets are handcrafted, slight variations in appearance are normal
                and part of the unique character of each piece. These variations are not considered defects.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Order Acceptance</h2>
              <p className="mb-4">
                Your order constitutes an offer to purchase our products. We reserve the right to accept or decline
                any order for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product unavailability</li>
                <li>Errors in product or pricing information</li>
                <li>Suspected fraudulent activity</li>
                <li>Shipping restrictions</li>
              </ul>
              <p className="mt-4">
                If we cancel your order after payment, we will issue a full refund to your original payment method.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Subscription Services</h2>
              <p className="mb-4">
                If you subscribe to our Ocean Guardian Box or other subscription services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your subscription will automatically renew each billing period until cancelled</li>
                <li>You may cancel at any time through your account settings</li>
                <li>Cancellations take effect at the end of the current billing period</li>
                <li>No refunds are provided for partial billing periods</li>
                <li>We reserve the right to change subscription prices with 30 days notice</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Custom and Personalized Products</h2>
              <p>
                Custom or personalized products (e.g., engraved items, custom charm selections) are made to your
                specifications and cannot be returned or refunded unless defective. Please review your customization
                carefully before placing your order. We are not responsible for errors in customer-provided text
                or design choices.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Conservation Donations</h2>
              <p>
                A portion of each purchase is donated to marine conservation efforts. These donations are made on
                your behalf and are non-refundable. Donation percentages are stated on each product page. We partner
                with verified conservation organizations and provide transparency reports on our donations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. NFT and Digital Collectibles</h2>
              <p>
                Some products include NFT (Non-Fungible Token) digital collectibles. By purchasing such products,
                you agree to our NFT terms, including that ownership of the NFT does not grant intellectual property
                rights in the underlying artwork. NFT transfers are subject to blockchain transaction fees.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Warranty</h2>
              <p>
                We warrant that our products will be free from defects in materials and workmanship for 90 days
                from the date of delivery. This warranty does not cover normal wear and tear, damage from misuse,
                or damage from exposure to water, chemicals, or extreme conditions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Texas,
                without regard to its conflict of law provisions. Any disputes arising under these Terms shall be
                resolved in the courts of Cameron County, Texas.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <p>
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>Shenna&apos;s Studio</strong></p>
                <p>100 Padre Blvd</p>
                <p>South Padre Island, TX 78597</p>
                <p>Email: info@shennastudio.com</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
