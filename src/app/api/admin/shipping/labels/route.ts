import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { shippo } from '@/lib/shippo';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        trackingNumber: true,
        carrier: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.trackingNumber) {
      return NextResponse.json({ label: null });
    }

    // Since we don't store the transaction ID locally in this simple schema,
    // we can't fetch the label URL from Shippo directly without it.
    // However, for this MVP, we assume if we have tracking, we might want to return 
    // what we have.
    // In a real app, we should store the Shippo Transaction ID in the order model.
    // For now, we'll return what we have in the DB.

    return NextResponse.json({
      label: {
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        status: 'created'
      }
    });

  } catch (error) {
    console.error('Error fetching label:', error);
    return NextResponse.json({ error: 'Failed to fetch label' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, rateId, carrier, service } = body;

    if (!orderId || !rateId) {
      return NextResponse.json({ error: 'Order ID and Rate ID are required' }, { status: 400 });
    }

    // Purchase the label
    const transaction = await shippo.transactions.create({
      rate: rateId,
      labelFileType: "PDF",
      async: false,
    });

    if (transaction.status === "SUCCESS") {
      // Update order with tracking info
      await prisma.order.update({
        where: { id: orderId },
        data: {
          trackingNumber: transaction.trackingNumber,
          carrier: carrier || 'USPS', // Default to USPS if not provided, or use what was passed
          status: 'SHIPPED',
          shippedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        label: {
          id: transaction.objectId,
          carrier: carrier || 'USPS',
          service: service || 'Standard',
          trackingNumber: transaction.trackingNumber,
          labelUrl: transaction.labelUrl,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cost: typeof transaction.rate === 'object' ? parseFloat((transaction.rate as any).amount) : 0, // Handle if rate is object or ID
        }
      });
    } else {
        const messages = transaction.messages || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMsg = messages.map((m: any) => m.text).join(', ') || 'Transaction failed';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

  } catch (error) {
    console.error('Error purchasing label:', error);
    return NextResponse.json({ error: 'Failed to purchase label' }, { status: 500 });
  }
}
