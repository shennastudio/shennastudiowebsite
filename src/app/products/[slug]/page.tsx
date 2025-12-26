import Link from 'next/link';
import Image from 'next/image';
import { fetchProductBySlug } from '@/app/actions';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productData = await fetchProductBySlug(slug);

  if (!productData) {
    notFound();
  }

  const { product, variant, displayPrice, displayStock, displayImages } = productData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-teal-600">
              Home
            </Link>
            <span>›</span>
            <Link href="/products" className="hover:text-teal-600">
              Products
            </Link>
            <span>›</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg overflow-hidden">
                {displayImages[0] ? (
                  <Image
                    src={displayImages[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-9xl opacity-30">🌊</div>
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-coral-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                    ⭐ Featured
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {displayImages.slice(1, 5).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - Image ${idx + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Price */}
              <div className="border-t border-b py-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-teal-600">
                    ${displayPrice.toFixed(2)}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    displayStock > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {displayStock > 0 ? `${displayStock} in stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Conservation Info */}
              {product.conservationPercentage > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🐢</span>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        Conservation Impact
                      </h3>
                      <p className="text-green-700">
                        {product.conservationPercentage}% of this purchase supports ocean conservation
                      </p>
                    </div>
                  </div>
                  {product.conservationFocus && (
                    <p className="text-sm text-green-800 bg-white/50 rounded p-3">
                      <strong>Focus:</strong> {product.conservationFocus}
                    </p>
                  )}
                </div>
              )}

              {/* Product Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">Product Details</h3>
                <dl className="space-y-2">
                  <div className="flex gap-3">
                    <dt className="text-gray-600 min-w-[100px]">SKU:</dt>
                    <dd className="text-gray-900 font-medium">{variant?.sku || product.slug}</dd>
                  </div>
                  {variant?.size && (
                    <div className="flex gap-3">
                      <dt className="text-gray-600 min-w-[100px]">Size:</dt>
                      <dd className="text-gray-900">{variant.size}</dd>
                    </div>
                  )}
                  {variant?.color && (
                    <div className="flex gap-3">
                      <dt className="text-gray-600 min-w-[100px]">Color:</dt>
                      <dd className="text-gray-900">{variant.color}</dd>
                    </div>
                  )}
                  {variant?.material && (
                    <div className="flex gap-3">
                      <dt className="text-gray-600 min-w-[100px]">Material:</dt>
                      <dd className="text-gray-900">{variant.material}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <button
                  disabled={displayStock === 0}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all transform ${
                    displayStock > 0
                      ? 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {displayStock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                </button>
                <Link
                  href="/products"
                  className="block w-full text-center border-2 border-teal-600 text-teal-600 py-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                >
                  ← Back to All Products
                </Link>
              </div>

              {/* Features */}
              <div className="bg-blue-50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>🌊</span>
                  Why Choose ShennaStudio
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Handcrafted with care in South Padre Island</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>10% supports marine conservation efforts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Premium ocean-inspired materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Free shipping on orders over $50</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="text-3xl">🐢</span>
            <h2 className="text-3xl font-bold text-white">
              Protect Ocean Life with Every Purchase
            </h2>
            <span className="text-3xl">🐋</span>
          </div>
          <p className="text-xl text-cyan-100 mb-6">
            Learn how your purchase supports sea turtles, whales, and marine ecosystems
            in South Padre Island and Rio Grande Valley
          </p>
          <Link
            href="/conservation"
            className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all"
          >
            Our Conservation Mission
          </Link>
        </div>
      </section>
    </div>
  );
}
