import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const subscriptionPlanSchema = z.object({
  name: z.string().min(1).max(100),
  tier: z.enum(['BASIC', 'PREMIUM', 'COLLECTOR']),
  description: z.string().min(1),
  priceMonthly: z.number().positive(),
  stripePriceId: z.string().optional().nullable(),
  braceletsPerMonth: z.number().int().positive().default(1),
  exclusiveDiscounts: z.boolean().default(false),
  earlyAccess: z.boolean().default(false),
  limitedEditions: z.boolean().default(false),
  vipPerks: z.boolean().default(false),
  features: z.array(z.string()).default([]),
  badgeColor: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

// GET - List all subscription plans
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: {
        priceMonthly: 'asc',
      },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Fetch subscription plans error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}

// POST - Create new subscription plan
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = subscriptionPlanSchema.parse(body);

    // Check if tier already exists
    const existingTier = await prisma.subscriptionPlan.findUnique({
      where: { tier: validatedData.tier },
    });

    if (existingTier) {
      return NextResponse.json(
        { error: 'A plan with this tier already exists' },
        { status: 400 }
      );
    }

    const plan = await prisma.subscriptionPlan.create({
      data: validatedData,
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid subscription plan data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create subscription plan error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription plan' },
      { status: 500 }
    );
  }
}
