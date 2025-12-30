import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createLabelSchema = z.object({
  orderId: z.string().optional(),
  carrier: z.string(),
  service: z.string(),
  weight: z.number(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  cost: z.number(),
});

// GET - Fetch all shipping labels with filters
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
        { order: { customerName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [labels, total] = await Promise.all([
      prisma.shippingLabel.findMany({
        where,
        include: {
          order: {
            select: {
              orderNumber: true,
              customerName: true,
              customerEmail: true,
              shippingAddress: true,
              shippingCity: true,
              shippingState: true,
              shippingZip: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.shippingLabel.count({ where }),
    ]);

    // Get status counts
    const statusCounts = await prisma.shippingLabel.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get orders ready for shipping (no label yet)
    const ordersReadyCount = await prisma.order.count({
      where: {
        status: 'PROCESSING',
        shippingLabels: { none: {} },
      },
    });

    const stats = {
      total,
      created: statusCounts.find(s => s.status === 'created')?._count || 0,
      printed: statusCounts.find(s => s.status === 'printed')?._count || 0,
      shipped: statusCounts.find(s => s.status === 'shipped')?._count || 0,
      delivered: statusCounts.find(s => s.status === 'delivered')?._count || 0,
      ordersReady: ordersReadyCount,
    };

    return NextResponse.json({
      labels,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch shipping labels error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping labels' },
      { status: 500 }
    );
  }
}

// POST - Create a new shipping label
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createLabelSchema.parse(body);

    const label = await prisma.shippingLabel.create({
      data: {
        orderId: validated.orderId,
        carrier: validated.carrier,
        service: validated.service,
        weight: validated.weight,
        length: validated.length,
        width: validated.width,
        height: validated.height,
        cost: validated.cost,
        status: 'created',
      },
      include: {
        order: true,
      },
    });

    return NextResponse.json({ label }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid label data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create shipping label error:', error);
    return NextResponse.json(
      { error: 'Failed to create shipping label' },
      { status: 500 }
    );
  }
}

// GET orders ready for shipping
export async function getOrdersForShipping() {
  return prisma.order.findMany({
    where: {
      status: 'PROCESSING',
      shippingLabels: { none: {} },
    },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}
