'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  MessageCircle, 
  ChevronLeft, 
  Star, 
  Clock, 
  ShieldCheck,
  Play,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS_INFO } from '@/lib/constants';
import { toast } from 'sonner';

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

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Product Not Found</h1>
          <p className="text-gray-500 mb-8 font-medium">The product you are looking for does not exist or has been removed.</p>
          <Link href="/products" className="btn-primary px-10 py-4">Back to Collection</Link>
        </div>
        <Footer />
      </>
    );
  }

  const whatsappLink = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    `Hi Lycaronz Designs! I am interested in "${product.name}"${product.price ? ` (UGX ${product.price.toLocaleString()})` : ''}. Could you provide more details?`
  )}`;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-20 flex-grow">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="mb-10">
            <Link href="/products" className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-bold uppercase tracking-widest text-xs">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Product Media */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 group">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <ShoppingBag size={100} strokeWidth={1} />
                  </div>
                )}
                
                {product.featured && (
                  <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-xl">
                    <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Star size={14} className="fill-primary" />
                      Featured Piece
                    </span>
                  </div>
                )}

                <button className="absolute top-8 right-8 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-xl hover:bg-white transition-all active:scale-90">
                  <Share2 size={20} />
                </button>
              </div>

              {product.video && (
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl bg-black group cursor-pointer">
                  <video 
                    src={product.video} 
                    className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity"
                    controls
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                      <Play size={24} fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <span className="text-white font-black uppercase tracking-widest text-[10px]">Watch Showcase</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col h-full"
            >
              <div className="mb-2">
                <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 uppercase leading-[0.9] tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <p className="text-4xl font-black text-primary">
                  UGX {product.price.toLocaleString()}
                </p>
                <div className="h-8 w-[1px] bg-gray-200"></div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                  <span className="text-gray-400 text-xs font-bold ml-2">(4.9/5 Rating)</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 mb-8">
                {['description', 'specifications', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                      activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mb-12 min-h-[100px]">
                {activeTab === 'description' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-lg leading-relaxed font-medium">
                    {product.description || "No description provided for this exquisite piece. Each Lycaronz Designs garment is handcrafted with precision and care to ensure a perfect fit and timeless style."}
                  </motion.p>
                )}
                {activeTab === 'specifications' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Material', value: 'Premium Fabrics' },
                      { label: 'Technique', value: 'Handcrafted' },
                      { label: 'Origin', value: 'Kampala, Uganda' },
                      { label: 'Style', value: 'Custom Design' }
                    ].map((spec) => (
                      <div key={spec.label} className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{spec.label}</p>
                        <p className="font-bold text-gray-900">{spec.value}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'shipping' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 text-lg leading-relaxed font-medium">
                    We offer standard delivery within Kampala in 1-2 business days. For custom tailoring, please allow 7-14 days for production. Pick up is also available at Jemba Plaza.
                  </motion.p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4 mt-auto">
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setIsOrderOpen(true)}
                    className="w-full btn-primary !bg-[#FF6B6B] !border-[#FF6B6B] py-6 rounded-[2rem] text-xl flex items-center justify-center gap-4 shadow-2xl active:scale-95"
                  >
                    <ShoppingBag size={28} />
                    BUY / ENQUIRE
                  </button>
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-primary !bg-[#25D366] !border-[#25D366] py-6 rounded-[2rem] text-xl flex items-center justify-center gap-4 shadow-2xl active:scale-95"
                  >
                    <MessageCircle size={28} />
                    ORDER ON WHATSAPP
                  </a>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Link 
                      href="/book-appointment" 
                      className="flex items-center justify-center gap-2 py-5 rounded-[2rem] bg-gray-100 text-gray-900 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                    >
                      <Clock size={18} />
                      Book Fitting
                    </Link>
                    <button className="flex items-center justify-center gap-2 py-5 rounded-[2rem] bg-white border border-gray-200 text-gray-900 font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95">
                      <ShieldCheck size={18} />
                      Size Guide
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Modal */}
              {isOrderOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/60" onClick={() => setIsOrderOpen(false)} />
                  <div className="relative w-full max-w-lg bg-white rounded-[2rem] p-8 shadow-2xl">
                    <h3 className="text-2xl font-black mb-4">Buy / Enquire about &quot;{product?.name}&quot;</h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setIsOrdering(true);
                      try {
                        const res = await fetch('/api/orders', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ productId: product?.id, ...orderForm }),
                        });
                        if (res.ok) {
                        await res.json();
                          toast.success('Inquiry sent — we will contact you soon');
                          setIsOrderOpen(false);
                          setOrderForm({ name: '', email: '', phone: '', message: '' });
                        } else {
                          const err = await res.json();
                          toast.error(err?.error || 'Failed to send inquiry');
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error('Network error');
                      } finally {
                        setIsOrdering(false);
                      }
                    }} className="space-y-4">
                      <input required value={orderForm.name} onChange={(e) => setOrderForm({...orderForm, name: e.target.value})} placeholder="Your full name" className="input-field w-full" />
                      <input value={orderForm.email} onChange={(e) => setOrderForm({...orderForm, email: e.target.value})} placeholder="Email (optional)" className="input-field w-full" />
                      <input required value={orderForm.phone} onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})} placeholder="Phone number" className="input-field w-full" />
                      <textarea value={orderForm.message} onChange={(e) => setOrderForm({...orderForm, message: e.target.value})} placeholder="Message / preferences" className="input-field w-full h-24" />
                      <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setIsOrderOpen(false)} className="px-6 py-3 rounded-full bg-gray-100">Cancel</button>
                        <button type="submit" disabled={isOrdering} className="px-6 py-3 rounded-full bg-primary text-white">{isOrdering ? 'Sending...' : 'Send Inquiry'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Security Badges */}
              <div className="mt-10 flex justify-between items-center px-4 py-6 border-y border-gray-100">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Handmade</p>
                  <p className="text-xs font-bold text-gray-900">With Love</p>
                </div>
                <div className="h-8 w-[1px] bg-gray-100"></div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery</p>
                  <p className="text-xs font-bold text-gray-900">Nationwide</p>
                </div>
                <div className="h-8 w-[1px] bg-gray-100"></div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support</p>
                  <p className="text-xs font-bold text-gray-900">24/7 Chat</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
