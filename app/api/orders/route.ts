import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { sendOrderNotification } from '@/lib/email';

export async function GET() {
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

    // ── Sanitize & validate ────────────────────────────────────────────────
    const productId = String(data.productId || '').trim();
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();
    const email = data.email ? String(data.email).trim() : null;
    const message = data.message ? String(data.message).trim() : null;

    if (!productId || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
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

    // ── Send notification email (non-blocking) ────────────────────────────
    sendOrderNotification({
      id: order.id,
      name: order.name,
      email: order.email,
      phone: order.phone,
      message: order.message,
      productName: product.name,
      productPrice: product.price,
      productCategory: product.category,
      createdAt: order.createdAt,
    }).catch((err) => {
      console.error('[EMAIL] Failed to send order notification:', err?.message || err);
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
