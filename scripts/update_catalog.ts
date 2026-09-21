// scripts/update_catalog.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Wiping and updating product catalog...');

  // Delete all existing products
  await prisma.product.deleteMany({});
  console.log('🗑️  Cleared existing products.');

  // Create updated catalog
  const products = [
    {
      name: 'Red Ankara Wrap Dress',
      description: 'Elegant wrap-style Ankara flare dress with white floral prints, perfect for cultural events and daytime wear.',
      price: 250000,
      category: "Women's Wear",
      imageUrl: '/images/womens_wear_1.jpg',
      featured: true,
    },
    {
      name: 'Peacock Pattern Ankara Dress',
      description: 'Exquisite African fashion dress with bold orange and blue peacock eye prints on a rich fabric.',
      price: 280000,
      category: "Women's Wear",
      imageUrl: '/images/womens_wear_2.jpg',
      featured: true,
    },
    {
      name: 'Vintage Blue Polka Dot Dress',
      description: 'A classic, retro-style royal blue tea-length dress with fine white polka dots, featuring a square neck and matching waist tie.',
      price: 190000,
      category: "Women's Wear",
      imageUrl: '/images/womens_wear_3.jpg',
      featured: false,
    },
    {
      name: 'Green Ankara Flare Dress',
      description: 'Beautiful, vibrant green skater-style Ankara dress featuring geometric tribal designs and a tailored bodice.',
      price: 240000,
      category: "Women's Wear",
      imageUrl: '/images/womens_wear_4.jpg',
      featured: false,
    },
    {
      name: 'Yellow Ankara Office Dress',
      description: 'Stunning modern office dress blending yellow Ankara fabric, custom collar design, and a dramatic dark blue tulle hem.',
      price: 220000,
      category: "Women's Wear",
      imageUrl: '/images/womens_wear_5.jpg',
      featured: true,
    },
    {
      name: 'Classic White Shirt',
      description: 'Elegant white long-sleeve dress shirt, tailored to perfection from premium cotton for office and formal wear.',
      price: 85000,
      category: "Men's Wear",
      imageUrl: '/images/mens_white_shirt.png',
      featured: true,
    },
    {
      name: 'Casual Khaki Pants',
      description: 'Premium slim-fit flat-front khaki chinos. Durable, comfortable, and perfect for smart-casual wear.',
      price: 120000,
      category: "Men's Wear",
      imageUrl: '/images/mens_khaki_pants.png',
      featured: false,
    },
    {
      name: 'Custom Tailored Suit',
      description: 'Bespoke men\'s slim-fit navy blue suit. Double-breasted blazer and trousers, tailored to your exact measurements.',
      price: 850000,
      category: 'Custom Tailoring',
      imageUrl: '/images/mens_custom_suit.png',
      featured: true,
    },
    {
      name: 'Wedding Dress Alteration',
      description: 'Professional bespoke wedding dress alterations, tailoring, and custom additions (detachable trains, bodice adjustments).',
      price: 8880000,
      category: 'Custom Tailoring',
      imageUrl: '/images/wed.png',
      featured: true,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`✅ Created product: ${created.name} (${created.category})`);
  }

  console.log('\n🎉 Product catalog successfully updated!');
}

main()
  .catch((e) => {
    console.error('❌ Error updating catalog:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
