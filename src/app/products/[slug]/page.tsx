import { Metadata } from 'next';
import Link from 'next/link';
import { fetchProductBySlug } from '@/app/actions';
import { notFound } from 'next/navigation';
import ProductRecommendations from '@/components/ProductRecommendations';
import ProductVariantSelector from '@/components/ProductVariantSelector';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductViewTracker from '@/components/analytics/ProductViewTracker';
import ProductInventoryAdjuster from '@/components/admin/ProductInventoryAdjuster';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import SocialShare from '@/components/SocialShare';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productData = await fetchProductBySlug(slug);

  if (!productData) {
    return { title: "Product Not Found | Shenna's Studio" };
  }

  const { product, displayPrice, displayImages, displayStock } = productData;
  const imageUrl = displayImages[0] || '/images/shenna-studio-logo.png';

  return {
    title: `${product.name} | Shenna's Studio - Handcrafted Ocean Jewelry`,
    description: product.description || `Shop ${product.name} - handcrafted ocean-inspired jewelry from Shenna's Studio in Brownsville, TX. 10% supports marine conservation.`,
    openGraph: {
      title: product.name,
      description: product.description || `Handcrafted ${product.name} from Shenna's Studio`,
      type: 'website',
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Handcrafted ocean jewelry - ${product.name}`,
      images: [imageUrl],
    },
    other: {
      'product:price:amount': displayPrice.toFixed(2),
      'product:price:currency': 'USD',
      'product:availability': displayStock > 0 ? 'in stock' : 'out of stock',
    },
  };
}

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

  const { product, variant, displayImages, displayPrice, displayStock } = productData;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: displayImages,
    brand: { '@type': 'Brand', name: "Shenna's Studio" },
    sku: variant?.sku || product.slug,
    offers: {
      '@type': 'Offer',
      url: `https://shennastudio.com/products/${product.slug}`,
      priceCurrency: 'USD',
      price: displayPrice.toFixed(2),
      availability: displayStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: "Shenna's Studio" },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://shennastudio.com' },
          { name: 'Products', url: 'https://shennastudio.com/products' },
          { name: product.name, url: `https://shennastudio.com/products/${product.slug}` },
        ]}
      />
      {/* Analytics Tracking */}
      <ProductViewTracker product={product} variant={variant} />

      {/* Breadcrumb */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-teal-400 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link href="/products" className="hover:text-teal-400 transition-colors">
              Products
            </Link>
            <span>›</span>
            <span className="text-white font-medium">{product.name}</span>
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
                <h1 className="text-4xl font-bold text-white mb-2">
                  {product.name}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Conservation Info */}
              {product.conservationPercentage > 0 && (
                <div className="bg-gradient-to-r from-teal-900/30 to-blue-900/30 border border-teal-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🪼</span>
                    <div>
                      <h3 className="text-lg font-semibold text-teal-300">
                        Conservation Impact
                      </h3>
                      <p className="text-teal-400/90">
                        {product.conservationPercentage}% of this purchase supports ocean conservation
                      </p>
                    </div>
                  </div>
                  {product.conservationFocus && (
                    <p className="text-sm text-teal-300 bg-teal-950/50 rounded p-3 border border-teal-900">
                      <strong className="text-teal-200">Focus:</strong> {product.conservationFocus}
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

              {/* Social Sharing */}
              <div className="pt-4 border-t border-slate-800">
                <SocialShare
                  url={`/products/${product.slug}`}
                  title={product.name}
                  description={product.description || undefined}
                  image={displayImages[0]}
                />
              </div>

              <div className="space-y-4 pt-4">
                <Link
                  href="/products"
                  className="block w-full text-center border-2 border-teal-600 text-teal-400 py-4 rounded-lg font-semibold hover:bg-teal-900/20 transition-colors"
                >
                  ← Back to All Products
                </Link>
              </div>

              {/* Features */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-white flex items-center gap-2 text-lg">
                  <span>🌊</span>
                  Why Choose Shenna&apos;s Studio
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-0.5">✓</span>
                    <span>Handcrafted with care in South Padre Island</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-0.5">✓</span>
                    <span>10% supports marine conservation efforts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-0.5">✓</span>
                    <span>Premium ocean-inspired materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-0.5">✓</span>
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
        className="bg-slate-900 border-t border-slate-800"
      />

      {/* Conservation CTA */}
      <section className="bg-gradient-to-r from-teal-900 to-blue-900 py-12 border-t border-slate-800">
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
            className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-teal-900 transition-all"
          >
            Our Conservation Mission
          </Link>
        </div>
      </section>
    </div>
  );
}