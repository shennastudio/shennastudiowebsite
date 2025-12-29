import { NextRequest, NextResponse } from 'next/server';
import { shippo } from '@/lib/shippo';
import { prisma } from '@/lib/prisma';

export interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  statusDetails: string;
}

export interface TrackingResult {
  carrier: string;
  trackingNumber: string;
  status: string;
  statusDetails: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  trackingUrl?: string;
}

// GET - Fetch tracking info for a tracking number or order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');
    const carrier = searchParams.get('carrier');
    const orderId = searchParams.get('orderId');

    // If orderId is provided, lookup tracking info from database
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          trackingNumber: true,
          carrier: true,
        },
      });

      if (!order?.trackingNumber || !order?.carrier) {
        return NextResponse.json({
          error: 'No tracking information available for this order'
        }, { status: 404 });
      }

      // Use the order's tracking info
      return getTrackingStatus(order.carrier, order.trackingNumber);
    }

    // Direct tracking lookup
    if (!trackingNumber || !carrier) {
      return NextResponse.json({
        error: 'Tracking number and carrier are required'
      }, { status: 400 });
    }

    return getTrackingStatus(carrier, trackingNumber);
  } catch (error: unknown) {
    console.error('Tracking Lookup Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch tracking';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function getTrackingStatus(carrier: string, trackingNumber: string) {
  try {
    // Map common carrier names to Shippo carrier tokens
    const carrierToken = mapCarrierToToken(carrier);

    // Get tracking status from Shippo
    const tracking = await shippo.trackingStatus.get(carrierToken, trackingNumber);

    const events: TrackingEvent[] = (tracking.tracking_history || []).map((event) => ({
      date: event.status_date ? new Date(event.status_date).toLocaleDateString() : '',
      time: event.status_date ? new Date(event.status_date).toLocaleTimeString() : '',
      location: formatLocation(event.location),
      status: event.status || '',
      statusDetails: event.status_details || '',
    }));

    const result: TrackingResult = {
      carrier: tracking.carrier || carrier,
      trackingNumber: tracking.tracking_number || trackingNumber,
      status: tracking.tracking_status?.status || 'UNKNOWN',
      statusDetails: tracking.tracking_status?.status_details || '',
      estimatedDelivery: tracking.eta ? new Date(tracking.eta).toLocaleDateString() : undefined,
      events: events.reverse(), // Most recent first
      trackingUrl: tracking.tracking_url_provider || undefined,
    };

    // Update order status if we have the tracking info in our database
    await updateOrderTrackingStatus(trackingNumber, tracking.tracking_status?.status);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Shippo Tracking Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch tracking from carrier';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function mapCarrierToToken(carrier: string): string {
  const carrierMap: Record<string, string> = {
    'usps': 'usps',
    'ups': 'ups',
    'fedex': 'fedex',
    'dhl': 'dhl_express',
    'dhl express': 'dhl_express',
    'ontrac': 'ontrac',
    'lasership': 'lasership',
    'amazon': 'amazon_mws',
  };

  const normalized = carrier.toLowerCase().trim();
  return carrierMap[normalized] || normalized;
}

function formatLocation(location: {
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
} | undefined): string {
  if (!location) return '';

  const parts = [
    location.city,
    location.state,
    location.zip,
  ].filter(Boolean);

  return parts.join(', ');
}

async function updateOrderTrackingStatus(
  trackingNumber: string,
  status: string | undefined
): Promise<void> {
  if (!status) return;

  try {
    // Find orders with this tracking number
    const orders = await prisma.order.findMany({
      where: { trackingNumber },
    });

    for (const order of orders) {
      const updates: { shippedAt?: Date; deliveredAt?: Date; status?: 'SHIPPED' | 'DELIVERED' } = {};

      if (status === 'TRANSIT' && !order.shippedAt) {
        updates.shippedAt = new Date();
        updates.status = 'SHIPPED';
      } else if (status === 'DELIVERED' && !order.deliveredAt) {
        updates.deliveredAt = new Date();
        updates.status = 'DELIVERED';
      }

      if (Object.keys(updates).length > 0) {
        await prisma.order.update({
          where: { id: order.id },
          data: updates,
        });

        // Also update shipping label status
        await prisma.shippingLabel.updateMany({
          where: { orderId: order.id },
          data: {
            status: status === 'DELIVERED' ? 'delivered' : status === 'TRANSIT' ? 'shipped' : 'created',
            shippedAt: status === 'TRANSIT' ? new Date() : undefined,
            deliveredAt: status === 'DELIVERED' ? new Date() : undefined,
          },
        });
      }
    }
  } catch (error) {
    console.error('Failed to update order tracking status:', error);
    // Don't throw - this is a side effect and shouldn't break the tracking response
  }
}

// POST - Register a tracking webhook for a shipment
export async function POST(request: NextRequest) {
  try {
    const { carrier, trackingNumber } = await request.json();

    if (!carrier || !trackingNumber) {
      return NextResponse.json({
        error: 'Carrier and tracking number are required'
      }, { status: 400 });
    }

    const carrierToken = mapCarrierToToken(carrier);

    // Register for tracking updates
    const trackingStatus = await shippo.trackingStatus.create({
      carrier: carrierToken,
      tracking_number: trackingNumber,
    });

    return NextResponse.json({
      success: true,
      tracking: {
        carrier: trackingStatus.carrier,
        trackingNumber: trackingStatus.tracking_number,
        status: trackingStatus.tracking_status?.status,
      }
    });
  } catch (error: unknown) {
    console.error('Register Tracking Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to register tracking';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
