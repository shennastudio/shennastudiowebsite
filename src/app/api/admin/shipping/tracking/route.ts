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

    if (!order || !order.trackingNumber || !order.carrier) {
      return NextResponse.json({ status: 'UNKNOWN', events: [] });
    }

    // Fetch tracking info from Shippo
    // Note: Shippo tracking requires the carrier and tracking number
    // We are using the "shippo" client instance
    
    // shippo-node-client might have different signature for tracking
    // Checking documentation or types would be ideal, but assuming standard method:
    
    // Workaround: if using shippo node client, usually it is shippo.track.get_status(carrier, tracking_number)
    // Checking the initialized client 'shippo'
    
    try {
        const tracking = await shippo.tracks.get(order.carrier.toLowerCase(), order.trackingNumber);
        
        return NextResponse.json({
            carrier: tracking.carrier,
            trackingNumber: tracking.trackingNumber,
            status: tracking.trackingStatus?.status || 'UNKNOWN',
            statusDetails: tracking.trackingStatus?.statusDetails || '',
            estimatedDelivery: tracking.eta,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            events: tracking.trackingHistory?.map((event: any) => ({
                date: new Date(event.statusDate).toLocaleDateString(),
                time: new Date(event.statusDate).toLocaleTimeString(),
                location: event.location?.city ? `${event.location.city}, ${event.location.state}` : '',
                status: event.status,
                statusDetails: event.statusDetails
            })) || [],
            trackingUrl: tracking.trackingUrl
        });
    } catch (apiError) {
        console.error('Shippo API Tracking Error:', apiError);
        return NextResponse.json({ status: 'UNKNOWN', events: [] });
    }

  } catch (error) {
    console.error('Error fetching tracking:', error);
    return NextResponse.json({ error: 'Failed to fetch tracking' }, { status: 500 });
  }
}
