import Link from 'next/link'
import AnimatedSection, { StaggeredChildren } from '@/components/AnimatedSection'
import ParallaxBanner from '@/components/ParallaxBanner'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-600 py-20 relative overflow-hidden">
        {/* Animated wave background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23ffffff%22 d=%22M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E')] bg-cover bg-bottom animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection animation="fadeInDown">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
              Our Ocean Conservation Mission
            </h1>
            <p className="text-xl text-cyan-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              ShennaStudio was born from love of ocean and commitment to protecting marine life in Rio Grande Valley and South Padre Island.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fadeInLeft">
              <h2 className="text-3xl font-bold text-teal-700 mb-6">
               How ShennaStudio Began
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2025, ShennaStudio started as a small family business creating handmade bracelets in our home studio in South Texas. 
                  What began as a creative outlet quickly evolved into a mission-driven enterprise when we witnessed firsthand 
                  the impact of plastic pollution and climate change on our local marine ecosystems.
                </p>
                <p>
                  Living near South Padre Island, we&apos;ve seen the beauty of sea turtle nesting grounds, the majesty of 
                  dolphins playing in the Gulf, and the vital importance of coral reef preservation. Each bracelet we create 
                  tells a story of these ocean treasures we&apos;re fighting to protect.
                </p>
                <p>
                  <strong className="text-teal-600">10% of every purchase</strong> goes directly to marine conservation 
                  organizations working in Rio Grande Valley and South Padre Island. We&apos;ve partnered with local groups 
                  protecting nesting sea turtles, researching whale migration patterns, and restoring coral reefs.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeInRight" delay={200}>
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">🐙</div>
                  <div className="text-2xl font-bold text-teal-700 mb-2">
                    Every Bracelet Makes a Difference
                  </div>
                  <div className="text-lg text-gray-600">
                    Supporting Ocean Conservation
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Dolphin Parallax Banner */}
      <ParallaxBanner 
        src="/images/dolphin.jpg" 
        alt="Dolphin swimming" 
        text="Protecting Our Dolphins" 
      />

      {/* Our Impact Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Conservation Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Together with our customers, we&apos;re making real difference for marine life in Texas Gulf Coast.
            </p>
          </AnimatedSection>

          <StaggeredChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={150}>
            <div className="stagger-child text-center bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-xl border border-cyan-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">🌊🪼</div>
              <h3 className="text-xl font-bold text-teal-700 mb-2">
                Sea Turtle Protection
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Supporting nesting beach protection and hatchling release programs in South Padre Island. 
                Funding research on leatherback and Kemps Ridley sea turtles.
              </p>
            </div>

            <div className="stagger-child text-center bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">🐙</div>
              <h3 className="text-xl font-bold text-teal-700 mb-2">
                Whale Conservation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Supporting marine mammal research and protection programs in the Gulf of Mexico.
                Helping track whale migration and protect critical feeding grounds.
              </p>
            </div>

            <div className="stagger-child text-center bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-xl border border-teal-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">🦈</div>
              <h3 className="text-xl font-bold text-teal-700 mb-2">
                Ocean Ecosystem Health
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Funding coral reef restoration, beach cleanup initiatives, and ocean education programs
                throughout Rio Grande Valley communities.
              </p>
            </div>
          </StaggeredChildren>
        </div>
      </section>

      {/* Coral Parallax Banner */}
      <ParallaxBanner 
        src="/images/coral.jpg" 
        alt="Coral reef" 
        text="Restoring Our Reefs" 
      />

      {/* Values Section */}
      <section className="bg-gradient-to-r from-gray-50 to-cyan-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-teal-700 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Every decision we make is guided by our commitment to ocean conservation and sustainable practices.
            </p>
          </AnimatedSection>

          <StaggeredChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={100}>
            <div className="stagger-child text-center group">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🌊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ocean First</h3>
              <p className="text-gray-600">
                Every business decision prioritizes ocean health and marine conservation.
              </p>
            </div>

            <div className="stagger-child text-center group">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                We track and share exactly how your purchases support conservation efforts.
              </p>
            </div>

            <div className="stagger-child text-center group">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">♻️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Eco-friendly materials and minimal waste packaging in everything we create.
              </p>
            </div>

            <div className="stagger-child text-center group">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Supporting local conservation groups and educating our communities about marine protection.
              </p>
            </div>
          </StaggeredChildren>
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
                className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-cyan-50 transition-all transform hover:scale-110 shadow-lg hover:shadow-xl"
              >
                Shop Ocean Collection
              </Link>
              <Link
                href="/conservation"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all hover:scale-105"
              >
               Learn About Conservation
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}