'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/lib/constants';
import { Sparkles, Search, SlidersHorizontal, RefreshCw } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        setLoading(true);
        const url = category
          ? `/api/products?category=${encodeURIComponent(category)}`
          : '/api/products';
        const res = await fetch(url);
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

  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Catalog Header */}
      <section className="bg-[#0A0D1F] text-white pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 font-black text-xs uppercase tracking-widest mb-3 border border-white/10">
            <Sparkles size={14} className="text-amber-400" />
            <span>Lycaronz Designs Couture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 text-white">
            THE ATELIER <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">COLLECTION</span>
          </h1>
          <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto font-medium">
            Explore handcrafted dresses, sharp tailored suits, and custom bespoke fashion pieces created to your exact measurements.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container-custom py-8 sm:py-12 flex-grow">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 mb-8 sm:mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles, garments, dresses..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scroll-touch">
              <button
                onClick={() => setCategory('')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  category === ''
                    ? 'bg-[#0A0D1F] text-amber-300 shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Styles
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    category === cat
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] rounded-3xl bg-white border border-gray-100 p-6 flex flex-col justify-between animate-pulse">
                <div className="w-full h-2/3 bg-gray-100 rounded-2xl" />
                <div className="space-y-3 mt-4">
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 p-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <Search size={24} />
            </div>
            <h3 className="font-black text-xl text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              We couldn&apos;t find any items matching your filter. Try adjusting your search query or selecting another category.
            </p>
            <button
              onClick={() => {
                setCategory('');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-primary transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
