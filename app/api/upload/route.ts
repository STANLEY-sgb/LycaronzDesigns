import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';

// Support both Vercel Blob (when BLOB_READ_WRITE_TOKEN is provided) and local filesystem storage (public/uploads)
export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  // Allow unauthenticated uploads during local development for convenience.
  // In production, require a valid session.
  if (!session && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'upload';

  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    // If a Vercel Blob token is configured and not the placeholder, use @vercel/blob (production)
    const useBlob = blobToken && !blobToken.includes('your-');
    if (useBlob) {
      const blob = await put(filename, request.body as ReadableStream, { access: 'public' });
      return NextResponse.json(blob);
    }

    // Otherwise, save to local public/uploads folder for local development
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(filename) || '';

    // Basic validation: restrict video size and allowed extensions
    const maxBytes = 150 * 1024 * 1024; // 150 MB limit (adjustable)
    const allowedVideoExts = ['.mp4', '.webm', '.mov', '.ogg', '.m4v'];
    const isVideo = allowedVideoExts.includes(ext.toLowerCase());

    if (isVideo && buffer.length > maxBytes) {
      return NextResponse.json({ error: 'File too large. Max 150MB allowed for videos.' }, { status: 413 });
    }

    // Use a timestamp + random to avoid collisions
    const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await fs.promises.writeFile(filePath, buffer);

    // Build a usable URL. Prefer NEXTAUTH_URL if set (e.g., http://localhost:3000)
    const baseUrl = process.env.NEXTAUTH_URL || '';
    const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/uploads/${uniqueName}` : `/uploads/${uniqueName}`;

    return NextResponse.json({ url, path: `/uploads/${uniqueName}`, name: uniqueName });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
