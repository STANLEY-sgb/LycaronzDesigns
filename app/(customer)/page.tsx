'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  ChevronRight, 
  Star, 
  Clock, 
  Play, 
  X, 
  Sparkles, 
  ArrowRight,
  Scissors,
  Ruler,
  Gem,
  Quote
} from 'lucide-react';
import { BUSINESS_INFO, CATEGORIES } from '@/lib/constants';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVideo, setSelectedVideo] = useState<{ src: string; label: string; desc: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const marqueeTexts = [
    'LYCARONZ DESIGNS HAUTE COUTURE',
    'BESPOKE AFRICAN ANKARA SILHOUETTES',
    'PRECISION MEN\'S TAILORED SUITS',
    'EXQUISITE BRIDAL GOWNS & ALTERATIONS',
    'JEMBA PLAZA ATELIER, KAMPALA',
    'SIGNATURE FLATTERING FIT GUARANTEE',
  ];

  const videos = [
    { 
      src: '/videos/ankara-styles.mp4', 
      label: 'Ankara Elegance', 
      desc: 'Vibrant African prints tailored for galas, traditional weddings & celebrations.',
      poster: '/images/womens_wear_1.jpg'
    },
    { 
      src: '/videos/wedding-dresses.mp4', 
      label: 'Bridal Dreams', 
      desc: 'Sculpted bridal silhouettes, bespoke trains & exquisite bodice alterations.',
      poster: '/images/wed.png'
    },
    { 
      src: '/videos/office-wears.mp4', 
      label: 'Corporate Power Dressing', 
      desc: 'Sharp bespoke blazers, flattering dresses, and tailored luxury workwear.',
      poster: '/images/womens_wear_5.jpg'
    }
  ];

  const bespokeSteps = [
    {
      step: '01',
      title: 'Consultation & Vision',
      desc: 'Share your design concept, inspiration photos, or choose from our signature atelier collections.',
      icon: <Sparkles className="text-amber-400" size={24} />,
    },
    {
      step: '02',
      title: 'Precision Measurements',
      desc: 'Our master tailors take up to 20 precise body measurements to sculpt your individual pattern.',
      icon: <Ruler className="text-blue-400" size={24} />,
    },
    {
      step: '03',
      title: 'Haute Craftsmanship',
      desc: 'Constructed by hand using premium African wax prints, fine silks, wools, and French laces.',
      icon: <Scissors className="text-amber-400" size={24} />,
    },
    {
      step: '04',
      title: 'Final Fitting & Perfection',
      desc: 'A dedicated atelier fitting session to ensure absolute perfection in fit, drape, and poise.',
      icon: <Gem className="text-emerald-400" size={24} />,
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Nabatanzi',
      occasion: 'Executive Gala Gown',
      comment: 'Lycaronz Designs delivered beyond expectation. The Ankara wrap dress was stunning, perfectly structured, and drew compliments all evening!',
      stars: 5,
    },
    {
      name: 'Brian Mugisha',
      occasion: 'Custom 3-Piece Navy Suit',
      comment: 'Finding a tailor in Kampala who understands modern fit without boxiness is hard. Lycaronz nailed the cut on the very first try. 10/10.',
      stars: 5,
    },
    {
      name: 'Grace Atuhaire',
      occasion: 'Bridal Gown Custom Train',
      comment: 'They crafted a custom detachable train for my wedding gown. The craftsmanship was clean and seamless. Truly gifted designers!',
      stars: 5,
    },
  ];

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to get a quote and discuss custom designs.'
  )}`;

  // ─── FIXED: Filter products by selected category tab ─────────────────────
  // Previously: `p.featured || true` always returned true, breaking filtering.
  // Now: 'All' → show all products (featured sorted first), category → exact match.
  const displayedProducts = (() => {
    if (selectedCategory === 'All') {
      // Sort: featured products appear first
      return [...products]
        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        .slice(0, 6);
    }
    return products
      .filter((p) => p.category === selectedCategory)
      .slice(0, 6);
  })();



  return (
    <div className="overflow-x-hidden bg-[#FAF8F5] min-h-screen flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Luxury Ticker / Marquee Section */}
      <div className="bg-[#0A0D1F] py-3 sm:py-3.5 overflow-hidden whitespace-nowrap border-y border-amber-500/20 relative z-10 shadow-lg">
        <div className="pause-on-hover overflow-hidden">
          <div className="animate-marquee flex gap-8 sm:gap-14 items-center">
            {[...marqueeTexts, ...marqueeTexts, ...marqueeTexts, ...marqueeTexts].map((text, i) => (
              <span key={i} className="text-gray-200 font-black text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center gap-3 shrink-0">
                <Star className="text-amber-400 fill-amber-400 shrink-0" size={13} aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Couture In Motion: Video Showcase Section */}
      <section className="py-14 sm:py-20 px-3 xs:px-4 bg-slate-50 relative overflow-hidden">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-700 font-black text-xs uppercase tracking-widest mb-3 border border-amber-400/20">
              <Sparkles size={14} className="text-amber-500" />
              <span>Couture In Motion</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-3">
              STYLE <span className="text-primary">INSPIRATION</span>
            </h2>
            <p className="text-xs sm:text-base text-gray-600 font-medium max-w-xl mx-auto">
              Witness the artistry of bespoke African fashion, tailored bridal gowns, and corporate silhouettes in fluid motion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {videos.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedVideo(item)}
                aria-label={`Watch ${item.label} style video`}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-[#0A0D1F] aspect-[9/14] cursor-pointer hover:-translate-y-1.5 border border-gray-200/50 w-full text-left"
              >
                {/* Poster image — loads immediately, no video preloading */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                  style={{ backgroundImage: `url(${item.poster})` }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-7">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:bg-amber-300 transition-all duration-300">
                    <Play size={20} className="ml-1 fill-gray-950" aria-hidden="true" />
                  </div>
                  <h3 className="text-white font-black text-lg sm:text-xl tracking-tight mb-1">{item.label}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">{item.desc}</p>
                  <span className="text-amber-300 text-[11px] sm:text-xs font-black uppercase tracking-widest mt-3 flex items-center gap-1">
                    <span>Watch Style Video</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Playing: ${selectedVideo.label}`}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 xs:p-4"
            onClick={() => setSelectedVideo(null)}
            onKeyDown={(e) => e.key === 'Escape' && setSelectedVideo(null)}
          >
            <div
              className="relative max-w-md w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                aria-label="Close video player"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
              >
                <X size={20} aria-hidden="true" />
              </button>

              <div className="aspect-[9/16] w-full bg-black">
                <video
                  src={selectedVideo.src}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 sm:p-5 bg-[#0A0D1F] text-white flex items-center justify-between gap-3 border-t border-white/10">
                <div className="min-w-0">
                  <h4 className="font-black text-sm sm:text-base truncate">{selectedVideo.label}</h4>
                  <p className="text-[11px] text-gray-400">LYCARONZ DESIGNS Couture</p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setSelectedVideo(null)}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-gray-950 font-bold text-xs uppercase tracking-wider shrink-0 hover:bg-amber-300 transition-colors"
                >
                  Order Style
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Atelier Collection */}
      <section className="py-14 sm:py-24 px-3 xs:px-4 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] uppercase tracking-widest mb-2 border border-amber-200">
                <Sparkles size={12} className="text-amber-600" />
                <span>Handcrafted Gallery</span>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                FEATURED <span className="text-primary">COLLECTIONS</span>
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full scroll-touch" role="group" aria-label="Filter by category">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-label={`Show ${cat} products`}
                  aria-pressed={selectedCategory === cat}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#0A0D1F] text-amber-300 shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-gray-100 animate-pulse border border-gray-200" />
              ))
            ) : displayedProducts.length > 0 ? (
              displayedProducts.map((product: Product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-gray-400 font-bold text-sm bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                No items found for this category. Check out our full catalog.
              </div>
            )}
          </div>

          {/* View Full Collection Button */}
          <div className="mt-10 sm:mt-14 text-center">
            <Link 
              href="/products"
              className="btn-dark"
            >
              <span>View Full Atelier Catalog ({products.length} Pieces)</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* The Bespoke Atelier Process ("How It Works") */}
      <section className="py-14 sm:py-24 px-3 xs:px-4 bg-[#0A0D1F] text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 font-black text-xs uppercase tracking-widest mb-3 border border-white/10">
              <Sparkles size={14} className="text-amber-400" />
              <span>The Atelier Experience</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-5xl font-black tracking-tight mb-3">
              HOW BESPOKE <span className="text-amber-400">WORKS</span>
            </h2>
            <p className="text-xs sm:text-base text-gray-300 font-medium">
              Every LYCARONZ garment is a labor of love, precision measurements, and master tailoring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bespokeSteps.map((item, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/10 hover:border-amber-400/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-black text-amber-400/40">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-black text-base sm:text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <Link 
              href="/book-appointment" 
              className="btn-gold"
            >
              <span>Book Your Fitting Session</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Praise / Testimonials */}
      <section className="py-14 sm:py-24 px-3 xs:px-4 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] uppercase tracking-widest mb-2 border border-amber-200">
              <Star size={12} className="text-amber-600 fill-amber-600" />
              <span>Client Satisfaction</span>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
              WORDS FROM <span className="text-primary">OUR CLIENTS</span>
            </h2>
            <p className="text-xs sm:text-base text-gray-600 font-medium">
              Loved by brides, corporate leaders, and fashion lovers across Kampala.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-gray-200/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400" />
                    ))}
                  </div>
                  <Quote size={28} className="text-gray-300 mb-3" />
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium mb-6">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200/60">
                  <h4 className="font-black text-sm text-gray-900">{t.name}</h4>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">{t.occasion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Custom Quote Concierge Banner */}
      <section className="py-14 sm:py-20 px-3 xs:px-4 bg-gradient-to-br from-[#128C7E] to-[#075E54] text-white relative overflow-hidden">
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mx-auto mb-5 sm:mb-6 shadow-xl border border-white/20">
            <MessageCircle size={32} />
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-black mb-3 sm:mb-4 tracking-tight">
            Have a Specific Design in Mind?
          </h2>
          <p className="text-xs sm:text-base text-white/90 font-medium mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto">
            Send us your dream dress photo, sketch, or fabric concept on WhatsApp. Our master designers will review your style and give you an instant quote.
          </p>
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-white text-[#075E54] px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-amber-300 hover:text-gray-950 transition-all shadow-xl active:scale-95"
          >
            <MessageCircle size={20} />
            <span>Chat on WhatsApp Concierge</span>
          </a>
        </div>
      </section>

      {/* Atelier Location & Visit Section */}
      <section className="py-14 sm:py-24 px-3 xs:px-4 bg-[#0A0D1F] text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 font-bold text-xs uppercase tracking-widest mb-3 border border-amber-400/20">
                <span>Central Kampala Atelier</span>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-5xl font-black mb-5 tracking-tight">
                VISIT US AT <span className="text-amber-400">JEMBA PLAZA</span>
              </h2>
              <p className="text-xs sm:text-base text-gray-300 mb-6 sm:mb-8 font-medium leading-relaxed">
                Step into our atelier just after the Old Taxi Park in central Kampala for custom fittings, fabric previews, and personal consultations.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-3 sm:gap-4 items-start p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10">
                  <MapPin className="text-amber-400 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-black uppercase tracking-wider text-[11px] text-amber-300 mb-0.5">Location</h4>
                    <p className="text-xs sm:text-sm font-bold text-white">{BUSINESS_INFO.location}</p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 items-start p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10">
                  <Phone className="text-blue-400 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-black uppercase tracking-wider text-[11px] text-blue-300 mb-0.5">Direct Calling Lines</h4>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      <a href={`tel:${BUSINESS_INFO.primaryPhoneRaw}`} className="hover:underline">
                        {BUSINESS_INFO.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 items-start p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10">
                  <Clock className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-black uppercase tracking-wider text-[11px] text-emerald-300 mb-0.5">Atelier Hours</h4>
                    <p className="text-xs sm:text-sm font-bold text-white">{BUSINESS_INFO.workingHours}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Sunday: Closed for bespoke design crafting</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-[300px] xs:h-[340px] sm:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.757833005838!2d32.57688137496426!3d0.3129189996840003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb943d63b2f9%3A0x6d9f6f6f6f6f6f6f!2sJemba%20Plaza!5e0!3m2!1sen!2sug!4v1714500000000!5m2!1sen!2sug" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                title="Lycaronz Designs Atelier Map"
                className="w-full h-full filter contrast-125"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
