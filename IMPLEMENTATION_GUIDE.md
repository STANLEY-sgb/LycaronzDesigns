# IMPLEMENTATION GUIDE - LYCARONZ DESIGNS MVP

This file contains instructions for building the complete app structure.

## Step 1: Initial Setup

### 1.1 Create Next.js Project
```bash
cd [project-directory]
npm create next-app@latest . --typescript --tailwind --eslint
```

When prompted:
- Use TypeScript? Yes
- Use ESLint? Yes
- Use Tailwind CSS? Yes
- Use src/ directory? No
- App Router? Yes

### 1.2 Install Additional Dependencies
```bash
npm install prisma @prisma/client next-auth bcryptjs @vercel/blob sonner framer-motion
npm install -D prisma
```

### 1.3 Initialize Prisma
```bash
npx prisma init
```

## Step 2: File Structure Creation

### 2.1 Root Configuration Files
Already created:
- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.js`
- ✅ `next.config.js`
- ✅ `postcss.config.js`
- ✅ `.env.example`
- ✅ `.gitignore`

### 2.2 Prisma Setup
1. Copy the schema from `prisma-schema.prisma` to `prisma/schema.prisma`
2. Update `.env.local`:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```
3. Run: `npx prisma migrate dev --name init`

### 2.3 Create App Directory Structure

Create these folders:
```
app/
├── api/
│   ├── auth/
│   ├── products/
│   ├── appointments/
│   └── upload/
├── (auth)/
│   └── admin/
│       ├── dashboard/
│       ├── login/
│       ├── products/
│       └── appointments/
├── (customer)/
│   ├── products/
│   ├── product/
│   │   └── [id]/
│   ├── book-appointment/
│   ├── contact/
│   ├── about/
│   └── (components for customer)
└── components/
    ├── shared/
    ├── customer/
    └── admin/
```

## Step 3: Key Files to Create

### 3.1 Utility Files

**lib/prisma.ts**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**lib/auth.ts**
```typescript
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export function createToken(email: string, isAdmin: boolean) {
  return sign({ email, isAdmin }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
```

**lib/constants.ts**
```typescript
export const CATEGORIES = ['Men\'s Wear', 'Women\'s Wear', 'Custom Tailoring'];

export const SERVICES = ['Repair', 'Custom Tailoring', 'Fitting', 'Alterations'];

export const BUSINESS_INFO = {
  name: 'LYCARONZ DESIGNS',
  tagline: 'Custom Style, Perfect Fit',
  location: 'Kampala, Jemba Plaza, just after Old Taxi Park',
  phone: '+256 XXX XXX XXX',
  email: 'info@sharrontailors.com',
  whatsapp: '+256 XXX XXX XXX',
};

export const COLORS = {
  primary: '#6B4C9A',
  secondary: '#D4A574',
  accent: '#E85D6B',
  'accent-alt': '#0B6B6B',
};
```

### 3.2 API Routes

**app/api/auth/register/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, isAdmin: false },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**app/api/products/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: any = {};
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const products = await prisma.product.findMany({ where });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const data = await request.json();
    const product = await prisma.product.create({ data });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

**app/api/appointments/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const appointment = await prisma.appointment.create({ data });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
```

### 3.3 Components

**components/Navbar.tsx**
```typescript
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              SN
            </div>
            <span className="font-bold text-primary hidden sm:inline">LYCARONZ DESIGNS</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/products" className="hover:text-primary transition">Products</Link>
            <Link href="/book-appointment" className="hover:text-primary transition">Book Appointment</Link>
            <Link href="/contact" className="hover:text-primary transition">Contact</Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <Link href="/products" className="block py-2 hover:text-primary">Products</Link>
            <Link href="/book-appointment" className="block py-2 hover:text-primary">Book Appointment</Link>
            <Link href="/contact" className="block py-2 hover:text-primary">Contact</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
```

**components/ProductCard.tsx**
```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card overflow-hidden"
    >
      <div className="relative w-full h-48 bg-gray-200">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white text-center px-4">{name}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500">{category}</p>
        <h3 className="font-bold text-lg mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-accent font-bold text-lg">UGX {price.toLocaleString()}</span>
          <Link
            href={`/product/${id}`}
            className="btn-primary text-sm py-2 px-4"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
```

### 3.4 Page Components

**app/(customer)/page.tsx** (Homepage)
```typescript
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products?featured=true');
        const data = await res.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <>
      <Navbar />
      
      <section className="min-h-screen bg-gradient-to-br from-primary via-purple-100 to-white flex items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-primary mb-6"
          >
            LYCARONZ DESIGNS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            Custom Style, Perfect Fit
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/products" className="btn-primary">
              Shop Now
            </Link>
            <Link href="/book-appointment" className="btn-secondary">
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center">Loading...</div>
            ) : (
              featuredProducts.map((product: any) => (
                <ProductCard key={product.id} {...product} />
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
```

**app/(customer)/products/page.tsx** (Product Listing)
```typescript
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/lib/constants';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const url = category
          ? `/api/products?category=${category}`
          : '/api/products';
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-light py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="section-title mb-8">Our Products</h1>

          <div className="mb-8">
            <label className="block mb-2 font-semibold">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center">Loading...</div>
            ) : products.length > 0 ? (
              products.map((product: any) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No products found.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
```

## Step 4: Testing

After creating all files:

1. Run: `npm run dev`
2. Visit: `http://localhost:3000`
3. Check all pages load correctly
4. Test responsive design on mobile
5. Create test products in admin panel

## Step 5: Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## Complete File Checklist

- [ ] Root config files
- [ ] Prisma schema & setup
- [ ] Lib utilities
- [ ] API routes (auth, products, appointments)
- [ ] Components (Navbar, Footer, ProductCard, etc.)
- [ ] Customer pages (homepage, products, details, booking, contact)
- [ ] Admin pages (login, dashboard, management pages)
- [ ] Global CSS
- [ ] Seed script
- [ ] README & documentation

For detailed implementation of each file, refer to the complete code templates above.
