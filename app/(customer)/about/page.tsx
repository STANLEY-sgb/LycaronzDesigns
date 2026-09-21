'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  Scissors, 
  Ruler, 
  Heart, 
  Clock, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export default function AboutPage() {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to learn more about your atelier and tailoring services.'
  )}`;

  const pillars = [
    {
      title: 'Haute Craftsmanship',
      desc: 'Every stitch, seam, and contour is executed by master artisans who have perfected tailoring for decades.',
      icon: <Scissors size={24} className="text-amber-400" />,
    },
    {
      title: 'Flattering Silhouette',
      desc: 'We engineer patterns tailored specifically to your body proportions for unmatched comfort and poise.',
      icon: <Ruler size={24} className="text-blue-400" />,
    },
    {
      title: 'Premium Textiles',
      desc: 'From vibrant high-grade African wax prints to Italian wools and bridal laces, we only select quality materials.',
      icon: <Sparkles size={24} className="text-amber-400" />,
    },
    {
      title: 'Client Devotion',
      desc: 'From initial design sketch to final fitting at Jemba Plaza, your absolute satisfaction is our masterwork.',
      icon: <Heart size={24} className="text-rose-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-[#0A0D1F] text-white pt-24 xs:pt-28 sm:pt-36 pb-14 sm:pb-20 px-3 xs:px-4 relative overflow-hidden border-b border-amber-500/20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <Logo size="lg" className="mx-auto mb-5" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 font-black text-xs uppercase tracking-widest mb-3 border border-amber-400/30">
            <Sparkles size={14} className="text-amber-400" />
            <span>Heritage &amp; Craft</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-6xl font-black tracking-tight mb-4 text-white">
            ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">LYCARONZ DESIGNS</span>
          </h1>
          <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto font-medium leading-relaxed">
            Founded with an uncompromising passion for style and fit, LYCARONZ DESIGNS transforms luxury African fabrics and bespoke suiting into timeless haute couture.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container-custom py-12 sm:py-20 flex-grow">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] uppercase tracking-widest border border-amber-200">
              <span>Our Story &amp; Vision</span>
            </div>
            
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight uppercase">
              Crafting Confidence Through Precision Tailoring
            </h2>

            <div className="space-y-4 text-xs sm:text-base text-gray-600 leading-relaxed font-medium">
              <p>
                Located in central Kampala at <strong className="text-gray-900">Jemba Plaza</strong>, just after the Old Taxi Park, LYCARONZ DESIGNS is a dedicated fashion house that bridges the richness of African heritage with contemporary couture silhouettes.
              </p>
              <p>
                What began as a devoted bespoke studio has grown into one of Kampala’s premier destinations for custom African Ankara gowns, impeccably structured men’s suits, and bespoke wedding dress alterations.
              </p>
              <p>
                We believe that clothing is not merely fabric stitched together—it is armor, expression, and individuality. Whether you are stepping into a high-stakes boardroom, walking down the aisle, or attending a prestigious gala, our garments are sculpted to make you feel formidable and exquisite.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="/products" className="btn-gold">
                <span>View Collection</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/book-appointment" className="btn-dark">
                <Clock size={16} className="text-amber-400" />
                <span>Book Fitting Session</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <Image
                src="/images/boutique_interior.png"
                alt="LYCARONZ DESIGNS Atelier Interior — Jemba Plaza, Kampala"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 42vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D1F] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block mb-0.5">
                  Atelier Heritage
                </span>
                <h4 className="font-black text-lg">Jemba Plaza, Kampala</h4>
                <p className="text-xs text-gray-300 mt-1">Master tailoring, bespoke fittings &amp; garment care</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pillars / Values Section */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block mb-1">
              Atelier Standards
            </span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
              The Four Pillars of Lycaronz
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-amber-400/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="font-black text-base text-gray-900 mb-2 uppercase tracking-tight">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Banner */}
        <div className="p-8 sm:p-14 rounded-3xl bg-[#0A0D1F] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-white/10">
          <div className="text-center md:text-left space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
              Personalized Tailoring Experience
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">Ready for a Tailoring Session?</h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Visit our Jemba Plaza studio or chat with our styling directors on WhatsApp to begin creating your signature garment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link href="/book-appointment" className="btn-gold text-center">
              <span>Book Appointment</span>
            </Link>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all text-center"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
