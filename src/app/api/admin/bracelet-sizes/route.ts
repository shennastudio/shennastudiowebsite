import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const braceletSizeSchema = z.object({
  name: z.string().min(1).max(10),
  label: z.string().min(1).max(50),
  inches: z.string().min(1).max(20),
  numericSize: z.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// GET - List all bracelet sizes
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sizes = await prisma.braceletSize.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.error('Fetch bracelet sizes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bracelet sizes' },
      { status: 500 }
    );
  }
}

// POST - Create new bracelet size
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = braceletSizeSchema.parse(body);

    // Check if name already exists
    const existingSize = await prisma.braceletSize.findUnique({
      where: { name: validatedData.name.toUpperCase() },
    });

    if (existingSize) {
      return NextResponse.json(
        { error: 'A size with this name already exists' },
        { status: 400 }
      );
    }

    const size = await prisma.braceletSize.create({
      data: {
        ...validatedData,
        name: validatedData.name.toUpperCase(),
      },
    });

    return NextResponse.json(size, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid bracelet size data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create bracelet size error:', error);
    return NextResponse.json(
      { error: 'Failed to create bracelet size' },
      { status: 500 }
    );
  }
}
