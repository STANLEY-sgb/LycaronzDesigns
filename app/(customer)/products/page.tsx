'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Logo from '@/components/Logo';
import { CATEGORIES, BUSINESS_INFO } from '@/lib/constants';
import { Sparkles, Search, SlidersHorizontal, MessageCircle, X } from 'lucide-react';

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        setLoading(true);
        const url = category
          ? `/api/products?category=${encodeURIComponent(category)}`
          : '/api/products';
        const res = await fetch(url, { cache: 'no-store' });
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
  }, [category]);

  const filteredAndSortedProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'featured') {
      list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [products, searchQuery, sortBy]);

  const whatsappInquiryUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    'Hello Lycaronz Designs! I am browsing your collection and would like to ask about a custom order.'
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col overflow-x-hidden w-full max-w-[100vw] selection:bg-amber-400 selection:text-black">
      <Navbar />

      {/* Haute Couture Catalog Header */}
      <section className="bg-[#0A0D1F] text-white pt-24 xs:pt-28 sm:pt-36 pb-10 sm:pb-16 px-3 xs:px-4 relative overflow-hidden border-b border-amber-500/20 w-full">
        <div className="absolute -top-24 -right-24 w-72 xs:w-96 h-72 xs:h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto w-full min-w-0">
          <Logo size="md" className="mx-auto mb-3 xs:mb-4 xs:hidden" />
          <Logo size="lg" className="mx-auto mb-4 hidden xs:block" />
          <div className="inline-flex max-w-full items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 font-black text-[10px] xs:text-xs uppercase tracking-wider xs:tracking-widest mb-3 border border-amber-400/30">
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span className="truncate">Atelier Collection</span>
          </div>
          <h1 className="text-[1.65rem] xs:text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3 text-white leading-[1.05] break-words">
            THE ATELIER <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">COLLECTION</span>
          </h1>
          <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto font-medium px-1">
            Explore handcrafted African couture dresses, razor-sharp suits, and bespoke wedding creations tailored to your exact measurements at Jemba Plaza.
          </p>
        </div>
      </section>

      {/* Main Catalog Content */}
      <main className="container-custom py-6 xs:py-8 sm:py-12 flex-grow w-full min-w-0">
        {/* Search, Filter & Sort Bar */}
        <div className="bg-white p-3 xs:p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/80 mb-6 xs:mb-8 sm:mb-12 w-full min-w-0 max-w-full overflow-hidden">
          <div className="flex flex-col gap-3 xs:gap-4 justify-between items-stretch w-full min-w-0">
            
            {/* Search Input */}
            <div className="relative w-full min-w-0">
              <Search size={18} className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search garments, styles…"
                aria-label="Search collection"
                className="w-full pl-10 xs:pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-base sm:text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Sort & Quick Select */}
            <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
              <label htmlFor="sort-select" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 shrink-0">
                <SlidersHorizontal size={14} className="text-gray-400" aria-hidden="true" />
                <span>Sort</span>
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort products"
                className="flex-1 min-w-0 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base sm:text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400/30 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips — must not expand the page width */}
          <div className="w-full min-w-0 max-w-full overflow-x-auto pt-4 border-t border-gray-100 mt-4 scroll-touch -mx-0">
            <div className="flex items-center gap-2 w-max min-w-full pr-1">
              <button
                onClick={() => setCategory('')}
                className={`px-3 xs:px-3.5 py-2 rounded-xl text-[11px] xs:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                  category === ''
                    ? 'bg-[#0A0D1F] text-amber-300 shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Styles ({products.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 xs:px-3.5 py-2 rounded-xl text-[11px] xs:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                      category === cat
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat} {count > 0 ? `(${count})` : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 xs:mb-6 px-1 text-[11px] xs:text-xs text-gray-500 font-bold w-full min-w-0">
          <span className="min-w-0">Showing {filteredAndSortedProducts.length} handcrafted creation{filteredAndSortedProducts.length === 1 ? '' : 's'}</span>
          {(searchQuery || category) && (
            <button
              onClick={() => {
                setCategory('');
                setSearchQuery('');
              }}
              className="text-amber-700 hover:underline font-black uppercase tracking-wider shrink-0"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-8 w-full min-w-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[320px] xs:h-[360px] sm:h-[400px] rounded-2xl xs:rounded-3xl bg-white border border-gray-200/80 p-4 xs:p-5 flex flex-col justify-between animate-pulse shadow-sm min-w-0">
                <div className="w-full h-2/3 bg-gray-100 rounded-2xl" />
                <div className="space-y-3 mt-4">
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-8 w-full min-w-0">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20 bg-white rounded-3xl border border-dashed border-gray-300 p-5 xs:p-6 sm:p-10 shadow-sm w-full min-w-0">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Search size={24} aria-hidden="true" />
            </div>
            <h3 className="font-black text-lg sm:text-xl text-gray-900 mb-2">No Matching Creations Found</h3>
            <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto mb-6 break-words">
              We couldn&apos;t find items matching &quot;{searchQuery}&quot;. Reset your filters or send us a custom request.
            </p>
            <div className="flex flex-col gap-3 justify-center items-stretch max-w-xs mx-auto w-full">
              <button
                onClick={() => {
                  setCategory('');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-primary transition-colors"
              >
                Reset Filters
              </button>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Custom Order on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Custom Order Bottom Helper Banner */}
        <div className="mt-12 xs:mt-14 sm:mt-20 p-5 xs:p-6 sm:p-10 rounded-2xl xs:rounded-3xl bg-[#0A0D1F] text-white flex flex-col md:flex-row items-center justify-between gap-5 xs:gap-6 shadow-xl border border-white/10 w-full min-w-0">
          <div className="text-center md:text-left min-w-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
              Have a Unique Vision?
            </span>
            <h3 className="text-lg xs:text-xl sm:text-2xl font-black mb-2">Can&apos;t find your exact style?</h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              We tailor custom outfits based on any photo, Pinterest board, or sketch you have in mind.
            </p>
          </div>
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold shrink-0 w-full md:w-auto"
          >
            <MessageCircle size={18} />
            <span>Request Bespoke Quote</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
