import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const zoneSchema = z.object({
  name: z.string().min(1),
  countries: z.array(z.string()),
  states: z.array(z.string()).optional(),
  zipCodes: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const zones = await prisma.shippingZone.findMany({
      include: {
        rates: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ zones });
  } catch (error) {
    console.error('Fetch shipping zones error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping zones' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = zoneSchema.parse(body);

    const zone = await prisma.shippingZone.create({
      data: {
        name: validated.name,
        countries: validated.countries,
        states: validated.states || [],
        zipCodes: validated.zipCodes || [],
        isActive: validated.isActive ?? true,
      },
    });

    return NextResponse.json({ zone });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create shipping zone error:', error);
    return NextResponse.json(
      { error: 'Failed to create shipping zone', details: error.message },
      { status: 500 }
    );
  }
}
