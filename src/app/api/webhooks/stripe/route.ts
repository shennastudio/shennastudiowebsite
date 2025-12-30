import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type { CartItem } from '@/types';
import type Stripe from 'stripe';

// Make this route dynamic to avoid build-time evaluation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Lazy load Stripe modules to avoid build-time errors
  const { stripe, isStripeEnabled } = await import('@/lib/stripe');

  // Check if Stripe is enabled
  if (!isStripeEnabled() || !stripe) {
    return NextResponse.json(
      { error: 'Stripe webhooks are not configured' },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: unknown) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Lazy load order creation module
      const { createOrder } = await import('@/lib/orders');
      const { sendEmail } = await import('@/lib/email');
      const OrderConfirmationEmail = (await import('@/emails/OrderConfirmation')).default;

      // Extract metadata from session
      const metadata = session.metadata;
      if (!metadata) {
        throw new Error('No metadata found in session');
      }

      const userId = metadata.userId || null; // Optional for guest checkout
      const subtotal = parseFloat(metadata.subtotal);
      const shipping = parseFloat(metadata.shipping);
      const tax = parseFloat(metadata.tax);
      const total = parseFloat(metadata.total);

      // Parse compact items format: "variantId:qty:price|variantId:qty:price|..."
      // And get full item details from Stripe line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

      const items: CartItem[] = lineItems.data
        .filter(li => li.description !== 'Standard shipping' && li.description !== 'Sales tax (8.25%)')
        .map((li) => {
          // Parse product name which is in format "Product Name - Variant Name" or just "Product Name"
          const fullName = li.description || 'Unknown Product';
          const nameParts = fullName.split(' - ');
          const productName = nameParts[0];
          const variantName = nameParts.length > 1 ? nameParts.slice(1).join(' - ') : undefined;

          return {
            productId: li.price?.product as string || '',
            variantId: li.price?.metadata?.variantId || '',
            name: productName,
            variantName,
            quantity: li.quantity || 1,
            price: (li.amount_total || 0) / 100 / (li.quantity || 1),
            sku: li.price?.metadata?.sku || '',
          };
        });

      // Build shipping address
      const shippingAddress = {
        name: metadata.shippingName,
        line1: metadata.shippingLine1,
        line2: metadata.shippingLine2 || undefined,
        city: metadata.shippingCity,
        state: metadata.shippingState,
        postalCode: metadata.shippingPostalCode,
        country: metadata.shippingCountry,
      };

      // Create order in database
      const order = await createOrder({
        userId,
        items,
        subtotal,
        shipping,
        tax,
        total,
        stripePaymentIntentId: session.payment_intent as string,
        customerEmail: session.customer_email || session.customer_details?.email || '',
        shippingAddress,
      });

      console.log('Order created successfully:', order.id);

      // Send order confirmation email
      try {
        const customerEmail = session.customer_email || session.customer_details?.email || '';
        const customerName = shippingAddress.name;
        const conservationAmount = subtotal * 0.10;
        const rewardsPoints = 4; // 4 points per purchase

        if (customerEmail) {
          await sendEmail({
            to: customerEmail,
            subject: `Order Confirmation - ShennaStudio #${order.id.slice(0, 8).toUpperCase()}`,
            react: OrderConfirmationEmail({
              orderId: order.id,
              orderNumber: `#${order.id.slice(0, 8).toUpperCase()}`,
              customerName,
              customerEmail,
              items: items.map(item => ({
                name: item.name,
                variantName: item.variantName,
                quantity: item.quantity,
                price: item.price,
              })),
              subtotal,
              shipping,
              tax,
              total,
              conservationAmount,
              rewardsPoints,
              shippingAddress,
            }),
          });
          console.log('Order confirmation email sent to:', customerEmail);
        }
      } catch (emailError: unknown) {
        // Log email error but don't fail the webhook
        console.error('Failed to send order confirmation email:', emailError);
      }

      return NextResponse.json({ received: true, orderId: order.id });
    } catch (error: unknown) {
      console.error('Error processing checkout session:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to process order' },
        { status: 500 }
      );
    }
  }

  // Handle payment_intent.succeeded event (backup)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log('PaymentIntent succeeded:', paymentIntent.id);
  }

  // Handle payment_intent.payment_failed event
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.error('PaymentIntent failed:', paymentIntent.id);

    // TODO: Send payment failed email to customer (Phase 1.2)
  }

  return NextResponse.json({ received: true });
}
