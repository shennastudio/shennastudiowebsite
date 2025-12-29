import Link from 'next/link';
import { fetchProductBySlug } from '@/app/actions';
import { notFound } from 'next/navigation';
import ProductRecommendations from '@/components/ProductRecommendations';
import AddToCartButton from '@/components/AddToCartButton';
import ProductImageGallery from '@/components/ProductImageGallery';

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
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400">
              Home
            </Link>
            <span>›</span>
            <Link href="/products" className="hover:text-teal-600 dark:hover:text-teal-400">
              Products
            </Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-gray-200">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <ProductImageGallery 
              images={displayImages} 
              productName={product.name}
              featured={product.featured} 
            />

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
              </div>

              {/* Price */}
              <div className="border-t dark:border-slate-800 border-b py-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                    ${displayPrice.toFixed(2)}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    displayStock > 0
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {displayStock > 0 ? `${displayStock} in stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Conservation Info */}
              {product.conservationPercentage > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🪼</span>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">
                        Conservation Impact
                      </h3>
                      <p className="text-green-700 dark:text-green-400">
                        {product.conservationPercentage}% of this purchase supports ocean conservation
                      </p>
                    </div>
                  </div>
                  {product.conservationFocus && (
                    <p className="text-sm text-green-800 dark:text-green-300 bg-white/50 dark:bg-black/30 rounded p-3">
                      <strong>Focus:</strong> {product.conservationFocus}
                    </p>
                  )}
                </div>
              )}

              {/* Product Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-lg">Product Details</h3>
                <dl className="space-y-2">
                  <div className="flex gap-3">
                    <dt className="text-gray-600 dark:text-gray-400 min-w-[100px]">SKU:</dt>
                    <dd className="text-gray-900 dark:text-gray-300 font-medium">{variant?.sku || product.slug}</dd>
                  </div>
                  {variant?.size && (
                    <div className="flex gap-3">
                      <dt className="text-gray-600 dark:text-gray-400 min-w-[100px]">Size:</dt>
                      <dd className="text-gray-900 dark:text-gray-300">{variant.size}</dd>
                    </div>
                  )}
                  {variant?.color && (
                    <div className="flex gap-3">
                      <dt className="text-gray-600 dark:text-gray-400 min-w-[100px]">Color:</dt>
                      <dd className="text-gray-900 dark:text-gray-300">{variant.color}</dd>
                    </div>
                  )}
                  {variant?.material && (
                    <div className="flex gap-3">
                      <dt className="text-gray-600 dark:text-gray-400 min-w-[100px]">Material:</dt>
                      <dd className="text-gray-900 dark:text-gray-300">{variant.material}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    sku: variant?.sku || product.slug, // Use variant SKU or fallback to slug
                    basePrice: product.basePrice,
                    images: displayImages.map(url => ({ url })), // Convert string URLs to image objects
                    conservationPercentage: product.conservationPercentage,
                    conservationFocus: product.conservationFocus,
                  }}
                  variant={variant ? {
                    id: variant.id,
                    variantName: variant.name,
                    sku: variant.sku,
                    price: variant.price,
                    stock: variant.stock,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    size: variant.size as any,
                    color: variant.color,
                    material: variant.material,
                    images: displayImages.map(url => ({ url })),
                  } : null}
                  stock={displayStock}
                />
                <Link
                  href="/products"
                  className="block w-full text-center border-2 border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400 py-4 rounded-lg font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                >
                  ← Back to All Products
                </Link>
              </div>

              {/* Features */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span>🌊</span>
                  Why Choose ShennaStudio
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>Handcrafted with care in South Padre Island</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>10% supports marine conservation efforts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>Premium ocean-inspired materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>Free shipping on orders over $50</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like - Product Recommendations */}
      <ProductRecommendations
        productId={product.id}
        limit={6}
        recommendationType="similar"
        title="You May Also Like"
        className="bg-white dark:bg-slate-900"
      />

      {/* Conservation CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-800 dark:to-blue-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="text-3xl">🪼</span>
            <h2 className="text-3xl font-bold text-white">
              Protect Ocean Life with Every Purchase
            </h2>
            <span className="text-3xl">🐙</span>
          </div>
          <p className="text-xl text-cyan-100 dark:text-cyan-200 mb-6">
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