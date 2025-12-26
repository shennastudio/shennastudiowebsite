'use server'

import { getProducts as getPayloadProducts, getCategories as getPayloadCategories, getFeaturedProducts as getPayloadFeaturedProducts } from '@/lib/payload-client'
import { Product, Category, Media } from '@payload-types'

interface ProductFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  inStock?: boolean;
}

interface ProductDisplay {
  product: Product;
  variant: any;
  displayPrice: number;
  displayStock: number;
  displayImages: string[];
}

// Transform Payload Product to ProductDisplay format
function transformProduct(product: Product): ProductDisplay {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const firstVariant = variants[0] || null;

  // Calculate total stock across all variants
  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  // Get price from first variant or base price
  const price = firstVariant?.price || product.basePrice || 0;

  // Get images
  let images: string[] = [];
  if (firstVariant?.images && Array.isArray(firstVariant.images)) {
    images = firstVariant.images.map((img) => {
      if (typeof img.image === 'object' && img.image !== null && 'url' in img.image) {
        return (img.image as Media).url || '';
      }
      return '';
    }).filter(Boolean);
  }

  // Fallback to product images
  if (images.length === 0 && product.images && Array.isArray(product.images)) {
    images = product.images.map((imgObj) => {
      if (typeof imgObj.image === 'object' && imgObj.image !== null && 'url' in imgObj.image) {
        return (imgObj.image as Media).url || '';
      }
      return '';
    }).filter(Boolean);
  }

  return {
    product,
    variant: firstVariant,
    displayPrice: price,
    displayStock: totalStock,
    displayImages: images,
  };
}

export async function fetchProducts(filters: ProductFilters = {}, pagination: { page: number; limit: number } = { page: 1, limit: 12 }) {
  try {
    const response = await getPayloadProducts({
      featured: filters.featured,
      status: 'active',
      category: filters.category ? parseInt(filters.category) : undefined,
      inStock: filters.inStock,
    });

    const products = response.docs || [];
    const transformed = products.map(transformProduct);

    return {
      data: transformed,
      total: response.totalDocs || 0,
      page: response.page || 1,
      limit: response.limit || 12,
      totalPages: response.totalPages || 1,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
    };
  }
}

export async function fetchCategories() {
  try {
    const response = await getPayloadCategories();
    return response.docs || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchFeaturedProducts(limit: number = 6) {
  try {
    const products = await getPayloadFeaturedProducts(limit);
    return products.map(transformProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
