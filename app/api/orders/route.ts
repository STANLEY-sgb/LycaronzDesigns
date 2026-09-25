import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { sendOrderNotification } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { isValidEmail, isValidPhone } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { product: true },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`order:${ip}`, 5, 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      );
    }

    const data = await request.json();

    // ── Sanitize & validate ────────────────────────────────────────────────
    const productId = String(data.productId || '').trim();
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const email = data.email ? String(data.email).trim() : null;
    const message = data.message ? String(data.message).trim() : null;

    if (!productId || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields: product, name, and phone are required.' }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // ── Ensure product exists ─────────────────────────────────────────────
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // ── Save to database ──────────────────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        productId,
        name,
        email,
        phone,
        message,
      },
    });

    // ── Send notification email (awaited with error isolation) ───────────
    try {
      await sendOrderNotification({
        id: order.id,
        name: order.name,
        email: order.email,
        phone: order.phone,
        message: order.message,
        productName: product.name,
        productPrice: product.price,
        productCategory: product.category,
        createdAt: order.createdAt,
      });
    } catch (emailErr) {
      console.error('[ORDER_EMAIL_FAILED]', {
        id: order.id,
        error: emailErr instanceof Error ? emailErr.message : String(emailErr),
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
