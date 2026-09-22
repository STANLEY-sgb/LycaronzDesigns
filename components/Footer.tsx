'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { BUSINESS_INFO, SERVICES } from '@/lib/constants';

export default function Footer() {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to inquire about bespoke tailoring.'
  )}`;

  return (
    <footer className="bg-[#0A0D1F] text-white border-t border-white/10 pt-14 sm:pt-16 pb-24 md:pb-12 overflow-hidden relative">
      {/* Subtle ambient lighting */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container-custom relative z-10">

        {/* Grid: single-col on mobile → 2-col at sm → 4-col at lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-10 sm:mb-14">

          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <Logo size="md" className="group-hover:scale-105" />
              <div className="flex flex-col min-w-0">
                <span className="font-black text-xl tracking-tighter text-white leading-none">
                  LYCARONZ <span className="text-amber-400">DESIGNS</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400 mt-0.5">
                  Haute Couture &amp; Atelier
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {BUSINESS_INFO.tagline}. Handcrafted bespoke fashion, elegant African couture, corporate wear, and bridal alterations in the heart of Kampala.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with LYCARONZ DESIGNS on WhatsApp"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-bold transition-all"
              >
                <MessageCircle size={14} aria-hidden="true" />
                <span>WhatsApp Concierge</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.primaryPhoneRaw}`}
                aria-label={`Call LYCARONZ DESIGNS at ${BUSINESS_INFO.primaryPhone}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold transition-all"
              >
                <Phone size={14} aria-hidden="true" />
                <span>Direct Call</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <nav aria-label="Footer navigation" className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-300 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              {[
                { label: 'Home', href: '/' },
                { label: 'All Collections', href: '/products' },
                { label: 'About Atelier', href: '/about' },
                { label: 'Contact Atelier', href: '/contact' },
                { label: 'Book Fitting', href: '/book-appointment' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-amber-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Couture Services */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-300 mb-4">
              Atelier Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              {SERVICES.map((srv, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Sparkles size={11} className="text-amber-400/70 shrink-0" aria-hidden="true" />
                  <span>{srv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier Visit & Hours */}
          <address className="lg:col-span-3 space-y-3 not-italic">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-300 mb-4">
              Visit Atelier
            </h4>

            <div className="flex items-start gap-2.5 text-xs text-gray-300">
              <MapPin size={15} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="break-words">{BUSINESS_INFO.location}</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-gray-300">
              <Phone size={15} className="text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="break-words">
                <a
                  href={`tel:${BUSINESS_INFO.primaryPhoneRaw}`}
                  className="hover:underline"
                  aria-label={`Call ${BUSINESS_INFO.phone}`}
                >
                  {BUSINESS_INFO.phone}
                </a>
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-gray-300">
              <Mail size={15} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="hover:underline overflow-wrap-anywhere break-all"
                aria-label={`Email ${BUSINESS_INFO.email}`}
              >
                {BUSINESS_INFO.email}
              </a>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-gray-300 pt-1">
              <Clock size={15} className="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-white">Mon – Sat: 8:00 AM – 7:00 PM</p>
                <p className="text-[11px] text-gray-400">Sunday: Closed for Atelier Design</p>
              </div>
            </div>
          </address>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-gray-400">
              <ShieldCheck size={13} className="text-amber-400" aria-hidden="true" />
              Handcrafted in Kampala, Uganda
            </span>
            <Link
              href="/admin/login"
              className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 text-[11px] uppercase tracking-wider"
              aria-label="Staff portal login"
            >
              <span>Staff Portal</span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
