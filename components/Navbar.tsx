'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/products' },
    { name: 'About Atelier', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to book a bespoke tailoring consultation.'
  )}`;

  return (
    <nav
      aria-label="Main Navigation"
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0D1F]/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl py-2.5 sm:py-3'
          : 'bg-gradient-to-b from-[#0A0D1F]/90 via-[#0A0D1F]/60 to-transparent py-3 sm:py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center gap-2">

          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 group min-w-0 shrink"
            aria-label="LYCARONZ DESIGNS Home"
          >
            <Logo size="sm" priority className="group-hover:scale-105 xs:hidden" />
            <Logo size="md" priority className="group-hover:scale-105 hidden xs:block" />
            <div className="flex flex-col min-w-0">
              <span className="font-black text-xs xs:text-base sm:text-xl lg:text-2xl tracking-tighter text-white leading-none truncate">
                LYCARONZ <span className="text-amber-400">DESIGNS</span>
              </span>
              <span className="hidden xs:block text-[8px] xs:text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mt-0.5 truncate">
                Haute Couture &amp; Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs lg:text-sm font-black uppercase tracking-widest transition-all relative py-1 ${
                    isActive
                      ? 'text-amber-300 font-extrabold'
                      : 'text-gray-200 hover:text-amber-300'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-gray-950 font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Sparkles size={14} className="text-gray-950" aria-hidden="true" />
              <span>Book Fitting</span>
            </Link>
          </div>

          {/* Mobile Quick Actions (phone + whatsapp — bottom nav handles routing) */}
          <div className="md:hidden flex items-center gap-1.5 xs:gap-2 shrink-0">
            <a
              href={`tel:${BUSINESS_INFO.primaryPhoneRaw}`}
              aria-label="Call Lycaronz Designs"
              className="w-9 h-9 xs:w-10 xs:h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
            >
              <Phone size={16} aria-hidden="true" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Lycaronz Designs"
              className="w-9 h-9 xs:w-10 xs:h-10 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 flex items-center justify-center active:scale-90 transition-transform"
            >
              <MessageCircle size={16} aria-hidden="true" />
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}
