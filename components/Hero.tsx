'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight, Calendar, MessageCircle, ShieldCheck, Scissors, Award } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Hero() {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to inquire about bespoke tailoring and custom orders.'
  )}`;

  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden bg-[#0A0D1F] text-white">
      {/* Dynamic atmospheric luxury backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-primary/30 rounded-full blur-[110px] opacity-70"></div>
        <div className="absolute top-1/3 -right-24 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-500/20 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute -bottom-24 left-1/4 w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] bg-indigo-600/20 rounded-full blur-[100px] opacity-50"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center px-2 sm:px-4">
          {/* Top Pill Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs sm:text-sm font-black tracking-widest uppercase shadow-lg shadow-black/20"
          >
            <Sparkles size={16} className="text-amber-400 animate-pulse shrink-0" />
            <span>Kampala&apos;s Premier Fashion &amp; Bespoke Atelier</span>
          </motion.div>
          
          {/* Brand Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black mb-6 leading-[0.95] tracking-tight text-white drop-shadow-sm"
          >
            LYCARONZ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
              DESIGNS
            </span>
          </motion.h1>
          
          {/* Tagline / Value Proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-10 font-medium leading-relaxed max-w-2xl mx-auto px-2"
          >
            Bespoke African couture, immaculate tailored suits, and breathtaking bridal gowns.
            Sculpted with passion for a signature, flattering fit.
          </motion.p>
          
          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto mb-12 sm:mb-16"
          >
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-black text-sm sm:text-base uppercase tracking-widest shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </Link>
            <Link 
              href="/book-appointment" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-black text-sm sm:text-base uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              <Calendar size={18} className="text-amber-400" />
              <span>Book Appointment</span>
            </Link>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-black text-sm sm:text-base uppercase tracking-widest active:scale-95 transition-all duration-300"
            >
              <MessageCircle size={18} />
              <span>WhatsApp Us</span>
            </a>
          </motion.div>

          {/* Trust Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-white/10 text-left"
          >
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Scissors size={20} />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-white">Bespoke Fit</h4>
                <p className="text-xs text-gray-400">Custom tailored to measurements</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-blue-400 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-white">Master Artisans</h4>
                <p className="text-xs text-gray-400">Premium fabric &amp; craftsmanship</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-white">Jemba Plaza Atelier</h4>
                <p className="text-xs text-gray-400">Centrally located in Kampala</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
