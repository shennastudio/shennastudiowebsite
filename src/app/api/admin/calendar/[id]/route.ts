import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  date: z.string().optional(),
  time: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  allDay: z.boolean().optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  location: z.string().optional().nullable(),
  attendees: z.array(z.string()).optional(), // Names or emails
  recurring: z.boolean().optional(),
  recurringPattern: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional().nullable(),
  recurringEnd: z.string().optional().nullable(),
  reminder: z.boolean().optional(),
  reminderTime: z.number().int().positive().optional().nullable(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'in_progress']).optional(),
  // Business journal features
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  tags: z.array(z.string()).optional(),
  journalEntry: z.string().optional().nullable(),
  projectedRevenue: z.number().optional().nullable(),
  actualRevenue: z.number().optional().nullable(),
  completionPercent: z.number().int().min(0).max(100).optional(),
  checklist: z.array(z.object({
    text: z.string(),
    done: z.boolean(),
  })).optional().nullable(),
  links: z.array(z.string()).optional(),
});

// GET - Get single event
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const event = await prisma.calendarEvent.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Fetch event error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PATCH - Update event
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validated = updateEventSchema.parse(body);

    // Check if event exists and belongs to user
    const existingEvent = await prisma.calendarEvent.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: {
        ...validated,
        date: validated.date ? new Date(validated.date) : undefined,
        recurringEnd: validated.recurringEnd ? new Date(validated.recurringEnd) : undefined,
        checklist: validated.checklist ?? undefined,
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if event exists and belongs to user
    const existingEvent = await prisma.calendarEvent.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await prisma.calendarEvent.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
