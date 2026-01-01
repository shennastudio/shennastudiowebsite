import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | ShennaStudio',
  description: 'Find answers to common questions about our ocean-inspired bracelets, shipping, returns, and conservation efforts.',
}

const faqs = [
  {
    question: 'What materials are used in your bracelets?',
    answer: 'Our bracelets are crafted from high-quality glass beads, natural stones, wooden elements, and genuine crystals. Each piece is handcrafted with ocean-inspired designs that capture the beauty of marine life.'
  },
  {
    question: 'How do I determine my bracelet size?',
    answer: 'Use a flexible measuring tape to measure your wrist at its widest point. Add 0.5-1 inch for comfort. Our sizes range from 6" to 9": Extra Small (6"), Small (6.5"), Medium (7"), Medium Plus (7.5"), Large (8"), Large Plus (8.5"), and Extra Large (9"). Sizes 8-9 are perfect for men\'s wrists. Contact us for custom sizing.'
  },
  {
    question: 'Do you offer custom designs?',
    answer: 'Yes! We love creating custom ocean-inspired pieces. Contact us with your ideas, and we\'ll work with you to design a unique bracelet that captures your personal connection to the ocean.'
  },
  {
    question: 'How much of each purchase goes to conservation?',
    answer: '10% of every bracelet purchase is donated directly to marine life conservation organizations in the Rio Grande Valley and South Padre Island area.'
  },
  {
    question: 'Where do you ship to?',
    answer: 'We currently ship throughout the United States. International shipping is not available at this time, but we\'re working on expanding our reach.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping (5-7 business days) and Express shipping (2-3 business days) are available. All orders are processed within 1-2 business days.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for unused items in original condition. Custom pieces are final sale. Please contact us within 30 days of receiving your order to initiate a return.'
  },
  {
    question: 'How do I care for my bracelet?',
    answer: 'Avoid exposure to water, chemicals, and direct sunlight. Clean gently with a soft cloth. Store in a dry place away from other jewelry to prevent scratching.'
  },
  {
    question: 'Are your bracelets waterproof?',
    answer: 'While our bracelets are durable, we recommend removing them before swimming, bathing, or engaging in water activities to maintain their beauty and integrity.'
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes! We offer ocean-themed gift wrapping options. Select gift wrapping at checkout, and we\'ll beautifully package your bracelet in our signature ocean-inspired wrapping.'
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-cyan-600 py-16 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Find answers to common questions about our bracelets, shipping, and mission.
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="py-16 -mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex gap-4">
                    <span className="text-teal-600">Q:</span>
                    {faq.question}
                  </h3>
                  <div className="flex gap-4">
                    <span className="text-blue-500 font-bold">A:</span>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Didn&apos;t Find Your Answer?</h2>
          <p className="text-lg text-gray-600 mb-8">
            We&apos;re here to help with any questions about our ocean-inspired bracelets or conservation efforts.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-teal-600 text-white px-10 py-4 rounded-full font-bold hover:bg-teal-700 transition-all transform hover:scale-105"
          >
            Contact Customer Support
          </Link>
        </div>
      </section>
    </div>
  )
}
