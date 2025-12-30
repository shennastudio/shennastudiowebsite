import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateLabelSchema = z.object({
  status: z.enum(['created', 'printed', 'shipped', 'delivered', 'void']).optional(),
  trackingNumber: z.string().optional(),
  labelUrl: z.string().optional(),
  shippoTransactionId: z.string().optional(),
  shippoRateId: z.string().optional(),
});

// GET - Get single shipping label
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const label = await prisma.shippingLabel.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!label) {
      return NextResponse.json({ error: 'Shipping label not found' }, { status: 404 });
    }

    return NextResponse.json({ label });
  } catch (error) {
    console.error('Fetch shipping label error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping label' },
      { status: 500 }
    );
  }
}

// PATCH - Update shipping label
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validated = updateLabelSchema.parse(body);

    const updateData: Record<string, unknown> = {};

    if (validated.status) {
      updateData.status = validated.status;

      // Set timestamps based on status
      if (validated.status === 'printed') {
        updateData.printedAt = new Date();
      } else if (validated.status === 'shipped') {
        updateData.shippedAt = new Date();

        // Also update the order status
        const label = await prisma.shippingLabel.findUnique({
          where: { id },
          select: { orderId: true },
        });

        if (label?.orderId) {
          await prisma.order.update({
            where: { id: label.orderId },
            data: {
              status: 'SHIPPED',
              shippedAt: new Date(),
              trackingNumber: validated.trackingNumber,
              carrier: undefined, // Will be set from label
            },
          });
        }
      } else if (validated.status === 'delivered') {
        updateData.deliveredAt = new Date();

        // Also update the order status
        const label = await prisma.shippingLabel.findUnique({
          where: { id },
          select: { orderId: true },
        });

        if (label?.orderId) {
          await prisma.order.update({
            where: { id: label.orderId },
            data: {
              status: 'DELIVERED',
              deliveredAt: new Date(),
            },
          });
        }
      }
    }

    if (validated.trackingNumber) updateData.trackingNumber = validated.trackingNumber;
    if (validated.labelUrl) updateData.labelUrl = validated.labelUrl;
    if (validated.shippoTransactionId) updateData.shippoTransactionId = validated.shippoTransactionId;
    if (validated.shippoRateId) updateData.shippoRateId = validated.shippoRateId;

    const label = await prisma.shippingLabel.update({
      where: { id },
      data: updateData,
      include: {
        order: true,
      },
    });

    return NextResponse.json({ label });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid label data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update shipping label error:', error);
    return NextResponse.json(
      { error: 'Failed to update shipping label' },
      { status: 500 }
    );
  }
}

// DELETE - Void/Delete shipping label
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Mark as void instead of deleting
    await prisma.shippingLabel.update({
      where: { id },
      data: { status: 'void' },
    });

    return NextResponse.json({ message: 'Shipping label voided successfully' });
  } catch (error) {
    console.error('Void shipping label error:', error);
    return NextResponse.json(
      { error: 'Failed to void shipping label' },
      { status: 500 }
    );
  }
}
