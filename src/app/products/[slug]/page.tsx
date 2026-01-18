import Link from 'next/link';
import { fetchProductBySlug } from '@/app/actions';
import { notFound } from 'next/navigation';
import ProductRecommendations from '@/components/ProductRecommendations';
import ProductVariantSelector from '@/components/ProductVariantSelector';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductViewTracker from '@/components/analytics/ProductViewTracker';
import ProductInventoryAdjuster from '@/components/admin/ProductInventoryAdjuster';

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

  const { product, variant, displayImages } = productData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Analytics Tracking */}
      <ProductViewTracker product={product} variant={variant} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
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
            <ProductImageGallery 
              images={displayImages} 
              productName={product.name}
              featured={product.featured} 
            />

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Price handled by ProductVariantSelector */}


              {/* Conservation Info */}
              {product.conservationPercentage > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🪼</span>
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

              <ProductVariantSelector
                product={product}
                variants={productData.variants}
                initialVariant={variant}
                displayImages={displayImages}
              />

              {/* Admin Inventory Adjustment - Only visible to admin users */}
              <ProductInventoryAdjuster
                productId={product.id}
                productName={product.name}
                variants={productData.variants}
              />

              <div className="space-y-4 pt-4">
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
                  Why Choose Shenna's Studio
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

      {/* You May Also Like - Product Recommendations */}
      <ProductRecommendations
        productId={product.id}
        limit={6}
        recommendationType="similar"
        title="You May Also Like"
        className="bg-white"
      />

      {/* Conservation CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="text-3xl">🪼</span>
            <h2 className="text-3xl font-bold text-white">
              Protect Ocean Life with Every Purchase
            </h2>
            <span className="text-3xl">🐙</span>
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