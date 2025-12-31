import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Default bracelet sizes with L = Size 8 and XL = Size 9
const DEFAULT_SIZES = [
  {
    name: 'S',
    label: 'Small',
    inches: '6-6.5',
    numericSize: 6,
    description: 'Best for smaller wrists',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'M',
    label: 'Medium',
    inches: '7-7.5',
    numericSize: 7,
    description: 'Most common size',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'L',
    label: 'Large (Size 8)',
    inches: '8',
    numericSize: 8,
    description: 'Size 8 - For larger wrists',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'XL',
    label: 'Extra Large (Size 9)',
    inches: '9',
    numericSize: 9,
    description: 'Size 9 - For extra large wrists',
    displayOrder: 4,
    isActive: true,
  },
];

// POST - Seed default bracelet sizes
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = [];

    for (const sizeData of DEFAULT_SIZES) {
      // Upsert - create if doesn't exist, update if exists
      const size = await prisma.braceletSize.upsert({
        where: { name: sizeData.name },
        update: {
          label: sizeData.label,
          inches: sizeData.inches,
          numericSize: sizeData.numericSize,
          description: sizeData.description,
          displayOrder: sizeData.displayOrder,
          isActive: sizeData.isActive,
        },
        create: sizeData,
      });
      results.push(size);
    }

    return NextResponse.json({
      message: 'Bracelet sizes seeded successfully',
      sizes: results,
    });
  } catch (error) {
    console.error('Seed bracelet sizes error:', error);
    return NextResponse.json(
      { error: 'Failed to seed bracelet sizes' },
      { status: 500 }
    );
  }
}
