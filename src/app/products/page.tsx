'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchProducts, fetchCategories, fetchFeaturedProducts } from '@/app/actions'
import { Product, Category } from '@payload-types'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

interface ProductDisplay {
  product: Product;
  variant: any;
  displayPrice: number;
  displayStock: number;
  displayImages: string[];
}

interface ProductFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  inStock?: boolean;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<PaginatedResult<ProductDisplay> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { addItem } = useCart();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load products
      const productsResult = await fetchProducts(filters, { page: currentPage, limit: 12 });
      setProducts(productsResult.data);
      setTotalPages(productsResult.totalPages);
      setTotalProducts(productsResult.total);

      // Load categories (only on first load)
      if (categories.length === 0) {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      }

      // Load featured products (only on first load)
      if (!featuredProducts && currentPage === 1) {
        // Wrap result in PaginatedResult structure if it's an array
        const featured = await fetchFeaturedProducts(4);
        setFeaturedProducts({
          data: featured,
          total: featured.length,
          page: 1,
          limit: 4,
          totalPages: 1
        });
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, categories.length, featuredProducts]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, [currentPage, filters, loadData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
    setCurrentPage(1);
  };

  const handleCategoryChange = (categorySlug: string) => {
    const newFilters = categorySlug === 'all'
      ? { ...filters, category: undefined }
      : { ...filters, category: categorySlug };

    setFilters(newFilters);
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  const handleAddToCart = (productDisplay: ProductDisplay) => {
    if (productDisplay?.variant) {
      // Updated to use new CartContext API: addItem(product, variant, quantity)
      addItem(productDisplay.product, productDisplay.variant, 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const isInStock = (productDisplay: ProductDisplay) => {
    return productDisplay.displayStock > 0;
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ocean Hero Section */}
      <section className="bg-gradient-to-r from-teal-400 via-blue-500 to-cyan-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ShennaStudio Ocean Collection
            </h1>
            <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
              Handcrafted bracelets inspired by the ocean. Each purchase supports marine life conservation in the Rio Grande Valley and South Padre Island.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for ocean-inspired bracelets..."
                  className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <button
                  type="submit"
                  className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === 'all' || !selectedCategory
                    ? 'bg-white text-teal-600'
                    : 'bg-cyan-700 text-white hover:bg-cyan-600'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-white text-teal-600'
                      : 'bg-cyan-700 text-white hover:bg-cyan-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts?.data && featuredProducts.data.length > 0 && currentPage === 1 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Ocean-Inspired Favorites
              </h2>
              <p className="text-gray-600">Handpicked pieces that capture the essence of sea</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts?.data?.map((productDisplay, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-cyan-100">
                  <div className="relative h-48 bg-gradient-to-br from-cyan-50 to-blue-50">
                    {productDisplay.displayImages?.[0] ? (
                      <Image
                        src={productDisplay.displayImages[0]}
                        alt={productDisplay.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-cyan-200 rounded-full"></div>
                      </div>
                    )}
                    {productDisplay.product.featured && (
                      <div className="absolute top-3 right-3 bg-coral-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                    {!isInStock(productDisplay) && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {productDisplay.product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {productDisplay.product.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-teal-600">
                        {formatPrice(productDisplay.displayPrice)}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        isInStock(productDisplay)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isInStock(productDisplay) ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${productDisplay.product.id}`}
                        className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(productDisplay)}
                        disabled={!isInStock(productDisplay)}
                        className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium ${
                          isInStock(productDisplay)
                            ? 'bg-teal-600 text-white hover:bg-teal-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
              </div>
            ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                All Ocean Bracelets
              </h2>
              <p className="text-gray-600">
                {totalProducts || '0'} handcrafted pieces available
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-teal-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((productDisplay) => (
              <div key={productDisplay.product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-cyan-100">
                <div className="relative h-64 bg-gradient-to-br from-cyan-50 to-blue-50">
                  {productDisplay.displayImages?.[0] ? (
                    <Image
                      src={productDisplay.displayImages[0]}
                      alt={productDisplay.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-cyan-200 rounded-full"></div>
                    </div>
                  )}
                  {productDisplay.product.featured && (
                    <div className="absolute top-3 right-3 bg-coral-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                  {!isInStock(productDisplay) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {productDisplay.product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {productDisplay.product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-teal-600">
                      {formatPrice(productDisplay.displayPrice)}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      isInStock(productDisplay)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isInStock(productDisplay)
                        ? `${productDisplay.displayStock} in stock`
                        : 'Out of Stock'
                      }
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${productDisplay.product.id}`}
                      className="flex-1 text-center bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(productDisplay)}
                      disabled={!isInStock(productDisplay)}
                      className={`flex-1 py-2 rounded-lg transition-colors font-medium ${
                        isInStock(productDisplay)
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-teal-600 text-white'
                      : 'border border-gray-300 hover:border-teal-500'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Ocean Conservation Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Protecting Our Oceans, One Bracelet at a Time
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            10% of every purchase goes directly to marine life conservation organizations in the Rio Grande Valley and South Padre Island area.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-3xl font-bold text-coral-400 mb-2">10%</div>
              <div className="text-blue-100">Donated to Conservation</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-coral-400 mb-2">RGV</div>
              <div className="text-blue-100">Rio Grande Valley Focus</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-coral-400 mb-2">SPI</div>
              <div className="text-blue-100">South Padre Island Protection</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}