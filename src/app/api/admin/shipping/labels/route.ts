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
    // First, check if there's a ShippingLabel record for this order
    const shippingLabel = await prisma.shippingLabel.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    if (shippingLabel) {
      // If we have a label URL from Shippo, use it
      // Otherwise generate a sample label URL for testing
      const labelUrl = shippingLabel.labelUrl || generateSampleLabelUrl(req, orderId, shippingLabel);

      return NextResponse.json({
        label: {
          id: shippingLabel.id,
          trackingNumber: shippingLabel.trackingNumber,
          carrier: shippingLabel.carrier,
          service: shippingLabel.service,
          cost: shippingLabel.cost,
          status: shippingLabel.status,
          labelUrl,
        }
      });
    }

    // Fall back to checking the Order table
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        orderNumber: true,
        trackingNumber: true,
        carrier: true,
        customerName: true,
        shippingAddress: true,
        shippingCity: true,
        shippingState: true,
        shippingZip: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.trackingNumber) {
      return NextResponse.json({ label: null });
    }

    // Generate a sample label URL for testing when no ShippingLabel record exists
    const baseUrl = new URL(req.url).origin;
    const labelUrl = `${baseUrl}/api/admin/shipping/sample-label?` + new URLSearchParams({
      orderNumber: order.orderNumber || orderId.slice(0, 8),
      customerName: order.customerName || 'Customer',
      address: order.shippingAddress || '123 Main St',
      city: order.shippingCity || 'City',
      state: order.shippingState || 'TX',
      zip: order.shippingZip || '78701',
      carrier: order.carrier || 'USPS',
      service: 'Priority Mail',
      trackingNumber: order.trackingNumber,
      format: 'svg',
    }).toString();

    return NextResponse.json({
      label: {
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        status: 'created',
        labelUrl,
      }
    });

  } catch (error) {
    console.error('Error fetching label:', error);
    return NextResponse.json({ error: 'Failed to fetch label' }, { status: 500 });
  }
}

// Helper to generate sample label URL
function generateSampleLabelUrl(
  req: NextRequest,
  orderId: string,
  label: { carrier: string; service: string; trackingNumber: string | null }
): string {
  const baseUrl = new URL(req.url).origin;
  return `${baseUrl}/api/admin/shipping/sample-label?` + new URLSearchParams({
    orderNumber: orderId.slice(0, 8),
    carrier: label.carrier,
    service: label.service,
    trackingNumber: label.trackingNumber || 'SAMPLE123456789',
    format: 'svg',
  }).toString();
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
