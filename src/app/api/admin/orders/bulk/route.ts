import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bulkOrderSchema = z.object({
  orderIds: z.array(z.string()).min(1),
  action: z.enum(['mark_shipped', 'mark_delivered', 'cancel', 'mark_processing']),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = bulkOrderSchema.parse(body);

    const { orderIds, action, trackingNumber, carrier } = validated;

    let updated = 0;
    const errors: { id: string; error: string }[] = [];

    for (const orderId of orderIds) {
      try {
        const updateData: any = {};

        switch (action) {
          case 'mark_shipped':
            updateData.status = 'SHIPPED';
            updateData.shippedAt = new Date();
            if (trackingNumber) {
              updateData.trackingNumber = trackingNumber;
            }
            if (carrier) {
              updateData.carrier = carrier;
            }
            break;

          case 'mark_delivered':
            updateData.status = 'DELIVERED';
            updateData.deliveredAt = new Date();
            break;

          case 'cancel':
            // Check if order can be cancelled
            const order = await prisma.order.findUnique({
              where: { id: orderId },
            });

            if (order?.status === 'DELIVERED') {
              errors.push({
                id: orderId,
                error: 'Cannot cancel delivered order',
              });
              continue;
            }

            updateData.status = 'CANCELLED';
            break;

          case 'mark_processing':
            updateData.status = 'PROCESSING';
            break;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: updateData,
        });

        updated++;
      } catch (error: any) {
        errors.push({ id: orderId, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Bulk order action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk action', details: error.message },
      { status: 500 }
    );
  }
}
