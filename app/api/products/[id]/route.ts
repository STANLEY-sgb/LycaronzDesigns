import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const parsedPrice = data.price === '' || data.price === null || data.price === undefined
      ? null
      : Number(data.price);
    if (parsedPrice !== null && Number.isNaN(parsedPrice)) {
      return NextResponse.json({ error: 'Price must be a number.' }, { status: 400 });
    }
    if (!data.name || !String(data.name).trim()) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }
    if (!data.category) {
      return NextResponse.json({ error: 'Category is required.' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: String(data.name).trim(),
        description: data.description ? String(data.description).trim() : null,
        price: parsedPrice,
        category: data.category,
        ...(Object.prototype.hasOwnProperty.call(data, 'image') ? { image: data.image || null } : {}),
        imageUrl: data.imageUrl || null,
        video: data.video || null,
        featured: Boolean(data.featured),
      },
    });

    // Revalidate public pages so updated product appears immediately
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/product/${params.id}`);

    return NextResponse.json(product, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product. Please try again.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await prisma.product.delete({
        where: { id: params.id },
      });
    } catch (deleteError) {
      const code = (deleteError as { code?: string })?.code;
      if (code === 'P2003') {
        return NextResponse.json(
          { error: 'This product has customer orders and cannot be deleted. Remove those orders first.' },
          { status: 409 }
        );
      }
      throw deleteError;
    }

    // Revalidate public pages so deleted product is removed immediately
    revalidatePath('/');
    revalidatePath('/products');

    return NextResponse.json({ message: 'Product deleted successfully' }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product. Please try again.' },
      { status: 500 }
    );
  }
}
