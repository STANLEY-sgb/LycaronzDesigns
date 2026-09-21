import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { auth } from '@/auth';

export async function GET() {
  // Admin-only: return recent orders
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { product: true },
  });

  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { productId, name, email, phone, message } = data;

    if (!productId || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ensure product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });

    const order = await prisma.order.create({
      data: {
        productId,
        name,
        email: email || null,
        phone,
        message: message || null,
      },
    });

    // send email notification if SMTP configured
    const smtpHost = process.env.SMTP_HOST;
    if (smtpHost) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        });

        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'info.sharontylors@gmail.com';

        await transporter.sendMail({
          from: process.env.FROM_EMAIL || 'no-reply@sharon-tailors.com',
          to: adminEmail,
          subject: `New Order / Inquiry for ${product.name}`,
          text: `New inquiry from ${name} (${phone}, ${email || 'no email provided'})\n\nProduct: ${product.name}\nMessage: ${message || '-'}\n\nView in admin panel: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/orders`,
        });
      } catch (err) {
        console.error('Failed to send email notification:', err);
      }
    } else {
      console.log('SMTP not configured — skipping email send. Order created:', order.id);
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
