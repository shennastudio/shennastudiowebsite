import { prisma } from '@/lib/db';
import type { CartItem } from '@/types';

interface CreateOrderParams {
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  stripePaymentIntentId?: string;
  customerEmail: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export async function createOrder(params: CreateOrderParams) {
  const {
    userId,
    items,
    subtotal,
    shipping,
    tax,
    total,
    stripePaymentIntentId,
    customerEmail,
    shippingAddress,
  } = params;

  // Calculate conservation donation (10% of subtotal by default)
  const conservationAmount = subtotal * 0.10;

  // Calculate rewards points (1 point per $1 spent)
  const rewardsPoints = Math.floor(total);

  // Create order in database
  const order = await prisma.order.create({
    data: {
      userId,
      customerEmail,
      status: 'PENDING',
      subtotal,
      shipping,
      tax,
      total,
      stripePaymentIntentId,
      shippingName: shippingAddress.name,
      shippingLine1: shippingAddress.line1,
      shippingLine2: shippingAddress.line2,
      shippingCity: shippingAddress.city,
      shippingState: shippingAddress.state,
      shippingPostalCode: shippingAddress.postalCode,
      shippingCountry: shippingAddress.country,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          variantName: item.variantName || null,
          sku: item.sku,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  // Create conservation donation record
  await prisma.conservationDonation.create({
    data: {
      orderId: order.id,
      amount: conservationAmount,
      status: 'PLEDGED',
      region: 'South Padre Island', // Default region
    },
  });

  // Award customer rewards points
  await prisma.customerReward.create({
    data: {
      userId,
      points: rewardsPoints,
      earnedFrom: 'PURCHASE',
      orderId: order.id,
      description: `Purchase #${order.id.slice(0, 8)}`,
    },
  });

  // Deduct inventory for each item
  for (const item of items) {
    await prisma.inventoryTransaction.create({
      data: {
        variantId: item.variantId,
        quantity: -item.quantity, // Negative for deduction
        type: 'SALE',
        orderId: order.id,
        notes: `Order #${order.id.slice(0, 8)}`,
      },
    });

    // Update variant stock
    await prisma.productVariant.update({
      where: { id: item.variantId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export async function getOrderById(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getOrdersByUserId(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
