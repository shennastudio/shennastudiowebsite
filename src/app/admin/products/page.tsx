import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Plus, Edit, Upload, Edit3, Package } from 'lucide-react';
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link
          href="/admin/products/import"
          className="flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">CSV Import</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Bulk import products</p>
          </div>
        </Link>

        <Link
          href="/admin/products/bulk-edit"
          className="flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <Edit3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Bulk Edit</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Edit multiple products</p>
          </div>
        </Link>

        <Link
          href="/admin/inventory"
          className="flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Inventory</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage stock levels</p>
          </div>
        </Link>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No products yet</p>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first product
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 shrink-0">
                          No image
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{product.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</p>
                        {product.featured && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-900 dark:text-gray-100">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Price:</span>
                        <span className="font-medium ml-1">${product.basePrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Variants:</span>
                        <span className="font-medium ml-1">{product.variants.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Category:</span>
                        <span className="font-medium ml-1">
                          {product.category?.name || 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Conservation:</span>
                        <span className="font-medium ml-1">{product.conservationPercentage}%</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                      <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
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
                      <tr key={product.id} className="border-b last:border-0 dark:border-slate-700">
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
                            <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                              No image
                            </div>
                          )}
                        </td>
                        <td className="py-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                            {product.featured && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">{product.sku}</td>
                        <td className="py-4">
                          {product.category ? (
                            <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                              {product.category.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">No category</span>
                          )}
                        </td>
                        <td className="py-4 font-medium text-gray-900 dark:text-white">${product.basePrice.toFixed(2)}</td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">
                          {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                        </td>
                        <td className="py-4 text-sm text-gray-600 dark:text-gray-400">{product.conservationPercentage}%</td>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
