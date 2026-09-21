'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, ChevronRight, Star, Clock, Play, X, Sparkles, ArrowRight } from 'lucide-react';
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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<{ src: string; label: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products?featured=true');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setFeaturedProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const marqueeTexts = [
    "Lycaronz Bespoke Craftsmanship",
    "Custom African Ankara Couture",
    "Tailored Corporate Elegance",
    "Bridal Gowns & Alterations",
    "Perfect Silhouette Guarantee",
    "Jemba Plaza Atelier, Kampala",
  ];

  const videos = [
    { 
      src: "/videos/ankara-styles.mp4", 
      label: "Ankara Elegance", 
      desc: "Vibrant African prints tailored for high-profile galas & celebrations",
      poster: "/images/womens_wear_1.jpg"
    },
    { 
      src: "/videos/wedding-dresses.mp4", 
      label: "Bridal Dreams", 
      desc: "Sculpted wedding dresses & bespoke detachable bridal trains",
      poster: "/images/wed.png"
    },
    { 
      src: "/videos/office-wears.mp4", 
      label: "Corporate Class", 
      desc: "Sharp modern blazers and sharp work silhouettes",
      poster: "/images/womens_wear_5.jpg"
    }
  ];

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I would like to get a quote and discuss custom designs.'
  )}`;

  return (
    <div className="overflow-x-hidden bg-white min-h-screen flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Luxury Ticker / Marquee Section */}
      <div className="bg-[#0A0D1F] py-3.5 sm:py-4 overflow-hidden whitespace-nowrap border-y border-white/10 relative z-10 shadow-lg">
        <div className="animate-marquee flex gap-8 sm:gap-14 items-center">
          {[...marqueeTexts, ...marqueeTexts].map((text, i) => (
            <span key={i} className="text-gray-200 font-black text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center gap-3">
              <Star className="text-amber-400 fill-amber-400" size={14} />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Video / Style Inspiration Showcase */}
      <section className="py-16 sm:py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest mb-3">
              <Sparkles size={14} />
              <span>Couture In Motion</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
              STYLE <span className="text-primary">INSPIRATION</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 font-medium">
              Witness the art of bespoke African fashion and couture craftsmanship in real motion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {videos.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedVideo(item)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-900 aspect-[9/14] cursor-pointer transform hover:-translate-y-1.5"
              >
                {/* Video element with preload none to ensure fast page load & zero freezes */}
                <video 
                  src={item.src} 
                  preload="metadata"
                  muted 
                  playsInline
                  loop
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/90 text-gray-900 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-300">
                    <Play size={22} className="ml-1 fill-gray-900" />
                  </div>
                  <h3 className="text-white font-black text-xl sm:text-2xl tracking-tight mb-1">{item.label}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-2">{item.desc}</p>
                  <span className="text-amber-300 text-xs font-black uppercase tracking-widest mt-3 flex items-center gap-1">
                    <span>Watch Video</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
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
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="relative max-w-lg w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                aria-label="Close video"
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-black hover:text-black flex items-center justify-center backdrop-blur-md transition-all"
              >
                <X size={20} className="text-white hover:text-black" />
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

              <div className="p-5 bg-gray-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-black text-lg">{selectedVideo.label}</h4>
                  <p className="text-xs text-gray-400">Lycaronz Designs Masterpiece</p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setSelectedVideo(null)}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-gray-900 font-bold text-xs uppercase tracking-wider"
                >
                  Order Style
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Products / New Arrivals */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] uppercase tracking-widest mb-2">
                <Sparkles size={12} className="text-amber-600" />
                <span>Handcrafted Collection</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                FEATURED <span className="text-primary">CREATIONS</span>
              </h2>
            </div>
            <Link 
              href="/products" 
              className="group inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest hover:text-blue-700 transition-colors"
            >
              <span>View Full Catalog</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[420px] rounded-3xl bg-gray-100 animate-pulse border border-gray-200" />
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-gray-400 font-bold text-lg bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                Explore our full catalog to discover our current pieces.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp Quote Banner */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-[#128C7E] to-[#075E54] text-white relative overflow-hidden">
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mx-auto mb-6 shadow-xl border border-white/20">
            <MessageCircle size={36} />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
            Have a Specific Design in Mind?
          </h2>
          <p className="text-sm sm:text-lg text-white/90 font-medium mb-8 leading-relaxed px-2">
            Send us a photo, sketch, or styling idea on WhatsApp. Our master tailors will review your measurements and provide an instant custom quote.
          </p>
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white text-[#075E54] px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-base uppercase tracking-widest hover:bg-amber-300 hover:text-black transition-all shadow-2xl active:scale-95"
          >
            <MessageCircle size={24} />
            <span>Chat on WhatsApp Now</span>
          </a>
        </div>
      </section>

      {/* Atelier & Location Section */}
      <section className="py-16 sm:py-24 px-4 bg-[#0A0D1F] text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 font-bold text-xs uppercase tracking-widest mb-3 border border-amber-400/20">
                <span>Visit Our Atelier</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">
                VISIT US AT <span className="text-amber-400">JEMBA PLAZA</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-300 mb-8 font-medium leading-relaxed">
                Step into our boutique in central Kampala for bespoke fittings, fabric selections, and styling consultations.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <MapPin className="text-amber-400 shrink-0 mt-1" size={22} />
                  <div>
                    <h4 className="font-black uppercase tracking-wider text-xs text-amber-300 mb-0.5">Location</h4>
                    <p className="text-sm sm:text-base font-bold text-white">{BUSINESS_INFO.location}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <Phone className="text-blue-400 shrink-0 mt-1" size={22} />
                  <div>
                    <h4 className="font-black uppercase tracking-wider text-xs text-blue-300 mb-0.5">Direct Call</h4>
                    <p className="text-sm sm:text-base font-bold text-white">
                      <a href={`tel:${BUSINESS_INFO.primaryPhoneRaw}`} className="hover:underline">
                        {BUSINESS_INFO.primaryPhone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <Clock className="text-emerald-400 shrink-0 mt-1" size={22} />
                  <div>
                    <h4 className="font-black uppercase tracking-wider text-xs text-emerald-300 mb-0.5">Working Hours</h4>
                    <p className="text-sm sm:text-base font-bold text-white">Monday &ndash; Saturday: 8:00 AM &ndash; 7:00 PM</p>
                    <p className="text-xs text-gray-400">Sunday: Closed for Atelier Design</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-[340px] sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
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
