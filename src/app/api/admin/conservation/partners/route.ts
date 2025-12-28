import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const partnerSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
  location: z.string().optional(),
  focusAreas: z.array(z.string()).optional(),
});

// GET - List all conservation partners
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partners = await prisma.conservationPartner.findMany({
      include: {
        donations: {
          select: {
            amount: true,
            status: true,
          },
        },
        _count: {
          select: {
            donations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const partnersWithStats = partners.map((partner) => ({
      ...partner,
      totalDonations: partner.donations.reduce((sum, d) => sum + d.amount, 0),
      totalPledged: partner.donations
        .filter((d) => d.status === 'PLEDGED')
        .reduce((sum, d) => sum + d.amount, 0),
      totalDonated: partner.donations
        .filter((d) => d.status === 'DONATED')
        .reduce((sum, d) => sum + d.amount, 0),
    }));

    return NextResponse.json(partnersWithStats);
  } catch (error) {
    console.error('Fetch partners error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conservation partners' },
      { status: 500 }
    );
  }
}

// POST - Create new conservation partner
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = partnerSchema.parse(body);

    const partner = await prisma.conservationPartner.create({
      data: validatedData,
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid partner data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create partner error:', error);
    return NextResponse.json(
      { error: 'Failed to create conservation partner' },
      { status: 500 }
    );
  }
}
