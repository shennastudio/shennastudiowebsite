import { NextRequest, NextResponse } from 'next/server';
import { shippo } from '@/lib/shippo';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface LabelPurchaseRequest {
  orderId: string;
  rateId: string;
}

export interface LabelPurchaseResult {
  success: boolean;
  label?: {
    id: string;
    trackingNumber: string;
    trackingUrlProvider: string;
    labelUrl: string;
    carrier: string;
    service: string;
    cost: number;
  };
  error?: string;
}

// GET - Fetch label for an order
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const label = await prisma.shippingLabel.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (!label) {
      return NextResponse.json({ label: null });
    }

    return NextResponse.json({ label });
  } catch (error: unknown) {
    console.error('Get Label Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch label';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - Purchase a new label
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, rateId }: LabelPurchaseRequest = await request.json();

    if (!orderId || !rateId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID and Rate ID are required'
      } as LabelPurchaseResult, { status: 400 });
    }

    // Verify order exists and doesn't already have a label
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      } as LabelPurchaseResult, { status: 404 });
    }

    // Check for existing label
    const existingLabel = await prisma.shippingLabel.findFirst({
      where: { orderId },
    });

    if (existingLabel) {
      return NextResponse.json({
        success: false,
        error: 'A label has already been purchased for this order'
      } as LabelPurchaseResult, { status: 400 });
    }

    // Purchase the label from Shippo using the rate ID
    const transaction = await shippo.transactions.create({
      rate: rateId,
      label_file_type: 'PDF',
      async: false,
    });

    if (transaction.status !== 'SUCCESS') {
      return NextResponse.json({
        success: false,
        error: transaction.messages?.map(m => m.text).join(', ') || 'Failed to purchase label'
      } as LabelPurchaseResult, { status: 400 });
    }

    // Store label in database
    const shippingLabel = await prisma.shippingLabel.create({
      data: {
        orderId,
        carrier: transaction.rate?.provider || 'Unknown',
        service: transaction.rate?.servicelevel?.name || 'Unknown',
        trackingNumber: transaction.tracking_number || '',
        labelUrl: transaction.label_url || null,
        cost: parseFloat(transaction.rate?.amount || '0'),
        status: 'created',
      },
    });

    // Update order with tracking info
    await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber: transaction.tracking_number || null,
        carrier: transaction.rate?.provider || null,
        shippingCost: parseFloat(transaction.rate?.amount || '0'),
      },
    });

    return NextResponse.json({
      success: true,
      label: {
        id: shippingLabel.id,
        trackingNumber: transaction.tracking_number || '',
        trackingUrlProvider: transaction.tracking_url_provider || '',
        labelUrl: transaction.label_url || '',
        carrier: transaction.rate?.provider || 'Unknown',
        service: transaction.rate?.servicelevel?.name || 'Unknown',
        cost: parseFloat(transaction.rate?.amount || '0'),
      }
    } as LabelPurchaseResult);

  } catch (error: unknown) {
    console.error('Label Purchase Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to purchase label';
    return NextResponse.json({
      success: false,
      error: message
    } as LabelPurchaseResult, { status: 500 });
  }
}
