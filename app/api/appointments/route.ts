import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail, isValidPhone } from '@/lib/auth';
import { auth } from '@/auth';
import { sendAppointmentNotification } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

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
    const ip = getClientIp(request);
    const rate = checkRateLimit(`appointment:${ip}`, 5, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many appointment requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

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

    // ── Send email notification (awaited with error isolation) ───────────
    try {
      await sendAppointmentNotification({
        id: appointment.id,
        name: appointment.name,
        phone: appointment.phone,
        email: appointment.email,
        date: appointment.date,
        service: appointment.service,
        notes: appointment.notes,
        status: appointment.status,
        createdAt: appointment.createdAt,
      });
    } catch (emailErr) {
      console.error('[APPOINTMENT_EMAIL_FAILED]', {
        id: appointment.id,
        error: emailErr instanceof Error ? emailErr.message : String(emailErr),
      });
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment. Please try again.' },
      { status: 500 }
    );
  }
}
