import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, name, email, phone, message, consent } = body;

    if (!consent) {
      return NextResponse.json({ error: 'Consent required' }, { status: 400 });
    }
    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing contact fields' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'info.sharontylors@gmail.com';

    const smtpHost = process.env.SMTP_HOST;
    if (smtpHost) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        });

        const subject = productId ? `Contact request for product ${productId}` : 'Contact request from website';
        const text = `Contact details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || '-'}\nProduct ID: ${productId || '-'}\nTime: ${new Date().toISOString()}`;

        await transporter.sendMail({
          from: process.env.FROM_EMAIL || 'no-reply@sharon-tailors.com',
          to: adminEmail,
          subject,
          text,
        });
      } catch (err) {
        console.error('Failed to send contact email:', err);
        return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
      }
    } else {
      // SMTP not configured — log to server console
      console.log('Contact submission (SMTP not configured):', { productId, name, email, phone, message, time: new Date().toISOString() });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Contact endpoint error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
