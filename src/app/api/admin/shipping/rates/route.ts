import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { shippo } from '@/lib/shippo';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { address, totalQuantity } = body;

    // Default sender address (Shenna's Studio)
    // In production, this should come from settings
    const addressFrom = {
      name: "Shenna's Studio",
      street1: "123 Ocean Blvd", // Placeholder
      city: "South Padre Island",
      state: "TX",
      zip: "78597",
      country: "US",
      email: "orders@shennastudio.com",
    };

    const addressTo = {
      name: address.name,
      street1: address.line1,
      city: address.city,
      state: address.state,
      zip: address.postalCode,
      country: address.country,
      email: address.email,
    };

    // Calculate weight roughly based on quantity (e.g., 4oz per item)
    // 4 oz = 0.25 lb
    const weightValue = Math.max(0.25, totalQuantity * 0.25);

    const parcel = {
      length: "5",
      width: "5",
      height: "5",
      distance_unit: "in",
      weight: weightValue.toString(),
      mass_unit: "lb",
    };

    const shipment = await shippo.shipments.create({
      addressFrom,
      addressTo,
      parcels: [parcel],
      async: false,
    });

    return NextResponse.json({ 
      rates: shipment.rates.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount)) 
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    return NextResponse.json({ error: 'Failed to fetch shipping rates' }, { status: 500 });
  }
}
