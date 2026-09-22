import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';

const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
const ALLOWED_VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.ogg', '.m4v'];
const ALLOWED_EXTS = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_VIDEO_EXTS];
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;  // 20 MB
const MAX_VIDEO_BYTES = 150 * 1024 * 1024; // 150 MB

function sanitizeFilename(name: string): string {
  // Remove path traversal, null bytes, and keep only safe characters
  return name
    .replace(/[/\\]/g, '')
    .replace(/\0/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .substring(0, 200);
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please log in to upload files.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawFilename = searchParams.get('filename') || 'upload';
  const filename = sanitizeFilename(rawFilename);
  const ext = path.extname(filename).toLowerCase();

  // Server-side file type validation
  if (!ALLOWED_EXTS.includes(ext)) {
    return NextResponse.json(
      { error: `Unsupported file type "${ext}". Allowed: JPG, PNG, WebP, GIF, MP4, WebM, MOV, OGG.` },
      { status: 415 }
    );
  }

  const isVideo = ALLOWED_VIDEO_EXTS.includes(ext);
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  const maxLabel = isVideo ? '150 MB' : '20 MB';

  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const useBlob = Boolean(blobToken && !blobToken.includes('your-'));

    if (useBlob) {
      // Vercel Blob (production) — stream directly
      const blob = await put(filename, request.body as ReadableStream, {
        access: 'public',
        addRandomSuffix: true,
      });
      return NextResponse.json({ url: blob.url, name: filename });
    }

    // In a Vercel serverless environment, local filesystem writes are ephemeral/read-only
    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: 'Vercel Blob storage is not configured. Please set BLOB_READ_WRITE_TOKEN in your Vercel project environment variables.' },
        { status: 500 }
      );
    }

    // Local development: read body and validate size
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > maxBytes) {
      const sizeMB = (buffer.length / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { error: `File too large (${sizeMB} MB). Maximum allowed for ${isVideo ? 'videos' : 'images'}: ${maxLabel}.` },
        { status: 413 }
      );
    }

    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Received an empty file. Please try again.' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    // Generate unique collision-safe filename
    const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);
    await fs.promises.writeFile(filePath, buffer);

    // Build absolute URL for local dev
    const baseUrl = (process.env.NEXTAUTH_URL || process.env.AUTH_URL || 'http://localhost:3000').replace(/\/$/, '');
    const url = `${baseUrl}/uploads/${uniqueName}`;

    return NextResponse.json({ url, path: `/uploads/${uniqueName}`, name: uniqueName });
  } catch (error) {
    // Log full detail server-side; expose only a safe message to the client
    console.error('[Upload] Error processing upload:', error);
    return NextResponse.json(
      { error: 'Upload failed due to a server error. Please try again.' },
      { status: 500 }
    );
  }
}
