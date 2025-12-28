import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const calendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string(), // ISO date string
  time: z.string(), // HH:MM format
  endTime: z.string().optional(),
  allDay: z.boolean().optional().default(false),
  category: z.string().default('general'),
  color: z.string().default('from-blue-500 to-cyan-500'),
  location: z.string().optional(),
  attendees: z.array(z.string().email()).optional().default([]),
  recurring: z.boolean().optional().default(false),
  recurringPattern: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  recurringEnd: z.string().optional(), // ISO date string
  reminder: z.boolean().optional().default(false),
  reminderTime: z.number().int().positive().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional().default('scheduled'),
});

// GET - Fetch all calendar events for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await prisma.calendarEvent.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Fetch calendar events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}

// POST - Create a new calendar event
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = calendarEventSchema.parse(body);

    const event = await prisma.calendarEvent.create({
      data: {
        ...validated,
        date: new Date(validated.date),
        recurringEnd: validated.recurringEnd ? new Date(validated.recurringEnd) : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create calendar event error:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}
