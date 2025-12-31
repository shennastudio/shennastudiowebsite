import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSizeSchema = z.object({
  name: z.string().min(1).max(10).optional(),
  label: z.string().min(1).max(50).optional(),
  inches: z.string().min(1).max(20).optional(),
  numericSize: z.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

// GET - Get single bracelet size
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
    const size = await prisma.braceletSize.findUnique({
      where: { id },
    });

    if (!size) {
      return NextResponse.json(
        { error: 'Bracelet size not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(size);
  } catch (error) {
    console.error('Fetch bracelet size error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bracelet size' },
      { status: 500 }
    );
  }
}

// PATCH - Update bracelet size
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
    const validatedData = updateSizeSchema.parse(body);

    // Check if size exists
    const existingSize = await prisma.braceletSize.findUnique({
      where: { id },
    });

    if (!existingSize) {
      return NextResponse.json(
        { error: 'Bracelet size not found' },
        { status: 404 }
      );
    }

    // If updating name, check it's not taken
    if (validatedData.name) {
      const nameUpper = validatedData.name.toUpperCase();
      if (nameUpper !== existingSize.name) {
        const nameTaken = await prisma.braceletSize.findUnique({
          where: { name: nameUpper },
        });
        if (nameTaken) {
          return NextResponse.json(
            { error: 'A size with this name already exists' },
            { status: 400 }
          );
        }
      }
      validatedData.name = nameUpper;
    }

    const size = await prisma.braceletSize.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(size);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid bracelet size data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update bracelet size error:', error);
    return NextResponse.json(
      { error: 'Failed to update bracelet size' },
      { status: 500 }
    );
  }
}

// DELETE - Delete bracelet size
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

    // Check if size exists
    const existingSize = await prisma.braceletSize.findUnique({
      where: { id },
    });

    if (!existingSize) {
      return NextResponse.json(
        { error: 'Bracelet size not found' },
        { status: 404 }
      );
    }

    await prisma.braceletSize.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Bracelet size deleted successfully' });
  } catch (error) {
    console.error('Delete bracelet size error:', error);
    return NextResponse.json(
      { error: 'Failed to delete bracelet size' },
      { status: 500 }
    );
  }
}
