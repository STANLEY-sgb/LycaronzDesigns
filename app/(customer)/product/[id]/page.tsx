'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  MessageCircle, 
  ChevronLeft, 
  Star, 
  Clock, 
  Share2, 
  Ruler, 
  X, 
  Sparkles, 
  Send, 
  Loader2 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS_INFO } from '@/lib/constants';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  imageUrl: string | null;
  video: string | null;
  featured: boolean;
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping'>('description');
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideGender, setSizeGuideGender] = useState<'women' | 'men'>('women');
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProduct(data);

          // Fetch related products in the same category
          const relRes = await fetch(`/api/products?category=${encodeURIComponent(data.category)}`, { cache: 'no-store' });
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedProducts(relData.filter((p: Product) => p.id !== data.id).slice(0, 3));
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'LYCARONZ DESIGNS Piece',
          text: `Check out ${product?.name} from LYCARONZ DESIGNS Haute Couture!`,
          url,
        });
        return;
      } catch {
        // user cancelled or share failed, fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success('Product link copied to clipboard!');
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone) {
      toast.error('Please provide your name and phone number.');
      return;
    }

    setIsOrdering(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product?.id, ...orderForm }),
      });
      if (res.ok) {
        toast.success('Inquiry submitted! Our master atelier will contact you shortly.');
        setIsOrderOpen(false);
        setOrderForm({ name: '', email: '', phone: '', message: '' });
      } else {
        const err = await res.json();
        toast.error(err?.error || 'Failed to send inquiry.');
      }
    } catch {
      toast.error('Network error. Please try again or chat with us on WhatsApp.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-amber-500" size={44} />
          <span className="text-xs font-black uppercase tracking-widest text-gray-500">Loading Atelier Piece...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] px-4 pt-28">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-black text-gray-900 mb-3 uppercase tracking-tight">Piece Not Found</h1>
            <p className="text-gray-500 text-sm mb-6 font-medium">The garment you are looking for is currently unavailable or has been archived.</p>
            <Link href="/products" className="btn-dark">
              Explore Collection
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formattedPrice = product.price && product.price > 0 
    ? `UGX ${product.price.toLocaleString()}` 
    : 'Custom Quote';

  const whatsappLink = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    `Hello Lycaronz Designs! I am interested in "${product.name}" (${formattedPrice}). Could you please share details on bespoke fitting & ordering?`
  )}`;

  return (
    <div className="bg-[#FAF8F5] min-h-screen flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      <main className="pt-24 xs:pt-28 sm:pt-36 pb-20 flex-grow">
        <div className="container-custom">
          {/* Breadcrumbs Navigation */}
          <div className="mb-6 sm:mb-8">
            <Link 
              href="/products" 
              className="group inline-flex items-center gap-1.5 text-gray-500 hover:text-amber-600 transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Collection</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* Left Column: Media Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-5"
            >
              {/* Primary Image Frame */}
              <div className="relative aspect-[4/5] rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl bg-white border border-gray-200/80 group">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-100">
                    <ShoppingBag size={80} className="text-gray-300 mb-3" />
                    <span className="font-black text-gray-400 uppercase tracking-widest text-xs">{product.name}</span>
                  </div>
                )}
                
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-[#0A0D1F]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/40 shadow-lg">
                    <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      Featured Atelier Piece
                    </span>
                  </div>
                )}

                <button 
                  onClick={handleShare}
                  aria-label="Share this garment"
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white text-gray-900 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all active:scale-95"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Optional Video Preview */}
              {product.video && (
                <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-black border border-white/10 group">
                  <video 
                    src={product.video} 
                    poster={product.imageUrl || undefined}
                    preload="metadata"
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                  <div className="absolute top-3 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                    Motion Showcase
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column: Garment Information & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-6 flex flex-col"
            >
              {/* Category Pill */}
              <div className="mb-3">
                <span className="px-3.5 py-1.5 bg-[#0A0D1F] text-amber-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-amber-400/30">
                  {product.category}
                </span>
              </div>
              
              {/* Product Title */}
              <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 uppercase leading-[0.95] tracking-tight">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 pb-6 border-b border-gray-200">
                <p className="text-2xl sm:text-4xl font-black text-gray-950">
                  {formattedPrice}
                </p>
                <div className="h-6 w-[1px] bg-gray-300 hidden sm:block" />
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} className="fill-amber-400" />
                  ))}
                  <span className="text-gray-500 text-xs font-bold ml-1.5">Master Tailoring</span>
                </div>
              </div>

              {/* Information Tabs */}
              <div className="flex border-b border-gray-200 mb-6 gap-2">
                {([
                  { id: 'description', label: 'Description' },
                  { id: 'specifications', label: 'Craft & Fabric' },
                  { id: 'shipping', label: 'Atelier Delivery' },
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-3 sm:px-4 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all relative ${
                      activeTab === tab.id 
                        ? 'text-gray-950 font-black' 
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="productTabIndicator" 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" 
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content Display */}
              <div className="mb-8 min-h-[90px]">
                {activeTab === 'description' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                    {product.description || "Each LYCARONZ DESIGNS garment is handcrafted with precision, balance, and utmost care to ensure a flattering signature silhouette."}
                  </motion.p>
                )}
                {activeTab === 'specifications' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Origin', value: 'Jemba Plaza, Kampala' },
                      { label: 'Fabric Type', value: 'Premium Grade Textiles' },
                      { label: 'Construction', value: 'Bespoke Hand-Stitched' },
                      { label: 'Fit Silhouette', value: 'Tailored to Measurements' }
                    ].map((spec) => (
                      <div key={spec.label} className="p-3 bg-white border border-gray-200/80 rounded-xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">{spec.value}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'shipping' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
                    Standard delivery within Kampala available in 1-2 business days. For bespoke custom tailored orders, please allow 5-10 business days for complete crafting and final fitting. Pickup and fitting sessions are welcomed directly at Jemba Plaza Atelier.
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsOrderOpen(true)}
                    className="btn-gold py-4 text-xs sm:text-sm"
                  >
                    <ShoppingBag size={18} />
                    <span>Order / Inquire Now</span>
                  </button>

                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all text-center"
                  >
                    <MessageCircle size={18} />
                    <span>Order on WhatsApp</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link 
                    href="/book-appointment" 
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-900 font-black text-[11px] sm:text-xs uppercase tracking-widest hover:border-amber-400 transition-all text-center"
                  >
                    <Clock size={16} className="text-amber-500" />
                    <span>Book Fitting</span>
                  </Link>

                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-900 font-black text-[11px] sm:text-xs uppercase tracking-widest hover:border-amber-400 transition-all text-center"
                  >
                    <Ruler size={16} className="text-blue-500" />
                    <span>Size Guide</span>
                  </button>
                </div>
              </div>

              {/* Atelier Trust Features */}
              <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white rounded-xl border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Craft</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">Handcrafted</p>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Delivery</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">Kampala &amp; Beyond</p>
                </div>
                <div className="p-2 bg-white rounded-xl border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Atelier</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">Jemba Plaza</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related / Similar Creations Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 sm:mt-24 pt-12 border-t border-gray-200">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">
                    Matching Atelier Styles
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
                    You May Also Adore
                  </h2>
                </div>
                <Link href="/products" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Buy / Enquire Modal */}
      <AnimatePresence>
        {isOrderOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 xs:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOrderOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
                    Bespoke Inquiry
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                    Order &quot;{product?.name}&quot;
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Our team will contact you to confirm sizing, fabric options, and fitting schedule.
                  </p>
                </div>
                <button 
                  onClick={() => setIsOrderOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                    Full Name *
                  </label>
                  <input 
                    required 
                    value={orderForm.name} 
                    onChange={(e) => setOrderForm({...orderForm, name: e.target.value})} 
                    placeholder="e.g. John Okello" 
                    className="input-field" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input 
                    required 
                    value={orderForm.phone} 
                    onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})} 
                    placeholder="e.g. +256 705 241 179" 
                    className="input-field" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                    Email Address (Optional)
                  </label>
                  <input 
                    type="email"
                    value={orderForm.email} 
                    onChange={(e) => setOrderForm({...orderForm, email: e.target.value})} 
                    placeholder="e.g. name@example.com" 
                    className="input-field" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-1">
                    Custom Requests &amp; Sizing Notes
                  </label>
                  <textarea 
                    value={orderForm.message} 
                    onChange={(e) => setOrderForm({...orderForm, message: e.target.value})} 
                    placeholder="Share any special preferences, height, preferred date for fitting..." 
                    rows={3}
                    className="input-field resize-none" 
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsOrderOpen(false)} 
                    className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isOrdering} 
                    className="btn-gold"
                  >
                    {isOrdering ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Atelier Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 xs:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSizeGuideOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
                    Measurement Chart
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                    LYCARONZ Size Guide
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Standard garment measurements. For custom fit, our tailors measure you in person.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Gender Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                <button
                  onClick={() => setSizeGuideGender('women')}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                    sizeGuideGender === 'women'
                      ? 'bg-white text-gray-950 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Women&apos;s Couture
                </button>
                <button
                  onClick={() => setSizeGuideGender('men')}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                    sizeGuideGender === 'men'
                      ? 'bg-white text-gray-950 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Men&apos;s Suiting
                </button>
              </div>

              {sizeGuideGender === 'women' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Bust (in)</th>
                        <th className="py-2.5 px-3">Waist (in)</th>
                        <th className="py-2.5 px-3">Hips (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      <tr>
                        <td className="py-2.5 px-3 font-bold">Small (S / 8-10)</td>
                        <td className="py-2.5 px-3">34 - 36</td>
                        <td className="py-2.5 px-3">26 - 28</td>
                        <td className="py-2.5 px-3">36 - 38</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">Medium (M / 12-14)</td>
                        <td className="py-2.5 px-3">37 - 39</td>
                        <td className="py-2.5 px-3">29 - 31</td>
                        <td className="py-2.5 px-3">39 - 41</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">Large (L / 16-18)</td>
                        <td className="py-2.5 px-3">40 - 43</td>
                        <td className="py-2.5 px-3">32 - 35</td>
                        <td className="py-2.5 px-3">42 - 45</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">XL (20+)</td>
                        <td className="py-2.5 px-3">44 - 48</td>
                        <td className="py-2.5 px-3">36 - 40</td>
                        <td className="py-2.5 px-3">46 - 50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Suit Size</th>
                        <th className="py-2.5 px-3">Chest (in)</th>
                        <th className="py-2.5 px-3">Waist (in)</th>
                        <th className="py-2.5 px-3">Sleeve (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      <tr>
                        <td className="py-2.5 px-3 font-bold">38 Regular</td>
                        <td className="py-2.5 px-3">38</td>
                        <td className="py-2.5 px-3">32</td>
                        <td className="py-2.5 px-3">33</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">40 Regular</td>
                        <td className="py-2.5 px-3">40</td>
                        <td className="py-2.5 px-3">34</td>
                        <td className="py-2.5 px-3">33.5</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">42 Regular</td>
                        <td className="py-2.5 px-3">42</td>
                        <td className="py-2.5 px-3">36</td>
                        <td className="py-2.5 px-3">34</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">44 Regular</td>
                        <td className="py-2.5 px-3">44</td>
                        <td className="py-2.5 px-3">38</td>
                        <td className="py-2.5 px-3">34.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-3">
                <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Custom Fit Recommendation:</strong> Since all our pieces are bespoke, we recommend booking a quick fitting at Jemba Plaza for complete perfection.
                </p>
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
