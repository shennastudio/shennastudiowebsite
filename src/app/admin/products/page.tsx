import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Plus, Edit } from 'lucide-react';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
      images: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products yet</p>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 font-semibold">Image</th>
                    <th className="pb-3 font-semibold">Product</th>
                    <th className="pb-3 font-semibold">SKU</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Variants</th>
                    <th className="pb-3 font-semibold">Conservation</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="py-4">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.featured && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{product.sku}</td>
                      <td className="py-4">
                        {product.category ? (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {product.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">No category</span>
                        )}
                      </td>
                      <td className="py-4 font-medium">${product.basePrice.toFixed(2)}</td>
                      <td className="py-4 text-sm text-gray-600">
                        {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                      </td>
                      <td className="py-4 text-sm text-gray-600">{product.conservationPercentage}%</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <DeleteProductButton productId={product.id} productName={product.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
