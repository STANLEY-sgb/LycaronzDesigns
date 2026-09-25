import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const runtime = 'nodejs';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
  'video/x-m4v',
];

const MAX_BYTES = 150 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Image storage is not configured yet. Refresh the page after the next deploy and try the upload again.' },
      { status: 503 }
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: 'Upload request was empty.' }, { status: 400 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session) {
          throw new Error('You must be signed in to upload a file.');
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // The catalog row is saved by the product form after this URL returns.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.';
    const status = message.includes('signed in') ? 401 : 400;
    console.error('Upload error:', message);
    return NextResponse.json({ error: message }, { status });
  }
}
