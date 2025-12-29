import { NextRequest, NextResponse } from 'next/server';
import { shippo } from '@/lib/shippo';

export async function POST(request: NextRequest) {
  try {
    const { address, items } = await request.json();

    if (!address || !address.line1 || !address.city || !address.state || !address.postalCode || !address.country) {
      return NextResponse.json({ error: 'Incomplete address' }, { status: 400 });
    }

    // Default sender address (ShennaStudio)
    const addressFrom = {
      name: 'ShennaStudio',
      street1: '123 Ocean Blvd', // Placeholder - update with real address if known
      city: 'South Padre Island',
      state: 'TX',
      zip: '78597',
      country: 'US',
    };

    const addressTo = {
      name: address.name,
      street1: address.line1,
      street2: address.line2,
      city: address.city,
      state: address.state,
      zip: address.postalCode,
      country: address.country,
    };

    // Estimate parcel based on items
    // Simple logic: 1 bracelet = ~0.1 lbs. 
    // We'll calculate total weight and use a standard box size.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalWeight = items.reduce((sum: number, item: any) => sum + (item.quantity * 0.1), 0);
    const weightValue = Math.max(totalWeight, 0.1).toFixed(2); // Minimum 0.1 lb

    const parcel = {
      length: '5',
      width: '5',
      height: '5',
      distance_unit: 'in',
      weight: weightValue,
      mass_unit: 'lb',
    };

    const shipment = await shippo.shipments.create({
      address_from: addressFrom,
      address_to: addressTo,
      parcels: [parcel],
      async: false,
    });

    // Filter and sort rates
    const rates = shipment.rates
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((rate: any) => ({
        id: rate.object_id,
        provider: rate.provider,
        servicelevel: {
          name: rate.servicelevel.name,
          token: rate.servicelevel.token
        },
        amount: rate.amount,
        currency: rate.currency,
        estimated_days: rate.estimated_days,
        duration_terms: rate.duration_terms,
        attributes: rate.attributes
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount));

    return NextResponse.json({ rates });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Shippo Rate Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shipping rates' },
      { status: 500 }
    );
  }
}
