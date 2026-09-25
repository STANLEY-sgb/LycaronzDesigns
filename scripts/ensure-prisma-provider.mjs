// The datasource is locked to PostgreSQL (Supabase).
// This script no longer rewrites the schema to SQLite during a Vercel build.
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
const schema = fs.readFileSync(schemaPath, 'utf8');

if (!/provider\s*=\s*"postgresql"/.test(schema)) {
  console.error('prisma/schema.prisma must use provider = "postgresql".');
  process.exit(1);
}

if (!/directUrl\s*=\s*env\("DIRECT_URL"\)/.test(schema)) {
  console.error('prisma/schema.prisma must set directUrl = env("DIRECT_URL") for Supabase migrations.');
  process.exit(1);
}

console.log('Prisma datasource is PostgreSQL with a direct URL for migrations.');
