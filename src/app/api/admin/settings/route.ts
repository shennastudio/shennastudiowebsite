import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the first (and should be only) settings record
    let settings = await prisma.siteSettings.findFirst();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'ShennaStudio',
          primaryColor: '#3B82F6',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if settings exist
    const existing = await prisma.siteSettings.findFirst();

    let settings;
    if (existing) {
      // Update existing settings
      settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: {
          siteName: data.siteName,
          logo: data.logo || null,
          tagline: data.tagline || null,
          primaryColor: data.primaryColor,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
          facebook: data.facebook || null,
          instagram: data.instagram || null,
          twitter: data.twitter || null,
        },
      });
    } else {
      // Create new settings
      settings = await prisma.siteSettings.create({
        data: {
          siteName: data.siteName,
          logo: data.logo || null,
          tagline: data.tagline || null,
          primaryColor: data.primaryColor,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
          facebook: data.facebook || null,
          instagram: data.instagram || null,
          twitter: data.twitter || null,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}
