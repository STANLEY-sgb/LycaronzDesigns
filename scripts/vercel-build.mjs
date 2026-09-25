// Prepares Prisma for a Vercel build against Supabase Postgres.
// Does not print connection strings or passwords.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key]) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(path.join(process.cwd(), '.env'));

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.error('DATABASE_URL is missing. Set the Supabase pooler URL on Vercel before deploying.');
  process.exit(1);
}

if (databaseUrl.startsWith('file:')) {
  console.error('DATABASE_URL points at SQLite. Production must use the Supabase Postgres URL.');
  process.exit(1);
}

const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');
if (!isPostgres) {
  console.error('DATABASE_URL must be a postgresql:// connection string.');
  process.exit(1);
}

if (!process.env.DIRECT_URL) {
  let port = '';
  try {
    port = new URL(databaseUrl).port;
  } catch {
    port = '';
  }
  if (port === '6543') {
    console.error(
      'DIRECT_URL is missing. DATABASE_URL is the transaction pooler (port 6543), which cannot run migrations. Set DIRECT_URL to the Supabase session pooler (port 5432).'
    );
    process.exit(1);
  }
  process.env.DIRECT_URL = databaseUrl;
  console.log('DIRECT_URL was not set. Using DATABASE_URL for migrations because it is not the transaction pooler.');
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('Generating Prisma client for PostgreSQL...');
run('npx', ['prisma', 'generate']);

console.log('Applying Postgres migrations to Supabase...');
run('npx', ['prisma', 'migrate', 'deploy']);

if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  console.log('Seeding admin account and catalog (existing admin password is left unchanged)...');
  run('node', ['scripts/seed.mjs']);
} else {
  console.log('ADMIN_EMAIL or ADMIN_PASSWORD is not set. Skipping admin seed.');
}
