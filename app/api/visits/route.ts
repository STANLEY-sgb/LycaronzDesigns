import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Visit Tracking API — Vercel-safe implementation
 *
 * On Vercel serverless, the filesystem is read-only (except /tmp) and ephemeral
 * between cold starts, so writing visits.json is not viable in production.
 *
 * Strategy:
 *  - POST: Accept the visit ping, log it server-side. No FS writes.
 *    Per-visit email notifications are intentionally disabled (too noisy for
 *    a production atelier site; real analytics should use a proper service).
 *  - GET (admin-only): Returns an empty array in production. For a full
 *    implementation, add a `Visit` model to the Prisma schema and persist
 *    visits to the database.
 *
 * The VisitTracker client component fires-and-forgets this endpoint, so
 * returning { success: true } without storing data is safe — it will never
 * block page rendering or user interactions.
 */

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Parse the payload so we can log it server-side for debugging
    const body = await request.json().catch(() => ({}));
    const p = (body as { path?: string }).path || '/';
    const referrer = (body as { referrer?: string }).referrer || 'none';
    const ua = request.headers.get('user-agent') || 'unknown';
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Server-side log only (visible in Vercel Function Logs)
    console.log('[VISIT]', JSON.stringify({ path: p, referrer, ua, ip, time: new Date().toISOString() }));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Visit tracking error:', err);
    // Never let visit tracking break the user experience
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

export async function GET() {
  // Admin-only: placeholder — returns empty array.
  // To persist visits, add a Visit model to prisma/schema.prisma and
  // replace this with a prisma.visit.findMany() query.
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json([], { status: 200 });
}
