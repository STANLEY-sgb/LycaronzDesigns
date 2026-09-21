import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail, isValidPhone } from '@/lib/auth';
import { auth } from '@/auth';
import { sendAppointmentNotification } from '@/lib/email';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // ── Validate ───────────────────────────────────────────────────────────
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const email = data.email ? String(data.email).trim() : null;
    const date = data.date;
    const service = String(data.service || '').trim();
    const notes = data.notes ? String(data.notes).trim() : null;

    if (!name || !phone || !date || !service) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, date, service' },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    // ── Save to database ───────────────────────────────────────────────────
    const appointment = await prisma.appointment.create({
      data: {
        name,
        phone,
        email,
        date: parsedDate,
        service,
        notes,
      },
    });

    // ── Send email notification (non-blocking — DB record is preserved if email fails) ──
    sendAppointmentNotification({
      id: appointment.id,
      name: appointment.name,
      phone: appointment.phone,
      email: appointment.email,
      date: appointment.date,
      service: appointment.service,
      notes: appointment.notes,
      status: appointment.status,
      createdAt: appointment.createdAt,
    }).catch((err) => {
      console.error('[EMAIL] Failed to send appointment notification:', err?.message || err);
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment. Please try again.' },
      { status: 500 }
    );
  }
}
