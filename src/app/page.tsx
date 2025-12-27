import Link from 'next/link'
import Image from 'next/image'
import { fetchFeaturedProducts } from '@/app/actions'

export default async function Home() {
  const featuredProducts = await fetchFeaturedProducts(6);

  return (
    <div className="min-h-screen">
      {/* Ocean Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-600 py-20 overflow-hidden">
        {/* Ocean Wave Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-6xl animate-pulse">🌊🌊🐢</div>
          <div className="absolute top-20 right-20 text-5xl animate-bounce">🐋</div>
          <div className="absolute bottom-10 left-1/4 text-4xl animate-pulse">🦈</div>
          <div className="absolute bottom-20 right-10 text-3xl animate-bounce">🐠</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <span className="text-5xl animate-pulse">🌊</span>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                ShennaStudio Ocean Collection
              </h1>
              <span className="text-4xl animate-pulse">🌊</span>
            </div>
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Handcrafted bracelets inspired by the beauty of South Padre Island. Each purchase protects marine life - 10% supports sea turtles, whales, and ocean conservation in Rio Grande Valley.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-block bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                🌊 Shop Ocean Collection
              </Link>
              <Link
                href="/conservation"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all"
              >
                🌊🌊🐢 Sea Turtle Conservation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <span className="text-3xl">🌊🐢</span>
              <h2 className="text-3xl md:text-4xl font-bold text-teal-700">
                Ocean Treasures
              </h2>
              <span className="text-3xl">🐋</span>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked bracelets inspired by sea turtles, whales, and marine life of South Padre Island
            </p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((productDisplay, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all border border-teal-100 group">
                <div className="relative h-64 bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
                  {productDisplay.displayImages?.[0] ? (
                    <Image
                      src={productDisplay.displayImages[0]}
                      alt={productDisplay.product?.name || 'Product'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-cyan-200 rounded-full"></div>
                    </div>
                  )}
                  {productDisplay.product?.featured && (
                    <div className="absolute top-4 right-4 bg-coral-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                      🌊 Featured
                    </div>
                  )}
                  {/* Marine Life Icons */}
                  <div className="absolute top-4 left-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    🌊🐢
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {productDisplay.product?.name || 'Product'}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {productDisplay.product?.description || 'Ocean-inspired bracelet'}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-teal-600">
                      ${productDisplay.displayPrice}
                    </span>
                    <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {productDisplay.displayStock > 0 ? `${productDisplay.displayStock} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                  <Link
                    href={`/products/${productDisplay.product?.id || '1'}`}
                    className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition-all transform hover:scale-105"
                  >
                    🌊 View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Ocean Features Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <span className="text-3xl">🌊🐢</span>
              <h2 className="text-3xl md:text-4xl font-bold text-teal-700">
                Why Choose ShennaStudio Ocean Collection?
              </h2>
              <span className="text-3xl">🐋</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-cyan-100">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌊🐢</span>
              </div>
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Sea Turtle Conservation</h3>
              <p className="text-gray-600">Each purchase directly supports sea turtle protection programs in South Padre Island nesting grounds.</p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-teal-100">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🐋</span>
              </div>
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Ocean-Quality Materials</h3>
              <p className="text-gray-600">Premium, sustainably sourced materials that honor marine life and coastal ecosystems.</p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-teal-100">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🦈</span>
              </div>
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Shark Research Support</h3>
              <p className="text-gray-600">10% of every sale funds important shark research and ocean conservation efforts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ocean Conservation CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <span className="text-4xl">🌊🐢</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Protect Ocean Life with Every Bracelet
            </h2>
            <span className="text-4xl">🐋</span>
          </div>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Each purchase directly supports sea turtle conservation, whale protection, and marine ecosystem restoration in Rio Grande Valley and South Padre Island.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
            >
              🌊 Shop Ocean Collection
            </Link>
            <Link
              href="/conservation"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all"
            >
              🌊🐢 Learn Our Mission
            </Link>
          </div>
          
          {/* Conservation Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl font-bold text-coral-400 mb-2">10%</div>
              <div className="text-white">Donated to Conservation</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl font-bold text-coral-400 mb-2">RGV</div>
              <div className="text-white">Rio Grande Valley Focus</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-3xl font-bold text-coral-400 mb-2">SPI</div>
              <div className="text-white">South Padre Island</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}