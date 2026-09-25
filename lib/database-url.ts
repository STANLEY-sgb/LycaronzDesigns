/**
 * Supabase transaction pooler (port 6543) rejects Prisma prepared statements
 * unless pgbouncer=true is set, and Vercel must cap connections per instance.
 */
export function normalizeDatabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return raw;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return raw;
  }

  const host = url.hostname;
  const isSupabase = host.includes('pooler.supabase.com') || host.endsWith('.supabase.co');
  const isTransactionPool = url.port === '6543';

  if (isSupabase && !url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'require');
  }

  if (isTransactionPool) {
    url.searchParams.set('pgbouncer', 'true');
    url.searchParams.set('connection_limit', '1');
  }

  return url.toString();
}
