import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updatePlanSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  priceMonthly: z.number().positive().optional(),
  stripePriceId: z.string().optional().nullable(),
  braceletsPerMonth: z.number().int().positive().optional(),
  exclusiveDiscounts: z.boolean().optional(),
  earlyAccess: z.boolean().optional(),
  limitedEditions: z.boolean().optional(),
  vipPerks: z.boolean().optional(),
  features: z.array(z.string()).optional(),
  badgeColor: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// GET - Get single subscription plan
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Fetch subscription plan error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plan' },
      { status: 500 }
    );
  }
}

// PATCH - Update subscription plan
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = updatePlanSchema.parse(body);

    // Check if plan exists
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid subscription plan data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update subscription plan error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription plan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete subscription plan
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

    // Check if plan exists
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    // Prevent deletion if there are active subscriptions
    if (existingPlan._count.subscriptions > 0) {
      return NextResponse.json(
        { error: 'Cannot delete plan with active subscriptions. Deactivate it instead.' },
        { status: 400 }
      );
    }

    await prisma.subscriptionPlan.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    console.error('Delete subscription plan error:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription plan' },
      { status: 500 }
    );
  }
}
