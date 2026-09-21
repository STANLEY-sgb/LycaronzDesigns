import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, currentPassword, newPassword } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If changing password, verify current one
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new one' },
          { status: 400 }
        );
      }

      const isValid = await verifyPassword(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Incorrect current password' },
          { status: 400 }
        );
      }
    }

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (newPassword) updateData.password = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
