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

  // ── Sample products ─────────────────────────────────────────
  const products = [
    {
      name: 'Designer Ankara Wrap Dress',
      description: 'Vibrant African print wrap dress, perfect for galas and celebrations.',
      price: 250000,
      category: "Women's Wear",
      imageUrl: '/images/womens_wear_1.jpg',
      featured: true,
    },
    {
      name: 'Custom 3-Piece Bespoke Suit',
      description: 'Precision-cut bespoke suit in premium wool blend. Made to your exact measurements.',
      price: 850000,
      category: 'Custom Tailoring',
      imageUrl: '/images/mens_custom_suit.png',
      featured: true,
    },
    {
      name: 'Classic White Dress Shirt',
      description: 'Crisp, tailored white dress shirt for corporate and formal occasions.',
      price: 85000,
      category: "Men's Wear",
      imageUrl: '/images/mens_white_shirt.png',
      featured: true,
    },
    {
      name: 'Khaki Slim-Fit Pants',
      description: 'Flattering slim-fit khaki pants tailored for the modern professional.',
      price: 120000,
      category: "Men's Wear",
      imageUrl: '/images/mens_khaki_pants.png',
      featured: false,
    },
    {
      name: 'Bridal Gown Alteration & Custom Train',
      description: 'Bespoke bridal alterations and detachable train design for your special day.',
      price: 450000,
      category: 'Custom Tailoring',
      imageUrl: '/images/wed.png',
      featured: true,
    },
    {
      name: 'Elegant Corporate Blazer',
      description: 'Sharp structured blazer for boardroom presence. Available in custom fabric.',
      price: 180000,
      category: "Women's Wear",
      imageUrl: '/images/womens_wear_3.jpg',
      featured: false,
    },
  ];

  let created = 0;
  let skipped = 0;
  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({ data: product });
      console.log('  ✅ Created:', product.name);
      created++;
    } else {
      console.log('  ⏭  Already exists:', product.name);
      skipped++;
    }
  }

  const baseUrl = (process.env.NEXTAUTH_URL || process.env.AUTH_URL || 'http://localhost:3000').replace(/\/$/, '');
  console.log(`\nAdmin login: ${baseUrl}/admin/login`);
  if (email) console.log(`Admin email: ${email}`);
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
