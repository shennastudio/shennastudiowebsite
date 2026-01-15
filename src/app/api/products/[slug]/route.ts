import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/products/[slug]
 * Get public product details including variants and images
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          include: {
            images: {
              orderBy: { position: 'asc' },
            },
          },
        },
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Fetch product by slug error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details', success: false },
      { status: 500 }
    );
  }
}
