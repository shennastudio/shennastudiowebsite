import Link from 'next/link'
import Image from 'next/image'
import { fetchFeaturedProducts } from '@/app/actions'
import { ProductReviews } from '@/components/ProductReviews'
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner'
import InstagramFeed from '@/components/InstagramFeed'
import ParallaxBanner from '@/components/ParallaxBanner'
import { TestimonialSection } from '@/components/TestimonialSection'

// Force dynamic rendering since we fetch personalized recommendations
export const dynamic = 'force-dynamic'

interface ProductWithScore {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  categoryId: string | null;
  description: string | null;
  conservationFocus: string | null;
  featured: boolean;
  score: number;
  reason?: string;
  variants?: Array<{
    id: string;
    stock: number;
  }>;
  images?: Array<{
    id: string;
    url: string;
    alt: string | null;
    position: number;
  }>;
}

export default async function Home() {
  // Only fetch featured products during build
  const featuredProducts = await fetchFeaturedProducts(6);

  // Recommendations would require client-side session data
  const recommendations: ProductWithScore[] = [];
  const personalized = false;

  return (
    <div className="min-h-screen">
      {/* Ocean Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-600 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ShennaStudio Ocean Collection
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Handcrafted bracelets inspired by the beauty of South Padre Island. Each purchase protects marine life - 10% supports sea turtles, whales, and ocean conservation in Rio Grande Valley.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-block bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                Shop Ocean Collection
              </Link>
              <Link
                href="/conservation"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all"
              >
              Sea Turtle Conservation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reef Parallax Banner */}
      <ParallaxBanner 
        src="/images/reefparallaxscroll.jpg" 
        alt="Vibrant Coral Reef" 
        text="Discover the Reef" 
      />

      {/* Personalized Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-3xl">🌊</span>
                <h2 className="text-3xl md:text-4xl font-bold text-teal-700">
                  {personalized ? 'Recommended For You' : 'Featured Products'}
                </h2>
                <span className="text-3xl">🌊</span>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {personalized
                  ? 'Handpicked ocean treasures based on your style'
                  : 'Discover our most popular ocean-inspired bracelets'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((product) => {
                const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                const firstImage = product.images?.[0]?.url;

                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all border border-teal-100 group">
                    <div className="relative h-64 bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={product.images?.[0]?.alt || product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl opacity-30">🌊🪼</div>
                        </div>
                      )}
                      {product.reason && (
                        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {product.reason}
                        </div>
                      )}
                      {/* Marine Life Icons */}
                      <div className="absolute top-4 left-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.description || 'Ocean-inspired bracelet'}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-teal-600">
                          ${product.basePrice.toFixed(2)}
                        </span>
                        <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800">
                          {totalStock > 0 ? `${totalStock} in stock` : 'Out of Stock'}
                        </span>
                      </div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition-all transform hover:scale-105"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-block border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-50 transition-colors"
              >
                {personalized ? 'Explore More Ocean Treasures' : 'View All Products'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">
              Ocean Treasures
            </h2>
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
                    <div className="absolute top-4 right-4 bg-coral-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
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
                    href={`/products/${productDisplay.product?.slug || 'ocean-wave-bracelet'}`}
                    className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition-all transform hover:scale-105"
                  >
                    View Details
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

      {/* Subscription Banner */}
      <SubscriptionBanner />

      {/* Ocean Features Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">
              Why Choose ShennaStudio Ocean Collection?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-cyan-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Sea Turtle Conservation</h3>
              <p className="text-gray-600">Each purchase directly supports sea turtle protection programs in South Padre Island nesting grounds.</p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-teal-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Ocean-Quality Materials</h3>
              <p className="text-gray-600">Premium, sustainably sourced materials that honor marine life and coastal ecosystems.</p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-teal-100">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Shark Research Support</h3>
              <p className="text-gray-600">10% of every sale funds important shark research and ocean conservation efforts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Product Reviews Section */}
      <ProductReviews productId="homepage" />

      {/* Instagram Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">
              Follow Us on Instagram
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Join our ocean-loving community! See behind-the-scenes bracelet making, conservation updates, and customer photos at @shennastudio
            </p>
            <a
              href="https://www.instagram.com/shennastudio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all transform shadow-xl"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @shennastudio
            </a>
          </div>

          <InstagramFeed username="shennastudio" />
        </div>
      </section>

      {/* Ocean Conservation CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Protect Ocean Life with Every Bracelet
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Each purchase directly supports sea turtle conservation, whale protection, and marine ecosystem restoration in Rio Grande Valley and South Padre Island.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
            >
              Shop Ocean Collection
            </Link>
            <Link
              href="/conservation"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all"
            >
             Learn Our Mission
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

      {/* Turtle Parallax Banner */}
      <ParallaxBanner 
        src="/images/turtleparallax.jpg" 
        alt="Sea Turtle Swimming" 
        text="Protect Our Turtles" 
      />
    </div>
  );
}