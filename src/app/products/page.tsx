import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts } from '@/app/actions';

export default async function ProductsPage() {
  const { data: products, total } = await fetchProducts({}, { page: 1, limit: 50 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <span className="text-4xl">🌊</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                All Ocean Bracelets
              </h1>
              <span className="text-4xl">🌊</span>
            </div>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
              {total} handcrafted pieces available
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌊</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                No products available yet
              </h2>
              <p className="text-gray-600">
                Check back soon for our beautiful ocean-inspired bracelets!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((productDisplay) => (
                <div
                  key={productDisplay.product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all border border-teal-100 group"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
                    {productDisplay.displayImages?.[0] ? (
                      <Image
                        src={productDisplay.displayImages[0]}
                        alt={productDisplay.product.name}
                        fill
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
                        ⭐ Featured
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
                      🐢
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
                          <span>🐢</span>
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
                      🌊 View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Conservation Info Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="text-3xl">🐢</span>
            <h2 className="text-3xl font-bold text-teal-700">
              Every Purchase Protects Ocean Life
            </h2>
            <span className="text-3xl">🐋</span>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            10% of every bracelet sale supports sea turtle conservation, whale protection,
            and marine ecosystem restoration in South Padre Island and Rio Grande Valley.
          </p>
          <Link
            href="/conservation"
            className="inline-block border-2 border-teal-600 text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-50 transition-colors"
          >
            Learn About Our Conservation Mission
          </Link>
        </div>
      </section>
    </div>
  );
}
