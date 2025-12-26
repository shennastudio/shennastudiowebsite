'use client'

import { useState } from 'react'
import { Product, Media } from '@payload-types'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

interface ProductVariant {
  id?: string | null;
  variantName: string;
  sku: string;
  price: number;
  stock: number;
  size?: ('small' | 'medium' | 'large') | null;
  color?: string | null;
  material?: string | null;
  images?: any[] | null;
}

interface ProductDisplay {
  product: Product;
  variant?: ProductVariant | null;
  displayPrice: number;
  displayStock: number;
  displayImages: string[];
}

interface ProductDetailsProps {
  product: ProductDisplay;
}

export default function ProductDetails({ product: initialProduct }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    initialProduct.variant || null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addItem } = useCart();

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImage(0);
  };

  const handleAddToCart = () => {
    if (initialProduct && selectedVariant && selectedVariant.stock > 0) {
      // Updated to use new CartContext API: addItem(product, variant, quantity)
      addItem(initialProduct.product, selectedVariant, quantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getImages = (): string[] => {
    if (selectedVariant?.images && Array.isArray(selectedVariant.images) && selectedVariant.images.length > 0) {
      // Extract URLs from variant images
      const variantImages = selectedVariant.images
        .map(img => {
          if (img.image && typeof img.image === 'object' && 'url' in img.image) {
            return (img.image as Media).url || '';
          }
          return '';
        })
        .filter((url): url is string => url !== '');

      if (variantImages.length > 0) {
        return variantImages;
      }
    }
    return initialProduct.displayImages || [];
  };

  const isInStock = () => {
    return selectedVariant && selectedVariant.stock > 0;
  };

  const images = getImages();
  const productData = initialProduct.product || {};
  const variants = initialProduct.product?.variants || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-700">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">
              Ocean Collection
            </Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-900 font-medium">{productData.name || 'Product'}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-96 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg overflow-hidden">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={productData.name || 'Product'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-24 bg-cyan-200 rounded-full"></div>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded border-2 overflow-hidden transition-colors ${
                      selectedImage === index ? 'border-teal-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${productData.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {productData.name || 'Ocean Bracelet'}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-teal-600">
                  {formatPrice(initialProduct.displayPrice || 0)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isInStock()
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isInStock() ? `${selectedVariant?.stock || 0} in stock` : 'Out of Stock'}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {productData.description || 'Handcrafted ocean-inspired bracelet'}
              </p>
            </div>

            {/* Variants Selection */}
            {variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Select Style
                </h3>
                <div className="space-y-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant)}
                      disabled={variant.stock === 0}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {variant.size && <span>Size: {variant.size}</span>}
                            {variant.material && <span className="ml-2">Material: {variant.material}</span>}
                            {variant.color && <span className="ml-2">Color: {variant.color}</span>}
                          </div>
                          <div className="text-sm text-gray-600">
                            SKU: {variant.sku}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-teal-600">
                            {formatPrice(variant.price)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {variant.stock > 0 ? `${variant.stock} available` : 'Out of Stock'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {[...Array(Math.min(10, selectedVariant?.stock || 1))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isInStock()}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isInStock()
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isInStock() ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <div className="text-center text-sm text-gray-600">
                Free shipping on orders over $50
              </div>
            </div>

            {/* Conservation Message */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-cyan-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                🌊 Ocean Conservation Support
              </h4>
              <p className="text-blue-700 text-sm">
                Your purchase supports marine life conservation in Rio Grande Valley and South Padre Island. 
                10% of this sale goes directly to protecting our ocean ecosystems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
