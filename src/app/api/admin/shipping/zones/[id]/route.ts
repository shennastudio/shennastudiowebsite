import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateZoneSchema = z.object({
  name: z.string().min(1).optional(),
  countries: z.array(z.string()).optional(),
  states: z.array(z.string()).optional(),
  zipCodes: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// GET - Get single shipping zone
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

    const zone = await prisma.shippingZone.findUnique({
      where: { id },
      include: {
        rates: true,
      },
    });

    if (!zone) {
      return NextResponse.json({ error: 'Shipping zone not found' }, { status: 404 });
    }

    return NextResponse.json({ zone });
  } catch (error) {
    console.error('Fetch shipping zone error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipping zone' },
      { status: 500 }
    );
  }
}

// PATCH - Update shipping zone
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
    const validated = updateZoneSchema.parse(body);

    // Check if zone exists
    const existingZone = await prisma.shippingZone.findUnique({
      where: { id },
    });

    if (!existingZone) {
      return NextResponse.json({ error: 'Shipping zone not found' }, { status: 404 });
    }

    const zone = await prisma.shippingZone.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ zone });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid zone data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update shipping zone error:', error);
    return NextResponse.json(
      { error: 'Failed to update shipping zone' },
      { status: 500 }
    );
  }
}

// DELETE - Delete shipping zone
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

    // Check if zone exists
    const existingZone = await prisma.shippingZone.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            rates: true,
          },
        },
      },
    });

    if (!existingZone) {
      return NextResponse.json({ error: 'Shipping zone not found' }, { status: 404 });
    }

    // Check if zone has associated rates
    if (existingZone._count.rates > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete shipping zone with associated rates. Delete the rates first or archive the zone by setting isActive to false.',
        },
        { status: 400 }
      );
    }

    await prisma.shippingZone.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Shipping zone deleted successfully' });
  } catch (error) {
    console.error('Delete shipping zone error:', error);
    return NextResponse.json(
      { error: 'Failed to delete shipping zone' },
      { status: 500 }
    );
  }
}
