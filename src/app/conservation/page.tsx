import { Metadata } from 'next'
import Link from 'next/link'
import DonationMapWrapper from '@/components/conservation/DonationMapWrapper'
import AnimatedSection, { StaggeredChildren } from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: "Ocean Conservation Mission | Shenna's Studio - Marine Life Protection",
  description: "Discover how Shenna's Studio supports marine conservation in South Padre Island and Rio Grande Valley. 10% of every bracelet purchase protects sea turtles, whales, and ocean ecosystems.",
  openGraph: {
    title: "Our Ocean Conservation Mission - Shenna's Studio",
    description: 'Every bracelet purchase helps protect marine life in South Padre Island and the Rio Grande Valley.',
  },
}

export default function ConservationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-700 py-20 relative overflow-hidden">
        {/* Animated wave background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23ffffff%22 d=%22M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E')] bg-cover bg-bottom animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection animation="fadeInDown">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
              Ocean Conservation Mission
            </h1>
            <p className="text-xl text-cyan-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Protecting marine life in Rio Grande Valley and South Padre Island. 10% of every purchase goes directly to conservation efforts.
            </p>
            <div className="flex justify-center items-center gap-8 text-cyan-100 text-lg">
              <div className="hover:scale-110 transition-transform">Sea Turtle Protection</div>
              <div className="hover:scale-110 transition-transform">Whale Conservation</div>
              <div className="hover:scale-110 transition-transform">Shark Research</div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Conservation Map */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Where Your Donations Go
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Explore our interactive map to see exactly where your contributions are making a difference. Click on regions and partners to learn more.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="scaleIn" delay={200}>
            <DonationMapWrapper />
          </AnimatedSection>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Conservation Impact
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Together, we&apos;re making a real difference for marine ecosystems in the Gulf of Mexico.
            </p>
          </AnimatedSection>

          <StaggeredChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={150}>
            <div className="stagger-child text-center bg-white p-8 rounded-xl shadow-md border border-cyan-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="text-4xl font-bold text-teal-600 mb-2">10%</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                Donated to Conservation
              </div>
              <p className="text-gray-600 text-sm">
                Every bracelet purchase supports marine protection programs in Texas.
              </p>
            </div>

            <div className="stagger-child text-center bg-white p-8 rounded-xl shadow-md border border-blue-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="text-4xl font-bold text-teal-600 mb-2">RGV</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                Rio Grande Valley Focus
              </div>
              <p className="text-gray-600 text-sm">
                Supporting local conservation groups protecting Gulf Coast habitats.
              </p>
            </div>

            <div className="stagger-child text-center bg-white p-8 rounded-xl shadow-md border border-teal-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="text-4xl font-bold text-teal-600 mb-2">SPI</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                South Padre Island
              </div>
              <p className="text-gray-600 text-sm">
                Protecting important nesting beaches and coral reef ecosystems.
              </p>
            </div>
          </StaggeredChildren>
        </div>
      </section>

      {/* Conservation Partners */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Conservation Partners
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We work with dedicated organizations protecting marine life in our region.
            </p>
          </AnimatedSection>

          <StaggeredChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={150}>
            <div className="stagger-child bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🌊🪼</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sea Turtle Restoration Project
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Protecting sea turtle nesting sites on South Padre Island and conducting beach cleanup programs throughout the Texas Gulf Coast.
              </p>
              <div className="text-sm text-teal-600 font-medium">
                Focus: Leatherback, Kemps Ridley, Green Sea Turtles
              </div>
            </div>

            <div className="stagger-child bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🐙</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Gulf Marine Mammal Research
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Supporting whale and dolphin research programs in the Gulf of Mexico. Tracking migration patterns and protecting critical habitats.
              </p>
              <div className="text-sm text-teal-600 font-medium">
                Focus: Whale Conservation, Dolphin Protection
              </div>
            </div>

            <div className="stagger-child bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🦈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Shark Conservation Initiative
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Researching shark populations in the Gulf of Mexico and working to reduce harmful fishing practices that threaten these important predators.
              </p>
              <div className="text-sm text-teal-600 font-medium">
                Focus: Shark Population Studies, Sustainable Fishing
              </div>
            </div>
          </StaggeredChildren>
        </div>
      </section>

      {/* How We Help */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Your Purchase Makes a Difference
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedSection animation="fadeInLeft">
              <h3 className="text-xl font-semibold text-teal-700 mb-6">🌊Sea Turtle Protection</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Funding beach monitoring and protection programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Supporting hatchling release programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Funding research on migration patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Beach cleanup and conservation education</span>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection animation="fadeInRight" delay={200}>
              <h3 className="text-xl font-semibold text-teal-700 mb-6">Whale Conservation</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Supporting marine mammal research</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Protecting critical feeding grounds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Whale migration tracking programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Reducing ocean noise pollution</span>
                </li>
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-700 py-16 relative overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/2 right-20 w-16 h-16 rounded-full bg-white animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-12 h-12 rounded-full bg-white animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection animation="fadeInUp">
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className="text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>🌊</span>
              <h2 className="text-3xl font-bold text-white">
                Ready to Support Ocean Conservation?
              </h2>
              <span className="text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌊</span>
            </div>
            <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              Every bracelet you purchase helps protect the marine life we all love. Shop our collection and make a difference today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-110 shadow-lg hover:shadow-xl"
              >
                Shop Ocean Collection
              </Link>
              <Link
                href="/contact"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}