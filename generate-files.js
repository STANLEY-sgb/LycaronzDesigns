#!/usr/bin/env node

/**
 * Sharon Tailors MVP - Complete File Generator
 * 
 * This script generates all necessary files for the project
 * Run with: node generate-files.js
 */

const fs = require('fs');
const path = require('path');

const files = {
  // App layout
  'app/layout.tsx': `import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Sharon Tailors - Custom Tailoring & E-Commerce',
  description: 'Modern tailoring and fashion e-commerce shop. Custom style, perfect fit.',
  openGraph: {
    title: 'Sharon Tailors',
    description: 'Custom Style, Perfect Fit',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
`,

  // Global CSS
  'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #0052FF;
  --secondary: #FFD700;
  --success: #00C851;
  --danger: #ff4444;
  --bg-light: #F8F9FA;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  overflow-x: hidden;
}

body {
  @apply bg-white text-gray-900 font-sans antialiased;
  overflow-x: hidden;
  width: 100%;
}

@layer components {
  .container-custom {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center px-10 py-4 bg-primary text-white rounded-xl font-black shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 text-center uppercase tracking-widest;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center px-10 py-4 bg-secondary text-gray-900 border-none rounded-xl font-black shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 text-center uppercase tracking-widest;
  }

  .card {
    @apply bg-white rounded-[2rem] shadow-xl hover:shadow-[0_20px_50px_rgba(0,82,255,0.2)] transition-all duration-500 border-2 border-gray-50 overflow-hidden;
  }

  .section-title {
    @apply text-4xl md:text-7xl font-black text-gray-900 mb-8 text-center leading-[0.9] tracking-tighter uppercase;
  }

  .input-field {
    @apply w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold;
  }

  .nav-tab {
    @apply text-lg font-black uppercase tracking-widest px-6 py-2 rounded-xl transition-all border-b-4 border-transparent hover:border-primary hover:text-primary active:scale-95;
  }
}

/* Marquee Animation */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 20s linear infinite;
}

.pause-on-hover:hover .animate-marquee {
  animation-play-state: paused;
}

/* Mobile Optimizations */
@media (max-width: 640px) {
  .section-title {
    @apply text-3xl;
  }
  
  .btn-primary, .btn-secondary {
    @apply w-full py-4;
  }
}

/* Smooth Scrolling for iOS */
.scroll-touch {
  -webkit-overflow-scrolling: touch;
}
`,

  // Lib - Prisma
  'lib/prisma.ts': `import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`,

  // Lib - Auth
  'lib/auth.ts': `import { hash, compare } from 'bcryptjs';

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  return phone.length >= 10 && /^[0-9+\\-\\s()]*$/.test(phone);
}
`,

  // Lib - Constants
  'lib/constants.ts': `export const CATEGORIES = [
  'Men\\'s Wear',
  'Women\\'s Wear',
  'Custom Tailoring',
];

export const SERVICES = [
  'Repair',
  'Custom Tailoring',
  'Fitting',
  'Alterations',
];

export const BUSINESS_INFO = {
  name: 'Sharon Tailors',
  tagline: 'Custom Style, Perfect Fit',
  location: 'Kampala, Jemba Plaza, just after Old Taxi Park',
  phone: '+256 705 241 179',
  email: 'info@sharrontailors.com',
  whatsapp: '+256 702 084 480',
};

export const COLORS = {
  primary: '#6B4C9A',
  secondary: '#D4A574',
  accent: '#E85D6B',
  'accent-alt': '#0B6B6B',
};
`,

  // Lib - Utils
  'lib/utils.ts': `export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
`,

  // API - Products
  'app/api/products/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: { category?: string; featured?: boolean } = {};
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.name || !data.price || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        image: data.image,
        imageUrl: data.imageUrl,
        video: data.video,
        featured: data.featured || false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
`,

  'app/api/products/[id]/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price ? parseFloat(data.price) : undefined,
        category: data.category,
        image: data.image,
        imageUrl: data.imageUrl,
        video: data.video,
        featured: data.featured,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
`,

  // API - Appointments
  'app/api/appointments/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail, isValidPhone } from '@/lib/auth';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.phone || !data.date || !data.service) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidPhone(data.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    if (data.email && !isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        date: new Date(data.date),
        service: data.service,
        notes: data.notes,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
`,

  'app/api/appointments/[id]/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
