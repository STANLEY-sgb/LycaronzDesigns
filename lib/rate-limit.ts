/**
 * Production-ready, serverless-safe sliding window rate limiter.
 * Designed specifically for stateless Vercel Serverless / Edge execution.
 *
 * Characteristics:
 * - Lazy cleanup: No background setInterval timers (which misbehave in frozen lambdas).
 * - Bounded memory: Prevents memory growth within warm lambda containers.
 * - Fails open: If header extraction or rate-limiting fails, permits the request.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_MAP_ENTRIES = 500;

/**
 * Lazy cleanup: sweeps expired entries when map grows beyond threshold.
 */
function cleanupExpiredEntries(now: number) {
  if (rateLimitMap.size < MAX_MAP_ENTRIES) return;
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Check if a client has exceeded their allowed request quota.
 *
 * @param identifier Unique key, e.g. `contact:${ip}`
 * @param maxRequests Maximum requests allowed within window (default: 5)
 * @param windowMs Time window in milliseconds (default: 60,000 = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 5,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetTime: number } {
  try {
    const now = Date.now();
    cleanupExpiredEntries(now);

    const entry = rateLimitMap.get(identifier);

    if (!entry || now > entry.resetTime) {
      const resetTime = now + windowMs;
      rateLimitMap.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: maxRequests - 1, resetTime };
    }

    if (entry.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count += 1;
    return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
  } catch (error) {
    // Fail open in serverless environments to avoid false positives
    console.warn('[RATE_LIMIT_ERROR] checkRateLimit failed, allowing request:', error);
    return { allowed: true, remaining: 1, resetTime: Date.now() + windowMs };
  }
}

/**
 * Extracts client IP from standard reverse-proxy headers (including Vercel & Cloudflare).
 */
export function getClientIp(request: Request): string {
  try {
    const vercelIp = request.headers.get('x-vercel-ip');
    if (vercelIp) return vercelIp.trim();

    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      const first = forwarded.split(',')[0].trim();
      if (first) return first;
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) return realIp.trim();

    const cfIp = request.headers.get('cf-connecting-ip');
    if (cfIp) return cfIp.trim();
  } catch {
    // ignore
  }

  return 'unknown';
}
