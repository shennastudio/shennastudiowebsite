import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Plus, Edit, Upload, Edit3, Package } from 'lucide-react';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';
import { ProductThumbnail } from '@/components/admin/ProductThumbnail';
import { ProductsTable } from '@/components/admin/ProductsTable';

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

  return <ProductsTable initialProducts={products as any} />;
}
