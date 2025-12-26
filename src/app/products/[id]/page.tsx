import { getProduct } from '@/lib/payload-client'
import { Product, Media } from '@payload-types'
import ProductDetails from '@/components/ProductDetails'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>;
}

interface ProductDisplay {
  product: Product;
  variant: any;
  displayPrice: number;
  displayStock: number;
  displayImages: string[];
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id: productId } = await params;
  const id = parseInt(productId);

  if (isNaN(id)) {
    return <NotFound />;
  }

  let product: Product;
  try {
    product = await getProduct(id, 3); // depth 3 to include nested relations
  } catch (error) {
    console.error('Error fetching product:', error);
    return <NotFound />;
  }

  if (!product) {
    return <NotFound />;
  }

  // Transform Payload Product to ProductDisplay
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const firstInStockVariant = variants.find(v => v.stock && v.stock > 0);
  const selectedVariant = firstInStockVariant || variants[0] || null;

  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const price = selectedVariant?.price || product.basePrice || 0;

  // Get images from selected variant or product
  let images: string[] = [];
  if (selectedVariant?.images && Array.isArray(selectedVariant.images)) {
    images = selectedVariant.images.map((img) => {
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

  const display: ProductDisplay = {
    product,
    variant: selectedVariant,
    displayPrice: price,
    displayStock: totalStock,
    displayImages: images,
  };

  return <ProductDetails product={display} />;
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn&apos;t find the ocean bracelet you&apos;re looking for.
        </p>
        <Link
          href="/products"
          className="inline-block bg-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    </div>
  );
}
