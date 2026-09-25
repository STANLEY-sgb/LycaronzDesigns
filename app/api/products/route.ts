import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: { category?: string; featured?: boolean } = {};
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products, {
      headers: {
        // Prevent browser and CDN caching so public site always gets fresh data
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.name || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name and category are required.' },
        { status: 400 }
      );
    }

    const parsedPrice = data.price === '' || data.price === null || data.price === undefined
      ? null
      : Number(data.price);
    if (parsedPrice !== null && Number.isNaN(parsedPrice)) {
      return NextResponse.json({ error: 'Price must be a number.' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: String(data.name).trim(),
        description: data.description ? String(data.description).trim() : null,
        price: parsedPrice,
        category: data.category,
        image: data.image || null,
        imageUrl: data.imageUrl || null,
        video: data.video || null,
        featured: Boolean(data.featured),
      },
    });

    // Immediately revalidate public pages so new product appears without server restart
    revalidatePath('/');
    revalidatePath('/products');

    return NextResponse.json(product, {
      status: 201,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product. Please try again.' },
      { status: 500 }
    );
  }
}
