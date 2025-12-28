import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.productReview.findMany({
      where: {
        productId: params.id,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      reviews,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error('Fetch product reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
