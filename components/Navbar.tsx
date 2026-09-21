'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collection', href: '/products' },
    { name: 'About Atelier', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to book a tailoring consultation.'
  )}`;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0A0D1F]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3' 
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 sm:py-6'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center font-black text-white text-base sm:text-lg shadow-md group-hover:scale-105 transition-transform duration-300 border border-white/20">
              <Image 
                src="/images/LOGO.jpg" 
                alt="Lycaronz Designs" 
                fill 
                className="object-cover"
                sizes="48px"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-2xl tracking-tighter text-white leading-none">
                LYCARONZ <span className="text-amber-400">DESIGNS</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mt-0.5">
                Haute Couture
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-xs lg:text-sm font-black uppercase tracking-widest text-gray-200 hover:text-amber-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/book-appointment" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span>Book Fitting</span>
            </Link>
          </div>

          {/* Mobile Right Icons */}
          <div className="md:hidden flex items-center gap-2 sm:gap-3">
            <a 
              href={`tel:${BUSINESS_INFO.primaryPhoneRaw}`}
              aria-label="Call Lycaronz Designs"
              className="p-2 rounded-xl bg-white/10 text-white border border-white/10 active:scale-90 transition-transform"
            >
              <Phone size={18} />
            </a>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Lycaronz Designs"
              className="p-2 rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 active:scale-90 transition-transform"
            >
              <MessageCircle size={18} />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl bg-white/10 text-white border border-white/10 active:scale-90 transition-transform"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[60px] z-[99] bg-[#0A0D1F]/98 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto md:hidden border-t border-white/10"
          >
            <div className="flex flex-col space-y-4 py-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-black text-white hover:text-amber-400 py-3 border-b border-white/5 transition-colors uppercase tracking-tight flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Explore</span>
                </Link>
              ))}

              <div className="pt-6 space-y-3">
                <Link 
                  href="/book-appointment"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-black text-sm uppercase tracking-widest shadow-xl"
                >
                  <Sparkles size={16} className="text-amber-300" />
                  <span>Book Appointment</span>
                </Link>

                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-[#25D366] text-white font-black text-sm uppercase tracking-widest shadow-xl"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-white/10 text-center text-xs text-gray-400">
              <p className="font-bold text-white mb-1">Jemba Plaza Atelier, Kampala</p>
              <p>Mon - Sat: 8:00 AM - 7:00 PM</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
