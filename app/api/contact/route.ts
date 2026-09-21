import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail, isValidPhone } from '@/lib/auth';
import { sendInquiryNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Sanitize & validate ────────────────────────────────────────────────
    const name    = String(body.name    || '').trim();
    const email   = String(body.email   || '').trim();
    const phone   = body.phone   ? String(body.phone).trim()   : null;
    const subject = body.subject ? String(body.subject).trim() : 'General Inquiry';
    const message = body.message ? String(body.message).trim() : null;
    const consent = Boolean(body.consent);

    if (!consent) {
      return NextResponse.json({ error: 'Consent required to process your inquiry.' }, { status: 400 });
    }
    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and phone are required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    if (phone && !isValidPhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
    }

    const refId = `INQ-${Date.now().toString(36).toUpperCase()}`;

    // ── Save to database ───────────────────────────────────────────────────
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        refId,
      },
    });

    // ── Send notification email (non-blocking — DB record is preserved if email fails) ──
    sendInquiryNotification({
      name,
      email,
      phone,
      subject,
      message,
      source: 'Contact Page',
      refId: inquiry.refId,
    }).catch((err) => {
      console.error('[EMAIL] Failed to send inquiry notification:', err?.message || err);
    });

    return NextResponse.json({ success: true, refId: inquiry.refId }, { status: 201 });
  } catch (err) {
    console.error('Contact endpoint error:', err);
    return NextResponse.json(
      { error: 'Failed to send your message. Please try again or contact us via WhatsApp.' },
      { status: 500 }
    );
  }
}
