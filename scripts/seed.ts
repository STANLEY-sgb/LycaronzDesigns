// scripts/seed.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create admin user
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@sharrontailors.com' },
      update: {},
      create: {
        email: 'admin@sharrontailors.com',
        password: await hashPassword('AdminPassword123!'),
        name: 'Admin',
        isAdmin: true,
      },
    });
    console.log('✅ Admin user created/updated:', admin.email);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  }

  // Create sample products
  const sampleProducts = [
    {
      name: 'Classic White Shirt',
      description: 'Elegant white shirt perfect for office wear',
      price: 85000,
      category: "Men's Wear",
      featured: true,
    },
    {
      name: 'Designer Ankara Dress',
      description: 'Elegant African fashion dress for special occasions',
      price: 250000,
      category: "Women's Wear",
      featured: true,
    },
    {
      name: 'Custom Tailored Suit',
      description: 'Premium custom tailored suit for formal events',
      price: 850000,
      category: 'Custom Tailoring',
      featured: true,
    },
    {
      name: 'Corporate Blazer',
      description: 'Professional blazer for corporate dress code',
      price: 180000,
      category: "Women's Wear",
      featured: false,
    },
    {
      name: 'Casual Khaki Pants',
      description: 'Comfortable khaki pants for everyday wear',
      price: 120000,
      category: "Men's Wear",
      featured: false,
    },
    {
      name: 'Wedding Dress Alteration',
      description: 'Professional wedding dress alterations and customization',
      price: 450000,
      category: 'Custom Tailoring',
      featured: false,
    },
  ];

  for (const product of sampleProducts) {
    try {
      const existingProduct = await prisma.product.findFirst({
        where: { name: product.name },
      });

      if (!existingProduct) {
        await prisma.product.create({ data: product });
        console.log('✅ Product created:', product.name);
      }
    } catch (error) {
      console.error('❌ Failed to create product:', product.name, error);
    }
  }

  console.log('\n🎉 Database seed completed!');
  console.log('\n📝 Default Admin Account:');
  console.log('   Email: admin@sharrontailors.com');
  console.log('   Password: AdminPassword123!');
  console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
