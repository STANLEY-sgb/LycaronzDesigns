'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number | null;
  image?: string | null;
  imageUrl?: string | null;
  category: string;
  description?: string | null;
  video?: string | null;
  featured?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  imageUrl,
  category,
}: ProductCardProps) {
  const selectedMedia = imageUrl || image || '';
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:border-amber-400/30 transition-all duration-500 flex flex-col h-full"
    >
      <Link href={`/product/${id}`} className="block relative aspect-[4/5] bg-[#0A0D1F]/5 overflow-hidden">
        {selectedMedia && !imgError ? (
          <Image
            src={selectedMedia}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-primary/10 via-slate-100 to-amber-50">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-primary font-black text-2xl mb-3">
              LD
            </div>
            <span className="font-black text-gray-500 uppercase tracking-widest text-xs">{name}</span>
          </div>
        )}

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0A0D1F] font-black text-[10px] uppercase tracking-[0.2em] shadow-md border border-gray-100 flex items-center gap-1">
            <Sparkles size={10} className="text-amber-500" />
            {category}
          </span>
        </div>

        {/* Quick View Floating Pill on Hover */}
        <div className="absolute bottom-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="px-3.5 py-1.5 rounded-xl bg-white text-gray-900 font-bold text-xs shadow-xl flex items-center gap-1.5">
            <span>View Details</span>
            <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
        <div>
          <Link href={`/product/${id}`}>
            <h3 className="font-black text-base sm:text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight mb-2">
              {name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Price
            </span>
            <span className="text-primary font-black text-base sm:text-lg tracking-tight">
              {price && price > 0 ? `UGX ${price.toLocaleString()}` : 'Custom Quote'}
            </span>
          </div>

          <Link
            href={`/product/${id}`}
            aria-label={`View ${name} details`}
            className="w-10 h-10 rounded-xl bg-gray-900 group-hover:bg-primary flex items-center justify-center text-white transition-all shadow-md active:scale-95"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
