// scripts/ensure-prisma-provider.mjs
// Synchronizes prisma/schema.prisma datasource provider with the active DATABASE_URL protocol.
// Ensures Prisma generates the correct client (PostgreSQL for cloud databases, SQLite for local dev).

import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

function getActiveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL.trim();
  }

  // Check local .env file if available
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return 'file:./prisma/dev.db';
}

function ensureProvider() {
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ prisma/schema.prisma not found at:', schemaPath);
    process.exit(1);
  }

  const dbUrl = getActiveDatabaseUrl();
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');
  const targetProvider = isPostgres ? 'postgresql' : 'sqlite';

  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const providerRegex = /(datasource\s+db\s*\{[^}]*provider\s*=\s*)"([^"]+)"/;
  const match = schemaContent.match(providerRegex);

  if (!match) {
    console.warn('⚠️ Could not find datasource db provider in schema.prisma');
    return;
  }

  const currentProvider = match[2];

  if (currentProvider !== targetProvider) {
    console.log(`🔄 Switching Prisma datasource provider: ${currentProvider} ➔ ${targetProvider} (based on DATABASE_URL)`);
    const updatedContent = schemaContent.replace(
      providerRegex,
      `$1"${targetProvider}"`
    );
    fs.writeFileSync(schemaPath, updatedContent, 'utf8');
  } else {
    console.log(`✅ Prisma datasource provider already set to: ${targetProvider}`);
  }
}

ensureProvider();
