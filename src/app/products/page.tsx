import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts } from '@/app/actions';
import ParallaxBanner from '@/components/ParallaxBanner';
import AnimatedSection, { StaggeredChildren } from '@/components/AnimatedSection';
import { prisma } from '@/lib/prisma';
import { Tag, Clock, Percent } from 'lucide-react';

interface DiscountCode {
  code: string;
  type: string;
  value: number;
  description: string | null;
  expiresAt: Date | null;
  minPurchaseAmount: number | null;
}

async function getActiveDiscounts(): Promise<DiscountCode[]> {
  try {
    const now = new Date();
    const discounts = await prisma.discountCode.findMany({
      where: {
        isActive: true,
        OR: [
          { startsAt: null },
          { startsAt: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: now } },
            ],
          },
        ],
      },
      select: {
        code: true,
        type: true,
        value: true,
        description: true,
        expiresAt: true,
        minPurchaseAmount: true,
      },
      orderBy: {
        value: 'desc',
      },
      take: 3,
    });
    return discounts;
  } catch {
    return [];
  }
}

function DiscountBanner({ discounts }: { discounts: DiscountCode[] }) {
  if (discounts.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            <span className="font-bold text-sm sm:text-base">Active Discounts:</span>
          </div>
          {discounts.map((discount) => (
            <div
              key={discount.code}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full"
            >
              <Percent className="w-4 h-4" />
              <span className="font-mono font-bold text-sm">{discount.code}</span>
              <span className="text-xs opacity-90">
                {discount.type === 'PERCENTAGE'
                  ? `${discount.value}% OFF`
                  : discount.type === 'FIXED_AMOUNT'
                  ? `$${discount.value} OFF`
                  : 'FREE SHIPPING'}
              </span>
              {discount.expiresAt && (
                <span className="flex items-center gap-1 text-xs opacity-75">
                  <Clock className="w-3 h-3" />
                  Ends {new Date(discount.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProductsPage() {
  const [{ data: products, total }, discounts] = await Promise.all([
    fetchProducts({}, { page: 1, limit: 50 }),
    getActiveDiscounts(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-600 py-12 relative overflow-hidden">
        {/* Animated wave background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23ffffff%22 d=%22M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E')] bg-cover bg-bottom animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection animation="fadeInDown" className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
              Ocean Treasures
            </h1>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
              {total} handcrafted pieces available
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Discount Codes Banner */}
      <DiscountBanner discounts={discounts} />

      {/* Whale Parallax Banner */}
      <ParallaxBanner
        src="/images/shennawhale.jpg"
        alt="Majestic Whale"
        text="Majestic Whale Sharks"
      />

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <AnimatedSection animation="fadeInUp" className="text-center py-20">
              <div className="text-6xl mb-4 animate-bounce">🌊</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                No products available yet
              </h2>
              <p className="text-gray-600">
                Check back soon for our beautiful ocean-inspired bracelets!
              </p>
            </AnimatedSection>
          ) : (
            <StaggeredChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" staggerDelay={100}>
              {products.map((productDisplay) => (
                <div
                  key={productDisplay.product.id}
                  className="stagger-child bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-teal-100 group hover:-translate-y-2"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
                    {productDisplay.displayImages?.[0] ? (
                      <Image
                        src={productDisplay.displayImages[0]}
                        alt={productDisplay.product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl opacity-50">🌊</div>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {productDisplay.product.featured && (
                      <div className="absolute top-4 right-4 bg-coral-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                         Featured
                      </div>
                    )}

                    {/* Stock Badge */}
                    {productDisplay.displayStock === 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </div>
                    )}

                    {/* Marine Life Icon */}
                    <div className="absolute bottom-4 left-4 text-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {productDisplay.product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {productDisplay.product.description || 'Ocean-inspired handcrafted bracelet'}
                    </p>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-teal-600">
                        ${productDisplay.displayPrice.toFixed(2)}
                      </span>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        productDisplay.displayStock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {productDisplay.displayStock > 0
                          ? `${productDisplay.displayStock} in stock`
                          : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Conservation Info */}
                    {productDisplay.product.conservationPercentage > 0 && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-green-800">
                          <span>🪼</span>
                          <span className="font-semibold">
                            {productDisplay.product.conservationPercentage}% supports conservation
                          </span>
                        </div>
                        {productDisplay.product.conservationFocus && (
                          <p className="text-xs text-green-700 mt-1">
                            {productDisplay.product.conservationFocus}
                          </p>
                        )}
                      </div>
                    )}

                    {/* View Details Button */}
                    <Link
                      href={`/products/${productDisplay.product.slug}`}
                      className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg transition-all transform hover:scale-105 font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </StaggeredChildren>
          )}
        </div>
      </section>

      {/* Whale Shark Parallax Banner */}
      <ParallaxBanner 
        src="/images/whaleshark.jpg" 
        alt="Gentle Whale Shark" 
        text="Gentle Giants" 
      />

      {/* Conservation Info Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-12 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-teal-500 animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/2 right-20 w-12 h-12 rounded-full bg-cyan-500 animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-8 h-8 rounded-full bg-blue-500 animate-ping" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection animation="fadeInUp">
            <div className="flex justify-center items-center gap-3 mb-4">
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🐚</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🪼</span>
              <h2 className="text-3xl font-bold text-teal-700">
                Every Purchase Protects Ocean Life
              </h2>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>🐙</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>🐡</span>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              10% of every bracelet sale supports sea turtle conservation, whale protection,
              and marine ecosystem restoration in South Padre Island and Rio Grande Valley.
            </p>
            <Link
              href="/conservation"
              className="inline-block border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-600 hover:text-white transition-all transform hover:scale-105"
            >
              Learn About Our Conservation Mission
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
