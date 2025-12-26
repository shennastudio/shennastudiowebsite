import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: 'You are already subscribed!' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            isActive: true,
            name: name || existing.name,
            unsubscribedAt: null,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        });
      }
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        name: name || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
