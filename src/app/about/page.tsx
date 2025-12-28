import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-5xl animate-pulse">🌊</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Our Ocean Conservation Mission
            </h1>
            <span className="text-5xl animate-pulse">🌊🪼</span>
          </div>
          <p className="text-xl text-cyan-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            ShennaStudio was born from love of ocean and commitment to protecting marine life in Rio Grande Valley and South Padre Island.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-teal-700 mb-6">
                🌊🪼 How ShennaStudio Began
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2024, ShennaStudio started as a small family business creating handmade bracelets in our home studio in South Texas. 
                  What began as a creative outlet quickly evolved into a mission-driven enterprise when we witnessed firsthand 
                  the impact of plastic pollution and climate change on our local marine ecosystems.
                </p>
                <p>
                  Living near South Padre Island, weweve seen the beauty of sea turtle nesting grounds, the majesty of 
                  dolphins playing in the Gulf, and the vital importance of coral reef preservation. Each bracelet we create 
                  tells a story of these ocean treasures we&apos;re fighting to protect.
                </p>
                <p>
                  <strong className="text-teal-600">10% of every purchase</strong> goes directly to marine conservation 
                  organizations working in Rio Grande Valley and South Padre Island. Weve partnered with local groups 
                  protecting nesting sea turtles, researching whale migration patterns, and restoring coral reefs.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🐙</div>
                  <div className="text-2xl font-bold text-teal-700 mb-2">
                    Every Bracelet Makes a Difference
                  </div>
                  <div className="text-lg text-gray-600">
                    Supporting Ocean Conservation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Conservation Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Together with our customers, wewere making real difference for marine life in Texas Gulf Coast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-xl border border-cyan-100">
              <div className="text-4xl mb-4">🌊🪼</div>
              <h3 className="text-xl font-bold text-teal-700 mb-2">
                Sea Turtle Protection
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Supporting nesting beach protection and hatchling release programs in South Padre Island. 
                Funding research on leatherback and Kemps Ridley sea turtles.
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100">
              <div className="text-4xl mb-4">🐙</div>
              <h3 className="text-xl font-bold text-teal-700 mb-2">
                Whale Conservation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Supporting marine mammal research and protection programs in the Gulf of Mexico. 
                Helping track whale migration and protect critical feeding grounds.
              </p>
            </div>

            <div className="text-center bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-xl border border-teal-100">
              <div className="text-4xl mb-4">🦈</div>
              <h3 className="text-xl font-bold text-teal-700 mb-2">
                Ocean Ecosystem Health
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Funding coral reef restoration, beach cleanup initiatives, and ocean education programs 
                throughout Rio Grande Valley communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-r from-gray-50 to-cyan-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-teal-700 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Every decision we make is guided by our commitment to ocean conservation and sustainable practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ocean First</h3>
              <p className="text-gray-600">
                Every business decision prioritizes ocean health and marine conservation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                We track and share exactly how your purchases support conservation efforts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♻️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Eco-friendly materials and minimal waste packaging in everything we create.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Supporting local conservation groups and educating our communities about marine protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Ocean Conservation Mission
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Every bracelet you purchase helps protect the marine life we all love. 
            Shop our ocean collection and be part of the solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-cyan-50 transition-all transform hover:scale-105"
            >
              🌊 Shop Ocean Collection
            </Link>
            <Link
              href="/conservation"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all"
            >
              🌊🪼 Learn About Conservation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}