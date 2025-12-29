import { NextRequest, NextResponse } from 'next/server';
import { shippo, isShippoConfigured } from '@/lib/shippo';

// Fallback shipping rates when Shippo is not configured
const FALLBACK_RATES = [
  {
    id: 'standard-fallback',
    provider: 'ShennaStudio',
    servicelevel: {
      name: 'Standard Shipping',
      token: 'standard'
    },
    amount: '5.95',
    currency: 'USD',
    estimated_days: 5,
    duration_terms: '5-7 business days',
    attributes: ['CHEAPEST']
  },
  {
    id: 'express-fallback',
    provider: 'ShennaStudio',
    servicelevel: {
      name: 'Express Shipping',
      token: 'express'
    },
    amount: '12.95',
    currency: 'USD',
    estimated_days: 2,
    duration_terms: '2-3 business days',
    attributes: ['FASTEST']
  },
  {
    id: 'free-fallback',
    provider: 'ShennaStudio',
    servicelevel: {
      name: 'Free Shipping (Orders $50+)',
      token: 'free'
    },
    amount: '0.00',
    currency: 'USD',
    estimated_days: 7,
    duration_terms: '7-10 business days',
    attributes: ['FREE']
  }
];

export async function POST(request: NextRequest) {
  try {
    const { address, items, subtotal } = await request.json();

    if (!address || !address.line1 || !address.city || !address.state || !address.postalCode || !address.country) {
      return NextResponse.json({ error: 'Incomplete address' }, { status: 400 });
    }

    // If Shippo is not configured, return fallback rates
    if (!isShippoConfigured() || !shippo) {
      console.warn('Shippo not configured, using fallback shipping rates');

      // Filter rates based on order subtotal
      let rates = [...FALLBACK_RATES];

      // Only show free shipping if order is $50+
      if (!subtotal || parseFloat(subtotal) < 50) {
        rates = rates.filter(rate => rate.servicelevel.token !== 'free');
      }

      return NextResponse.json({ rates, isFallback: true });
    }

    // Default sender address (ShennaStudio)
    const addressFrom = {
      name: 'ShennaStudio',
      street1: process.env.SHIPPO_FROM_ADDRESS || '100 Padre Blvd',
      city: process.env.SHIPPO_FROM_CITY || 'South Padre Island',
      state: process.env.SHIPPO_FROM_STATE || 'TX',
      zip: process.env.SHIPPO_FROM_ZIP || '78597',
      country: 'US',
    };

    const addressTo = {
      name: address.name || '',
      street1: address.line1,
      street2: address.line2 || '',
      city: address.city,
      state: address.state,
      zip: address.postalCode,
      country: address.country,
    };

    // Estimate parcel based on items
    // Simple logic: 1 bracelet = ~0.1 lbs.
    // We'll calculate total weight and use a standard box size.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalWeight = items?.reduce((sum: number, item: any) => sum + (item.quantity * 0.1), 0) || 0.1;
    const weightValue = Math.max(totalWeight, 0.1).toFixed(2); // Minimum 0.1 lb

    const parcel = {
      length: '5',
      width: '5',
      height: '5',
      distance_unit: 'in' as const,
      weight: weightValue,
      mass_unit: 'lb' as const,
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

    // Return fallback rates on error instead of failing completely
    console.warn('Returning fallback rates due to error');
    return NextResponse.json({
      rates: FALLBACK_RATES.filter(r => r.servicelevel.token !== 'free'),
      isFallback: true,
      error: error.message || 'Could not fetch live rates'
    });
  }
}
