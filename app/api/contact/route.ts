import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail, isValidPhone } from '@/lib/auth';
import { sendInquiryNotification } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // ── STAGE 1: Rate Limiting ──────────────────────────────────────────────
    const ip = getClientIp(request);
    const rate = checkRateLimit(`contact:${ip}`, 5, 60_000);
    if (!rate.allowed) {
      console.warn('[CONTACT_RATE_LIMIT_FAILED]', {
        client: ip === 'unknown' ? 'unknown' : `${ip.substring(0, 6)}***`,
        resetTime: new Date(rate.resetTime).toISOString(),
      });
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      );
    }

    // ── STAGE 2: Payload Parsing & Validation ───────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      console.warn('[CONTACT_VALIDATION_FAILED]', { reason: 'Malformed JSON payload' });
      return NextResponse.json(
        { error: 'Invalid request body. Please check your submission.' },
        { status: 400 }
      );
    }

    const name    = String(body.name    || '').trim();
    const email   = String(body.email   || '').trim();
    const phone   = body.phone   ? String(body.phone).trim()   : null;
    const subject = body.subject ? String(body.subject).trim() : 'General Inquiry';
    const message = body.message ? String(body.message).trim() : null;
    const consent = Boolean(body.consent);

    if (!consent) {
      console.warn('[CONTACT_VALIDATION_FAILED]', { reason: 'Consent was not granted' });
      return NextResponse.json(
        { error: 'Consent required to process your inquiry.' },
        { status: 400 }
      );
    }
    if (!name || !email || !phone) {
      console.warn('[CONTACT_VALIDATION_FAILED]', {
        missing: [!name && 'name', !email && 'email', !phone && 'phone'].filter(Boolean),
      });
      return NextResponse.json(
        { error: 'Name, email, and phone number are required.' },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      console.warn('[CONTACT_VALIDATION_FAILED]', { reason: 'Invalid email syntax' });
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }
    if (phone && !isValidPhone(phone)) {
      console.warn('[CONTACT_VALIDATION_FAILED]', { reason: 'Invalid phone format' });
      return NextResponse.json(
        { error: 'Please provide a valid phone number (at least 10 digits).' },
        { status: 400 }
      );
    }

    const refId = `INQ-${Date.now().toString(36).toUpperCase()}`;

    // ── STAGE 3: Database Persistence ───────────────────────────────────────
    let inquiry;
    try {
      inquiry = await prisma.inquiry.create({
        data: {
          name,
          email,
          phone,
          subject,
          message,
          refId,
        },
      });
    } catch (dbError) {
      const errMessage = dbError instanceof Error ? dbError.message : String(dbError);
      const errCode = (dbError as { code?: string })?.code || 'UNKNOWN_DB_CODE';
      console.error('[CONTACT_DATABASE_FAILED]', {
        code: errCode,
        message: errMessage,
      });

      return NextResponse.json(
        {
          error: 'Failed to record your message due to a database connection error. Please try again or reach us directly via WhatsApp.',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // ── STAGE 4: Email Notification (Awaited with error isolation) ───────────
    let emailSent = false;
    try {
      await sendInquiryNotification({
        name,
        email,
        phone,
        subject,
        message,
        source: 'Contact Page',
        refId: inquiry.refId,
      });
      emailSent = true;
    } catch (emailErr) {
      const emailMsg = emailErr instanceof Error ? emailErr.message : String(emailErr);
      console.error('[CONTACT_EMAIL_FAILED]', {
        refId: inquiry.refId,
        error: emailMsg,
      });
    }

    // Customer message is safely preserved in DB even if notification email failed
    return NextResponse.json(
      {
        success: true,
        refId: inquiry.refId,
        emailSent,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[CONTACT_UNKNOWN_ERROR]', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Failed to send your message. Please try again later or contact us via WhatsApp.' },
      { status: 500 }
    );
  }
}