`,

  // API - Auth Settings
  'app/api/auth/settings/route.ts': `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, currentPassword, newPassword } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If changing password, verify current one
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new one' },
          { status: 400 }
        );
      }

      const isValid = await verifyPassword(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Incorrect current password' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (newPassword) updateData.password = await hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
`,

  // API - Upload
  'app/api/upload/route.ts': `import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ error: 'Missing filename or body' }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
`,

  // Components - Navbar
  'components/Navbar.tsx': `'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav 
      className={\`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 \${
        scrolled ? 'bg-white/90 backdrop-blur-xl shadow-xl py-3' : 'bg-transparent py-6'
      }\`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 group-hover:rotate-12 \${
              scrolled ? 'bg-primary text-white shadow-lg' : 'bg-white text-primary'
            }\`}>
              ST
            </div>
            <span className={\`font-black text-2xl tracking-tighter hidden sm:block \${
              scrolled ? 'text-primary' : 'text-white'
            }\`}>
              SHARON <span className={scrolled ? 'text-secondary' : 'text-white/80'}>TAILORS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={\`text-sm font-black uppercase tracking-widest transition-all hover:scale-110 \${
                  scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-secondary'
                }\`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/book-appointment" className={\`btn-primary !px-6 !py-2.5 !text-sm \${
              scrolled ? '' : 'bg-white !text-primary hover:bg-white/90'
            }\`}>
              Book Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <a href="tel:+256705241179" className={\`p-2 rounded-full \${scrolled ? 'bg-primary/10 text-primary' : 'bg-white/10 text-white'}\`}>
              <Phone size={20} />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={\`p-2 rounded-xl transition-colors \${
                scrolled ? 'bg-gray-100 text-gray-900' : 'bg-white/10 text-white'
              }\`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-primary flex flex-col p-8 md:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-white font-black text-2xl tracking-tighter">ST MENU</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col space-y-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-5xl font-black text-white/40 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-12"
              >
                <Link 
                  href="/book-appointment"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary bg-white !text-primary w-full py-6 text-2xl shadow-2xl"
                >
                  Book Appointment
                </Link>
              </motion.div>
            </div>

            <div className="mt-auto flex justify-center gap-8">
               <a href="https://wa.me/256702084480" className="text-white/60 hover:text-white">
                <MessageCircle size={32} />
               </a>
               <a href="tel:+256705241179" className="text-white/60 hover:text-white">
                <Phone size={32} />
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
`,

  // Components - Footer
  'components/Footer.tsx': `'use client';

import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Sharon Tailors</h3>
            <p className="text-gray-300">{BUSINESS_INFO.tagline}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Custom Tailoring</li>
              <li>Repairs & Alterations</li>
              <li>Fitting Services</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-300 text-sm mb-2">{BUSINESS_INFO.location}</p>
            <p className="text-gray-300 text-sm mb-2">{BUSINESS_INFO.phone}</p>
            <a
              href={\`https://wa.me/\${BUSINESS_INFO.whatsapp.replace(/\\D/g, '')}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition text-sm"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-gray-500 pt-8 text-center text-gray-300">
          <p>&copy; 2026 Sharon Tailors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
`,

  // Components - ProductCard
  'components/ProductCard.tsx': `'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  imageUrl?: string | null;
  category: string;
  description?: string | null;
  video?: string | null;
  featured?: boolean;
}

export default function ProductCard({
  name,
  price,
  image,
  imageUrl,
  category,
}: ProductCardProps) {
  const imageSrc = imageUrl || image || '';

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="card group"
    >
      <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 font-black text-2xl">
              ST
            </div>
            <span className="font-black text-gray-400 uppercase tracking-widest text-sm">{name}</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-lg">
            {category}
          </span>
        </div>
      </div>

      <div className="p-8">
        <h3 className="font-black text-xl mb-4 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">
          {name}
        </h3>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</span>
            <span className="text-primary font-black text-xl tracking-tighter">
              UGX {price.toLocaleString()}
            </span>
          </div>
          <Link
            href={\`/products\`}
            className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all shadow-xl active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
`,

  // Components - Hero
  'components/Hero.tsx': `'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden bg-gradient-to-br from-[#6B4C9A] via-[#8B6CBF] to-[#D4A574]/10">
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-bold tracking-wider uppercase border border-white/30"
          >
            Kampala&apos;s Premium Tailors
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight"
          >
            SHARON <span className="text-secondary">TAILORS</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-10 font-medium leading-relaxed px-4"
          >
            Elevate your style with custom craftsmanship and a perfect fit. 
            Traditional beauty meets modern elegance.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6"
          >
            <Link href="/products" className="w-full sm:w-auto btn-primary bg-white !text-primary hover:bg-white/90">
              Shop Collection
            </Link>
            <Link href="/book-appointment" className="w-full sm:w-auto btn-secondary !border-white !text-white hover:bg-white hover:!text-primary">
              Book Appointment
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48"></div>
    </section>
  );
}
`,

  // Components - Providers
  'components/Providers.tsx': `'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
`,

  // Customer Pages
  'app/(customer)/page.tsx': `'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, ChevronRight, Star, Clock } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  video: string | null;
  featured: boolean;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
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

  const marqueeTexts = [
    "Perfect Fit Guaranteed",
    "Custom Ankara Styles",
    "Corporate Elegance",
    "Quick Alterations",
    "Wedding Dress Specialists",
    "Jemba Plaza, Kampala",
  ];

  return (
    <div className="overflow-hidden bg-white">
      <Navbar />
      
      <Hero />

      {/* Marquee Section */}
      <div className="bg-primary py-4 overflow-hidden whitespace-nowrap border-y border-white/10">
        <div className="animate-marquee flex gap-12 items-center">
          {[...marqueeTexts, ...marqueeTexts].map((text, i) => (
            <span key={i} className="text-white font-black text-lg md:text-2xl uppercase tracking-tighter flex items-center gap-4">
              <Star className="text-secondary fill-secondary" size={20} />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Video Inspiration Section */}
      <section className="py-24 px-4 bg-gray-50 overflow-hidden">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Style Inspiration</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Witness our craftsmanship in motion. From stunning Ankara to elegant wedding gowns.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { src: "/videos/ankara-styles.mp4", label: "Ankara Elegance" },
              { src: "/videos/wedding-dresses.mp4", label: "Bridal Dreams" },
              { src: "/videos/office-wears.mp4", label: "Corporate Class" }
            ].map((video, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group relative rounded-[2rem] overflow-hidden shadow-2xl bg-black aspect-[9/16] cursor-pointer"
              >
                <video 
                  src={video.src} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                  autoPlay
                  muted 
                  loop
                  playsInline
                ></video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                  <h3 className="text-white font-bold text-2xl tracking-tight">{video.label}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA - Super Bright and Mobile Optimized */}
      <section className="py-20 px-4 bg-[#25D366] relative overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="glass-card !bg-white/10 p-10 md:p-16 border-white/30"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Need a Fast Quote?</h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 font-medium max-w-2xl mx-auto">
              Share your design ideas or ask for pricing instantly on WhatsApp. 
              We&apos;re ready to bring your vision to life!
            </p>
            <a 
              href="https://wa.me/256702084480" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-white text-[#25D366] px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              <MessageCircle size={32} />
              CHAT ON WHATSAPP
            </a>
          </motion.div>
        </div>
        {/* Background bubbles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-4 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="section-title !mb-2">New Arrivals</h2>
              <p className="text-gray-500 font-medium">Explore our latest handcrafted pieces</p>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-primary font-black text-lg hover:gap-4 transition-all uppercase tracking-widest">
              View All Collection <ChevronRight />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-gray-100 animate-pulse"></div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400 font-medium text-xl italic">
                Our latest collection is coming soon...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location Section - Redesigned for Mobile */}
      <section className="py-24 px-4 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">FIND US IN <span className="text-secondary">KAMPALA</span></h2>
              <p className="text-xl text-gray-400 mb-10 font-medium">
                Located at the prestigious Jemba Plaza, we are easily accessible and ready to serve you.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <MapPin className="text-secondary" />, title: "Address", content: "Jemba Plaza, Kampala, Uganda (After Old Taxi Park)" },
                  { icon: <Phone className="text-secondary" />, title: "Call Us", content: "+256 705 241 179" },
                  { icon: <Clock className="text-secondary" />, title: "Hours", content: "Mon-Sat: 8AM - 7PM" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-sm text-secondary mb-1">{item.title}</h4>
                      <p className="text-lg font-bold">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/5"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.757833005838!2d32.57688137496426!3d0.3129189996840003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb943d63b2f9%3A0x6d9f6f6f6f6f6f6f!2sJemba%20Plaza!5e0!3m2!1sen!2sug!4v1714500000000!5m2!1sen!2sug" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                className="grayscale invert hover:grayscale-0 hover:invert-0 transition-all duration-700"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
`,

  'app/(customer)/products/page.tsx': `'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/lib/constants';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  video: string | null;
  featured: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const url = category
          ? \`/api/products?category=\${encodeURIComponent(category)}\`
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
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="section-title mb-8">Our Products</h1>

          <div className="mb-8 flex flex-wrap items-center gap-4">
            <span className="font-semibold text-gray-700">Filter by Category:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('')}
                className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${
                  category === ''
                    ? 'bg-[#6B4C9A] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }\`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={\`px-4 py-2 rounded-full text-sm font-medium transition-colors \${
                    category === cat
                      ? 'bg-[#6B4C9A] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                  }\`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B4C9A] mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length > 0 ? (
                products.map((product: Product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-20 bg-white rounded-lg shadow-sm">
                  No products found in this category.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
`,

  'app/(customer)/product/[id]/page.tsx': `'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  MessageCircle, 
  ChevronLeft, 
  Star, 
  Clock, 
  ShieldCheck,
  Play,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { BUSINESS_INFO } from '@/lib/constants';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  video: string | null;
  featured: boolean;
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(\`/api/products/\${id}\`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Product Not Found</h1>
          <p className="text-gray-500 mb-8 font-medium">The product you are looking for does not exist or has been removed.</p>
          <Link href="/products" className="btn-primary px-10 py-4">Back to Collection</Link>
        </div>
        <Footer />
      </>
    );
  }

  const whatsappLink = \`https://wa.me/\${BUSINESS_INFO.whatsapp.replace(/\\D/g, '')}?text=Hi Sharon Tailors! I am interested in the "\${product.name}" (UGX \${product.price.toLocaleString()}). Can I get more details?\`;

  return (
    <div className="bg-white">
      <Navbar />

      <main className="pt-10 pb-24">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="mb-10">
            <Link href="/products" className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-bold uppercase tracking-widest text-xs">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Product Media */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 group">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <ShoppingBag size={100} strokeWidth={1} />
                  </div>
                )}
                
                {product.featured && (
                  <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-xl">
                    <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Star size={14} className="fill-primary" />
                      Featured Piece
                    </span>
                  </div>
                )}

                <button className="absolute top-8 right-8 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-xl hover:bg-white transition-all active:scale-90">
                  <Share2 size={20} />
                </button>
              </div>

              {product.video && (
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl bg-black group cursor-pointer">
                  <video 
                    src={product.video} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                      <Play size={24} fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <span className="text-white font-black uppercase tracking-widest text-[10px]">Watch Showcase</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col h-full"
            >
              <div className="mb-2">
                <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 uppercase leading-[0.9] tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <p className="text-4xl font-black text-primary">
                  UGX {product.price.toLocaleString()}
                </p>
                <div className="h-8 w-[1px] bg-gray-200"></div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                  <span className="text-gray-400 text-xs font-bold ml-2">(4.9/5 Rating)</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 mb-8">
                {['description', 'specifications', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={\`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all relative \${
                      activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                    }\`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mb-12 min-h-[100px]">
                {activeTab === 'description' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-lg leading-relaxed font-medium">
                    {product.description || "No description provided for this exquisite piece. Each Sharon Tailors garment is handcrafted with precision and care to ensure a perfect fit and timeless style."}
                  </motion.p>
                )}
                {activeTab === 'specifications' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Material', value: 'Premium Fabrics' },
                      { label: 'Technique', value: 'Handcrafted' },
                      { label: 'Origin', value: 'Kampala, Uganda' },
                      { label: 'Style', value: 'Custom Design' }
                    ].map((spec) => (
                      <div key={spec.label} className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{spec.label}</p>
                        <p className="font-bold text-gray-900">{spec.value}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'shipping' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-lg leading-relaxed font-medium">
                    We offer standard delivery within Kampala in 1-2 business days. For custom tailoring, please allow 7-14 days for production. Pick up is also available at Jemba Plaza.
                  </motion.p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4 mt-auto">
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-primary !bg-[#25D366] !border-[#25D366] py-6 rounded-[2rem] text-xl flex items-center justify-center gap-4 shadow-2xl active:scale-95"
                >
                  <MessageCircle size={28} />
                  ORDER ON WHATSAPP
                </a>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/book-appointment" 
                    className="flex items-center justify-center gap-2 py-5 rounded-[2rem] bg-gray-100 text-gray-900 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                  >
                    <Clock size={18} />
                    Book Fitting
                  </Link>
                  <button className="flex items-center justify-center gap-2 py-5 rounded-[2rem] bg-white border border-gray-200 text-gray-900 font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95">
                    <ShieldCheck size={18} />
                    Size Guide
                  </button>
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-10 flex justify-between items-center px-4 py-6 border-y border-gray-100">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Handmade</p>
                  <p className="text-xs font-bold text-gray-900">With Love</p>
                </div>
                <div className="h-8 w-[1px] bg-gray-100"></div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery</p>
                  <p className="text-xs font-bold text-gray-900">Nationwide</p>
                </div>
                <div className="h-8 w-[1px] bg-gray-100"></div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support</p>
                  <p className="text-xs font-bold text-gray-900">24/7 Chat</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
`,

  'app/(customer)/about/page.tsx': `'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">About Sharon Tailors</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated to the art of tailoring, we bring your fashion dreams to life with precision, 
              passion, and a perfect fit.
            </p>
          </motion.div>

          {/* Story Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in the heart of Kampala, Sharon Tailors began with a simple mission: 
                  to provide high-quality, custom-tailored clothing that makes people feel confident 
                  and comfortable.
                </p>
                <p>
                  Over the years, we have grown into a trusted name for elegant African fashion, 
                  corporate wear, and exquisite bridal alterations. Our location at Jemba Plaza 
                  has become a hub for creativity and craftsmanship.
                </p>
                <p>
                  Every garment we create is a result of meticulous attention to detail and 
                  a deep understanding of our clients&apos; unique styles.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-primary flex items-center justify-center text-white text-4xl font-bold"
            >
              <span className="text-center p-8">Sharon Tailors<br/>Since 2026</span>
            </motion.div>
          </div>

          {/* Values Section */}
          <div className="bg-gray-50 rounded-3xl p-12 mb-24">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Quality',
                  desc: 'We use the finest materials and traditional techniques to ensure durability and elegance.',
                  icon: '✨'
                },
                {
                  title: 'Precision',
                  desc: 'A perfect fit is non-negotiable. We measure twice and cut once for ultimate accuracy.',
                  icon: '📏'
                },
                {
                  title: 'Customer First',
                  desc: 'Your satisfaction is our priority. We listen, advise, and deliver beyond expectations.',
                  icon: '🤝'
                }
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white p-8 rounded-xl shadow-sm text-center"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Services Teaser */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Experience the Difference</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether it&apos;s a custom suit, an Ankara dress, or a simple alteration, 
              we are here to help you look your best.
            </p>
            <div className="flex justify-center gap-4">
              <a href="/products" className="btn-primary">View Products</a>
              <a href="/contact" className="btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
`,

  'app/(customer)/contact/page.tsx': `'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { BUSINESS_INFO } from '@/lib/constants';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">We&apos;d love to hear from you. Get in touch for custom designs and fittings.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Call Us</h4>
                    <p className="text-gray-600">{BUSINESS_INFO.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">WhatsApp</h4>
                    <p className="text-gray-600">{BUSINESS_INFO.whatsapp}</p>
                    <a 
                      href={\`https://wa.me/\${BUSINESS_INFO.whatsapp.replace(/\\D/g, '')}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-medium hover:underline"
                    >
                      Chat now
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Email</h4>
                    <p className="text-gray-600">{BUSINESS_INFO.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Location</h4>
                    <p className="text-gray-600">{BUSINESS_INFO.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Business Hours</h4>
                    <p className="text-gray-600">Mon - Sat: 8:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Sun: Closed</p>
                  </div>
                </div>
              </div>

              {/* Google Maps Iframe */}
              <div className="rounded-2xl overflow-hidden shadow-md h-[300px] bg-gray-200">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.757833005838!2d32.57688137496426!3d0.3129189996840003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb943d63b2f9%3A0x6d9f6f6f6f6f6f6f!2sJemba%20Plaza!5e0!3m2!1sen!2sug!4v1714500000000!5m2!1sen!2sug" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition">
                      <option>General Inquiry</option>
                      <option>Custom Design Quote</option>
                      <option>Appointment Request</option>
                      <option>Alterations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-primary py-3 rounded-lg font-bold text-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
`,

  'app/(customer)/book-appointment/page.tsx': `'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BUSINESS_INFO, SERVICES } from '@/lib/constants';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function BookAppointment() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    service: SERVICES[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Appointment booked successfully! We will contact you soon.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          date: '',
          service: SERVICES[0],
          notes: '',
        });
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to book appointment');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-[#6B4C9A] py-8 px-8 text-white text-center">
              <h1 className="text-3xl font-bold">Book an Appointment</h1>
              <p className="mt-2 opacity-90">Schedule a session for a perfect fit</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+256 700 000 000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                <input
                  type="datetime-local"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Special Requests</label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Describe what you need..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={\`w-full btn-primary py-4 text-lg \${loading ? 'opacity-70 cursor-not-allowed' : ''}\`}
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </form>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-[#6B4C9A] font-bold text-xl mb-2">Visit Us</div>
              <p className="text-gray-600 text-sm">{BUSINESS_INFO.location}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-[#6B4C9A] font-bold text-xl mb-2">Call Us</div>
              <p className="text-gray-600 text-sm">{BUSINESS_INFO.phone}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-[#6B4C9A] font-bold text-xl mb-2">WhatsApp</div>
              <p className="text-gray-600 text-sm">{BUSINESS_INFO.whatsapp}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
`,

  // Admin Pages
  'app/(auth)/admin/layout.tsx': `'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { signOut } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', href: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Appointments', href: '/admin/appointments', icon: <Calendar size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-primary text-white">
          <div className="flex items-center h-16 px-6 bg-primary-dark">
            <span className="text-2xl font-black tracking-tighter uppercase">ST Admin</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={\`group flex items-center px-4 py-3 text-sm font-black rounded-xl transition-all \${
                    pathname === item.href
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }\`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-black text-white/70 hover:bg-white/10 hover:text-white rounded-xl transition-all"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-primary text-white rounded-xl shadow-lg"
        >
          <Menu size={24} />
        </button>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-primary text-white p-6 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-10">
                  <span className="text-2xl font-black tracking-tighter uppercase">ST Admin</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/10 rounded-full">
                    <X size={24} />
                  </button>
                </div>
                <nav className="space-y-4">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={\`flex items-center px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all \${
                        pathname === item.href
                          ? 'bg-white text-primary shadow-xl'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      }\`}
                    >
                      <span className="mr-4">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="absolute bottom-10 left-6 right-6">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-6 py-4 text-white/60 hover:text-white rounded-2xl transition-all"
                  >
                    <LogOut size={20} className="mr-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
`,

  'app/(auth)/admin/page.tsx': `import { redirect } from 'next/navigation';

export default function AdminPage() {
  redirect('/admin/dashboard');
}
`,

  'app/(auth)/admin/login/page.tsx': `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-black flex items-center justify-center p-6">
      <div className="absolute top-10 left-10">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-all font-black uppercase tracking-widest text-xs">
          <ArrowLeft size={16} />
          Back to Store
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-16">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-gray-900">Admin <span className="text-primary">Portal</span></h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Secure Management Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-12 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none font-bold"
                  placeholder="admin@sharrontailors.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-12 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all outline-none font-bold"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-5 rounded-[2rem] text-xl shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  AUTHENTICATING...
                </>
              ) : (
                'ACCESS DASHBOARD'
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Protected by Industry Standard Encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}
`,

  'app/(auth)/admin/dashboard/page.tsx': `'use client';

import { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Calendar, 
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    appointments: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const prodRes = await fetch('/api/products');
        const prods = await prodRes.json();
        
        const apptRes = await fetch('/api/appointments');
        const appts = await apptRes.json();
        
        setStats({
          products: prods.length,
          appointments: appts.length,
          pendingAppointments: appts.filter((a: { status: string }) => a.status === 'pending').length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Products', value: stats.products, icon: <ShoppingBag size={24} />, color: 'bg-blue-500' },
    { name: 'Total Appointments', value: stats.appointments, icon: <Calendar size={24} />, color: 'bg-purple-500' },
    { name: 'Pending Requests', value: stats.pendingAppointments, icon: <Clock size={24} />, color: 'bg-yellow-500' },
    { name: 'Site Visitors', value: '1,284', icon: <TrendingUp size={24} />, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Dashboard</h1>
        <p className="text-gray-500 font-medium">Welcome back to Sharon Tailors Admin Panel.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={\`p-3 rounded-2xl text-white \${stat.color}\`}>
                {stat.icon}
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Live Stats</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight">Recent Appointments</h2>
            <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            <div className="text-center py-10 text-gray-400 font-medium">
              No recent activity found.
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center justify-between p-6 rounded-3xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all text-primary">
              <span className="font-black uppercase tracking-widest text-sm">Add Product</span>
              <ChevronRight size={20} />
            </button>
            <button className="flex items-center justify-between p-6 rounded-3xl bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-all text-secondary">
              <span className="font-black uppercase tracking-widest text-sm">Manage Orders</span>
              <ChevronRight size={20} />
            </button>
            <button className="flex items-center justify-between p-6 rounded-3xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-all text-accent">
              <span className="font-black uppercase tracking-widest text-sm">Site Settings</span>
              <ChevronRight size={20} />
            </button>
            <button className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all text-gray-600">
              <span className="font-black uppercase tracking-widest text-sm">Help Center</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`,

  'app/(auth)/admin/products/page.tsx': `'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  Video, 
  Check, 
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  video: string | null;
  featured: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: "Women's Wear",
    imageUrl: '',
    video: '',
    featured: false,
  });

  const categories = ["Men's Wear", "Women's Wear", "Custom Tailoring"];

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'imageUrl' | 'video') {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await fetch(\`/api/upload?filename=\${file.name}\`, {
        method: 'POST',
        body: file,
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, [type]: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const url = editingProduct 
        ? \`/api/products/\${editingProduct.id}\`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          category: "Women's Wear",
          imageUrl: '',
          video: '',
          featured: false,
        });
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(\`/api/products/\${id}\`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter((p: Product) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl || '',
      video: product.video || '',
      featured: product.featured || false,
    });
    setIsModalOpen(true);
  }

  function openNewModal() {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: "Women's Wear",
      imageUrl: '',
      video: '',
      featured: false,
    });
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Products</h1>
          <p className="text-gray-500 font-medium text-center sm:text-left">Manage your boutique&apos;s collection.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 px-8 py-4"
        >
          <Plus size={24} />
          ADD NEW PRODUCT
        </button>
      </header>

      {/* Product List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Category</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={40} />
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt="" fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/20">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 uppercase tracking-tight">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900">UGX {product.price.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                    No products found in the collection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black uppercase tracking-tight">
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Product Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="input-field"
                        placeholder="e.g. Elegant Silk Gown"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Price (UGX)</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="input-field"
                        placeholder="e.g. 150000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Description</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="input-field resize-none"
                      placeholder="Describe the product details..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="input-field appearance-none cursor-pointer"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                      <label className="relative flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ml-3 text-sm font-black text-gray-600 uppercase tracking-widest">Featured</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Product Image</label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                          className="input-field"
                          placeholder="Image URL..."
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'imageUrl')}
                            className="hidden"
                            id="image-upload"
                          />
                          <label 
                            htmlFor="image-upload"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-gray-200 transition-all"
                          >
                            <ImageIcon size={16} />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Product Video</label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={formData.video}
                          onChange={(e) => setFormData({...formData, video: e.target.value})}
                          className="input-field"
                          placeholder="Video URL..."
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload(e, 'video')}
                            className="hidden"
                            id="video-upload"
                          />
                          <label 
                            htmlFor="video-upload"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-gray-200 transition-all"
                          >
                            <Video size={16} />
                            {uploading ? 'Uploading...' : 'Upload Video'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-5 rounded-[2rem] text-xl disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={24} />
                          SAVING...
                        </>
                      ) : (
                        <>
                          <Check size={24} />
                          SAVE PRODUCT
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`,

  'app/(auth)/admin/appointments/page.tsx': `'use client';

import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  CheckCircle, 
  XCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  date: string;
  service: string;
  status: string;
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(\`/api/appointments/\${id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) {
        setAppointments(appointments.map((a: Appointment) => 
          a.id === id ? { ...a, status } : a
        ));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Appointments</h1>
        <p className="text-gray-500 font-medium">Manage fitting and consultation requests.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((appt: Appointment, i) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center w-full lg:w-auto">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Calendar size={32} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">{appt.name}</h3>
                    <span className={\`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest \${
                      appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }\`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-500 uppercase tracking-tighter">
                    <span className="flex items-center gap-2"><Phone size={16} /> {appt.phone}</span>
                    <span className="flex items-center gap-2"><Clock size={16} /> {new Date(appt.date).toLocaleString()}</span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-gray-700">{appt.service}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => updateStatus(appt.id, 'confirmed')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm"
                >
                  <CheckCircle size={18} />
                  Confirm
                </button>
                <button 
                  onClick={() => updateStatus(appt.id, 'cancelled')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-gray-100 text-center text-gray-400 font-bold uppercase tracking-widest italic">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
}
`,

  'app/(auth)/admin/settings/page.tsx': `'use client';

import { useEffect, useState } from 'react';
import { 
  User, 
  Lock, 
  Save, 
  Check, 
  Loader2,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        if (session?.user) {
          setFormData(prev => ({
            ...prev,
            name: session.user.name || '',
            email: session.user.email || '',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Settings updated successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        setError(data.error || 'Failed to update settings');
        toast.error(data.error || 'Update failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Settings</h1>
        <p className="text-gray-500 font-medium">Customize your administrative account credentials.</p>
      </header>

      <div className="max-w-3xl">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field pl-12"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Admin Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-field pl-12"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-gray-800">
                <ShieldAlert size={20} className="text-accent" />
                Change Password (Optional)
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Current Password</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  className="input-field"
                  placeholder="Enter current password to verify"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="input-field"
                    placeholder="New secure password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="input-field"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-5 rounded-[2rem] text-xl shadow-2xl transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    UPDATING...
                  </>
                ) : (
                  <>
                    <Save size={24} />
                    SAVE CHANGES
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
`,

  // Root Auth & Middleware
  'auth.ts': `import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
`,

  'middleware.ts': `import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = req.nextUrl.pathname === "/admin/login"

  if (isAdminRoute && !isLoggedIn && !isLoginPage) {
    return Response.redirect(new URL("/admin/login", req.nextUrl))
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/admin/dashboard", req.nextUrl))
  }

  return null
})

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
`,
};

// Create directories
const dirs = [
  'app/api/products/[id]',
  'app/api/appointments/[id]',
  'app/api/auth/settings',
  'app/api/upload',
  'app/(customer)/products',
  'app/(customer)/product/[id]',
  'app/(customer)/about',
  'app/(customer)/contact',
  'app/(customer)/book-appointment',
  'app/(auth)/admin/login',
  'app/(auth)/admin/dashboard',
  'app/(auth)/admin/products',
  'app/(auth)/admin/appointments',
  'app/(auth)/admin/settings',
  'components',
  'lib',
  'prisma',
];

console.log('🚀 Creating Sharon Tailors Polished Project...\n');

// Create directories
dirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  // Ensure parent directory exists even if not in dirs array
  const parentDir = path.dirname(fullPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created file: ${filePath}`);
});

console.log('\n✨ Project structure updated successfully!\n');
console.log('📝 Next steps:');
console.log('1. npm install');
console.log('2. npx prisma migrate dev --name init');
console.log('3. npm run dev\n');
