import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updatePartnerSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  logo: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  location: z.string().optional().nullable(),
  focusAreas: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// GET - Get single conservation partner
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

    const partner = await prisma.conservationPartner.findUnique({
      where: { id },
      include: {
        donations: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            donations: true,
          },
        },
      },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json(partner);
  } catch (error) {
    console.error('Fetch partner error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conservation partner' },
      { status: 500 }
    );
  }
}

// PATCH - Update conservation partner
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
    const validatedData = updatePartnerSchema.parse(body);

    // Check if partner exists
    const existingPartner = await prisma.conservationPartner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    const partner = await prisma.conservationPartner.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(partner);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid partner data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update partner error:', error);
    return NextResponse.json(
      { error: 'Failed to update conservation partner' },
      { status: 500 }
    );
  }
}

// DELETE - Delete conservation partner
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

    // Check if partner exists
    const existingPartner = await prisma.conservationPartner.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            donations: true,
          },
        },
      },
    });

    if (!existingPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Check if partner has associated donations
    if (existingPartner._count.donations > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete partner with associated donations. Archive it instead by setting isActive to false.',
        },
        { status: 400 }
      );
    }

    await prisma.conservationPartner.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Delete partner error:', error);
    return NextResponse.json(
      { error: 'Failed to delete conservation partner' },
      { status: 500 }
    );
  }
}
