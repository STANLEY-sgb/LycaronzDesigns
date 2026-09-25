// Plain JS seed — runs with: node scripts/seed.mjs
// Uses the locally installed @prisma/client and bcryptjs (no ts-node needed)
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
const { hash } = bcryptjs;

const prisma = new PrismaClient();

async function main() {
  console.log('\n🌱 LYCARONZ DESIGNS — Database Seed\n');

  // ── Admin user ───────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('Admin seed skipped. Set ADMIN_EMAIL and ADMIN_PASSWORD.');
  } else {
    const hashedPassword = await hash(password, 10);
    const admin = await prisma.user.upsert({
      where: { email },
      update: { isAdmin: true },
      create: {
        email,
        password: hashedPassword,
        name: 'LYCARONZ Admin',
        isAdmin: true,
      },
    });
    console.log('✅ Admin account ready:', admin.email);
    console.log('   Password was set only if this account was new. It is not printed here.');
  }

  console.log('Sample products skipped. The catalog is copied from the existing SQLite shop data.');

  const baseUrl = (process.env.NEXTAUTH_URL || process.env.AUTH_URL || 'http://localhost:3000').replace(/\/$/, '');
  console.log(`\nAdmin login: ${baseUrl}/admin/login`);
  if (email) console.log(`Admin email: ${email}`);
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
