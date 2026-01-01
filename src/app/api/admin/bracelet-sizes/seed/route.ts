import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Default bracelet sizes from 6" to 9" for all wrist sizes
const DEFAULT_SIZES = [
  {
    name: 'XS',
    label: 'Extra Small (6")',
    inches: '6',
    numericSize: 6,
    description: 'Size 6 - For petite wrists',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'S',
    label: 'Small (6.5")',
    inches: '6.5',
    numericSize: 6,
    description: 'Size 6.5 - For smaller wrists',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'M',
    label: 'Medium (7")',
    inches: '7',
    numericSize: 7,
    description: 'Size 7 - Standard women\'s size',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'M+',
    label: 'Medium Plus (7.5")',
    inches: '7.5',
    numericSize: 7,
    description: 'Size 7.5 - Between medium and large',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'L',
    label: 'Large (8")',
    inches: '8',
    numericSize: 8,
    description: 'Size 8 - Standard men\'s size',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'L+',
    label: 'Large Plus (8.5")',
    inches: '8.5',
    numericSize: 8,
    description: 'Size 8.5 - Between large and extra large',
    displayOrder: 6,
    isActive: true,
  },
  {
    name: 'XL',
    label: 'Extra Large (9")',
    inches: '9',
    numericSize: 9,
    description: 'Size 9 - For larger men\'s wrists',
    displayOrder: 7,
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
