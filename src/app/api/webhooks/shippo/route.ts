import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Shippo webhook event types
interface ShippoTrackingEvent {
  event: 'track_updated';
  data: {
    tracking_number: string;
    carrier: string;
    tracking_status: {
      status: string;
      status_details: string;
      status_date: string;
    };
    eta?: string;
    tracking_history: Array<{
      status: string;
      status_details: string;
      status_date: string;
      location?: {
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
      };
    }>;
  };
  test?: boolean;
}

// POST - Handle Shippo webhook events
export async function POST(request: NextRequest) {
  try {
    const event: ShippoTrackingEvent = await request.json();

    // Log the webhook event
    console.log('Shippo webhook received:', event.event, event.data?.tracking_number);

    // Handle tracking updates
    if (event.event === 'track_updated') {
      const { tracking_number, tracking_status } = event.data;

      if (!tracking_number || !tracking_status) {
        return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
      }

      // Find orders with this tracking number
      const orders = await prisma.order.findMany({
        where: { trackingNumber: tracking_number },
      });

      if (orders.length === 0) {
        // No matching order, but still acknowledge the webhook
        console.log(`No order found for tracking number: ${tracking_number}`);
        return NextResponse.json({ received: true, ordersUpdated: 0 });
      }

      // Update each order based on tracking status
      for (const order of orders) {
        const updates: {
          shippedAt?: Date;
          deliveredAt?: Date;
          status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
        } = {};

        const status = tracking_status.status?.toUpperCase();

        // Map Shippo status to order status
        if (status === 'TRANSIT' && !order.shippedAt) {
          updates.shippedAt = new Date(tracking_status.status_date || Date.now());
          updates.status = 'SHIPPED';
        } else if (status === 'DELIVERED' && !order.deliveredAt) {
          updates.deliveredAt = new Date(tracking_status.status_date || Date.now());
          updates.status = 'DELIVERED';
          // Also update shippedAt if not already set
          if (!order.shippedAt) {
            updates.shippedAt = new Date();
          }
        }

        // Only update if there are changes
        if (Object.keys(updates).length > 0) {
          await prisma.order.update({
            where: { id: order.id },
            data: updates,
          });

          // Update shipping label status
          await prisma.shippingLabel.updateMany({
            where: { orderId: order.id },
            data: {
              status: status === 'DELIVERED' ? 'delivered' : status === 'TRANSIT' ? 'shipped' : 'created',
              shippedAt: status === 'TRANSIT' ? new Date(tracking_status.status_date || Date.now()) : undefined,
              deliveredAt: status === 'DELIVERED' ? new Date(tracking_status.status_date || Date.now()) : undefined,
            },
          });

          console.log(`Order ${order.orderNumber} updated to status: ${updates.status || order.status}`);

          // TODO: Send email notification to customer about shipping update
          // This could be integrated with the existing email system
        }
      }

      return NextResponse.json({
        received: true,
        ordersUpdated: orders.length,
      });
    }

    // Acknowledge other event types we don't handle
    return NextResponse.json({ received: true, handled: false });

  } catch (error: unknown) {
    console.error('Shippo webhook error:', error);
    const message = error instanceof Error ? error.message : 'Webhook processing failed';
    // Still return 200 to prevent Shippo from retrying
    return NextResponse.json({ error: message, received: true }, { status: 200 });
  }
}

// Note: Shippo doesn't currently provide webhook signatures
// For production security, consider:
// 1. Whitelisting Shippo IP addresses
// 2. Using a shared secret in the webhook URL
// 3. Verifying the payload structure
