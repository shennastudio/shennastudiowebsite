import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const calendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  date: z.string(), // ISO date string
  time: z.string().optional().nullable(), // HH:MM format (optional for all-day events)
  endTime: z.string().optional().nullable(),
  allDay: z.boolean().optional().default(false),
  category: z.string().default('general'),
  color: z.string().default('from-blue-500 to-cyan-500'),
  location: z.string().optional().nullable(),
  attendees: z.array(z.string()).optional().default([]), // Names or emails
  recurring: z.boolean().optional().default(false),
  recurringPattern: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().nullable(),
  recurringEnd: z.string().optional().nullable(), // ISO date string
  reminder: z.boolean().optional().default(false),
  reminderTime: z.number().int().positive().optional().nullable(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'in_progress']).optional().default('scheduled'),
  // Business journal features
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  tags: z.array(z.string()).optional().default([]),
  journalEntry: z.string().optional().nullable(),
  projectedRevenue: z.number().optional().nullable(),
  actualRevenue: z.number().optional().nullable(),
  completionPercent: z.number().int().min(0).max(100).optional().default(0),
  checklist: z.array(z.object({
    text: z.string(),
    done: z.boolean(),
  })).optional().nullable(),
  links: z.array(z.string()).optional().default([]),
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

    // Parse date as local time by appending T12:00:00 to avoid timezone shift issues
    // This ensures the date stays the same regardless of timezone
    const parsedDate = new Date(validated.date + 'T12:00:00');
    const parsedRecurringEnd = validated.recurringEnd
      ? new Date(validated.recurringEnd + 'T12:00:00')
      : null;

    const event = await prisma.calendarEvent.create({
      data: {
        ...validated,
        date: parsedDate,
        recurringEnd: parsedRecurringEnd,
        checklist: validated.checklist ?? undefined,
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
