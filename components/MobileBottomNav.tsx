'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Shirt,
  Calendar,
  Mail,
  MoreHorizontal,
  X,
  Info,
  MessageCircle,
  Phone,
  MapPin,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

const PRIMARY_TABS = [
  { icon: Home,     label: 'Home',    href: '/' },
  { icon: Shirt,    label: 'Designs', href: '/products' },
  { icon: Calendar, label: 'Book',    href: '/book-appointment' },
  { icon: Mail,     label: 'Contact', href: '/contact' },
] as const;

/**
 * Fixed bottom navigation bar — mobile only (hidden on md+).
 * Shows on all customer pages; hidden on /admin routes.
 */
export default function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Hide on all admin routes
  if (pathname.startsWith('/admin')) return null;

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to enquire about your services.'
  )}`;

  return (
    <>
      {/* ── More Drawer Overlay ────────────────────────────────────────────── */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Slide-up panel */}
            <motion.div
              key="panel"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A0D1F] rounded-t-3xl border-t border-amber-500/20 shadow-2xl"
              style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Logo size="xs" />
                  <span className="font-black text-sm uppercase tracking-widest text-white">
                    LYCARONZ <span className="text-amber-400">DESIGNS</span>
                  </span>
                </div>
                <button
                  onClick={() => setMoreOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center active:scale-90 transition-transform"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Links grid */}
              <div className="p-4 grid grid-cols-2 gap-3">
                {/* About Atelier */}
                <Link
                  href="/about"
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                    <Info size={20} />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wide">About Atelier</span>
                </Link>

                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                    <MessageCircle size={20} />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wide">WhatsApp</span>
                </a>

                {/* Call */}
                <a
                  href={`tel:${BUSINESS_INFO.primaryPhoneRaw}`}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wide">Call Us</span>
                </a>

                {/* Directions */}
                <a
                  href="https://maps.google.com/?q=Jemba+Plaza+Kampala+Uganda"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-400/10 text-rose-400 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wide">Directions</span>
                </a>
              </div>

              {/* Business info footer */}
              <div className="mx-4 mb-2 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {BUSINESS_INFO.workingHours}
                </p>
                <p className="text-[10px] font-bold text-amber-400 mt-0.5">
                  {BUSINESS_INFO.shortLocation}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Fixed Bottom Navigation Bar ───────────────────────────────────── */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0A0D1F]/98 backdrop-blur-xl border-t border-amber-500/20 shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch h-[3.75rem]">
          {/* Primary tabs */}
          {PRIMARY_TABS.map(({ icon: Icon, label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 pt-1 relative group active:scale-90 transition-transform"
              >
                {/* Active indicator pill */}
                {active && (
                  <motion.span
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-b-full bg-amber-400"
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.75}
                  className={active ? 'text-amber-400' : 'text-gray-400 group-hover:text-gray-200'}
                  aria-hidden="true"
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-wide leading-none ${
                    active ? 'text-amber-400' : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* More tab */}
          <button
            onClick={() => setMoreOpen(true)}
            aria-label="More options"
            aria-expanded={moreOpen}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 pt-1 group active:scale-90 transition-transform"
          >
            <MoreHorizontal
              size={20}
              strokeWidth={1.75}
              className="text-gray-400 group-hover:text-gray-200"
              aria-hidden="true"
            />
            <span className="text-[10px] font-black uppercase tracking-wide leading-none text-gray-500">
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
