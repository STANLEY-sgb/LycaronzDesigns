import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col selection:bg-amber-400 selection:text-black">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-20 px-4">
        <div className="container-custom max-w-2xl mx-auto text-center">
          {/* Circular Luxury Emblem */}
          <div className="flex justify-center mb-6">
            <Logo size="lg" priority />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0D1F] text-amber-300 font-black text-xs uppercase tracking-widest mb-4 border border-amber-400/30">
            <Sparkles size={14} className="text-amber-400" />
            <span>404 &bull; Page Not Found</span>
          </div>

          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight mb-4 leading-tight">
            This Silhouette Does Not Exist
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed font-medium">
            The page or atelier creation you are looking for may have been moved, updated, or does not exist. Let us guide you back to our bespoke collection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/"
              className="w-full sm:w-auto btn-gold px-8 py-3.5 text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <span>Return Home</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto btn-dark px-8 py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Compass size={16} />
              <span>Explore Collections</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
