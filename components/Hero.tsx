'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  MessageCircle,
  Scissors,
  Award,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Hero() {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to inquire about bespoke tailoring and custom orders.'
  )}`;

  return (
    <section className="relative flex items-center pt-20 xs:pt-24 sm:pt-28 pb-10 sm:pb-16 overflow-hidden bg-[#0A0D1F] text-white min-h-[100svh] sm:min-h-[92vh]">
      {/* Ambient Luxury Lighting & Subtle Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[280px] sm:w-[550px] h-[280px] sm:h-[550px] bg-amber-500/15 rounded-full blur-[120px] opacity-70" />
        <div className="absolute top-1/4 -right-32 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-blue-600/15 rounded-full blur-[130px] opacity-60" />
        <div className="absolute -bottom-32 left-1/3 w-[250px] sm:w-[480px] h-[250px] sm:h-[480px] bg-amber-400/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">

          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left">

            {/* Top Tagline Badge — constrained to prevent overflow at 320px */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 mb-4 sm:mb-6 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-black tracking-wider sm:tracking-widest uppercase shadow-lg shadow-black/20 max-w-[calc(100vw-2rem)] overflow-hidden"
            >
              <Sparkles size={12} className="text-amber-400 shrink-0" aria-hidden="true" />
              <span className="truncate">Kampala&apos;s Haute Couture &amp; Bespoke Atelier</span>
            </motion.div>

            {/* Main Brand Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[1.875rem] xs:text-[2.25rem] sm:text-6xl md:text-7xl font-black mb-4 sm:mb-6 leading-[0.95] tracking-tight text-white break-words"
            >
              LYCARONZ{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
                DESIGNS
              </span>
            </motion.h1>

            {/* Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 mb-7 sm:mb-10 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Handcrafted African couture, razor-sharp bespoke suits, and breathtaking bridal gowns.
              Tailored to your exact measurements at Jemba Plaza.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center lg:justify-start items-stretch sm:items-center mx-auto lg:mx-0 mb-6 sm:mb-10 w-full max-w-md sm:max-w-none"
            >
              <Link href="/products" className="btn-gold w-full sm:w-auto">
                <span>Explore Collection</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>

              <Link href="/book-appointment" className="btn-dark w-full sm:w-auto">
                <Calendar size={16} className="text-amber-400" aria-hidden="true" />
                <span>Book Fitting</span>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get a WhatsApp quote from Lycaronz Designs"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-black text-xs sm:text-sm uppercase tracking-widest active:scale-95 transition-all duration-300"
              >
                <MessageCircle size={18} aria-hidden="true" />
                <span>WhatsApp Quote</span>
              </a>
            </motion.div>

            {/* ── Mobile-only showcase strip (hidden on md+, where right column shows) ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="lg:hidden mb-6 sm:mb-8"
            >
              <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/15 bg-[#121733] shadow-2xl">
                {/* Outer glow */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-400/20 via-transparent to-blue-500/10 blur-md opacity-60" aria-hidden="true" />
                <div className="relative flex gap-2 p-2.5 overflow-hidden">
                  {/* Main large image */}
                  <div className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden min-w-0">
                    <Image
                      src="/images/womens_wear_1.jpg"
                      alt="LYCARONZ DESIGNS – Bespoke African Couture"
                      fill
                      sizes="(max-width: 640px) 60vw, 200px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                    <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-widest text-amber-300 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Women&apos;s Couture
                    </span>
                  </div>
                  {/* Stacked side images */}
                  <div className="flex flex-col gap-2 w-[38%] min-w-0">
                    <div className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src="/images/womens_wear_3.jpg"
                        alt="Bespoke African dress"
                        fill
                        sizes="(max-width: 640px) 35vw, 120px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                    </div>
                    <div className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src="/images/mens_custom_suit.png"
                        alt="Custom tailored suit"
                        fill
                        sizes="(max-width: 640px) 35vw, 120px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                      <span className="absolute bottom-1 left-1 text-[8px] font-black uppercase tracking-widest text-amber-300 bg-black/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                        Bespoke
                      </span>
                    </div>
                  </div>
                </div>
                {/* Caption bar */}
                <div className="relative flex items-center justify-between px-3 py-2 bg-black/40 backdrop-blur-sm border-t border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Atelier Collection</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Sparkles size={10} aria-hidden="true" />
                    Made to Measure
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Trust Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/10 text-left"
            >
              <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 min-w-0">
                <Scissors size={16} className="text-amber-400 shrink-0 hidden xs:block sm:block" aria-hidden="true" />
                <div className="min-w-0">
                  <h4 className="font-black text-[9px] sm:text-xs uppercase tracking-wider text-white leading-tight">Made to Measure</h4>
                  <p className="text-[8px] sm:text-[11px] text-gray-400 leading-tight hidden xs:block">Custom fit</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 min-w-0">
                <Award size={16} className="text-blue-400 shrink-0 hidden xs:block sm:block" aria-hidden="true" />
                <div className="min-w-0">
                  <h4 className="font-black text-[9px] sm:text-xs uppercase tracking-wider text-white leading-tight">Master Tailoring</h4>
                  <p className="text-[8px] sm:text-[11px] text-gray-400 leading-tight hidden xs:block">Expert craft</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 min-w-0">
                <MapPin size={16} className="text-emerald-400 shrink-0 hidden xs:block sm:block" aria-hidden="true" />
                <div className="min-w-0">
                  <h4 className="font-black text-[9px] sm:text-xs uppercase tracking-wider text-white leading-tight">Jemba Plaza</h4>
                  <p className="text-[8px] sm:text-[11px] text-gray-400 leading-tight hidden xs:block">Central Kampala</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Showcase — desktop only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Outer Golden Glow Ring */}
              <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-amber-400/30 via-transparent to-blue-500/20 blur-xl opacity-70" aria-hidden="true" />

              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/15 bg-gradient-to-b from-[#121733] to-[#0A0D1F] p-4 shadow-2xl">
                {/* Featured Showcase Image */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-inner">
                  <Image
                    src="/images/womens_wear_1.jpg"
                    alt="Lycaronz Designs Haute Couture – Bespoke African fashion"
                    fill
                    sizes="(max-width: 1280px) 40vw, 450px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D1F] via-transparent to-transparent opacity-80" aria-hidden="true" />

                  {/* Floating Pill on Image */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-[#0A0D1F]/90 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                      <Sparkles size={12} className="text-amber-400" aria-hidden="true" />
                      Signature Collection
                    </span>
                  </div>

                  {/* Bottom Image Tag */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 mb-0.5">Featured Atelier Piece</p>
                    <h3 className="font-black text-base uppercase tracking-tight">Red Ankara Wrap Dress</h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-xs">
                      <span className="text-gray-300">Custom Order</span>
                      <span className="font-bold text-amber-400">UGX 250,000</span>
                    </div>
                  </div>
                </div>

                {/* Micro Guarantee Tag */}
                <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-amber-400" aria-hidden="true" />
                    Custom Fitted
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-amber-400" aria-hidden="true" />
                    Kampala Delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-amber-400" aria-hidden="true" />
                    Express Alterations
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
